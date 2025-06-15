
import React from "react";
import { Clock } from "lucide-react";

export default function ArmyStatsPanel({
  armyPower,
  completion,
  nextUnlock
}: {
  armyPower: number;
  completion: string;
  nextUnlock: any;
}) {
  return (
    <div className="system-panel bg-black/70 border-system-blue2 border-2 rounded-xl shadow-lg p-4 flex flex-col items-center gap-4">
      <h2 className="font-orbitron text-system-blue2 mb-1 text-lg">Army Stats</h2>
      <div className="w-full flex justify-between text-xs">
        <span>Total Power</span>
        <span className="text-system-blue2 font-bold text-base">+{armyPower}</span>
      </div>
      <div className="w-full flex justify-between text-xs">
        <span>Completion</span>
        <span>{completion}</span>
      </div>
      <div className="w-full flex justify-between text-xs">
        <span>Next Unlock</span>
        <span className="text-system-blue2 font-bold">
          {nextUnlock ? nextUnlock.name : "-"}
        </span>
      </div>
      {nextUnlock && (
        <div className="w-full mt-1 flex items-center gap-2">
          <Clock size={15} className="text-system-blue2" />
          <span className="text-xs text-system-blue2">Est. 2 days remaining</span>
        </div>
      )}
      <div className="w-full h-2 rounded-full bg-gray-800 mt-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-system-blue2 to-system-blue h-2 transition-all"
          style={{ width: `${(parseInt(completion) / 12) * 100}%` }}
        />
      </div>
      <div className="text-xs text-blue-300 mt-4 text-center">
        Army formation bonus will be available with more shadows.
      </div>
    </div>
  );
}
