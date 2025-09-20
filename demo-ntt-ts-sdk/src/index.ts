import {
    TransactionId,
    Wormhole,
    amount,
    signSendWait,
    ChainAddress,
  } from "@wormhole-foundation/sdk";
  import evm from "@wormhole-foundation/sdk/platforms/evm";
  import sui from "@wormhole-foundation/sdk/platforms/sui";

  // register protocol implementations
  import "@wormhole-foundation/sdk-evm-ntt";
  import "@wormhole-foundation/sdk-sui-ntt";
  import { TEST_NTT_TOKENS } from "./utils/const";
  import { getSigner } from "./utils/helpers";


  (async function () {
    try {
      console.log("Starting NTT TypeScript SDK Demo...");
      
      const wh = new Wormhole("Testnet", [evm.Platform, sui.Platform], {
        // optional way to use private RPCs, especially recommended for mainnet 
        // "chains": {
        //   "Sui": {
        //     "rpc": "http://127.0.0.1:8546"
        //   },
        // }
      });
      
      const src = wh.getChain("Sui");
      const dst = wh.getChain("Sepolia");

      console.log("Getting signers...");
      const srcSigner = await getSigner(src);
      const dstSigner = await getSigner(dst);
      
      console.log("Source signer address:", srcSigner.address.address);
      console.log("Destination signer address:", dstSigner.address.address);
    
      console.log("Setting up NTT protocols...");
      const srcNtt = await src.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[src.chain],
      });
      const dstNtt = await dst.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[dst.chain],
      });
      
      console.log("Source NTT config:", TEST_NTT_TOKENS[src.chain]);
      console.log("Destination NTT config:", TEST_NTT_TOKENS[dst.chain]);
    
      // Get token decimals first
      const tokenDecimals = await srcNtt.getTokenDecimals();
      console.log("Token decimals:", tokenDecimals);
      
      // Use a smaller amount for testing
      const amt = amount.units(
        amount.parse("0.1", tokenDecimals)
      );
      console.log("Transfer amount:", amt.toString());
    
      // Create the transfer function
      const xfer = () =>
        srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
          queue: false,
          automatic: false,
        });

      console.log("Getting transfer calldata...");
      // Get calldata for simulation on tenderly (optional)
      // const firstTx = await xfer().next();
      // if (!firstTx.done) {
      //   const txData = firstTx.value.transaction.data;
      //   console.log("Transfer Calldata for EVM simulation:", txData);
        
      //   // Check if calldata is valid
      //   if (!txData || txData === "undefined") {
      //     throw new Error("Transfer calldata is undefined - this indicates a configuration issue");
      //   }
      // } else {
      //   console.log("Transfer completed in single step");
      // }
    
      console.log("Initiating transfer...");
      // Initiate the transfer
      const txids: TransactionId[] = await signSendWait(src, xfer(), srcSigner.signer);
      console.log("Source txs", txids);
    
      console.log("Waiting for VAA...");
      const vaa = await wh.getVaa(
        txids[txids.length - 1]!.txid,
        "Ntt:WormholeTransfer",
        25 * 60 * 1000
      );
      console.log("VAA received:", vaa);
    
      console.log("Redeeming transfer on destination...");
      const dstTxids = await signSendWait(
        dst,
        dstNtt.redeem([vaa!], dstSigner.address.address),
        dstSigner.signer
      );
      console.log("Destination txs", dstTxids);
      
      console.log("Transfer completed successfully!");
      
    } catch (error) {
      console.error("Error during transfer:", error);
      
      // Provide helpful debugging information
      if (error instanceof Error) {
        if (error.message.includes("MoveAbort")) {
          console.error("\n=== MoveAbort Debugging Info ===");
          console.error("This error typically occurs when:");
          console.error("1. The NTT token configuration is incorrect");
          console.error("2. The transfer calldata is undefined or malformed");
          console.error("3. The bytes32::new function receives invalid input");
          console.error("\nPlease check:");
          console.error("- Your environment variables (SEPOLIA_PRIVATE_KEY, TESTNET_SUI_MNEMONIC)");
          console.error("- The NTT token addresses in utils/const.ts");
          console.error("- Your account has sufficient funds for the transfer");
        }
      }
      
      throw error;
    }
  })();