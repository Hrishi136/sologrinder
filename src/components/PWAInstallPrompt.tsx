
import React, { useState, useEffect } from 'react';
import SystemNotification from './SystemNotification';
import { Smartphone } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a delay if not already installed
      setTimeout(() => {
        if (!window.matchMedia('(display-mode: standalone)').matches) {
          setShowPrompt(true);
        }
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already dismissed this session
  if (sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <SystemNotification
      open={showPrompt}
      message={
        <div className="flex items-center gap-3">
          <Smartphone className="text-system-blue" size={24} />
          <div>
            <div className="font-orbitron font-bold text-system-blue mb-1">
              Install Shadow Monarch System
            </div>
            <div className="text-sm text-white/80">
              Install on your device for the full Hunter experience
            </div>
          </div>
        </div>
      }
      onClose={handleDismiss}
      actions={
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 bg-gray-600/50 text-white rounded-lg font-orbitron text-sm hover:bg-gray-600/70 transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-system-blue text-white rounded-lg font-orbitron text-sm hover:bg-system-blue/80 transition-colors glow-button"
          >
            Install Now
          </button>
        </div>
      }
    />
  );
}
