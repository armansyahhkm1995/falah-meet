"use client";

import * as React from "react";
import {
  Building2,
  Users2,
  Video,
  Search,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Trash2,
  AlertCircle,
  Radio,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { INITIAL_DEPARTMENTS, INITIAL_EMPLOYEES, INITIAL_ACTIVE_MEETINGS, type DepartmentName, type Employee, type ActiveMeeting } from "@/lib/mock-data";
import Link from "next/link";

export default function AdminDepartmentsPage() {
  const [selectedDept, setSelectedDept] = React.useState<DepartmentName>("Engineering");
  const [employeeSearch, setEmployeeSearch] = React.useState("");
  const [employees, setEmployees] = React.useState<Employee[]>(INITIAL_EMPLOYEES);

  // Checkbox selection states
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // Call to room modal state
  const [callModalTarget, setCallModalTarget] = React.useState<{ names: string[]; count: number } | null>(null);
  const [selectedRoomId, setSelectedRoomId] = React.useState<string>(INITIAL_ACTIVE_MEETINGS[0].id);
  const [meetingSearchQuery, setMeetingSearchQuery] = React.useState("");

  // Delete confirmation modal states
  const [deletingEmployee, setDeletingEmployee] = React.useState<Employee | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);

  const departments = INITIAL_DEPARTMENTS;

  // Filter employees belonging to the selected department
  const currentDeptEmployees = employees.filter((emp) => {
    const matchDept = emp.department === selectedDept;
    const matchSearch =
      emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.email.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.role.toLowerCase().includes(employeeSearch.toLowerCase());
    return matchDept && matchSearch;
  });

  const activeDeptInfo = departments.find((d) => d.name === selectedDept) || departments[0];

  // Filter active meeting rooms for call modal
  const filteredActiveMeetings = INITIAL_ACTIVE_MEETINGS.filter((m) =>
    m.title.toLowerCase().includes(meetingSearchQuery.toLowerCase()) ||
    m.roomCode.toLowerCase().includes(meetingSearchQuery.toLowerCase()) ||
    m.hostName.toLowerCase().includes(meetingSearchQuery.toLowerCase()) ||
    m.department.toLowerCase().includes(meetingSearchQuery.toLowerCase())
  );

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(currentDeptEmployees.map((emp) => emp.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Trigger individual call
  const handleIndividualCall = (emp: Employee) => {
    setMeetingSearchQuery("");
    setCallModalTarget({ names: [emp.name], count: 1 });
  };

  // Trigger bulk call
  const handleBulkCall = () => {
    setMeetingSearchQuery("");
    const names = employees.filter((e) => selectedIds.has(e.id)).map((e) => e.name);
    setCallModalTarget({ names, count: names.length });
  };

  // Submit call to room
  const handleConfirmCallToRoom = () => {
    if (!callModalTarget) return;
    const targetRoom = INITIAL_ACTIVE_MEETINGS.find((m) => m.id === selectedRoomId);
    alert(
      `📞 Panggilan Dikirim!\n\n` +
      `Karyawan (${callModalTarget.count} orang): ${callModalTarget.names.join(", ")}\n` +
      `Telah dipanggil langsung untuk bergabung ke ruang rapat aktif: "${targetRoom?.title}" (Kode: #${targetRoom?.roomCode}).\n` +
      `Notifikasi popup instan dan panggilan suara berdering di perangkat mereka.`
    );
    setCallModalTarget(null);
    setSelectedIds(new Set());
  };

  // Individual delete action
  const handleDeleteIndividual = () => {
    if (!deletingEmployee) return;
    setEmployees((prev) => prev.filter((e) => e.id !== deletingEmployee.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deletingEmployee.id);
      return next;
    });
    setDeletingEmployee(null);
  };

  // Bulk delete action
  const handleConfirmBulkDelete = () => {
    setEmployees((prev) => prev.filter((e) => !selectedIds.has(e.id)));
    setSelectedIds(new Set());
    setBulkDeleteOpen(false);
  };

  const isAllSelected =
    currentDeptEmployees.length > 0 &&
    currentDeptEmployees.every((emp) => selectedIds.has(emp.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Divisi Karyawan</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Struktur pengelompokan divisi kantor. Pantau anggota tim tiap divisi dan lakukan panggil rapat atau kelola anggota.
          </p>
        </div>

        {/* Primary button as requested: "Kelola & Assign Karyawan" */}
        <Link href="/admin/employees">
          <Button variant="default" size="sm" className="gap-2 text-xs font-semibold shadow-xs">
            <Users2 className="w-3.5 h-3.5" />
            <span>Kelola & Assign Karyawan</span>
          </Button>
        </Link>
      </div>

      {/* 5 DEPARTMENT CARDS (Top overview) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {departments.map((dept) => {
          const isSelected = selectedDept === dept.name;
          return (
            <div
              key={dept.id}
              onClick={() => {
                setSelectedDept(dept.name);
                setSelectedIds(new Set());
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "bg-card border-primary ring-2 ring-primary/20 shadow-sm"
                  : "bg-card/70 border-border hover:border-slate-300 hover:bg-card"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  {dept.activeInMeetingCount > 0 && (
                    <Badge variant="destructive" className="gap-1 text-[9px] py-0 px-1.5 bg-rose-50 text-rose-700 border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      {dept.activeInMeetingCount} Live
                    </Badge>
                  )}
                </div>

                <div className="font-bold text-sm text-foreground line-clamp-1">{dept.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Lead: <span className="text-foreground font-medium">{dept.leadName}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">Anggota</span>
                <span className="font-bold text-foreground font-mono">{dept.memberCount}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED DIVISION ROSTER & DETAILS */}
      <Card className="border-border bg-card relative">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <span>Daftar Anggota Divisi:</span>
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 font-bold">
                    {activeDeptInfo.name}
                  </Badge>
                </CardTitle>
              </div>
              <CardDescription className="mt-1">
                {activeDeptInfo.description} • Kepala Divisi: <span className="font-semibold text-foreground">{activeDeptInfo.leadName}</span>
              </CardDescription>
            </div>

            {/* Search within department */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
              <Input
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Cari anggota divisi..."
                className="pl-8 text-xs h-8"
              />
            </div>
          </div>
        </CardHeader>

        {/* BULK ACTION BAR (Floats when items selected) */}
        {selectedIds.size > 0 && (
          <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-between text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2 font-medium text-primary">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>{selectedIds.size} karyawan divisi terpilih</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={handleBulkCall}
                className="h-7 text-xs gap-1.5 shadow-2xs"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Panggil ke Rapat ({selectedIds.size})</span>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setBulkDeleteOpen(true)}
                className="h-7 text-xs gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
              >
                <Trash2 className="w-3 h-3" />
                <span>Hapus Terpilih</span>
              </Button>
            </div>
          </div>
        )}

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-medium">
                  {/* Select All Checkbox */}
                  <th className="py-2.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="accent-primary rounded cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-4">Nama Anggota</th>
                  <th className="py-2.5 px-4">Jabatan</th>
                  <th className="py-2.5 px-4">Status Rapat</th>
                  <th className="py-2.5 px-4">Aktivitas Terakhir</th>
                  <th className="py-2.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentDeptEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Belum ada karyawan yang di-assign ke divisi ini atau tidak ada hasil pencarian.
                    </td>
                  </tr>
                ) : (
                  currentDeptEmployees.map((emp) => {
                    const isSelected = selectedIds.has(emp.id);
                    return (
                      <tr
                        key={emp.id}
                        className={`transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-muted/30"}`}
                      >
                        {/* Checkbox per row */}
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(emp.id)}
                            className="accent-primary rounded cursor-pointer"
                          />
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-8 h-8 rounded-full object-cover border border-border"
                            />
                            <div>
                              <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                                {emp.name}
                                {emp.name === activeDeptInfo.leadName && (
                                  <Badge variant="outline" className="text-[9px] py-0 px-1 border-primary/30 text-primary font-semibold">
                                    Lead
                                  </Badge>
                                )}
                              </div>
                              <div className="text-[10px] text-muted-foreground font-mono">{emp.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-medium text-foreground">{emp.role}</td>

                        <td className="py-3 px-4">
                          {emp.status === "in_meeting" && (
                            <Badge variant="destructive" className="gap-1 text-[9px] py-0 px-1.5 bg-rose-50 text-rose-700 border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              Sedang Rapat
                            </Badge>
                          )}
                          {emp.status === "active" && (
                            <Badge variant="success" className="gap-1 text-[9px] py-0 px-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Online
                            </Badge>
                          )}
                          {emp.status === "offline" && (
                            <Badge variant="outline" className="gap-1 text-[9px] py-0 px-1.5 text-muted-foreground">
                              Offline
                            </Badge>
                          )}
                        </td>

                        <td className="py-3 px-4 text-muted-foreground text-[11px]">{emp.lastActive}</td>

                        {/* Individual "Panggil" Action & Trash Button */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleIndividualCall(emp)}
                              className="h-7 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                              title="Panggil ke Rapat"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>Panggil ke Rapat</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingEmployee(emp)}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Hapus Karyawan"
                              aria-label="Hapus Karyawan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* DIALOG: PILIH RUANG RAPAT AKTIF UNTUK PANGGIL KARYAWAN */}
      <Dialog open={!!callModalTarget} onOpenChange={(open) => !open && setCallModalTarget(null)}>
        {callModalTarget && (
          <>
            <DialogHeader>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                <PhoneCall className="w-5 h-5" />
              </div>
              <DialogTitle>Panggil Karyawan ke Ruang Rapat</DialogTitle>
              <DialogDescription>
                Pilih sesi rapat aktif tempat Anda ingin memasukkan{" "}
                <span className="font-semibold text-foreground">
                  {callModalTarget.count === 1
                    ? callModalTarget.names[0]
                    : `${callModalTarget.count} karyawan terpilih`}
                </span>
                . Perangkat mereka akan berdering dan diarahkan otomatis ke ruangan tersebut.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 my-3 text-xs">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-foreground">
                  Pilih Ruangan Rapat Aktif:
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {filteredActiveMeetings.length} ruangan tersedia
                </span>
              </div>

              {/* Search Bar Ruangan Rapat */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
                <Input
                  value={meetingSearchQuery}
                  onChange={(e) => setMeetingSearchQuery(e.target.value)}
                  placeholder="Cari ruang rapat, kode room, atau host..."
                  className="pl-8 h-8 text-xs bg-card"
                />
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {filteredActiveMeetings.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg">
                    Tidak ada ruang rapat aktif yang sesuai &quot;{meetingSearchQuery}&quot;
                  </div>
                ) : (
                  filteredActiveMeetings.map((meeting) => {
                    const isChosen = selectedRoomId === meeting.id;
                    return (
                      <label
                        key={meeting.id}
                        onClick={() => setSelectedRoomId(meeting.id)}
                        className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                          isChosen
                            ? "bg-primary/5 border-primary ring-1 ring-primary text-foreground"
                            : "bg-card border-border hover:bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="target_meeting_dept"
                            checked={isChosen}
                            onChange={() => setSelectedRoomId(meeting.id)}
                            className="accent-primary mt-1"
                          />
                          <div>
                            <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                              {meeting.title}
                              <Badge variant="outline" className="text-[9px] py-0 font-normal">
                                {meeting.department}
                              </Badge>
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              Host: {meeting.hostName} • {meeting.participantCount} peserta aktif • #{meeting.roomCode}
                            </div>
                          </div>
                        </div>

                        <Badge variant="success" className="text-[9px] py-0 px-1.5 shrink-0">
                          Live
                        </Badge>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCallModalTarget(null)}>
                Batal
              </Button>
              <Button onClick={handleConfirmCallToRoom} className="gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" /> Kirim Panggilan Langsung
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>

      {/* DIALOG: INDIVIDUAL DELETE CONFIRMATION */}
      <Dialog open={!!deletingEmployee} onOpenChange={(open) => !open && setDeletingEmployee(null)}>
        {deletingEmployee && (
          <>
            <DialogHeader>
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2">
                <AlertCircle className="w-5 h-5" />
              </div>
              <DialogTitle>Hapus Data Karyawan?</DialogTitle>
              <DialogDescription>
                Anda akan menghapus akun <span className="font-semibold text-foreground">&quot;{deletingEmployee.name}&quot;</span> ({deletingEmployee.email}) dari divisi {selectedDept}. Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingEmployee(null)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDeleteIndividual}>
                Hapus Karyawan
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>

      {/* DIALOG: BULK DELETE CONFIRMATION */}
      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogHeader>
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2">
            <AlertCircle className="w-5 h-5" />
          </div>
          <DialogTitle>Hapus {selectedIds.size} Karyawan Terpilih?</DialogTitle>
          <DialogDescription>
            Tindakan ini akan menghapus akun {selectedIds.size} karyawan yang dicentang dari divisi {selectedDept}.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleConfirmBulkDelete}>
            Hapus {selectedIds.size} Karyawan
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
