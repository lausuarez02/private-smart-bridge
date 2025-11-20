'use client';

import { useTVLChart } from '@/hooks/useDefiLlama';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  tvl: {
    label: 'TVL',
    color: 'hsl(180, 100%, 50%)',
  },
};

export function TVLChart() {
  const { data, loading } = useTVLChart('aave-v3');

  // Format data for recharts
  const chartData = data.map((item) => ({
    date: new Date(parseInt(item.date) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    tvl: item.totalLiquidityUSD / 1e9, // Convert to billions
  }));

  if (loading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Total Visitors</CardTitle>
          <CardDescription className="text-zinc-400">Total for the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Protocol TVL</CardTitle>
            <CardDescription className="text-zinc-400">Total Value Locked over time</CardDescription>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors">
              Last 3 months
            </button>
            <button className="px-3 py-1 text-xs rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors">
              Last 30 days
            </button>
            <button className="px-3 py-1 text-xs rounded-md bg-zinc-700 text-white">
              Last 7 days
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3.7%, 15.9%)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="hsl(240, 5%, 64.9%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(240, 5%, 64.9%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(1)}B`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="tvl"
              stroke="hsl(180, 100%, 50%)"
              strokeWidth={2}
              fill="url(#colorTvl)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
