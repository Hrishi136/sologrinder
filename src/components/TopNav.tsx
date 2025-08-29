
import React from "react"
import logo from "@/assets/logo.png";
import { useNavigate, NavLink } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
      <div className="flex gap-3 sm:gap-6">
        {navItems.map(n => (
          <NavLink
            key={n.title}
            to={n.path}
            className={({ isActive }) =>
              `font-orbitron px-2 py-1 text-base sm:text-lg tracking-wide border-b-2 ${isActive ? "border-system-blue text-system-blue" : "border-transparent text-white hover:text-system-blue hover:border-system-blue transition-colors duration-200"}`
            }
          >
            {n.title}
          </NavLink>
        ))}
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full bg-system-blue/10 border-2 border-system-blue hover:bg-system-blue/20 transition-colors duration-200">
              <User className="h-5 w-5 text-system-blue" />
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
            <DropdownMenuItem className="text-white hover:bg-system-blue/20 focus:bg-system-blue/20">
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
