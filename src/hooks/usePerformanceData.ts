import { useState, useEffect } from 'react';
import { useChallenges } from './useChallenges';
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
  const { challenges, loading: challengesLoading } = useChallenges();
  const [performanceData, setPerformanceData] = useState<PerformanceStats>({
    powerLevel: 0,
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
    if (!challengesLoading && challenges.length >= 0) {
      calculatePerformanceStats();
    }
  }, [challenges, challengesLoading]);

  const calculatePerformanceStats = async () => {
    try {
      // Get user creation date for days active calculation
      const { data: { user } } = await supabase.auth.getUser();
      const userCreatedAt = user?.created_at ? new Date(user.created_at) : new Date();
      const daysActive = Math.max(1, Math.ceil((Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24)));

      let questCount = { easy: 0, medium: 0, hard: 0 };
      let categoryStats = { combat: 0, intelligence: 0, agility: 0, vitality: 0, special: 0 };
      let totalCompletions = 0;
      let totalStreak = 0;

      challenges.forEach(challenge => {
        let category = 'Combat Training';
        let difficulty = 'easy';
        let points = 10;
        
        try {
          const steps = JSON.parse(challenge.steps || '{}');
          category = steps.category || 'Combat Training';
          difficulty = steps.difficulty || 'easy';
          points = steps.points || 10;
        } catch (e) {
          // Use defaults
        }

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

        // Add completions and streak
        const completions = (challenge.progress_json as any)?.totalCompletions || challenge.streak || 0;
        totalCompletions += completions;
        totalStreak += challenge.streak || 0;
      });

      // Calculate power level based on completions and difficulty
      const powerLevel = Math.max(100, 
        questCount.easy * 15 + 
        questCount.medium * 30 + 
        questCount.hard * 50 + 
        totalCompletions * 10
      );

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
        streak: Math.round(totalStreak / Math.max(challenges.length, 1)),
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
    loading: loading || challengesLoading,
    refreshData: calculatePerformanceStats
  };
}