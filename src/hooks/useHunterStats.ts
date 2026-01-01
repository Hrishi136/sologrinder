import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// XP thresholds for rank progression
export const RANK_TIERS = [
  { name: "E-Rank", color: "#87b7ff", xpRequired: 0 },
  { name: "D-Rank", color: "#4aa3ea", xpRequired: 500 },
  { name: "C-Rank", color: "#329fa8", xpRequired: 1500 },
  { name: "B-Rank", color: "#9cdc96", xpRequired: 4000 },
  { name: "A-Rank", color: "#e0c453", xpRequired: 10000 },
  { name: "S-Rank", color: "#ed3434", xpRequired: 25000 },
  { name: "SS-Rank", color: "#ba00ff", xpRequired: 60000 },
];

// Stat gains per difficulty
export const STAT_GAINS = {
  easy: { power: 5, xp: 10, resolve: 1 },
  medium: { power: 10, xp: 25, resolve: 2 },
  hard: { power: 20, xp: 50, resolve: 3 },
} as const;

export interface HunterStats {
  power: number;
  xp: number;
  resolve: number;
}

export interface RankInfo {
  name: string;
  color: string;
  xpRequired: number;
  nextRank: { name: string; xpRequired: number } | null;
  progress: number; // 0-100 percentage to next rank
}

function getRankFromXP(xp: number): RankInfo {
  let currentRank = RANK_TIERS[0];
  let nextRank: typeof RANK_TIERS[0] | null = RANK_TIERS[1] || null;
  
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (xp >= RANK_TIERS[i].xpRequired) {
      currentRank = RANK_TIERS[i];
      nextRank = RANK_TIERS[i + 1] || null;
      break;
    }
  }
  
  // Calculate progress to next rank
  let progress = 100;
  if (nextRank) {
    const xpInCurrentRank = xp - currentRank.xpRequired;
    const xpNeededForNext = nextRank.xpRequired - currentRank.xpRequired;
    progress = Math.min((xpInCurrentRank / xpNeededForNext) * 100, 100);
  }
  
  return {
    name: currentRank.name,
    color: currentRank.color,
    xpRequired: currentRank.xpRequired,
    nextRank: nextRank ? { name: nextRank.name, xpRequired: nextRank.xpRequired } : null,
    progress,
  };
}

export function useHunterStats() {
  const [stats, setStats] = useState<HunterStats>({ power: 0, xp: 0, resolve: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stats from database
  const fetchStats = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('hunter_stats')
        .select('power, xp, resolve')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setStats({ power: data.power, xp: data.xp, resolve: data.resolve });
      } else {
        // No stats yet, initialize with zeros
        setStats({ power: 0, xp: 0, resolve: 0 });
      }
    } catch (err) {
      console.error('Error fetching hunter stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  // Increment stats (called after quest completion)
  const incrementStats = useCallback(async (difficulty: 'easy' | 'medium' | 'hard'): Promise<HunterStats | null> => {
    try {
      const gains = STAT_GAINS[difficulty];
      
      const { data, error: rpcError } = await supabase.rpc('increment_hunter_stats', {
        p_power: gains.power,
        p_xp: gains.xp,
        p_resolve: gains.resolve,
      });

      if (rpcError) throw rpcError;

      // The RPC returns an array with one row
      if (data && Array.isArray(data) && data.length > 0) {
        const result = data[0] as { power: number; xp: number; resolve: number };
        const newStats = { 
          power: result.power, 
          xp: result.xp, 
          resolve: result.resolve 
        };
        setStats(newStats);
        return newStats;
      }
      
      return null;
    } catch (err) {
      console.error('Error incrementing hunter stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to update stats');
      return null;
    }
  }, []);

  // Get current rank derived from XP
  const rank = getRankFromXP(stats.xp);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Listen for auth changes to refetch stats
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchStats();
    });

    return () => subscription.unsubscribe();
  }, [fetchStats]);

  return {
    stats,
    rank,
    loading,
    error,
    incrementStats,
    refreshStats: fetchStats,
  };
}
