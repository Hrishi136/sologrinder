
import React from 'react';

interface HapticFeedbackProps {
  trigger: boolean;
  type?: 'light' | 'medium' | 'heavy';
  children: React.ReactNode;
}

export default function HapticFeedback({ 
  trigger, 
  type = 'medium', 
  children 
}: HapticFeedbackProps) {
  const [isPulsing, setIsPulsing] = React.useState(false);

  React.useEffect(() => {
    if (trigger) {
      setIsPulsing(true);
      
      // Try native haptic feedback if available
      if ('vibrate' in navigator) {
        const pattern = {
          light: [10],
          medium: [30],
          heavy: [50, 10, 50]
        };
        navigator.vibrate(pattern[type]);
      }

      // Visual feedback
      setTimeout(() => setIsPulsing(false), 200);
    }
  }, [trigger, type]);

  return (
    <div className={`transition-all duration-200 ${isPulsing ? 'scale-110 brightness-125' : ''}`}>
      {children}
      {isPulsing && (
        <div className="absolute inset-0 bg-system-blue/20 rounded-lg animate-ping pointer-events-none" />
      )}
    </div>
  );
}
