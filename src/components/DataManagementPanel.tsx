
import React, { useState } from 'react';
import { Download, Upload, Save, AlertTriangle } from 'lucide-react';
import { useDataPersistence } from '@/hooks/useDataPersistence';
import SystemNotification from './SystemNotification';

export default function DataManagementPanel() {
  const { exportData, importData, isDataValid, lastSaved } = useDataPersistence();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationTone, setNotificationTone] = useState<'default' | 'error' | 'success'>('default');

  const handleExport = () => {
    try {
      const data = exportData();
      if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hunter-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setNotificationMessage('Hunter data exported successfully.');
        setNotificationTone('success');
        setShowNotification(true);
      }
    } catch (error) {
      setNotificationMessage('Export failed. Please try again.');
      setNotificationTone('error');
      setShowNotification(true);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = importData(content);
        
        if (success) {
          setNotificationMessage('Hunter profile imported successfully. Page will reload.');
          setNotificationTone('success');
          setShowNotification(true);
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setNotificationMessage('Invalid file format. Import failed.');
          setNotificationTone('error');
          setShowNotification(true);
        }
      } catch (error) {
        setNotificationMessage('File reading error. Please try again.');
        setNotificationTone('error');
        setShowNotification(true);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="system-panel p-6 border-2 border-system-blue2">
        <h3 className="text-xl font-orbitron text-system-blue mb-4 font-bold">
          Data Management
        </h3>
        
        <div className="space-y-4">
          {/* Data Status */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a50] border border-system-blue2/30">
            {isDataValid ? (
              <Save className="h-5 w-5 text-green-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-400" />
            )}
            <div>
              <div className="text-white font-orbitron">
                Data Status: {isDataValid ? 'Valid' : 'Corrupted'}
              </div>
              {lastSaved && (
                <div className="text-sm text-white/60">
                  Last saved: {lastSaved.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Export/Import Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleExport}
              className="glow-button flex items-center justify-center gap-2 py-3"
            >
              <Download className="h-4 w-4" />
              Export Hunter Data
            </button>
            
            <label className="glow-button flex items-center justify-center gap-2 py-3 cursor-pointer">
              <Upload className="h-4 w-4" />
              Import Hunter Profile
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-xs text-white/60 space-y-1">
            <p>• Data is automatically backed up every 5 minutes</p>
            <p>• Export includes all progress, stats, and achievements</p>
            <p>• Import will replace current data (backup created first)</p>
          </div>
        </div>
      </div>

      <SystemNotification
        open={showNotification}
        message={notificationMessage}
        tone={notificationTone}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
}
