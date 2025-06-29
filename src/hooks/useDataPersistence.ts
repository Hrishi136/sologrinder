
import { useState, useEffect, useCallback } from 'react';

interface DataPersistenceManager {
  autoSave: (data: any, key?: string) => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  validateData: (data: any) => boolean;
  getBackupData: () => any;
  isDataValid: boolean;
  lastSaved: Date | null;
}

const DEFAULT_SAVE_KEY = 'hunter_progression_v1';
const BACKUP_KEY = 'hunter_progression_backup';
const SAVE_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useDataPersistence(): DataPersistenceManager {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDataValid, setIsDataValid] = useState(true);

  // Auto-backup every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentData = localStorage.getItem(DEFAULT_SAVE_KEY);
      if (currentData) {
        localStorage.setItem(BACKUP_KEY, currentData);
        setLastSaved(new Date());
      }
    }, SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const validateData = useCallback((data: any): boolean => {
    try {
      // Basic validation - check for required fields
      return (
        data &&
        typeof data === 'object' &&
        Array.isArray(data.stats) &&
        typeof data.currentRankIndex === 'number' &&
        typeof data.rankPoints === 'number'
      );
    } catch {
      return false;
    }
  }, []);

  const autoSave = useCallback((data: any, key: string = DEFAULT_SAVE_KEY) => {
    try {
      if (validateData(data)) {
        localStorage.setItem(key, JSON.stringify(data));
        setLastSaved(new Date());
        setIsDataValid(true);
      } else {
        console.warn('Invalid data structure, skipping save');
        setIsDataValid(false);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      setIsDataValid(false);
    }
  }, [validateData]);

  const exportData = useCallback((): string => {
    try {
      const data = localStorage.getItem(DEFAULT_SAVE_KEY);
      if (data) {
        const parsedData = JSON.parse(data);
        return JSON.stringify({
          ...parsedData,
          exportDate: new Date().toISOString(),
          version: '1.0'
        }, null, 2);
      }
      return '';
    } catch (error) {
      console.error('Export failed:', error);
      return '';
    }
  }, []);

  const importData = useCallback((jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (validateData(data)) {
        // Create backup of current data first
        const currentData = localStorage.getItem(DEFAULT_SAVE_KEY);
        if (currentData) {
          localStorage.setItem(`${BACKUP_KEY}_pre_import`, currentData);
        }
        
        // Import new data
        localStorage.setItem(DEFAULT_SAVE_KEY, JSON.stringify(data));
        setLastSaved(new Date());
        setIsDataValid(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }, [validateData]);

  const getBackupData = useCallback(() => {
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      return backup ? JSON.parse(backup) : null;
    } catch {
      return null;
    }
  }, []);

  // Validate data on startup
  useEffect(() => {
    const currentData = localStorage.getItem(DEFAULT_SAVE_KEY);
    if (currentData) {
      try {
        const parsed = JSON.parse(currentData);
        setIsDataValid(validateData(parsed));
      } catch {
        setIsDataValid(false);
        // Try to recover from backup
        const backup = getBackupData();
        if (backup && validateData(backup)) {
          localStorage.setItem(DEFAULT_SAVE_KEY, JSON.stringify(backup));
          setIsDataValid(true);
          console.log('Recovered data from backup');
        }
      }
    }
  }, [validateData, getBackupData]);

  return {
    autoSave,
    exportData,
    importData,
    validateData,
    getBackupData,
    isDataValid,
    lastSaved
  };
}
