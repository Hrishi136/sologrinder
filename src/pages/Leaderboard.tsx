import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import ProfileButton from '@/components/ProfileButton';

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  score: number;
  rank: number;
  activeChallenges: number;
  completedToday: number;
  totalCompletions: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Single query for all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, user_id');
      if (profilesError) throw profilesError;
      if (!profiles?.length) { setLeaderboard([]); return; }

      const userIds = profiles.map(p => p.user_id);
      const today = new Date().toISOString().split('T')[0];

      // Batch: all active challenges across all users
      const { data: allChallenges } = await supabase
        .from('challenges')
        .select('user_id')
        .in('user_id', userIds)
        .eq('is_active', true);

      // Batch: all completed progress across all users
      const { data: allProgress } = await supabase
        .from('challenge_progress')
        .select('user_id')
        .in('user_id', userIds)
        .eq('completed', true);

      // Batch: today's completed progress
      const { data: todayProgress } = await supabase
        .from('challenge_progress')
        .select('user_id')
        .in('user_id', userIds)
        .eq('date', today)
        .eq('completed', true);

      // Group counts by user_id in memory
      const challengeCount: Record<string, number> = {};
      const progressCount: Record<string, number> = {};
      const todayCount: Record<string, number> = {};

      (allChallenges || []).forEach(r => {
        challengeCount[r.user_id] = (challengeCount[r.user_id] || 0) + 1;
      });
      (allProgress || []).forEach(r => {
        progressCount[r.user_id] = (progressCount[r.user_id] || 0) + 1;
      });
      (todayProgress || []).forEach(r => {
        todayCount[r.user_id] = (todayCount[r.user_id] || 0) + 1;
      });

      const leaderboardData: LeaderboardEntry[] = profiles.map(profile => {
        const active = challengeCount[profile.user_id] || 0;
        const total = progressCount[profile.user_id] || 0;
        const todayDone = todayCount[profile.user_id] || 0;
        const score = total * 10 + active * 5 + todayDone * 20;

        return {
          id: profile.id,
          userId: profile.user_id,
          username: profile.username || `Hunter ${profile.user_id.slice(0, 6)}`,
          score,
          rank: 0,
          activeChallenges: active,
          completedToday: todayDone,
          totalCompletions: total
        };
      });

      const sorted = leaderboardData
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setLeaderboard(sorted);

      // Find current user's rank — compare by auth user_id
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userEntry = sorted.find(e => e.userId === user.id);
        setUserRank(userEntry?.rank ?? null);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />;
    return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white/30" />;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/15 to-yellow-600/10 border-yellow-500/40";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/15 to-gray-500/10 border-gray-400/40";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/15 to-amber-700/10 border-amber-600/40";
    return "bg-[#0a0a0a]/80 border-system-blue2/20";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-system-bg pt-16 sm:pt-20 px-3 sm:px-4 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          <div className="text-center py-12 text-system-blue font-orbitron animate-pulse">
            Loading Leaderboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-system-bg pt-16 sm:pt-20 pb-20 overflow-x-hidden">
      <ProfileButton />
      <div className="max-w-2xl mx-auto px-3 sm:px-4 space-y-4">
        {/* Header */}
        <div className="text-center py-4 sm:py-6">
          <h1 className="text-xl sm:text-3xl font-bold font-orbitron text-system-blue drop-shadow-[0_0_10px_rgba(0,212,255,0.4)] mb-1">
            Hunter Leaderboard
          </h1>
          <p className="text-white/50 text-xs sm:text-sm px-4">
            Rankings based on quest completions and active challenges
          </p>
          {userRank && (
            <Badge
              variant="outline"
              className="mt-3 text-xs sm:text-sm border-system-blue text-system-blue"
            >
              Your Rank: #{userRank}
            </Badge>
          )}
        </div>

        {error && (
          <div className="text-center text-red-400 text-sm py-4">{error}</div>
        )}

        {/* Entries */}
        <div className="space-y-2 sm:space-y-3">
          {leaderboard.map((entry) => (
            <Card
              key={entry.id}
              className={`border ${getRankStyle(entry.rank)} transition-all duration-200`}
            >
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Rank */}
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 w-12 sm:w-16">
                    {getRankIcon(entry.rank)}
                    <span className="text-sm sm:text-xl font-bold text-white">
                      #{entry.rank}
                    </span>
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                    <AvatarFallback className="bg-system-blue/20 text-system-blue font-bold text-xs">
                      {entry.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name + stats */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-white truncate">
                      {entry.username}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-white/40 truncate">
                      {entry.activeChallenges} active · {entry.completedToday} today
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm sm:text-lg font-bold text-system-blue">
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-[10px] sm:text-xs text-white/40">XP</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!error && leaderboard.length === 0 && (
          <Card className="bg-[#0a0a0a]/80 border-system-blue2/20">
            <CardContent className="p-6 text-center text-white/50 text-sm">
              No hunters yet. Be the first to start your journey!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
