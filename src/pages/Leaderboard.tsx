import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import ProfileButton from '@/components/ProfileButton';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  rank: number;
  totalChallenges: number;
  activeChallenges: number;
  completedToday: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Get all users with their challenge data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, user_id');

      if (profilesError) throw profilesError;

      // Get challenge data for scoring
      const leaderboardData = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Get user's challenges
          const { data: challenges } = await supabase
            .from('challenges')
            .select('id')
            .eq('user_id', profile.user_id)
            .eq('is_active', true);

          // Get user's progress
          const { data: progress } = await supabase
            .from('challenge_progress')
            .select('*')
            .eq('user_id', profile.user_id)
            .eq('completed', true);

          // Get today's completions
          const today = new Date().toISOString().split('T')[0];
          const { data: todayProgress } = await supabase
            .from('challenge_progress')
            .select('*')
            .eq('user_id', profile.user_id)
            .eq('date', today)
            .eq('completed', true);

          const totalChallenges = challenges?.length || 0;
          const totalCompletions = progress?.length || 0;
          const completedToday = todayProgress?.length || 0;
          
          // Calculate score (total completions * 10 + active challenges * 5 + today's completions * 20)
          const score = totalCompletions * 10 + totalChallenges * 5 + completedToday * 20;

          return {
            id: profile.id,
            username: profile.username || `Hunter ${profile.user_id.slice(0, 8)}`,
            score,
            rank: 0, // Will be set after sorting
            totalChallenges,
            activeChallenges: totalChallenges,
            completedToday
          };
        })
      );

      // Sort by score and assign ranks
      const sortedData = leaderboardData
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setLeaderboard(sortedData);

      // Find current user's rank
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userEntry = sortedData.find(entry => entry.id === user.id);
        setUserRank(userEntry?.rank || null);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30";
      default:
        return "bg-card";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-8">
            <div className="animate-pulse">Loading leaderboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 overflow-x-hidden">
      <ProfileButton />
      <div className="max-w-4xl mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
        <div className="text-center py-4 sm:py-8">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
            Hunter Leaderboard
          </h1>
          <p className="text-muted-foreground text-xs sm:text-base px-4">
            Rankings based on quest completions and active challenges
          </p>
          {userRank && (
            <Badge variant="outline" className="mt-3 sm:mt-4 text-xs sm:text-sm">
              Your Rank: #{userRank}
            </Badge>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {leaderboard.map((entry) => (
            <Card key={entry.id} className={`${getRankColor(entry.rank)} transition-all duration-300 hover:scale-[1.02] overflow-hidden`}>
              <CardContent className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                      {getRankIcon(entry.rank)}
                      <span className="text-lg sm:text-2xl font-bold">#{entry.rank}</span>
                    </div>
                    
                    <Avatar className="w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs sm:text-base">
                        {entry.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="min-w-0 overflow-hidden">
                      <h3 className="font-semibold text-sm sm:text-lg truncate">{entry.username}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {entry.activeChallenges} active challenges
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right flex-shrink-0 ml-auto sm:ml-0">
                    <div className="text-lg sm:text-2xl font-bold text-primary">
                      {entry.score.toLocaleString()} XP
                    </div>
                    <div className="flex space-x-2 sm:space-x-4 text-xs sm:text-sm text-muted-foreground">
                      <span>Today: {entry.completedToday}</span>
                      <span>Total: {entry.totalChallenges}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <Card>
            <CardContent className="p-6 sm:p-8 text-center">
              <p className="text-muted-foreground text-sm sm:text-base">No hunters found. Be the first to start your journey!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}