import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const DEPOSITOR_ADDRESS = process.env.BASE_DEPOSITOR_ADDRESS;

  if (!DEPOSITOR_ADDRESS) {
    throw new Error("Set BASE_DEPOSITOR_ADDRESS in .env");
  }

  const [signer] = await ethers.getSigners();
  console.log("Testing Wormhole quote with account:", signer.address);

  const depositor = await ethers.getContractAt("AaveDepositorBase", DEPOSITOR_ADDRESS);

  // Get cross-chain cost
  const wormholeFee = await depositor.quoteCrossChainCost();
  console.log("\n=== Wormhole Configuration ===");
  console.log("Cross-chain fee:", ethers.formatEther(wormholeFee), "ETH");

  const sepoliaChainId = await depositor.SEPOLIA_CHAIN_ID();
  const sepoliaMinter = await depositor.SEPOLIA_MINTER();
  const wormholeRelayer = await depositor.WORMHOLE_RELAYER();

  console.log("Sepolia Chain ID:", sepoliaChainId.toString());
  console.log("Sepolia Minter:", sepoliaMinter);
  console.log("Wormhole Relayer:", wormholeRelayer);

  console.log("\n✅ Wormhole configuration looks good!");
  console.log("\n⚠️  Issue: Aave Pool integration is not working");
  console.log("Please verify:");
  console.log("1. AAVE_POOL_BASE address is correct");
  console.log("2. DEPOSIT_ASSET (USDC) is supported by the Aave Pool");
  console.log("3. Check the transaction you shared to get the correct addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
