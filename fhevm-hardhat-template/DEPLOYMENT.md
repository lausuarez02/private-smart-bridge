# Cross-Chain Aave Depositor Deployment Guide

## Architecture

- **Scroll Sepolia**: AaveDepositorScroll (deposits to Aave, sends Wormhole messages)
- **Ethereum Sepolia**: CERC20 + CERC20Minter (receives messages, mints/burns tokens)

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Set hardhat vars:
```bash
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
npx hardhat vars set ETHERSCAN_API_KEY
```

## Deployment Steps

### Step 1: Deploy on Ethereum Sepolia

```bash
npx hardhat deploy --network sepolia --tags CERC20
npx hardhat deploy --network sepolia --tags CERC20Minter
npx hardhat deploy --network sepolia --tags SetupMinter
```

After deployment, copy `CERC20Minter` address to `.env`:
```
SEPOLIA_MINTER_ADDRESS=0x...
```

### Step 2: Configure Scroll Environment

Update `.env` with:
```
AAVE_POOL_SCROLL=0x... # Aave V3 Pool on Scroll
DEPOSIT_ASSET=0x... # Token to deposit (USDC, DAI, etc)
```

### Step 3: Deploy on Scroll Sepolia

```bash
npx hardhat deploy --network scrollSepolia --tags AaveDepositorScroll
```

After deployment, copy address and update CERC20Minter on Sepolia if needed.

## Usage

### Deposit Flow (Scroll → Sepolia)

```javascript
// On Scroll Sepolia
const depositor = await ethers.getContractAt("AaveDepositorScroll", DEPOSITOR_ADDRESS);
const fee = await depositor.quoteCrossChainCost();
await depositor.deposit(amount, { value: fee });
```

This will:
1. Deposit tokens to Aave on Scroll
2. Send Wormhole message to Sepolia
3. Mint CERC20 tokens to user on Sepolia

### Withdraw Flow (Sepolia → Scroll)

```javascript
// On Ethereum Sepolia
const minter = await ethers.getContractAt("CERC20Minter", MINTER_ADDRESS);
const fee = await minter.quoteCrossChainCost();
await minter.withdraw(amount, { value: fee });
```

This will:
1. Burn CERC20 tokens on Sepolia
2. Send Wormhole message to Scroll
3. Withdraw from Aave and send tokens on Scroll

## Network Info

### Ethereum Sepolia
- Chain ID: 11155111
- Wormhole Relayer: `0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470`
- RPC: `https://sepolia.infura.io/v3/YOUR_KEY`

### Scroll Sepolia
- Chain ID: 534351
- Wormhole Relayer: `0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470`
- RPC: `https://sepolia-rpc.scroll.io`
- Wormhole Chain ID: 34

## Wormhole Fees

Both deposit and withdraw require ETH for Wormhole fees:
```javascript
const fee = await contract.quoteCrossChainCost();
```

Always call with `{ value: fee }`.
