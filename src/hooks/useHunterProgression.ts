
// Add missing import at the top:
import React from "react";
import { useState, useEffect } from "react";
import { useShadowArmy } from "./useShadowArmy";

const QUEST_DIFFICULTY = ["easy", "medium", "hard"];
export const QUEST_CATEGORIES = [
  { key: "combat", label: "Combat Training" },
  { key: "intelligence", label: "Intelligence Gathering" },
  { key: "agility", label: "Agility Development" },
  { key: "vitality", label: "Vitality Enhancement" },
  { key: "special", label: "Special Quest" }
];
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
  {
    name: "A-Rank", color: "#e0c453", points: 4500, multiplier: 6, badgeIcon: "trophy",
    req: {
      totalQuests: 150,
      streak: 21,
      minHard: 30,
      minMedium: 10,
      shadowCount: 2
    }
  },
  {
    name: "S-Rank", color: "#ed3434", points: 10000, multiplier: 8, badgeIcon: "award",
    req: {
      totalQuests: 300,
      streak: 30,
      minHard: 75,
      minMedium: 50,
      shadowCount: 5,
      statTotal: 2000
    }
  },
  {
    name: "National Level", color: "#ba00ff", points: 25000, multiplier: 12, badgeIcon: "crown",
    req: {
      totalQuests: 500,
      streak: 60,
      minHard: 150,
      minMedium: 100,
      shadowCount: 8,
      monthsActive: 6
    }
  },
  {
    name: "Shadow Monarch", color: "#000", points: 50000, multiplier: 20, badgeIcon: "ghost",
    req: {
      totalQuests: 1000,
      streak: 100,
      maxBreaks: 3,
      minHard: 300,
      minMedium: 200,
      shadowCount: 12,
      monthsActive: 12
    }
  }
];

// Rank data tweaked for multipliers
// Stats base template
const START_STATS = [
  { label: "Strength", val: 0 },
  { label: "Agility", val: 0 },
  { label: "Intelligence", val: 0 },
  { label: "Vitality", val: 0 },
];

export const SHADOW_SOLDIERS = [
  {
    name: "Iron Soldier",
    tier: 1,
    reqs: ["Complete 20 Combat Training quests (any difficulty)"]
  },
  {
    name: "Scout",
    tier: 1,
    reqs: ["Achieve first 7-day streak"]
  },
  {
    name: "Mage",
    tier: 1,
    reqs: ["Complete 25 Intelligence quests", "Reach 100 Intelligence stat"]
  },
  // Tier 2
  {
    name: "Knight",
    tier: 2,
    reqs: [
      "Reach C-Rank",
      "150 Strength stat",
      "15 hard Combat quests"
    ]
  },
  {
    name: "Assassin",
    tier: 2,
    reqs: [
      "Reach B-Rank",
      "200 Agility stat",
      "30-day streak"
    ]
  },
  {
    name: "Healer",
    tier: 2,
    reqs: [
      "Complete 50 Vitality quests",
      "Maintain 21-day streak"
    ]
  },
  // Tier 3
  {
    name: "Tank",
    tier: 3,
    reqs: [
      "Reach A-Rank",
      "300 Strength",
      "500 total Vitality"
    ]
  },
  {
    name: "Archer",
    tier: 3,
    reqs: [
      "250 Agility",
      "200 Intelligence",
      "Complete 100 total quests"
    ]
  },
  {
    name: "Berserker",
    tier: 3,
    reqs: [
      "Complete 75 hard quests",
      "Achieve 45-day streak"
    ]
  },
  // Tier 4
  {
    name: "Igris",
    tier: 4,
    reqs: [
      "S-Rank",
      "400 Strength",
      "150 hard Combat quests"
    ]
  },
  {
    name: "Beru",
    tier: 4,
    reqs: [
      "National Level",
      "350 Intelligence",
      "200 total quests completed"
    ]
  },
  {
    name: "Bellion",
    tier: 4,
    reqs: [
      "Shadow Monarch",
      "All other shadows unlocked",
      "80-day streak"
    ]
  }
];

function getToday() {
  return new Date().toDateString();
}

function getMultiplierForRank(rankIdx: number) {
  return RANKS[rankIdx]?.multiplier || 1.0;
}

