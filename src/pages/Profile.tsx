import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHunterProgression } from "../hooks/useHunterProgression";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Palette, Bell, Settings, Crown, Quote, Camera, Clock, Zap, LogOut } from "lucide-react";

interface UserProfile {
  hunterName: string;
  title: string;
  motto: string;
  bio: string;
  avatar: string;
  theme: 'classic-blue' | 'shadow-red' | 'monarch-gold';
  questPreferences: {
    priorityType: 'balanced' | 'easy' | 'medium' | 'hard';
    categories: string[];
  };
  notifications: {
    dailyReminder: boolean;
    reminderTime: string;
    streakMilestones: boolean;
    emergencyQuests: boolean;
    achievements: boolean;
    systemMessages: boolean;
    motivationalQuotes: boolean;
    quoteFrequency: 'daily' | 'weekly' | 'never';
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const { currentRank, powerLevel, totalQuests, streak } = useHunterProgression();
  
  const [profile, setProfile] = useState<UserProfile>({
    hunterName: "Shadow Hunter",
    title: currentRank?.name || "E-Rank",
    motto: "The shadows guide my path to strength",
    bio: "A mysterious hunter walking the path of shadows...",
    avatar: "photo-1582562124811-c09040d0a901",
    theme: 'classic-blue',
    questPreferences: {
      priorityType: 'balanced',
      categories: ['Combat', 'Intelligence', 'Agility']
    },
    notifications: {
      dailyReminder: true,
      reminderTime: "09:00",
      streakMilestones: true,
      emergencyQuests: true,
      achievements: true,
      systemMessages: true,
      motivationalQuotes: true,
      quoteFrequency: 'daily'
    }
  });

  const avatarOptions = [
    { id: "photo-1582562124811-c09040d0a901", name: "Shadow Hunter", description: "Orange cat with mysterious aura" },
    { id: "photo-1472396961693-142e6e269027", name: "Forest Guardian", description: "Deer in mystical forest" },
    { id: "photo-1535268647677-300dbf3d78d1", name: "Young Warrior", description: "Grey kitten hunter" },
    { id: "photo-1441057206919-63d19fac2369", name: "Ice Guardian", description: "Penguins on frozen peak" },
    { id: "photo-1501286353178-1ec881214838", name: "Jungle Hunter", description: "Monkey in natural habitat" },
    { id: "photo-1574158622682-e40e69881006", name: "Night Stalker", description: "Black cat in shadows" },
    { id: "photo-1425082661705-1834bfd09dca", name: "Mountain Guardian", description: "Fox in winter landscape" },
    { id: "photo-1518717758536-85ae29035b6d", name: "Golden Hunter", description: "Golden retriever warrior" }
  ];

  const themeOptions = [
    { id: 'classic-blue', name: 'Classic Blue', description: 'Original shadow monarch theme', color: '#00d4ff' },
    { id: 'shadow-red', name: 'Shadow Red', description: 'Crimson power theme', color: '#ff4757' },
    { id: 'monarch-gold', name: 'Monarch Gold', description: 'Royal golden theme', color: '#ffa502' }
  ];

  const questCategories = [
    'Combat', 'Intelligence', 'Agility', 'Vitality', 'Stealth', 'Magic', 'Survival', 'Leadership'
  ];

  const motivationalQuotes = [
    "The shadows remember what the light forgets.",
    "Power without purpose is meaningless.",
    "Every quest completed makes you stronger.",
    "The path to strength is paved with determination.",
    "In darkness, we find our true potential."
  ];

  useEffect(() => {
    const loadProfile = async () => {
      // Try to load from Supabase first
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (profileData) {
            setProfile(prev => ({
              ...prev,
              hunterName: profileData.username || prev.hunterName,
              bio: profileData.bio || prev.bio,
              avatar: profileData.avatar_url || prev.avatar,
            }));
          }
        }
      } catch (error) {
        console.log('No profile found in database, using defaults');
      }
      
      // Fallback to localStorage
      const savedProfile = localStorage.getItem('hunterProfile');
      if (savedProfile) {
        const localProfile = JSON.parse(savedProfile);
        setProfile(prev => ({ ...prev, ...localProfile }));
      }
    };
    
    loadProfile();
  }, []);

  const saveProfile = async () => {
    try {
      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            username: profile.hunterName,
            bio: profile.bio,
            avatar_url: profile.avatar,
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          console.error('Error saving profile:', error);
        }
      }
    } catch (error) {
      console.error('Error saving to database:', error);
    }
    
    // Also save to localStorage as backup
    localStorage.setItem('hunterProfile', JSON.stringify(profile));
    // Apply theme changes
    document.documentElement.setAttribute('data-theme', profile.theme);
    
    // Show success message
    const notification = document.createElement('div');
    notification.textContent = 'Profile saved successfully!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #00d4ff;
      color: black;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateNotifications = (updates: Partial<UserProfile['notifications']>) => {
    setProfile(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates }
    }));
  };

  const toggleQuestCategory = (category: string) => {
    setProfile(prev => ({
      ...prev,
      questPreferences: {
        ...prev.questPreferences,
        categories: prev.questPreferences.categories.includes(category)
          ? prev.questPreferences.categories.filter(c => c !== category)
          : [...prev.questPreferences.categories, category]
      }
    }));
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-system-bg font-orbitron">
      {/* Particle background */}
      <div className="particle-bg pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle-dot"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${12 + Math.random() * 8}px`,
              height: `${12 + Math.random() * 8}px`,
              animationDelay: `${-Math.random() * 8}s`,
              opacity: 0.1 + Math.random() * 0.1,
              bottom: `${Math.random() * 40}vh`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="flex items-center gap-2 text-system-blue border-system-blue hover:bg-system-blue/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex gap-3">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 text-red-400 border-red-400 hover:bg-red-400/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <Button 
              onClick={saveProfile}
              className="bg-system-blue hover:bg-system-blue/80 text-black font-medium"
            >
              Save Profile
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-system-blue mb-2">
            Hunter Profile
          </h1>
          <p className="text-white/80 text-lg">
            Customize your hunter identity and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-system-panel border border-system-blue/30">
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-system-blue data-[state=active]:text-black">
              Profile
            </TabsTrigger>
            <TabsTrigger value="themes" className="text-white data-[state=active]:bg-system-blue data-[state=active]:text-black">
              Themes
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-system-blue data-[state=active]:text-black">
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="system-panel border-system-blue2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-system-blue2" />
                    Hunter Identity
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Customize your hunter name, title, and motto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-white">Hunter Name</Label>
                    <Input
                      value={profile.hunterName}
                      onChange={(e) => updateProfile({ hunterName: e.target.value })}
                      className="bg-white border-system-blue text-black placeholder:text-gray-500"
                      placeholder="Enter your hunter name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Title</Label>
                    <Input
                      value={profile.title}
                      onChange={(e) => updateProfile({ title: e.target.value })}
                      className="bg-white border-system-blue text-black placeholder:text-gray-500"
                      placeholder="Enter your title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <Quote className="h-4 w-4" />
                      Personal Motto
                    </Label>
                    <Textarea
                      value={profile.motto}
                      onChange={(e) => updateProfile({ motto: e.target.value })}
                      className="bg-white border-system-blue text-black placeholder:text-gray-500 resize-none"
                      placeholder="Enter your personal motto or quote"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Bio / Description
                    </Label>
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => updateProfile({ bio: e.target.value })}
                      className="bg-white border-system-blue text-black placeholder:text-gray-500 resize-none"
                      placeholder="Tell others about yourself..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Quest Priority</Label>
                    <Select
                      value={profile.questPreferences.priorityType}
                      onValueChange={(value: any) => updateProfile({
                        questPreferences: { ...profile.questPreferences, priorityType: value }
                      })}
                    >
                      <SelectTrigger className="bg-system-panel border-system-blue text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-system-panel border-system-blue">
                        <SelectItem value="balanced" className="text-white">Balanced</SelectItem>
                        <SelectItem value="easy" className="text-white">Easy Focus</SelectItem>
                        <SelectItem value="medium" className="text-white">Medium Focus</SelectItem>
                        <SelectItem value="hard" className="text-white">Hard Focus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="system-panel border-system-blue2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Camera className="h-5 w-5 text-system-blue2" />
                    Avatar Selection
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Choose your hunter artwork
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {avatarOptions.map((avatar) => (
                      <div
                        key={avatar.id}
                        className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                          profile.avatar === avatar.id
                            ? 'border-system-blue bg-system-blue/20 shadow-lg'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                        onClick={() => updateProfile({ avatar: avatar.id })}
                      >
                        <img
                          src={`https://images.unsplash.com/${avatar.id}?w=120&h=120&fit=crop&crop=faces`}
                          alt={avatar.name}
                          className="w-full h-20 object-cover rounded-lg mb-2"
                        />
                        <div className="text-white text-xs font-medium text-center">{avatar.name}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Current selection preview */}
                  <div className="mt-4 p-3 bg-system-blue/10 rounded-lg border border-system-blue/30">
                    <div className="text-white/80 text-sm mb-2">Selected Avatar:</div>
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://images.unsplash.com/${profile.avatar}?w=80&h=80&fit=crop&crop=faces`}
                        alt="Selected avatar"
                        className="w-12 h-12 object-cover rounded-full"
                      />
                      <div>
                        <div className="text-white font-medium">
                          {avatarOptions.find(a => a.id === profile.avatar)?.name}
                        </div>
                        <div className="text-white/60 text-xs">
                          {avatarOptions.find(a => a.id === profile.avatar)?.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="system-panel border-system-blue2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-system-blue2" />
                  Quest Categories
                </CardTitle>
                <CardDescription className="text-white/60">
                  Select your preferred quest categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {questCategories.map((category) => (
                    <div
                      key={category}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                        profile.questPreferences.categories.includes(category)
                          ? 'border-system-blue bg-system-blue/20 text-white'
                          : 'border-white/20 hover:border-white/40 text-white/70'
                      }`}
                      onClick={() => toggleQuestCategory(category)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Themes Tab */}
          <TabsContent value="themes" className="space-y-6">
            <Card className="system-panel border-system-blue2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="h-5 w-5 text-system-blue2" />
                  Color Theme Variations
                </CardTitle>
                <CardDescription className="text-white/60">
                  Choose your preferred color scheme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {themeOptions.map((theme) => (
                    <div
                      key={theme.id}
                      className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                        profile.theme === theme.id
                          ? 'border-system-blue bg-system-blue/20'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      onClick={() => updateProfile({ theme: theme.id as any })}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: theme.color }}
                        />
                        <div>
                          <div className="text-white font-medium">{theme.name}</div>
                          <div className="text-white/60 text-sm">{theme.description}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-white/20 rounded" />
                        <div className="h-2 bg-white/10 rounded" />
                        <div className="h-2 bg-white/30 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="system-panel border-system-blue2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-system-blue2" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-white/60">
                  Customize your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Daily Quest Reminders</div>
                        <div className="text-white/60 text-sm">Get reminded about daily quests</div>
                      </div>
                      <Switch
                        checked={profile.notifications.dailyReminder}
                        onCheckedChange={(checked) => updateNotifications({ dailyReminder: checked })}
                      />
                    </div>
                    
                    {profile.notifications.dailyReminder && (
                      <div className="space-y-2">
                        <Label className="text-white flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Reminder Time
                        </Label>
                        <Input
                          type="time"
                          value={profile.notifications.reminderTime}
                          onChange={(e) => updateNotifications({ reminderTime: e.target.value })}
                          className="bg-system-panel border-system-blue text-white"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Streak Milestones</div>
                        <div className="text-white/60 text-sm">Celebrate streak achievements</div>
                      </div>
                      <Switch
                        checked={profile.notifications.streakMilestones}
                        onCheckedChange={(checked) => updateNotifications({ streakMilestones: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Emergency Quest Alerts</div>
                        <div className="text-white/60 text-sm">Get notified of urgent quests</div>
                      </div>
                      <Switch
                        checked={profile.notifications.emergencyQuests}
                        onCheckedChange={(checked) => updateNotifications({ emergencyQuests: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Achievement Celebrations</div>
                        <div className="text-white/60 text-sm">Unlock notification celebrations</div>
                      </div>
                      <Switch
                        checked={profile.notifications.achievements}
                        onCheckedChange={(checked) => updateNotifications({ achievements: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-white font-medium">Motivational Quotes</div>
                      <div className="text-white/60 text-sm">Receive inspiring hunter quotes</div>
                    </div>
                    <Switch
                      checked={profile.notifications.motivationalQuotes}
                      onCheckedChange={(checked) => updateNotifications({ motivationalQuotes: checked })}
                    />
                  </div>
                  
                  {profile.notifications.motivationalQuotes && (
                    <div className="space-y-2">
                      <Label className="text-white">Quote Frequency</Label>
                      <Select
                        value={profile.notifications.quoteFrequency}
                        onValueChange={(value: any) => updateNotifications({ quoteFrequency: value })}
                      >
                        <SelectTrigger className="bg-system-panel border-system-blue text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-system-panel border-system-blue">
                          <SelectItem value="daily" className="text-white">Daily</SelectItem>
                          <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
                          <SelectItem value="never" className="text-white">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-system-blue/10 rounded-lg border border-system-blue/30">
                  <div className="text-white font-medium mb-2">Sample Motivational Quote</div>
                  <div className="text-system-blue italic">
                    "{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}"
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}