
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import SystemPanel from "../components/SystemPanel"

type AuthMode = "login" | "register"

const SYSTEM_USERS_KEY = "shadowSystem_users"
const SYSTEM_SESSION_KEY = "shadowSystem_session"

// Basic username/password mock auth with localStorage
function setUserSession(username: string) {
  localStorage.setItem(SYSTEM_SESSION_KEY, username)
}
function getUserSession(): string | null {
  return localStorage.getItem(SYSTEM_SESSION_KEY)
}

function getUsers(): Record<string, {password:string}> {
  return JSON.parse(localStorage.getItem(SYSTEM_USERS_KEY) || '{}')
}
function saveUser(username: string, password: string) {
  const users = getUsers()
  users[username] = { password }
  localStorage.setItem(SYSTEM_USERS_KEY, JSON.stringify(users))
}
function checkUser(username: string, password: string) {
  const users = getUsers()
  if (users[username]?.password === password) return true
  return false
}

const subtitles = {
  login: "System Access: Hunter Login",
  register: "System Protocol: Hunter Registration"
}

export default function Login() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  React.useEffect(() => {
    if (getUserSession()) navigate("/dashboard")
  }, [])

  function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password) {
      setError("Enter both Username and Password.")
      return
    }
    if (mode === "login") {
      if (!checkUser(username, password)) {
        setError("Incorrect username or password.")
        return
      }
      setUserSession(username)
      navigate("/dashboard")
    } else {
      const users = getUsers()
      if (users[username]) {
        setError("Username already registered.")
        return
      }
      saveUser(username, password)
      setUserSession(username)
      navigate("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-system-bg">
      <div className="particle-bg">
        {[...Array(12)].map((_,i) => (
          <div key={i}
            className="particle-dot"
            style={{
              left: `${Math.random()*100}%`,
              width: `${16+Math.random()*18}px`,
              height: `${16+Math.random()*18}px`,
              animationDelay: `${-Math.random()*10}s`,
              opacity: 0.17 + Math.random() * 0.11,
              bottom: `${Math.random()*10}vh`
            }}
          />
        ))}
      </div>
      <SystemPanel className="max-w-lg w-full px-7 py-10 relative z-10" glow>
        <h1 className="text-3xl font-orbitron text-system-blue text-center mb-2 drop-shadow-[0_2px_16px_#00d4ffcc] tracking-widest">{mode === "login" ? "SYSTEM ACCESS" : "HUNTER REGISTRATION"}</h1>
        <p className="text-center mb-8 text-system-blue2 font-medium animate-fade-in">{subtitles[mode]}</p>
        {error && (
          <div className="bg-red-900 bg-opacity-60 text-red-300 text-sm font-semibold px-4 py-2 rounded mb-4 border border-red-700 animate-fade-in">{error}</div>
        )}
        <form className="flex flex-col gap-4 mt-2 text-lg font-inter" onSubmit={handleAuth}>
          <input
            className="bg-[#191e26] border border-system-blue/70 text-system-blue focus:ring-2 focus:ring-system-blue2 rounded px-4 py-2 placeholder:text-system-blue2/60 outline-none"
            placeholder="Hunter Username"
            autoFocus
            value={username}
            onChange={e=>setUsername(e.target.value)}
            maxLength={24}
            required
          />
          <input
            className="bg-[#191e26] border border-system-blue/70 text-system-blue focus:ring-2 focus:ring-system-blue2 rounded px-4 py-2 placeholder:text-system-blue2/60 outline-none"
            placeholder="System Password"
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            maxLength={32}
            required
          />
          <button type="submit" className="glow-button uppercase tracking-wider mt-1">
            {mode === "login" ? "Unlock Access" : "Register Hunter"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          {mode === "login" ? (
            <span className="text-system-blue/80">No code?{' '}
              <button className="underline hover:text-system-blue2 font-medium" onClick={()=>{setMode("register"); setError("");}}>Hunter Registration</button>
            </span>
          ):(
            <span className="text-system-blue/80">Already a hunter?{' '}
              <button className="underline hover:text-system-blue" onClick={()=>{setMode("login"); setError("");}}>System Access</button>
            </span>
          )}
        </div>
      </SystemPanel>
    </div>
  )
}
