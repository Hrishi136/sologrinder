import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import ShadowUnlockCeremony from "@/components/ShadowUnlockCeremony";
import { getShadowByName } from "@/constants/shadowArmy";

// Key for localStorage
const UNLOCKED_SHADOWS_KEY = "shadow_army_unlocked";

interface UnlockQueueItem {
  name: string;
  tier: number;
  permanentImage?: string | null;
}

interface ShadowUnlockContextType {
  triggerUnlock: (shadowName: string, permanentImage?: string | null) => void;
  isShowingUnlock: boolean;
}

const ShadowUnlockContext = createContext<ShadowUnlockContextType | null>(null);

export function useShadowUnlock() {
  const context = useContext(ShadowUnlockContext);
  if (!context) {
    throw new Error("useShadowUnlock must be used within ShadowUnlockProvider");
  }
  return context;
}

// Helper to persist unlock to localStorage
function persistUnlock(shadowName: string) {
  const stored = localStorage.getItem(UNLOCKED_SHADOWS_KEY);
  let unlocked: string[] = [];
  if (stored) {
    try {
      unlocked = JSON.parse(stored);
    } catch {
      unlocked = [];
    }
  }
  if (!unlocked.includes(shadowName)) {
    unlocked.push(shadowName);
    localStorage.setItem(UNLOCKED_SHADOWS_KEY, JSON.stringify(unlocked));
  }
}

interface ShadowUnlockProviderProps {
  children: ReactNode;
}

export function ShadowUnlockProvider({ children }: ShadowUnlockProviderProps) {
  const [queue, setQueue] = useState<UnlockQueueItem[]>([]);
  const [current, setCurrent] = useState<UnlockQueueItem | null>(null);

  const triggerUnlock = useCallback((shadowName: string, permanentImage?: string | null) => {
    const shadow = getShadowByName(shadowName);
    if (!shadow) return;

    const item: UnlockQueueItem = {
      name: shadowName,
      tier: shadow.tier,
      permanentImage,
    };

    setQueue((prev) => {
      if (prev.length === 0 && !current) {
        setCurrent(item);
        return prev;
      }
      return [...prev, item];
    });
  }, [current]);

  const handleComplete = useCallback((shadowName: string) => {
    // Persist the unlock to localStorage
    persistUnlock(shadowName);

    setCurrent(null);
    setQueue((prev) => {
      if (prev.length > 0) {
        const [next, ...rest] = prev;
        setTimeout(() => setCurrent(next), 300);
        return rest;
      }
      return prev;
    });
  }, []);

  return (
    <ShadowUnlockContext.Provider
      value={{
        triggerUnlock,
        isShowingUnlock: !!current,
      }}
    >
      {children}
      {current && (
        <ShadowUnlockCeremony
          shadowName={current.name}
          tier={current.tier}
          permanentImage={current.permanentImage}
          onComplete={() => handleComplete(current.name)}
        />
      )}
    </ShadowUnlockContext.Provider>
  );
}
