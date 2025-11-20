import type { DeployFunction } from "hardhat-deploy/types";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

const INITIAL_SUPPLY = 1_000_000_000_000n;
const TOKEN_NAME = "Confidential Token";
const TOKEN_SYMBOL = "CTKN";
const TOKEN_URI = "about:blank:)";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const cerc20 = await deploy("CERC20", {
    from: deployer,
    args: [deployer, INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL, TOKEN_URI],
    log: true,
    waitConfirmations: 1,
  });

  console.log("CERC20:", cerc20.address);
};

export default func;
func.tags = ["CERC20"];
func.id = "deploy_cerc20";
