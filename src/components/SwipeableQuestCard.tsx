
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
      // Removed swipe to complete functionality
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
        className="relative bg-system-panel/90 rounded-xl border-2 border-system-blue2/30 p-2 sm:p-4 mb-2 sm:mb-3 transition-transform duration-200 touch-pan-y w-full overflow-hidden"
        style={{ transform: `translateX(${swipeOffset}px)`, maxWidth: '100%' }}
      >
        {/* Left swipe indicator (Edit) */}
        <div className="absolute left-0 top-0 h-full w-12 sm:w-16 bg-yellow-500/20 rounded-l-xl flex items-center justify-center opacity-0 transition-opacity">
          <Edit size={18} className="text-yellow-400" />
        </div>


        {/* Quest content */}
        <div className="relative z-10 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-1 sm:gap-2">
            <h3 className="font-orbitron text-sm sm:text-lg text-system-blue font-bold truncate flex-1 min-w-0">
              {quest.name}
            </h3>
            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-orbitron whitespace-nowrap flex-shrink-0 ${
              quest.completed 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-system-blue2/20 text-system-blue2'
            }`}>
              {quest.difficulty}
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <span className="text-system-blue2 text-[10px] sm:text-sm font-orbitron truncate flex-1 min-w-0">
              {quest.category}
            </span>
            
            {/* Touch-friendly action buttons */}
            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={onEdit}
                className="min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] bg-system-blue2/20 hover:bg-system-blue2/30 rounded-lg flex items-center justify-center transition-colors"
              >
                <Edit size={14} className="text-system-blue2 sm:w-4 sm:h-4" />
              </button>
              
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Trash2 size={14} className="text-red-400 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Swipe hints - hidden on mobile */}
        <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 transform -translate-x-1/2 text-[10px] sm:text-xs text-white/40 font-orbitron hidden sm:block">
          ← Edit
        </div>
      </div>
    </HapticFeedback>
  );
}
