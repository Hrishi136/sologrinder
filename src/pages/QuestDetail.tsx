
import React, { useEffect, useState } from "react"
import SystemPanel from "../components/SystemPanel"

import { useParams, useNavigate } from "react-router-dom"
import { useChallenges } from "../hooks/useChallenges"
import { Tables } from "../integrations/supabase/types"
import { Button } from "../components/ui/button"
import { useToast } from "../components/ui/use-toast"

export default function QuestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { challenges, loading, deleteChallenge, completeChallenge } = useChallenges();
  const { toast } = useToast();
  const [challenge, setChallenge] = useState<Tables<'Challenges'> | null>(null);

  useEffect(() => {
    if (!loading && challenges.length > 0 && id) {
      const found = challenges.find(c => c.id === id);
      setChallenge(found || null);
    }
  }, [challenges, loading, id]);

  const handleDelete = async () => {
    if (!challenge) return;
    
    if (confirm("Are you sure you want to delete this quest?")) {
      const success = await deleteChallenge(challenge.id);
      if (success) {
        toast({
          title: "Quest Deleted",
          description: "The quest has been removed from your list.",
        });
        navigate("/quests");
      }
    }
  };

  const handleComplete = async () => {
    if (!challenge) return;
    
    const success = await completeChallenge(challenge.id);
    if (success) {
      toast({
        title: "Quest Completed!",
        description: "Your progress has been updated.",
      });
      // Refresh the challenge data
      const updated = challenges.find(c => c.id === challenge.id);
      if (updated) setChallenge(updated);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-system-bg relative pt-20">
        <div className="container mx-auto flex flex-col items-center">
          <SystemPanel className="w-full max-w-2xl p-8">
            <div className="text-center text-system-blue2 font-orbitron">Loading quest...</div>
          </SystemPanel>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen w-full bg-system-bg relative pt-20">
        <div className="container mx-auto flex flex-col items-center">
          <SystemPanel className="w-full max-w-2xl p-8">
            <div className="text-center">
              <h2 className="font-orbitron text-xl text-system-blue font-extrabold mb-4">
                Quest Not Found
              </h2>
              <p className="text-white/70 mb-4">The quest you're looking for doesn't exist.</p>
              <Button onClick={() => navigate("/quests")} className="glow-button">
                Back to Quests
              </Button>
            </div>
          </SystemPanel>
        </div>
      </div>
    );
  }

  // Parse challenge metadata
  let category = "Physical Training";
  let difficulty = "easy";
  let points = 15;
  try {
    const steps = JSON.parse(challenge.steps || "{}");
    category = steps.category || "Physical Training";
    difficulty = steps.difficulty || "easy";
    points = steps.points || 15;
  } catch (e) {
    // Use defaults
  }

  const difficultyRank = difficulty === "easy" ? "E-Rank" : difficulty === "medium" ? "D-Rank" : "C-Rank";

  return (
    <div className="min-h-screen w-full bg-system-bg relative pt-20">
      <div className="container mx-auto flex flex-col items-center">
        <SystemPanel className="w-full max-w-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-orbitron text-2xl text-system-blue font-extrabold">
              Quest Details
            </h2>
            <Button onClick={() => navigate("/quests")} variant="outline" className="border-system-blue2">
              Back to List
            </Button>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <span className="text-system-blue2 font-orbitron min-w-[100px]">Name:</span>
              <span className="text-white">{challenge.title}</span>
            </div>
            
            <div className="flex gap-2">
              <span className="text-system-blue2 font-orbitron min-w-[100px]">Category:</span>
              <span className="text-white">{category}</span>
            </div>
            
            <div className="flex gap-2">
              <span className="text-system-blue2 font-orbitron min-w-[100px]">Difficulty:</span>
              <span className="text-white">{difficultyRank} ({points} points)</span>
            </div>
            
            <div className="flex gap-2">
              <span className="text-system-blue2 font-orbitron min-w-[100px]">Streak:</span>
              <span className="text-white">{challenge.streak || 0}</span>
            </div>
            
            {challenge.description && (
              <div className="flex gap-2">
                <span className="text-system-blue2 font-orbitron min-w-[100px]">Description:</span>
                <span className="text-white">{challenge.description}</span>
              </div>
            )}
            
            <div className="flex gap-2">
              <span className="text-system-blue2 font-orbitron min-w-[100px]">Created:</span>
              <span className="text-white">
                {challenge.created_at ? new Date(challenge.created_at).toLocaleDateString() : "Unknown"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={handleComplete}
                className="glow-button bg-green-500/80 hover:bg-green-500 flex-1"
              >
                Mark Complete
              </Button>
              <Button 
                onClick={handleDelete}
                variant="outline" 
                className="border-red-500 text-red-400 hover:bg-red-500/20 flex-1"
              >
                Delete Quest
              </Button>
            </div>
          </div>
        </SystemPanel>
      </div>
    </div>
  )
}
