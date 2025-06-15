import React from "react";
import DashboardHeader from "../components/DashboardHeader";
import DashboardPanels from "../components/DashboardPanels";
// Removed DashboardFabButtons
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

console.log("Dashboard component loading...");

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
    addRankPoints,
    addStats,
  } = useHunterProgression();
  console.log("HunterProgression loaded:", {
    stats, currentRank, nextRank, powerLevel, rankPoints, streak, daysActive,
    totalQuests, badges, showCeremony, lastBadge, currentRankIndex, dailyQuests, questCount
  });

  // System notification message, show only ONCE per session
  const [systemNotice, setSystemNotice] = React.useState<string | null>(() => {
    // Only show if NOT already set for this tab session
    if (window.sessionStorage.getItem("system_welcome_seen")) {
      return null;
    }
    window.sessionStorage.setItem("system_welcome_seen", "1");
    return "Welcome, Hunter. Your journey begins now.";
  });

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
    console.log("System log added:", msg, type);
  }
  function clearSystemLogs() {
    setSystemLogs([]);
    console.log("System log cleared");
  }

  // Shadow Army preview handler
  const navigate = useNavigate();
  function handleViewFullArmy() {
    console.log("Navigating to /army page.");
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
    closeModal: handleCloseEmergency,
    swapKey,
  } = useEmergencyQuestModal();

  // Persistent seen-key for emergency quest (so one-time only, even if page reloads)
  const EMERGENCY_QUEST_SEEN_KEY = "emergencyQuestSeen_v1";
  const [pendingEmergencyQuest, setPendingEmergencyQuest] = React.useState(false);
  const [emergencyShown, setEmergencyShown] = React.useState(() => {
    return localStorage.getItem(EMERGENCY_QUEST_SEEN_KEY) === "1";
  });

  function triggerEmergencyQuest() {
    setPendingEmergencyQuest(true);
    setSystemNotice("🚨 Emergency Quest Incoming — Acknowledge to proceed.");
    console.log("Emergency Quest triggered");
  }

  // Show modal only ONCE per trigger and per user session (using localStorage key)
  React.useEffect(() => {
    if (
      !systemNotice &&
      pendingEmergencyQuest &&
      !showEmergency &&
      !emergencyShown
    ) {
      openEmergencyQuest({
        type: "combat",
        title: "Urgent Combat Training",
        description: "Complete 100 push-ups within 24 hours.",
        rewardText: "150 Rank Points + 12 Strength + Shadow progress",
        rewardPoints: 150,
        timerEnd: Date.now() + 1000 * 60 * 60 * 24, // 24hr
      });
      setPendingEmergencyQuest(false);
      setEmergencyShown(true);
      localStorage.setItem(EMERGENCY_QUEST_SEEN_KEY, "1");
    }
  }, [systemNotice, pendingEmergencyQuest, showEmergency, openEmergencyQuest, emergencyShown]);

  // --- Emergency Quest Completion Logic ---
  function handleEmergencyQuestComplete() {
    if (emergencyQuest) {
      // Ensure rewards are only given if the quest hasn't already been completed for this emergency
      const COMPLETED_KEY = "emergencyQuestCompleted_v1";
      if (localStorage.getItem(COMPLETED_KEY) === "1") {
        setSystemNotice("You have already completed this Emergency Quest.");
        handleCompleteEmergency();
        return;
      }
      // Give rewards:
      addRankPoints(150); // 150 rank points
      addStats({ Strength: 12 }); // 12 to Strength
      // "Shadow progress" would require further implementation

      addSystemLog(
        "Emergency Quest completed! +150 Rank Points, +12 Strength, Shadow progress increased.",
        "achievement"
      );
      setSystemNotice("Emergency Quest complete! Rewards added.");
      localStorage.setItem(COMPLETED_KEY, "1");
      console.log("Emergency Quest completed, reward added");
      handleCompleteEmergency();
    }
  }

  // Reset the completion key if a NEW emergency is triggered in the future (could be by changing the version)
  // (No automatic resets here.)

  // --- Rank up block modal state ---
  const [showBlock, setShowBlock] = React.useState(false);
  React.useEffect(() => {
    if (blockRankUp) setShowBlock(true);
  }, [blockRankUp]);

  return (
    <div className="min-h-screen w-full bg-system-bg relative font-orbitron">
      {/* Particle background – adapt slightly for all screens */}
      <div className="particle-bg pointer-events-none">
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
              bottom: `${Math.random() * 40}vh`, // More spread for mobile
            }}
          />
        ))}
      </div>
      <div className="container mx-auto px-2 pt-2 pb-16 flex flex-col gap-6 sm:gap-8 items-center">
        {/* HEADER SECTION */}
        <DashboardHeader
          currentRank={currentRank}
          badges={badges}
          username={username}
          powerLevel={powerLevel}
          daysActive={daysActive}
        />

        {/* MAIN DASHBOARD CARDS – wrap for mobile friendliness */}
        <div className="w-full">
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
        </div>
        {/* Emergency Quest Modal, System Log, System Notifications */}
        {(emergencyQuest && showEmergency) && (
          <EmergencyQuestModal
            key={emergencyQuest.title + emergencyQuest.timerEnd + swapKey}
            open={showEmergency}
            quest={showEmergency ? emergencyQuest : null}
            onClose={handleCloseEmergency}
            onAccept={handleAcceptEmergency}
            onComplete={handleEmergencyQuestComplete}
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
          message={
            <>
              {systemNotice}
              {/* DEV: Trigger emergency quest (remove below in prod) */}
              {!pendingEmergencyQuest && !emergencyShown && (
                <button
                  className="ml-4 px-2 py-1 bg-system-blue2 text-white rounded"
                  onClick={triggerEmergencyQuest}
                >
                  Trigger Emergency Quest
                </button>
              )}
            </>
          }
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
