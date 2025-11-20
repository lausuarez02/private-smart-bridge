import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const CERC20_ADDRESS = "0x11D34D24F59cF1aaD5Fa9C885f87505dB99ebfd3";
  const MINTER_ADDRESS = process.env.SEPOLIA_MINTER_ADDRESS;

  if (!MINTER_ADDRESS) {
    throw new Error("Set SEPOLIA_MINTER_ADDRESS in .env");
  }

  console.log("Setting minter for CERC20...");
  console.log("CERC20:", CERC20_ADDRESS);
  console.log("Minter:", MINTER_ADDRESS);

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  const cerc20 = await ethers.getContractAt("CERC20", CERC20_ADDRESS);

  const currentMinter = await cerc20.minter();
  console.log("Current minter:", currentMinter);

  if (currentMinter.toLowerCase() === MINTER_ADDRESS.toLowerCase()) {
    console.log("Minter already set correctly!");
    return;
  }

  console.log("Setting new minter...");
  const tx = await cerc20.setMinter(MINTER_ADDRESS);
  console.log("Transaction sent:", tx.hash);

  await tx.wait();

  console.log("\n=================================");
  console.log("Minter set successfully!");
  console.log("=================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
