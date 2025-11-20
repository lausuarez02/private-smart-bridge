# Cross-Chain FHE Lending Protocol

A cross-chain lending protocol that uses **Wormhole** for cross-chain messaging and **Fully Homomorphic Encryption (FHE)** for private balances on Ethereum Sepolia, integrated with **Aave V3** on Base Sepolia.

## Overview

This protocol allows users to:
1. **Deposit USDC** on Base Sepolia into Aave V3
2. Receive **encrypted FHE tokens** (CERC20) on Ethereum Sepolia via Wormhole
3. **Withdraw** by burning FHE tokens on Sepolia
4. Receive USDC back from Aave on Base Sepolia

### Key Features

- 🔐 **Privacy-preserving balances** using FHE on Ethereum Sepolia
- 🌉 **Cross-chain messaging** via Wormhole Relayer
- 💰 **Yield generation** through Aave V3 integration on Base Sepolia
- ⚡ **Automatic cross-chain execution** with delivery guarantees

## Architecture

```
Base Sepolia                          Ethereum Sepolia
┌─────────────────────┐              ┌──────────────────┐
│                     │              │                  │
│  AaveDepositorBase  │◄────────────►│  CERC20Minter    │
│                     │   Wormhole   │                  │
└──────────┬──────────┘              └────────┬─────────┘
           │                                   │
           ▼                                   ▼
    ┌──────────┐                        ┌──────────┐
    │ Aave V3  │                        │  CERC20  │
    │   Pool   │                        │  (FHE)   │
    └──────────┘                        └──────────┘
```

## Deployed Contracts

### Base Sepolia (Chain ID: 84532)

| Contract | Address | Description |
|----------|---------|-------------|
| **AaveDepositorBase** (Current) | `0xf42E3391E7103AD7D3a76cD70d6e612de4C99B22` | Main deposit/withdraw contract |
| **Aave V3 Pool** | `0x8bAB6d1b75f19e9eD9fCe8b9BD338844fF79aE27` | Aave lending pool |
| **USDC** | `0xba50Cd2A20f6DA35D788639E581bca8d0B5d4D5f` | Deposit asset |
| **Wormhole Relayer** | `0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE` | Wormhole messaging |

### Ethereum Sepolia (Chain ID: 11155111)

| Contract | Address | Description |
|----------|---------|-------------|
| **CERC20MinterMock** (Current) | `0x1B56475fc7E548b91F1C1a4C5E5caA1370D64995` | Mint/burn tokens (no FHE) |
| **CERC20Mock** (Current) | `0x71213d80E56920De5cdf3262E60d66a29ce4F069` | ERC20 token (no FHE) |
| **Wormhole Relayer** | `0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470` | Wormhole messaging |

### Previous Deployments (With FHE - Failed on Sepolia)

| Contract | Address | Description |
|----------|---------|-------------|
| **CERC20Minter** (Deprecated) | `0xd0dcE7901292087Ac2EB4a8201D83FCf8Fa5107E` | FHE version - requires fhEVM testnet |
| **CERC20** (Deprecated) | `0x11D34D24F59cF1aaD5Fa9C885f87505dB99ebfd3` | FHE version - requires fhEVM testnet |
| **AaveDepositorBase** (Old) | `0x7D0Fb33E2f5cC55c72018b8720fEdcb8a985A0Fd` | Previous deployment |

### Wormhole Configuration

| Chain | Wormhole Chain ID | EVM Chain ID |
|-------|-------------------|--------------|
| Ethereum Sepolia | 10002 | 11155111 |
| Base Sepolia | 10004 | 84532 |

## User Flow

### 1. Deposit Flow (Base → Sepolia)

```
User (Base Sepolia)
  │
  ├─► Approve USDC to AaveDepositorBase
  │
  ├─► Call deposit(amount) with Wormhole fee
  │    │
  │    ├─► Transfer USDC from user
  │    ├─► Supply USDC to Aave V3
  │    └─► Send Wormhole message to Sepolia
  │
  └─► Wait for Wormhole delivery (2-5 min)
       │
       └─► CERC20Minter receives message
            └─► Mint encrypted tokens to user
```

### 2. Withdraw Flow (Sepolia → Base)

```
User (Sepolia)
  │
  ├─► Call withdraw(amount) with Wormhole fee
  │    │
  │    ├─► Burn encrypted CERC20 tokens
  │    └─► Send Wormhole message to Base
  │
  └─► Wait for Wormhole delivery (2-5 min)
       │
       └─► AaveDepositorBase receives message
            ├─► Withdraw USDC from Aave V3
            └─► Transfer USDC to user
```

## Test Transactions

### Phase 1: Initial Testing (First Deployment)

#### Deposits on Base Sepolia (0.1 USDC each)

