import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShadowUnitAvatar from "./ShadowUnitAvatar";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

interface ShadowUnlockCeremonyProps {
  shadowName: string;
  tier: number;
  permanentImage?: string | null;
  onComplete: () => void;
}

const PARTICLE_COLORS = [
  "#00d4ff", // system-blue
  "#0ea5e9", // system-blue2
  "#8b5cf6", // purple
  "#22d3ee", // cyan
  "#60a5fa", // lighter blue
];

const TIER_COLORS: Record<number, string> = {
  1: "#60a5fa",
  2: "#22d3ee",
  3: "#a855f7",
  4: "#fbbf24",
};

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    delay: Math.random() * 0.5,
  }));
}

// Unlock sound effect using Web Audio API
function playUnlockSound(tier: number) {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for main tone
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Frequency based on tier (higher tier = more epic)
    const baseFreq = 200 + tier * 100;
    oscillator.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 2, audioCtx.currentTime + 0.3);
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.8);
    
    // Add shimmer effect for higher tiers
    if (tier >= 2) {
      const shimmer = audioCtx.createOscillator();
      const shimmerGain = audioCtx.createGain();
      shimmer.connect(shimmerGain);
      shimmerGain.connect(audioCtx.destination);
      
      shimmer.frequency.setValueAtTime(baseFreq * 3, audioCtx.currentTime + 0.1);
      shimmer.frequency.exponentialRampToValueAtTime(baseFreq * 4, audioCtx.currentTime + 0.4);
      shimmer.type = "triangle";
      
      shimmerGain.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.1);
      shimmerGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      
      shimmer.start(audioCtx.currentTime + 0.1);
      shimmer.stop(audioCtx.currentTime + 0.6);
    }
    
    // Add deep bass for tier 4
    if (tier === 4) {
      const bass = audioCtx.createOscillator();
      const bassGain = audioCtx.createGain();
      bass.connect(bassGain);
      bassGain.connect(audioCtx.destination);
      
      bass.frequency.setValueAtTime(80, audioCtx.currentTime);
      bass.type = "sine";
      
      bassGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
      
      bass.start(audioCtx.currentTime);
      bass.stop(audioCtx.currentTime + 1.2);
    }
  } catch (e) {
    console.log("Audio not available");
  }
}

export default function ShadowUnlockCeremony({
  shadowName,
  tier,
  permanentImage,
  onComplete,
}: ShadowUnlockCeremonyProps) {
  const [particles] = useState(() => generateParticles(tier >= 4 ? 60 : tier >= 3 ? 45 : 30));
  const [phase, setPhase] = useState<"entering" | "reveal" | "particles" | "complete">("entering");

  useEffect(() => {
    // Play sound on mount
    playUnlockSound(tier);
    
    const timers = [
      setTimeout(() => setPhase("reveal"), 300),
      setTimeout(() => setPhase("particles"), 800),
      setTimeout(() => setPhase("complete"), 2500),
      setTimeout(onComplete, 3500),
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [tier, onComplete]);

  const tierColor = TIER_COLORS[tier] || TIER_COLORS[1];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Dark overlay */}
        <motion.div
          className="absolute inset-0 bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {phase !== "entering" &&
            particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.5, 1, 0],
                  y: [0, -100 - Math.random() * 200],
                  x: [0, (Math.random() - 0.5) * 100],
                }}
                transition={{
                  duration: 2,
                  delay: p.delay,
                  ease: "easeOut",
                }}
              />
            ))}
        </div>

        {/* Central glow ring */}
        {phase !== "entering" && (
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: `radial-gradient(circle, ${tierColor}40 0%, transparent 70%)`,
              boxShadow: `0 0 60px ${tierColor}, 0 0 120px ${tierColor}60`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2, 1.5], opacity: [0, 0.8, 0.4] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}

        {/* Expanding rings */}
        {phase !== "entering" &&
          [0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full border-2"
              style={{ borderColor: tierColor }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 1.5, delay, ease: "easeOut" }}
            />
          ))}

        {/* Shadow Avatar */}
        <motion.div
          className="relative z-10"
          initial={{ scale: 0, rotateY: 180 }}
          animate={
            phase === "entering"
              ? { scale: 0.5, rotateY: 180 }
              : phase === "reveal"
              ? { scale: 1.2, rotateY: 0 }
              : { scale: 1, rotateY: 0 }
          }
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 200,
          }}
        >
          <div
            className="p-2 rounded-full"
            style={{
              boxShadow: `0 0 40px ${tierColor}, 0 0 80px ${tierColor}80`,
            }}
          >
            <ShadowUnitAvatar
              name={shadowName}
              isUnlocked={true}
              size="lg"
              permanentImage={permanentImage}
            />
          </div>
        </motion.div>

        {/* Shadow name */}
        <motion.div
          className="absolute bottom-1/3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={phase !== "entering" ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            className="font-orbitron text-2xl font-bold mb-2"
            style={{ color: tierColor, textShadow: `0 0 20px ${tierColor}` }}
            animate={phase === "particles" ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3, repeat: 2 }}
          >
            {shadowName}
          </motion.div>
          <motion.div
            className="text-system-blue2 text-sm font-orbitron"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            SHADOW UNLOCKED
          </motion.div>
          <motion.div
            className="flex justify-center gap-1 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {Array.from({ length: tier }).map((_, i) => (
              <motion.span
                key={i}
                className="text-yellow-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                ★
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Click to dismiss */}
        <motion.button
          className="absolute bottom-10 text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "complete" ? 1 : 0 }}
          onClick={onComplete}
        >
          Tap to continue
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
