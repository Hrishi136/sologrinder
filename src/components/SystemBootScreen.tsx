
import React, { useEffect, useState } from "react";

/**
 * SystemBootScreen - Dramatic glowy system boot animation overlay.
 * Props:
 * - onBootComplete: called when boot sequence ends
 * - duration: ms for boot animation (default 2200)
 */
export default function SystemBootScreen({
  onBootComplete,
  duration = 2200
}: {
  onBootComplete?: () => void;
  duration?: number;
}) {
  const [phase, setPhase] = useState<"init" | "fadeout">("init");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("fadeout");
      setTimeout(() => {
        if (onBootComplete) onBootComplete();
      }, 400); // match fade
    }, duration);
    return () => clearTimeout(timer);
  }, [onBootComplete, duration]);

  return (
    <div
      className={`fixed z-[9999] inset-0 flex items-center justify-center bg-black/85 transition-opacity duration-500 ${
        phase === "fadeout" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Blue particles (over the black bg) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 90}%`,
              width: `${16 + Math.random() * 32}px`,
              height: `${16 + Math.random() * 32}px`,
              background:
                "linear-gradient(90deg, #00d4ff 0%, #0080ff 100%)",
              opacity: 0.14 + Math.random() * 0.14,
              filter: "blur(2px)",
              animation:
                "float-particle 16s linear infinite alternate",
              animationDelay: `${-Math.random() * 12}s`,
              zIndex: 1
            }}
          />
        ))}
      </div>
      {/* System window */}
      <div className="relative z-10">
        <div className="min-w-[360px] max-w-lg px-9 py-8 system-panel system-panel-glow shadow-blue-glow rounded-xl animate-fade-in flex flex-col items-center gap-5 border-2 border-system-blue"
          style={{
            boxShadow:
              "0 0 32px 10px #00d4ff77, 0 0 72px 18px #0080ff86, 0 0 18px 3px #0af"
          }}
        >
          <span className="uppercase text-system-blue2 text-sm font-orbitron tracking-widest mb-2 animate-fade-in">
            The System says...
          </span>
          <span className="font-orbitron text-3xl md:text-4xl text-system-blue font-extrabold tracking-wider animate-fade-in">
            System Initializing
          </span>
          <div className="w-full mt-6">
            <div className="overflow-hidden rounded-full h-3 bg-[#191e26] border border-system-blue2/60 shadow-inner relative">
              <div className="h-full bg-gradient-to-r from-system-blue2 to-system-blue animate-[progressPulse_2.2s_cubic-bezier(0.6,0.04,0.98,0.335)_forwards] w-0"
                style={{
                  animationDelay: "0.2s",
                  animationFillMode: 'forwards'
                }} />
            </div>
          </div>
          <span className="text-system-blue2 font-bold mt-3 text-lg animate-fade-in" style={{animationDelay:"0.4s"}}>Initializing... Please wait</span>
        </div>
      </div>
      {/* keyframes for boot progress bar */}
      <style>{`
        @keyframes progressPulse {
          from { width: 0%; }
          82% { width: 72%; }
          to { width: 100%; }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) scale(1);}
          100% { transform: translateY(-50vh) scale(1.3);}
        }
      `}</style>
    </div>
  );
}
