import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const USDC_ADDRESS = process.env.DEPOSIT_ASSET;
  const AAVE_POOL = process.env.AAVE_POOL_BASE;

  if (!USDC_ADDRESS || !AAVE_POOL) {
    throw new Error("Missing env vars");
  }

  const [signer] = await ethers.getSigners();
  console.log("Testing Aave Pool directly with account:", signer.address);

  const pool = await ethers.getContractAt("IPool", AAVE_POOL);
  const usdc = await ethers.getContractAt("IERC20", USDC_ADDRESS);

  const amount = 100000n; // 0.1 USDC

  console.log("\n1. Approving USDC to Aave Pool...");
  const approveTx = await usdc.approve(AAVE_POOL, amount);
  await approveTx.wait();
  console.log("✅ Approved");

  console.log("\n2. Trying to supply to Aave Pool...");
  try {
    const supplyTx = await pool.supply(USDC_ADDRESS, amount, signer.address, 0);
    await supplyTx.wait();
    console.log("✅ Supply successful!");
  } catch (error: any) {
    console.log("❌ Supply failed:");
    console.log(error.message);

    // Try to get more details
    if (error.data) {
      console.log("Error data:", error.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
