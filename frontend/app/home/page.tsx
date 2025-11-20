'use client';

import Image from 'next/image';
import { BalanceSection } from '@/components/balance-section';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { TVLChart } from '@/components/tvl-chart';
import { ConnectWalletButton } from '@/components/connect-wallet-button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header with Logo and Connect Wallet */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        <Image src="/logo.png" alt="Shizen Gate" width={100} height={50} priority />
        <ConnectWalletButton />
      </div>

      {/* Main Content */}
      <div className="p-8 pt-24 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-sm text-zinc-400">
            Cross-Chain FHE Lending - Deposit USDC on Base Sepolia and earn yield through Aave
          </p>
        </div>

        {/* Balance and Deposit Section */}
        <BalanceSection />

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
