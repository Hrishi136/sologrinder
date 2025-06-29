
import React from 'react';
import { SmartNotification } from '@/hooks/useSmartNotifications';

interface NotificationHistoryProps {
  notifications: SmartNotification[];
  onClear: () => void;
}

export default function NotificationHistory({
  notifications,
  onClear
}: NotificationHistoryProps) {
  const getNotificationIcon = (type: SmartNotification['type']) => {
    switch (type) {
      case 'motivation': return '🌅';
      case 'streak-warning': return '⚠️';
      case 'achievement-proximity': return '🎯';
      case 'comeback': return '💪';
      case 'insight': return '🧠';
      case 'celebration': return '🎉';
      default: return '📢';
    }
  };

  const getTypeLabel = (type: SmartNotification['type']) => {
    switch (type) {
      case 'motivation': return 'Daily Motivation';
      case 'streak-warning': return 'Streak Warning';
      case 'achievement-proximity': return 'Achievement Alert';
      case 'comeback': return 'Comeback Encouragement';
      case 'insight': return 'Behavioral Insight';
      case 'celebration': return 'Celebration';
      default: return 'System Alert';
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="system-panel bg-black/70 border-system-blue2 border-2 rounded-lg shadow-lg p-6">
        <div className="text-center text-white/60 font-orbitron">
          No recent notifications
        </div>
      </div>
    );
  }

  return (
    <div className="system-panel bg-black/70 border-system-blue2 border-2 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-orbitron text-system-blue2">
          System Notifications
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="border-l-4 border-system-blue2/50 pl-4 py-2 bg-black/30 rounded-r"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">
                {getNotificationIcon(notification.type)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-orbitron text-system-blue2">
                    {getTypeLabel(notification.type)}
                  </span>
                  <span className="text-xs text-white/50">
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-white leading-relaxed">
                  {notification.message}
                </div>
                {notification.priority === 'high' && (
                  <span className="inline-block mt-1 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                    HIGH PRIORITY
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
