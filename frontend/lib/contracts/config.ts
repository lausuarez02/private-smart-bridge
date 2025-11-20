export const BASE_SEPOLIA_CONTRACTS = {
  AaveDepositorBase: '0x7D0Fb33E2f5cC55c72018b8720fEdcb8a985A0Fd',
  USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Official Circle USDC on Base Sepolia
  AavePool: '0x8bAB6d1b75f19e9eD9fCe8b9BD338844fF79aE27',
  WormholeRelayer: '0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE',
} as const;

export const SEPOLIA_CONTRACTS = {
  CERC20Minter: '0xd0dcE7901292087Ac2EB4a8201D83FCf8Fa5107E',
  CERC20: '0x11D34D24F59cF1aaD5Fa9C885f87505dB99ebfd3',
  WormholeRelayer: '0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470',
} as const;

export const CHAIN_CONFIG = {
  baseSepolia: {
    chainId: 84532,
    wormholeChainId: 10004,
    rpcUrl: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    name: 'Base Sepolia',
  },
  sepolia: {
    chainId: 11155111,
    wormholeChainId: 10002,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    explorer: 'https://sepolia.etherscan.io',
    name: 'Sepolia',
  },
} as const;
