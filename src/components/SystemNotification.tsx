
import React from "react";

type SystemNotificationProps = {
  open: boolean;
  message: React.ReactNode;
  onClose?: () => void;
  // Optionally allow "success", "warning", "error" etc. for future
  tone?: "default" | "error" | "success";
};

export default function SystemNotification({
  open,
  message,
  onClose,
  tone = "default"
}: SystemNotificationProps) {
  if (!open) return null;

  let borderColor = "border-system-blue";
  if (tone === "error") borderColor = "border-red-600";
  if (tone === "success") borderColor = "border-system-blue2";

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 animate-fade-in">
      <div
        className={`relative min-w-[320px] max-w-lg px-8 py-7 system-panel system-panel-glow rounded-xl border-2 ${borderColor} shadow-blue-glow flex flex-col items-center gap-4`}
        style={{
          boxShadow: "0 0 32px 10px #00d4ff77, 0 0 72px 18px #0080ff86, 0 0 18px 3px #0af",
          animation: "fade-in 0.18s cubic-bezier(.7,0,.35,1)"
        }}
      >
        <span className="uppercase text-system-blue2 text-xs font-orbitron tracking-widest mb-1">
          The System says...
        </span>
        <div className="text-lg text-white font-orbitron text-center">
          {message}
        </div>
        {onClose && (
          <button
            className="mt-3 glow-button text-base"
            onClick={onClose}
            autoFocus
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
}
