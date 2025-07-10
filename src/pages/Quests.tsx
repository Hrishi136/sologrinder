
import React from "react"
import SystemPanel from "../components/SystemPanel"
import TopNav from "../components/TopNav"
import NewQuestModal from "../components/NewQuestModal"
import SwipeableQuestCard from "../components/SwipeableQuestCard"
import { useChallenges } from "../hooks/useChallenges"
import { useHunterProgression } from "../hooks/useHunterProgression"
import { useToast } from "../components/ui/use-toast"

export default function Quests() {
  const { challenges, loading, deleteChallenge, completeChallenge } = useChallenges();
  const { completeQuest } = useHunterProgression();
  const { toast } = useToast();

  const handleComplete = async (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    // Parse challenge steps to get category and difficulty
    let category = "combat";
    let difficulty = "easy";
    try {
      const steps = JSON.parse(challenge.steps || "{}");
      const categoryMap: Record<string, string> = {
        "Combat Training": "combat",
        "Intelligence Gathering": "intelligence", 
        "Agility Development": "agility",
        "Vitality Enhancement": "vitality"
      };
      category = categoryMap[steps.category] || "combat";
      difficulty = steps.difficulty || "easy";
    } catch (e) {
      console.warn("Failed to parse challenge steps:", e);
    }

    // Complete in both systems
    const progressSuccess = completeQuest(category, difficulty as "easy" | "medium" | "hard");
    if (progressSuccess) {
      await completeChallenge(challengeId);
      toast({
        title: "Quest Completed!",
        description: "Your progress has been updated and stats gained.",
      });
    } else {
      toast({
        title: "Daily Limit Reached",
        description: `You've completed the maximum ${difficulty} quests for today.`,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (challengeId: string) => {
    // Navigate to quest detail page for editing
    window.location.href = `/quest/${challengeId}`;
  };

  const handleDelete = async (challengeId: string) => {
    if (confirm("Are you sure you want to delete this quest?")) {
      const success = await deleteChallenge(challengeId);
      if (success) {
        toast({
          title: "Quest Deleted",
          description: "The quest has been removed from your list.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-system-bg relative">
      <TopNav />
      <div className="container mx-auto pt-4 flex flex-col gap-8 items-center">
        <SystemPanel className="w-full max-w-4xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-orbitron text-2xl text-system-blue font-extrabold">
              Quest Management
            </h2>
            <NewQuestModal />
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-system-blue2 font-orbitron">Loading quests...</div>
            </div>
          ) : challenges.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-system-blue2 font-orbitron mb-4">No active quests</div>
              <p className="text-white/70">Create your first quest to begin your hunter journey!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {challenges.map(challenge => {
                // Parse challenge metadata
                let category = "Physical";
                let difficulty = "E-Rank";
                try {
                  const steps = JSON.parse(challenge.steps || "{}");
                  category = steps.category || "Physical";
                  difficulty = `${steps.difficulty || "easy"}-rank`.replace("easy", "E").replace("medium", "D").replace("hard", "C");
                } catch (e) {
                  // Use defaults
                }

                return (
                  <SwipeableQuestCard
                    key={challenge.id}
                    quest={{
                      id: challenge.id,
                      name: challenge.title,
                      category: category,
                      difficulty: difficulty,
                      completed: false
                    }}
                    onComplete={() => handleComplete(challenge.id)}
                    onEdit={() => handleEdit(challenge.id)}
                    onDelete={() => handleDelete(challenge.id)}
                  />
                );
              })}
            </div>
          )}
        </SystemPanel>
      </div>
    </div>
  )
}
