
import React from "react";
import { Star, Trophy, Award, BadgeCheck, Badge, StarHalf } from "lucide-react";

const BADGE_ICONS: Record<string, React.ReactNode> = {
  "badge": <Badge size={44} className="text-system-blue" />,
  "badge-check": <BadgeCheck size={48} className="text-blue-400" />,
  "star-half": <StarHalf size={54} className="text-cyan-300" />,
  "star": <Star size={64} className="text-yellow-300" />,
  "trophy": <Trophy size={72} className="text-yellow-500" />,
  "award": <Award size={80} className="text-rose-400" />,
};

type Props = {
  rankName: string;
  badgeIcon: string;
  onContinue: () => void;
};

export default function RankUpCeremony({ rankName, badgeIcon, onContinue }: Props) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 animate-fade-in">
      <div className="bg-system-panel border-2 border-system-blue2 rounded-2xl px-8 py-12 flex flex-col items-center shadow-blue-glow animate-scale-in">
        <div className="mb-4">
          {BADGE_ICONS[badgeIcon]}
        </div>
        <h2 className="font-orbitron text-4xl text-system-blue mb-2 font-extrabold tracking-wider animate-fade-in">
          RANK UP!
        </h2>
        <p className="text-system-blue2 uppercase font-orbitron tracking-wider mb-2 animate-fade-in">
          You have reached
        </p>
        <div className="font-orbitron text-white text-3xl mb-4 animate-pulse">
          {rankName}
        </div>
        <button
          className="mt-5 glow-button text-lg animate-fade-in"
          onClick={onContinue}
        >
          Claim Badge & Continue
        </button>
      </div>
    </div>
  );
}
