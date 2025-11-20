import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
const contractAddress = '0x7D0Fb33E2f5cC55c72018b8720fEdcb8a985A0Fd';

const abi = [
  'function ASSET() view returns (address)',
  'function AAVE_POOL() view returns (address)',
];

const contract = new ethers.Contract(contractAddress, abi, provider);

async function checkAsset() {
  try {
    const asset = await contract.ASSET();
    const pool = await contract.AAVE_POOL();

    console.log('=== DEPLOYED CONTRACT INFO ===');
    console.log('Contract address:     ', contractAddress);
    console.log('ASSET (USDC) address: ', asset);
    console.log('AAVE_POOL address:    ', pool);
    console.log('\n=== EXPECTED VALUES ===');
    console.log('Circle USDC:          0x036CbD53842c5426634e7929541eC2318f3dCF7e');
    console.log('Old/Wrong USDC:       0xba50Cd2A20f6DA35D788639E581bca8d0B5d4D5f');
    console.log('\n=== COMPARISON ===');
    console.log('Matches Circle USDC:  ', asset.toLowerCase() === '0x036CbD53842c5426634e7929541eC2318f3dCF7e'.toLowerCase());
    console.log('Matches Wrong USDC:   ', asset.toLowerCase() === '0xba50Cd2A20f6DA35D788639E581bca8d0B5d4D5f'.toLowerCase());
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAsset();
