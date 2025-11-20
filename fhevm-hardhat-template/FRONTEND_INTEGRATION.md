# Frontend Integration Guide

This guide explains how to integrate the Cross-Chain FHE Lending Protocol into your frontend application.

## Table of Contents

- [Contract Addresses](#contract-addresses)
- [Contract ABIs](#contract-abis)
- [Web3 Setup](#web3-setup)
- [Deposit Flow](#deposit-flow)
- [Withdraw Flow](#withdraw-flow)
- [Reading State](#reading-state)
- [Event Monitoring](#event-monitoring)
- [Example Code](#example-code)

## Contract Addresses

### Base Sepolia (Chain ID: 84532)

```typescript
export const BASE_SEPOLIA_CONTRACTS = {
  AaveDepositorBase: '0x7D0Fb33E2f5cC55c72018b8720fEdcb8a985A0Fd',
  USDC: '0xba50Cd2A20f6DA35D788639E581bca8d0B5d4D5f',
  AavePool: '0x8bAB6d1b75f19e9eD9fCe8b9BD338844fF79aE27',
  WormholeRelayer: '0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE',
};
```

### Ethereum Sepolia (Chain ID: 11155111)

```typescript
export const SEPOLIA_CONTRACTS = {
  CERC20Minter: '0xd0dcE7901292087Ac2EB4a8201D83FCf8Fa5107E',
  CERC20: '0x11D34D24F59cF1aaD5Fa9C885f87505dB99ebfd3',
  WormholeRelayer: '0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470',
};
```

### Chain Configuration

```typescript
export const CHAIN_CONFIG = {
  baseSepolia: {
    chainId: 84532,
    wormholeChainId: 10004,
    rpcUrl: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
  },
  sepolia: {
    chainId: 11155111,
    wormholeChainId: 10002,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    explorer: 'https://sepolia.etherscan.io',
  },
};
```

## Contract ABIs

### AaveDepositorBase ABI

```typescript
export const AAVE_DEPOSITOR_ABI = [
  // View functions
  'function AAVE_POOL() view returns (address)',
  'function ASSET() view returns (address)',
  'function WORMHOLE_RELAYER() view returns (address)',
  'function SEPOLIA_CHAIN_ID() view returns (uint16)',
  'function SEPOLIA_MINTER() view returns (address)',
  'function quoteCrossChainCost() view returns (uint256)',

  // Write functions
  'function deposit(uint64 amount) payable',

  // Events
  'event Deposited(address indexed user, uint256 amount)',
  'event TokensClaimed(address indexed user, uint256 amount)',
];
```

### CERC20Minter ABI

```typescript
export const CERC20_MINTER_ABI = [
  // View functions
  'function WORMHOLE_RELAYER() view returns (address)',
  'function CERC20_TOKEN() view returns (address)',
  'function SCROLL_CHAIN_ID() view returns (uint16)',
  'function SCROLL_DEPOSITOR() view returns (address)',
  'function quoteCrossChainCost() view returns (uint256)',

  // Write functions
  'function withdraw(uint64 amount) payable',

  // Events
  'event MintExecuted(address indexed user, uint256 amount)',
  'event BurnExecuted(address indexed user, uint256 amount)',
  'event WithdrawMessageSent(address indexed user, uint256 amount)',
];
```

### ERC20 ABI (for USDC)

```typescript
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];
```

## Web3 Setup

### Using ethers.js v6

```typescript
import { ethers, BrowserProvider, Contract } from 'ethers';

// Connect to user's wallet
async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask');
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();

  return { provider, signer };
}

// Switch to Base Sepolia
async function switchToBaseSepolia() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x14A34' }], // 84532 in hex
    });
  } catch (error: any) {
    // Chain not added, add it
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x14A34',
          chainName: 'Base Sepolia',
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['https://sepolia.base.org'],
          blockExplorerUrls: ['https://sepolia.basescan.org'],
        }],
      });
    }
  }
}
```

## Deposit Flow

### Complete Deposit Implementation

```typescript
import { ethers, parseUnits, formatUnits } from 'ethers';

async function deposit(amount: string) {
  // 1. Connect wallet and switch to Base Sepolia
  const { provider, signer } = await connectWallet();
  await switchToBaseSepolia();

  // 2. Get contract instances
  const depositor = new Contract(
    BASE_SEPOLIA_CONTRACTS.AaveDepositorBase,
    AAVE_DEPOSITOR_ABI,
    signer
  );

  const usdc = new Contract(
    BASE_SEPOLIA_CONTRACTS.USDC,
    ERC20_ABI,
    signer
  );

  // 3. Parse amount (USDC has 6 decimals)
  const amountWei = parseUnits(amount, 6);

  // 4. Check USDC balance
  const userAddress = await signer.getAddress();
  const balance = await usdc.balanceOf(userAddress);

  if (balance < amountWei) {
    throw new Error('Insufficient USDC balance');
  }

  // 5. Get Wormhole fee (send 2x for reliability)
  const feeQuote = await depositor.quoteCrossChainCost();
  const wormholeFee = feeQuote * 2n;

  // 6. Check allowance
  const allowance = await usdc.allowance(
    userAddress,
    BASE_SEPOLIA_CONTRACTS.AaveDepositorBase
  );

  // 7. Approve if needed
  if (allowance < amountWei) {
    console.log('Approving USDC...');
    const approveTx = await usdc.approve(
      BASE_SEPOLIA_CONTRACTS.AaveDepositorBase,
      amountWei
    );
    await approveTx.wait();
    console.log('USDC approved');
  }

  // 8. Deposit
  console.log('Depositing...');
  const depositTx = await depositor.deposit(amountWei, {
    value: wormholeFee,
  });

  const receipt = await depositTx.wait();
  console.log('Deposit successful!', receipt.hash);

  return {
    txHash: receipt.hash,
    amount: formatUnits(amountWei, 6),
    wormholeFee: formatUnits(wormholeFee, 18),
  };
}
```

### React Hook Example

```typescript
import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';

export function useDeposit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const deposit = async (amount: string) => {
    if (!walletClient || !address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // Get signer from wagmi
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      // Use the deposit function from above
      const result = await deposit(amount);

      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deposit, loading, error };
}
```

## Withdraw Flow

### Complete Withdraw Implementation

```typescript
async function withdraw(amount: string) {
  // 1. Connect wallet and switch to Sepolia
  const { provider, signer } = await connectWallet();

  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xAA36A7' }], // 11155111 in hex
  });

  // 2. Get contract instance
  const minter = new Contract(
    SEPOLIA_CONTRACTS.CERC20Minter,
    CERC20_MINTER_ABI,
    signer
  );

  // 3. Parse amount (6 decimals to match USDC)
  const amountWei = parseUnits(amount, 6);

  // 4. Get Wormhole fee (send 2x for reliability)
  const feeQuote = await minter.quoteCrossChainCost();
  const wormholeFee = feeQuote * 2n;

  // 5. Withdraw (this burns FHE tokens and sends message to Base)
  console.log('Withdrawing...');
  const withdrawTx = await minter.withdraw(amountWei, {
    value: wormholeFee,
  });

  const receipt = await withdrawTx.wait();
  console.log('Withdraw successful!', receipt.hash);

  return {
    txHash: receipt.hash,
    amount: formatUnits(amountWei, 6),
    wormholeFee: formatUnits(wormholeFee, 18),
  };
}
```

## Reading State

### Check Balances

```typescript
async function getBalances(userAddress: string) {
  const provider = new BrowserProvider(window.ethereum);

  // USDC balance on Base Sepolia
  const usdc = new Contract(
    BASE_SEPOLIA_CONTRACTS.USDC,
    ERC20_ABI,
    provider
  );
  const usdcBalance = await usdc.balanceOf(userAddress);

  // Note: CERC20 balances are encrypted, cannot be read directly
  // You need to use the FHE SDK to decrypt them client-side

  return {
    usdc: formatUnits(usdcBalance, 6),
  };
}
```

### Get Wormhole Fee Quote

```typescript
async function getDepositFee() {
  const provider = new BrowserProvider(window.ethereum);

  const depositor = new Contract(
    BASE_SEPOLIA_CONTRACTS.AaveDepositorBase,
    AAVE_DEPOSITOR_ABI,
    provider
  );

  const feeQuote = await depositor.quoteCrossChainCost();
  const recommendedFee = feeQuote * 2n; // 2x for reliability

  return {
    quote: formatUnits(feeQuote, 18),
    recommended: formatUnits(recommendedFee, 18),
  };
}
```

## Event Monitoring

### Listen for Deposit Events

```typescript
async function listenForDeposits(userAddress: string, callback: (event: any) => void) {
  const provider = new BrowserProvider(window.ethereum);

  const depositor = new Contract(
    BASE_SEPOLIA_CONTRACTS.AaveDepositorBase,
    AAVE_DEPOSITOR_ABI,
    provider
  );

  // Listen for Deposited events
  const filter = depositor.filters.Deposited(userAddress);

  depositor.on(filter, (user, amount, event) => {
    callback({
      user,
      amount: formatUnits(amount, 6),
      txHash: event.log.transactionHash,
      blockNumber: event.log.blockNumber,
    });
  });

  // Cleanup function
  return () => {
    depositor.removeAllListeners(filter);
  };
}
```

### Query Historical Events

```typescript
async function getDepositHistory(userAddress: string) {
  const provider = new BrowserProvider(window.ethereum);

  const depositor = new Contract(
    BASE_SEPOLIA_CONTRACTS.AaveDepositorBase,
    AAVE_DEPOSITOR_ABI,
    provider
  );

  const currentBlock = await provider.getBlockNumber();
  const fromBlock = currentBlock - 10000; // Last ~10k blocks

  const filter = depositor.filters.Deposited(userAddress);
  const events = await depositor.queryFilter(filter, fromBlock, currentBlock);

  return events.map((event) => ({
    user: event.args?.user,
    amount: formatUnits(event.args?.amount || 0, 6),
    txHash: event.transactionHash,
    blockNumber: event.blockNumber,
  }));
}
```

## Example Code

### Complete React Component

```typescript
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function DepositComponent() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [fee, setFee] = useState('0');

  // Load fee on mount
  useEffect(() => {
    async function loadFee() {
      const { recommended } = await getDepositFee();
      setFee(recommended);
    }
    loadFee();
  }, []);

  async function handleDeposit() {
    try {
      setLoading(true);
      const result = await deposit(amount);
      setTxHash(result.txHash);
      alert('Deposit successful! Wait 2-5 minutes for Wormhole delivery.');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Deposit USDC to Aave on Base</h2>

      <div>
        <label>Amount (USDC):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          disabled={loading}
        />
      </div>

      <div>
        <p>Wormhole Fee: ~{fee} ETH</p>
      </div>

      <button onClick={handleDeposit} disabled={loading || !amount}>
        {loading ? 'Processing...' : 'Deposit'}
      </button>

      {txHash && (
        <div>
          <p>Transaction: {txHash}</p>
          <a
            href={`https://sepolia.basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Explorer
          </a>
        </div>
      )}
    </div>
  );
}
```

## Important Notes

1. **Always send 2x the quoted Wormhole fee** for reliable delivery
2. **Wait 2-5 minutes** for Wormhole to relay messages between chains
3. **FHE balances are encrypted** - you cannot read CERC20 balances directly on-chain
4. **Test on testnet first** before using on mainnet
5. **Handle network switching** gracefully in your UI

## Testing on Testnet

Get testnet tokens:
- **Base Sepolia ETH**: https://www.alchemy.com/faucets/base-sepolia
- **Sepolia ETH**: https://sepoliafaucet.com/
- **USDC on Base Sepolia**: Use the faucet or bridge from Sepolia

## Resources

- [ethers.js Documentation](https://docs.ethers.org/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Wormhole SDK](https://docs.wormhole.com/wormhole/quick-start/cross-chain-dev/automatic-relayer)
