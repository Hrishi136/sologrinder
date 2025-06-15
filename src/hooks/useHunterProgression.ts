import { useState, useEffect } from "react";

// Quest definitions and limits per day/difficulty
const QUEST_TYPES = [
  { type: "easy", label: "Easy", color: "#48e18b", points: 15, statPoints: 1, dailyLimit: 5 },
  { type: "medium", label: "Medium", color: "#f4e95a", points: 35, statPoints: 3, dailyLimit: 3 },
  { type: "hard", label: "Hard", color: "#ed3434", points: 75, statPoints: 6, dailyLimit: 2 }
];

// Rank requirements structure
const RANKS = [
  { name: "E-Rank", color: "#87b7ff", points: 0, multiplier: 1, badgeIcon: "badge" },
  {
    name: "D-Rank", color: "#4aa3ea", points: 300, multiplier: 2, badgeIcon: "badge-check",
    req: { totalQuests: 15, days: 7 }
  },
  {
    name: "C-Rank", color: "#329fa8", points: 800, multiplier: 3, badgeIcon: "star-half",
    req: { totalQuests: 40, streak: 5, minMedOrHard: 5 }
  },
  {
    name: "B-Rank", color: "#9cdc96", points: 1800, multiplier: 4, badgeIcon: "star",
    req: { totalQuests: 80, streak: 10, minHard: 15 }
  },
  { name: "A-Rank", color: "#e0c453", points: 2400, multiplier: 6, badgeIcon: "trophy" },
  { name: "S-Rank", color: "#ed3434", points: 3200, multiplier: 8, badgeIcon: "award" }
];

// All stats start at 0
const START_STATS = [
  { label: "Strength", val: 0 },
  { label: "Agility", val: 0 },
  { label: "Intelligence", val: 0 },
  { label: "Vitality", val: 0 },
];

function getToday() {
  return new Date().toDateString();
}

function getInitialStreaks() {
  const stored = localStorage.getItem("hunter_streaks");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { streak: 0, lastDay: null };
    }
  }
  return { streak: 0, lastDay: null };
}

