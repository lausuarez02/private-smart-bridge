'use client';

import { useUserBalance } from '@/hooks/useUserBalance';
import { DepositDialog } from '@/components/deposit-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function DashboardHeader() {
  const { usdBalance, pnl, loading } = useUserBalance();

  return (
    <div className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
      <div className="px-8 py-4">
        <div className="flex items-center justify-end gap-6">
          {/* Balance Section */}
          <div className="flex items-center gap-4">
            {loading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  ${usdBalance}
                </div>
                <div className="flex items-center justify-end gap-2 mt-0.5">
                  <span className="text-xs text-zinc-400">Total PNL</span>
                  <span className="text-xs text-cyan-400 font-semibold">
                    (${(parseFloat(usdBalance) * (pnl / 100)).toFixed(2)})
                  </span>
                </div>
              </div>
            )}

            {/* PNL Badge */}
            {!loading && (
              <Badge
                variant="secondary"
                className={`flex items-center gap-1 px-2.5 py-1 ${
                  pnl >= 0
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}
              >
                {pnl >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {pnl >= 0 ? '+' : ''}
                {pnl.toFixed(2)}%
              </Badge>
            )}
          </div>

          {/* Deposit Button */}
          <DepositDialog />
        </div>
      </div>
    </div>
  );
}
