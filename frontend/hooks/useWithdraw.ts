import { useState } from 'react';
import { BrowserProvider, Contract, parseUnits, formatUnits } from 'ethers';
import { SEPOLIA_CONTRACTS } from '@/lib/contracts/config';
import { CERC20_MINTER_ABI } from '@/lib/contracts/abis';

export function useWithdraw() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const withdraw = async (amount: string) => {
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

      // 2. Switch to Sepolia
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xAA36A7' }], // 11155111 in hex
        });
      } catch (switchError: any) {
        // Chain not added, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xAA36A7',
              chainName: 'Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            }],
          });
        } else {
          throw switchError;
        }
      }

      // 3. Get contract instance
      const minter = new Contract(
        SEPOLIA_CONTRACTS.CERC20Minter,
        CERC20_MINTER_ABI,
        signer
      );

      // 4. Parse amount (6 decimals to match USDC)
      const amountWei = parseUnits(amount, 6);

      // 5. Get Wormhole fee (send 2x for reliability)
      const feeQuote = await minter.quoteCrossChainCost();
      const wormholeFee = feeQuote * 2n;

      // 6. Withdraw (this burns FHE tokens and sends message to Base)
      console.log('Withdrawing...');
      const withdrawTx = await minter.withdraw(amountWei, {
        value: wormholeFee,
      });

      const receipt = await withdrawTx.wait();
      console.log('Withdraw successful!', receipt?.hash);

      setTxHash(receipt?.hash || null);

      return {
        txHash: receipt?.hash,
        amount: formatUnits(amountWei, 6),
        wormholeFee: formatUnits(wormholeFee, 18),
      };
    } catch (err: any) {
      console.error('Withdraw error:', err);
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { withdraw, loading, error, txHash };
}
