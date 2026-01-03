import React from "react";
import { getShadowImage, getShadowByName } from "@/constants/shadowArmy";

interface ShadowUnitAvatarProps {
  name: string;
  isUnlocked?: boolean;
  size?: "sm" | "md" | "lg";
  showFallback?: boolean;
}

const sizeClasses = {
  sm: "w-11 h-11",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

/**
 * ShadowUnitAvatar - Renders a permanent, non-editable shadow unit image
 * Images are static game assets that persist across all sessions
 */
export default function ShadowUnitAvatar({ 
  name, 
  isUnlocked = false, 
  size = "md",
  showFallback = true 
}: ShadowUnitAvatarProps) {
  const shadow = getShadowByName(name);
  const imageKey = shadow?.imageKey || name.toLowerCase().replace(/\s+/g, "_");
  const imagePath = getShadowImage(imageKey);
  
  const [imageError, setImageError] = React.useState(false);

  // Get the first letter for fallback display
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={`
        rounded-full flex items-center justify-center overflow-hidden
        ${sizeClasses[size]}
        ${isUnlocked 
          ? "border-2 border-system-blue2 shadow-blue-glow bg-gradient-to-b from-system-blue/20 to-black" 
          : "border-2 border-gray-700 bg-[#121b24] opacity-60"
        }
      `}
    >
      {!imageError ? (
        <img
          src={imagePath}
          alt={name}
          className={`${sizeClasses[size]} object-cover rounded-full`}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : showFallback ? (
        <span className={`font-orbitron font-bold ${isUnlocked ? "text-system-blue2" : "text-gray-500"} ${size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-lg"}`}>
          {initial}
        </span>
      ) : null}
    </div>
  );
}
