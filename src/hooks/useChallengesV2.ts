import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type Challenge = Tables<'challenges'>;
type ChallengeProgress = Tables<'challenge_progress'>;
type ChallengeInsert = TablesInsert<'challenges'>;
type ProgressInsert = TablesInsert<'challenge_progress'>;

interface ChallengeWithProgress extends Challenge {
  completionsToday: number;
  streak: number;
}

export function useChallengesV2() {
  const [challenges, setChallenges] = useState<ChallengeWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch challenges with today's progress
  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];

      // Get challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (challengesError) throw challengesError;

      // Get today's progress for all challenges (count all records for today)
      const { data: progressData, error: progressError } = await supabase
        .from('challenge_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .eq('completed', true);

      if (progressError) throw progressError;

      // Calculate completions today for each challenge
      const challengesWithProgress = await Promise.all(
        (challengesData || []).map(async (challenge) => {
          // Count how many times this challenge was completed today
          const completionsToday = (progressData || []).filter(
            p => p.challenge_id === challenge.id
          ).length;
          
          const streak = await calculateStreak(challenge.id);
          
          return {
            ...challenge,
            completionsToday,
            streak
          };
        })
      );

      setChallenges(challengesWithProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch challenges');
    } finally {
      setLoading(false);
    }
  };

  // Calculate streak for a challenge (consecutive days with at least 1 completion)
  const calculateStreak = async (challengeId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('challenge_progress')
        .select('date')
        .eq('challenge_id', challengeId)
        .eq('completed', true)
        .order('date', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return 0;

      // Get unique dates
      const uniqueDates = [...new Set(data.map(p => p.date))].sort().reverse();
      
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (const dateStr of uniqueDates) {
        const progressDate = new Date(dateStr);
        progressDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - streak);
        
        if (progressDate.getTime() === expectedDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch (err) {
      console.error('Error calculating streak:', err);
      return 0;
    }
  };

  // Create new challenge
  const createChallenge = async (title: string, category?: string, difficulty?: string, description?: string): Promise<ChallengeWithProgress | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const challengeData: ChallengeInsert = {
        title,
        category,
        difficulty,
        description,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('challenges')
        .insert([challengeData])
        .select()
        .single();

      if (error) throw error;

      const newChallenge: ChallengeWithProgress = {
        ...data,
        completionsToday: 0,
        streak: 0
      };

      setChallenges(prev => [newChallenge, ...prev]);
      return newChallenge;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create challenge');
      return null;
    }
  };

  // Complete challenge (add a new completion record for today)
  const completeChallenge = async (challengeId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];

      // Insert a new completion record (allows multiple per day)
      const progressData: ProgressInsert = {
        user_id: user.id,
        challenge_id: challengeId,
        date: today,
        completed: true
      };

      const { data, error } = await supabase
        .from('challenge_progress')
        .insert([progressData])
        .select()
        .single();

      if (error) throw error;

      // Only update if insert was successful
      if (data) {
        // Update local state immediately - increment completions today
        setChallenges(prev => 
          prev.map(c => 
            c.id === challengeId 
              ? { ...c, completionsToday: c.completionsToday + 1, streak: c.streak || 1 }
              : c
          )
        );
      }

      return true;
    } catch (err) {
      console.error('Failed to complete challenge:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete challenge');
      return false;
    }
  };

  // Delete challenge
  const deleteChallenge = async (challengeId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', challengeId);

      if (error) throw error;

      setChallenges(prev => prev.filter(c => c.id !== challengeId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete challenge');
      return false;
    }
  };

  // Get weekly progress data for a challenge
  const getWeeklyProgress = async (challengeId: string): Promise<{ date: string; count: number }[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get last 7 days
      const dates: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }

      const { data, error } = await supabase
        .from('challenge_progress')
        .select('date')
        .eq('challenge_id', challengeId)
        .eq('completed', true)
        .in('date', dates);

      if (error) throw error;

      // Count completions per day
      return dates.map(date => ({
        date,
        count: (data || []).filter(p => p.date === date).length
      }));
    } catch (err) {
      console.error('Error getting weekly progress:', err);
      return [];
    }
  };

  // Get active days count (days with at least one completion)
  const getActiveDays = async (): Promise<number> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data, error } = await supabase
        .from('challenge_progress')
        .select('date')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (error) throw error;

      // Count unique dates
      const uniqueDates = new Set((data || []).map(p => p.date));
      return uniqueDates.size;
    } catch (err) {
      console.error('Error getting active days:', err);
      return 0;
    }
  };

  // Set up real-time subscriptions (only for challenges table, not progress to avoid race conditions)
  useEffect(() => {
    const challengesSubscription = supabase
      .channel('challenges-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'challenges' }, 
        () => fetchChallenges()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(challengesSubscription);
    };
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, []);

  return {
    challenges,
    loading,
    error,
    createChallenge,
    completeChallenge,
    deleteChallenge,
    getWeeklyProgress,
    getActiveDays,
    refreshChallenges: fetchChallenges
  };
}