import React from "react"
import { useNavigate } from "react-router-dom"
import { usePerformanceData } from "../hooks/usePerformanceData"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Zap, Calendar, ArrowLeft } from "lucide-react"

export default function Performance() {
  const navigate = useNavigate();
  
  const {
    powerLevel,
    totalQuests,
    successRate,
    streak,
    daysActive,
    questCount,
    categoryStats,
    weeklyCompletions,
    loading
  } = usePerformanceData();

  // Calculate individual stat levels based on category completion
  const statLevels = {
    combat: Math.min(100, (categoryStats.combat * 25)), // Max 100
    intelligence: Math.min(100, (categoryStats.intelligence * 25)),
    agility: Math.min(100, (categoryStats.agility * 25)),
    vitality: Math.min(100, (categoryStats.vitality * 25)),
    special: Math.min(100, (questCount.hard * 15)) // Special based on hard quests
  };

  // Hunter level progress (based on total power level)
  const currentLevel = Math.floor(powerLevel / 100) + 1;
  const nextLevelXP = currentLevel * 100;
  const currentXP = powerLevel % 100;
  const progressToNext = (currentXP / 100) * 100;

  console.log("Performance page data:", {
    powerLevel, streak, daysActive, totalQuests, questCount, categoryStats, successRate
  });

  return (
    <div className="min-h-screen bg-system-bg font-orbitron">
      {/* Particle background */}
      <div className="particle-bg pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="particle-dot"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${16 + Math.random() * 12}px`,
              height: `${16 + Math.random() * 12}px`,
              animationDelay: `${-Math.random() * 12}s`,
              opacity: 0.15 + Math.random() * 0.1,
              bottom: `${Math.random() * 35}vh`,
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
            Hunter Performance Analytics
          </h1>
          <p className="text-white/80 text-lg">
            The System tracks your growth with precision
          </p>
        </div>

        {/* Hunter Level Progress Bar */}
        <Card className="system-panel border-system-blue2 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
                <div>
                  <CardTitle className="text-white text-2xl">Hunter Level {currentLevel}</CardTitle>
                  <CardDescription className="text-white/60">
                    {currentXP}/{nextLevelXP} XP to Level {currentLevel + 1}
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-system-blue">{powerLevel}</div>
                <div className="text-white/60 text-sm">Total Power</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={progressToNext} className="h-4 bg-white/10" />
              <div className="flex justify-between text-xs text-white/60">
                <span>Level {currentLevel}</span>
                <span>{progressToNext.toFixed(1)}% Progress</span>
                <span>Level {currentLevel + 1}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Combat Training */}
          <Card className="system-panel border-red-500/50 bg-gradient-to-br from-red-500/10 to-red-500/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent opacity-50" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                Combat Training
              </CardTitle>
              <CardDescription className="text-red-300/80">
                Strength • Power • Endurance
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-end justify-between mb-4">
                <div className="text-3xl font-bold text-red-400">{statLevels.combat}</div>
                <div className="text-red-300/60 text-sm">Level</div>
              </div>
              <Progress value={statLevels.combat} className="h-3 bg-red-900/30" />
              <div className="mt-2 text-xs text-red-300/70">
                {categoryStats.combat} quests completed
              </div>
            </CardContent>
          </Card>

          {/* Intelligence Gathering */}
          <Card className="system-panel border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-blue-500/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-50" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                Intelligence Gathering
              </CardTitle>
              <CardDescription className="text-blue-300/80">
                Strategy • Analysis • Knowledge
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-end justify-between mb-4">
                <div className="text-3xl font-bold text-blue-400">{statLevels.intelligence}</div>
                <div className="text-blue-300/60 text-sm">Level</div>
              </div>
              <Progress value={statLevels.intelligence} className="h-3 bg-blue-900/30" />
              <div className="mt-2 text-xs text-blue-300/70">
                {categoryStats.intelligence} quests completed
              </div>
            </CardContent>
          </Card>

          {/* Agility Development */}
          <Card className="system-panel border-green-500/50 bg-gradient-to-br from-green-500/10 to-green-500/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent opacity-50" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                Agility Development
              </CardTitle>
              <CardDescription className="text-green-300/80">
                Speed • Reflexes • Movement
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-end justify-between mb-4">
                <div className="text-3xl font-bold text-green-400">{statLevels.agility}</div>
                <div className="text-green-300/60 text-sm">Level</div>
              </div>
              <Progress value={statLevels.agility} className="h-3 bg-green-900/30" />
              <div className="mt-2 text-xs text-green-300/70">
                {categoryStats.agility} quests completed
              </div>
            </CardContent>
          </Card>

          {/* Vital Enhancement */}
          <Card className="system-panel border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-purple-500/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-50" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                Vital Enhancement
              </CardTitle>
              <CardDescription className="text-purple-300/80">
                Health • Recovery • Stamina
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-end justify-between mb-4">
                <div className="text-3xl font-bold text-purple-400">{statLevels.vitality}</div>
                <div className="text-purple-300/60 text-sm">Level</div>
              </div>
              <Progress value={statLevels.vitality} className="h-3 bg-purple-900/30" />
              <div className="mt-2 text-xs text-purple-300/70">
                {categoryStats.vitality} quests completed
              </div>
            </CardContent>
          </Card>

          {/* Special Quest */}
          <Card className="system-panel border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent opacity-50" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                Special Quest
              </CardTitle>
              <CardDescription className="text-yellow-300/80">
                Elite • Legendary • Unique
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-end justify-between mb-4">
                <div className="text-3xl font-bold text-yellow-400">{statLevels.special}</div>
                <div className="text-yellow-300/60 text-sm">Level</div>
              </div>
              <Progress value={statLevels.special} className="h-3 bg-yellow-900/30" />
              <div className="mt-2 text-xs text-yellow-300/70">
                {questCount.hard} hard quests completed
              </div>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card className="system-panel border-system-blue2 bg-gradient-to-br from-system-blue/10 to-system-blue/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-system-blue/20 to-transparent opacity-50" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-system-blue animate-pulse" />
                Current Streak
              </CardTitle>
              <CardDescription className="text-system-blue/80">
                Consistency • Dedication • Growth
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-end justify-between mb-4">
                <div className="text-3xl font-bold text-system-blue">{streak}</div>
                <div className="text-system-blue/60 text-sm">Days</div>
              </div>
              <div className="mt-2 text-xs text-system-blue/70">
                Keep it up, Hunter!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}