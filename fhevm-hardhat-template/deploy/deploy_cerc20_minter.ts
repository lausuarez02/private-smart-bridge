import type { DeployFunction } from "hardhat-deploy/types";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

const WORMHOLE_RELAYER_SEPOLIA = "0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470";
const BASE_SEPOLIA_CHAIN_ID = 10004; // Wormhole Chain ID for Base Sepolia

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  const cerc20 = await get("CERC20");
  const baseDepositor = process.env.BASE_DEPOSITOR_ADDRESS;

  if (!baseDepositor) {
    throw new Error("Set BASE_DEPOSITOR_ADDRESS in .env before deploying CERC20Minter");
  }

  const minter = await deploy("CERC20Minter", {
    from: deployer,
    args: [
      WORMHOLE_RELAYER_SEPOLIA,
      cerc20.address,
      BASE_SEPOLIA_CHAIN_ID,
      baseDepositor,
    ],
    log: true,
    waitConfirmations: 1,
  });

  console.log("CERC20Minter deployed:", minter.address);
  console.log("\nNext steps:");
  console.log(`1. Call CERC20.setMinter(${minter.address})`);
  console.log(`   npx hardhat run deploy/setup_minter.ts --network sepolia`);
  console.log(`2. Initialize AaveDepositorBase with minter address: ${minter.address}`);
  console.log(`   Update .env: SEPOLIA_MINTER_ADDRESS=${minter.address}`);
  console.log(`   npx hardhat run scripts/initialize_base.ts --network baseSepolia`);
};

export default func;
func.tags = ["CERC20Minter", "Sepolia"];
func.dependencies = ["CERC20"];
func.id = "deploy_cerc20_minter";
