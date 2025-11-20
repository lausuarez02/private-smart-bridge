import type { DeployFunction } from "hardhat-deploy/types";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

const WORMHOLE_RELAYER_SCROLL = "0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470";
const SEPOLIA_CHAIN_ID = 10002;
const AAVE_POOL_SCROLL = process.env.AAVE_POOL_SCROLL || "";
const DEPOSIT_ASSET = process.env.DEPOSIT_ASSET || "";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const sepoliaMinter = process.env.SEPOLIA_MINTER_ADDRESS;

  if (!AAVE_POOL_SCROLL || !DEPOSIT_ASSET) {
    throw new Error("Set AAVE_POOL_SCROLL and DEPOSIT_ASSET in .env");
  }

  if (!sepoliaMinter) {
    throw new Error("Set SEPOLIA_MINTER_ADDRESS in .env");
  }

  const depositor = await deploy("AaveDepositorScroll", {
    from: deployer,
    args: [
      AAVE_POOL_SCROLL,
      DEPOSIT_ASSET,
      WORMHOLE_RELAYER_SCROLL,
      SEPOLIA_CHAIN_ID,
      sepoliaMinter,
    ],
    log: true,
    waitConfirmations: 1,
  });

  console.log("AaveDepositorScroll:", depositor.address);
  console.log("\nUpdate SCROLL_DEPOSITOR_ADDRESS in .env:");
  console.log(`SCROLL_DEPOSITOR_ADDRESS=${depositor.address}`);
};

export default func;
func.tags = ["AaveDepositorScroll", "Scroll"];
func.id = "deploy_aave_depositor_scroll";
