
import React from "react";

export default function RankRequirementsPanel({
  nextRank,
  getNextRankRequirements
}: {
  nextRank: any;
  getNextRankRequirements: () => string[];
}) {
  if (!nextRank) return null;
  return (
    <div className="mt-1 text-xs text-system-blue2">
      <span className="font-bold">To rank up:</span>
      <ul className="list-disc pl-5">
        {getNextRankRequirements().map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  );
}
