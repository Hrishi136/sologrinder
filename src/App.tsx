
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Quests from "./pages/Quests";
import QuestDetail from "./pages/QuestDetail";
import Army from "./pages/Army";
import Stats from "./pages/Stats";
import Performance from "./pages/Performance";
import SystemAnalysis from "./pages/SystemAnalysis";
import Leaderboard from "./pages/Leaderboard";
import Support from "./pages/Support";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import ProfileCustomization from "./pages/ProfileCustomization";
import Progress from "./pages/Progress";
import NotFound from "./pages/NotFound";
import SystemBootScreen from "@/components/SystemBootScreen";

import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { supabase } from "@/integrations/supabase/client";
import UsernameSelectionModal from "@/components/UsernameSelectionModal";
import WelcomeBackModal from "@/components/WelcomeBackModal";
import React from "react";

const SYSTEM_BOOT_COMPLETE_KEY = "shadowSystem_booted";
const queryClient = new QueryClient();

const App = () => {
  const [booted, setBooted] = React.useState<boolean>(() => {
    // Optional: only show on "cold" navigation, not every route
    return !window.sessionStorage.getItem(SYSTEM_BOOT_COMPLETE_KEY);
  });
  const [session, setSession] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [showUsernameModal, setShowUsernameModal] = React.useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = React.useState(false);
  const [hasShownWelcome, setHasShownWelcome] = React.useState(false);

  React.useEffect(() => {
    if (!booted) {
      window.sessionStorage.setItem(SYSTEM_BOOT_COMPLETE_KEY, "true");
    }
  }, [booted]);

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      // Track daily activity when user authenticates
      if (session?.user) {
        try {
          await supabase.rpc('track_daily_activity');
        } catch (error) {
          console.error('Error tracking daily activity:', error);
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check for user profile when authenticated
  React.useEffect(() => {
    const checkProfile = async () => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        setProfile(profile);
        
        // Show username modal if no profile exists
        if (!profile) {
          setShowUsernameModal(true);
        } else if (!hasShownWelcome) {
          // Show welcome modal for existing users on login
          setShowWelcomeModal(true);
          setHasShownWelcome(true);
        }
      } else {
        setProfile(null);
        setShowUsernameModal(false);
      }
    };

    checkProfile();
  }, [session]);

  const handleUsernameComplete = (username: string) => {
    setProfile({ username });
    setShowUsernameModal(false);
    // Show welcome modal for new users after username setup
    setShowWelcomeModal(true);
    setHasShownWelcome(true);
  };

  const isAuthenticated = !!session;

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <>
      {booted && (
        <SystemBootScreen
          onBootComplete={() => setBooted(false)}
        />
      )}
      {/* rest of the app is hidden while SystemBootScreen is visible */}
      {!booted && (
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                <Route path="/login" element={<Login />} />
                {/* Protected section */}
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/quests" element={isAuthenticated ? <Quests /> : <Navigate to="/login" />} />
                <Route path="/quest/:id" element={isAuthenticated ? <QuestDetail /> : <Navigate to="/login" />} />
                <Route path="/army" element={isAuthenticated ? <Army /> : <Navigate to="/login" />} />
                <Route path="/stats" element={isAuthenticated ? <Stats /> : <Navigate to="/login" />} />
                <Route path="/performance" element={isAuthenticated ? <Performance /> : <Navigate to="/login" />} />
                <Route path="/system-analysis" element={isAuthenticated ? <SystemAnalysis /> : <Navigate to="/login" />} />
                <Route path="/leaderboard" element={isAuthenticated ? <Leaderboard /> : <Navigate to="/login" />} />
                <Route path="/support" element={isAuthenticated ? <Support /> : <Navigate to="/login" />} />
                <Route path="/community" element={isAuthenticated ? <Community /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isAuthenticated ? <ProfileSettings /> : <Navigate to="/login" />} />
                <Route path="/profile/customize" element={isAuthenticated ? <ProfileCustomization /> : <Navigate to="/login" />} />
                <Route path="/progress" element={isAuthenticated ? <Progress /> : <Navigate to="/login" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              
              {/* PWA install prompt */}
              <PWAInstallPrompt />
              
              {/* Username selection modal */}
              <UsernameSelectionModal 
                open={showUsernameModal}
                onComplete={handleUsernameComplete}
              />
              
              {/* Welcome back modal */}
              <WelcomeBackModal
                username={profile?.username || 'Unknown Hunter'}
                isVisible={showWelcomeModal}
                onClose={() => setShowWelcomeModal(false)}
              />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      )}
    </>
  );
};

export default App;
