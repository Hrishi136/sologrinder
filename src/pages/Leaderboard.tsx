import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHunterProgression } from "../hooks/useHunterProgression";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Trophy, Crown, Users, Star, Share2, ChevronDown, Sword, Shield, Zap } from "lucide-react";

export default function Leaderboard() {
  const navigate = useNavigate();
  const [selectedGuild, setSelectedGuild] = useState("shadow-legion");
  const { powerLevel, currentRank, totalQuests, streak } = useHunterProgression();

  // Mock leaderboard data
  const globalRankings = [
    { rank: 1, name: "Sung Jin-Woo", level: 2847, guild: "Shadow Legion", title: "Shadow Monarch", powerLevel: 9999 },
    { rank: 2, name: "Thomas Andre", level: 1892, guild: "Scavenger Guild", title: "Goliath", powerLevel: 8500 },
    { rank: 3, name: "Liu Zhigang", level: 1756, guild: "Hunters Guild", title: "Nation's Power", powerLevel: 8200 },
    { rank: 4, name: "Goto Ryuji", level: 1634, guild: "Draw Sword", title: "Sword Saint", powerLevel: 7900 },
    { rank: 5, name: "Choi Jong-In", level: 1587, guild: "Hunters Guild", title: "Ultimate Soldier", powerLevel: 7650 },
    { rank: 6, name: "Baek Yoon-Ho", level: 1456, guild: "White Tiger", title: "White Tiger", powerLevel: 7200 },
    { rank: 7, name: "Ma Dong-Wook", level: 1398, guild: "Hunters Guild", title: "Iron Wall", powerLevel: 6980 },
    { rank: 8, name: "Min Byung-Gyu", level: 1287, guild: "Monitoring Division", title: "Observer", powerLevel: 6750 },
    { rank: 9, name: "Cha Hae-In", level: 1245, guild: "Hunters Guild", title: "Sword Dancer", powerLevel: 6500 },
    { rank: 10, name: "You", level: Math.floor(powerLevel/10), guild: selectedGuild === "shadow-legion" ? "Shadow Legion" : selectedGuild === "hunters-guild" ? "Hunters Guild" : "White Tiger", title: currentRank?.name || "E-Rank", powerLevel: powerLevel }
  ].sort((a, b) => b.powerLevel - a.powerLevel);

  const weeklyChallenge = {
    name: "Shadow Mastery Week",
    description: "Complete the most hard difficulty quests",
    timeLeft: "3 days, 14 hours",
    reward: "Legendary Shadow Soldier",
    participants: 1247,
    yourRank: Math.min(Math.floor(Math.random() * 50) + 1, totalQuests * 2)
  };

  const guilds = [
    { 
      id: "shadow-legion", 
      name: "Shadow Legion", 
      members: 5847, 
      level: 89, 
      description: "Elite hunters who command the shadows",
      icon: "⚫",
      powerLevel: 445280,
      rank: 1
    },
    { 
      id: "hunters-guild", 
      name: "Hunters Guild", 
      members: 12450, 
      level: 76, 
      description: "The most prestigious hunting organization",
      icon: "⚔️",
      powerLevel: 389120,
      rank: 2
    },
    { 
      id: "white-tiger", 
      name: "White Tiger Guild", 
      members: 3240, 
      level: 72, 
      description: "Speed and precision in every hunt",
      icon: "🐅",
      powerLevel: 298750,
      rank: 3
    }
  ];

  const achievements = [
    { title: "Shadow Sovereign", rarity: "Mythical", description: "Command 1000+ Shadow Soldiers", unlocked: false },
    { title: "Demon Slayer", rarity: "Legendary", description: "Defeat 100 S-Rank monsters", unlocked: totalQuests > 50 },
    { title: "Dungeon Conqueror", rarity: "Epic", description: "Clear 500 dungeons", unlocked: totalQuests > 25 },
    { title: "Rising Star", rarity: "Rare", description: "Reach C-Rank", unlocked: powerLevel > 300 },
    { title: "Consistent Hunter", rarity: "Common", description: "Maintain 7-day streak", unlocked: streak >= 7 }
  ];

  const generateAchievementCard = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 400;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);
    
    // Add text
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('Hunter Achievement', 50, 80);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText(`Power Level: ${powerLevel}`, 50, 150);
    ctx.fillText(`Rank: ${currentRank?.name || 'E-Rank'}`, 50, 190);
    ctx.fillText(`Total Quests: ${totalQuests}`, 50, 230);
    ctx.fillText(`Current Streak: ${streak} days`, 50, 270);
    
    return canvas.toDataURL();
  };

  const shareAchievement = () => {
    const imageData = generateAchievementCard();
    const link = document.createElement('a');
    link.download = 'hunter-achievement.png';
    link.href = imageData;
    link.click();
  };

  return (
    <div className="min-h-screen bg-system-bg font-orbitron">
      {/* Particle background */}
      <div className="particle-bg pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="particle-dot"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${12 + Math.random() * 8}px`,
              height: `${12 + Math.random() * 8}px`,
              animationDelay: `${-Math.random() * 10}s`,
              opacity: 0.1 + Math.random() * 0.1,
              bottom: `${Math.random() * 40}vh`,
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
            Hunter Leaderboards
          </h1>
          <p className="text-white/80 text-lg">
            Compete with hunters across all dimensions
          </p>
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-system-panel border border-system-blue/30">
            <TabsTrigger value="global" className="text-white data-[state=active]:bg-system-blue data-[state=active]:text-black">
              Global Rankings
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-white data-[state=active]:bg-system-blue data-[state=active]:text-black">
              Weekly Challenge
            </TabsTrigger>
            <TabsTrigger value="guilds" className="text-white data-[state=active]:bg-system-blue data-[state=active]:text-black">
              Guild System
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-white data-[state=active]:bg-system-blue data-[state=active]:text-black">
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Global Rankings Tab */}
          <TabsContent value="global" className="space-y-6">
            <Card className="system-panel border-system-blue2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Global Hunter Rankings
                </CardTitle>
                <CardDescription className="text-white/60">
                  Top hunters across all dimensions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {globalRankings.map((hunter, index) => (
                    <div 
                      key={hunter.rank} 
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        hunter.name === "You" 
                          ? "border-system-blue bg-system-blue/10" 
                          : "border-white/20 bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          hunter.rank === 1 ? "bg-yellow-400 text-black" :
                          hunter.rank === 2 ? "bg-gray-300 text-black" :
                          hunter.rank === 3 ? "bg-yellow-600 text-white" :
                          "bg-system-blue text-white"
                        }`}>
                          {hunter.rank}
                        </div>
                        <div>
                          <div className="text-white font-medium">{hunter.name}</div>
                          <div className="text-white/60 text-sm">{hunter.guild} • {hunter.title}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-system-blue font-bold">{hunter.powerLevel.toLocaleString()}</div>
                        <div className="text-white/60 text-sm">Power Level</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly Challenge Tab */}
          <TabsContent value="weekly" className="space-y-6">
            <Card className="system-panel border-system-blue2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="h-5 w-5 text-system-blue2" />
                  {weeklyChallenge.name}
                </CardTitle>
                <CardDescription className="text-white/60">
                  {weeklyChallenge.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{weeklyChallenge.timeLeft}</div>
                    <div className="text-white/60">Time Remaining</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-system-blue2">{weeklyChallenge.yourRank}</div>
                    <div className="text-white/60">Your Rank</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{weeklyChallenge.participants}</div>
                    <div className="text-white/60">Participants</div>
                  </div>
                </div>
                
                <div className="p-4 bg-system-blue/10 rounded-lg border border-system-blue/30">
                  <div className="text-white font-medium mb-2">Reward: {weeklyChallenge.reward}</div>
                  <div className="text-white/60">Complete hard difficulty quests to climb the rankings!</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guild System Tab */}
          <TabsContent value="guilds" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="system-panel border-system-blue2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-system-blue2" />
                    Your Guild
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full text-system-blue border-system-blue hover:bg-system-blue/10">
                          {guilds.find(g => g.id === selectedGuild)?.name || "Select Guild"}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full bg-system-panel border-system-blue">
                        {guilds.map(guild => (
                          <DropdownMenuItem 
                            key={guild.id}
                            className="text-white hover:bg-system-blue/20"
                            onClick={() => setSelectedGuild(guild.id)}
                          >
                            {guild.icon} {guild.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {selectedGuild && (
                      <div className="p-4 bg-system-blue/10 rounded-lg border border-system-blue/30">
                        <div className="text-white font-medium mb-2">
                          {guilds.find(g => g.id === selectedGuild)?.name}
                        </div>
                        <div className="text-white/60 text-sm mb-3">
                          {guilds.find(g => g.id === selectedGuild)?.description}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-system-blue2 font-medium">
                              {guilds.find(g => g.id === selectedGuild)?.members.toLocaleString()}
                            </div>
                            <div className="text-white/60">Members</div>
                          </div>
                          <div>
                            <div className="text-system-blue2 font-medium">
                              #{guilds.find(g => g.id === selectedGuild)?.rank}
                            </div>
                            <div className="text-white/60">Guild Rank</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="system-panel border-system-blue2">
                <CardHeader>
                  <CardTitle className="text-white">Guild Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {guilds.map((guild, index) => (
                      <div key={guild.id} className="flex items-center justify-between p-3 rounded-lg border border-white/20 bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{guild.icon}</div>
                          <div>
                            <div className="text-white font-medium">{guild.name}</div>
                            <div className="text-white/60 text-sm">{guild.members.toLocaleString()} members</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-system-blue font-bold">#{guild.rank}</div>
                          <div className="text-white/60 text-sm">{guild.powerLevel.toLocaleString()} power</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="system-panel border-system-blue2">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-400" />
                      Achievement Showcase
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Display your rare titles and accomplishments
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={shareAchievement}
                    variant="outline" 
                    size="sm"
                    className="text-system-blue border-system-blue hover:bg-system-blue/10"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border ${
                          achievement.unlocked 
                            ? "border-system-blue bg-system-blue/10" 
                            : "border-white/20 bg-white/5 opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">{achievement.title}</div>
                            <div className="text-white/60 text-sm">{achievement.description}</div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${
                              achievement.rarity === 'Mythical' ? 'border-purple-400 text-purple-400' :
                              achievement.rarity === 'Legendary' ? 'border-yellow-400 text-yellow-400' :
                              achievement.rarity === 'Epic' ? 'border-purple-300 text-purple-300' :
                              achievement.rarity === 'Rare' ? 'border-blue-400 text-blue-400' :
                              'border-gray-400 text-gray-400'
                            }`}
                          >
                            {achievement.rarity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="system-panel border-system-blue2">
                <CardHeader>
                  <CardTitle className="text-white">Progress Sharing</CardTitle>
                  <CardDescription className="text-white/60">
                    Generate cards to share your achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-system-blue/20 to-system-blue2/20 rounded-lg border border-system-blue/50">
                      <div className="text-white font-medium mb-2">Your Hunter Card</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-system-blue2 font-medium">{powerLevel}</div>
                          <div className="text-white/60">Power Level</div>
                        </div>
                        <div>
                          <div className="text-system-blue2 font-medium">{currentRank?.name || 'E-Rank'}</div>
                          <div className="text-white/60">Current Rank</div>
                        </div>
                        <div>
                          <div className="text-system-blue2 font-medium">{totalQuests}</div>
                          <div className="text-white/60">Total Quests</div>
                        </div>
                        <div>
                          <div className="text-system-blue2 font-medium">{streak} days</div>
                          <div className="text-white/60">Current Streak</div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={shareAchievement}
                      className="w-full bg-system-blue hover:bg-system-blue/80 text-black font-medium"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Generate Achievement Card
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}