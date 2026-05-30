import React from "react";
import { getShadowImage, getShadowByName } from "@/constants/shadowArmy";

interface ShadowUnitAvatarProps {
  name: string;
  isUnlocked?: boolean;
  size?: "sm" | "md" | "lg";
  showFallback?: boolean;
  permanentImage?: string | null;
}

const sizeClasses = {
  sm: "w-11 h-11",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

/**
 * ShadowUnitAvatar - Renders shadow unit with permanent image from backend
 * Images are permanent game assets and cannot be changed by users
 */
export default function ShadowUnitAvatar({
  name,
  isUnlocked = false,
  size = "md",
  showFallback = true,
  permanentImage
}: ShadowUnitAvatarProps) {
  const shadow = getShadowByName(name);
  const imageKey = shadow?.imageKey || name.toLowerCase().replace(/\s+/g, "_");
  const defaultImagePath = getShadowImage(imageKey);

  const [imageError, setImageError] = React.useState(false);

  // Use permanent image if available, otherwise fall back to default static
  // Try multiple variations of the shadow name for lookups
  const imagePath = permanentImage || defaultImagePath;

  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={`
        relative rounded-full flex items-center justify-center overflow-hidden
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
