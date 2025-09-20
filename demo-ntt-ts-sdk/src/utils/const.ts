import { Ntt } from "@wormhole-foundation/sdk-definitions-ntt";

// Extend Ntt.Contracts to allow coinObjectId for Sui
export type SuiContracts = Ntt.Contracts & { coinObjectId?: string };
export type NttContracts = {
  [key in Chain]?: Ntt.Contracts | SuiContracts;
};
import { Chain, encoding } from "@wormhole-foundation/sdk";
import * as dotenv from "dotenv";
dotenv.config();
// Only keep the extended version

export const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "";
export const TESTNET_SUI_MNEMONIC = process.env.TESTNET_SUI_MNEMONIC || ""; 

export const TEST_NTT_TOKENS: NttContracts = {
  Sepolia: {
    token: "0x0741a499355f2683332Ab2eC00c0eb9BCaec445d",
    manager: "0x2e8b2eDE7eDEf610f9f2FE6D684108f3EBD5E3C5",
    transceiver: { wormhole: "0x77f60d5CE2DAFe8154b17FD0bd648B8D448D9370" },
  },
  Sui: {
    token: "0xb1ef68826d33b00d07bbb190ffb757c9f388a27c973f9808ad3d8f929c485330::my_coin::MY_COIN",
  // coinObjectId is the actual Sui coin object owned by the sender
  coinObjectId: "0x22837996ca512165d3dd29ef504093c34161e3dd1546ebb6493b466e6e05c199",
    manager: "0xf36991b8e071594a50ba175ef3ca3128610e61371bc989770567f0c08fbaf7af",
    transceiver: { wormhole: "0xc18841129e9b8358b1d9a7b1e1b3b50728fa079e65854749cd052d0e86ebd8de" },
  },
};