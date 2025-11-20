import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const MINTER_ADDRESS = process.env.SEPOLIA_MINTER_ADDRESS;

  if (!MINTER_ADDRESS) {
    throw new Error("Set SEPOLIA_MINTER_ADDRESS in .env");
  }

  console.log("Debugging CERC20Minter:", MINTER_ADDRESS);

  const minter = await ethers.getContractAt("CERC20Minter", MINTER_ADDRESS);

  // Get configuration
  const wormholeRelayer = await minter.WORMHOLE_RELAYER();
  const cerc20Token = await minter.CERC20_TOKEN();
  const scrollChainId = await minter.SCROLL_CHAIN_ID();
  const scrollDepositor = await minter.SCROLL_DEPOSITOR();

  console.log("\n=== CERC20Minter Configuration ===");
  console.log("WORMHOLE_RELAYER:", wormholeRelayer);
  console.log("CERC20_TOKEN:", cerc20Token);
  console.log("SCROLL_CHAIN_ID:", scrollChainId.toString());
  console.log("SCROLL_DEPOSITOR:", scrollDepositor);

  console.log("\n=== Expected Values ===");
  console.log("Expected Wormhole Relayer:", "0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470");
  console.log("Expected Chain ID (Base Sepolia):", "10004");
  console.log("Expected Depositor:", process.env.BASE_DEPOSITOR_ADDRESS);

  console.log("\n=== Analysis ===");
  if (scrollChainId.toString() !== "10004") {
    console.log("❌ PROBLEM: Chain ID is", scrollChainId.toString(), "but should be 10004 for Base Sepolia!");
  } else {
    console.log("✅ Chain ID is correct");
  }

  if (scrollDepositor.toLowerCase() !== process.env.BASE_DEPOSITOR_ADDRESS?.toLowerCase()) {
    console.log("❌ PROBLEM: Depositor address mismatch!");
    console.log("   Contract has:", scrollDepositor);
    console.log("   Should be:", process.env.BASE_DEPOSITOR_ADDRESS);
  } else {
    console.log("✅ Depositor address is correct");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
