import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id?: string;
  user_id: string;
  username: string;
  bio: string;
  avatar_url: string;
}

const avatarOptions = [
  { id: 1, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hunter1', name: 'Hunter Alpha' },
  { id: 2, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hunter2', name: 'Hunter Beta' },
  { id: 3, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hunter3', name: 'Hunter Gamma' },
  { id: 4, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hunter4', name: 'Hunter Delta' },
  { id: 5, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hunter5', name: 'Hunter Epsilon' },
  { id: 6, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hunter6', name: 'Hunter Zeta' },
  { id: 7, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hunter7', name: 'Hunter Eta' },
  { id: 8, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hunter8', name: 'Hunter Theta' },
];

export default function ProfileCustomization() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    user_id: '',
    username: '',
    bio: '',
    avatar_url: avatarOptions[0].url
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
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
        toast.error('Failed to load profile');
        return;
      }

      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        // Set default values for new profile
        setProfile(prev => ({
          ...prev,
          user_id: user.id,
          username: user.email?.split('@')[0] || 'Hunter'
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile.username.trim()) {
      toast.error('Hunter name is required');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const profileData = {
        user_id: user.id,
        username: profile.username.trim(),
        bio: profile.bio.trim(),
        avatar_url: profile.avatar_url
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving profile:', error);
        toast.error('Failed to save profile');
        return;
      }

      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-system-blue">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-system-dark via-[#0a0a0a] to-system-darker"></div>
      <div className="fixed top-20 left-20 w-72 h-72 bg-system-blue/20 rounded-full blur-3xl"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-system-blue2/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-system-blue hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white font-orbitron">
            Profile Customization
          </h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Current Avatar Display */}
          <Card className="system-panel border-system-blue2">
            <CardHeader>
              <CardTitle className="text-system-blue font-orbitron flex items-center gap-2">
                <User className="h-5 w-5" />
                Current Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-system-blue2">
                <img 
                  src={profile.avatar_url} 
                  alt="Current avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-semibold">{profile.username || 'Hunter'}</h3>
                <p className="text-white/60 text-sm">{profile.bio || 'No bio set'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Avatar Selection */}
          <Card className="system-panel border-system-blue2">
            <CardHeader>
              <CardTitle className="text-system-blue font-orbitron">
                Choose Avatar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar.url)}
                    className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                      profile.avatar_url === avatar.url
                        ? 'border-system-blue shadow-blue-glow'
                        : 'border-system-blue2/50 hover:border-system-blue2'
                    }`}
                  >
                    <img 
                      src={avatar.url} 
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="system-panel border-system-blue2">
            <CardHeader>
              <CardTitle className="text-system-blue font-orbitron">
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-system-blue mb-2">
                  Hunter Name *
                </label>
                <Input
                  value={profile.username}
                  onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your hunter name"
                  className="bg-system-dark border-system-blue2 text-white"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-system-blue mb-2">
                  Bio / Description
                </label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell other hunters about yourself..."
                  className="bg-system-dark border-system-blue2 text-white min-h-[100px]"
                  maxLength={200}
                />
                <p className="text-sm text-white/60 mt-1">
                  {profile.bio.length}/200 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSaveProfile}
              disabled={saving || !profile.username.trim()}
              className="glow-button flex items-center gap-2 px-8 py-3"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}