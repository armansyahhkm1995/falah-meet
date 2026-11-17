"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("arman@falah.one");
  const [password, setPassword] = React.useState("superadmin2026");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);

    // Smooth transition simulation to admin dashboard
    setTimeout(() => {
      router.push("/admin");
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#030712] select-none">
      {/* 3D ARCHITECTURAL RIBBON BACKGROUND (Blue themed inspired by LiveKit design) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="w-full h-full object-cover min-w-[1280px] min-h-[800px] opacity-90"
          viewBox="0 0 1920 1080"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Fine slotted ribbed texture pattern */}
            <pattern id="slats-pattern" width="20" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
              <line x1="0" y1="0" x2="20" y2="0" stroke="#000000" strokeWidth="2.5" opacity="0.65" />
              <line x1="0" y1="4" x2="20" y2="4" stroke="#60a5fa" strokeWidth="0.8" opacity="0.25" />
            </pattern>

            {/* Glowing Blue Gradients */}
            <linearGradient id="ribbon-glow-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#2563eb" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#1e3a8a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#090d16" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="ribbon-glow-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#1d4ed8" stopOpacity="0.75" />
              <stop offset="85%" stopColor="#0b1329" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="ribbon-glow-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#1e40af" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
            </linearGradient>

            <radialGradient id="center-spotlight" cx="65%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#0f172a" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Deep Ambient Base */}
          <rect width="1920" height="1080" fill="#030712" />
          <rect width="1920" height="1080" fill="url(#center-spotlight)" />

          {/* Ribbon 1 - Deep Background Wave */}
          <path
            d="M-100,-100 C300,200 600,600 1200,1200 L1400,1200 C800,600 500,200 100,-100 Z"
            fill="url(#ribbon-glow-3)"
            opacity="0.5"
          />

          {/* Ribbon 2 - Large Sweeping Blade Top Right to Center */}
          <path
            d="M800,-200 C1100,150 1400,500 2100,800 L2000,950 C1300,650 1000,300 700,-100 Z"
            fill="url(#ribbon-glow-1)"
          />
          <path
            d="M800,-200 C1100,150 1400,500 2100,800 L2000,950 C1300,650 1000,300 700,-100 Z"
            fill="url(#slats-pattern)"
          />

          {/* Ribbon 3 - Dramatic Central Wave Crossing Screen */}
          <path
            d="M200,-150 C550,250 850,550 1850,1150 L1700,1250 C700,650 400,350 50,-50 Z"
            fill="url(#ribbon-glow-2)"
          />
          <path
            d="M200,-150 C550,250 850,550 1850,1150 L1700,1250 C700,650 400,350 50,-50 Z"
            fill="url(#slats-pattern)"
          />

          {/* Ribbon 4 - Bottom Left Foreground Fin */}
          <path
            d="M-200,300 C150,550 450,850 1000,1300 L850,1350 C300,900 0,600 -350,350 Z"
            fill="url(#ribbon-glow-1)"
            opacity="0.8"
          />
          <path
            d="M-200,300 C150,550 450,850 1000,1300 L850,1350 C300,900 0,600 -350,350 Z"
            fill="url(#slats-pattern)"
          />

          {/* Ribbon 5 - Thin Radiant Edge Highlights */}
          <path
            d="M205,-145 C555,255 855,555 1855,1155"
            stroke="#93c5fd"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.9"
            filter="drop-shadow(0 0 8px #3b82f6)"
          />
          <path
            d="M805,-195 C1105,155 1405,505 2105,805"
            stroke="#60a5fa"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
            filter="drop-shadow(0 0 6px #2563eb)"
          />
          <path
            d="M-195,305 C155,555 455,855 1005,1305"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
            filter="drop-shadow(0 0 6px #0ea5e9)"
          />

          {/* Subtle Vignette Overlay */}
          <rect width="1920" height="1080" fill="black" opacity="0.25" />
        </svg>
      </div>

      {/* FLOATING LOGIN CONTAINER (Figma LiveKit Style) */}
      <div className="relative z-10 w-full max-w-[780px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 grid grid-cols-1 md:grid-cols-2 backdrop-blur-xs">
        {/* LEFT COLUMN: Clean White Form Area */}
        <div className="bg-white p-8 sm:p-11 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-7">
            <h2 className="text-2xl font-bold tracking-tight text-[#1e3a8a]">
              Selamat Datang
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">
              Masuk ke akun Anda
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="falah@email.com"
                  required
                  className="w-full h-10 pl-9 pr-3 text-xs bg-white rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full h-10 pl-9 pr-9 text-xs bg-white rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] active:bg-[#172554] text-white text-xs font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>

          {/* Discreet Demo Account Hint */}
          <div className="mt-5 text-center">
            <span
              onClick={() => {
                setEmail("arman@falah.one");
                setPassword("superadmin2026");
              }}
              className="text-[11px] text-slate-400 hover:text-[#1e3a8a] cursor-pointer transition-colors"
              title="Isi kredensial admin otomatis"
            >
              Gunakan akun demo Super Admin
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Dark Translucent Glass with Headline & Tagline */}
        <div className="relative bg-black/45 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/10 p-8 sm:p-11 flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Subtle blue ambient light behind text */}
          <div className="absolute w-48 h-48 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-white uppercase drop-shadow-md">
              Falah Meet
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
              Where Teams Collaborate
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER VERSION OUTSIDE CARD (As in Figma LiveKit) */}
      <div className="relative z-10 mt-6 text-center">
        <span className="text-[11px] text-slate-400/90 font-mono tracking-wider">
          Versi 0.0.1
        </span>
      </div>
    </div>
  );
}
