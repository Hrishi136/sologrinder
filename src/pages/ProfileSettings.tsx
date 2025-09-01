import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Upload, Check, AlertCircle } from 'lucide-react';
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

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
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

  const checkUsernameUniqueness = async (username: string) => {
    if (!username.trim() || username === profile.username) {
      setUsernameError('');
      return true;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.trim())
        .neq('user_id', user?.id || '')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking username:', error);
        return true; // Allow if we can't check
      }

      if (data) {
        setUsernameError('Hunter name is already taken');
        return false;
      }

      setUsernameError('');
      return true;
    } catch (error) {
      console.error('Error checking username:', error);
      return true; // Allow if we can't check
    }
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setProfile(prev => ({ ...prev, username: newUsername }));
    
    // Debounce username check
    setTimeout(() => {
      checkUsernameUniqueness(newUsername);
    }, 500);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload image');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile.username.trim()) {
      toast.error('Hunter name is required');
      return;
    }

    if (usernameError) {
      toast.error('Please fix the username error');
      return;
    }

    const isUnique = await checkUsernameUniqueness(profile.username);
    if (!isUnique) {
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
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
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
            Profile Settings
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
            <CardContent className="space-y-4">
              {/* Upload Custom Image */}
              <div className="border-2 border-dashed border-system-blue2/50 rounded-lg p-4">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-system-blue2 mx-auto mb-2" />
                  <p className="text-white/80 text-sm mb-2">Upload Custom Avatar</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="avatar-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-system-blue/20 border border-system-blue2 rounded-lg text-white text-sm cursor-pointer hover:bg-system-blue/30 transition-colors"
                  >
                    {uploading ? 'Uploading...' : 'Choose File'}
                  </label>
                  <p className="text-white/60 text-xs mt-1">Max 5MB, JPG/PNG</p>
                </div>
              </div>

              {/* Preset Avatars */}
              <div>
                <p className="text-white/80 text-sm mb-3">Or choose from presets:</p>
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
                  onChange={handleUsernameChange}
                  placeholder="Enter your hunter name"
                  className="bg-system-dark border-system-blue2 text-white"
                  maxLength={50}
                />
                {usernameError && (
                  <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
                    <AlertCircle className="h-3 w-3" />
                    {usernameError}
                  </div>
                )}
                {!usernameError && profile.username && profile.username !== '' && (
                  <div className="flex items-center gap-1 mt-1 text-green-400 text-sm">
                    <Check className="h-3 w-3" />
                    Hunter name is available
                  </div>
                )}
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
              disabled={saving || !profile.username.trim() || !!usernameError}
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