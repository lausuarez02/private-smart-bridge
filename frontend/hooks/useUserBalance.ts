import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import { SEPOLIA_CONTRACTS } from '@/lib/contracts/config';
import { CERC20_ABI } from '@/lib/contracts/abis';

export function useUserBalance() {
  const [balance, setBalance] = useState<string>('0');
  const [usdBalance, setUsdBalance] = useState<string>('0');
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<string | null>(null);
  const [pnl, setPnl] = useState<number>(0);

  useEffect(() => {
    async function fetchBalance() {
      if (!window.ethereum) {
        setLoading(false);
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);

        // Get accounts without requesting (to avoid popup)
        const accounts = await provider.send('eth_accounts', []);

        if (accounts.length === 0) {
          setLoading(false);
          return;
        }

        const userAddress = accounts[0];
        setAddress(userAddress);

        // Get CERC20 balance on Sepolia
        const cerc20 = new Contract(
          SEPOLIA_CONTRACTS.CERC20,
          CERC20_ABI,
          provider
        );

        const encryptedBalance = await cerc20.balanceOf(userAddress);
        const formattedBalance = formatUnits(encryptedBalance, 6);

        setBalance(formattedBalance);

        // Calculate USD value (assuming 1:1 with USDC)
        const usdValue = parseFloat(formattedBalance);
        setUsdBalance(usdValue.toFixed(2));

        // Mock PNL calculation (you'd calculate this based on deposit time and current yield)
        setPnl(0.0); // For now, 0% PNL

      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on?.('accountsChanged', fetchBalance);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener?.('accountsChanged', fetchBalance);
      }
    };
  }, []);

  return { balance, usdBalance, pnl, loading, address };
}
