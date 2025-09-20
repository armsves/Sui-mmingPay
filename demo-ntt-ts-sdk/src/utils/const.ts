import { Ntt } from "@wormhole-foundation/sdk-definitions-ntt";
import { Chain, encoding } from "@wormhole-foundation/sdk";
import dotenv from "dotenv";
dotenv.config();

export type NttContracts = {
  [key in Chain]?: Ntt.Contracts;
};

export const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "";
export const TESTNET_SUI_MNEMONIC = process.env.TESTNET_SUI_MNEMONIC || ""; 

export const TEST_NTT_TOKENS: NttContracts = {
  // Solana: {
  //   token: "ANRdVy8fvhiJqXccFPpZijty5jQqkBp5Xjw4NXL1CsU1",
  //   manager: "nasiB9hbB1s5ZWXAR54fjr3Y4HVTTzJMXNPAuedggQA",
  //   transceiver: {
  //     wormhole: "Ba8FkdiKmNuGiwiZ6PVzkyR7uE2kMGV1aAYUh3XReLuA",
  //   },
  //   quoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ"
  // },
  Sepolia: {
    token: "0x74A786d6d0397B44d49F9feA1bcD9FC8286D9046",
    manager: "0x39dC42359923DB4443Ad87cAF42bdD5D4b672b6a",
    transceiver: { wormhole: "0x86F7F28f67aa3564FDf84EAdAD00f28c7604a63b" },
  },
  Sui: {
    token: "0xa6b1ccc3420deb74565a67da7a2d50c1c73d69332e71fd4fb9a168470504fd6d::my_coin::MY_COIN",
    manager: "0xd6183bf59ec3c9fb8bb06c86ee8a524c7f74575f2fc7632466699e53ffd47ab6",
    transceiver: { wormhole: "0x3c2ff0ae785dd90f49615812967320901f7a642fd519dbde5e9efa0e98f2c33c" },
  },
};
