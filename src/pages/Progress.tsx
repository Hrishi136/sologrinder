import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, CheckCircle2, Target } from 'lucide-react';
import { useChallenges } from '@/hooks/useChallenges';
import { Tables } from '@/integrations/supabase/types';
import TopNav from '@/components/TopNav';

interface ChallengeWithProgress extends Tables<'Challenges'> {
  category: string;
  difficulty: string;
  points: number;
  weeklyProgress: number[];
  completionsThisWeek: number;
}

const CATEGORIES = [
  'Combat Training',
  'Intelligence Gathering',
  'Agility Development', 
  'Vital Enhancement',
  'Special Quests'
];

export default function Progress() {
  const navigate = useNavigate();
  const { challenges, loading } = useChallenges();
  const [challengesWithProgress, setChallengesWithProgress] = useState<ChallengeWithProgress[]>([]);

  useEffect(() => {
    if (challenges.length > 0) {
      const processedChallenges = challenges.map(challenge => {
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

        // Generate mock weekly progress (last 7 days)
        const weeklyProgress = Array(7).fill(0).map(() => Math.random() > 0.6 ? 1 : 0);
        const completionsThisWeek = weeklyProgress.reduce((sum, day) => sum + day, 0);

        return {
          ...challenge,
          category,
          difficulty,
          points,
          weeklyProgress,
          completionsThisWeek
        };
      });

      setChallengesWithProgress(processedChallenges);
    }
  }, [challenges]);

  const getDayName = (dayIndex: number) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[dayIndex];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-system-blue2 bg-system-blue2/20';
    }
  };

  const getDifficultyRank = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'E-Rank';
      case 'medium': return 'D-Rank';
      case 'hard': return 'C-Rank';
      default: return 'E-Rank';
    }
  };

  const getQuestsByCategory = (category: string) => {
    return challengesWithProgress.filter(challenge => challenge.category === category);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-system-bg">
        <TopNav />
        <div className="container mx-auto pt-8 flex items-center justify-center">
          <div className="text-system-blue2 font-orbitron">Loading progress...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-system-bg font-orbitron">
      <TopNav />
      
      {/* Particle background */}
      <div className="particle-bg pointer-events-none">
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

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="flex items-center gap-2 text-system-blue border-system-blue hover:bg-system-blue/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-system-blue mb-2">
            Weekly Progress Tracker
          </h1>
          <p className="text-white/80 text-lg">
            Monitor your quest completion patterns
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="system-panel border-system-blue2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Active Quests</CardTitle>
              <Target className="h-4 w-4 text-system-blue2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-system-blue">{challenges.length}</div>
              <p className="text-xs text-white/60">
                Across all categories
              </p>
            </CardContent>
          </Card>

          <Card className="system-panel border-system-blue2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">This Week</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {challengesWithProgress.reduce((sum, ch) => sum + ch.completionsThisWeek, 0)}
              </div>
              <p className="text-xs text-white/60">
                Total completions
              </p>
            </CardContent>
          </Card>

          <Card className="system-panel border-system-blue2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Consistency</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round((challengesWithProgress.reduce((sum, ch) => sum + ch.completionsThisWeek, 0) / Math.max(challenges.length * 7, 1)) * 100)}%
              </div>
              <p className="text-xs text-white/60">
                Weekly completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress by Category */}
        <div className="space-y-8">
          {CATEGORIES.map(category => {
            const categoryQuests = getQuestsByCategory(category);
            if (categoryQuests.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-2xl font-bold text-system-blue mb-4 flex items-center gap-3">
                  {category}
                  <Badge className="bg-system-blue2/20 text-system-blue2">
                    {categoryQuests.length} quests
                  </Badge>
                </h2>

                <div className="grid gap-4">
                  {categoryQuests.map(challenge => (
                    <Card key={challenge.id} className="system-panel border-system-blue2/30">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Quest Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-system-blue text-lg">
                                {challenge.title}
                              </h3>
                              <Badge className={getDifficultyColor(challenge.difficulty)}>
                                {getDifficultyRank(challenge.difficulty)}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-white/70">
                              <span>Streak: {challenge.streak || 0} days</span>
                              <span>This week: {challenge.completionsThisWeek}/7</span>
                            </div>
                          </div>

                          {/* Weekly Progress Tracker */}
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-sm text-white/60 font-orbitron">
                              Weekly Progress
                            </div>
                            <div className="flex gap-1">
                              {challenge.weeklyProgress.map((completed, dayIndex) => (
                                <div
                                  key={dayIndex}
                                  className="flex flex-col items-center gap-1"
                                >
                                  <div className="text-xs text-white/50">
                                    {getDayName(dayIndex)}
                                  </div>
                                  <div 
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                      completed 
                                        ? 'bg-green-500/30 border-green-400' 
                                        : 'bg-system-bg/50 border-white/20'
                                    }`}
                                  >
                                    {completed && (
                                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="flex flex-col gap-2 min-w-[200px]">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/60">Progress</span>
                              <span className="text-system-blue2">
                                {challenge.completionsThisWeek}/7
                              </span>
                            </div>
                            <ProgressBar 
                              value={(challenge.completionsThisWeek / 7) * 100} 
                              className="h-2"
                            />
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