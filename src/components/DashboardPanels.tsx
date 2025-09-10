
import React from "react";
import SystemPanel from "./SystemPanel";
import DashboardQuestList from "./DashboardQuestList";
import HunterStatsPanel from "./HunterStatsPanel";
import ShadowArmyPreview from "./ShadowArmyPreview";
import RecentAchievements from "./RecentAchievements";
// ... keep existing code

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
    <div className="w-full grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 dashboard-grid">
      <SystemPanel className="p-5 min-h-[260px] bg-[#0a0a0a90] border-2 border-system-blue2 shadow-blue-glow animate-fade-in">
        <DashboardQuestList
          onQuestComplete={() => {
            props.setSystemNotice("Quest completed! Check your stat panel for gains.");
          }}
        />
      </SystemPanel>
      <SystemPanel className="p-5 min-h-[200px] flex flex-col gap-4 bg-[#0a0a0a90] border-2 border-system-blue2 shadow-blue-glow animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-orbitron text-system-blue text-lg">Hunter Status</h3>
        </div>
        <HunterStatsPanel stats={[
          { label: "Power", val: Math.floor(props.powerLevel / 100) },
          { label: "Rank", val: props.rankPoints },
          { label: "Days", val: props.daysActive },
          { label: "Quest", val: props.streak }
        ]} />
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
