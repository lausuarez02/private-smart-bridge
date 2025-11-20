import { useState, useEffect } from 'react';
import { ethers, BrowserProvider, Contract, formatUnits } from 'ethers';
import { BASE_SEPOLIA_CONTRACTS } from '@/lib/contracts/config';
import { AAVE_DEPOSITOR_ABI } from '@/lib/contracts/abis';

export function useWormholeFee() {
  const [fee, setFee] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFee() {
      if (!window.ethereum) return;

      try {
        setLoading(true);
        const provider = new BrowserProvider(window.ethereum);

        const depositor = new Contract(
          BASE_SEPOLIA_CONTRACTS.AaveDepositorBase,
          AAVE_DEPOSITOR_ABI,
          provider
        );

        const feeQuote = await depositor.quoteCrossChainCost();
        const recommendedFee = feeQuote * 2n; // 2x for reliability

        setFee(formatUnits(recommendedFee, 18));
      } catch (error) {
        console.error('Error loading fee:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFee();
  }, []);

  return { fee, loading };
}
