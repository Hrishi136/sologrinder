import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHunterProgression } from "../hooks/useHunterProgression";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Globe, Calendar, Users, Trophy, Gift, Snowflake, Flame, Zap, Crown, Target } from "lucide-react";

export default function Community() {
  const navigate = useNavigate();
  const { totalQuests, powerLevel, currentRank } = useHunterProgression();

  // Mock community data
  const monthlyGoal = {
    title: "February Hunter Challenge",
    description: "All hunters worldwide complete 50,000 quests this month",
    current: 34567,
    target: 50000,
    timeLeft: "14 days remaining",
    reward: "Exclusive 'Community Hero' title",
    yourContribution: totalQuests
  };

  const seasonalEvent = {
    title: "Winter Shadow Training Arc",
    description: "Special training program with enhanced shadow abilities",
    startDate: "February 1st",
    endDate: "February 28th",
    progress: 67,
    specialRewards: [
      { name: "Frost Shadow Soldier", rarity: "Legendary", progress: 45 },
      { name: "Winter Monarch Crown", rarity: "Mythical", progress: 12 },
      { name: "Ice Blade Enhancement", rarity: "Epic", progress: 78 }
    ],
    eventQuests: [
      { title: "Frozen Dungeon Conquest", difficulty: "Hard", reward: "Ice Crystal x5", completed: totalQuests > 10 },
      { title: "Shadow Ice Fusion", difficulty: "Medium", reward: "Frost Essence x10", completed: totalQuests > 5 },
      { title: "Winter Survival Challenge", difficulty: "Easy", reward: "Winter Cloak", completed: totalQuests > 0 }
    ]
  };

  const guildCompetition = {
    title: "Guild Wars: Shadow Supremacy",
    description: "Monthly guild vs guild competition",
    season: "Season 3",
    timeLeft: "7 days remaining",
    standings: [
      { rank: 1, guild: "Shadow Legion", points: 125890, members: 5847, trend: "up" },
      { rank: 2, guild: "Hunters Guild", points: 119240, members: 12450, trend: "up" },
      { rank: 3, guild: "White Tiger", points: 98567, members: 3240, trend: "down" },
      { rank: 4, guild: "Scavenger Guild", points: 87432, members: 2156, trend: "up" },
      { rank: 5, guild: "Draw Sword", points: 76234, members: 1890, trend: "down" }
    ],
    rewards: [
      { position: "1st Place", reward: "Legendary Guild Banner + 50,000 Gold" },
      { position: "2nd Place", reward: "Epic Guild Banner + 30,000 Gold" },
      { position: "3rd Place", reward: "Rare Guild Banner + 15,000 Gold" }
    ]
  };

  const communityAchievements = [
    {
      title: "Million Shadow Army",
      description: "Hunters worldwide unlocked 1,000,000 shadow soldiers",
      current: 847623,
      target: 1000000,
      completed: false,
      reward: "Global Shadow Power Boost +10%"
    },
    {
      title: "Dimensional Breach",
      description: "Community cleared 100,000 S-Rank dungeons",
      current: 89453,
      target: 100000,
      completed: false,
      reward: "New Dimension: Chaos Realm"
    },
    {
      title: "Hunter Unity",
      description: "10,000 active hunters online simultaneously",
      current: 12847,
      target: 10000,
      completed: true,
      reward: "Unity Badge (Unlocked!)"
    }
  ];

  const limitedTimeEvents = [
    {
      title: "Shadow Monarch's Return",
      description: "Special event celebrating the return of the Shadow Monarch",
      timeLeft: "2 days, 14 hours",
      difficulty: "Mythical",
      rewards: ["Shadow Monarch Fragment", "Legendary Weapon Box", "100,000 Gold"],
      participants: 3456,
      completed: false
    },
    {
      title: "Demon Tower Siege",
      description: "Collaborative raid on the 100-floor Demon Tower",
      timeLeft: "5 days, 8 hours",
      difficulty: "Epic",
      rewards: ["Demon Core", "Epic Armor Set", "Skill Enhancement Stone"],
      participants: 8912,
      completed: false
    }
  ];

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
              width: `${14 + Math.random() * 10}px`,
              height: `${14 + Math.random() * 10}px`,
              animationDelay: `${-Math.random() * 12}s`,
              opacity: 0.12 + Math.random() * 0.08,
              bottom: `${Math.random() * 45}vh`,
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
            Hunter Community
          </h1>
          <p className="text-white/80 text-lg">
            Join global challenges and seasonal events
          </p>
        </div>

        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-system-panel border border-system-blue/30">
            <TabsTrigger value="monthly" className="text-white data-[state=active]:bg-system-blue data-[state=active]:text-black">
              Monthly Goals
            </TabsTrigger>
            <TabsTrigger value="seasonal" className="text-white data-[state=active]:bg-system-blue data-[state=active]:text-black">
              Seasonal Events
            </TabsTrigger>
            <TabsTrigger value="guild-wars" className="text-white data-[state=active]:bg-system-blue data-[state=active]:text-black">
              Guild Wars
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-white data-[state=active]:bg-system-blue data-[state=active]:text-black">
              Community Goals
            </TabsTrigger>
          </TabsList>

          {/* Monthly Goals Tab */}
          <TabsContent value="monthly" className="space-y-6">
            <Card className="system-panel border-system-blue2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-system-blue2" />
                  {monthlyGoal.title}
                </CardTitle>
                <CardDescription className="text-white/60">
                  {monthlyGoal.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Global Progress</span>
                    <span className="text-system-blue2 font-bold">
                      {monthlyGoal.current.toLocaleString()} / {monthlyGoal.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={(monthlyGoal.current / monthlyGoal.target) * 100} 
                    className="h-3 bg-gray-700" 
                  />
                  <div className="flex justify-between text-sm text-white/60">
                    <span>{Math.round((monthlyGoal.current / monthlyGoal.target) * 100)}% Complete</span>
                    <span>{monthlyGoal.timeLeft}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-system-blue/10 rounded-lg border border-system-blue/30">
                    <div className="text-white font-medium mb-2">Your Contribution</div>
                    <div className="text-2xl font-bold text-system-blue2">{monthlyGoal.yourContribution}</div>
                    <div className="text-white/60 text-sm">Quests completed this month</div>
                  </div>
                  <div className="p-4 bg-green-400/10 rounded-lg border border-green-400/30">
                    <div className="text-white font-medium mb-2">Community Reward</div>
                    <div className="text-green-400 font-bold">{monthlyGoal.reward}</div>
                    <div className="text-white/60 text-sm">Unlocked when goal is reached</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seasonal Events Tab */}
          <TabsContent value="seasonal" className="space-y-6">
            <Card className="system-panel border-blue-400">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Snowflake className="h-5 w-5 text-blue-400" />
                  {seasonalEvent.title}
                </CardTitle>
                <CardDescription className="text-white/60">
                  {seasonalEvent.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">{seasonalEvent.startDate}</div>
                    <div className="text-white/60">Start Date</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">{seasonalEvent.endDate}</div>
                    <div className="text-white/60">End Date</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">{seasonalEvent.progress}%</div>
                    <div className="text-white/60">Event Progress</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-medium">Special Rewards</h3>
                  {seasonalEvent.specialRewards.map((reward, index) => (
                    <div key={index} className="p-3 bg-blue-400/10 rounded-lg border border-blue-400/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{reward.name}</span>
                        <Badge variant="outline" className="border-blue-400 text-blue-400">
                          {reward.rarity}
                        </Badge>
                      </div>
                      <Progress value={reward.progress} className="h-2" />
                      <div className="text-white/60 text-sm mt-1">{reward.progress}% Progress</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-medium">Event Quests</h3>
                  {seasonalEvent.eventQuests.map((quest, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{quest.title}</div>
                          <div className="text-white/60 text-sm">{quest.reward}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${
                            quest.difficulty === 'Hard' ? 'border-red-400 text-red-400' :
                            quest.difficulty === 'Medium' ? 'border-yellow-400 text-yellow-400' :
                            'border-green-400 text-green-400'
                          }`}>
                            {quest.difficulty}
                          </Badge>
                          {quest.completed && (
                            <Badge className="bg-green-400 text-black">Completed</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guild Wars Tab */}
          <TabsContent value="guild-wars" className="space-y-6">
            <Card className="system-panel border-red-400">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="h-5 w-5 text-red-400" />
                  {guildCompetition.title}
                </CardTitle>
                <CardDescription className="text-white/60">
                  {guildCompetition.description} • {guildCompetition.season}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400 mb-2">{guildCompetition.timeLeft}</div>
                  <div className="text-white/60">Competition ends in</div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white font-medium">Current Standings</h3>
                  {guildCompetition.standings.map((guild, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-white/20 bg-white/5">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          guild.rank === 1 ? "bg-yellow-400 text-black" :
                          guild.rank === 2 ? "bg-gray-300 text-black" :
                          guild.rank === 3 ? "bg-yellow-600 text-white" :
                          "bg-system-blue text-white"
                        }`}>
                          {guild.rank}
                        </div>
                        <div>
                          <div className="text-white font-medium">{guild.guild}</div>
                          <div className="text-white/60 text-sm">{guild.members.toLocaleString()} members</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-system-blue font-bold">{guild.points.toLocaleString()}</div>
                          <div className="text-white/60 text-sm">Points</div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          guild.trend === 'up' ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="text-white font-medium">Competition Rewards</h3>
                  {guildCompetition.rewards.map((reward, index) => (
                    <div key={index} className="p-3 bg-red-400/10 rounded-lg border border-red-400/30">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{reward.position}</span>
                        <span className="text-red-400">{reward.reward}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="space-y-6">
              {communityAchievements.map((achievement, index) => (
                <Card key={index} className={`system-panel ${
                  achievement.completed ? 'border-green-400' : 'border-system-blue2'
                }`}>
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className={`h-5 w-5 ${
                        achievement.completed ? 'text-green-400' : 'text-system-blue2'
                      }`} />
                      {achievement.title}
                      {achievement.completed && (
                        <Badge className="bg-green-400 text-black ml-2">Completed!</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      {achievement.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Progress</span>
                        <span className={`font-bold ${
                          achievement.completed ? 'text-green-400' : 'text-system-blue2'
                        }`}>
                          {achievement.current.toLocaleString()} / {achievement.target.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min((achievement.current / achievement.target) * 100, 100)} 
                        className="h-3 bg-gray-700" 
                      />
                    </div>
                    <div className="p-3 bg-system-blue/10 rounded-lg border border-system-blue/30">
                      <div className="text-white font-medium">Community Reward</div>
                      <div className="text-system-blue2">{achievement.reward}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="system-panel border-purple-400">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Flame className="h-5 w-5 text-purple-400" />
                  Limited Time Events
                </CardTitle>
                <CardDescription className="text-white/60">
                  Special events with exclusive rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {limitedTimeEvents.map((event, index) => (
                  <div key={index} className="p-4 bg-purple-400/10 rounded-lg border border-purple-400/30">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-white font-medium">{event.title}</div>
                        <div className="text-white/60 text-sm">{event.description}</div>
                      </div>
                      <Badge variant="outline" className="border-purple-400 text-purple-400">
                        {event.difficulty}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-purple-400 font-bold">{event.timeLeft}</div>
                        <div className="text-white/60 text-sm">Time remaining</div>
                      </div>
                      <div>
                        <div className="text-purple-400 font-bold">{event.participants.toLocaleString()}</div>
                        <div className="text-white/60 text-sm">Participants</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-white/80 text-sm">Rewards:</div>
                      <div className="flex flex-wrap gap-2">
                        {event.rewards.map((reward, rIndex) => (
                          <Badge key={rIndex} variant="outline" className="border-purple-400 text-purple-400">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}