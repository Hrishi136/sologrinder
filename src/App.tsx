
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ShadowUnlockProvider } from "@/contexts/ShadowUnlockContext";
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

import ProfileSettings from "./pages/ProfileSettings";
import ProfileCustomization from "./pages/ProfileCustomization";
import Progress from "./pages/Progress";
import NotFound from "./pages/NotFound";
import SystemBootScreen from "@/components/SystemBootScreen";

import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { supabase } from "@/integrations/supabase/client";
import UsernameSelectionModal from "@/components/UsernameSelectionModal";
import MobileBottomNav from "@/components/MobileBottomNav";
import React from "react";

const SYSTEM_BOOT_COMPLETE_KEY = "shadowSystem_booted";
const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [showUsernameModal, setShowUsernameModal] = React.useState(false);

  React.useEffect(() => {
    // Listen for auth changes FIRST to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
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
          .maybeSingle();
        
        setProfile(profile);
        
        // Show username modal if no profile exists
        if (!profile) {
          setShowUsernameModal(true);
        }
      } else {
        setProfile(null);
        setShowUsernameModal(false);
      }
    };

    checkProfile();
  }, [session]);

  // Defer activity tracking outside auth callback to prevent deadlocks
  React.useEffect(() => {
    if (session?.user) {
      setTimeout(() => {
        (async () => {
          try {
            await supabase.rpc('track_daily_activity');
          } catch (error) {
            console.error('Error tracking daily activity:', error);
          }
        })();
      }, 0);
    }
  }, [session?.user]);
  const handleUsernameComplete = (username: string) => {
    setProfile({ username });
    setShowUsernameModal(false);
  };

  const isAuthenticated = !!session;

  // Route guards
  const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    if (loading) return null;
    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <>{children}</>;
  };

  const PublicOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (loading) return null;
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  };

  const RootRedirect: React.FC = () => {
    if (loading) return null;
    return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
  };

  // Do not block initial render on auth loading; render routes immediately

return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ShadowUnlockProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/quests" element={<RequireAuth><Quests /></RequireAuth>} />
            <Route path="/quest/:id" element={<RequireAuth><QuestDetail /></RequireAuth>} />
            <Route path="/army" element={<RequireAuth><Army /></RequireAuth>} />
            <Route path="/stats" element={<RequireAuth><Stats /></RequireAuth>} />
            <Route path="/performance" element={<RequireAuth><Performance /></RequireAuth>} />
            <Route path="/system-analysis" element={<RequireAuth><SystemAnalysis /></RequireAuth>} />
            <Route path="/leaderboard" element={<RequireAuth><Leaderboard /></RequireAuth>} />
            <Route path="/support" element={<RequireAuth><Support /></RequireAuth>} />
            <Route path="/community" element={<RequireAuth><Community /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><ProfileSettings /></RequireAuth>} />
            <Route path="/profile/customize" element={<RequireAuth><ProfileCustomization /></RequireAuth>} />
            <Route path="/progress" element={<RequireAuth><Progress /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* PWA install prompt */}
          <PWAInstallPrompt />

          {/* Username selection modal */}
          <UsernameSelectionModal 
            open={showUsernameModal}
            onComplete={handleUsernameComplete}
          />

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />
        </BrowserRouter>
      </ShadowUnlockProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
};

export default App;
