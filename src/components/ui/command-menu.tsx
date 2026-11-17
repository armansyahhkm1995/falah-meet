"use client";

import * as React from "react";
import { Search, Video, Users, Disc, Shield, Plus, ArrowRight, Building2, UserCheck } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { INITIAL_ACTIVE_MEETINGS, INITIAL_EMPLOYEES, INITIAL_RECORDINGS } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartMeeting?: () => void;
}

export function CommandMenu({ open, onOpenChange, onStartMeeting }: CommandMenuProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const filteredMeetings = INITIAL_ACTIVE_MEETINGS.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()) || m.roomCode.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEmployees = INITIAL_EMPLOYEES.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.email.toLowerCase().includes(query.toLowerCase()) ||
    e.department.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRecordings = INITIAL_RECORDINGS.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase()) || r.hostName.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (action: () => void) => {
    onOpenChange(false);
    setQuery("");
    action();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="-m-6 p-4 border-b border-border flex items-center gap-3 bg-muted/30">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari ruang rapat, karyawan, divisi, atau rekaman..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
          autoFocus
        />
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ESC
        </kbd>
      </div>

      <div className="max-h-[360px] overflow-y-auto mt-4 space-y-4 text-xs pr-1">
        {/* Quick actions */}
        <div>
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-2">
            Aksi Cepat
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => handleSelect(() => onStartMeeting?.())}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-foreground">Mulai Rapat Instan Baru</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => handleSelect(() => router.push("/admin/employees"))}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-foreground">Kelola & Assign Karyawan</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => handleSelect(() => router.push("/admin/departments"))}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-foreground">Lihat Struktur Divisi Karyawan</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => handleSelect(() => router.push("/admin/settings"))}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-foreground">Atur Kebijakan Rapat Default</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {/* Active meetings */}
        {filteredMeetings.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-2 flex items-center justify-between">
              <span>Sesi Rapat Aktif</span>
              <span className="text-[10px] font-normal text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Live</span>
            </div>
            <div className="space-y-0.5">
              {filteredMeetings.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelect(() => router.push("/admin"))}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-blue-50 text-primary">
                      <Video className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{m.title}</div>
                      <div className="text-muted-foreground text-[10px]">
                        Host: {m.hostName} • {m.participantCount} peserta • #{m.roomCode}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Employees */}
        {filteredEmployees.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-2">
              Karyawan & Divisi
            </div>
            <div className="space-y-0.5">
              {filteredEmployees.slice(0, 4).map((e) => (
                <button
                  key={e.id}
                  onClick={() => handleSelect(() => router.push("/admin/employees"))}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={e.avatar} alt={e.name} className="w-6 h-6 rounded-full object-cover border border-border" />
                    <div>
                      <div className="font-medium text-foreground">{e.name}</div>
                      <div className="text-muted-foreground text-[10px]">{e.role} • {e.department}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{e.email}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recordings */}
        {filteredRecordings.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-2">
              Arsip Rekaman
            </div>
            <div className="space-y-0.5">
              {filteredRecordings.slice(0, 3).map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelect(() => router.push("/admin/recordings"))}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-purple-50 text-purple-700">
                      <Disc className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{r.title}</div>
                      <div className="text-muted-foreground text-[10px]">{r.date} • {r.duration} • {r.fileSize}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="-m-6 mt-4 p-2.5 bg-muted/40 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground px-4">
        <span className="flex items-center gap-1.5 font-medium">
          Falah Meet Universal Command
        </span>
        <div className="flex items-center gap-3">
          <span>Gunakan <kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[9px]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[9px]">↓</kbd> untuk memilih</span>
          <span><kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[9px]">Enter</kbd> untuk membuka</span>
        </div>
      </div>
    </Dialog>
  );
}
