import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useStreakTracker() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get current date in IST
  const getISTDate = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istTime = new Date(now.getTime() + istOffset);
    return istTime.toISOString().split('T')[0];
  };

  // Calculate streak based on consecutive days of activity
  const calculateStreak = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all activity days ordered by date descending
      const { data: activityDays, error } = await supabase
        .from('user_daily_activity')
        .select('day')
        .eq('user_id', user.id)
        .order('day', { ascending: false });

      if (error) {
        console.error('Error fetching activity days:', error);
        return;
      }

      if (!activityDays || activityDays.length === 0) {
        setCurrentStreak(0);
        return;
      }

      let streak = 0;
      const today = getISTDate();
      const todayDate = new Date(today);

      for (const activity of activityDays) {
        const activityDate = new Date(activity.day);
        const daysDiff = Math.floor((todayDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === streak) {
          streak++;
        } else {
          break;
        }
      }

      setCurrentStreak(streak);
    } catch (error) {
      console.error('Error calculating streak:', error);
    } finally {
      setLoading(false);
    }
  };

  // Track today's activity
  const trackTodayActivity = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = getISTDate();
      
      // Insert today's activity (will be ignored if already exists due to unique constraint)
      const { error } = await supabase
        .from('user_daily_activity')
        .upsert([{
          user_id: user.id,
          day: today
        }], {
          onConflict: 'user_id,day'
        });

      if (error) {
        console.error('Error tracking daily activity:', error);
        return;
      }

      // Recalculate streak
      await calculateStreak();
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  useEffect(() => {
    calculateStreak();
    trackTodayActivity(); // Track today's activity when component mounts
  }, []);

  return {
    currentStreak,
    loading,
    trackTodayActivity,
    refreshStreak: calculateStreak
  };
}