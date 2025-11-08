
import React, { useState, useEffect } from "react"
import logo from "@/assets/logo.png";
import { useNavigate, NavLink } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { User, Settings, Heart } from "lucide-react"

const navItems = [
  { title: "Dashboard", path: "/dashboard" },
  { title: "Quests", path: "/quests" },
  { title: "Army", path: "/army" },
  { title: "Performance", path: "/performance" },
  { title: "Leaderboard", path: "/leaderboard" },
]

export default function TopNav() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadUserAvatar = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (profile?.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }
      }
    };
    
    loadUserAvatar();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <nav className="w-full flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-2 sm:py-3 mb-2 sm:mb-6 z-10 gap-2 sm:gap-0">
      <div className="flex items-center gap-2 sm:gap-3">
        <img 
          src={logo} 
          alt="SoloGrinder Logo" 
          className="h-6 sm:h-8 w-auto drop-shadow-[0_2px_4px_#00d4ff]"
        />
      </div>
      <div className="w-full max-w-full overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex flex-nowrap items-center gap-3 sm:gap-6 px-1">
          {navItems.map(n => (
            <NavLink
              key={n.title}
              to={n.path}
              className={({ isActive }) =>
                `shrink-0 font-orbitron px-2 py-1 text-base sm:text-lg tracking-wide border-b-2 ${isActive ? "border-system-blue text-system-blue" : "border-transparent text-white hover:text-system-blue hover:border-system-blue transition-colors duration-200"}`
              }
            >
              {n.title}
            </NavLink>
          ))}
        </div>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-full border-2 border-system-blue bg-system-blue/10 hover:bg-system-blue/20 transition-colors duration-200">
              {avatarUrl ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} alt="User Avatar" />
                  <AvatarFallback className="bg-system-blue/20 text-system-blue">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="p-1.5 text-system-blue">
                  <User className="h-5 w-5" />
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-system-panel border-system-blue z-50">
            <DropdownMenuItem 
              className="text-white hover:bg-system-blue/20 focus:bg-system-blue/20"
              onClick={() => navigate("/support")}
            >
              <Heart className="h-4 w-4 mr-2" />
              Support the App
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-white hover:bg-system-blue/20 focus:bg-system-blue/20"
              onClick={() => navigate("/profile")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Change Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-white hover:bg-system-blue/20 focus:bg-system-blue/20"
              onClick={handleLogout}
            >
              <User className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
