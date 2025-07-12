import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface WelcomeBackModalProps {
  username: string;
  isVisible: boolean;
  onClose: () => void;
}

const WelcomeBackModal: React.FC<WelcomeBackModalProps> = ({ username, isVisible, onClose }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Play glitch sound effect
      const audio = new Audio('https://example.com/glitch.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Silently handle audio play errors (autoplay restrictions)
      });

      // Small delay before showing text for dramatic effect
      const timer = setTimeout(() => setShowText(true), 300);
      
      // Auto-close after 3.5 seconds
      const autoClose = setTimeout(() => {
        onClose();
      }, 3500);

      return () => {
        clearTimeout(timer);
        clearTimeout(autoClose);
      };
    } else {
      setShowText(false);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="relative overflow-hidden bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-md border border-primary/30 shadow-2xl">
        {/* Glassmorphism effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm" />
        
        {/* Animated scanlines */}
        <div className="absolute inset-0 opacity-20">
          <div className="animate-pulse absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent translate-y-[-100%] animate-[slide-down_2s_ease-in-out_infinite]" />
        </div>

        <div className="relative p-12 text-center">
          {showText && (
            <div className="space-y-4">
              <div className="glitch-text-full glow-text text-2xl font-bold text-primary">
                WELCOME BACK, HUNTER
              </div>
              <div className="glitch-text-full text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">
                {username.toUpperCase()}
              </div>
              <div className="text-sm text-muted-foreground/80 animate-fade-in">
                The System acknowledges your return
              </div>
            </div>
          )}
        </div>
      </Card>

    </div>
  );
};

export default WelcomeBackModal;