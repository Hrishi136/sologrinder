import React from "react";
import SystemPanel from "../components/SystemPanel";
import TopNav from "../components/TopNav";
import SystemNotification from "../components/SystemNotification";
import { useHunterProgression } from "../hooks/useHunterProgression";
import RankUpCeremony from "../components/RankUpCeremony";
import HunterStatsPanel from "../components/HunterStatsPanel";
import QuestCompletionPanel from "../components/QuestCompletionPanel";
import RankRequirementsPanel from "../components/RankRequirementsPanel";
import { useShadowArmy } from "../hooks/useShadowArmy";
import SystemLog from "../components/SystemLog";
import ShadowArmyPreview from "../components/ShadowArmyPreview";
import RecentAchievements from "../components/RecentAchievements";

// Function to get the current logged-in user's name from localStorage
function getCurrentUsername(): string | null {
  return localStorage.getItem("shadowSystem_session");
}

export default function Dashboard() {
  // --- PROGRESSION HOOK ---
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
    showCeremony,
    completeQuest,
    finishCeremony,
    lastBadge,
    currentRankIndex,
    dailyQuests,
    canCompleteQuest,
    blockRankUp,
    getNextRankRequirements,
    questCount,
    QUEST_CATEGORIES,
  } = useHunterProgression();

  const [systemNotice, setSystemNotice] = React.useState<string | null>("Welcome, Hunter. Your journey begins now.");
  const username = getCurrentUsername() || "Hunter";

  // Shadow Army: reserved for future
  const shadowArmy = useShadowArmy();

  // Track rank up block reason
  const [showBlock, setShowBlock] = React.useState(false);
  React.useEffect(() => {
    if (blockRankUp) setShowBlock(true);
  }, [blockRankUp]);

  // System log state
  const [systemLogs, setSystemLogs] = React.useState<{ message: string; timestamp: string; type?: "info"|"warning"|"achievement"; }[]>([
    { message: `System online. Welcome back, Hunter ${username}. Today's quests are ready.`, timestamp: new Date().toLocaleTimeString(), type: "info" }
  ]);
  function addSystemLog(msg: string, type?: "info" | "warning" | "achievement") {
    setSystemLogs(l => [
      ...l,
      { message: msg, timestamp: new Date().toLocaleTimeString(), type }
    ]);
  }
  function clearSystemLogs() { setSystemLogs([]); }

  // Shadow Army preview handler
  function handleViewFullArmy() {
    addSystemLog("Opening full Shadow Army page...", "info");
    // For now redirect not implemented, just message.
  }

  // Recent achievements (stubbed, could be extended from actual badges/shadow unlocks)
  const recentAchievements = [
    ...(badges.slice(-2).map(b => ({ name: b, timestamp: "Today", type: "title" as const }))),
    ...(shadowArmy.unlocked.slice(-1).map(s => ({ name: s, timestamp: "Today", type: "shadow" as const }))),
  ];
  const nextMilestone = "Complete 5 more quests for next Rank";

  return (
    <div className="min-h-screen w-full bg-system-bg relative font-orbitron">
      <TopNav />
      <div className="particle-bg">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="particle-dot"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${18 + Math.random() * 16}px`,
              height: `${18 + Math.random() * 16}px`,
              animationDelay: `${-Math.random() * 14}s`,
              opacity: 0.17 + Math.random() * 0.12,
              bottom: `${Math.random() * 30}vh`
            }}
          />
        ))}
      </div>
      <div className="container mx-auto pt-4 pb-16 flex flex-col gap-8 items-center">
        {/* HEADER SECTION */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-[#0a0a0a90] border-2 border-system-blue2 rounded-xl shadow-blue-glow animate-fade-in mb-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-system-blue2 text-2xl font-extrabold tracking-widest">
                [{currentRank.name}]
              </span>
              {badges.length > 0 &&
                <span title="Rank Badge">
                  {/* Badge with blue glow */}
                  <span className="inline-block text-shadow-lg animate-pulse" style={{ fontSize: 24 }}>
                    🏅
                  </span>
                </span>
              }
              <span className="ml-2 text-white text-lg">Hunter: <b>{username}</b></span>
            </div>
            <div className="text-xs text-white/80">System status: <span className="text-system-blue font-bold">Online</span></div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-system-blue2 font-bold text-base">Power Level</span>
            {/* Animated Power Level */}
            <span className="font-orbitron text-3xl text-system-blue animate-pulse transition-all duration-500">
              {powerLevel}
            </span>
            <span className="text-xs text-white/60">Days Active: {daysActive}</span>
          </div>
        </div>
        {/* MAIN DASHBOARD CARDS */}
        <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-2">
          {/* Card 1: Today's Quests */}
          <SystemPanel className="p-5 min-h-[260px] bg-[#0a0a0a90] border-2 border-system-blue2 shadow-blue-glow animate-fade-in">
            <QuestCompletionPanel
              streak={streak}
              dailyQuests={dailyQuests}
              canCompleteQuest={canCompleteQuest}
              completeQuest={(cat, difficulty) => {
                const ok = completeQuest(cat, difficulty);
                if (ok) {
                  addSystemLog(`Quest completed. +${cat}, +${difficulty}. Rank points & stat gain awarded.`, "achievement");
                  setSystemNotice("Quest completed! Stat/points gained.");
                }
                return ok;
              }}
              setSystemNotice={setSystemNotice}
              QUEST_CATEGORIES={QUEST_CATEGORIES}
            />
          </SystemPanel>
          {/* Card 2: Hunter Stats */}
          <SystemPanel className="p-5 min-h-[200px] flex flex-col gap-4 bg-[#0a0a0a90] border-2 border-system-blue2 shadow-blue-glow animate-fade-in">
            <h3 className="font-orbitron text-xl text-system-blue mb-2">
              <span className="font-bold">The System says...</span> Hunter Stats
            </h3>
            <HunterStatsPanel stats={stats} />
            <div className="mt-2">
              <span className="text-xs text-system-blue2 font-orbitron">
                <b>Next Rank:</b> {nextRank?.name || "MAX"}
                {" "} (<b>Points:</b> {rankPoints} / {nextRank?.points ?? "MAX"})
              </span>
              {/* Animated Progress Bar */}
              <div className="w-full bg-[#191e26] rounded-full h-3 relative border border-system-blue mt-2 overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-3 rounded-full bg-gradient-to-r from-system-blue2 to-system-blue animate-pulse transition-all"
                  style={{
                    width: `${!nextRank ? 100 : Math.min((rankPoints / (nextRank.points || 1)) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </SystemPanel>
          {/* Card 3: Shadow Army Preview */}
          <ShadowArmyPreview unlocked={shadowArmy.unlocked} allShadows={shadowArmy.SHADOWS} onViewAll={handleViewFullArmy} />
          {/* Card 4: Recent Achievements & Streak */}
          <RecentAchievements
            achievements={recentAchievements}
            streak={streak}
            nextMilestone={nextMilestone}
          />
        </div>
        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-[108]">
          <button className="glow-button animate-pulse hover:scale-105 focus:scale-105 bg-gradient-to-r from-system-blue to-system-blue2 px-7 py-3 rounded-full shadow-lg font-orbitron text-lg"
            onClick={() => setSystemNotice("A new quest awaits! Open the Quest List to accept your next challenge.")}
            style={{ boxShadow: "0 0 24px 8px #00d4ff99" }}>
            + Accept New Quest
          </button>
        </div>
        {/* SYSTEM LOG FEED */}
        <SystemLog logs={systemLogs} onClear={clearSystemLogs} />
        {/* Modals and overlays */}
        {/* RANK UP CEREMONY OVERLAY */}
        {showCeremony && (
          <RankUpCeremony
            rankName={currentRank.name}
            badgeIcon={lastBadge || "badge"}
            onContinue={finishCeremony}
          />
        )}
        {/* SYSTEM NOTIFICATION MODAL */}
        <SystemNotification
          open={!!systemNotice}
          message={systemNotice}
          onClose={() => setSystemNotice(null)}
        />
        {/* Rank up block modal */}
        <SystemNotification
          open={showBlock && !!blockRankUp}
          message={
            <>
              <b>Requirements for next rank not met:</b>
              <ul className="text-xs mt-2 text-left px-2 text-system-blue2 list-disc">
                {(blockRankUp?.reason ?? "").split(", ").map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </>
          }
          onClose={() => setShowBlock(false)}
          tone="error"
        />
      </div>
    </div>
  );
}
// NOTE: This file has been split into smaller component files for maintainability.
