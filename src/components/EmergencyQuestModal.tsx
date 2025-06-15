import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

type EmergencyQuest = {
  type: "combat" | "intelligence" | "agility" | "special";
  title: string;
  description: string;
  rewardText: string;
  rewardPoints: number;
  timerEnd: number; // ms
};

const urgencyColor = (msLeft: number) => {
  const hours = msLeft / 3600000;
  if (hours < 6) return "from-red-600 via-red-400 to-pink-400 animate-pulse";
  if (hours < 12) return "from-orange-500 via-yellow-400 to-orange-300";
  return "from-system-blue2 via-blue-400 to-blue-200";
};

function formatDuration(msLeft: number) {
  if (msLeft <= 0) return "00:00:00";
  const totalSec = Math.floor(msLeft / 1000);
  const h = Math.floor(totalSec / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((totalSec % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function EmergencyQuestModal({
  open,
  quest,
  onClose,
  onAccept,
  onComplete,
  alreadyAccepted,
}: {
  open: boolean;
  quest: EmergencyQuest | null;
  onClose: () => void;
  onAccept: () => void;
  onComplete: () => void;
  alreadyAccepted: boolean;
}) {
  const [msLeft, setMsLeft] = React.useState(
    quest ? quest.timerEnd - Date.now() : 0
  );

  React.useEffect(() => {
    if (!quest) return;
    const interval = setInterval(() => {
      setMsLeft(quest.timerEnd - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [quest]);

  if (!quest) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="system-panel system-panel-glow bg-[#0a0a0aee] border-red-600 border-2 p-6 rounded-2xl shadow-red-500/40 animate-fade-in font-orbitron max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-red-500 tracking-widest text-xl mb-2 flex items-center gap-2">
            🚨 Emergency Quest!
            <span className="text-xs ml-2 font-thin text-white">[System Alert]</span>
          </DialogTitle>
        </DialogHeader>
        {/* Quest info */}
        <div className="flex flex-col gap-3">
          <div className="text-base text-white font-bold flex gap-2 items-center">
            <span>
              {quest.type === "combat" && "🗡️"}
              {quest.type === "intelligence" && "🧠"}
              {quest.type === "agility" && "⚡"}
              {quest.type === "special" && "🛡️"}
            </span>
            <span>{quest.title}</span>
          </div>
          <div className="text-sm text-white/95 mb-2">{quest.description}</div>
          <div className="w-full flex gap-4 items-center">
            <div className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl bg-gradient-to-br ${urgencyColor(msLeft)}`}>
              <span className="font-orbitron text-xs text-white/70">Time left</span>
              <span className="font-bold text-2xl text-shadow animate-pulse">{formatDuration(msLeft)}</span>
            </div>
            <div className="flex-1 text-xs text-white/70">
              <b>Reward:</b>
              <br />
              <span className="text-lg text-white font-bold">{quest.rewardText}</span>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-2 items-center justify-end mt-2">
          {!alreadyAccepted && (
            <Button
              className="glow-button bg-system-blue2/90 hover:bg-system-blue2 text-white px-6 py-2 rounded-lg font-orbitron text-base transition active:scale-95"
              onClick={onAccept}
            >
              Accept Quest
            </Button>
          )}
          {alreadyAccepted && (
            <Button
              className="bg-gradient-to-r from-blue-700 to-system-blue2 text-white font-bold px-6 py-2 rounded-lg font-orbitron text-base animate-pulse"
              onClick={onComplete}
            >
              Mark Complete
            </Button>
          )}
          <Button variant="outline" onClick={onClose} autoFocus>
            Acknowledge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
