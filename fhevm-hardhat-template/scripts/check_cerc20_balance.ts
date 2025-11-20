import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const CERC20_ADDRESS = process.env.CERC20_ADDRESS;

  if (!CERC20_ADDRESS) {
    throw new Error("Set CERC20_ADDRESS in .env");
  }

  const [signer] = await ethers.getSigners();
  console.log("Checking CERC20Mock balance for:", signer.address);

  const cerc20 = await ethers.getContractAt("CERC20Mock", CERC20_ADDRESS);

  const balance = await cerc20.balanceOf(signer.address);
  const totalSupply = await cerc20.totalSupply();

  console.log("\n=== CERC20Mock Balances ===");
  console.log("User balance:", ethers.formatUnits(balance, 6), "CERC20");
  console.log("Total supply:", ethers.formatUnits(totalSupply, 6), "CERC20");

  console.log("\n✅ Balances retrieved successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
