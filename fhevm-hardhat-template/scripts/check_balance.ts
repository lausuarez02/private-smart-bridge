import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const CERC20_ADDRESS = "0x11D34D24F59cF1aaD5Fa9C885f87505dB99ebfd3";

  const [signer] = await ethers.getSigners();
  console.log("Checking balance for:", signer.address);

  const cerc20 = await ethers.getContractAt("CERC20", CERC20_ADDRESS);

  try {
    // Try to get total supply
    const totalSupply = await cerc20.totalSupply();
    console.log("Total supply:", totalSupply.toString());
  } catch (error) {
    console.log("Note: Total supply might be encrypted");
  }

  console.log("\n=================================");
  console.log("CERC20 Address:", CERC20_ADDRESS);
  console.log("User Address:", signer.address);
  console.log("=================================");
  console.log("\nNote: CERC20 balances are encrypted (FHE).");
  console.log("You can verify the mint event in the transaction history.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