function statI(stats, key) {
  return stats.findIndex(s => s.label.toLowerCase() === key.toLowerCase());
}

// Utility helpers for persistence
const STORAGE_KEY = "hunter_progression_v1";
function saveProgression(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}
function loadProgression() {
  try {
    const str = localStorage.getItem(STORAGE_KEY);
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
}

export function useHunterProgression() {
  // Try to load previous progression from localStorage
  const stored = loadProgression();

  // --- SYSTEMS ---
  const [stats, setStats] = useState(stored?.stats || [...START_STATS]);
  const [currentRankIndex, setCurrentRankIndex] = useState(stored?.currentRankIndex || 0);
  const [rankPoints, setRankPoints] = useState(stored?.rankPoints || 0);
  const { unlocked, SHADOWS } = useShadowArmy();
  const [questCount, setQuestCount] = useState(stored?.questCount || {
    easy: 0, medium: 0, hard: 0, total: 0, medOrHard: 0, hardTotal: 0
  });
  const [totalQuests, setTotalQuests] = useState(stored?.totalQuests || 0);
  const [today, setToday] = useState(getToday());
  const [dailyQuests, setDailyQuests] = useState(stored?.dailyQuests || { easy: 0, medium: 0, hard: 0 });
  const [daysActive, setDaysActive] = useState(stored?.daysActive || 0);

  // Streak (stored separately in localStorage)
  const [streak, setStreak] = useState(() => {
    const s = stored?.streak;
    if (typeof s === "number") return s;
    const raw = localStorage.getItem("hunter_streaks");
    if (raw) {
      try { return JSON.parse(raw).streak; } catch { return 0; }
    }
    return 0;
  });
  const [streakStart, setStreakStart] = useState(stored?.streakStart || null);
  const [lastQuestDay, setLastQuestDay] = useState(() => {
    if (stored?.lastQuestDay) return stored.lastQuestDay;
    const raw = localStorage.getItem("hunter_streaks");
    if (raw) {
      try { return JSON.parse(raw).lastDay; } catch { return null; }
    }
    return null;
  });

  // Badges, ceremonies
  const [badges, setBadges] = useState(stored?.badges || []);
  const [showCeremony, setShowCeremony] = useState(stored?.showCeremony || false);
  const [lastBadge, setLastBadge] = useState(stored?.lastBadge || null);
  const [blockRankUp, setBlockRankUp] = useState<{ reason: string } | null>(null);

  // --- STAT ALLOCATION MAP ---
  // [category][difficulty] = {stat1:+n, stat2:+m, ...}
  const statGainTable = {
    combat: {
      easy: { Strength: 2, Vitality: 1 },
      medium: { Strength: 4, Vitality: 2, Agility: 1 },
      hard: { Strength: 6, Vitality: 3, Agility: 2 }
    },
    intelligence: {
      easy: { Intelligence: 2, Vitality: 1 },
      medium: { Intelligence: 4, Vitality: 2, Agility: 1 },
      hard: { Intelligence: 6, Vitality: 3, Agility: 2 }
    },
    agility: {
      easy: { Agility: 2, Vitality: 1 },
      medium: { Agility: 4, Vitality: 2, Strength: 1 },
      hard: { Agility: 6, Vitality: 3, Strength: 2 }
    },
    vitality: {
      easy: { Vitality: 3 },     // +1 to random stat handled later
      medium: { Vitality: 5 },   // +2 each to two random stats
      hard: { Vitality: 8 }      // +3 all other stats
    },
    special: {
      hard: { Strength: 5, Agility: 5, Intelligence: 5, Vitality: 5 }
    }
  };

  // Used for milestone/titles
  const statMilestones = {
    Strength: [100, 250, 500, 1000],
    Agility: [100, 250, 500, 1000],
    Intelligence: [100, 250, 500, 1000],
    Vitality: [100, 250, 500, 1000]
  };

  // Helper to get stat level for a label
  function getStatValue(label) {
    return stats.find((s) => s.label === label)?.val || 0;
  }

  // --- Power Level Calculation ---
  function calcPowerLevel() {
    // Base sum
    let basePower = stats.reduce((acc, s) => acc + s.val, 0);
    // Shadow bonuses
    let shadowBonus = 0;
    unlocked.forEach(name => {
      const shadow = SHADOWS.find(s => s.name === name);
      if (!shadow) return;
      if (shadow.tier >= 4) shadowBonus += 500;
      else if (shadow.tier >= 3) shadowBonus += 200;
      else shadowBonus += 100;
    });
    let rankMultiplier = getMultiplierForRank(currentRankIndex);
    return Math.round((basePower + shadowBonus) * rankMultiplier);
  }

  // --- Daily save all progression state with every relevant change (using useEffect) ---
  // Save all progression data anytime it changes
  React.useEffect(() => {
    saveProgression({
      stats,
      currentRankIndex,
      rankPoints,
      badges,
      showCeremony,
      lastBadge,
      totalQuests,
      daysActive,
      streak,
      streakStart,
      lastQuestDay,
      questCount,
      dailyQuests
    });
  }, [
    stats, currentRankIndex, rankPoints, badges, showCeremony, lastBadge,
    totalQuests, daysActive, streak, streakStart, lastQuestDay, questCount, dailyQuests
  ]);

  // --- Quest Completion w/ Stat Distribution ---
  /**
   * @param quest { category: "combat"/"intelligence"/"agility"/"vitality"/"special", difficulty: "easy"/"medium"/"hard" }
   */
  function completeQuest(category, difficulty) {
    const t = getToday();
    if (dailyQuests[difficulty] >= (difficulty === "easy" ? 5 : (difficulty === "medium" ? 3 : 2))) return false;
    // Update streaks if a new quest is done today and last activity wasn't today
    if (lastQuestDay !== t) {
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
    }

    // Points per quest type/difficulty (values can be shared from before)
    let points = 0;
    let baseStatGains = {};

    if (category === "special") {
      if (difficulty !== "hard") return false;
      points = 75; // matches hard quest for now
      baseStatGains = statGainTable.special.hard;
    } else {
      if (!statGainTable[category] || !statGainTable[category][difficulty]) return false;
      points =
        difficulty === "easy" ? 15 :
        difficulty === "medium" ? 35 :
        difficulty === "hard" ? 75 : 0;
      baseStatGains = statGainTable[category][difficulty];
    }

    // --- Stat Alloc logic with randoms/balances for vitality
    let statUpdates = [0, 0, 0, 0]; // [str, agi, int, vit]
    Object.entries(baseStatGains).forEach(([k, v]) => {
      const idx = statI(stats, k);
      if (idx !== -1) statUpdates[idx] += v as number; // **** FIX #2: 'as number'
    });

    // VITALITY bonus logic
    if (category === "vitality") {
      if (difficulty === "easy") {
        // +1 to random stat (except vit)
        const others = [0,1,2];
        const rand = others[Math.floor(Math.random()*3)];
        statUpdates[rand] += 1;
      } else if (difficulty === "medium") {
        // +2 to two random stats (not vit), possibly the same
        for(let i=0; i<2; ++i) {
          const idx = [0,1,2][Math.floor(Math.random()*3)];
          statUpdates[idx] += 2;
        }
      } else if (difficulty === "hard") {
        // +3 all other stats
        [0,1,2].forEach(idx => statUpdates[idx] += 3);
      }
    }

    // --- BALANCED GROWTH BONUS (all stat>100: +10%, etc.) ---
    // Detect for quest reward bonuses
    const statVals = stats.map(s=>s.val);
    let allAbove = val => statVals.every(n => n >= val);
    let multip = 1;
    if (allAbove(500)) multip = 1.5;
    else if (allAbove(250)) multip = 1.25;
    else if (allAbove(100)) multip = 1.1;
    // Apply bonus to stat gains & points
    statUpdates = statUpdates.map(x => Math.round(x * multip));
    points = Math.round(points * multip);

    // Apply streak multiplier as before
    let streakBonus = 0;
    if (streak >= 14) streakBonus = 0.4;
    else if (streak >= 7) streakBonus = 0.25;
    else if (streak >= 3) streakBonus = 0.10;
    // ... combo/other bonuses could go here
    points = Math.round(points * (1 + streakBonus));

    // Assign stats (with persistence)
    setStats(s =>
      s.map((stat, i) => ({
        ...stat,
        val: stat.val + statUpdates[i]
      }))
    );
    setRankPoints(v => v + points);

    // Update counters
    setQuestCount((prev) => ({
      easy: prev.easy + (difficulty === "easy" ? 1 : 0),
      medium: prev.medium + (difficulty === "medium" ? 1 : 0),
      hard: prev.hard + (difficulty === "hard" ? 1 : 0),
      total: prev.total + 1,
      medOrHard: prev.medOrHard + (difficulty !== "easy" ? 1 : 0),
      hardTotal: prev.hardTotal + (difficulty === "hard" ? 1 : 0),
    }));
    setTotalQuests(q => q + 1);

    // Daily counters
    setDailyQuests(d => ({
      ...d,
      [difficulty]: d[difficulty] + 1,
    }));

    // Mark streak/localStorage, days, lastQuestDay, etc exactly as before
    const t2 = getToday();
    // Update streaks if a new quest is done today and last activity wasn't today
    if (lastQuestDay !== t2) {
      // Started first quest of day
      if (!lastQuestDay || new Date(t2) > new Date(lastQuestDay)) {
        const newStreak = lastQuestDay &&
          (new Date(t2).getTime() - new Date(lastQuestDay).getTime() === 86400000)
          ? streak + 1 : 1;
        setStreak(newStreak);
        setLastQuestDay(t2);
        localStorage.setItem("hunter_streaks", JSON.stringify({ streak: newStreak, lastDay: t2 }));
        // Update active days total (not unique days, just add 1 more day)
        setDaysActive(d => d + 1);
        setStreakStart((start) => start ?? Date.now());
      }
    }

    // Save changes after a quest
    setTimeout(() => {
      saveProgression({
        stats: stats.map((stat, i) => ({ ...stat, val: stat.val + statUpdates[i] })), // optimistic
        currentRankIndex,
        rankPoints: rankPoints + points,
        badges,
        showCeremony,
        lastBadge,
        totalQuests: totalQuests + 1,
        daysActive: daysActive + 1, // best effort, fine if occasionally overcounted
        streak: streak + 1,
        streakStart: streakStart || Date.now(),
        lastQuestDay: t,
        questCount: {
          ...questCount,
          easy: questCount.easy + (difficulty === "easy" ? 1 : 0),
          medium: questCount.medium + (difficulty === "medium" ? 1 : 0),
          hard: questCount.hard + (difficulty === "hard" ? 1 : 0),
          total: questCount.total + 1,
          medOrHard: questCount.medOrHard + (difficulty !== "easy" ? 1 : 0),
          hardTotal: questCount.hardTotal + (difficulty === "hard" ? 1 : 0),
        },
        dailyQuests: {
          ...dailyQuests,
          [difficulty]: dailyQuests[difficulty] + 1,
        },
      });
    }, 100);

    return true;
  }

  /**
   * New method: Add points to rankPoints (external rewards)
   */
  function addRankPoints(amount: number) {
    setRankPoints(v => {
      const newVal = v + amount;
      setTimeout(() => {
        saveProgression({
          stats,
          currentRankIndex,
          rankPoints: newVal,
          badges,
          showCeremony,
          lastBadge,
          totalQuests,
          daysActive,
          streak,
          streakStart,
          lastQuestDay,
          questCount,
          dailyQuests,
        });
      }, 100);
      return newVal;
    });
  }

  /**
   * New method: Add stats (external rewards).
   * Pass: { Strength?: number, Agility?: number, Intelligence?: number, Vitality?: number }
   */
  function addStats(obj: { [k: string]: number }) {
    setStats(s => {
      const newStats = s.map(stat => ({
        ...stat,
        val: stat.val + (obj[stat.label] || 0)
      }));
      setTimeout(() => {
        saveProgression({
          stats: newStats,
          currentRankIndex,
          rankPoints,
          badges,
          showCeremony,
          lastBadge,
          totalQuests,
          daysActive,
          streak,
          streakStart,
          lastQuestDay,
          questCount,
          dailyQuests,
        });
      }, 100);
      return newStats;
    });
  }

  // --- Rank-up logic: Supports new requirements ---
  useEffect(() => {
    if (!RANKS[currentRankIndex + 1]) return;
    let promote = false;
    // Don't consider rank up if we don't have minimum points.
    if (rankPoints < RANKS[currentRankIndex + 1].points) return;

    // Check requirements
    let req = RANKS[currentRankIndex + 1].req;
    let unmet: string[] = [];

    if (req?.totalQuests && totalQuests < req.totalQuests) {
      unmet.push(`Complete ${req.totalQuests - totalQuests} more quests`);
    }
    if (req?.days && daysActive < req.days) {
      unmet.push(`Be active for ${req.days - daysActive} more day(s)`);
    }
    if (req?.monthsActive && daysActive < (req.monthsActive * 30)) { // approx
      unmet.push(`Be active for ${req.monthsActive} month(s) total`);
    }
    if (req?.streak && streak < req.streak) {
      unmet.push(`Build a streak of ${req.streak} days (current: ${streak})`);
    }
    if (req?.maxBreaks !== undefined /* for Monarch only */) {
      // You'd need to track total breaks in the streak here!
      // (Not implemented yet)
      // unmet.push(`You cannot have more than ${req.maxBreaks} major breaks in streak`);
    }
    if (req?.minMedOrHard && questCount.medOrHard < req.minMedOrHard) {
      unmet.push(`Complete at least ${req.minMedOrHard} medium or hard quests (current: ${questCount.medOrHard})`);
    }
    if (req?.minHard && questCount.hardTotal < req.minHard) {
      unmet.push(`Complete at least ${req.minHard} hard quests (current: ${questCount.hardTotal})`);
    }
    if (req?.minMedium && questCount.medium < req.minMedium) {
      unmet.push(`Complete at least ${req.minMedium} medium quests (current: ${questCount.medium})`);
    }
    if (req?.shadowCount && (badges.filter(b => b === "shadow").length < req.shadowCount)) {
      unmet.push(`Unlock at least ${req.shadowCount} Shadow Soldiers`);
    }
    if (req?.statTotal && stats.reduce((s, v) => s + v.val, 0) < req.statTotal) {
      unmet.push(`Reach a total of ${req.statTotal} stat points`);
    }

    if (unmet.length === 0) {
      promote = true;
    } else {
      setBlockRankUp({ reason: unmet.join(", ") });
      return;
    }
    if (promote) {
      setCurrentRankIndex(r => r + 1);
      setBadges(b => [...b, RANKS[currentRankIndex + 1].badgeIcon]);
      setLastBadge(RANKS[currentRankIndex + 1].badgeIcon);
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
  }, [rankPoints, totalQuests, streak, questCount, daysActive, badges, stats]);

  // Ceremony completion
  function finishCeremony() {
    setShowCeremony(false);
  }

  // Show requirements for next rank
  function getNextRankRequirements() {
    return [];
  }

  // --- Return values, powerLevel now reflects new formula ---
  return {
    stats,
    currentRank: RANKS[currentRankIndex],
    nextRank: RANKS[currentRankIndex + 1] || null,
    powerLevel: calcPowerLevel(),
    rankPoints,
    streak,
    daysActive,
    totalQuests,
    badges,
    showCeremony,
    completeQuest,
    finishCeremony: () => {
      setShowCeremony(false);
      setTimeout(() => saveProgression({
        stats,
        currentRankIndex,
        rankPoints,
        badges,
        showCeremony: false,
        lastBadge,
        totalQuests,
        daysActive,
        streak,
        streakStart,
        lastQuestDay,
        questCount,
        dailyQuests,
      }), 100);
    },
    lastBadge,
    currentRankIndex,
    dailyQuests,
    canCompleteQuest: (difficulty) => dailyQuests[difficulty] < (difficulty === "easy" ? 5 : (difficulty === "medium" ? 3 : 2)),
    blockRankUp,
    getNextRankRequirements,
    questCount,
    QUEST_TYPES: [],
    QUEST_CATEGORIES, // export for panels

    // Newly exposed reward updaters:
    addRankPoints,
    addStats,
  };
}
// --- Future System Stubs for Advanced Bonuses/Emergency/Combo ---
// These are NOT implemented yet, only stubbed as reference for future logic:
// - PERFECT PERFORMANCE BONUSES
// - EMERGENCY QUEST SYSTEM
// - COMBO MULTIPLIERS
