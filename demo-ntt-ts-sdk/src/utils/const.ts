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
    token: "0x528007Fab32134522c44757E31a6d22ba433b5a8",
    manager: "0xBaaB509AAd2fC0b041669A86750631AA76688BeB",
    transceiver: { wormhole: "0xA830Cd34D83C10Ba3A8bB2F25ff8BBae9BcD0125" },
  },
  Sui: {
    token: "0x25172c5f5f4ab0dab2da33d71013eafc44a37e171d18fec9c1598ca77859eda0::my_coin::MY_COIN",
    manager: "0xb163cfaee9a596410d2997500783f1756332c2391dcf894bd3ddd6cf301e8592",
    transceiver: { wormhole: "0x78d7c303fc44f8ba8ccb85bc8424745796e1472bd2d6c873d7d0b0c32fe227cb" },
  },
};