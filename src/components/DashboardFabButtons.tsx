
import React from "react";

export default function DashboardFabButtons({
  emergencyQuestExists,
  showEmergency,
  onShowEmergency,
  onNewQuest
}: {
  emergencyQuestExists: boolean;
  showEmergency: boolean;
  onShowEmergency: () => void;
  onNewQuest: () => void;
}) {
  return (
    <>
      {(!showEmergency && emergencyQuestExists) && (
        <button
          className="fixed bottom-28 right-8 z-[110] bg-gradient-to-tr from-red-700 via-red-500 to-pink-500 shadow-2xl pulse rounded-full px-6 py-3 text-white font-orbitron text-lg font-bold flex items-center gap-3 hover:scale-105 animate-pulse border-2 border-red-500"
          style={{ boxShadow: "0 0 24px 8px #ff002280" }}
          onClick={onShowEmergency}
        >
          <span className="relative flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75" />
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-700" />
          </span>
          Emergency Quest!
        </button>
      )}
      <div className="fixed bottom-8 right-8 z-[108]">
        <button className="glow-button animate-pulse hover:scale-105 focus:scale-105 bg-gradient-to-r from-system-blue to-system-blue2 px-7 py-3 rounded-full shadow-lg font-orbitron text-lg"
          onClick={onNewQuest}
          style={{ boxShadow: "0 0 24px 8px #00d4ff99" }}>
          + Accept New Quest
        </button>
      </div>
    </>
  );
}
