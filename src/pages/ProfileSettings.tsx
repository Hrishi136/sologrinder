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

interface AvatarOption {
  id: number;
  slot_number: number;
  avatar_url: string | null;
}

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    bio: "",
    avatar_url: ""
  });
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [avatarOptions, setAvatarOptions] = useState<AvatarOption[]>([]);

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

      // Load avatar options from database
      const { data: avatars, error: avatarsError } = await supabase
        .from('avatar_options')
        .select('*')
        .order('slot_number');

      if (avatarsError) {
        console.error('Error loading avatar options:', avatarsError);
      } else if (avatars) {
        setAvatarOptions(avatars);
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

      const defaultAvatarUrl = avatars?.[0]?.avatar_url || "";

      if (existingProfile) {
        setProfile({
          username: existingProfile.username || "",
          bio: existingProfile.bio || "",
          avatar_url: existingProfile.avatar_url || defaultAvatarUrl
        });
        setSelectedAvatar(existingProfile.avatar_url || defaultAvatarUrl);
      } else {
        // Create a default profile row
        const defaultProfile = {
          user_id: user.id,
          username: user.email?.split('@')[0] || 'Hunter',
          bio: '',
          avatar_url: defaultAvatarUrl
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
            
            {/* Live Preview Box */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0a] border-2 border-system-blue/50 rounded-xl p-6 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
              <h2 className="text-xl sm:text-2xl font-semibold text-system-blue mb-4 flex items-center gap-2">
                Profile Preview
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={selectedAvatar}
                    alt="Selected Avatar"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-system-blue shadow-[0_0_20px_rgba(0,212,255,0.5)]"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div>
                    <p className="text-sm text-system-blue/70">Hunter Name</p>
                    <p className="text-xl sm:text-2xl font-bold text-system-blue">
                      {profile.username || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-system-blue/70">Bio</p>
                    <p className="text-base text-white/80">
                      {profile.bio || 'No bio yet...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar Selection Section */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-system-blue flex items-center gap-2">
                Choose Your Avatar
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
                {avatarOptions.map((avatar) => (
                  <div key={avatar.id} className="relative">
                    <div
                      onClick={() => {
                        if (avatar.avatar_url) {
                          handleAvatarSelect(avatar.avatar_url);
                        }
                      }}
                      className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                        avatar.avatar_url && selectedAvatar === avatar.avatar_url
                          ? 'border-system-blue shadow-[0_0_20px_rgba(0,212,255,0.6)]'
                          : 'border-white/20 hover:border-system-blue/50'
                      } ${!avatar.avatar_url ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      {avatar.avatar_url ? (
                        <>
                          <img
                            src={avatar.avatar_url}
                            alt={`Avatar ${avatar.slot_number}`}
                            loading="lazy"
                            className="w-full aspect-square object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                          />
                          {selectedAvatar === avatar.avatar_url && (
                            <div className="absolute inset-0 bg-system-blue/20 flex items-center justify-center">
                              <div className="bg-system-blue rounded-full p-1.5">
                                <Check className="h-5 w-5 text-black" />
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full aspect-square bg-[#1a1a2e] flex items-center justify-center">
                          <p className="text-xs text-white/20">Empty Slot</p>
                        </div>
                      )}
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