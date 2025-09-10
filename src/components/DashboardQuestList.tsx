import React from 'react';
import { Check, Target } from 'lucide-react';
import { useChallengesV2 } from '@/hooks/useChallengesV2';
import { useToast } from './ui/use-toast';

interface DashboardQuestListProps {
  onQuestComplete?: () => void;
}

const DIFFICULTY_MAP = {
  'Easy': 'easy' as const,
  'Medium': 'medium' as const,
  'Hard': 'hard' as const
};

const DIFFICULTY_COLORS = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30'
};

export default function DashboardQuestList({ onQuestComplete }: DashboardQuestListProps) {
  const { challenges, loading, toggleChallengeCompletion } = useChallengesV2();
  const { toast } = useToast();

  const handleQuestComplete = async (questId: string, questTitle: string) => {
    const success = await toggleChallengeCompletion(questId);
    if (success) {
      toast({
        title: "Quest Completed!",
        description: `"${questTitle}" marked as complete.`,
      });
      onQuestComplete?.();
    }
  };

  const getDifficultyLevel = (category: string): 'easy' | 'medium' | 'hard' => {
    // Simple categorization based on quest category
    if (category.includes('Combat') || category.includes('Vitality')) return 'hard';
    if (category.includes('Intelligence') || category.includes('Agility')) return 'medium';
    return 'easy';
  };

  const incompleteQuests = challenges.filter(quest => !quest.todayCompleted);

  if (loading) {
    return (
      <div className="bg-system-panel/90 rounded-xl border-2 border-system-blue2/30 p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-system-blue2/20 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-system-blue2/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (incompleteQuests.length === 0) {
    return (
      <div className="bg-system-panel/90 rounded-xl border-2 border-system-blue2/30 p-6 text-center">
        <Target className="h-12 w-12 text-system-blue2/50 mx-auto mb-3" />
        <h3 className="font-orbitron text-lg text-system-blue mb-2">All Quests Complete!</h3>
        <p className="text-white/60 text-sm">Create new quests on the Quests page to continue your journey.</p>
      </div>
    );
  }

  return (
    <div className="bg-system-panel/90 rounded-xl border-2 border-system-blue2/30 p-4">
      <h3 className="font-orbitron text-xl text-system-blue mb-4 flex items-center gap-2">
        <Target className="h-5 w-5" />
        Today's Quests
      </h3>
      
      <div className="space-y-3">
        {incompleteQuests.map(quest => {
          const difficulty = getDifficultyLevel(quest.category || '');
          const difficultyColor = DIFFICULTY_COLORS[difficulty];
          
          return (
            <div 
              key={quest.id}
              className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-system-blue2/20 hover:border-system-blue2/40 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-orbitron text-system-blue font-semibold text-sm sm:text-base truncate">
                  {quest.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-system-blue2 text-xs sm:text-sm">
                    {quest.category || 'General'} Training
                  </span>
                  <span className={`px-2 py-1 rounded text-xs border ${difficultyColor}`}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => handleQuestComplete(quest.id, quest.title)}
                className="ml-3 min-h-[44px] min-w-[44px] bg-green-500/20 hover:bg-green-500/30 rounded-lg flex items-center justify-center transition-colors border border-green-500/30 hover:border-green-500/50"
                aria-label={`Complete quest: ${quest.title}`}
              >
                <Check size={18} className="text-green-400" />
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-system-blue2/10 rounded-lg border border-system-blue2/20">
        <p className="text-xs text-white/70 text-center">
          Complete quests to gain stat points and maintain your streak. New quests can be created on the Quests page.
        </p>
      </div>
    </div>
  );
}