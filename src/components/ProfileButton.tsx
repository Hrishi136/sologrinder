import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { User, Settings, Heart, LogOut } from "lucide-react"

export default function ProfileButton() {
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
    <div className="fixed top-[68px] right-3 sm:right-4 z-40">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded-full border-2 border-system-blue bg-system-panel/95 hover:bg-system-blue/20 transition-colors duration-200 shadow-lg backdrop-blur-sm min-w-[44px] min-h-[44px] flex items-center justify-center">
            {avatarUrl ? (
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src={avatarUrl} alt="User Avatar" />
                <AvatarFallback className="bg-system-blue/20 text-system-blue">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="p-1 text-system-blue">
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-system-panel border-system-blue z-50">
          <DropdownMenuItem 
            className="text-white hover:bg-system-blue/20 focus:bg-system-blue/20 cursor-pointer"
            onClick={() => navigate("/support")}
          >
            <Heart className="h-4 w-4 mr-2" />
            Support the App
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-white hover:bg-system-blue/20 focus:bg-system-blue/20 cursor-pointer"
            onClick={() => navigate("/profile-settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-white hover:bg-system-blue/20 focus:bg-system-blue/20 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
