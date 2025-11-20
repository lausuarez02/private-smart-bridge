import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const WORMHOLE_RELAYER_SEPOLIA = "0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470";
const BASE_SEPOLIA_CHAIN_ID = 10004;

async function main() {
  const BASE_DEPOSITOR_ADDRESS = process.env.BASE_DEPOSITOR_ADDRESS;

  if (!BASE_DEPOSITOR_ADDRESS) {
    throw new Error("Set BASE_DEPOSITOR_ADDRESS in .env");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // 1. Deploy CERC20Mock
  console.log("\n1. Deploying CERC20Mock...");
  const CERC20Mock = await ethers.getContractFactory("CERC20Mock");
  const cerc20 = await CERC20Mock.deploy(
    deployer.address,
    0, // No initial supply
    "Confidential Token Mock",
    "CTKN"
  );
  await cerc20.waitForDeployment();
  const cerc20Address = await cerc20.getAddress();
  console.log("✅ CERC20Mock deployed to:", cerc20Address);

  // 2. Deploy CERC20MinterMock
  console.log("\n2. Deploying CERC20MinterMock...");
  const CERC20MinterMock = await ethers.getContractFactory("CERC20MinterMock");
  const minter = await CERC20MinterMock.deploy(
    WORMHOLE_RELAYER_SEPOLIA,
    cerc20Address,
    BASE_SEPOLIA_CHAIN_ID,
    BASE_DEPOSITOR_ADDRESS
  );
  await minter.waitForDeployment();
  const minterAddress = await minter.getAddress();
  console.log("✅ CERC20MinterMock deployed to:", minterAddress);

  // 3. Set minter on CERC20Mock
  console.log("\n3. Setting minter on CERC20Mock...");
  const tx = await cerc20.setMinter(minterAddress);
  await tx.wait();
  console.log("✅ Minter set successfully");

  console.log("\n=================================");
  console.log("Deployment Summary");
  console.log("=================================");
  console.log("CERC20Mock:", cerc20Address);
  console.log("CERC20MinterMock:", minterAddress);
  console.log("\nNext steps:");
  console.log("1. Update .env:");
  console.log(`   CERC20_ADDRESS=${cerc20Address}`);
  console.log(`   SEPOLIA_MINTER_ADDRESS=${minterAddress}`);
  console.log("\n2. Reinitialize AaveDepositorBase:");
  console.log("   HARDHAT_NETWORK=baseSepolia npx hardhat run scripts/reinitialize_base.ts --network baseSepolia");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
