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
    QUEST_TYPES,
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

  return (
    <div className="min-h-screen w-full bg-system-bg relative">
      <TopNav />
      <div className="particle-bg">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="particle-dot"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${18 + Math.random() * 16}px`,
              height: `${18 + Math.random() * 16}px`,
              animationDelay: `${-Math.random() * 14}s`,
              opacity: 0.15 + Math.random() * 0.12,
              bottom: `${Math.random() * 30}vh`
            }}
          />
        ))}
      </div>
      <div className="container mx-auto pt-4 pb-16 flex flex-col gap-8 items-center">
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

        {/* Rank up block modal (when requirements not met) */}
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

        <SystemPanel className="w-full max-w-4xl mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8 p-6">
            <div>
              <h2 className="font-orbitron text-4xl text-system-blue mb-1 font-extrabold tracking-widest">
                [{currentRank.name}]
              </h2>
              <p className="uppercase text-system-blue2 mb-2 font-bold text-lg">
                Hunter: {username}
              </p>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-orbitron text-system-blue2">
                  <span className="font-bold">The System says...</span> Stay disciplined to increase your Hunter Rank!
                </span>
                <span className="text-xs font-orbitron text-white/70">
                  Days as current rank: <b className="text-system-blue2">{daysActive}</b>
                </span>
                {/* BADGES EARNED */}
                <div className="flex gap-2 mt-1">
                  {badges.map((badge, idx) => (
                    <span key={badge + idx} className="inline-block">
                      {badge === "badge" && <span title="E-Rank"><span className="text-system-blue" style={{ fontSize: 20 }}>🏅</span></span>}
                      {badge === "badge-check" && <span title="D-Rank"><span className="text-blue-400" style={{ fontSize: 20 }}>✔️</span></span>}
                      {badge === "star-half" && <span title="C-Rank"><span className="text-cyan-300" style={{ fontSize: 20 }}>⭐</span></span>}
                      {badge === "star" && <span title="B-Rank"><span className="text-yellow-300" style={{ fontSize: 20 }}>🌟</span></span>}
                      {badge === "trophy" && <span title="A-Rank"><span className="text-yellow-500" style={{ fontSize: 20 }}>🏆</span></span>}
                      {badge === "award" && <span title="S-Rank"><span className="text-rose-400" style={{ fontSize: 20 }}>🎖️</span></span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="font-orbitron text-2xl text-system-blue">
                Power Level
              </span>
              <span className="font-orbitron text-3xl text-system-blue2 animate-pulse">
                {powerLevel}
              </span>
              <span className="text-xs text-system-blue2/90 font-orbitron">
                <span className="font-bold">Rank Points:</span> {rankPoints} / {nextRank?.points ?? "MAX"}
              </span>
              <div className="mt-2">
                <span className="text-xs text-system-blue2/80">Streak: <b>{streak} days</b></span>
              </div>
            </div>
          </div>
          {/* Rank Progress Bar */}
          <div className="w-full bg-[#191e26] rounded-full h-5 relative border border-system-blue mt-2 mb-4 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-5 rounded-full bg-gradient-to-r from-system-blue2 to-system-blue transition-all"
              style={{
                width: `${!nextRank ? 100 : Math.min((rankPoints / (nextRank.points || 1)) * 100, 100)}%`,
              }}
            />
            <span className="font-orbitron text-system-blue absolute left-2 top-0 h-5 flex items-center" style={{ fontSize: '1.1rem' }}>
              Next Rank: {nextRank?.name || "MAX"}
            </span>
          </div>
          {/* Next rank requirements */}
          <RankRequirementsPanel nextRank={nextRank} getNextRankRequirements={getNextRankRequirements} />
        </SystemPanel>

        {/* System Notices: Subtle motivational message */}
        <SystemPanel className="w-full max-w-4xl text-center bg-opacity-80">
          <div className="font-orbitron text-system-blue2 animate-fade-in flex justify-center items-center gap-3 text-base">
            <span className="font-bold">The System says...</span>
            Unlock new abilities as your Rank increases! Maintain your quest streak for bonus points.
          </div>
        </SystemPanel>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Today's Quests */}
          <SystemPanel className="p-5 min-h-[240px]">
            <QuestCompletionPanel
              QUEST_TYPES={QUEST_TYPES}
              streak={streak}
              dailyQuests={dailyQuests}
              canCompleteQuest={canCompleteQuest}
              completeQuest={completeQuest}
              setSystemNotice={setSystemNotice}
            />
          </SystemPanel>
          {/* Quick Stats */}
          <SystemPanel className="p-5 min-h-[200px] flex flex-col gap-4">
            <h3 className="font-orbitron text-xl text-system-blue mb-2">
              <span className="font-bold">The System says...</span> Quick Stats
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-system-blue">Completed Quests</span>
                <span className="font-bold text-white">{totalQuests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-system-blue">Streak</span>
                <span className="font-bold text-white">{streak} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-system-blue">Next Rank</span>
                <span className="font-bold text-white">
                  {nextRank?.name || "MAX"}
                </span>
              </div>
            </div>
          </SystemPanel>
          {/* Core Stats */}
          <SystemPanel className="md:col-span-2 p-5">
            <h3 className="font-orbitron text-xl text-system-blue mb-4">
              <span className="font-bold">The System says...</span> Hunter Stats
            </h3>
            <HunterStatsPanel stats={stats} />
          </SystemPanel>
        </div>
        <div className="w-full flex justify-end mt-6">
          <button className="glow-button text-lg"
            onClick={() => setSystemNotice("A new quest awaits! Open the Quest List to accept your next challenge.")}>
            + Accept New Quest
          </button>
        </div>
        {/* Placeholder: Shadow Army panel UI could go here in future */}
      </div>
    </div>
  );
}

// NOTE: This file has been split into smaller component files for maintainability.
