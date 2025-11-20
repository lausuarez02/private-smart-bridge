import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const DEPOSITOR_ADDRESS = process.env.BASE_DEPOSITOR_ADDRESS;
  const USDC_ADDRESS = process.env.DEPOSIT_ASSET;
  const AAVE_POOL = process.env.AAVE_POOL_BASE;

  if (!DEPOSITOR_ADDRESS || !USDC_ADDRESS || !AAVE_POOL) {
    throw new Error("Missing env vars");
  }

  const [signer] = await ethers.getSigners();
  console.log("Debugging with account:", signer.address);

  const depositor = await ethers.getContractAt("AaveDepositorBase", DEPOSITOR_ADDRESS);
  const usdc = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", USDC_ADDRESS);

  // Check contract configuration
  console.log("\n=== Contract Configuration ===");
  const aavePool = await depositor.AAVE_POOL();
  const asset = await depositor.ASSET();
  const wormholeRelayer = await depositor.WORMHOLE_RELAYER();
  const sepoliaChainId = await depositor.SEPOLIA_CHAIN_ID();
  const sepoliaMinter = await depositor.SEPOLIA_MINTER();

  console.log("AAVE_POOL:", aavePool);
  console.log("ASSET:", asset);
  console.log("WORMHOLE_RELAYER:", wormholeRelayer);
  console.log("SEPOLIA_CHAIN_ID:", sepoliaChainId.toString());
  console.log("SEPOLIA_MINTER:", sepoliaMinter);

  // Check allowance
  console.log("\n=== Allowances ===");
  const depositorAllowance = await usdc.allowance(DEPOSITOR_ADDRESS, aavePool);
  console.log("Depositor -> Aave Pool allowance:", depositorAllowance.toString());

  const userAllowance = await usdc.allowance(signer.address, DEPOSITOR_ADDRESS);
  console.log("User -> Depositor allowance:", userAllowance.toString());

  // Check balances
  console.log("\n=== Balances ===");
  const userBalance = await usdc.balanceOf(signer.address);
  console.log("User USDC balance:", ethers.formatUnits(userBalance, 6));

  const depositorBalance = await usdc.balanceOf(DEPOSITOR_ADDRESS);
  console.log("Depositor USDC balance:", ethers.formatUnits(depositorBalance, 6));

  // Try to check if Aave Pool exists
  console.log("\n=== Aave Pool Check ===");
  try {
    const poolCode = await ethers.provider.getCode(aavePool);
    if (poolCode === "0x") {
      console.log("⚠️  WARNING: Aave Pool has no code! Address might be incorrect.");
    } else {
      console.log("✅ Aave Pool exists");
    }
  } catch (error) {
    console.log("Error checking pool:", error);
  }

  // Check USDC token
  console.log("\n=== USDC Token Check ===");
  try {
    const name = await usdc.name();
    const symbol = await usdc.symbol();
    const decimals = await usdc.decimals();
    console.log(`Token: ${name} (${symbol})`);
    console.log(`Decimals: ${decimals}`);
  } catch (error) {
    console.log("Error reading token:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
