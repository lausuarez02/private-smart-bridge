import { useState } from 'react';
import { ethers, BrowserProvider, Contract, parseUnits, formatUnits } from 'ethers';
import { BASE_SEPOLIA_CONTRACTS } from '@/lib/contracts/config';
import { AAVE_DEPOSITOR_ABI, ERC20_ABI } from '@/lib/contracts/abis';

export function useDeposit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const deposit = async (amount: string) => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask');
    }

    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      // 1. Connect wallet
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // 2. Switch to Base Sepolia
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x14A34' }], // 84532 in hex
        });
      } catch (switchError: any) {
        // Chain not added, add it
        if (switchError.code === 4902) {
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
        } else {
          throw switchError;
        }
      }

      // Verify we're on the right chain
      const network = await provider.getNetwork();
      console.log('Connected to chain ID:', network.chainId.toString());
      if (network.chainId !== 84532n) {
        throw new Error('Please switch to Base Sepolia network');
      }

      // 3. Get contract instances
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

      // 4. Parse amount (USDC has 6 decimals)
      const amountWei = parseUnits(amount, 6);

      // 5. Check USDC balance
      try {
        const balance = await usdc.balanceOf(userAddress);
        console.log('USDC Balance:', formatUnits(balance, 6), 'USDC');
        console.log('Requested amount:', formatUnits(amountWei, 6), 'USDC');

        if (balance < amountWei) {
          throw new Error(`Insufficient USDC balance. You have ${formatUnits(balance, 6)} USDC but need ${formatUnits(amountWei, 6)} USDC`);
        }
      } catch (err: any) {
        if (err.message.includes('Insufficient')) throw err;
        console.error('Error checking USDC balance:', err);
        // Continue anyway if we can't check the balance
        console.log('Continuing with deposit despite balance check error');
      }

      // 6. Get Wormhole fee (send 2x for reliability)
      const feeQuote = await depositor.quoteCrossChainCost();
      const wormholeFee = feeQuote * 2n;

      // 7. Check allowance
      const allowance = await usdc.allowance(
        userAddress,
        BASE_SEPOLIA_CONTRACTS.AaveDepositorBase
      );
      console.log('Current allowance:', formatUnits(allowance, 6), 'USDC');
      console.log('Required allowance:', formatUnits(amountWei, 6), 'USDC');

      // 8. Approve maximum amount to avoid future approvals
      const maxApproval = ethers.MaxUint256;
      if (allowance < amountWei) {
        console.log('Approving maximum USDC for AaveDepositorBase...');
        console.log('Approving to contract:', BASE_SEPOLIA_CONTRACTS.AaveDepositorBase);
        const approveTx = await usdc.approve(
          BASE_SEPOLIA_CONTRACTS.AaveDepositorBase,
          maxApproval
        );
        console.log('Approval transaction sent, waiting for confirmation...');
        const approvalReceipt = await approveTx.wait();
        console.log('USDC approved with max allowance! Tx:', approvalReceipt?.hash);
      } else {
        console.log('Sufficient allowance already exists, skipping approval');
      }

      // 9. Deposit
      console.log('Depositing...');
      const depositTx = await depositor.deposit(amountWei, {
        value: wormholeFee,
      });

      const receipt = await depositTx.wait();
      console.log('Deposit successful!', receipt?.hash);

      setTxHash(receipt?.hash || null);

      return {
        txHash: receipt?.hash,
        amount: formatUnits(amountWei, 6),
        wormholeFee: formatUnits(wormholeFee, 18),
      };
    } catch (err: any) {
      console.error('Deposit error:', err);
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deposit, loading, error, txHash };
}
