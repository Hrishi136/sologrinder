import React from "react";
import { useNavigate } from "react-router-dom";
import { useHunterProgression } from "../hooks/useHunterProgression";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain, TrendingUp, Target, AlertTriangle, CheckCircle, Clock, Trophy } from "lucide-react";

export default function SystemAnalysis() {
  const navigate = useNavigate();
  const {
    stats,
    currentRank,
    questCount,
    streak,
    totalQuests,
    powerLevel
  } = useHunterProgression();

  // Calculate personalized insights
  const getPersonalizedInsights = () => {
    const totalCompleted = questCount.easy + questCount.medium + questCount.hard;
    const easyRate = totalCompleted > 0 ? (questCount.easy / totalCompleted) * 100 : 0;
    const mediumRate = totalCompleted > 0 ? (questCount.medium / totalCompleted) * 100 : 0;
    const hardRate = totalCompleted > 0 ? (questCount.hard / totalCompleted) * 100 : 0;

    const insights = {
      strengths: [],
      weaknesses: [],
      recommendations: []
    };

    // Analyze strengths
    if (hardRate > 30) insights.strengths.push("Exceptional hard quest performance");
    if (streak > 7) insights.strengths.push("Outstanding consistency with quest streaks");
    if (easyRate < 50) insights.strengths.push("Focus on challenging content over easy wins");

    // Analyze weaknesses  
    if (hardRate < 10 && totalCompleted > 5) insights.weaknesses.push("Hard quest completion rate below average");
    if (streak < 3 && totalCompleted > 10) insights.weaknesses.push("Consistency in daily quest completion needs improvement");
    if (mediumRate < 20 && totalCompleted > 5) insights.weaknesses.push("Medium difficulty quest engagement is low");

    // Generate recommendations
    if (hardRate < 20) insights.recommendations.push("Recommended: Increase hard quest difficulty to accelerate growth");
    if (streak < 5) insights.recommendations.push("Suggested: Establish daily quest routine for better consistency");
    if (powerLevel < 100) insights.recommendations.push("Focus: Complete more quests to rapidly increase power level");

    return insights;
  };

  const insights = getPersonalizedInsights();
  const estimatedDaysToNextRank = Math.ceil((300 - powerLevel) / 15); // Assuming 15 power per quest

  return (
    <div className="min-h-screen bg-system-bg font-orbitron">
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
              animationDelay: `${-Math.random() * 8}s`,
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
            System Analysis
          </h1>
          <p className="text-white/80 text-lg">
            Personalized Hunter Performance Insights
          </p>
        </div>

        {/* Hunter Assessment Report */}
        <Card className="system-panel border-system-blue2 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-system-blue2" />
              Hunter Assessment Complete
            </CardTitle>
            <CardDescription className="text-white/60">
              Weekly performance analysis and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{Math.round((questCount.easy + questCount.medium + questCount.hard) / Math.max(totalQuests, 1) * 100) || 0}%</div>
                <div className="text-white/60">Overall Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-system-blue2">{streak} days</div>
                <div className="text-white/60">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{estimatedDaysToNextRank}</div>
                <div className="text-white/60">Days to Next Rank</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <Card className="system-panel border-green-400">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Recognized Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.strengths.length > 0 ? (
                insights.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Trophy className="h-4 w-4 text-green-400" />
                    <span className="text-white/80">{strength}</span>
                  </div>
                ))
              ) : (
                <div className="text-white/60">Complete more quests to unlock strength analysis</div>
              )}
            </CardContent>
          </Card>

          {/* Weaknesses */}
          <Card className="system-panel border-yellow-400">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.weaknesses.length > 0 ? (
                insights.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-yellow-400" />
                    <span className="text-white/80">{weakness}</span>
                  </div>
                ))
              ) : (
                <div className="text-white/60">Excellent performance across all areas!</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="system-panel border-system-blue2 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-system-blue2" />
              System Recommendations
            </CardTitle>
            <CardDescription className="text-white/60">
              Personalized challenges to accelerate your growth
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.recommendations.length > 0 ? (
              insights.recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-system-blue/10 rounded-lg border border-system-blue/30">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-system-blue2 mt-0.5" />
                    <span className="text-white/90">{rec}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white/60">Complete more quests to receive personalized recommendations</div>
            )}
          </CardContent>
        </Card>

        {/* Progress Milestones Timeline */}
        <Card className="system-panel border-system-blue2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-system-blue2" />
              Achievement Timeline
            </CardTitle>
            <CardDescription className="text-white/60">
              Major milestones in your hunter journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-white font-medium">Hunter Registration Complete</div>
                  <div className="text-white/60 text-sm">System access granted</div>
                </div>
                <Badge variant="outline" className="border-green-400 text-green-400">Completed</Badge>
              </div>
              
              {totalQuests > 0 && (
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white font-medium">First Quest Completed</div>
                    <div className="text-white/60 text-sm">Power level: {Math.min(15, powerLevel)}</div>
                  </div>
                  <Badge variant="outline" className="border-green-400 text-green-400">Completed</Badge>
                </div>
              )}

              {currentRank?.name !== 'E-Rank' && (
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Rank Advancement</div>
                    <div className="text-white/60 text-sm">Promoted to {currentRank?.name}</div>
                  </div>
                  <Badge variant="outline" className="border-green-400 text-green-400">Completed</Badge>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-system-blue2 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-white font-medium">Next Rank Achievement</div>
                  <div className="text-white/60 text-sm">Estimated: {estimatedDaysToNextRank} days remaining</div>
                </div>
                <Badge variant="outline" className="border-system-blue2 text-system-blue2">In Progress</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}