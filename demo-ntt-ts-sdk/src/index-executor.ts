import {
  ChainAddress,
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
import { NttExecutorRoute, nttExecutorRoute } from "@wormhole-foundation/sdk-route-ntt";
import { TEST_NTT_TOKENS } from "./utils/const";
import { getSigner, convertToExecutorConfig } from "./utils/helpers";
import { routes } from "@wormhole-foundation/sdk";

(async function () {
  // Set network to Testnet for safe testing
  const network = "Testnet";
  const wh = new Wormhole(network, [evm.Platform, sui.Platform]);

  // Source/destination chains
  const src = wh.getChain("Sui");
  const dst = wh.getChain("Sepolia");

  // Signers
  const srcSigner = await getSigner(src);

  // UPDATE: Replace with real EVM receiver address
  const dstAddress: ChainAddress = Wormhole.chainAddress("Sepolia", "0x2191433264B3E4F50439b3822323EC14448B192c");
  console.log("Source Sui address:", srcSigner.address.address);

  // Get NTT protocols for Sui
  const srcNtt = await src.getProtocol("Ntt", { ntt: TEST_NTT_TOKENS[src.chain] });
  const srcNttExecutor = await src.getProtocol("NttWithExecutor", { ntt: TEST_NTT_TOKENS[src.chain] });

  // Compose Executor Route config
  let executorConfig = convertToExecutorConfig(TEST_NTT_TOKENS);

  // Optional: Set msgValue=0 for EVM targets if needed based on token config
  // executorConfig.referrerFee = {
  //   feeDbps: 0n,
  //   perTokenOverrides: {
  //     Sepolia: {
  //       [TEST_NTT_TOKENS["Sepolia"].token]: { msgValue: 0n }
  //     }
  //   }
  // };

  // Set up executor route
  const executorRoute = nttExecutorRoute(executorConfig);
  const routeInstance = new executorRoute(wh);

  // Source/destination token
  const srcTokenAddr = TEST_NTT_TOKENS[src.chain].token;
  const dstTokenAddr = TEST_NTT_TOKENS[dst.chain].token;

  // Transfer Request
  const tr = await routes.RouteTransferRequest.create(wh, {
    source: Wormhole.tokenId(src.chain, srcTokenAddr),
    destination: Wormhole.tokenId(dst.chain, dstTokenAddr),
  });

  // Transfer amount (update as needed)
  const amtString = "1.7"; // Example: 1.7 tokens

  // Get decimals from source protocol
  const amt = amount.units(
    amount.parse(amtString, await srcNtt.getTokenDecimals())
  );

  // Validate transfer parameters
  const validated = await routeInstance.validate(tr, { amount: amtString });
  if (!validated.valid) throw new Error(`Validation failed: ${validated.error.message}`);
  const validatedParams: NttExecutorRoute.ValidatedParams = validated.params as NttExecutorRoute.ValidatedParams;

  // Get route quote (fee info, etc.)
  const routeQuote = await routeInstance.fetchExecutorQuote(tr, validatedParams);

  // Compose transfer generator
  const xfer = () =>
    srcNttExecutor.transfer(srcSigner.address.address, dstAddress, amt, routeQuote, srcNtt);

  // Get transfer calldata for simulation/debug
  const firstTx = await xfer().next();
  if (!firstTx.done) {
    const txData = firstTx.value.transaction.data;
    console.log("Transfer Calldata for EVM simulation:", txData);
  }

  // Perform the actual Sui → Sepolia token transfer
  const txids: TransactionId[] = await signSendWait(src, xfer(), srcSigner.signer);
  console.log("Source txs", txids);

  const vaa = await wh.getVaa(
    txids[txids.length - 1]!.txid,
    "Ntt:WormholeTransfer",
    25 * 60 * 1000
  );

  // Optional: Print WormholeScan link for traceability
  const sourceTxId = txids[txids.length - 1]!.txid;
  const wormholeScanUrl = `https://wormholescan.io/#/tx/${sourceTxId}?network=${network}`;
  console.log("WormholeScan URL:", wormholeScanUrl);

  // NOTE: Executor route is atomic, but if Sepolia requires redeem, call EVM redeem here (not needed for executor flow typically)
})();
