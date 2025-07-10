import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type Challenge = Tables<'Challenges'>;
type ChallengeInsert = TablesInsert<'Challenges'>;

interface ChallengeCreate {
  title: string;
  description?: string;
  steps: string;
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's challenges
  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch challenges');
    } finally {
      setLoading(false);
    }
  };

  // Create new challenge
  const createChallenge = async (challenge: ChallengeCreate): Promise<Challenge | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const challengeData: ChallengeInsert = {
        title: challenge.title,
        description: challenge.description,
        steps: challenge.steps,
        user_id: user.id,
        progress_json: {},
        streak: 0
      };

      const { data, error } = await supabase
        .from('Challenges')
        .insert([challengeData])
        .select()
        .single();

      if (error) throw error;

      setChallenges(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create challenge');
      return null;
    }
  };

  // Update challenge progress
  const updateChallenge = async (id: string, updates: Partial<Challenge>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('Challenges')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setChallenges(prev => 
        prev.map(challenge => 
          challenge.id === id ? { ...challenge, ...updates } : challenge
        )
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update challenge');
      return false;
    }
  };

  // Delete challenge
  const deleteChallenge = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('Challenges')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setChallenges(prev => prev.filter(challenge => challenge.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete challenge');
      return false;
    }
  };

  // Mark challenge as completed (increment streak)
  const completeChallenge = async (id: string): Promise<boolean> => {
    const challenge = challenges.find(c => c.id === id);
    if (!challenge) return false;

    return updateChallenge(id, {
      streak: (challenge.streak || 0) + 1,
      progress_json: {
        ...challenge.progress_json as object,
        lastCompleted: new Date().toISOString(),
        totalCompletions: ((challenge.progress_json as any)?.totalCompletions || 0) + 1
      }
    });
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return {
    challenges,
    loading,
    error,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    completeChallenge,
    refreshChallenges: fetchChallenges
  };
}