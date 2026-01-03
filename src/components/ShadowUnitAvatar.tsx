import React, { useRef } from "react";
import { getShadowImage, getShadowByName } from "@/constants/shadowArmy";
import { Camera } from "lucide-react";

interface ShadowUnitAvatarProps {
  name: string;
  isUnlocked?: boolean;
  size?: "sm" | "md" | "lg";
  showFallback?: boolean;
  permanentImage?: string | null;
  onImageUpload?: (name: string, imageDataUrl: string) => void;
  isLocked?: boolean; // True if image is already set and cannot be changed
}

const sizeClasses = {
  sm: "w-11 h-11",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

/**
 * ShadowUnitAvatar - Renders shadow unit with one-time upload capability
 * Once an image is uploaded, it becomes permanent and cannot be changed
 */
export default function ShadowUnitAvatar({ 
  name, 
  isUnlocked = false, 
  size = "md",
  showFallback = true,
  permanentImage,
  onImageUpload,
  isLocked = false
}: ShadowUnitAvatarProps) {
  const shadow = getShadowByName(name);
  const imageKey = shadow?.imageKey || name.toLowerCase().replace(/\s+/g, "_");
  const defaultImagePath = getShadowImage(imageKey);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imageError, setImageError] = React.useState(false);

  // Use permanent image if available, otherwise fall back to default
  const imagePath = permanentImage || defaultImagePath;

  const initial = name.charAt(0).toUpperCase();

  const handleClick = () => {
    // Only allow upload if: unlocked, not locked, and has upload handler
    if (isUnlocked && !isLocked && onImageUpload && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onImageUpload(name, dataUrl);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = "";
  };

  const canUpload = isUnlocked && !isLocked && !permanentImage && onImageUpload;

  return (
    <div
      className={`
        relative rounded-full flex items-center justify-center overflow-hidden
        ${sizeClasses[size]}
        ${isUnlocked 
          ? "border-2 border-system-blue2 shadow-blue-glow bg-gradient-to-b from-system-blue/20 to-black" 
          : "border-2 border-gray-700 bg-[#121b24] opacity-60"
        }
        ${canUpload ? "cursor-pointer hover:opacity-80" : ""}
      `}
      onClick={handleClick}
    >
      {permanentImage ? (
        // Permanent user-uploaded image
        <img
          src={permanentImage}
          alt={name}
          className={`${sizeClasses[size]} object-cover rounded-full`}
          loading="lazy"
        />
      ) : !imageError ? (
        // Default static image
        <img
          src={imagePath}
          alt={name}
          className={`${sizeClasses[size]} object-cover rounded-full`}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : showFallback ? (
        // Fallback with initial
        <span className={`font-orbitron font-bold ${isUnlocked ? "text-system-blue2" : "text-gray-500"} ${size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-lg"}`}>
          {initial}
        </span>
      ) : null}

      {/* Upload indicator - only shown if upload is allowed */}
      {canUpload && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
          <Camera className="w-5 h-5 text-system-blue2" />
        </div>
      )}

      {/* Hidden file input */}
      {onImageUpload && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}
    </div>
  );
}
