import React from "react";
import DashboardHeader from "../components/DashboardHeader";
import DashboardPanels from "../components/DashboardPanels";
import DashboardFabButtons from "../components/DashboardFabButtons";
import SystemNotification from "../components/SystemNotification";
import { useHunterProgression } from "../hooks/useHunterProgression";
import RankUpCeremony from "../components/RankUpCeremony";
import { useShadowArmy } from "../hooks/useShadowArmy";
import SystemLog from "../components/SystemLog";
import EmergencyQuestModal from "../components/EmergencyQuestModal";
import { useNavigate } from "react-router-dom";
import { useEmergencyQuestModal } from "../hooks/useEmergencyQuestModal";

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

  const shadowArmy = useShadowArmy();

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
  const navigate = useNavigate();
  function handleViewFullArmy() {
    navigate("/army");
  }

  const recentAchievements = [
    ...(badges.slice(-2).map(b => ({ name: b, timestamp: "Today", type: "title" as const }))),
    ...(shadowArmy.unlocked.slice(-1).map(s => ({ name: s, timestamp: "Today", type: "shadow" as const }))),
  ];
  const nextMilestone = "Complete 5 more quests for next Rank";

  // --- Emergency Quest State using custom hook ---
  const {
    quest: emergencyQuest,
    open: showEmergency,
    alreadyAccepted: hasAcceptedEmergency,
    showModal: openEmergencyQuest,
    acceptModal: handleAcceptEmergency,
    completeModal: handleCompleteEmergency,
    closeModal: handleCloseEmergency
  } = useEmergencyQuestModal();

  // Spawn Emergency Quest only if not already present
  React.useEffect(() => {
    // Spawn a new Emergency Quest on first mount if there's not already one open
    if (!emergencyQuest && !showEmergency) {
      openEmergencyQuest({
        type: "combat",
        title: "Urgent Combat Training",
        description: "Complete 100 push-ups within 24 hours.",
        rewardText: "150 Rank Points + 12 Strength + Shadow progress",
        rewardPoints: 150,
        timerEnd: Date.now() + 1000 * 60 * 60 * 24, // 24hr from now
      });
    }
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (showEmergency && emergencyQuest) {
      setSystemNotice("🚨 Emergency Quest Available! Complete for rare rewards.");
    }
  }, [showEmergency, emergencyQuest]);

  // Rank up block modal state
  const [showBlock, setShowBlock] = React.useState(false);
  React.useEffect(() => {
    if (blockRankUp) setShowBlock(true);
  }, [blockRankUp]);

  return (
    <div className="min-h-screen w-full bg-system-bg relative font-orbitron">
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
        <DashboardHeader
          currentRank={currentRank}
          badges={badges}
          username={username}
          powerLevel={powerLevel}
          daysActive={daysActive}
        />

        {/* MAIN DASHBOARD CARDS */}
        <DashboardPanels
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
          stats={stats}
          nextRank={nextRank}
          powerLevel={powerLevel}
          rankPoints={rankPoints}
          daysActive={daysActive}
          shadowArmy={shadowArmy}
          badges={badges}
          recentAchievements={recentAchievements}
          nextMilestone={nextMilestone}
          handleViewFullArmy={handleViewFullArmy}
        />

        <DashboardFabButtons
          emergencyQuestExists={!!emergencyQuest}
          showEmergency={showEmergency}
          onShowEmergency={() => openEmergencyQuest(emergencyQuest!)}
          onNewQuest={() => setSystemNotice("A new quest awaits! Open the Quest List to accept your next challenge.")}
        />

        {/* Emergency Quest Modal - only ever renders ONE at a time because of hook */}
        {/* Use a unique key for the modal based on the quest's title+timerEnd -
            this ensures a clean remount + no stacking */}
        {emergencyQuest && (
          <EmergencyQuestModal
            key={emergencyQuest.title + emergencyQuest.timerEnd}
            open={showEmergency}
            quest={showEmergency ? emergencyQuest : null}
            onClose={handleCloseEmergency}
            onAccept={handleAcceptEmergency}
            onComplete={handleCompleteEmergency}
            alreadyAccepted={hasAcceptedEmergency}
          />
        )}

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
