import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  username: string;
  bio: string;
  avatar_url: string;
}

const avatarOptions = [
  {
    id: "sung-jinwoo",
    name: "Sung Jinwoo",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop"
  },
  {
    id: "cha-haein",
    name: "Cha Hae-In",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop"
  },
  {
    id: "go-gunhee",
    name: "Go Gun-Hee",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
  },
  {
    id: "beru",
    name: "Beru",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
  },
  {
    id: "thomas-andre",
    name: "Thomas Andre",
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop"
  },
  {
    id: "querehsha",
    name: "Querehsha",
    url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop"
  },
  {
    id: "yoo-jinho",
    name: "Yoo Jinho",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop"
  }
];

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    bio: "",
    avatar_url: avatarOptions[0].url
  });
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].url);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    console.time('profile_load');
    setLoadError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('[Profile] auth.getUser ->', !!user);
      if (!user) {
        navigate('/login');
        return;
      }

      // Try to get existing profile
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        setLoadError('Failed to load profile.');
        return;
      }

      if (existingProfile) {
        setProfile({
          username: existingProfile.username || "",
          bio: existingProfile.bio || "",
          avatar_url: existingProfile.avatar_url || avatarOptions[0].url
        });
        setSelectedAvatar(existingProfile.avatar_url || avatarOptions[0].url);
      } else {
        // Create a default profile row so later screens can rely on it existing
        const defaultProfile = {
          user_id: user.id,
          username: user.email?.split('@')[0] || 'Hunter',
          bio: '',
          avatar_url: avatarOptions[0].url
        };
        const { error: upsertErr } = await supabase
          .from('profiles')
          .upsert(defaultProfile, { onConflict: 'user_id' });
        if (upsertErr) {
          console.error('Error creating default profile:', upsertErr);
          setLoadError('Failed to initialize profile.');
          return;
        }
        setProfile({
          username: defaultProfile.username,
          bio: defaultProfile.bio,
          avatar_url: defaultProfile.avatar_url
        });
        setSelectedAvatar(defaultProfile.avatar_url);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoadError('Failed to load profile.');
    } finally {
      console.timeEnd('profile_load');
      setLoading(false);
    }
  };


  const handleSaveProfile = async () => {
    if (!profile.username.trim()) {
      toast.error("Hunter Name is required!");
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username: profile.username,
          bio: profile.bio,
          avatar_url: selectedAvatar,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) {
        toast.error("Failed to save profile");
        console.error('Error saving profile:', error);
      } else {
        toast.success("Profile saved successfully!");
        setProfile(prev => ({ ...prev, avatar_url: selectedAvatar }));
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSelect = (url: string) => {
    setSelectedAvatar(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-system-bg flex items-center justify-center">
        <div className="text-system-blue text-xl font-orbitron">Loading Profile...</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-system-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-white/80">Something went wrong loading your profile.</div>
          <Button
            onClick={() => { setLoading(true); loadProfile(); }}
            className="bg-system-blue text-black hover:bg-system-blue/80"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-system-bg font-orbitron overflow-x-hidden">
      {/* Background Effects */}
      <div className="particle-bg pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="particle-dot"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${10 + Math.random() * 6}px`,
              height: `${10 + Math.random() * 6}px`,
              animationDelay: `${-Math.random() * 8}s`,
              opacity: 0.15,
              bottom: `${Math.random() * 50}vh`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outline"
          className="mb-6 sm:mb-8 flex items-center gap-2 text-system-blue border-system-blue hover:bg-system-blue/10 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Button>

        {/* Main Content Container */}
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-system-blue drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]">
              Hunter Profile
            </h1>
            <p className="text-white/70 text-sm sm:text-base">
              Customize your Solo Grinder identity
            </p>
          </div>

          {/* Profile Card */}
          <div className="w-full bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] border-2 border-system-blue/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,212,255,0.2)] space-y-8">
            
            {/* Avatar Selection Section */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-system-blue flex items-center gap-2">
                Choose Your Avatar
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
                {avatarOptions.map((avatar) => (
                  <div
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar.url)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedAvatar === avatar.url
                        ? 'border-system-blue shadow-[0_0_20px_rgba(0,212,255,0.6)]'
                        : 'border-white/20 hover:border-system-blue/50'
                    }`}
                  >
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      loading="lazy"
                      className="w-full aspect-square object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                    {selectedAvatar === avatar.url && (
                      <div className="absolute inset-0 bg-system-blue/20 flex items-center justify-center">
                        <div className="bg-system-blue rounded-full p-1.5">
                          <Check className="h-5 w-5 text-black" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-white text-xs sm:text-sm font-medium text-center truncate">
                        {avatar.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-system-blue">
                Hunter Details
              </h2>
              
              {/* Hunter Name Input */}
              <div className="space-y-2">
                <label className="text-[#00BFFF] text-sm sm:text-base font-medium block">
                  Hunter Name
                </label>
                <Input
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="Enter your hunter name"
                  className="bg-[#1E1E1E] border-2 border-system-blue/40 text-[#00BFFF] placeholder:text-[#00BFFF]/40 focus:border-system-blue focus:ring-2 focus:ring-system-blue/20 rounded-lg text-base sm:text-lg h-12"
                />
              </div>

              {/* Bio Textarea */}
              <div className="space-y-2">
                <label className="text-[#00BFFF] text-sm sm:text-base font-medium block">
                  Bio / Description
                </label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell your story as a hunter..."
                  className="bg-[#1E1E1E] border-2 border-system-blue/40 text-[#00BFFF] placeholder:text-[#00BFFF]/40 focus:border-system-blue focus:ring-2 focus:ring-system-blue/20 rounded-lg text-base sm:text-lg min-h-[120px] resize-none"
                  rows={5}
                />
              </div>
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full sm:w-auto px-8 sm:px-12 py-6 text-lg font-bold bg-gradient-to-r from-system-blue to-[#00BFFF] text-black hover:shadow-[0_0_25px_rgba(0,212,255,0.6)] transition-all duration-300 rounded-lg disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}