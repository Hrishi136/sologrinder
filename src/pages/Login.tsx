
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SystemPanel from "../components/SystemPanel"
import { supabase } from "@/integrations/supabase/client"

type AuthMode = "email" | "magic"

const subtitles = {
  email: "System Access: Hunter Login",
  magic: "System Protocol: Magic Link Access"
}

export default function Login() {
  const [mode, setMode] = useState<AuthMode>("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Check for existing session and handle auth state changes
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user && window.location.pathname !== "/dashboard") {
          navigate("/dashboard")
        }
      }
    )

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && window.location.pathname !== "/dashboard") {
        navigate("/dashboard")
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || (mode === "email" && !password)) {
      setError("Please fill in all required fields.")
      return
    }
    
    setLoading(true)
    setError("")

    try {
      if (mode === "email") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) {
          setError(error.message)
        }
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        })
        
        if (error) {
          setError(error.message)
        } else {
          setError("")
          alert("Check your email for the magic link!")
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) {
        setError(error.message)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
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
        <h1 className="text-3xl font-orbitron text-system-blue text-center mb-2 drop-shadow-[0_2px_16px_#00d4ffcc] tracking-widest">
          {mode === "email" ? "SYSTEM ACCESS" : "MAGIC LINK ACCESS"}
        </h1>
        <p className="text-center mb-8 text-system-blue2 font-medium animate-fade-in">{subtitles[mode]}</p>
        {error && (
          <div className="bg-red-900 bg-opacity-60 text-red-300 text-sm font-semibold px-4 py-2 rounded mb-4 border border-red-700 animate-fade-in">{error}</div>
        )}
        <form className="flex flex-col gap-4 mt-2 text-lg font-inter" onSubmit={handleEmailAuth}>
          <input
            className="bg-[#191e26] border border-system-blue/70 text-system-blue focus:ring-2 focus:ring-system-blue2 rounded px-4 py-2 placeholder:text-system-blue2/60 outline-none"
            placeholder="Hunter Email"
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />
          {mode === "email" && (
            <input
              className="bg-[#191e26] border border-system-blue/70 text-system-blue focus:ring-2 focus:ring-system-blue2 rounded px-4 py-2 placeholder:text-system-blue2/60 outline-none"
              placeholder="System Password"
              type="password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
            />
          )}
          <button type="submit" className="glow-button uppercase tracking-wider mt-1" disabled={loading}>
            {loading ? "Processing..." : mode === "email" ? "Unlock Access" : "Send Magic Link"}
          </button>
        </form>
        
        <div className="mt-4">
          <button 
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full bg-white text-gray-800 font-semibold py-2 px-4 rounded border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Processing..." : "Continue with Google"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          {mode === "email" ? (
            <span className="text-system-blue/80">Prefer magic link?{' '}
              <button className="underline hover:text-system-blue2 font-medium" onClick={()=>{setMode("magic"); setError("");}}>Magic Link Access</button>
            </span>
          ):(
            <span className="text-system-blue/80">Have a password?{' '}
              <button className="underline hover:text-system-blue" onClick={()=>{setMode("email"); setError("");}}>System Access</button>
            </span>
          )}
        </div>
      </SystemPanel>
    </div>
  )
}
