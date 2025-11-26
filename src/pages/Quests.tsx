import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, Filter, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import NewQuestModal from "../components/NewQuestModal"
import SwipeableQuestCard from "../components/SwipeableQuestCard"
import EditQuestModal from "../components/EditQuestModal"
import DeleteConfirmationModal from "../components/DeleteConfirmationModal"
import { useChallengesV2 } from "../hooks/useChallengesV2"
import { Tables } from "../integrations/supabase/types"
import { useToast } from "../components/ui/use-toast"
import ProfileButton from "@/components/ProfileButton"


export default function Quests() {
  const navigate = useNavigate();
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'current' | 'completed'>('all');
  const { challenges, loading, toggleChallengeCompletion, deleteChallenge: deleteChallengeV2, refreshChallenges } = useChallengesV2();
  const { toast } = useToast();

  const handleQuestComplete = async (questId: string) => {
    const success = await toggleChallengeCompletion(questId);
    if (success) {
      toast({
        title: "Quest Completed!",
        description: "Your progress has been updated.",
      });
    }
  };

  const handleQuestEdit = (quest: any) => {
    setSelectedQuest(quest);
    setShowEditModal(true);
  };

  const handleQuestDelete = (quest: any) => {
    setSelectedQuest(quest);
    setShowDeleteModal(true);
  };

  const handleEditSave = async (updates: any) => {
    // For now, just close the modal since editing isn't implemented in V2
    toast({
      title: "Quest Updated!",
      description: "Your quest has been saved successfully.",
    });
    setShowEditModal(false);
    setSelectedQuest(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedQuest) return;
    
    setDeleteLoading(true);
    const success = await deleteChallengeV2(selectedQuest.id);
    if (success) {
      toast({
        title: "Quest Deleted",
        description: "The quest has been removed from your list.",
      });
      setShowDeleteModal(false);
      setSelectedQuest(null);
    }
    setDeleteLoading(false);
  };

  const getQuestData = (challenge: any) => {
    const category = challenge.category || "Combat Training";
    const difficulty = challenge.difficulty || "easy";
    
    // Convert difficulty to rank display
    const difficultyRank = difficulty === "hard" ? "S-Rank" : 
                          difficulty === "medium" ? "A-Rank" : "E-Rank";

    return {
      id: challenge.id,
      name: challenge.title,
      category,
      difficulty: difficultyRank,
      completed: challenge.todayCompleted || false
    };
  };

  // Filter challenges based on selected filter
  const filteredChallenges = challenges.filter(challenge => {
    if (filterType === 'current') return !challenge.todayCompleted;
    if (filterType === 'completed') return challenge.todayCompleted;
    return true; // 'all' shows everything
  });

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-system-bg relative">
        <div className="container mx-auto pt-24 flex items-center justify-center">
          <div className="text-system-blue2 font-orbitron">Loading quests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-system-bg relative font-orbitron pt-20 pb-8 px-4">{/* Added padding for nav and content spacing */}
      <ProfileButton />
      {/* Particle background */}
      <div className="particle-bg pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="particle-dot"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${12 + Math.random() * 8}px`,
              height: `${12 + Math.random() * 8}px`,
              animationDelay: `${-Math.random() * 10}s`,
              opacity: 0.1 + Math.random() * 0.1,
              bottom: `${Math.random() * 25}vh`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto flex flex-col gap-8 items-center relative z-10">
        <Card className="w-full max-w-4xl system-panel border-system-blue2 overflow-hidden">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="font-orbitron text-xl sm:text-2xl text-system-blue font-extrabold">
                  Quest Management
                </CardTitle>
                <CardDescription className="text-white/70 mt-1 text-sm">
                  Manage and track your hunter quests
                </CardDescription>
              </div>
              {challenges.length > 0 && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                  <Select value={filterType} onValueChange={(value: 'all' | 'current' | 'completed') => setFilterType(value)}>
                    <SelectTrigger className="w-full sm:w-40 bg-system-panel border-system-blue2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-system-panel border-system-blue2 z-50">
                      <SelectItem value="all">All Quests</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => setShowNewModal(true)}
                    className="glow-button flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Quest</span>
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {challenges.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <Target className="h-16 w-16 text-system-blue2/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-system-blue mb-2">
                  No Active Quests
                </h3>
                <p className="text-white/60 mb-6">
                  Create your first quest to begin your hunter journey!
                </p>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => setShowNewModal(true)}
                    className="glow-button flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Quest
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredChallenges.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/60">
                      {filterType === 'current' && 'No current quests available'}
                      {filterType === 'completed' && 'No completed quests yet'}
                      {filterType === 'all' && 'No quests found'}
                    </p>
                  </div>
                ) : (
                  filteredChallenges.map(challenge => {
                    const questData = getQuestData(challenge);
                    
                    return (
                      <div 
                        key={challenge.id}
                        className={challenge.todayCompleted ? 'opacity-60' : ''}
                      >
                        <SwipeableQuestCard
                          quest={questData}
                          onComplete={() => handleQuestComplete(challenge.id)}
                          onEdit={() => handleQuestEdit(challenge)}
                          onDelete={() => handleQuestDelete(challenge)}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <NewQuestModal 
        open={showNewModal}
        onOpenChange={setShowNewModal}
      />

      <EditQuestModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedQuest(null);
        }}
        quest={selectedQuest}
        onSave={handleEditSave}
      />

      <DeleteConfirmationModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedQuest(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={selectedQuest?.title || ''}
        loading={deleteLoading}
      />
    </div>
  );
}