import { Ntt } from "@wormhole-foundation/sdk-definitions-ntt";
import { Chain, encoding } from "@wormhole-foundation/sdk";
import dotenv from "dotenv";
import deploymentConfig from "../../../ntt-project/deployment.json";
dotenv.config();

export type NttContracts = {
  [key in Chain]?: Ntt.Contracts;
};

export const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "";
export const TESTNET_SUI_MNEMONIC = process.env.TESTNET_SUI_MNEMONIC || "";

export const TEST_NTT_TOKENS: NttContracts = {
  Sui: {
    token: deploymentConfig.chains.Sui.token,
    manager: deploymentConfig.chains.Sui.manager,
    transceiver: { wormhole: deploymentConfig.chains.Sui.transceivers.wormhole.address },
  },
  Sepolia: {
    token: deploymentConfig.chains.Sepolia.token,
    manager: deploymentConfig.chains.Sepolia.manager,
    transceiver: { wormhole: deploymentConfig.chains.Sepolia.transceivers.wormhole.address },
  },
};
