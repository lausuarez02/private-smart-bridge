import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const WORMHOLE_RELAYER_BASE = "0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE";
const SEPOLIA_CHAIN_ID = 10002;

async function main() {
  const AAVE_POOL_BASE = process.env.AAVE_POOL_BASE;
  const DEPOSIT_ASSET = process.env.DEPOSIT_ASSET;

  if (!AAVE_POOL_BASE || !DEPOSIT_ASSET) {
    throw new Error("Set AAVE_POOL_BASE and DEPOSIT_ASSET in .env");
  }

  console.log("Deploying AaveDepositorBase to Base Sepolia...");
  console.log("AAVE_POOL_BASE:", AAVE_POOL_BASE);
  console.log("DEPOSIT_ASSET:", DEPOSIT_ASSET);
  console.log("WORMHOLE_RELAYER_BASE:", WORMHOLE_RELAYER_BASE);
  console.log("SEPOLIA_CHAIN_ID:", SEPOLIA_CHAIN_ID);

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  const AaveDepositorBase = await ethers.getContractFactory("AaveDepositorBase");
  const depositor = await AaveDepositorBase.deploy(
    AAVE_POOL_BASE,
    DEPOSIT_ASSET,
    WORMHOLE_RELAYER_BASE,
    SEPOLIA_CHAIN_ID
  );

  await depositor.waitForDeployment();

  const depositorAddress = await depositor.getAddress();
  console.log("\n=================================");
  console.log("AaveDepositorBase deployed to:", depositorAddress);
  console.log("=================================");
  console.log("\nNext steps:");
  console.log("1. Deploy or get SEPOLIA_MINTER_ADDRESS");
  console.log("2. Call initialize() with the minter address:");
  console.log(`   npx hardhat run scripts/initialize_base.ts --network baseSepolia`);
  console.log("\n3. Update .env:");
  console.log(`BASE_DEPOSITOR_ADDRESS=${depositorAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
