
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface SystemLoadingOverlayProps {
  state: 'system-init' | 'quest-loading' | 'stat-update' | 'shadow-unlock' | 'rank-calculation' | 'data-sync';
  progress?: number;
  message?: string;
}

const LoadingMessages = {
  'system-init': 'System Initializing...',
  'quest-loading': 'Loading quest data...',
  'stat-update': 'Updating hunter statistics...',
  'shadow-unlock': 'Unlocking shadow soldier...',
  'rank-calculation': 'Processing hunter assessment...',
  'data-sync': 'Synchronizing data...'
};

export default function SystemLoadingOverlay({ state, progress = 0, message }: SystemLoadingOverlayProps) {
  const displayMessage = message || LoadingMessages[state];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 animate-fade-in">
      {/* Blue particles background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-system-blue to-system-blue2 opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${8 + Math.random() * 16}px`,
              height: `${8 + Math.random() * 16}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-w-[360px] max-w-lg px-8 py-6 system-panel border-2 border-system-blue rounded-xl">
        <div className="text-center space-y-4">
          <div className="text-system-blue2 text-sm font-orbitron tracking-widest uppercase">
            The System says...
          </div>
          <div className="text-system-blue text-2xl font-orbitron font-bold tracking-wide">
            {displayMessage}
          </div>
          <div className="w-full space-y-2">
            <Progress 
              value={progress} 
              className="h-3 bg-[#191e26] border border-system-blue2/60"
            />
            {progress > 0 && (
              <div className="text-system-blue2 text-sm font-orbitron">
                {Math.round(progress)}% Complete
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
