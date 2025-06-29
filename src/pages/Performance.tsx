import React, { useState } from 'react';
import { useHunterProgression } from '@/hooks/useHunterProgression';
import DashboardHeader from '@/components/DashboardHeader';
import SystemPanel from '@/components/SystemPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Target, Zap, Calendar, Award } from 'lucide-react';

const Performance = () => {
  const {
    stats,
    currentRank,
    powerLevel,
    rankPoints,
    streak,
    daysActive,
    totalQuests,
    questCount,
    dailyQuests
  } = useHunterProgression();

  const [timePeriod, setTimePeriod] = useState('30');

  // Helper function to safely convert rankPoints to number
  const getRankPointsAsNumber = (): number => {
    return typeof rankPoints === 'number' ? rankPoints : 0;
  };

  // Helper function to safely sum daily quest values
  const getTotalDailyQuests = (): number => {
    return Object.values(dailyQuests).reduce((sum: number, value: unknown) => {
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
  };

  // Mock data for demonstrations - in real app this would come from historical data
  const mockPowerProgressionData = [
    { day: 'Day 1', power: 10, rank: 'E-Rank' },
    { day: 'Day 5', power: 35, rank: 'E-Rank' },
    { day: 'Day 10', power: 78, rank: 'E-Rank' },
    { day: 'Day 15', power: 156, rank: 'E-Rank' },
    { day: 'Day 20', power: 234, rank: 'E-Rank' },
    { day: 'Today', power: powerLevel, rank: currentRank.name }
  ];

  const mockQuestPerformanceData = [
    { category: 'Combat', easy: 95, medium: 78, hard: 45 },
    { category: 'Intelligence', easy: 88, medium: 82, hard: 52 },
    { category: 'Agility', easy: 92, medium: 75, hard: 38 },
    { category: 'Vitality', easy: 97, medium: 85, hard: 60 }
  ];

  const mockWeeklyPerformance = [
    { day: 'Mon', performance: 85, points: 120 },
    { day: 'Tue', performance: 78, points: 95 },
    { day: 'Wed', performance: 82, points: 110 },
    { day: 'Thu', performance: 76, points: 88 },
    { day: 'Fri', performance: 68, points: 75 },
    { day: 'Sat', performance: 71, points: 82 },
    { day: 'Sun', performance: 79, points: 98 }
  ];

  const mockStatGrowthData = [
    { period: 'Week 1', Strength: 5, Agility: 2, Intelligence: 3, Vitality: 4 },
    { period: 'Week 2', Strength: 8, Agility: 4, Intelligence: 5, Vitality: 6 },
    { period: 'Week 3', Strength: 12, Agility: 7, Intelligence: 8, Vitality: 9 },
    { period: 'Week 4', Strength: stats[0].val, Agility: stats[1].val, Intelligence: stats[2].val, Vitality: stats[3].val }
  ];

  // Calculate success rates
  const calculateSuccessRate = (difficulty: string) => {
    const completed = questCount[difficulty] || 0;
    const attempted = completed + Math.floor(Math.random() * 5); // Mock failed attempts
    return attempted > 0 ? Math.round((completed / attempted) * 100) : 0;
  };

  const chartConfig = {
    power: { label: "Power Level", color: "#00d4ff" },
    Strength: { label: "Strength", color: "#ff6b6b" },
    Agility: { label: "Agility", color: "#4ecdc4" },
    Intelligence: { label: "Intelligence", color: "#45b7d1" },
    Vitality: { label: "Vitality", color: "#96ceb4" },
    performance: { label: "Performance %", color: "#00d4ff" },
    points: { label: "Points Earned", color: "#0080ff" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <DashboardHeader
          currentRank={currentRank}
          badges={[]}
          username="Hunter"
          powerLevel={powerLevel}
          daysActive={daysActive}
        />

        <SystemPanel className="text-center py-4 sm:py-6">
          <h1 className="text-2xl sm:text-4xl font-orbitron font-bold text-system-blue2 mb-2">
            HUNTER ASSESSMENT REPORT
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            Comprehensive performance analysis and growth metrics
          </p>
        </SystemPanel>

        {/* Time Period Selector */}
        <SystemPanel className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-orbitron text-system-blue2">Analysis Period</h2>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-full sm:w-48 bg-system-panel border-system-blue2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </SystemPanel>

        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-system-panel">
            <TabsTrigger value="performance" className="text-xs sm:text-sm">Quest Analysis</TabsTrigger>
            <TabsTrigger value="growth" className="text-xs sm:text-sm">Power Growth</TabsTrigger>
            <TabsTrigger value="consistency" className="text-xs sm:text-sm">Consistency</TabsTrigger>
            <TabsTrigger value="comparison" className="text-xs sm:text-sm">Comparisons</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            {/* Quest Performance Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SystemPanel className="p-4">
                <h3 className="text-lg font-orbitron text-system-blue2 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Success Rate by Difficulty
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Easy Quests</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${calculateSuccessRate('easy')}%` }}></div>
                      </div>
                      <span className="text-green-400 font-bold">{calculateSuccessRate('easy')}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Medium Quests</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${calculateSuccessRate('medium')}%` }}></div>
                      </div>
                      <span className="text-yellow-400 font-bold">{calculateSuccessRate('medium')}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Hard Quests</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${calculateSuccessRate('hard')}%` }}></div>
                      </div>
                      <span className="text-red-400 font-bold">{calculateSuccessRate('hard')}%</span>
                    </div>
                  </div>
                </div>
              </SystemPanel>

              <SystemPanel className="p-4">
                <h3 className="text-lg font-orbitron text-system-blue2 mb-4">Weekly Performance Pattern</h3>
                <ChartContainer config={chartConfig} className="h-48">
                  <ResponsiveContainer>
                    <BarChart data={mockWeeklyPerformance}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="performance" fill="var(--color-performance)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <p className="text-white/60 text-sm mt-2">Monday shows strongest performance, Friday weakest</p>
              </SystemPanel>
            </div>

            {/* Daily Points Trend */}
            <SystemPanel className="p-4">
              <h3 className="text-lg font-orbitron text-system-blue2 mb-4">Daily Points Earned Trend</h3>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer>
                  <AreaChart data={mockWeeklyPerformance}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="points" stroke="var(--color-points)" fill="var(--color-points)" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </SystemPanel>
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            {/* Power Growth Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SystemPanel className="p-4">
                <h3 className="text-lg font-orbitron text-system-blue2 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Power Level Progression
                </h3>
                <ChartContainer config={chartConfig} className="h-48">
                  <ResponsiveContainer>
                    <LineChart data={mockPowerProgressionData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="power" stroke="var(--color-power)" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </SystemPanel>

              <SystemPanel className="p-4">
                <h3 className="text-lg font-orbitron text-system-blue2 mb-4">Stat Growth Comparison</h3>
                <ChartContainer config={chartConfig} className="h-48">
                  <ResponsiveContainer>
                    <LineChart data={mockStatGrowthData}>
                      <XAxis dataKey="period" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="Strength" stroke="var(--color-Strength)" />
                      <Line type="monotone" dataKey="Agility" stroke="var(--color-Agility)" />
                      <Line type="monotone" dataKey="Intelligence" stroke="var(--color-Intelligence)" />
                      <Line type="monotone" dataKey="Vitality" stroke="var(--color-Vitality)" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </SystemPanel>
            </div>

            {/* Rank Progression Timeline */}
            <SystemPanel className="p-4">
              <h3 className="text-lg font-orbitron text-system-blue2 mb-4">Rank Progression Timeline</h3>
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="text-center mb-4 sm:mb-0">
                  <div className="text-2xl font-bold text-system-blue2">{currentRank.name}</div>
                  <div className="text-white/60">Current Rank</div>
                </div>
                <div className="text-center mb-4 sm:mb-0">
                  <div className="text-xl font-bold text-yellow-400">{getRankPointsAsNumber()} pts</div>
                  <div className="text-white/60">Current Points</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">~{Math.ceil((300 - getRankPointsAsNumber()) / 15)} days</div>
                  <div className="text-white/60">To Next Rank</div>
                </div>
              </div>
            </SystemPanel>
          </TabsContent>

          <TabsContent value="consistency" className="space-y-4">
            {/* Streak & Consistency Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-system-panel border-system-blue2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-system-blue2 text-sm">Current Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{streak} days</div>
                  <p className="text-white/60 text-xs">Personal best: {Math.max(streak, 7)} days</p>
                </CardContent>
              </Card>

              <Card className="bg-system-panel border-system-blue2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-system-blue2 text-sm">Monthly Consistency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{Math.round((daysActive / 30) * 100)}%</div>
                  <p className="text-white/60 text-xs">Active {daysActive} out of 30 days</p>
                </CardContent>
              </Card>

              <Card className="bg-system-panel border-system-blue2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-system-blue2 text-sm">Streak Danger</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-400">Low</div>
                  <p className="text-white/60 text-xs">Fridays are risk days</p>
                </CardContent>
              </Card>

              <Card className="bg-system-panel border-system-blue2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-system-blue2 text-sm">Break Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">2</div>
                  <p className="text-white/60 text-xs">Streak breaks this month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            {/* Comparative Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SystemPanel className="p-4">
                <h3 className="text-lg font-orbitron text-system-blue2 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  This Month vs Last Month
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Quests Completed</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{totalQuests}</span>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">+23%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Power Level Growth</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{powerLevel}</span>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">+45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Streak Performance</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{streak} days</span>
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-red-400">-12%</span>
                    </div>
                  </div>
                </div>
              </SystemPanel>

              <SystemPanel className="p-4">
                <h3 className="text-lg font-orbitron text-system-blue2 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Goal vs Actual Performance
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">Daily Quest Goal</span>
                      <span className="text-white">{getTotalDailyQuests()}/3</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-system-blue h-2 rounded-full" 
                        style={{ width: `${Math.min((getTotalDailyQuests() / 3) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">Weekly Points Goal</span>
                      <span className="text-white">{getRankPointsAsNumber()}/200</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${Math.min((getRankPointsAsNumber() / 200) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </SystemPanel>
            </div>

            {/* Season Performance */}
            <SystemPanel className="p-4">
              <h3 className="text-lg font-orbitron text-system-blue2 mb-4">Seasonal Performance Patterns</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-blue-900/30 rounded-lg">
                  <div className="text-lg font-bold text-blue-300">Winter</div>
                  <div className="text-sm text-white/60">Highest consistency</div>
                  <div className="text-2xl font-bold text-white">92%</div>
                </div>
                <div className="p-3 bg-green-900/30 rounded-lg">
                  <div className="text-lg font-bold text-green-300">Spring</div>
                  <div className="text-sm text-white/60">Growth season</div>
                  <div className="text-2xl font-bold text-white">87%</div>
                </div>
                <div className="p-3 bg-yellow-900/30 rounded-lg">
                  <div className="text-lg font-bold text-yellow-300">Summer</div>
                  <div className="text-sm text-white/60">Activity dips</div>
                  <div className="text-2xl font-bold text-white">76%</div>
                </div>
                <div className="p-3 bg-orange-900/30 rounded-lg">
                  <div className="text-lg font-bold text-orange-300">Fall</div>
                  <div className="text-sm text-white/60">Comeback strong</div>
                  <div className="text-2xl font-bold text-white">89%</div>
                </div>
              </div>
            </SystemPanel>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Performance;
