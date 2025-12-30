import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, CheckCircle2, Target } from 'lucide-react';
import { useChallengesV2 } from '@/hooks/useChallengesV2';
import ProfileButton from '@/components/ProfileButton';

interface WeeklyProgressData {
  challengeId: string;
  title: string;
  category: string;
  difficulty: string;
  streak: number;
  weeklyProgress: { date: string; count: number }[];
  completionsThisWeek: number;
}

const CATEGORIES = [
  'Combat Training',
  'Intelligence Gathering',
  'Agility Development', 
  'Vitality Enhancement',
  'Special Quests'
];

export default function Progress() {
  const navigate = useNavigate();
  const { challenges, loading, getWeeklyProgress, getActiveDays } = useChallengesV2();
  const [weeklyData, setWeeklyData] = useState<WeeklyProgressData[]>([]);
  const [activeDays, setActiveDays] = useState(0);
  const [totalCompletionsThisWeek, setTotalCompletionsThisWeek] = useState(0);

  useEffect(() => {
    const loadProgressData = async () => {
      if (challenges.length === 0) return;

      // Load weekly progress for each challenge
      const progressPromises = challenges.map(async (challenge) => {
        const weeklyProgress = await getWeeklyProgress(challenge.id);
        const completionsThisWeek = weeklyProgress.reduce((sum, day) => sum + day.count, 0);
        
        return {
          challengeId: challenge.id,
          title: challenge.title,
          category: challenge.category || 'General',
          difficulty: challenge.difficulty || 'easy',
          streak: challenge.streak,
          weeklyProgress,
          completionsThisWeek
        };
      });

      const data = await Promise.all(progressPromises);
      setWeeklyData(data);
      setTotalCompletionsThisWeek(data.reduce((sum, d) => sum + d.completionsThisWeek, 0));

      // Load active days
      const days = await getActiveDays();
      setActiveDays(days);
    };

    loadProgressData();
  }, [challenges]);

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-system-blue2 bg-system-blue2/20';
    }
  };

  const getDifficultyRank = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'E-Rank';
      case 'medium': return 'D-Rank';
      case 'hard': return 'C-Rank';
      default: return 'E-Rank';
    }
  };

  const getQuestsByCategory = (category: string) => {
    return weeklyData.filter(data => data.category === category);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-system-bg pt-20">
        <div className="container mx-auto flex items-center justify-center">
          <div className="text-system-blue2 font-orbitron">Loading progress...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-system-bg font-orbitron pt-20 overflow-x-hidden">
      <ProfileButton />
      {/* Particle background */}
      <div className="particle-bg pointer-events-none hidden sm:block">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle-dot"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${12 + Math.random() * 8}px`,
              height: `${12 + Math.random() * 8}px`,
              animationDelay: `${-Math.random() * 10}s`,
              opacity: 0.1 + Math.random() * 0.1,
              bottom: `${Math.random() * 30}vh`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="flex items-center gap-2 text-system-blue border-system-blue hover:bg-system-blue/10 text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 px-2">
          <h1 className="text-2xl sm:text-4xl font-bold text-system-blue mb-2">
            Weekly Progress
          </h1>
          <p className="text-white/80 text-sm sm:text-lg">
            Monitor your quest completion
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="system-panel border-system-blue2 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/80">Active Quests</CardTitle>
              <Target className="h-4 w-4 text-system-blue2" />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-system-blue">{challenges.length}</div>
              <p className="text-[10px] sm:text-xs text-white/60">
                Across all categories
              </p>
            </CardContent>
          </Card>

          <Card className="system-panel border-system-blue2 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/80">This Week</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-green-400">
                {totalCompletionsThisWeek}
              </div>
              <p className="text-[10px] sm:text-xs text-white/60">
                Total completions
              </p>
            </CardContent>
          </Card>

          <Card className="system-panel border-system-blue2 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/80">Active Days</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                {activeDays}
              </div>
              <p className="text-[10px] sm:text-xs text-white/60">
                Days with completions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress by Category */}
        <div className="space-y-6 sm:space-y-8">
          {CATEGORIES.map(category => {
            const categoryQuests = getQuestsByCategory(category);
            if (categoryQuests.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-lg sm:text-2xl font-bold text-system-blue mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="truncate">{category}</span>
                  <Badge className="bg-system-blue2/20 text-system-blue2 text-[10px] sm:text-xs flex-shrink-0">
                    {categoryQuests.length} quests
                  </Badge>
                </h2>

                <div className="grid gap-3 sm:gap-4">
                  {categoryQuests.map(quest => (
                    <Card key={quest.challengeId} className="system-panel border-system-blue2/30 overflow-hidden">
                      <CardContent className="p-3 sm:p-6">
                        <div className="flex flex-col gap-3 sm:gap-4">
                          {/* Quest Info */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                              <h3 className="font-bold text-system-blue text-sm sm:text-lg truncate max-w-[200px] sm:max-w-none">
                                {quest.title}
                              </h3>
                              <Badge className={`${getDifficultyColor(quest.difficulty)} text-[10px] sm:text-xs flex-shrink-0`}>
                                {getDifficultyRank(quest.difficulty)}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/70 flex-wrap">
                              <span>Streak: {quest.streak}d</span>
                              <span>Week: {quest.completionsThisWeek}</span>
                            </div>
                          </div>

                          {/* Weekly Progress Tracker */}
                          <div className="flex flex-col items-start sm:items-center gap-1 sm:gap-2">
                            <div className="text-[10px] sm:text-sm text-white/60 font-orbitron">
                              Weekly Progress
                            </div>
                            <div className="flex gap-0.5 sm:gap-1 overflow-x-auto w-full sm:w-auto pb-1">
                              {quest.weeklyProgress.map((day, dayIndex) => (
                                <div
                                  key={dayIndex}
                                  className="flex flex-col items-center gap-0.5 sm:gap-1 flex-shrink-0"
                                >
                                  <div className="text-[8px] sm:text-xs text-white/50">
                                    {getDayName(day.date)}
                                  </div>
                                  <div 
                                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center ${
                                      day.count > 0 
                                        ? 'bg-green-500/30 border-green-400' 
                                        : 'bg-system-bg/50 border-white/20'
                                    }`}
                                  >
                                    {day.count > 0 && (
                                      day.count > 1 
                                        ? <span className="text-[10px] sm:text-xs text-green-400 font-bold">{day.count}</span>
                                        : <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="flex flex-col gap-1 sm:gap-2 w-full overflow-hidden">
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="text-white/60">This Week</span>
                              <span className="text-system-blue2">
                                {quest.completionsThisWeek} completions
                              </span>
                            </div>
                            <div className="w-full overflow-hidden rounded-full">
                              <ProgressBar 
                                value={Math.min((quest.completionsThisWeek / 7) * 100, 100)} 
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {challenges.length === 0 && (
            <Card className="system-panel border-system-blue2/30">
              <CardContent className="p-8 text-center">
                <Target className="h-16 w-16 text-system-blue2/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-system-blue mb-2">
                  No Active Quests
                </h3>
                <p className="text-white/60 mb-4">
                  Create your first quest to start tracking progress
                </p>
                <Button 
                  onClick={() => navigate('/quests')}
                  className="glow-button"
                >
                  Create Quest
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}