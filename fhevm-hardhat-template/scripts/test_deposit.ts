import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const DEPOSITOR_ADDRESS = process.env.BASE_DEPOSITOR_ADDRESS;
  const USDC_ADDRESS = process.env.DEPOSIT_ASSET;

  if (!DEPOSITOR_ADDRESS || !USDC_ADDRESS) {
    throw new Error("Set BASE_DEPOSITOR_ADDRESS and DEPOSIT_ASSET in .env");
  }

  const [signer] = await ethers.getSigners();
  console.log("Testing with account:", signer.address);

  const depositor = await ethers.getContractAt("AaveDepositorBase", DEPOSITOR_ADDRESS);
  const usdc = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", USDC_ADDRESS);

  // Check USDC balance
  const balance = await usdc.balanceOf(signer.address);
  console.log("USDC balance:", ethers.formatUnits(balance, 6));

  if (balance === 0n) {
    console.log("⚠️  No USDC balance. Please get some USDC first.");
    return;
  }

  // Amount to deposit (0.1 USDC)
  const amount = 100000n; // 0.1 USDC (6 decimals)

  // Get cross-chain fee and add buffer (3x to be safe)
  const wormholeFeeQuote = await depositor.quoteCrossChainCost();
  const wormholeFee = wormholeFeeQuote * 3n; // Send 3x the quoted fee
  console.log("Wormhole fee quoted:", ethers.formatEther(wormholeFeeQuote), "ETH");
  console.log("Wormhole fee sending:", ethers.formatEther(wormholeFee), "ETH (3x)");

  // Check ETH balance for fee
  const ethBalance = await ethers.provider.getBalance(signer.address);
  console.log("ETH balance:", ethers.formatEther(ethBalance), "ETH");

  if (ethBalance < wormholeFee) {
    console.log("⚠️  Insufficient ETH for Wormhole fee");
    return;
  }

  // Approve USDC
  console.log("\n1. Approving USDC...");
  const approveTx = await usdc.approve(DEPOSITOR_ADDRESS, amount);
  await approveTx.wait();
  console.log("✅ USDC approved");

  // Deposit
  console.log("\n2. Depositing", ethers.formatUnits(amount, 6), "USDC...");
  const depositTx = await depositor.deposit(amount, { value: wormholeFee });
  console.log("Transaction sent:", depositTx.hash);

  const receipt = await depositTx.wait();
  console.log("✅ Deposit successful!");
  console.log("Gas used:", receipt?.gasUsed.toString());

  console.log("\n=================================");
  console.log("Deposit completed!");
  console.log("=================================");
  console.log("\nNext steps:");
  console.log("1. Wait for Wormhole to relay the message (~2-5 minutes)");
  console.log("2. Check CERC20 balance in Sepolia:");
  console.log("   HARDHAT_NETWORK=sepolia npx hardhat run scripts/check_balance.ts --network sepolia");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
