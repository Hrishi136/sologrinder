
import React, { useState } from 'react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import HapticFeedback from './HapticFeedback';
import { Edit, Check, Trash2 } from 'lucide-react';

interface SwipeableQuestCardProps {
  quest: {
    id: string;
    name: string;
    category: string;
    difficulty: string;
    completed: boolean;
  };
  onComplete: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}

export default function SwipeableQuestCard({ 
  quest, 
  onComplete, 
  onEdit,
  onDelete 
}: SwipeableQuestCardProps) {
  const [hapticTrigger, setHapticTrigger] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const { elementRef } = useSwipeGestures({
    onSwipeRight: () => {
      if (!quest.completed) {
        onComplete();
        setHapticTrigger(prev => !prev);
      }
    },
    onSwipeLeft: () => {
      onEdit();
      setHapticTrigger(prev => !prev);
    },
    threshold: 100
  });

  return (
    <HapticFeedback trigger={hapticTrigger} type="medium">
      <div
        ref={elementRef as React.RefObject<HTMLDivElement>}
        className="relative bg-system-panel/90 rounded-xl border-2 border-system-blue2/30 p-4 mb-3 transition-transform duration-200 touch-pan-y"
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        {/* Left swipe indicator (Edit) */}
        <div className="absolute left-0 top-0 h-full w-16 bg-yellow-500/20 rounded-l-xl flex items-center justify-center opacity-0 transition-opacity">
          <Edit size={20} className="text-yellow-400" />
        </div>

        {/* Right swipe indicator (Complete) */}
        <div className="absolute right-0 top-0 h-full w-16 bg-green-500/20 rounded-r-xl flex items-center justify-center opacity-0 transition-opacity">
          <Check size={20} className="text-green-400" />
        </div>

        {/* Quest content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-orbitron text-lg text-system-blue font-bold">
              {quest.name}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-orbitron ${
              quest.completed 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-system-blue2/20 text-system-blue2'
            }`}>
              {quest.difficulty}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-system-blue2 text-sm font-orbitron">
              {quest.category} Training
            </span>
            
            {/* Touch-friendly action buttons */}
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="min-h-[44px] min-w-[44px] bg-system-blue2/20 hover:bg-system-blue2/30 rounded-lg flex items-center justify-center transition-colors"
              >
                <Edit size={16} className="text-system-blue2" />
              </button>
              
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="min-h-[44px] min-w-[44px] bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              )}
              
              {!quest.completed && (
                <button
                  onClick={() => {
                    onComplete();
                    setHapticTrigger(prev => !prev);
                  }}
                  className="min-h-[44px] min-w-[44px] bg-green-500/20 hover:bg-green-500/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Check size={16} className="text-green-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Swipe hints */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-white/50 font-orbitron">
          ← Edit • Complete →
        </div>
      </div>
    </HapticFeedback>
  );
}
