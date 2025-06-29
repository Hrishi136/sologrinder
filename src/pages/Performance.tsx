import React from "react";
import { useHunterProgression } from "../hooks/useHunterProgression";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, Award, Zap, Calendar } from "lucide-react";

export default function Performance() {
  const {
    stats,
    currentRank,
    nextRank,
    powerLevel,
    rankPoints,
    streak,
    daysActive,
    totalQuests,
    badges,
    dailyQuests,
    questCount,
  } = useHunterProgression();

  console.log("Performance page data:", {
    stats, currentRank, powerLevel, rankPoints, streak, daysActive, totalQuests, badges, dailyQuests, questCount
  });

  // Helper function to safely convert rankPoints to number
  const getRankPointsAsNumber = (): number => {
    return typeof rankPoints === 'number' ? rankPoints : 0;
  };

  // Helper function to safely sum daily quest values
  const getTotalDailyQuests = (): number => {
    if (!dailyQuests) return 0;
    const easy = typeof dailyQuests.easy === 'number' ? dailyQuests.easy : 0;
    const medium = typeof dailyQuests.medium === 'number' ? dailyQuests.medium : 0;
    const hard = typeof dailyQuests.hard === 'number' ? dailyQuests.hard : 0;
    return easy + medium + hard;
  };

  // Mock data for demonstrations - in real app this would come from historical data
  const mockPowerProgressionData = [
    { day: 'Day 1', power: 10, rank: 'E-Rank' },
    { day: 'Day 7', power: 45, rank: 'E-Rank' },
    { day: 'Day 14', power: 120, rank: 'D-Rank' },
    { day: 'Day 21', power: 280, rank: 'D-Rank' },
    { day: 'Day 30', power: 450, rank: 'C-Rank' },
    { day: 'Today', power: powerLevel, rank: currentRank?.name || 'E-Rank' }
  ];

  // Quest completion over time (mock data)
  const questProgressionData = [
    { week: 'Week 1', easy: 8, medium: 3, hard: 1 },
    { week: 'Week 2', easy: 12, medium: 6, hard: 2 },
    { week: 'Week 3', easy: 15, medium: 8, hard: 4 },
    { week: 'Week 4', easy: 18, medium: 10, hard: 6 },
    { week: 'This Week', easy: dailyQuests.easy || 0, medium: dailyQuests.medium || 0, hard: dailyQuests.hard || 0 }
  ];

  // Stat distribution data
  const statDistributionData = stats.map(stat => ({
    name: stat.label,
    value: stat.val,
    percentage: Math.round((stat.val / Math.max(stats.reduce((sum, s) => sum + s.val, 0), 1)) * 100)
  }));

  // Performance metrics calculations
  const avgQuestsPerDay = daysActive > 0 ? (totalQuests / daysActive).toFixed(1) : '0';
  const currentStreakRank = streak >= 30 ? 'Legendary' : streak >= 14 ? 'Master' : streak >= 7 ? 'Veteran' : streak >= 3 ? 'Dedicated' : 'Beginner';
  
  // Quest success rate (mock calculation)
  const getSuccessRate = (difficulty: 'easy' | 'medium' | 'hard') => {
    const completed = questCount[difficulty] || 0;
    const attempted = completed + Math.floor(Math.random() * 5); // Mock failed attempts
    return attempted > 0 ? Math.round((completed / attempted) * 100) : 0;
  };

  const chartConfig = {
    easy: { label: "Easy", color: "#48e18b" },
    medium: { label: "Medium", color: "#f4e95a" },
    hard: { label: "Hard", color: "#ed3434" },
    power: { label: "Power Level", color: "#00d4ff" }
  };

  const COLORS = ['#00d4ff', '#48e18b', '#f4e95a', '#ed3434'];

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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-system-blue mb-2">
            Hunter Performance Analytics
          </h1>
          <p className="text-white/80 text-lg">
            The System tracks your growth with precision
          </p>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Power Level Card */}
          <Card className="system-panel border-system-blue2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Power Level</CardTitle>
              <Zap className="h-4 w-4 text-system-blue2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-system-blue">{powerLevel}</div>
              <p className="text-xs text-white/60">
                Rank: {currentRank?.name || 'E-Rank'}
              </p>
            </CardContent>
          </Card>

          {/* Quest Completion Rate */}
          <Card className="system-panel border-system-blue2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Quest Success</CardTitle>
              <Target className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{getSuccessRate('easy')}%</div>
              <p className="text-xs text-white/60">
                Overall completion rate
              </p>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card className="system-panel border-system-blue2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Current Streak</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{streak} days</div>
              <p className="text-xs text-white/60">
                Status: {currentStreakRank}
              </p>
            </CardContent>
          </Card>

          {/* Average Daily Quests */}
          <Card className="system-panel border-system-blue2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Daily Average</CardTitle>
              <Clock className="h-4 w-4 text-system-blue2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-system-blue2">{avgQuestsPerDay}</div>
              <p className="text-xs text-white/60">
                Quests per day
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Power Level Progression */}
          <Card className="system-panel border-system-blue2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-system-blue2" />
                Power Level Progression
              </CardTitle>
              <CardDescription className="text-white/60">
                Your power growth over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockPowerProgressionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #00d4ff',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#00d4ff' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="power" 
                    stroke="#00d4ff" 
                    strokeWidth={3}
                    dot={{ fill: '#00d4ff', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quest Distribution */}
          <Card className="system-panel border-system-blue2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-system-blue2" />
                Quest Completion Trends
              </CardTitle>
              <CardDescription className="text-white/60">
                Weekly quest completion by difficulty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={questProgressionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="week" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #00d4ff',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="easy" fill="#48e18b" />
                  <Bar dataKey="medium" fill="#f4e95a" />
                  <Bar dataKey="hard" fill="#ed3434" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stat Distribution Pie Chart */}
          <Card className="system-panel border-system-blue2">
            <CardHeader>
              <CardTitle className="text-white">Stat Distribution</CardTitle>
              <CardDescription className="text-white/60">
                Your current stat allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {statDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Rank Progress */}
          <Card className="system-panel border-system-blue2">
            <CardHeader>
              <CardTitle className="text-white">Rank Progression</CardTitle>
              <CardDescription className="text-white/60">
                Your journey to the next rank
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Current Rank</span>
                <Badge className="bg-system-blue2 text-black">
                  {currentRank?.name || 'E-Rank'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Progress to {nextRank?.name || 'MAX'}</span>
                  <span className="text-white/60">
                    {getRankPointsAsNumber()}/{nextRank?.points || 'MAX'} pts
                  </span>
                </div>
                <Progress 
                  value={nextRank ? (getRankPointsAsNumber() / nextRank.points) * 100 : 100} 
                  className="h-3 bg-gray-700"
                />
              </div>

              <div className="pt-4 space-y-2 text-sm">
                <div className="flex justify-between items-center">
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
            </CardContent>
          </Card>

          {/* Achievement Summary */}
          <Card className="system-panel border-system-blue2">
            <CardHeader>
              <CardTitle className="text-white">Recent Milestones</CardTitle>
              <CardDescription className="text-white/60">
                Your latest achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Total Quests</span>
                <Badge variant="outline" className="border-system-blue2 text-system-blue2">
                  {totalQuests}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/80">Days Active</span>
                <Badge variant="outline" className="border-green-400 text-green-400">
                  {daysActive}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/80">Badges Earned</span>
                <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                  {badges.length}
                </Badge>
              </div>

              <div className="pt-4">
                <div className="text-sm text-white/60 mb-2">Today's Progress</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">Easy: {dailyQuests.easy || 0}/5</span>
                    <span className="text-yellow-400">Medium: {dailyQuests.medium || 0}/3</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-red-400">Hard: {dailyQuests.hard || 0}/2</span>
                    <span className="text-system-blue2">Total: {getTotalDailyQuests()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
