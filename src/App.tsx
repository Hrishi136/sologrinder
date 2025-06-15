
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
import NotFound from "./pages/NotFound";

// Simple pseudo-session check for routing guard
const SYSTEM_SESSION_KEY = "shadowSystem_session";
const isAuthenticated = () => !!localStorage.getItem(SYSTEM_SESSION_KEY);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={<Login />} />
          {/* Protected section */}
          <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/quests" element={isAuthenticated() ? <Quests /> : <Navigate to="/login" />} />
          <Route path="/quest/:id" element={isAuthenticated() ? <QuestDetail /> : <Navigate to="/login" />} />
          <Route path="/army" element={isAuthenticated() ? <Army /> : <Navigate to="/login" />} />
          <Route path="/stats" element={isAuthenticated() ? <Stats /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
