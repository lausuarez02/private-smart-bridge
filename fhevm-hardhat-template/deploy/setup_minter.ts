import type { DeployFunction } from "hardhat-deploy/types";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { get } = hre.deployments;
  const { ethers } = hre;

  const cerc20Deployment = await get("CERC20");
  const minterDeployment = await get("CERC20Minter");

  const cerc20 = await ethers.getContractAt("CERC20", cerc20Deployment.address);

  const currentMinter = await cerc20.minter();

  if (currentMinter === minterDeployment.address) {
    console.log("Minter already set correctly");
    return;
  }

  console.log("Setting minter to:", minterDeployment.address);

  const tx = await cerc20.setMinter(minterDeployment.address);
  await tx.wait();

  console.log("Minter set successfully");
};

export default func;
func.tags = ["SetupMinter", "Sepolia"];
func.dependencies = ["CERC20", "CERC20Minter"];
func.id = "setup_minter";
