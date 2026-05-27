import { useState, useEffect } from 'react';
import { useChallengesV2 } from './useChallengesV2';
import { useStreakTracker } from './useStreakTracker';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceStats {
  powerLevel: number;
  totalQuests: number;
  successRate: number;
  streak: number;
  daysActive: number;
  questCount: {
    easy: number;
    medium: number;
    hard: number;
  };
  categoryStats: {
    combat: number;
    intelligence: number;
    agility: number;
    vitality: number;
    special: number;
  };
  weeklyCompletions: Array<{
    week: string;
    easy: number;
    medium: number;
    hard: number;
  }>;
}

export function usePerformanceData() {
  const { challenges, loading: challengesLoading } = useChallengesV2();
  const { currentStreak, loading: streakLoading } = useStreakTracker();
  const [performanceData, setPerformanceData] = useState<PerformanceStats>({
    powerLevel: 0, // Start at 0 for new accounts
    totalQuests: 0,
    successRate: 100,
    streak: 0,
    daysActive: 0,
    questCount: { easy: 0, medium: 0, hard: 0 },
    categoryStats: { combat: 0, intelligence: 0, agility: 0, vitality: 0, special: 0 },
    weeklyCompletions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!challengesLoading && !streakLoading && challenges.length >= 0) {
      calculatePerformanceStats();
    }
  }, [challenges, challengesLoading, streakLoading, currentStreak]);

  const calculatePerformanceStats = async () => {
    try {
      // Get real days active from daily activity tracking
      const { data: { user } } = await supabase.auth.getUser();
      
      // Count unique active days
      const { data: activityDays, error: activityError } = await supabase
        .from('user_daily_activity')
        .select('day')
        .eq('user_id', user?.id || '');

      if (activityError) {
        console.error('Error fetching activity days:', activityError);
      }

      const daysActive = activityDays?.length || 1;

      let questCount = { easy: 0, medium: 0, hard: 0 };
      let categoryStats = { combat: 0, intelligence: 0, agility: 0, vitality: 0, special: 0 };
      let totalCompletions = 0;
      let totalStreak = 0;

      challenges.forEach(challenge => {
        const category = challenge.category || 'Combat Training';
        const difficulty = challenge.difficulty || 'easy';

        // Count by difficulty
        if (difficulty === 'easy') questCount.easy++;
        else if (difficulty === 'medium') questCount.medium++;
        else if (difficulty === 'hard') questCount.hard++;

        // Count by category
        const categoryMap: Record<string, keyof typeof categoryStats> = {
          'Combat Training': 'combat',
          'Intelligence Gathering': 'intelligence',
          'Agility Development': 'agility',
          'Vital Enhancement': 'vitality',
          'Special Quests': 'special'
        };
        const categoryKey = categoryMap[category] || 'combat';
        categoryStats[categoryKey]++;

        // Add completions and streak - use the new challenge progress system
        const completions = challenge.streak || 0;
        totalCompletions += completions;
        totalStreak += challenge.streak || 0;
      });

      // Calculate power level based on completions and difficulty with round level thresholds
      const basePoints = questCount.easy * 15 +
        questCount.medium * 30 +
        questCount.hard * 50 +
        totalCompletions * 10;

      // Power level starts at 0 for new accounts, increases with quest completions
      const powerLevel = basePoints;

      // Generate weekly completion data (mock for now)
      const weeklyCompletions = [
        { week: 'Week 1', easy: Math.floor(questCount.easy * 0.2), medium: Math.floor(questCount.medium * 0.2), hard: Math.floor(questCount.hard * 0.2) },
        { week: 'Week 2', easy: Math.floor(questCount.easy * 0.4), medium: Math.floor(questCount.medium * 0.4), hard: Math.floor(questCount.hard * 0.4) },
        { week: 'Week 3', easy: Math.floor(questCount.easy * 0.7), medium: Math.floor(questCount.medium * 0.7), hard: Math.floor(questCount.hard * 0.7) },
        { week: 'This Week', easy: questCount.easy, medium: questCount.medium, hard: questCount.hard }
      ];

      setPerformanceData({
        powerLevel,
        totalQuests: challenges.length,
        successRate: challenges.length > 0 ? Math.round((totalCompletions / Math.max(challenges.length, 1)) * 100) : 100,
        streak: currentStreak, // Use the real IST-based streak
        daysActive,
        questCount,
        categoryStats,
        weeklyCompletions
      });

    } catch (error) {
      console.error('Error calculating performance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...performanceData,
    loading: loading || challengesLoading || streakLoading,
    refreshData: calculatePerformanceStats
  };
}