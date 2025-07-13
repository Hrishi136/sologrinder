
import React from "react";
import SystemPanel from "./SystemPanel";
import QuestCompletionPanel from "./QuestCompletionPanel";
import HunterStatsPanel from "./HunterStatsPanel";
import ShadowArmyPreview from "./ShadowArmyPreview";
import RecentAchievements from "./RecentAchievements";
import LeaderboardPanel from "./LeaderboardPanel";

interface Props {
  streak: number;
  dailyQuests: Record<string, number>; // fixed type
  canCompleteQuest: (difficulty: "easy" | "medium" | "hard") => boolean;
  completeQuest: (cat: string, difficulty: "easy" | "medium" | "hard") => boolean;
  setSystemNotice: (msg: string) => void;
  QUEST_CATEGORIES: { key: string, label: string }[]; // fixed type
  stats: any;
  nextRank: any;
  powerLevel: number;
  rankPoints: number;
  daysActive: number;
  shadowArmy: any;
  badges: string[];
  recentAchievements: any[];
  nextMilestone: string;
  handleViewFullArmy: () => void;
  onUserRankClick?: (rank: number) => void;
}

export default function DashboardPanels(props: Props) {
  return (
    <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-2">
      <SystemPanel className="p-5 min-h-[260px] bg-[#0a0a0a90] border-2 border-system-blue2 shadow-blue-glow animate-fade-in">
        <QuestCompletionPanel
          streak={props.streak}
          dailyQuests={props.dailyQuests}
          canCompleteQuest={props.canCompleteQuest}
          completeQuest={props.completeQuest}
          setSystemNotice={props.setSystemNotice}
          QUEST_CATEGORIES={props.QUEST_CATEGORIES}
        />
      </SystemPanel>
      <SystemPanel className="p-5 min-h-[200px] flex flex-col gap-4 bg-[#0a0a0a90] border-2 border-system-blue2 shadow-blue-glow animate-fade-in" data-leaderboard>
        <LeaderboardPanel onUserRankClick={props.onUserRankClick} />
      </SystemPanel>
      <ShadowArmyPreview unlocked={props.shadowArmy.unlocked} allShadows={props.shadowArmy.SHADOWS} onViewAll={props.handleViewFullArmy} />
      <RecentAchievements
        achievements={props.recentAchievements}
        streak={props.streak}
        nextMilestone={props.nextMilestone}
      />
    </div>
  );
}
