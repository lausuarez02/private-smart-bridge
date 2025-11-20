'use client';

import { DepositDialog } from '@/components/deposit-dialog';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Shizen Gate" width={400} height={200} priority />
        </div>

        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Cross-Chain FHE Lending</h1>
          <p className="text-zinc-400 text-lg">
            Deposit USDC on Base Sepolia and earn yield through Aave with FHE-encrypted privacy on Sepolia
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">$0</div>
            <div className="text-sm text-zinc-400">Total Deposited</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">5.24%</div>
            <div className="text-sm text-zinc-400">Current APY</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">$0</div>
            <div className="text-sm text-zinc-400">Your Balance</div>
          </div>
        </div>

        {/* Deposit Button */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Start Earning</h2>
              <p className="text-zinc-400">
                Deposit USDC to start earning yield. Your deposit is secured with FHE encryption for complete privacy.
              </p>
            </div>

            <DepositDialog />

            <div className="text-xs text-zinc-500 space-y-1">
              <p>• Cross-chain deposit from Base Sepolia to Sepolia</p>
              <p>• Powered by Wormhole for secure message relay</p>
              <p>• Your balance is encrypted with Fully Homomorphic Encryption</p>
              <p>• Funds are deposited to Aave for yield generation</p>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
          <div className="space-y-3 text-sm text-zinc-400">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <div className="font-medium text-white">Deposit USDC</div>
                <div>Connect your wallet and deposit USDC on Base Sepolia</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <div className="font-medium text-white">Cross-Chain Transfer</div>
                <div>Wormhole relays your deposit to Sepolia (2-5 minutes)</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <div className="font-medium text-white">Earn Yield</div>
                <div>Your funds are deposited to Aave and start earning interest</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div>
                <div className="font-medium text-white">FHE Privacy</div>
                <div>Your balance is encrypted with FHE for complete privacy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
