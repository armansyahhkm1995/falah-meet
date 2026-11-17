"use client";

import * as React from "react";
import Link from "next/link";
import {
  Video,
  Users,
  HardDrive,
  Copy,
  Check,
  Lock,
  Unlock,
  Radio,
  Eye,
  PhoneOff,
  AlertCircle,
  CalendarCheck,
  Pencil,
  SlidersHorizontal,
  Sparkles,
  Shield,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { INITIAL_ACTIVE_MEETINGS, INITIAL_DEPARTMENTS, type ActiveMeeting } from "@/lib/mock-data";

export default function AdminOverviewPage() {
  const [meetings, setMeetings] = React.useState<ActiveMeeting[]>(INITIAL_ACTIVE_MEETINGS);
  const [selectedMeeting, setSelectedMeeting] = React.useState<ActiveMeeting | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [endMeetingDialog, setEndMeetingDialog] = React.useState<ActiveMeeting | null>(null);

  // Edit Room Modal state
  const [editingMeeting, setEditingMeeting] = React.useState<ActiveMeeting | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editRoomCode, setEditRoomCode] = React.useState("");
  const [editDepartment, setEditDepartment] = React.useState("Engineering");
  const [editMaxParticipants, setEditMaxParticipants] = React.useState(50);
  const [editHasPassword, setEditHasPassword] = React.useState(false);
  const [editPassword, setEditPassword] = React.useState("123456");
  const [editIsRecording, setEditIsRecording] = React.useState(false);
  const [editIsLocked, setEditIsLocked] = React.useState(false);
  const [editCopied, setEditCopied] = React.useState(false);

  const handleOpenEditModal = (m: ActiveMeeting) => {
    setEditingMeeting(m);
    setEditTitle(m.title);
    setEditRoomCode(m.roomCode);
    setEditDepartment(m.department);
    setEditMaxParticipants(m.maxParticipants);
    setEditHasPassword(m.hasPassword);
    setEditPassword("123456");
    setEditIsRecording(m.isRecording);
    setEditIsLocked(m.isLocked);
    setEditCopied(false);
  };

  const handleRegenerateEditCode = () => {
    setEditRoomCode(`falah-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`);
  };

  const handleCopyEditLink = () => {
    navigator.clipboard.writeText(`https://meet.falah.one/${editRoomCode}`);
    setEditCopied(true);
    setTimeout(() => setEditCopied(false), 2000);
  };

  const handleSaveEditMeeting = () => {
    if (!editingMeeting) return;
    setMeetings((prev) =>
      prev.map((m) =>
        m.id === editingMeeting.id
          ? {
              ...m,
              title: editTitle,
              roomCode: editRoomCode,
              department: editDepartment,
              maxParticipants: editMaxParticipants,
              hasPassword: editHasPassword,
              isRecording: editIsRecording,
              isLocked: editIsLocked,
            }
          : m
      )
    );
    setEditingMeeting(null);
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(`https://meet.falah.one/${code}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleLock = (id: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isLocked: !m.isLocked } : m))
    );
  };

  const handleEndMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    setEndMeetingDialog(null);
  };

  const totalParticipants = meetings.reduce((acc, m) => acc + m.participantCount, 0);

  return (
    <div className="space-y-6">
      {/* Page Title & Status Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Monitoring aktivitas sesi rapat internal dan ruang kolaborasi kantor Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1.5 py-1 px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
            Sistem Rapat: Normal & Stabil
          </Badge>
        </div>
      </div>

      {/* METRIC CARDS (Falah Meet style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="relative overflow-hidden border-border bg-card">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Rapat Berlangsung</span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">{meetings.length}</span>
              <span className="text-xs text-emerald-600 font-medium">Sesi Live</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Dari total kuota 50 sesi paralel kantor</p>
          </div>
          <div className="h-1 bg-primary w-full" />
        </Card>

        {/* Metric 2 */}
        <Card className="relative overflow-hidden border-border bg-card">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Karyawan di Dalam Rapat</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-secondary flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">{totalParticipants}</span>
              <span className="text-xs text-muted-foreground font-medium">/ 180 total</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">15.5% dari seluruh karyawan aktif</p>
          </div>
          <div className="h-1 bg-secondary w-full" />
        </Card>

        {/* Metric 3 */}
        <Card className="relative overflow-hidden border-border bg-card">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Agenda Rapat Hari Ini</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">14</span>
              <span className="text-xs text-muted-foreground font-medium">agenda</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">8 selesai, 4 live, 2 terjadwal nanti</p>
          </div>
          <div className="h-1 bg-emerald-500 w-full" />
        </Card>

        {/* Metric 4 */}
        <Card className="relative overflow-hidden border-border bg-card">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Penyimpanan Cloud Rekaman</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">18.4</span>
              <span className="text-xs text-muted-foreground font-medium">/ 100 GB</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">82% sisa kuota penyimpanan arsip</p>
          </div>
          <div className="h-1 bg-purple-500 w-full" />
        </Card>
      </div>

      {/* ACTIVE LIVE MEETINGS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>Sesi Rapat Sedang Berlangsung</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Kendali langsung administrator terhadap seluruh ruangan rapat yang sedang aktif.
            </p>
          </div>
        </div>

        {/* Meetings List Table */}
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                  <th className="py-3 px-4">Nama Sesi & Kode</th>
                  <th className="py-3 px-4">Host / Inisiator</th>
                  <th className="py-3 px-4">Divisi</th>
                  <th className="py-3 px-4">Peserta</th>
                  <th className="py-3 px-4">Durasi</th>
                  <th className="py-3 px-4">Status & Fitur</th>
                  <th className="py-3 px-4 text-right">Aksi Administrator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {meetings.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                    {/* Title & Code */}
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      <div className="font-semibold text-sm text-foreground">{m.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                          #{m.roomCode}
                        </span>
                        <button
                          onClick={() => handleCopy(m.id, m.roomCode)}
                          className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
                          title="Salin Tautan Rapat"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Host */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img src={m.hostAvatar} alt={m.hostName} className="w-7 h-7 rounded-full object-cover border border-border" />
                        <span className="text-xs text-foreground font-medium">{m.hostName}</span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700 border-slate-200">
                        {m.department}
                      </Badge>
                    </td>

                    {/* Participants */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{m.participantCount}</span>
                        <span className="text-[10px] text-muted-foreground">/ {m.maxParticipants}</span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 text-muted-foreground font-mono">
                      {m.durationMinutes} menit
                    </td>

                    {/* Status & Flags */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {m.isRecording && (
                          <Badge variant="destructive" className="gap-1 text-[10px] py-0 px-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            REC
                          </Badge>
                        )}
                        {m.isLocked ? (
                          <Badge variant="warning" className="gap-1 text-[10px] py-0 px-1.5">
                            <Lock className="w-2.5 h-2.5" /> Terkunci
                          </Badge>
                        ) : (
                          <Badge variant="success" className="gap-1 text-[10px] py-0 px-1.5">
                            <Unlock className="w-2.5 h-2.5" /> Terbuka
                          </Badge>
                        )}
                        {m.hasPassword && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-1 rounded border border-border">
                            PIN
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Join live meeting */}
                        <div>
                          <Link href={`/meet/${m.roomCode}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                              title="Masuk ke Ruangan Rapat Ini"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span className="sr-only">Masuk</span>
                            </Button>
                          </Link>
                        </div>

                        {/* View attendees */}
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMeeting(m)}
                            className="w-8 h-8 p-0 border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            title="Lihat Daftar Peserta"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="sr-only">Peserta</span>
                          </Button>
                        </div>

                        {/* Edit Room */}
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditModal(m)}
                            className="w-8 h-8 p-0 border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Pengaturan Ruang Rapat"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>

                        {/* Toggle lock */}
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleLock(m.id)}
                            className="w-8 h-8 p-0 border-border cursor-pointer hover:bg-muted"
                            title={m.isLocked ? "Buka Kunci Ruangan" : "Kunci Ruangan"}
                          >
                            {m.isLocked ? <Unlock className="w-3.5 h-3.5 text-amber-600" /> : <Lock className="w-3.5 h-3.5" />}
                            <span className="sr-only">{m.isLocked ? "Buka Kunci" : "Kunci"}</span>
                          </Button>
                        </div>

                        {/* Terminate session */}
                        <div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setEndMeetingDialog(m)}
                            className="w-8 h-8 p-0 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                            title="Hentikan Sesi Rapat"
                          >
                            <PhoneOff className="w-3.5 h-3.5" />
                            <span className="sr-only">Akhiri</span>
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* DIALOG: VIEW PARTICIPANTS IN MEETING */}
      <Dialog open={!!selectedMeeting} onOpenChange={(open) => !open && setSelectedMeeting(null)}>
        {selectedMeeting && (
          <>
            <DialogHeader>
              <DialogTitle>Daftar Peserta Rapat</DialogTitle>
              <DialogDescription>
                {selectedMeeting.title} • {selectedMeeting.participantCount} peserta aktif
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 my-2 max-h-72 overflow-y-auto">
              {selectedMeeting.attendees.map((att, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/20 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={att.avatar} alt={att.name} className="w-7 h-7 rounded-full object-cover border border-border" />
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        {att.name}
                        {att.role === "Host" && (
                          <Badge variant="outline" className="text-[9px] py-0 px-1 border-primary/30 text-primary">Host</Badge>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{selectedMeeting.department}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={att.isMuted ? "outline" : "success"} className="text-[10px] py-0">
                      {att.isMuted ? "Mic Off" : "Mic On"}
                    </Badge>
                    <Badge variant={att.isCameraOn ? "info" : "outline"} className="text-[10px] py-0">
                      {att.isCameraOn ? "Cam On" : "Cam Off"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button onClick={() => setSelectedMeeting(null)}>Tutup</Button>
            </DialogFooter>
          </>
        )}
      </Dialog>

      {/* DIALOG: TERMINATE MEETING CONFIRMATION */}
      <Dialog open={!!endMeetingDialog} onOpenChange={(open) => !open && setEndMeetingDialog(null)}>
        {endMeetingDialog && (
          <>
            <DialogHeader>
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2">
                <AlertCircle className="w-5 h-5" />
              </div>
              <DialogTitle>Hentikan Sesi Rapat?</DialogTitle>
              <DialogDescription>
                Anda akan mengakhiri sesi <span className="font-semibold text-foreground">&quot;{endMeetingDialog.title}&quot;</span> secara paksa. Seluruh ({endMeetingDialog.participantCount}) peserta yang sedang aktif akan otomatis terputus dari ruangan.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEndMeetingDialog(null)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={() => handleEndMeeting(endMeetingDialog.id)}>
                Hentikan Sesi Sekarang
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>

      {/* DIALOG: EDIT MEETING SETTINGS */}
      <Dialog open={!!editingMeeting} onOpenChange={(open) => !open && setEditingMeeting(null)}>
        {editingMeeting && (
          <>
            <DialogHeader>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                <Pencil className="w-5 h-5" />
              </div>
              <DialogTitle>Edit Pengaturan Ruang Rapat</DialogTitle>
              <DialogDescription>
                Sesuaikan judul, kode akses, divisi, kapasitas kuota, dan aturan keamanan untuk ruang rapat ini.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2 text-xs max-h-[460px] overflow-y-auto pr-1">
              {/* Judul Rapat */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Judul Rapat</label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Contoh: Engineering Standup, Product Sync"
                  className="text-xs"
                />
              </div>

              {/* Tautan Akses & Kode Ruangan */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Tautan Akses & Kode Ruangan</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-muted/60 border border-input rounded-md font-mono text-xs text-foreground select-all truncate">
                    https://meet.falah.one/{editRoomCode}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerateEditCode}
                    title="Acak ulang kode ruangan"
                    className="cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyEditLink}
                    className="gap-1 cursor-pointer"
                  >
                    {editCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {editCopied ? "Tersalin!" : "Salin"}
                  </Button>
                </div>
              </div>

              {/* Divisi Penanggung Jawab */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Divisi Penanggung Jawab</label>
                <select
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                >
                  {INITIAL_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name} ({dept.memberCount} Anggota)
                    </option>
                  ))}
                  <option value="All Hands">All Hands</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* Kapasitas Maksimal Peserta */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Kapasitas Maksimal Peserta</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setEditMaxParticipants(cap)}
                      className={`py-1.5 px-3 rounded-md text-xs border font-medium transition-colors cursor-pointer ${
                        editMaxParticipants === cap
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {cap} Peserta
                    </button>
                  ))}
                </div>
              </div>

              {/* Keamanan & Kontrol Sesi */}
              <div className="p-3 bg-card rounded-lg border border-border space-y-3">
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-primary" /> Keamanan & Kontrol Sesi
                </div>

                {/* Kata Sandi */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Lindungi dengan PIN / Kata Sandi</div>
                    <div className="text-[11px] text-muted-foreground">Wajibkan PIN sebelum peserta dapat masuk</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={editHasPassword}
                    onChange={(e) => setEditHasPassword(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                </div>

                {editHasPassword && (
                  <div className="animate-in fade-in-50 duration-150 pt-1">
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">PIN / Sandi Ruangan</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                      <Input
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="pl-8 text-xs font-mono tracking-widest"
                        maxLength={10}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingMeeting(null)}>
                Batal
              </Button>
              <Button onClick={handleSaveEditMeeting} className="gap-1.5 cursor-pointer">
                <Check className="w-3.5 h-3.5" /> Simpan Perubahan
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </div>
  );
}
