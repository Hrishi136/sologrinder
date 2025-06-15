
import React from "react";
import SystemPanel from "../components/SystemPanel";
import TopNav from "../components/TopNav";
import SystemNotification from "../components/SystemNotification";
import { useHunterProgression } from "../hooks/useHunterProgression";
import RankUpCeremony from "../components/RankUpCeremony";

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
    nextThreshold,
    daysAtRank,
    badges,
    showCeremony,
    completeQuest,
    finishCeremony,
    lastBadge,
    currentRankIndex
  } = useHunterProgression();

  const [systemNotice, setSystemNotice] = React.useState<string | null>("Welcome, Hunter. Your journey begins now.");
  const username = getCurrentUsername() || "Hunter";

  // For demo: simulate completing quest to trigger rank up
  // Removed the demo button as per user feedback

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
                  Days as current rank: <b className="text-system-blue2">{daysAtRank}</b>
                </span>
                {/* BADGES EARNED */}
                <div className="flex gap-2 mt-1">
                  {badges.map((badge, idx) => (
                    <span key={badge + idx} className="inline-block">
                      {/* Render a tiny icon for each badge, with a tooltip maybe */}
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
                <span className="font-bold">Rank Points:</span> {rankPoints} / {nextThreshold ?? "MAX"}
              </span>
            </div>
          </div>
          {/* Rank Progress Bar */}
          <div className="w-full bg-[#191e26] rounded-full h-5 relative border border-system-blue mt-2 mb-4 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-5 rounded-full bg-gradient-to-r from-system-blue2 to-system-blue transition-all"
              style={{
                width: `${!nextThreshold ? 100 : Math.min((rankPoints / nextThreshold) * 100, 100)}%`,
              }}
            />
            <span className="font-orbitron text-system-blue absolute left-2 top-0 h-5 flex items-center" style={{ fontSize: '1.1rem' }}>
              Next Rank: {nextRank?.name || "MAX"}
            </span>
          </div>
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
          <SystemPanel className="p-5 min-h-[200px]">
            <h3 className="font-orbitron text-xl text-system-blue mb-4">
              <span className="font-bold">The System says...</span> Complete Today's Quests
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3">
                <input type="checkbox" className="accent-system-blue2 scale-125" />
                <span className="font-inter text-white">100 Push-ups (Combat Training)</span>
              </li>
              <li className="flex items-center gap-3">
                <input type="checkbox" className="accent-system-blue2 scale-125" />
                <span className="font-inter text-white">Study Strategy for 20 mins (Intelligence Gathering)</span>
              </li>
              <li className="flex items-center gap-3">
                <input type="checkbox" className="accent-system-blue2 scale-125" />
                <span className="font-inter text-white">Eat Balanced Meal (Vitality Enhancement)</span>
              </li>
            </ul>
            {/* Demo "Complete Quest" button removed */}
          </SystemPanel>
          {/* Quick Stats */}
          <SystemPanel className="p-5 min-h-[200px] flex flex-col gap-4">
            <h3 className="font-orbitron text-xl text-system-blue mb-2">
              <span className="font-bold">The System says...</span> Quick Stats
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-system-blue">Completed Quests</span>
                <span className="font-bold text-white">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-system-blue">Streak</span>
                <span className="font-bold text-white">0 days</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
              {stats.map(stat => (
                <div key={stat.label} className="flex flex-col items-center">
                  <span className="font-orbitron text-system-blue2 text-sm">{stat.label}</span>
                  <div className="relative w-12 h-24 flex items-end mb-2">
                    <div className="absolute bottom-0 left-2 w-2 h-full bg-[#191e26] rounded-full border border-system-blue2"></div>
                    <div className="absolute bottom-0 left-2 w-2 rounded-full bg-gradient-to-t from-system-blue2 to-system-blue" style={{ height: `${(stat.val / 30) * 100}%`, transition: "height 0.5s" }} />
                  </div>
                  <span className="font-orbitron text-white">{stat.val}</span>
                </div>
              ))}
            </div>
          </SystemPanel>
        </div>
        <div className="w-full flex justify-end mt-6">
          <button className="glow-button text-lg"
            onClick={() => setSystemNotice("A new quest awaits! Open the Quest List to accept your next challenge.")}>
            + Accept New Quest
          </button>
        </div>
      </div>
    </div>
  );
}

// NOTE: This file has grown rather large (235+ lines).
// CONSIDER asking me to refactor the Dashboard into smaller, focused components for maintainability and readability.

