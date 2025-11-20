import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Shizen Gate',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [baseSepolia, sepolia],
  ssr: true,
});
