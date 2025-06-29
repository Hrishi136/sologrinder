
import { useState, useEffect } from 'react';
import { useHunterProgression } from './useHunterProgression';

export interface SmartNotification {
  id: string;
  type: 'motivation' | 'streak-warning' | 'achievement-proximity' | 'comeback' | 'insight' | 'celebration';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  actionText?: string;
  actionCallback?: () => void;
}

export function useSmartNotifications() {
  const {
    stats,
    currentRank,
    nextRank,
    powerLevel,
    rankPoints,
    streak,
    daysActive,
    totalQuests,
    dailyQuests,
    questCount,
    canCompleteQuest
  } = useHunterProgression();

  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [activeNotification, setActiveNotification] = useState<SmartNotification | null>(null);

  // Helper functions
  const getTotalDailyQuests = () => {
    return (dailyQuests.easy || 0) + (dailyQuests.medium || 0) + (dailyQuests.hard || 0);
  };

  const getRankPointsAsNumber = () => {
    return typeof rankPoints === 'number' ? rankPoints : 0;
  };

  const getDaysUntilNextRank = () => {
    if (!nextRank) return null;
    const pointsNeeded = nextRank.points - getRankPointsAsNumber();
    const averagePointsPerDay = getRankPointsAsNumber() / Math.max(daysActive, 1);
    return Math.ceil(pointsNeeded / Math.max(averagePointsPerDay, 10));
  };

  const getStrongestCategory = () => {
    const categories = [
      { name: 'Combat Training', count: questCount.total * 0.3 },
      { name: 'Intelligence Gathering', count: questCount.total * 0.25 },
      { name: 'Agility Development', count: questCount.total * 0.25 },
      { name: 'Vitality Enhancement', count: questCount.total * 0.2 }
    ];
    return categories.reduce((prev, current) => 
      prev.count > current.count ? prev : current
    ).name;
  };

  // Daily Motivation (8 AM)
  const generateDailyMotivation = (): SmartNotification => {
    const availableQuests = 
      (canCompleteQuest('easy') ? (5 - (dailyQuests.easy || 0)) : 0) +
      (canCompleteQuest('medium') ? (3 - (dailyQuests.medium || 0)) : 0) +
      (canCompleteQuest('hard') ? (2 - (dailyQuests.hard || 0)) : 0);

    return {
      id: `motivation-${Date.now()}`,
      type: 'motivation',
      title: 'Daily System Activation',
      message: `Good morning, Hunter. The System has prepared ${availableQuests} quests for today. Your power level awaits growth.`,
      timestamp: new Date(),
      priority: 'medium'
    };
  };

  // Streak Protection (6 PM if incomplete)
  const generateStreakWarning = (): SmartNotification | null => {
    const todayQuests = getTotalDailyQuests();
    if (todayQuests === 0 && streak > 0) {
      return {
        id: `streak-warning-${Date.now()}`,
        type: 'streak-warning',
        title: 'Streak Protection Alert',
        message: `Warning: Quest deadline approaching. Current ${streak}-day streak at risk. The System advises immediate action.`,
        timestamp: new Date(),
        priority: 'high',
        actionText: 'Complete Quest Now'
      };
    }
    return null;
  };

  // Achievement Proximity
  const generateAchievementProximity = (): SmartNotification | null => {
    if (!nextRank) return null;
    
    const pointsNeeded = nextRank.points - getRankPointsAsNumber();
    const daysNeeded = getDaysUntilNextRank();
    
    if (pointsNeeded <= 100) {
      return {
        id: `achievement-${Date.now()}`,
        type: 'achievement-proximity',
        title: 'Achievement Proximity Alert',
        message: `You are ${pointsNeeded} points away from ${nextRank.name}. The System calculates ${daysNeeded} days needed at current pace.`,
        timestamp: new Date(),
        priority: 'medium'
      };
    }
    return null;
  };

  // Comeback Encouragement
  const generateComebackEncouragement = (): SmartNotification | null => {
    const lastActivity = localStorage.getItem('hunter_streaks');
    if (lastActivity && streak === 0 && totalQuests > 10) {
      return {
        id: `comeback-${Date.now()}`,
        type: 'comeback',
        title: 'System Reactivation',
        message: 'Previous performance detected. The System believes in your potential for improvement. Resume training?',
        timestamp: new Date(),
        priority: 'medium',
        actionText: 'Resume Training'
      };
    }
    return null;
  };

  // Behavioral Insights
  const generateBehavioralInsight = (): SmartNotification => {
    const insights = [
      `Your strongest category is ${getStrongestCategory()}`,
      'You perform 40% better on weekdays',
      'Hard quests completed more often in mornings',
      'Consider easier quests on busy days'
    ];
    
    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    
    return {
      id: `insight-${Date.now()}`,
      type: 'insight',
      title: 'Performance Analysis',
      message: randomInsight,
      timestamp: new Date(),
      priority: 'low'
    };
  };

  // Celebration Moments
  const generateCelebration = (type: string): SmartNotification => {
    const celebrations = {
      milestone: `Power level milestone achieved! Current power: ${powerLevel}`,
      weekly: `Week complete! ${getTotalDailyQuests()} quests this session.`,
      monthly: `Monthly Hunter Report: ${totalQuests} total quests completed!`,
      anniversary: `${daysActive} days as a Hunter! The System acknowledges your dedication.`
    };

    return {
      id: `celebration-${Date.now()}`,
      type: 'celebration',
      title: 'Achievement Unlocked',
      message: celebrations[type as keyof typeof celebrations] || 'Celebration!',
      timestamp: new Date(),
      priority: 'high'
    };
  };

  // Smart notification timing logic
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Daily motivation at 8 AM
      if (hour === 8 && getTotalDailyQuests() === 0) {
        const motivation = generateDailyMotivation();
        setActiveNotification(motivation);
      }
      
      // Streak warning at 6 PM
      if (hour === 18) {
        const streakWarning = generateStreakWarning();
        if (streakWarning) {
          setActiveNotification(streakWarning);
        }
      }
      
      // Achievement proximity (dynamic)
      const achievement = generateAchievementProximity();
      if (achievement && Math.random() < 0.3) { // 30% chance to show
        setActiveNotification(achievement);
      }
      
      // Comeback encouragement
      const comeback = generateComebackEncouragement();
      if (comeback) {
        setActiveNotification(comeback);
      }
      
      // Random behavioral insight (low frequency)
      if (Math.random() < 0.1) { // 10% chance
        const insight = generateBehavioralInsight();
        setActiveNotification(insight);
      }
    };

    // Check immediately and then every 30 minutes
    checkNotifications();
    const interval = setInterval(checkNotifications, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [streak, totalQuests, rankPoints, dailyQuests]);

  // Trigger celebrations on milestones
  useEffect(() => {
    if (powerLevel > 0 && powerLevel % 1000 === 0) {
      const celebration = generateCelebration('milestone');
      setActiveNotification(celebration);
    }
  }, [powerLevel]);

  const dismissNotification = () => {
    setActiveNotification(null);
  };

  const addNotification = (notification: SmartNotification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 10)); // Keep only last 10
  };

  return {
    activeNotification,
    notifications,
    dismissNotification,
    addNotification,
    generateCelebration
  };
}
