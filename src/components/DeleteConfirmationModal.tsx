import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading?: boolean;
}

export default function DeleteConfirmationModal({ 
  open, 
  onClose, 
  onConfirm, 
  title,
  loading = false 
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-system-panel border-2 border-red-500/50 max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/20 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <DialogTitle className="text-red-400 font-orbitron text-xl">
              Delete Quest
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="text-center space-y-4">
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-white font-orbitron">
                Are you sure you want to delete
              </p>
              <p className="text-system-blue font-bold font-orbitron mt-1">
                "{title}"?
              </p>
            </div>
            
            <div className="text-sm text-white/70">
              <p>⚠️ This action cannot be undone</p>
              <p>All progress and streak data will be permanently lost</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-system-blue2 text-system-blue2 hover:bg-system-blue2/10 flex-1"
            disabled={loading}
          >
            Keep Quest
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-500/80 hover:bg-red-500 text-white border-red-500 flex-1"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Forever'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}