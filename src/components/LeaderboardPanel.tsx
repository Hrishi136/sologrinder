import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Trophy, Medal, User } from "lucide-react";

interface LeaderboardEntry {
  username: string;
  score: number;
  rank: number;
  user_id: string;
}

interface Props {
  onUserRankClick?: (rank: number) => void;
}

export default function LeaderboardPanel({ onUserRankClick }: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch challenges separately then join with profiles
      const { data: challengesData, error: challengesError } = await supabase
        .from('Challenges')
        .select('user_id, streak, progress_json');

      if (challengesError) {
        console.error('Error fetching challenges:', challengesError);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(challengesData?.map(c => c.user_id) || [])];
      
      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, username')
        .in('user_id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Create a map of user_id to username
      const usernameMap = new Map<string, string>();
      profilesData?.forEach(profile => {
        usernameMap.set(profile.user_id, profile.username);
      });

      // Calculate scores for each user
      const userScores = new Map<string, { username: string; score: number; user_id: string }>();
      
      challengesData?.forEach((challenge) => {
        const userId = challenge.user_id;
        const username = usernameMap.get(userId) || 'Unknown Hunter';
        const streak = (challenge.streak as number) || 0;
        const progressData = challenge.progress_json as any;
        
        // Calculate score based on streak and progress
        let progressScore = 0;
        if (progressData && typeof progressData === 'object') {
          progressScore = Object.values(progressData).reduce((sum: number, val: any) => {
            return sum + (typeof val === 'number' ? val : 0);
          }, 0) as number;
        }
        
        const totalScore = streak * 10 + progressScore; // Weight streak more heavily
        
        if (!userScores.has(userId)) {
          userScores.set(userId, { username, score: 0, user_id: userId });
        }
        
        const existing = userScores.get(userId)!;
        existing.score += totalScore;
      });

      // Convert to array and sort by score
      const sortedUsers = Array.from(userScores.values())
        .sort((a, b) => b.score - a.score)
        .map((user, index) => ({
          ...user,
          rank: index + 1
        }));

      // Get top 5 for display
      setLeaderboard(sortedUsers.slice(0, 5));
      
      // Find current user's rank
      if (user) {
        const userEntry = sortedUsers.find(u => u.user_id === user.id);
        if (userEntry) {
          setCurrentUserRank(userEntry.rank);
        }
      }
      
    } catch (error) {
      console.error('Error in fetchLeaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2: return <Trophy className="h-5 w-5 text-gray-300" />;
      case 3: return <Medal className="h-5 w-5 text-orange-400" />;
      default: return <span className="font-bold text-system-blue">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="font-orbitron text-xl text-system-blue mb-2 font-bold">
          Leaderboard
        </h3>
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-3 p-2 bg-system-blue/5 rounded border border-system-blue/20 animate-pulse">
              <div className="w-8 h-8 bg-system-blue/20 rounded"></div>
              <div className="flex-1 h-4 bg-system-blue/20 rounded"></div>
              <div className="w-12 h-4 bg-system-blue/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4 overflow-hidden">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="font-orbitron text-base sm:text-xl text-system-blue font-bold truncate">
          Leaderboard
        </h3>
        {currentUserRank && (
          <button 
            onClick={() => onUserRankClick?.(currentUserRank)}
            className="px-2 sm:px-3 py-1 bg-system-blue/20 border border-system-blue rounded-full text-[10px] sm:text-xs font-orbitron text-system-blue hover:bg-system-blue/30 transition-colors animate-pulse flex-shrink-0"
          >
            You: #{currentUserRank}
          </button>
        )}
      </div>
      
      <div className="space-y-2 sm:space-y-3 overflow-hidden">
        {leaderboard.length === 0 ? (
          <div className="text-center py-3 sm:py-4 text-system-blue/60">
            <p className="font-orbitron text-sm">No hunters found</p>
            <p className="text-xs">Complete challenges to appear</p>
          </div>
        ) : (
          leaderboard.map((entry) => (
            <div 
              key={entry.user_id} 
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-system-blue/5 rounded border border-system-blue/20 hover:bg-system-blue/10 transition-colors overflow-hidden"
            >
              <div className="flex items-center justify-center w-6 sm:w-8 flex-shrink-0">
                {getRankIcon(entry.rank)}
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 overflow-hidden">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-system-blue/60 flex-shrink-0" />
                <span className="font-orbitron text-white font-medium text-xs sm:text-base truncate">
                  {entry.username}
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-orbitron text-system-blue font-bold text-xs sm:text-base">
                  {entry.score.toLocaleString()}
                </div>
                <div className="text-[10px] sm:text-xs text-system-blue/60">XP</div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {leaderboard.length > 0 && (
        <div className="text-center text-[10px] sm:text-xs text-system-blue/60 font-orbitron">
          Rankings update in real-time
        </div>
      )}
    </div>
  );
}