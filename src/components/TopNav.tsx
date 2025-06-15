
import React from "react"
import { useNavigate, NavLink } from "react-router-dom"

const navItems = [
  { title: "Dashboard", path: "/dashboard" },
  { title: "Quests", path: "/quests" },
  { title: "Army", path: "/army" },
  { title: "Stats", path: "/stats" },
]

const SYSTEM_SESSION_KEY = "shadowSystem_session";

export default function TopNav() {
  const navigate = useNavigate();

  function handleLogout(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    localStorage.removeItem(SYSTEM_SESSION_KEY);
    navigate("/login");
  }

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 mb-6 z-10">
      <div className="flex items-center gap-3">
        <img src="https://lovable.dev/opengraph-image-p98pqg.png" alt="Shadow Monarch" className="h-9 w-9 rounded-full border-2 border-system-blue shadow-blue-glow" />
        <span className="font-orbitron font-extrabold text-2xl tracking-widest text-system-blue drop-shadow-[0_2px_6px_#00d4ff]" style={{letterSpacing:"2.5px"}}>
          SHADOW SYSTEM
        </span>
      </div>
      <div className="flex gap-6">
        {navItems.map(n => (
          <NavLink
            key={n.title}
            to={n.path}
            className={({ isActive }) =>
              `font-orbitron px-2 py-1 text-lg tracking-wide border-b-2 ${isActive ? "border-system-blue text-system-blue" : "border-transparent text-white hover:text-system-blue hover:border-system-blue transition-colors duration-200"}`
            }
          >
            {n.title}
          </NavLink>
        ))}
      </div>
      <div>
        <a
          href="/login"
          className="text-system-blue font-orbitron font-bold underline decoration-system-blue hover:decoration-4"
          onClick={handleLogout}
        >
          Log Out
        </a>
      </div>
    </nav>
  )
}
