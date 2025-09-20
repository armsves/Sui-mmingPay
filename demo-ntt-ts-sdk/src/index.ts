import {
    TransactionId,
    Wormhole,
    amount,
    signSendWait,
  } from "@wormhole-foundation/sdk";
  import evm from "@wormhole-foundation/sdk/platforms/evm";
  import sui from "@wormhole-foundation/sdk/platforms/sui";
  
  // register protocol implementations
  import "@wormhole-foundation/sdk-evm-ntt";
  import "@wormhole-foundation/sdk-sui-ntt";
  import { TEST_NTT_TOKENS } from "./utils/const";
  import { getSigner } from "./utils/helpers";


  (async function () {
    const wh = new Wormhole("Testnet", [evm.Platform, sui.Platform], {});
    const src = wh.getChain("Sui");
    const dst = wh.getChain("Sepolia");

    const srcSigner = await getSigner(src);
    const dstSigner = await getSigner(dst);

    const srcNtt = await src.getProtocol("Ntt", {
      ntt: TEST_NTT_TOKENS[src.chain],
    });
    const dstNtt = await dst.getProtocol("Ntt", {
      ntt: TEST_NTT_TOKENS[dst.chain],
    });

    const amt = amount.units(
      amount.parse("1.32", await srcNtt.getTokenDecimals())
    );

    // Check sender's Sui object ownership and balance
    if (TEST_NTT_TOKENS.Sui) {
      const { SuiClient } = await import('@mysten/sui/client');
      const rpcUrl = 'https://fullnode.testnet.sui.io:443';
      const suiClient = new SuiClient({ url: rpcUrl });
      const senderAddress = srcSigner.address.address.toString();
      const coinType = TEST_NTT_TOKENS.Sui.token;
      const managerObjectId = TEST_NTT_TOKENS.Sui.manager;
      try {
        // List all coin objects of type MY_COIN for the sender
        const coinsList = await suiClient.getCoins({ owner: senderAddress, coinType });
        if (!coinsList.data.length) {
          console.error('❌ Sender does NOT own any MY_COIN objects.');
        } else {
          console.log(`MY_COIN objects owned by sender:`, coinsList.data.map(c => c.coinObjectId));
        }
        // Check balance
        const totalBalance = coinsList.data.reduce((sum, c) => sum + BigInt(c.balance), 0n);
        console.log(`Total MY_COIN balance: ${totalBalance}`);
        if (totalBalance < amt) {
          console.error('❌ Sender does NOT have enough MY_COIN balance for the transfer.');
        }
        // Check manager ownership
        const managerRes = await suiClient.getObject({
          id: managerObjectId,
          options: { showOwner: true, showType: true, showContent: true }
        });
        let managerOwner = '';
        if (managerRes.data?.owner) {
          if (typeof managerRes.data.owner === 'string') managerOwner = managerRes.data.owner;
          else if ('AddressOwner' in managerRes.data.owner) managerOwner = managerRes.data.owner.AddressOwner;
          else if ('ObjectOwner' in managerRes.data.owner) managerOwner = managerRes.data.owner.ObjectOwner;
          else managerOwner = JSON.stringify(managerRes.data.owner);
        }
        console.log(`Manager object owner: ${managerOwner}`);
        console.log(`Sender address: ${senderAddress}`);
        const isShared = managerRes.data?.owner && typeof managerRes.data.owner === 'object' && 'Shared' in managerRes.data.owner;
        if (managerOwner !== senderAddress && !isShared) {
          console.error('❌ Sender does NOT own the Manager object and it is not shared.');
        }
          // Additional: Check dynamic fields for manager object (or any other Sui object)
          let hasRequiredDynamicFields = false;
          if (
            managerRes.data?.content?.dataType === "moveObject" &&
            managerRes.data.content.fields &&
            typeof managerRes.data.content.fields === "object" &&
            "id" in managerRes.data.content.fields
          ) {
            let parentId = (managerRes.data.content.fields as any).id;
            // Ensure parentId is a string
            if (typeof parentId !== 'string') {
              if (parentId?.id && typeof parentId.id === 'string') {
                parentId = parentId.id;
              } else if (typeof parentId?.toString === 'function') {
                parentId = parentId.toString();
              } else {
                console.warn(`Could not extract string parentId from manager object fields.`);
                parentId = undefined;
              }
            }
            if (parentId) {
              try {
                const dynamicFields = await suiClient.getDynamicFields({ parentId });
                if (dynamicFields.data && dynamicFields.data.length > 0) {
                  console.log(`Dynamic fields for manager object:`, dynamicFields.data);
                  hasRequiredDynamicFields = true;
                } else {
                  console.warn(`No dynamic fields found for object ${managerObjectId}.`);
                }
              } catch (err) {
                console.warn(`Failed to fetch dynamic fields for object ${managerObjectId}:`, err);
              }
            } else {
              console.warn(`parentId is undefined or not a string, skipping dynamic fields check.`);
            }
          }
          // Abort transfer if required dynamic fields are missing
          if (!hasRequiredDynamicFields) {
            console.error('❌ Required dynamic fields for manager object are missing. Aborting transfer.');
            return;
          }
      } catch (e) {
        console.error('Error checking Sui object ownership or balance:', e);
      }
    } else {
      console.error('TEST_NTT_TOKENS.Sui is undefined. Please check your config.');
    }
    // ...existing code...
  
    const coinObjectId = (TEST_NTT_TOKENS.Sui as any).coinObjectId;
    const xfer = async function* () {
      // Log all relevant transfer parameters and contract addresses
      console.log('Transfer parameters:');
      console.log('  Sender:', srcSigner.address.address);
      console.log('  Amount:', amt.toString());
      console.log('  Destination:', dstSigner.address.address);

      console.log('  Coin object ID:', coinObjectId);
      const gen = srcNtt.transfer(
        srcSigner.address.address,
        amt,
        dstSigner.address,
        {
          queue: false,
          automatic: false,
        }
      );
      const next = await gen.next();
      if (!next.done && next.value?.transaction?.builder?.setGasBudget) {
        next.value.transaction.builder.setGasBudget(100_000_000);
      }
      yield next.value;
      for await (const n of gen) {
        yield n;
      }
    };

    // Get calldata for simulation on tenderly (optional)
    const xferGen = xfer();
    // Directly send the transaction without simulation
    let txids: TransactionId[] = [];
    try {
      txids = await signSendWait(src, xferGen, srcSigner.signer);
      console.log("Source txs", txids);
    } catch (err) {
      console.error("Error during signSendWait for transfer:", err);
      // Print full error details for debugging
      if (err && typeof err === 'object') {
        console.error('Full error object:', JSON.stringify(err, null, 2));
        if ('cause' in err) {
          console.error('Error cause:', JSON.stringify((err as any).cause, null, 2));
        }
      }
    }

    if (!txids || txids.length === 0) {
      console.error("No transactions were produced by the transfer. Possible causes: insufficient balance, missing object ownership, or contract error.");
      return;
    }

    let vaa;
    try {
      vaa = await wh.getVaa(
        txids[txids.length - 1]!.txid,
        "Ntt:WormholeTransfer",
        25 * 60 * 1000
      );
      console.log(vaa);
    } catch (err) {
      console.error("Error fetching VAA:", err);
      return;
    }

    try {
      const dstTxids = await signSendWait(
        dst,
        dstNtt.redeem([vaa!], dstSigner.address.address),
        dstSigner.signer
      );
      console.log("dstTxids", dstTxids);
    } catch (err) {
      console.error("Error during destination redeem:", err);
    }
  })();