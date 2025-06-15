
import React from "react";

type LogItem = {
  message: string,
  timestamp: string,
  type?: "info" | "warning" | "achievement"
}

export default function SystemLog({ logs, onClear }: { logs: LogItem[], onClear: () => void }) {
  return (
    <div className="system-panel mt-8 max-w-3xl mx-auto bg-black/80 border-system-blue2 border-2 rounded-lg shadow-lg p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="font-orbitron text-system-blue2 text-lg">System Log</div>
        <button
          className="text-xs text-system-blue underline hover:text-white transition hover:scale-105 active:scale-95"
          onClick={onClear}
        >
          Clear Log
        </button>
      </div>
      <div className="max-h-[160px] overflow-y-auto px-1">
        {logs.length === 0 && (
          <div className="text-xs text-gray-400 text-center">No recent messages.</div>
        )}
        {logs.slice(-10).reverse().map((log, i) => (
          <div key={i} className={`flex items-start gap-2 py-1`}>
            <span className={`text-xs font-mono ${log.type === "warning" ? "text-red-400" : log.type === "achievement" ? "text-green-400" : "text-system-blue2"}`}>
              [{log.timestamp}]
            </span>
            <span className={`text-xs ${log.type === "warning" ? "text-red-400 font-bold" : log.type === "achievement" ? "text-green-400" : "text-system-blue2"}`}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
