
import React from "react";

type EmergencyQuest = {
  type: "combat" | "intelligence" | "agility" | "special";
  title: string;
  description: string;
  rewardText: string;
  rewardPoints: number;
  timerEnd: number;
};

type EQModalState = {
  quest: EmergencyQuest | null;
  show: boolean;
  accepted: boolean;
  // Add an incrementing key to force remounting when a new quest arrives
  swapKey: number;
};

export function useEmergencyQuestModal() {
  const [modal, setModal] = React.useState<EQModalState>({
    quest: null, show: false, accepted: false, swapKey: 0,
  });

  // Always bring new quest to front, closing old if needed
  const showModal = (quest: EmergencyQuest) => {
    setModal(prev => ({
      quest,
      show: true,
      accepted: false,
      swapKey: prev.swapKey + 1 // increment key to force swap
    }));
  };

  const acceptModal = () => setModal((m) => ({ ...m, accepted: true }));
  const completeModal = () => setModal({ quest: null, show: false, accepted: false, swapKey: 0 });
  const closeModal = () => setModal({ quest: null, show: false, accepted: false, swapKey: 0 });

  return {
    quest: modal.quest,
    open: modal.show,
    alreadyAccepted: modal.accepted,
    showModal,
    acceptModal,
    completeModal,
    closeModal,
    swapKey: modal.swapKey,
  };
}
