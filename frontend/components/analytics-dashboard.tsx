'use client';

import { useAaveTVL, useAaveYield, useChainTVL } from '@/hooks/useDefiLlama';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, DollarSign, Percent, Network } from 'lucide-react';
import { TVLChart } from '@/components/tvl-chart';

export function AnalyticsDashboard() {
  const { tvl: aaveTVL, loading: tvlLoading } = useAaveTVL();
  const { yields, loading: yieldsLoading } = useAaveYield();
  const { chains, loading: chainsLoading } = useChainTVL();

  // Get top chains by TVL
  const topChains = Object.entries(chains)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Aave TVL */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Aave Protocol TVL
            </CardTitle>
            <DollarSign className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            {tvlLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold text-white">
                  ${(aaveTVL / 1e9).toFixed(2)}B
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Total Value Locked
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Current APY */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Your Current APY
            </CardTitle>
            <Percent className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">5.24%</div>
            <p className="text-xs text-zinc-500 mt-1">
              USDC on Aave
            </p>
          </CardContent>
        </Card>

        {/* Total Deposited */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Protocol Deposits
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$0</div>
            <p className="text-xs text-zinc-500 mt-1">
              Total deposited via Shizen Gate
            </p>
          </CardContent>
        </Card>

        {/* Cross-Chain Volume */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Cross-Chain Volume
            </CardTitle>
            <Network className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$0</div>
            <p className="text-xs text-zinc-500 mt-1">
              Bridged via Wormhole
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* TVL Chart */}
        <TVLChart />

        {/* Top Chains by TVL */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Top Chains by TVL</CardTitle>
            <CardDescription className="text-zinc-400">
              Total value locked across networks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chainsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {topChains.map(([chain, tvl], index) => (
                  <div key={chain}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-white">{chain}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          ${(tvl / 1e9).toFixed(2)}B
                        </div>
                        <p className="text-xs text-zinc-500">TVL</p>
                      </div>
                    </div>
                    {index < topChains.length - 1 && (
                      <Separator className="bg-zinc-800" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* How It Works Section */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">How Shizen Gate Works</CardTitle>
          <CardDescription className="text-zinc-400">
            Cross-chain FHE lending powered by Wormhole and Aave
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-semibold text-white">Deposit USDC</h4>
              <p className="text-sm text-zinc-400">
                Connect your wallet and deposit USDC on Base Sepolia
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-semibold text-white">Cross-Chain Transfer</h4>
              <p className="text-sm text-zinc-400">
                Wormhole relays your deposit to Sepolia (2-5 minutes)
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-semibold text-white">Earn Yield</h4>
              <p className="text-sm text-zinc-400">
                Your funds are deposited to Aave and start earning interest
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                4
              </div>
              <h4 className="font-semibold text-white">FHE Privacy</h4>
              <p className="text-sm text-zinc-400">
                Your balance is encrypted with FHE for complete privacy
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