export function useHunterProgression() {
  // Stats, rank, points
  const [stats, setStats] = useState([...START_STATS]);
  const [currentRankIndex, setCurrentRankIndex] = useState(0);
  const [rankPoints, setRankPoints] = useState(0);

  // Quest counters: today/total/difficulty
  const [questCount, setQuestCount] = useState({
    easy: 0, medium: 0, hard: 0,
    total: 0, medOrHard: 0, hardTotal: 0
  });
  const [totalQuests, setTotalQuests] = useState(0);

  // Day logic
  const [today, setToday] = useState(getToday());
  const [dailyQuests, setDailyQuests] = useState({ easy: 0, medium: 0, hard: 0 }); // completed today per difficulty
  const [daysActive, setDaysActive] = useState(0);

  // Streak logic
  const [streak, setStreak] = useState(getInitialStreaks().streak);
  const [streakStart, setStreakStart] = useState<number | null>(null);
  const [lastQuestDay, setLastQuestDay] = useState<string | null>(getInitialStreaks().lastDay);

  // Badges, ceremonies
  const [badges, setBadges] = useState<string[]>([]);
  const [showCeremony, setShowCeremony] = useState(false);
  const [lastBadge, setLastBadge] = useState<string | null>(null);

  // Rank requirements modal
  const [blockRankUp, setBlockRankUp] = useState<{ reason: string } | null>(null);

  // Derived
  const currentRank = RANKS[currentRankIndex];
  const nextRank = RANKS[currentRankIndex + 1] || null;
  const powerLevel = stats.reduce((acc, stat) => acc + stat.val, 0) * currentRank.multiplier;

  // Reset daily stats if a new day starts (simple: by device day)
  useEffect(() => {
    const now = getToday();
    if (now !== today) {
      setToday(now);
      setDailyQuests({ easy: 0, medium: 0, hard: 0 });
    }
  }, [today]);

  // Update streaks if a new quest is done today and last activity wasn't today
  const handleStreakProgress = () => {
    const t = getToday();
    if (lastQuestDay === t) return;
    // Started first quest of day
    if (!lastQuestDay || new Date(t) > new Date(lastQuestDay)) {
      const newStreak = lastQuestDay &&
        (new Date(t).getTime() - new Date(lastQuestDay).getTime() === 86400000)
        ? streak + 1 : 1;
      setStreak(newStreak);
      setLastQuestDay(t);
      localStorage.setItem("hunter_streaks", JSON.stringify({ streak: newStreak, lastDay: t }));
      // Update active days total (not unique days, just add 1 more day)
      setDaysActive(d => d + 1);
      setStreakStart((start) => start ?? Date.now());
    }
  };

  // Streak/bonus calculations
  function getStreakBonus() {
    if (streak >= 14) return 0.4;
    if (streak >= 7) return 0.25;
    if (streak >= 3) return 0.10;
    return 0;
  }

  function canCompleteQuest(type: "easy" | "medium" | "hard") {
    return dailyQuests[type] < QUEST_TYPES.find(q => q.type === type)!.dailyLimit;
  }

  // Unified quest completion function
  function completeQuest(type: "easy" | "medium" | "hard") {
    if (!canCompleteQuest(type)) return false;

    // Apply quest rewards
    const qType = QUEST_TYPES.find(q => q.type === type)!;
    let streakBonus = getStreakBonus();
    let pointsAwarded = Math.floor(qType.points * (1 + streakBonus));
    // Randomly choose a stat to buff (or distribute? keep simple: rotate by quest count)
    let statIndex = questCount.total % stats.length;
    setStats(s =>
      s.map((stat, i) =>
        i === statIndex
          ? { ...stat, val: stat.val + qType.statPoints }
          : stat
      )
    );
    setRankPoints(v => v + pointsAwarded);

    // Update counters
    setQuestCount((prev) => ({
      easy: prev.easy + (type === "easy" ? 1 : 0),
      medium: prev.medium + (type === "medium" ? 1 : 0),
      hard: prev.hard + (type === "hard" ? 1 : 0),
      total: prev.total + 1,
      medOrHard: prev.medOrHard + (type !== "easy" ? 1 : 0),
      hardTotal: prev.hardTotal + (type === "hard" ? 1 : 0),
    }));
    setTotalQuests(q => q + 1);

    // Daily counters
    setDailyQuests(d => ({
      ...d,
      [type]: d[type] + 1,
    }));

    // Streak logic
    handleStreakProgress();

    return true;
  }

  // --- Rank-up logic: Supports new requirements ---
  useEffect(() => {
    if (!nextRank) return;
    let promote = false;
    // Don't consider rank up if we don't have minimum points.
    if (rankPoints < nextRank.points) return;

    // Check requirements
    let req = nextRank.req || {};
    let unmet = [];
    if (req.totalQuests && totalQuests < req.totalQuests) {
      unmet.push(`Complete ${req.totalQuests - totalQuests} more quests`);
    }
    if (req.days && daysActive < req.days) {
      unmet.push(`Be active for ${req.days - daysActive} more day(s)`);
    }
    if (req.streak && streak < req.streak) {
      unmet.push(`Build a streak of ${req.streak} days (current: ${streak})`);
    }
    if (req.minMedOrHard && questCount.medOrHard < req.minMedOrHard) {
      unmet.push(`Complete at least ${req.minMedOrHard} medium or hard quests (current: ${questCount.medOrHard})`);
    }
    if (req.minHard && questCount.hardTotal < req.minHard) {
      unmet.push(`Complete at least ${req.minHard} hard quests (current: ${questCount.hardTotal})`);
    }

    if (unmet.length === 0) {
      promote = true;
    } else {
      setBlockRankUp({ reason: unmet.join(", ") });
      return;
    }
    if (promote) {
      setCurrentRankIndex(r => r + 1);
      setBadges(b => [...b, nextRank.badgeIcon]);
      setLastBadge(nextRank.badgeIcon);
      setShowCeremony(true);
      setBlockRankUp(null);
      // When ranking up, streak continues, stat boost
      setStats(s =>
        s.map(stat => ({
          ...stat,
          val: stat.val + Math.max(1, Math.floor(stat.val * 0.10)),
        }))
      );
    }
    // eslint-disable-next-line
  }, [rankPoints, totalQuests, streak, questCount, daysActive]);

  // Ceremony completion
  function finishCeremony() {
    setShowCeremony(false);
  }

  // Show requirements for next rank
  function getNextRankRequirements() {
    if (!nextRank?.req) return [];
    let req = nextRank.req;
    const result: string[] = [];
    if (req.totalQuests) result.push(`Complete ${req.totalQuests} total quests`);
    if (req.days) result.push(`Be active at least ${req.days} days`);
    if (req.streak) result.push(`Build a ${req.streak}-day quest streak`);
    if (req.minMedOrHard) result.push(`At least ${req.minMedOrHard} medium/hard quests`);
    if (req.minHard) result.push(`At least ${req.minHard} hard quests`);
    return result;
  }

  return {
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
  };
}
