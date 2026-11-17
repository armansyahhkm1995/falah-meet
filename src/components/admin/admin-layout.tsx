"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  Building2,
  Video,
  Shield,
  Plus,
  Search,
  Radio,
  Copy,
  Check,
  SlidersHorizontal,
  ExternalLink,
  Lock,
  Sparkles,
  Mail,
  UserPlus,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CommandMenu } from "@/components/ui/command-menu";
import { cn } from "@/lib/utils";
import { INITIAL_DEPARTMENTS, INITIAL_EMPLOYEES, type DepartmentName } from "@/lib/mock-data";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [createMeetingOpen, setCreateMeetingOpen] = React.useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close mobile drawer on route navigation
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // New instant meeting modal states
  const [newTitle, setNewTitle] = React.useState("Quick Sync with Super Admin");
  const [newRoomCode, setNewRoomCode] = React.useState("falah-quick-sync");
  const [requirePass, setRequirePass] = React.useState(false);
  const [meetingPassword, setMeetingPassword] = React.useState("123456");
  const [copied, setCopied] = React.useState(false);

  // Department and specific employee invitations
  const [invitedDepts, setInvitedDepts] = React.useState<DepartmentName[]>(["Engineering"]);
  const [invitedEmployeeIds, setInvitedEmployeeIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    setNewRoomCode(`falah-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`);
  }, []);

  const navItems = [
    {
      title: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      badge: "Live",
      badgeVariant: "success" as const,
    },
    {
      title: "Karyawan",
      href: "/admin/employees",
      icon: UserCheck,
      badge: "180",
      badgeVariant: "secondary" as const,
    },
    {
      title: "Divisi Karyawan",
      href: "/admin/departments",
      icon: Building2,
      badge: "5 Divisi",
      badgeVariant: "info" as const,
    },
    {
      title: "Arsip Rekaman",
      href: "/admin/recordings",
      icon: Video,
      badge: "Cloud",
      badgeVariant: "info" as const,
    },
    {
      title: "Kebijakan Rapat",
      href: "/admin/settings",
      icon: Shield,
      badge: undefined,
      badgeVariant: undefined,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://meet.falah.one/${newRoomCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateCode = () => {
    setNewRoomCode(`falah-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`);
  };

  const toggleDeptInvite = (dept: DepartmentName) => {
    setInvitedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const toggleEmployeeInvite = (id: string) => {
    setInvitedEmployeeIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleLaunchMeeting = () => {
    const deptListText = invitedDepts.length > 0 ? invitedDepts.join(", ") : "Tidak ada";
    const employeeNames = INITIAL_EMPLOYEES.filter((e) => invitedEmployeeIds.includes(e.id))
      .map((e) => e.name)
      .join(", ");
    const specificEmpText = employeeNames.length > 0 ? employeeNames : "Tidak ada";

    alert(
      `✅ Ruang Rapat "${newTitle}" Berhasil Dibuat!\n\n` +
      `🔗 Tautan: https://meet.falah.one/${newRoomCode}\n` +
      `📧 Notifikasi email otomatis & calendar invite telah dikirimkan ke:\n` +
      `• Seluruh Anggota Divisi: ${deptListText}\n` +
      `• Karyawan Khusus: ${specificEmpText}\n\n` +
      `Peserta dapat langsung bergabung melalui link yang diterima di email kantor.`
    );
    setCreateMeetingOpen(false);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    router.push("/login");
  };

  const renderSidebarContent = (isMobile: boolean) => (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Brand header */}
        <div className="h-16 px-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
                Falah Meet <span className="text-secondary text-[10px] font-mono font-semibold px-1 py-0.5 rounded bg-secondary/10">CONSOLE</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Super Admin Console
              </div>
            </div>
          </div>

          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 rounded-lg border border-border bg-muted/40 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Tutup Menu"
              aria-label="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Start Action Button in Sidebar */}
        <div className="p-3">
          <Button
            onClick={() => {
              if (isMobile) setMobileMenuOpen(false);
              setCreateMeetingOpen(true);
            }}
            className="w-full justify-center gap-2 shadow-xs bg-primary hover:bg-primary/95 text-white font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Mulai Rapat Instan
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Menu Manajemen
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobile) setMobileMenuOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group",
                  isActive
                    ? "bg-primary text-white shadow-xs font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant={isActive ? "secondary" : item.badgeVariant}
                    className={cn("text-[10px] px-1.5 py-0", isActive && "bg-white/20 text-white border-transparent")}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: Admin Profile & Logout */}
      <div className="p-3 border-t border-border bg-muted/20 space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/70 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              alt="Arman Hakim"
              className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
            />
            <div className="text-left min-w-0">
              <div className="text-xs font-semibold text-foreground truncate">Arman Hakim</div>
              <div className="text-[10px] text-muted-foreground truncate font-mono">arman@falah.one</div>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] text-primary border-primary/30 bg-primary/5 font-semibold shrink-0">
            Admin
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (isMobile) setMobileMenuOpen(false);
            setLogoutDialogOpen(true);
          }}
          className="w-full justify-start gap-2.5 text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50/80 transition-colors h-8 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-muted-foreground group-hover:text-red-600" />
          <span>Keluar Akun (Log Out)</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row antialiased text-foreground">
      {/* DESKTOP SIDEBAR (Visible on md and up) */}
      <aside className="hidden md:flex w-64 border-r border-border bg-card flex-col justify-between shrink-0 h-screen sticky top-0">
        {renderSidebarContent(false)}
      </aside>

      {/* MOBILE SIDEBAR (Drawer with Backdrop triggered by Hamburger Menu) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-over Drawer */}
          <aside className="relative z-50 w-72 max-w-[85vw] h-full bg-card border-r border-border flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 px-4 sm:px-6 border-b border-border bg-card/70 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-3 sm:gap-4">
          {/* Mobile Hamburger Button + Brand Title */}
          <div className="flex items-center gap-2.5 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="w-9 h-9 rounded-lg border border-border bg-muted/40 hover:bg-muted flex items-center justify-center text-foreground cursor-pointer transition-colors"
              title="Buka Menu Navigasi"
              aria-label="Buka Menu Navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white shadow-xs">
                <Radio className="w-4 h-4 text-white animate-pulse" />
              </div>
              <span className="font-bold text-sm tracking-tight text-foreground">Falah Meet</span>
            </div>
          </div>

          {/* Search Trigger (Cmd + K) */}
          <div className="flex-1 max-w-md hidden sm:block">
            <button
              onClick={() => setCommandOpen(true)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-muted-foreground bg-muted/50 hover:bg-muted border border-input rounded-lg transition-colors cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="truncate">Cari ruang rapat, karyawan, divisi, atau rekaman...</span>
              </div>
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-card px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search button for small mobile */}
            <button
              onClick={() => setCommandOpen(true)}
              className="sm:hidden w-9 h-9 rounded-lg border border-border bg-muted/40 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Cari (Cmd+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>4 Rapat Sedang Berlangsung (28 Peserta)</span>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={() => setCreateMeetingOpen(true)}
              className="gap-1.5 text-xs font-medium shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Buat Rapat Instan</span>
              <span className="xs:hidden">Rapat</span>
            </Button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Universal Command Menu (Cmd + K) */}
      <CommandMenu
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onStartMeeting={() => setCreateMeetingOpen(true)}
      />

      {/* Instant Meeting Creation Dialog (With Division & Specific Employee Invites + Email Notification) */}
      <Dialog open={createMeetingOpen} onOpenChange={setCreateMeetingOpen}>
        <DialogHeader>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <DialogTitle>Buat Ruang Rapat Instan</DialogTitle>
          <DialogDescription>
            Tentukan divisi dan karyawan yang diundang. Seluruh peserta akan menerima notifikasi email instan untuk bergabung.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2 text-xs max-h-[460px] overflow-y-auto pr-1">
          {/* Judul Rapat */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Judul Rapat</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Contoh: Engineering Standup, Product Sync"
              className="text-xs"
            />
          </div>

          {/* Tautan Akses */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Tautan Akses Cepat</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-muted/60 border border-input rounded-md font-mono text-xs text-foreground select-all truncate">
                https://meet.falah.one/{newRoomCode}
              </div>
              <Button variant="outline" size="sm" onClick={handleRegenerateCode} title="Acak ulang kode ruangan">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </Button>
              <Button variant="secondary" size="sm" onClick={handleCopyLink} className="gap-1">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Tersalin!" : "Salin"}
              </Button>
            </div>
          </div>

          {/* Divisi yang Diundang */}
          <div className="p-3 bg-card rounded-lg border border-border space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              🏢 Divisi yang Diundang (Otomatis Undang Seluruh Anggota Divisi)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INITIAL_DEPARTMENTS.map((dept) => {
                const isChecked = invitedDepts.includes(dept.name);
                return (
                  <label
                    key={dept.id}
                    className={`flex items-center gap-2 p-2 rounded-md border text-xs cursor-pointer transition-colors ${
                      isChecked
                        ? "bg-primary/5 border-primary text-primary font-medium"
                        : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDeptInvite(dept.name)}
                      className="accent-primary rounded"
                    />
                    <span className="truncate">{dept.name} ({dept.memberCount})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Karyawan Khusus yang Diundang (Luar Divisi / Belum di-assign) */}
          <div className="p-3 bg-card rounded-lg border border-border space-y-2">
            <label className="block text-xs font-semibold text-foreground flex items-center justify-between">
              <span>👤 Karyawan Tertentu / Tamu Khusus</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                {invitedEmployeeIds.length} dipilih
              </span>
            </label>
            <div className="max-h-36 overflow-y-auto space-y-1 pr-1 divide-y divide-border/50">
              {INITIAL_EMPLOYEES.map((emp) => {
                const isSelected = invitedEmployeeIds.includes(emp.id);
                return (
                  <label
                    key={emp.id}
                    className="flex items-center justify-between p-1.5 hover:bg-muted/50 rounded cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleEmployeeInvite(emp.id)}
                        className="accent-primary rounded"
                      />
                      <img src={emp.avatar} alt={emp.name} className="w-5 h-5 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-foreground">{emp.name}</div>
                        <div className="text-[10px] text-muted-foreground">{emp.email} • {emp.department}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Password Protection */}
          <div className="pt-2 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Lindungi dengan Kata Sandi</div>
                <div className="text-[11px] text-muted-foreground">Wajibkan PIN masuk untuk peserta tambahan</div>
              </div>
              <input
                type="checkbox"
                checked={requirePass}
                onChange={(e) => setRequirePass(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            {requirePass && (
              <div className="animate-in fade-in-50 duration-150">
                <label className="block text-xs font-medium text-foreground mb-1">Kata Sandi Ruangan</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <Input
                    value={meetingPassword}
                    onChange={(e) => setMeetingPassword(e.target.value)}
                    className="pl-8 text-xs font-mono tracking-widest"
                    maxLength={10}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Email Notification Notice */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start gap-2.5 text-blue-900 text-[11px]">
            <Mail className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Notifikasi Email Otomatis:</span> Setiap anggota divisi dan karyawan yang dicentang di atas akan menerima email undangan berisi tautan langsung untuk masuk ke sesi rapat.
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setCreateMeetingOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleLaunchMeeting} className="gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Buat & Kirim Undangan Rapat
          </Button>
        </DialogFooter>
      </Dialog>

      {/* DIALOG: LOGOUT CONFIRMATION */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogHeader>
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2">
            <LogOut className="w-5 h-5" />
          </div>
          <DialogTitle>Konfirmasi Keluar Akun</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin keluar dari sesi Super Admin <span className="font-semibold text-foreground">Falah Meet</span>? Anda perlu masuk kembali menggunakan email kantor untuk mengakses console manajemen rapat.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleLogoutConfirm} className="gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Ya, Keluar Sekarang
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
