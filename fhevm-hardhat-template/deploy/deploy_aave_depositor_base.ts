import type { DeployFunction } from "hardhat-deploy/types";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

const WORMHOLE_RELAYER_BASE = "0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE";
const SEPOLIA_CHAIN_ID = 10002;
const AAVE_POOL_BASE = process.env.AAVE_POOL_BASE || "";
const DEPOSIT_ASSET = process.env.DEPOSIT_ASSET || "";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  if (!AAVE_POOL_BASE || !DEPOSIT_ASSET) {
    throw new Error("Set AAVE_POOL_BASE and DEPOSIT_ASSET in .env");
  }

  const depositor = await deploy("AaveDepositorBase", {
    from: deployer,
    args: [
      AAVE_POOL_BASE,
      DEPOSIT_ASSET,
      WORMHOLE_RELAYER_BASE,
      SEPOLIA_CHAIN_ID,
    ],
    log: true,
    waitConfirmations: 1,
  });

  console.log("AaveDepositorBase deployed:", depositor.address);
  console.log("\nNext steps:");
  console.log("1. Deploy or get SEPOLIA_MINTER_ADDRESS");
  console.log("2. Call initialize() with the minter address:");
  console.log(`   npx hardhat run deploy/setup_base_depositor.ts --network baseSepolia`);
  console.log("\n3. Update BASE_DEPOSITOR_ADDRESS in .env:");
  console.log(`BASE_DEPOSITOR_ADDRESS=${depositor.address}`);
};

export default func;
func.tags = ["AaveDepositorBase", "Base"];
func.id = "deploy_aave_depositor_base";
