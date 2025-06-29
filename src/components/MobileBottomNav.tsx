
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Target, Users, BarChart3, TrendingUp } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/quests', icon: Target, label: 'Quests' },
  { path: '/army', icon: Users, label: 'Army' },
  { path: '/stats', icon: BarChart3, label: 'Stats' },
  { path: '/performance', icon: TrendingUp, label: 'Performance' },
];

export default function MobileBottomNav() {
  const { isMobile } = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-system-panel/95 backdrop-blur-md border-t-2 border-system-blue/30">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-h-[44px] px-3 py-1 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-system-blue bg-system-blue/10' 
                  : 'text-white/70 hover:text-system-blue hover:bg-system-blue/5'
              }`
            }
          >
            <Icon size={20} className="mb-1" />
            <span className="text-xs font-orbitron">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

// Add missing import
import { useIsMobile } from '@/hooks/use-mobile';
