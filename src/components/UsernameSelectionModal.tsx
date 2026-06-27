import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SystemPanel from "./SystemPanel";
import { X } from "lucide-react";

interface UsernameSelectionModalProps {
  open: boolean;
  onComplete: (username: string) => void;
}

export default function UsernameSelectionModal({ open, onComplete }: UsernameSelectionModalProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Hunter name is required");
      return;
    }

    if (username.length < 3) {
      setError("Hunter name must be at least 3 characters");
      return;
    }

    if (username.length > 20) {
      setError("Hunter name must be 20 characters or less");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Authentication error. Please try logging in again.");
        return;
      }

      // Use upsert to handle cases where a partial profile might exist
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username: username.trim(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (upsertError) {
        if (upsertError.code === '23505') { // Unique constraint violation on username
          setError("This Hunter name is already taken. Choose another one.");
        } else {
          console.error('Profile upsert error:', upsertError);
          setError("Failed to save Hunter name. Please try again.");
        }
        return;
      }

      onComplete(username.trim());
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="particle-bg">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle-dot"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${12 + Math.random() * 16}px`,
              height: `${12 + Math.random() * 16}px`,
              animationDelay: `${-Math.random() * 8}s`,
              opacity: 0.15 + Math.random() * 0.1,
              bottom: `${Math.random() * 20}vh`,
            }}
          />
        ))}
      </div>
      
      <SystemPanel className="max-w-md w-full px-6 py-8 relative z-10" glow>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-orbitron text-system-blue text-center mb-2 drop-shadow-[0_2px_16px_#00d4ffcc] tracking-wider">
            CHOOSE YOUR HUNTER NAME
          </h2>
          <p className="text-system-blue2 text-sm">
            This will be your unique identity in the Shadow System
          </p>
        </div>

        {error && (
          <div className="bg-red-900 bg-opacity-60 text-red-300 text-sm font-semibold px-4 py-2 rounded mb-4 border border-red-700 animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="bg-[#191e26] border border-system-blue/70 text-system-blue focus:ring-2 focus:ring-system-blue2 rounded px-4 py-3 placeholder:text-system-blue2/60 outline-none w-full text-lg font-inter"
            placeholder="Enter Hunter Name"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
            required
            autoFocus
          />
          
          <button 
            type="submit" 
            className="glow-button uppercase tracking-wider w-full"
            disabled={loading}
          >
            {loading ? "REGISTERING..." : "CLAIM HUNTER NAME"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-system-blue2/80">
          • 3-20 characters only<br/>
          • Name must be unique across all Hunters
        </div>
      </SystemPanel>
    </div>
  );
}