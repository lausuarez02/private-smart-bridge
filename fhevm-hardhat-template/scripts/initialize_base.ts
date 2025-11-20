import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const BASE_DEPOSITOR_ADDRESS = process.env.BASE_DEPOSITOR_ADDRESS;
  const SEPOLIA_MINTER_ADDRESS = process.env.SEPOLIA_MINTER_ADDRESS;

  if (!BASE_DEPOSITOR_ADDRESS) {
    throw new Error("Set BASE_DEPOSITOR_ADDRESS in .env (the deployed AaveDepositorBase address)");
  }

  if (!SEPOLIA_MINTER_ADDRESS) {
    throw new Error("Set SEPOLIA_MINTER_ADDRESS in .env");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Initializing with account:", deployer.address);

  const depositor = await ethers.getContractAt("AaveDepositorBase", BASE_DEPOSITOR_ADDRESS);

  console.log("Calling initialize() with SEPOLIA_MINTER:", SEPOLIA_MINTER_ADDRESS);

  const tx = await depositor.initialize(SEPOLIA_MINTER_ADDRESS);
  console.log("Transaction sent:", tx.hash);

  await tx.wait();

  console.log("\n=================================");
  console.log("AaveDepositorBase initialized successfully!");
  console.log("=================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
