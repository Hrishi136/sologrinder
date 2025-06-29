
import React from 'react';
import { SmartNotification } from '@/hooks/useSmartNotifications';

interface SmartNotificationModalProps {
  notification: SmartNotification | null;
  onDismiss: () => void;
  onAction?: () => void;
}

export default function SmartNotificationModal({
  notification,
  onDismiss,
  onAction
}: SmartNotificationModalProps) {
  if (!notification) return null;

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

  const getNotificationColor = (type: SmartNotification['type']) => {
    switch (type) {
      case 'motivation': return 'border-blue-500';
      case 'streak-warning': return 'border-red-500';
      case 'achievement-proximity': return 'border-yellow-500';
      case 'comeback': return 'border-green-500';
      case 'insight': return 'border-purple-500';
      case 'celebration': return 'border-pink-500';
      default: return 'border-system-blue';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 animate-fade-in">
      <div
        className={`relative min-w-[320px] max-w-lg px-8 py-7 system-panel system-panel-glow rounded-xl border-2 ${getNotificationColor(notification.type)} shadow-blue-glow flex flex-col items-center gap-4`}
        style={{
          boxShadow: "0 0 32px 10px #00d4ff77, 0 0 72px 18px #0080ff86, 0 0 18px 3px #0af",
          animation: "fade-in 0.18s cubic-bezier(.7,0,.35,1)"
        }}
      >
        {/* Icon */}
        <div className="text-4xl mb-2">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Title */}
        <div className="text-xl text-system-blue2 font-orbitron text-center font-bold">
          {notification.title}
        </div>

        {/* Message */}
        <div className="text-lg text-white font-orbitron text-center leading-relaxed">
          {notification.message}
        </div>

        {/* Priority indicator */}
        {notification.priority === 'high' && (
          <div className="text-sm text-red-400 font-orbitron">
            HIGH PRIORITY
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          {notification.actionText && onAction && (
            <button
              className="glow-button text-base px-6 py-2"
              onClick={() => {
                onAction();
                onDismiss();
              }}
            >
              {notification.actionText}
            </button>
          )}
          <button
            className="px-6 py-2 border border-system-blue2 text-system-blue2 rounded font-orbitron hover:bg-system-blue2/20 transition-colors"
            onClick={onDismiss}
            autoFocus={!notification.actionText}
          >
            Acknowledge
          </button>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-white/50 mt-2">
          {notification.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
