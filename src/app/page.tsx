import Link from "next/link";
import { Radio, ShieldCheck, Video, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-6 sm:p-12 text-foreground antialiased selection:bg-primary/20">
      {/* Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
            <Radio className="w-5 h-5 animate-pulse text-white" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight flex items-center gap-1.5">
              <span>Falah Meet</span>
              <span className="text-secondary text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-secondary/10">v2.0</span>
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">Enterprise WebRTC • 180 Karyawan</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <span className="text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs">
              Masuk (Login)
            </span>
          </Link>
          <Badge variant="success" className="gap-1.5 py-1 px-3 text-xs hidden sm:inline-flex">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            LiveKit SFU Online
          </Badge>
        </div>
      </header>

      {/* Main hero & role portal */}
      <main className="max-w-3xl w-full mx-auto my-12 space-y-8 text-center">
        <div className="space-y-3">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold gap-1.5 mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            Remake Internal v2.0 • Falah Meet Platform
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Platform Rapat Video Internal Kantor
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Sistem konferensi video real-time bertenaga LiveKit, dirancang seamless seperti Google Meet dan Apple FaceTime, bebas dari birokrasi kontrak lama.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left pt-4">
          {/* Card 1: Super Admin Console (The primary requested module) */}
          <Link href="/login" className="group block">
            <Card className="p-6 h-full border-primary/30 hover:border-primary transition-all shadow-xs hover:shadow-lg bg-gradient-to-br from-card to-blue-50/20 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  Super Admin Dashboard
                </h2>
                <Badge variant="outline" className="text-[10px] text-primary border-primary/40 bg-primary/5">
                  Requested Prototype
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Kendali penuh manajemen: Pantau sesi rapat aktif real-time, direktori 180 karyawan, arsip rekaman cloud, dan konfigurasi rapat.
              </p>
              <div className="mt-5 flex items-center text-xs font-semibold text-primary gap-1 group-hover:translate-x-1 transition-transform">
                <span>Login ke Super Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>
          </Link>

          {/* Card 2: Quick Meeting Join / Client Info */}
          <Link href="/meet/eng-sprint-42" className="group block">
            <Card className="p-6 h-full border-border hover:border-secondary/50 bg-card shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Video className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors">
                    Ruang Rapat Instan
                  </h2>
                  <Badge variant="secondary" className="text-[10px]">
                    User Client
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Bagi karyawan biasa, rapat dapat langsung dimulai dengan 1-klik tanpa konfigurasi akun manual atau approval moderator.
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-secondary gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Masuk ke Ruang Rapat (Lobby & In-Meeting)</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> WebRTC SFU
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 1080p HD
                </span>
              </div>
            </Card>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
        <div>© 2026 Falah Meet • Hak Cipta Internal Kantor</div>
        <div className="font-mono text-[11px]">D:\ARMAN\PROJECT\REMAKE LIVEKIT</div>
      </footer>
    </div>
  );
}
