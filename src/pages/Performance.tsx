import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { usePerformanceData } from "../hooks/usePerformanceData"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge" 
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, ChevronDown, Sword, Brain, Zap, Heart, Star, Target } from "lucide-react"

export default function Performance() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('All');
  
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

  // Stat cards data with colors and effects
  const statCards = [
    {
      id: 'combat',
      title: 'Combat Training',
      value: categoryStats.combat || 0,
      maxValue: 100,
      icon: Sword,
      color: 'from-red-500 to-red-700',
      glowColor: 'shadow-red-500/50',
      description: 'Physical prowess and battle skills'
    },
    {
      id: 'intelligence',
      title: 'Intelligence Gathering',
      value: categoryStats.intelligence || 0,
      maxValue: 100,
      icon: Brain,
      color: 'from-blue-500 to-blue-700',
      glowColor: 'shadow-blue-500/50',
      description: 'Strategic thinking and analysis'
    },
    {
      id: 'agility',
      title: 'Agility Development',
      value: categoryStats.agility || 0,
      maxValue: 100,
      icon: Zap,
      color: 'from-yellow-500 to-yellow-700',
      glowColor: 'shadow-yellow-500/50',
      description: 'Speed and reaction time'
    },
    {
      id: 'vital',
      title: 'Vital Enhancement',
      value: categoryStats.vitality || 0,
      maxValue: 100,
      icon: Heart,
      color: 'from-green-500 to-green-700',
      glowColor: 'shadow-green-500/50',
      description: 'Health and endurance boost'
    },
    {
      id: 'special',
      title: 'Special Quest',
      value: Math.floor((totalQuests / 10) * 100), // Special quests are rare
      maxValue: 100,
      icon: Star,
      color: 'from-purple-500 to-purple-700',
      glowColor: 'shadow-purple-500/50',
      description: 'Unique abilities and powers'
    }
  ];

  // Filter stats based on selection
  const filteredStats = selectedFilter === 'All' 
    ? statCards 
    : statCards.filter(stat => 
        stat.title.toLowerCase().includes(selectedFilter.toLowerCase()) ||
        stat.id === selectedFilter.toLowerCase()
      );

  // Hunter Level Progress calculation with round number thresholds
  const levelThresholds = [30, 80, 150, 250, 400, 600, 850, 1150, 1500, 2000]; // Round numbers for each level
  const getCurrentLevel = (points: number) => {
    for (let i = 0; i < levelThresholds.length; i++) {
      if (points < levelThresholds[i]) return i + 1;
    }
    return levelThresholds.length + 1;
  };
  
  const currentLevel = getCurrentLevel(powerLevel);
  const nextLevelThreshold = levelThresholds[currentLevel - 1] || (currentLevel * 500);
  const previousLevelThreshold = currentLevel > 1 ? (levelThresholds[currentLevel - 2] || 0) : 0;
  const progressInCurrentLevel = powerLevel - previousLevelThreshold;
  const pointsNeededForCurrentLevel = nextLevelThreshold - previousLevelThreshold;
  const hunterLevelProgress = (progressInCurrentLevel / pointsNeededForCurrentLevel) * 100;
  const nextLevelPoints = nextLevelThreshold - powerLevel;

  return (
    <div className="min-h-screen bg-system-bg font-orbitron pt-16">
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

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 relative z-10 max-w-7xl pb-20 sm:pb-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="flex items-center gap-2 text-system-blue border-system-blue hover:bg-system-blue/10 min-h-[44px] px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-system-blue mb-2 break-words px-2">
            Hunter Training Analytics
          </h1>
          <p className="text-white/80 text-sm sm:text-base md:text-lg px-2">
            Monitor your development across all disciplines
          </p>
        </div>

        {/* Hunter Level Progress Bar */}
        <Card className="system-panel border-system-blue mb-6 sm:mb-8 w-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-system-blue flex-shrink-0" />
              <span className="break-words">Hunter Level Progress</span>
            </CardTitle>
            <CardDescription className="text-white/60 text-xs sm:text-sm break-words">
              Level {currentLevel} • {nextLevelPoints} points to next level
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-2 w-full">
              <div className="flex justify-between text-xs sm:text-sm gap-2">
                <span className="text-white/80">Current Progress</span>
                <span className="text-system-blue font-bold whitespace-nowrap">{hunterLevelProgress.toFixed(1)}%</span>
              </div>
              <Progress 
                value={hunterLevelProgress} 
                className="h-2 sm:h-3 bg-gray-800 w-full"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>Level {currentLevel}</span>
                <span>Level {currentLevel + 1}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Dropdown */}
        <div className="mb-4 sm:mb-6 w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="text-system-blue border-system-blue hover:bg-system-blue/10 w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
              >
                <span className="truncate">Choose Training Stats: {selectedFilter}</span>
                <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-system-panel border-system-blue z-50 w-[200px]">
              <DropdownMenuItem 
                className="text-white hover:bg-system-blue/20 text-sm"
                onClick={() => setSelectedFilter('All')}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white hover:bg-system-blue/20 text-sm"
                onClick={() => setSelectedFilter('Combat')}
              >
                Combat
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white hover:bg-system-blue/20 text-sm"
                onClick={() => setSelectedFilter('Intelligence')}
              >
                Intelligence
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white hover:bg-system-blue/20 text-sm"
                onClick={() => setSelectedFilter('Agility')}
              >
                Agility
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white hover:bg-system-blue/20 text-sm"
                onClick={() => setSelectedFilter('Vital')}
              >
                Vital
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white hover:bg-system-blue/20 text-sm"
                onClick={() => setSelectedFilter('Special Quest')}
              >
                Special Quest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
          {filteredStats.map((stat) => {
            const Icon = stat.icon;
            const percentage = (stat.value / stat.maxValue) * 100;
            
            return (
              <Card 
                key={stat.id}
                className={`system-panel border-2 transition-all duration-300 hover:scale-105 animate-pulse-slow ${stat.glowColor} w-full min-w-0`}
                style={{
                  background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)`,
                  borderColor: stat.color.includes('red') ? '#ef4444' : 
                              stat.color.includes('blue') ? '#3b82f6' :
                              stat.color.includes('yellow') ? '#eab308' :
                              stat.color.includes('green') ? '#22c55e' : '#a855f7'
                }}
              >
                <CardHeader className="pb-3 p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${stat.color} shadow-lg ${stat.glowColor} flex-shrink-0`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-white border-current text-xs sm:text-sm whitespace-nowrap"
                      style={{
                        borderColor: stat.color.includes('red') ? '#ef4444' : 
                                    stat.color.includes('blue') ? '#3b82f6' :
                                    stat.color.includes('yellow') ? '#eab308' :
                                    stat.color.includes('green') ? '#22c55e' : '#a855f7'
                      }}
                    >
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-3 w-full min-w-0">
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-1 break-words">{stat.title}</h3>
                      <p className="text-xs sm:text-sm text-white/60 break-words">{stat.description}</p>
                    </div>
                    
                    <div className="space-y-2 w-full">
                      <div className="flex justify-between text-xs sm:text-sm gap-2">
                        <span className="text-white/80">Progress</span>
                        <span className="text-white font-bold whitespace-nowrap">{stat.value}/{stat.maxValue}</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2 w-full"
                        style={{
                          background: 'rgba(255,255,255,0.1)'
                        }}
                      />
                    </div>
                    
                    <div className="text-xs text-white/50 italic break-words">
                      System analysis: {percentage > 80 ? 'Exceptional' : percentage > 60 ? 'Advanced' : percentage > 40 ? 'Intermediate' : 'Developing'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty state for filtered results */}
        {filteredStats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No training stats match the current filter.</p>
            <Button 
              onClick={() => setSelectedFilter('All')}
              variant="outline"
              className="mt-4 text-system-blue border-system-blue hover:bg-system-blue/10"
            >
              Show All Stats
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}