
import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface SystemErrorProps {
  type: 'network' | 'validation' | 'save' | 'general';
  message?: string;
  onRetry?: () => void;
  autoRetry?: boolean;
  retryCount?: number;
}

const ErrorMessages = {
  network: 'System connection lost. Retrying...',
  validation: 'Invalid quest parameters detected.',
  save: 'Data synchronization failed. Attempting recovery...',
  general: 'System error encountered.'
};

const ErrorIcons = {
  network: WifiOff,
  validation: AlertCircle,
  save: RefreshCw,
  general: AlertCircle
};

export default function SystemErrorHandler({ 
  type, 
  message, 
  onRetry, 
  autoRetry = false, 
  retryCount = 0 
}: SystemErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [attempts, setAttempts] = useState(retryCount);
  
  const displayMessage = message || ErrorMessages[type];
  const IconComponent = ErrorIcons[type];

  useEffect(() => {
    if (autoRetry && onRetry && attempts < 3) {
      const delay = Math.pow(2, attempts) * 1000; // Exponential backoff
      const timer = setTimeout(() => {
        setIsRetrying(true);
        onRetry();
        setAttempts(prev => prev + 1);
        setTimeout(() => setIsRetrying(false), 1000);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [autoRetry, onRetry, attempts]);

  const handleManualRetry = () => {
    if (onRetry) {
      setIsRetrying(true);
      onRetry();
      setAttempts(prev => prev + 1);
      setTimeout(() => setIsRetrying(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 animate-fade-in">
      <div className="relative min-w-[320px] max-w-lg px-8 py-7 system-panel border-2 border-red-600 rounded-xl shadow-red-glow">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-3 rounded-full bg-red-600/20 border border-red-600">
            <IconComponent className="h-8 w-8 text-red-400" />
          </div>
          
          <div className="space-y-2">
            <div className="text-red-400 text-sm font-orbitron tracking-widest uppercase">
              System Error
            </div>
            <div className="text-lg text-white font-orbitron">
              {displayMessage}
            </div>
            {attempts > 0 && (
              <div className="text-sm text-white/60">
                Attempt {attempts}/3
              </div>
            )}
          </div>

          {onRetry && (
            <button
              className="glow-button bg-red-600 hover:bg-red-500 text-white font-orbitron px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
              onClick={handleManualRetry}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
