
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
};

export function useEmergencyQuestModal() {
  const [modal, setModal] = React.useState<EQModalState>({
    quest: null, show: false, accepted: false,
  });

  // Always bring new quest to front, closing old if needed
  const showModal = (quest: EmergencyQuest) => {
    setModal({ quest, show: true, accepted: false });
  };

  const acceptModal = () => setModal((m) => ({ ...m, accepted: true }));
  const completeModal = () => setModal({ quest: null, show: false, accepted: false });
  const closeModal = () => setModal({ quest: null, show: false, accepted: false });

  return {
    quest: modal.quest,
    open: modal.show,
    alreadyAccepted: modal.accepted,
    showModal,
    acceptModal,
    completeModal,
    closeModal,
  };
}
