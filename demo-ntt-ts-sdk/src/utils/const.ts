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
    manager: "0x91E65a5b7633A3cC42F228776aDf041ef35fcaCA",
    transceiver: { wormhole: "0xcACefe0FFC02875bEB27E3EC1C5C6eDB5e9e6184" },
  },
  Sui: {
    token: "0x21c6c84e85ff87bc62bcc70e4cbc6fa2492050465921aa1399350f7fa2b45321::my_coin::MY_COIN",
    manager: "0x54f201c1d5fcfe674cea78bde237558b6ac9053c034d055e50a43465d832f09d",
    transceiver: { wormhole: "0x363f70428683d3a3844e95dde224045cacdeb77de69c946851a58779ff40f4c6" },
  },
};
