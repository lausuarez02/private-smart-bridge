import type { DeployFunction } from "hardhat-deploy/types";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { ethers, deployments } = hre;

  const sepoliaMinter = process.env.SEPOLIA_MINTER_ADDRESS;

  if (!sepoliaMinter) {
    throw new Error("Set SEPOLIA_MINTER_ADDRESS in .env");
  }

  const depositorDeployment = await deployments.get("AaveDepositorBase");
  const depositor = await ethers.getContractAt("AaveDepositorBase", depositorDeployment.address);

  console.log("Initializing AaveDepositorBase with SEPOLIA_MINTER:", sepoliaMinter);

  const tx = await depositor.initialize(sepoliaMinter);
  await tx.wait();

  console.log("AaveDepositorBase initialized successfully!");
  console.log("Transaction hash:", tx.hash);
};

export default func;
func.tags = ["SetupBase"];
func.id = "setup_base_depositor";