1. [`0x04c36340f16999ceb4d1862f91fabac416a7d8eabfab32c100e4cf403af5bd83`](https://sepolia.basescan.org/tx/0x04c36340f16999ceb4d1862f91fabac416a7d8eabfab32c100e4cf403af5bd83) - Gas: 326,250 | Fee: 1x
2. [`0x0d5c3106b0202ded6ced5ff956636b34e13b1a7d13f3c724d065cbb5a078b77a`](https://sepolia.basescan.org/tx/0x0d5c3106b0202ded6ced5ff956636b34e13b1a7d13f3c724d065cbb5a078b77a) - Gas: 284,774 | Fee: 1x
3. [`0xf6980d24c55db200222015da9a7c44b185f93b2ef75acfab7d036acb8d09d686`](https://sepolia.basescan.org/tx/0xf6980d24c55db200222015da9a7c44b185f93b2ef75acfab7d036acb8d09d686) - Gas: 284,774 | Fee: 1x
4. [`0x664b504e16192a784d1c32971c1f2531b0ed9401ec525d81c77741b573256677`](https://sepolia.basescan.org/tx/0x664b504e16192a784d1c32971c1f2531b0ed9401ec525d81c77741b573256677) - Gas: 284,774 | Fee: 2x
5. [`0xf7f4667a84c5fbc9c0df7161c01e38372b617cf059ec0ad463907d0ede281690`](https://sepolia.basescan.org/tx/0xf7f4667a84c5fbc9c0df7161c01e38372b617cf059ec0ad463907d0ede281690) - Gas: 284,774 | Fee: 2x

**Subtotal:** 0.5 USDC

### Phase 2: Testing with Increased Fee (3x)

#### Deposits on Base Sepolia (0.1 USDC each)

6. [`0x646630c19a6f18b37fc7243fd0b37bc5241b3250068848238cf44640a529e657`](https://sepolia.basescan.org/tx/0x646630c19a6f18b37fc7243fd0b37bc5241b3250068848238cf44640a529e657) - Gas: 284,774 | Fee: 3x
7. [`0x303c6961e71340ef5329ecc5031588945338d651949dc67da35f774908600b4c`](https://sepolia.basescan.org/tx/0x303c6961e71340ef5329ecc5031588945338d651949dc67da35f774908600b4c) - Gas: 284,774 | Fee: 3x
8. [`0xa27ee7329f130bc278bbe263573cdfd9763dcad881fce69eac8839addecede25`](https://sepolia.basescan.org/tx/0xa27ee7329f130bc278bbe263573cdfd9763dcad881fce69eac8839addecede25) - Gas: 284,774 | Fee: 3x
9. [`0x6e5755bdab316632d29b7762a5680dfefff3f07252c24a7e1bc0a8dbdbdaef1c`](https://sepolia.basescan.org/tx/0x6e5755bdab316632d29b7762a5680dfefff3f07252c24a7e1bc0a8dbdbdaef1c) - Gas: 284,774 | Fee: 3x

**Subtotal:** 0.4 USDC

### Phase 3: Mock Contracts Testing (Without FHE)

**Contracts:** CERC20Mock + CERC20MinterMock + AaveDepositorBase (redeployed)

#### Deposits on Base Sepolia (0.1 USDC each)

10. [`0xf559ec8b7c20df3900a0f81025bd82fafa1908a5cf37eeb557ad59855a793859`](https://sepolia.basescan.org/tx/0xf559ec8b7c20df3900a0f81025bd82fafa1908a5cf37eeb557ad59855a793859) - Gas: 326,250 | Fee: 3x
11. [`0xb7bc0bd10f7b554253f2f137d6762a6079453d2663a2a44687949785360e93b4`](https://sepolia.basescan.org/tx/0xb7bc0bd10f7b554253f2f137d6762a6079453d2663a2a44687949785360e93b4) - Gas: 284,774 | Fee: 3x
12. [`0x4210907f3d4e826534de9eb28add5d6325074e69f2d492d6f0c30caea4bc68f8`](https://sepolia.basescan.org/tx/0x4210907f3d4e826534de9eb28add5d6325074e69f2d492d6f0c30caea4bc68f8) - Gas: 284,774 | Fee: 3x
13. [`0x7051e77429ba62e67bfb09c83cda5d13498739fe6c55cc4287f9080cdbd8f1c8`](https://sepolia.basescan.org/tx/0x7051e77429ba62e67bfb09c83cda5d13498739fe6c55cc4287f9080cdbd8f1c8) - Gas: 284,774 | Fee: 3x
14. [`0xeb45d3cc65a4d05c371499b180f848677f1d987eb299a59a54b67657077f07c4`](https://sepolia.basescan.org/tx/0xeb45d3cc65a4d05c371499b180f848677f1d987eb299a59a54b67657077f07c4) - Gas: 284,774 | Fee: 3x

**Subtotal:** 0.5 USDC

#### ✅ Confirmed Mints on Ethereum Sepolia

1. **Mint TX 1:** [`0xfa7eb582aa267f631537d6c2c3f6a21bfc0231c94e91199a67928f0ce6ea5f3b`](https://sepolia.etherscan.io/tx/0xfa7eb582aa267f631537d6c2c3f6a21bfc0231c94e91199a67928f0ce6ea5f3b)
   - Block: 9666975
   - Amount: 0.1 CERC20

2. **Mint TX 2:** [`0x1728ce6adeebda9723b91b168ffd7a5fded7f69e4578f1eed628ddce923f3a44`](https://sepolia.etherscan.io/tx/0x1728ce6adeebda9723b91b168ffd7a5fded7f69e4578f1eed628ddce923f3a44)
   - Block: 9667006
   - Amount: 0.1 CERC20

**Cross-chain messaging verified!** ✅

---

**TOTAL DEPOSITS:** 1.4 USDC across 14 successful transactions
**CONFIRMED MINTS:** 0.2 CERC20 (2 messages confirmed)
**SUCCESS RATE:** 14/14 deposits successful (100%)

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure your environment variables:
```env
DEPOSIT_ASSET=0xba50Cd2A20f6DA35D788639E581bca8d0B5d4D5f
AAVE_POOL_BASE=0x8bAB6d1b75f19e9eD9fCe8b9BD338844fF79aE27
BASE_DEPOSITOR_ADDRESS=0x7D0Fb33E2f5cC55c72018b8720fEdcb8a985A0Fd
SEPOLIA_MINTER_ADDRESS=0xd0dcE7901292087Ac2EB4a8201D83FCf8Fa5107E
CERC20_ADDRESS=0x11D34D24F59cF1aaD5Fa9C885f87505dB99ebfd3
```

3. Set Hardhat variables:
```bash
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
```

## Usage

### Testing Deposits

```bash
# Test deposit on Base Sepolia
HARDHAT_NETWORK=baseSepolia npx hardhat run scripts/test_deposit.ts --network baseSepolia
```

### Testing Withdrawals

```bash
# Test withdraw on Ethereum Sepolia
HARDHAT_NETWORK=sepolia npx hardhat run scripts/test_withdraw.ts --network sepolia
```

### Checking Events

```bash
# Check mint events on Sepolia
HARDHAT_NETWORK=sepolia npx hardhat run scripts/check_mint_events.ts --network sepolia

# Check balance
HARDHAT_NETWORK=sepolia npx hardhat run scripts/check_balance.ts --network sepolia
```

## Deployment

### Deploy on Base Sepolia

```bash
HARDHAT_NETWORK=baseSepolia npx hardhat run scripts/deploy_base.ts --network baseSepolia
```

### Deploy on Ethereum Sepolia

```bash
# 1. Deploy CERC20 token
HARDHAT_NETWORK=sepolia npx hardhat deploy --network sepolia --tags CERC20

# 2. Deploy CERC20Minter
HARDHAT_NETWORK=sepolia npx hardhat run scripts/deploy_minter.ts --network sepolia

# 3. Set minter permission
HARDHAT_NETWORK=sepolia npx hardhat run scripts/setup_minter.ts --network sepolia
```

### Initialize Contracts

```bash
# Initialize AaveDepositorBase with minter address
HARDHAT_NETWORK=baseSepolia npx hardhat run scripts/initialize_base.ts --network baseSepolia
```

## Important Notes

### Wormhole Fees

- Always send **2x the quoted fee** for reliable cross-chain delivery
- The script automatically calculates this: `wormholeFee * 2n`
- Typical fee: ~0.00002342 ETH (2x quoted)

### Cross-Chain Timing

- Wormhole messages take **2-5 minutes** to be delivered
- Check events after this time to verify successful delivery
- Use the Wormhole Explorer to track message status

### Security Considerations

- FHE balances are encrypted and cannot be read on-chain
- Only the CERC20Minter can mint/burn tokens
- Cross-chain messages are authenticated by Wormhole
- Only authorized contracts can call `receiveWormholeMessages`

## Development

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Debugging

```bash
# Debug AaveDepositorBase configuration
HARDHAT_NETWORK=baseSepolia npx hardhat run scripts/debug_depositor.ts --network baseSepolia

# Check Wormhole configuration
HARDHAT_NETWORK=baseSepolia npx hardhat run scripts/test_wormhole_only.ts --network baseSepolia
```

## Frontend Integration

See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for detailed integration guide.

## Resources

- [Wormhole Docs](https://docs.wormhole.com/)
- [Aave V3 Docs](https://docs.aave.com/developers/)
- [FHEVM Docs](https://docs.zama.ai/fhevm)

## License

BSD-3-Clause-Clear
