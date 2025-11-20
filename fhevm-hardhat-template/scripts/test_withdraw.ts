import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const MINTER_ADDRESS = process.env.SEPOLIA_MINTER_ADDRESS;

  if (!MINTER_ADDRESS) {
    throw new Error("Set SEPOLIA_MINTER_ADDRESS in .env");
  }

  const [signer] = await ethers.getSigners();
  console.log("Testing withdraw with account:", signer.address);

  const minter = await ethers.getContractAt("CERC20Minter", MINTER_ADDRESS);

  // Amount to withdraw (0.1 USDC)
  const amount = 100000n; // 0.1 USDC (same as deposited)

  // Get cross-chain fee
  const wormholeFee = await minter.quoteCrossChainCost();
  console.log("Wormhole fee:", ethers.formatEther(wormholeFee), "ETH");

  // Check ETH balance for fee
  const ethBalance = await ethers.provider.getBalance(signer.address);
  console.log("ETH balance:", ethers.formatEther(ethBalance), "ETH");

  if (ethBalance < wormholeFee) {
    console.log("⚠️  Insufficient ETH for Wormhole fee");
    return;
  }

  // Withdraw
  console.log("\nWithdrawing", ethers.formatUnits(amount, 6), "USDC...");
  const withdrawTx = await minter.withdraw(amount, { value: wormholeFee });
  console.log("Transaction sent:", withdrawTx.hash);

  const receipt = await withdrawTx.wait();
  console.log("✅ Withdraw successful!");
  console.log("Gas used:", receipt?.gasUsed.toString());

  console.log("\n=================================");
  console.log("Withdraw completed!");
  console.log("=================================");
  console.log("\nNext steps:");
  console.log("1. Wait for Wormhole to relay the message (~2-5 minutes)");
  console.log("2. Check USDC balance in Base Sepolia");
  console.log("3. The USDC should be returned to your wallet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
