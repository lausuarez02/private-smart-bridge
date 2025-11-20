'use client';

import { useUserBalance } from '@/hooks/useUserBalance';
import { DepositDrawer } from '@/components/deposit-drawer';
import { WithdrawDrawer } from '@/components/withdraw-drawer';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function BalanceSection() {
  const { usdBalance, pnl, loading } = useUserBalance();

  return (
    <div className="flex items-center justify-between py-6">
      {/* Balance Section */}
      <div className="flex items-center gap-4">
        {loading ? (
          <Skeleton className="h-12 w-32" />
        ) : (
          <div>
            <div className="text-5xl font-bold text-white">
              ${usdBalance}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-zinc-400">Total PNL</span>
              <span className="text-sm text-cyan-400 font-semibold">
                (${(parseFloat(usdBalance) * (pnl / 100)).toFixed(2)})
              </span>
            </div>
          </div>
        )}

        {/* PNL Badge */}
        {!loading && (
          <Badge
            variant="secondary"
            className={`flex items-center gap-1 px-3 py-1.5 text-sm ${
              pnl >= 0
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}
          >
            {pnl >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {pnl >= 0 ? '+' : ''}
            {pnl.toFixed(2)}%
          </Badge>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <WithdrawDrawer />
        <DepositDrawer />
      </div>
    </div>
  );
}
