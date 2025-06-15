
import React from "react";
import SystemPanel from "./SystemPanel";
import QuestCompletionPanel from "./QuestCompletionPanel";
import HunterStatsPanel from "./HunterStatsPanel";
import ShadowArmyPreview from "./ShadowArmyPreview";
import RecentAchievements from "./RecentAchievements";

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
      <SystemPanel className="p-5 min-h-[200px] flex flex-col gap-4 bg-[#0a0a0a90] border-2 border-system-blue2 shadow-blue-glow animate-fade-in">
        <h3 className="font-orbitron text-xl text-system-blue mb-2">
          <span className="font-bold">The System says...</span> Hunter Stats
        </h3>
        <HunterStatsPanel stats={props.stats} />
        <div className="mt-2">
          <span className="text-xs text-system-blue2 font-orbitron">
            <b>Next Rank:</b> {props.nextRank?.name || "MAX"}
            {" "} (<b>Points:</b> {props.rankPoints} / {props.nextRank?.points ?? "MAX"})
          </span>
          <div className="w-full bg-[#191e26] rounded-full h-3 relative border border-system-blue mt-2 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-3 rounded-full bg-gradient-to-r from-system-blue2 to-system-blue animate-pulse transition-all"
              style={{
                width: `${!props.nextRank ? 100 : Math.min((props.rankPoints / (props.nextRank.points || 1)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
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
