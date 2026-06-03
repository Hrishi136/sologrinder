
import React from "react";
import SystemPanel from "../components/SystemPanel";
import { useHunterStats, RANK_TIERS } from "../hooks/useHunterStats";

export default function Stats() {
  const { stats, rank, loading } = useHunterStats();

  // Progress bar %
  const progressPercent = rank.progress.toFixed(1);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-system-bg relative pt-16 sm:pt-20 px-3 sm:px-4">
        <div className="container mx-auto flex flex-col items-center gap-6 sm:gap-10">
          <SystemPanel className="w-full max-w-2xl p-4 sm:p-7">
            <div className="text-system-blue2">Loading stats...</div>
          </SystemPanel>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-system-bg relative pt-16 sm:pt-20 px-3 sm:px-4">
      <div className="container mx-auto flex flex-col items-center gap-6 sm:gap-10">
        <SystemPanel className="w-full max-w-2xl p-4 sm:p-7">
          <h2 className="font-orbitron text-lg sm:text-2xl text-system-blue font-extrabold mb-4 sm:mb-5">
            Hunter Stats & Rank Progress
          </h2>

          {/* Current Rank Badge */}
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <span
              className="text-xs sm:text-lg font-bold px-3 sm:px-4 py-1 sm:py-2 rounded-lg"
              style={{ backgroundColor: `${rank.color}30`, color: rank.color }}
            >
              {rank.name}
            </span>
            <span className="text-white/60 text-xs sm:text-sm">Current Rank</span>
          </div>

          {/* Stats Grid - Responsive columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
            {[
              { label: "Power", val: stats.power, color: "#48e18b" },
              { label: "XP", val: stats.xp, color: "#00d4ff" },
              { label: "Resolve", val: stats.resolve, color: "#f4e95a" }
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-system-blue2 font-orbitron text-xs sm:text-sm mb-2">{stat.label}</span>
                <div className="relative w-12 sm:w-8 h-20 sm:h-24 flex items-end mb-2">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-full bg-[#191e26] rounded-full border border-system-blue2" />
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 rounded-full"
                    style={{
                      height: `${Math.min((stat.val / (stat.label === 'XP' ? 60000 : stat.label === 'Power' ? 5000 : 500)) * 100, 100)}%`,
                      transition: "height 0.5s",
                      background: `linear-gradient(to top, ${stat.color}, ${stat.color}80)`
                    }}
                  />
                </div>
                <span className="font-orbitron text-white text-xs sm:text-lg">
                  {stat.val >= 1000 ? `${(stat.val / 1000).toFixed(1)}K` : stat.val}
                </span>
              </div>
            ))}
          </div>

          {/* Rank Progress */}
          <div className="flex flex-col gap-3">
            <span className="font-orbitron text-xs sm:text-lg text-system-blue2">Rank Progress</span>
            <div className="w-full bg-[#191e26] rounded-full h-4 sm:h-5 relative border border-system-blue mt-2">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-system-blue2 to-system-blue animate-fade-in"
                style={{ width: `${progressPercent}%` }}
              />
              <span className="font-orbitron text-system-blue absolute left-2 top-0 h-full flex items-center text-xs sm:text-base truncate">
                Next: {rank.nextRank ? rank.nextRank.name : "MAX RANK"}
              </span>
            </div>
            <span className="font-orbitron text-xs text-system-blue mt-1">
              XP: {stats.xp.toLocaleString()}/{rank.nextRank?.xpRequired.toLocaleString() ?? "MAX"}
            </span>
          </div>

          {/* Rank Tiers Reference */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-system-blue2/30">
            <h3 className="font-orbitron text-xs sm:text-sm text-system-blue2 mb-3 sm:mb-4">Rank Tiers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {RANK_TIERS.map(tier => (
                <div
                  key={tier.name}
                  className={`text-xs p-2 rounded ${stats.xp >= tier.xpRequired ? 'opacity-100' : 'opacity-40'}`}
                  style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                >
                  <div className="font-bold text-xs">{tier.name}</div>
                  <div className="text-white/60 text-[10px]">{tier.xpRequired.toLocaleString()} XP</div>
                </div>
              ))}
            </div>
          </div>
        </SystemPanel>
      </div>
    </div>
  );
}
