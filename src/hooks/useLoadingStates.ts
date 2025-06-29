
import { useState, useCallback } from 'react';

type LoadingState = 
  | 'system-init'
  | 'quest-loading'
  | 'stat-update'
  | 'shadow-unlock'
  | 'rank-calculation'
  | 'data-sync'
  | 'idle';

interface LoadingManager {
  currentState: LoadingState;
  isLoading: boolean;
  setLoadingState: (state: LoadingState) => void;
  clearLoading: () => void;
}

export function useLoadingStates(): LoadingManager {
  const [currentState, setCurrentState] = useState<LoadingState>('idle');

  const setLoadingState = useCallback((state: LoadingState) => {
    setCurrentState(state);
  }, []);

  const clearLoading = useCallback(() => {
    setCurrentState('idle');
  }, []);

  return {
    currentState,
    isLoading: currentState !== 'idle',
    setLoadingState,
    clearLoading
  };
}
