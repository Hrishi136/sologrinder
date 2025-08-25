import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type Challenge = Tables<'challenges'>;
type ChallengeProgress = Tables<'challenge_progress'>;
type ChallengeInsert = TablesInsert<'challenges'>;
type ProgressInsert = TablesInsert<'challenge_progress'>;

interface ChallengeWithProgress extends Challenge {
  todayCompleted: boolean;
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

      // Get today's progress for all challenges
      const { data: progressData, error: progressError } = await supabase
        .from('challenge_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today);

      if (progressError) throw progressError;

      // Calculate streaks for each challenge
      const challengesWithProgress = await Promise.all(
        (challengesData || []).map(async (challenge) => {
          const todayProgress = progressData?.find(p => p.challenge_id === challenge.id);
          const streak = await calculateStreak(challenge.id);
          
          return {
            ...challenge,
            todayCompleted: todayProgress?.completed || false,
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

  // Calculate streak for a challenge
  const calculateStreak = async (challengeId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('challenge_progress')
        .select('date, completed')
        .eq('challenge_id', challengeId)
        .eq('completed', true)
        .order('date', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) return 0;

      let streak = 0;
      const today = new Date();
      
      for (const progress of data) {
        const progressDate = new Date(progress.date);
        const daysDiff = Math.floor((today.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
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
  const createChallenge = async (title: string, category?: string): Promise<ChallengeWithProgress | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const challengeData: ChallengeInsert = {
        title,
        category,
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
        todayCompleted: false,
        streak: 0
      };

      setChallenges(prev => [newChallenge, ...prev]);
      return newChallenge;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create challenge');
      return null;
    }
  };

  // Toggle challenge completion for today
  const toggleChallengeCompletion = async (challengeId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return false;

      if (challenge.todayCompleted) {
        // Remove today's completion
        const { error } = await supabase
          .from('challenge_progress')
          .delete()
          .eq('challenge_id', challengeId)
          .eq('date', today);

        if (error) throw error;
      } else {
        // Add today's completion
        const progressData: ProgressInsert = {
          user_id: user.id,
          challenge_id: challengeId,
          date: today,
          completed: true
        };

        const { error } = await supabase
          .from('challenge_progress')
          .upsert([progressData]);

        if (error) throw error;
      }

      // Update local state
      setChallenges(prev => 
        prev.map(c => 
          c.id === challengeId 
            ? { ...c, todayCompleted: !c.todayCompleted }
            : c
        )
      );

      // Recalculate streak
      const newStreak = await calculateStreak(challengeId);
      setChallenges(prev => 
        prev.map(c => 
          c.id === challengeId 
            ? { ...c, streak: newStreak }
            : c
        )
      );

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle challenge');
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

  // Set up real-time subscriptions
  useEffect(() => {
    
    const challengesSubscription = supabase
      .channel('challenges-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'challenges' }, 
        () => fetchChallenges()
      )
      .subscribe();

    const progressSubscription = supabase
      .channel('progress-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'challenge_progress' }, 
        () => fetchChallenges()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(challengesSubscription);
      supabase.removeChannel(progressSubscription);
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
    toggleChallengeCompletion,
    deleteChallenge,
    refreshChallenges: fetchChallenges
  };
}