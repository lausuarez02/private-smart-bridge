import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const WORMHOLE_RELAYER_SEPOLIA = "0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470";
const BASE_SEPOLIA_CHAIN_ID = 10004; // Wormhole Chain ID for Base Sepolia

async function main() {
  const BASE_DEPOSITOR_ADDRESS = process.env.BASE_DEPOSITOR_ADDRESS;
  const CERC20_ADDRESS = "0x11D34D24F59cF1aaD5Fa9C885f87505dB99ebfd3";

  if (!BASE_DEPOSITOR_ADDRESS) {
    throw new Error("Set BASE_DEPOSITOR_ADDRESS in .env before deploying CERC20Minter");
  }

  console.log("Deploying CERC20Minter to Ethereum Sepolia...");
  console.log("WORMHOLE_RELAYER:", WORMHOLE_RELAYER_SEPOLIA);
  console.log("CERC20_TOKEN:", CERC20_ADDRESS);
  console.log("BASE_CHAIN_ID:", BASE_SEPOLIA_CHAIN_ID);
  console.log("BASE_DEPOSITOR:", BASE_DEPOSITOR_ADDRESS);

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  const CERC20Minter = await ethers.getContractFactory("CERC20Minter");
  const minter = await CERC20Minter.deploy(
    WORMHOLE_RELAYER_SEPOLIA,
    CERC20_ADDRESS,
    BASE_SEPOLIA_CHAIN_ID,
    BASE_DEPOSITOR_ADDRESS
  );

  await minter.waitForDeployment();

  const minterAddress = await minter.getAddress();
  console.log("\n=================================");
  console.log("CERC20Minter deployed to:", minterAddress);
  console.log("=================================");
  console.log("\nNext steps:");
  console.log("1. Call CERC20.setMinter():");
  console.log(`   Update .env: SEPOLIA_MINTER_ADDRESS=${minterAddress}`);
  console.log(`   npx hardhat run scripts/setup_minter.ts --network sepolia`);
  console.log("\n2. Initialize AaveDepositorBase:");
  console.log(`   HARDHAT_NETWORK=baseSepolia npx hardhat run scripts/initialize_base.ts --network baseSepolia`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
