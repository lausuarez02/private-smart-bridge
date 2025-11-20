import { useState, useEffect } from 'react';
import axios from 'axios';

const DEFILLAMA_API = 'https://api.llama.fi';

interface ProtocolTVL {
  date: string;
  totalLiquidityUSD: number;
}

interface YieldPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward?: number;
}

export function useAaveTVL() {
  const [tvl, setTvl] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAaveTVL() {
      try {
        setLoading(true);
        // Get Aave protocol TVL
        const response = await axios.get(`${DEFILLAMA_API}/protocol/aave-v3`);
        // Get total TVL across all chains
        const currentTVL = response.data.tvl?.[response.data.tvl.length - 1]?.totalLiquidityUSD || 0;
        setTvl(currentTVL);
      } catch (err) {
        console.error('Error fetching Aave TVL:', err);
        setError('Failed to fetch TVL data');
      } finally {
        setLoading(false);
      }
    }

    fetchAaveTVL();
  }, []);

  return { tvl, loading, error };
}

export function useAaveYield() {
  const [yields, setYields] = useState<YieldPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchYields() {
      try {
        setLoading(true);
        // Get yield data for Aave pools
        const response = await axios.get(`${DEFILLAMA_API}/pools`);
        const aavePools = response.data.data
          .filter((pool: any) => pool.project === 'aave-v3')
          .slice(0, 10); // Get top 10 pools
        setYields(aavePools);
      } catch (err) {
        console.error('Error fetching yields:', err);
        setError('Failed to fetch yield data');
      } finally {
        setLoading(false);
      }
    }

    fetchYields();
  }, []);

  return { yields, loading, error };
}

export function useTVLChart(protocol: string = 'aave-v3') {
  const [data, setData] = useState<ProtocolTVL[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTVLHistory() {
      try {
        setLoading(true);
        const response = await axios.get(`${DEFILLAMA_API}/protocol/${protocol}`);
        const tvlData = response.data.tvl || [];
        setData(tvlData.slice(-30)); // Last 30 days
      } catch (err) {
        console.error('Error fetching TVL history:', err);
        setError('Failed to fetch TVL history');
      } finally {
        setLoading(false);
      }
    }

    fetchTVLHistory();
  }, [protocol]);

  return { data, loading, error };
}

export function useChainTVL() {
  const [chains, setChains] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChains() {
      try {
        setLoading(true);
        const response = await axios.get(`${DEFILLAMA_API}/v2/chains`);
        const chainData = response.data.reduce((acc: any, chain: any) => {
          acc[chain.name] = chain.tvl;
          return acc;
        }, {});
        setChains(chainData);
      } catch (err) {
        console.error('Error fetching chain TVL:', err);
        setError('Failed to fetch chain TVL');
      } finally {
        setLoading(false);
      }
    }

    fetchChains();
  }, []);

  return { chains, loading, error };
}
