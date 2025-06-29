
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuestSkeletonLoader() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="system-panel p-4 border-2 border-system-blue2/30 animate-pulse"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-6 w-32 bg-system-blue2/20" />
            <Skeleton className="h-5 w-16 bg-system-blue2/20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-system-blue2/20" />
            <Skeleton className="h-4 w-3/4 bg-system-blue2/20" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-8 w-24 bg-system-blue2/20" />
            <Skeleton className="h-6 w-20 bg-system-blue2/20" />
          </div>
          
          {/* Blue shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-system-blue/10 to-transparent animate-[shimmer_2s_infinite] pointer-events-none" />
        </div>
      ))}
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
