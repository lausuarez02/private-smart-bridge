import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const CERC20_ADDRESS = process.env.CERC20_ADDRESS;
  const MINTER_ADDRESS = process.env.SEPOLIA_MINTER_ADDRESS;

  if (!CERC20_ADDRESS || !MINTER_ADDRESS) {
    throw new Error("Set CERC20_ADDRESS and SEPOLIA_MINTER_ADDRESS in .env");
  }

  const cerc20 = await ethers.getContractAt("CERC20", CERC20_ADDRESS);

  console.log("Checking CERC20 configuration...");
  console.log("CERC20:", CERC20_ADDRESS);
  console.log("Expected Minter:", MINTER_ADDRESS);

  const currentMinter = await cerc20.minter();
  console.log("\nCurrent minter:", currentMinter);

  if (currentMinter.toLowerCase() === MINTER_ADDRESS.toLowerCase()) {
    console.log("✅ Minter is correctly set!");
  } else {
    console.log("❌ PROBLEM: Minter is NOT correctly set!");
    console.log("   Current:", currentMinter);
    console.log("   Expected:", MINTER_ADDRESS);
    console.log("\n⚠️  This is why Wormhole messages are failing!");
    console.log("   The CERC20Minter cannot mint tokens because it's not authorized.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
