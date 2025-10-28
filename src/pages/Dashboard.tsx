
import React from "react";
import DashboardHeader from "../components/DashboardHeader";
import DashboardPanels from "../components/DashboardPanels";
import SystemNotification from "../components/SystemNotification";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import SmartNotificationModal from "../components/SmartNotificationModal";
import NotificationHistory from "../components/NotificationHistory";
import { useHunterProgression } from "../hooks/useHunterProgression";
import { useSmartNotifications } from "../hooks/useSmartNotifications";
import RankUpCeremony from "../components/RankUpCeremony";
import { useShadowArmy } from "../hooks/useShadowArmy";
import SystemLog from "../components/SystemLog";
import EmergencyQuestModal from "../components/EmergencyQuestModal";
import { useNavigate } from "react-router-dom";
import { useEmergencyQuestModal } from "../hooks/useEmergencyQuestModal";
import { supabase } from "@/integrations/supabase/client";
import FloatingHunterRank from "../components/FloatingHunterRank";

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

  // --- SMART NOTIFICATIONS HOOK ---
  const {
    activeNotification,
    notifications,
    dismissNotification,
    addNotification,
    generateCelebration
  } = useSmartNotifications();

  console.log("HunterProgression loaded:", {
    stats, currentRank, nextRank, powerLevel, rankPoints, streak, daysActive,
    totalQuests, badges, showCeremony, lastBadge, currentRankIndex, dailyQuests, questCount
  });

  // Fetch username from Supabase profiles
  const [username, setUsername] = React.useState("Hunter");
  const [systemNotice, setSystemNotice] = React.useState<string | null>(null);
  const [userRank, setUserRank] = React.useState<number | null>(null);

  React.useEffect(() => {
    const fetchUsername = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', user.id)
          .single();
        
        if (profile?.username) {
          setUsername(profile.username);
        }
      }
    };

    fetchUsername();
  }, []);
  
  // Show personalized welcome message once username is loaded
  React.useEffect(() => {
    if (username && username !== "Hunter" && !window.sessionStorage.getItem("system_welcome_seen")) {
      window.sessionStorage.setItem("system_welcome_seen", "1");
      setSystemNotice(`Ready to grind, ${username}? Your Shadow System awaits.`);
    }
  }, [username]);

  const shadowArmy = useShadowArmy();

  // System log state - initialize with dynamic username
  const [systemLogs, setSystemLogs] = React.useState<{ message: string; timestamp: string; type?: "info"|"warning"|"achievement"; }[]>([]);

  // Initialize system logs once we have the username
  React.useEffect(() => {
    if (username && systemLogs.length === 0) {
      setSystemLogs([
        { message: `System online. Welcome back, Hunter ${username}. Today's quests are ready.`, timestamp: new Date().toLocaleTimeString(), type: "info" }
      ]);
    }
  }, [username, systemLogs.length]);
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

  // --- Rank up block modal state ---
  const [showBlock, setShowBlock] = React.useState(false);
  React.useEffect(() => {
    if (blockRankUp) setShowBlock(true);
  }, [blockRankUp]);

  // Smart notification action handlers
  const handleSmartNotificationAction = () => {
    if (activeNotification?.type === 'streak-warning') {
      // Navigate to quest completion or show quest modal
      setSystemNotice("Select a quest to maintain your streak!");
    } else if (activeNotification?.type === 'comeback') {
      // Trigger celebration and motivation
      const celebration = generateCelebration('comeback');
      addNotification(celebration);
      setSystemNotice("Welcome back, Hunter! The System has missed you.");
    }
  };

  // Scroll to leaderboard when rank badge is clicked
  const handleRankClick = () => {
    const leaderboardElement = document.querySelector('[data-leaderboard]');
    if (leaderboardElement) {
      leaderboardElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch user rank for floating badge
  React.useEffect(() => {
    const fetchUserRank = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

        try {
          const { data: challengesData } = await supabase
            .from('Challenges')
            .select('user_id, streak, progress_json');

          const { data: profilesData } = await supabase
            .from('profiles')
            .select('user_id, username');

          if (challengesData && profilesData) {
            const usernameMap = new Map<string, string>();
            profilesData.forEach(profile => {
              usernameMap.set(profile.user_id, profile.username);
            });

            const userScores = new Map<string, number>();
            
            challengesData.forEach((challenge) => {
              const userId = challenge.user_id;
              const streak = (challenge.streak as number) || 0;
              const progressData = challenge.progress_json as any;
              
              let progressScore = 0;
              if (progressData && typeof progressData === 'object') {
                progressScore = Object.values(progressData).reduce((sum: number, val: any) => {
                  return sum + (typeof val === 'number' ? val : 0);
                }, 0) as number;
              }
              
              const totalScore = streak * 10 + progressScore;
              userScores.set(userId, (userScores.get(userId) || 0) + totalScore);
            });

            const sortedUsers = Array.from(userScores.entries())
              .sort((a, b) => b[1] - a[1]);
            
            const userIndex = sortedUsers.findIndex(([userId]) => userId === user.id);
            if (userIndex !== -1) {
              setUserRank(userIndex + 1);
            }
          }
        } catch (error) {
        console.error('Error fetching user rank:', error);
      }
    };

    fetchUserRank();
  }, []);

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
      <div className="container mx-auto px-2 sm:px-4 md:px-6 pt-2 pb-16 sm:pb-20 flex flex-col gap-4 sm:gap-6 md:gap-8 items-center max-w-7xl">
        {/* HEADER SECTION */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-start gap-3">
          <div className="flex-1 w-full min-w-0">
            <DashboardHeader
              currentRank={currentRank}
              badges={badges}
              username={username}
              powerLevel={powerLevel}
              daysActive={daysActive}
            />
          </div>
          <Button 
            onClick={() => navigate("/support")}
            className="bg-gradient-to-r from-system-blue to-system-blue2 hover:from-system-blue2 hover:to-system-glow text-white font-orbitron font-bold px-4 sm:px-6 py-3 sm:py-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_#00d4ff] w-full sm:w-auto min-h-[44px]"
          >
            <Heart className="h-4 w-4 mr-2" />
            <span className="text-sm sm:text-base">Support App</span>
          </Button>
        </div>

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
                
                // Trigger celebration for quest completion
                if (Math.random() < 0.3) { // 30% chance
                  const celebration = generateCelebration('weekly');
                  addNotification(celebration);
                }
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
            onUserRankClick={handleRankClick}
          />
        </div>

        {/* Floating Hunter Rank Badge - Removed since leaderboard moved to separate page */}

        {/* NOTIFICATION HISTORY PANEL */}
        <div className="w-full max-w-md">
          <NotificationHistory
            notifications={notifications}
            onClear={() => {
              // Clear notification history logic would go here
              console.log("Clear notifications");
            }}
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

        {/* SMART NOTIFICATION MODAL */}
        <SmartNotificationModal
          notification={activeNotification}
          onDismiss={dismissNotification}
          onAction={handleSmartNotificationAction}
        />

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
