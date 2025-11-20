import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const MINTER_ADDRESS = process.env.SEPOLIA_MINTER_ADDRESS;

  if (!MINTER_ADDRESS) {
    throw new Error("Set SEPOLIA_MINTER_ADDRESS in .env");
  }

  console.log("Checking mint events on CERC20Minter:", MINTER_ADDRESS);

  const minter = await ethers.getContractAt("CERC20Minter", MINTER_ADDRESS);

  // Get current block
  const currentBlock = await ethers.provider.getBlockNumber();
  console.log("Current block:", currentBlock);

  // Query events from the last 1000 blocks
  const fromBlock = Math.max(0, currentBlock - 1000);
  console.log("Querying events from block:", fromBlock);

  try {
    // Get MintExecuted events
    const mintFilter = minter.filters.MintExecuted();
    const mintEvents = await minter.queryFilter(mintFilter, fromBlock, currentBlock);

    console.log("\n=== Mint Events ===");
    console.log("Total mint events found:", mintEvents.length);

    for (const event of mintEvents) {
      console.log("\n---");
      console.log("Block:", event.blockNumber);
      console.log("Transaction:", event.transactionHash);
      console.log("User:", event.args?.user);
      console.log("Amount:", ethers.formatUnits(event.args?.amount || 0, 6), "USDC");
    }

    // Get BurnExecuted events
    const burnFilter = minter.filters.BurnExecuted();
    const burnEvents = await minter.queryFilter(burnFilter, fromBlock, currentBlock);

    console.log("\n=== Burn Events ===");
    console.log("Total burn events found:", burnEvents.length);

    for (const event of burnEvents) {
      console.log("\n---");
      console.log("Block:", event.blockNumber);
      console.log("Transaction:", event.transactionHash);
      console.log("User:", event.args?.user);
      console.log("Amount:", ethers.formatUnits(event.args?.amount || 0, 6), "USDC");
    }

    console.log("\n=================================");
    console.log("Event check completed!");
    console.log("=================================");

    if (mintEvents.length === 0) {
      console.log("\n⚠️  No mint events found yet.");
      console.log("Wormhole messages may still be processing.");
      console.log("Wait a few minutes and run this script again.");
    }
  } catch (error) {
    console.error("Error querying events:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
