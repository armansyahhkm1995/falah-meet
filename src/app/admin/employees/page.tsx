"use client";

import * as React from "react";
import {
  Users,
  Search,
  Plus,
  Pencil,
  Trash2,
  Building2,
  Mail,
  Shield,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  UserCheck,
  PhoneCall,
  Upload,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { INITIAL_EMPLOYEES, INITIAL_ACTIVE_MEETINGS, type Employee, type DepartmentName } from "@/lib/mock-data";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = React.useState<Employee[]>(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = React.useState<string>("All");

  // Selection states for Bulk Actions
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // CRUD Modals
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = React.useState<Employee | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);

  // Call to room modal state
  const [callModalTarget, setCallModalTarget] = React.useState<{ names: string[]; count: number } | null>(null);
  const [selectedRoomId, setSelectedRoomId] = React.useState<string>(INITIAL_ACTIVE_MEETINGS[0].id);
  const [meetingSearchQuery, setMeetingSearchQuery] = React.useState("");

  // Form states
  const [formName, setFormName] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formDept, setFormDept] = React.useState<DepartmentName>("Engineering");
  const [formRole, setFormRole] = React.useState("");
  const [formStatus, setFormStatus] = React.useState<"active" | "offline">("active");
  const [formAvatar, setFormAvatar] = React.useState<string>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
  );
  const [avatarPreview, setAvatarPreview] = React.useState<string>("");

  const departmentList: DepartmentName[] = [
    "Engineering",
    "Product & Design",
    "Marketing & Growth",
    "People & Operations",
    "Executive",
  ];

  // Open Edit Modal with populated data
  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormName(emp.name);
    setFormEmail(emp.email);
    setFormDept(emp.department);
    setFormRole(emp.role);
    setFormStatus(emp.status === "offline" ? "offline" : "active");
    setFormAvatar(emp.avatar);
    setAvatarPreview(emp.avatar);
  };

  // Handle avatar upload simulation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const simulatedUrl = URL.createObjectURL(file);
      setAvatarPreview(simulatedUrl);
      setFormAvatar(simulatedUrl);
    }
  };

  // Submit Add Employee
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formRole.trim()) return;

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: formName.trim(),
      email: formEmail.trim(),
      avatar:
        formAvatar ||
        `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50000)}?w=100&auto=format&fit=crop&q=80`,
      department: formDept,
      role: formRole.trim(),
      status: formStatus,
      lastActive: "Baru saja ditambahkan",
    };

    setEmployees((prev) => [newEmp, ...prev]);
    setIsAddOpen(false);
    resetForm();
  };

  // Submit Edit Employee
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === editingEmployee.id
          ? {
              ...emp,
              name: formName.trim(),
              email: formEmail.trim(),
              department: formDept,
              role: formRole.trim(),
              status: formStatus,
              avatar: formAvatar || emp.avatar,
            }
          : emp
      )
    );
    setEditingEmployee(null);
    resetForm();
  };

  // Submit Delete
  const handleDeleteSubmit = () => {
    if (!deletingEmployee) return;
    setEmployees((prev) => prev.filter((emp) => emp.id !== deletingEmployee.id));
    setDeletingEmployee(null);
  };

  // Submit Bulk Delete
  const handleBulkDeleteSubmit = () => {
    setEmployees((prev) => prev.filter((emp) => !selectedIds.has(emp.id)));
    setSelectedIds(new Set());
    setBulkDeleteOpen(false);
  };

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormDept("Engineering");
    setFormRole("");
    setFormStatus("active");
    setFormAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80");
    setAvatarPreview("");
  };

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(filteredEmployees.map((emp) => emp.id));
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

  // Call handlers
  const handleIndividualCall = (emp: Employee) => {
    setMeetingSearchQuery("");
    setCallModalTarget({ names: [emp.name], count: 1 });
  };

  const handleBulkCall = () => {
    setMeetingSearchQuery("");
    const names = employees.filter((e) => selectedIds.has(e.id)).map((e) => e.name);
    setCallModalTarget({ names, count: names.length });
  };

  // Filter active meetings for call modal
  const filteredActiveMeetings = INITIAL_ACTIVE_MEETINGS.filter((m) =>
    m.title.toLowerCase().includes(meetingSearchQuery.toLowerCase()) ||
    m.roomCode.toLowerCase().includes(meetingSearchQuery.toLowerCase()) ||
    m.hostName.toLowerCase().includes(meetingSearchQuery.toLowerCase()) ||
    m.department.toLowerCase().includes(meetingSearchQuery.toLowerCase())
  );

  const handleConfirmCallToRoom = () => {
    if (!callModalTarget) return;
    const targetRoom = INITIAL_ACTIVE_MEETINGS.find((m) => m.id === selectedRoomId);
    alert(
      `📞 Panggilan Berhasil Dikirimkan!\n\n` +
      `Karyawan (${callModalTarget.count} orang): ${callModalTarget.names.join(", ")}\n` +
      `Telah dipanggil langsung untuk bergabung ke ruang rapat aktif: "${targetRoom?.title}" (Kode: #${targetRoom?.roomCode}).\n` +
      `Notifikasi popup berdering langsung di layar perangkat mereka.`
    );
    setCallModalTarget(null);
    setSelectedIds(new Set());
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchDept = selectedDeptFilter === "All" || emp.department === selectedDeptFilter;
    const matchSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  const isAllSelected =
    filteredEmployees.length > 0 &&
    filteredEmployees.every((emp) => selectedIds.has(emp.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Data Karyawan</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Kelola data seluruh karyawan, tentukan penugasan divisi, dan panggil langsung ke ruang rapat aktif.
          </p>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
          className="gap-2 text-xs font-medium shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Karyawan Baru</span>
        </Button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, jabatan, atau divisi..."
            className="pl-9 text-xs"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Filter Divisi:</span>
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="h-8 rounded-md border border-input bg-card px-2 text-xs outline-none"
          >
            <option value="All">Semua Divisi ({employees.length})</option>
            {departmentList.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* BULK ACTION BAR (Visible when checkboxes selected) */}
      {selectedIds.size > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-medium text-primary">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>{selectedIds.size} karyawan dipilih</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={handleBulkCall}
              className="h-8 text-xs gap-1.5 shadow-2xs"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Panggil ke Rapat ({selectedIds.size})</span>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setBulkDeleteOpen(true)}
              className="h-8 text-xs gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
            >
              <Trash2 className="w-3 h-3" />
              <span>Hapus Terpilih</span>
            </Button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <Card className="border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                {/* Checkbox All */}
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="accent-primary rounded cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Nama Karyawan</th>
                <th className="py-3 px-4">Divisi Terdaftar</th>
                <th className="py-3 px-4">Jabatan / Peran</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Tidak ditemukan karyawan yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const isSelected = selectedIds.has(emp.id);
                  return (
                    <tr
                      key={emp.id}
                      className={`transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-muted/30"}`}
                    >
                      {/* Checkbox per row */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(emp.id)}
                          className="accent-primary rounded cursor-pointer"
                        />
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-9 h-9 rounded-full object-cover border border-border"
                          />
                          <div>
                            <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                              {emp.name}
                              {emp.department === "Executive" && (
                                <span title="Administrator">
                                  <Shield className="w-3.5 h-3.5 text-primary" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono">{emp.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Department Assigned */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant="secondary"
                          className="text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 gap-1.5"
                        >
                          <Building2 className="w-3 h-3" />
                          {emp.department}
                        </Badge>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 font-medium text-foreground">{emp.role}</td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {emp.status === "in_meeting" && (
                          <Badge variant="destructive" className="gap-1 text-[10px] py-0.5 px-2 bg-rose-50 text-rose-700 border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            Sedang Rapat
                          </Badge>
                        )}
                        {emp.status === "active" && (
                          <Badge variant="success" className="gap-1 text-[10px] py-0.5 px-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Aktif (Online)
                          </Badge>
                        )}
                        {emp.status === "offline" && (
                          <Badge variant="outline" className="gap-1 text-[10px] py-0.5 px-2 text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Offline
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Call Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleIndividualCall(emp)}
                            className="h-7 px-2 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                            title="Panggil Karyawan ke Ruang Rapat"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>Panggil</span>
                          </Button>

                          {/* Edit */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(emp)}
                            className="h-7 px-2 text-xs gap-1"
                            title="Edit & Assign Divisi"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit</span>
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingEmployee(emp)}
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Hapus Karyawan"
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
      </Card>

      {/* MODAL: TAMBAH KARYAWAN (Inputs strictly stacked vertically) */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <form onSubmit={handleAddSubmit}>
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
              <Users className="w-5 h-5" />
            </div>
            <DialogTitle>Tambah Karyawan Baru</DialogTitle>
            <DialogDescription>
              Daftarkan profil karyawan kantor dan tentukan penugasan divisinya.
            </DialogDescription>
          </DialogHeader>

          {/* STRICT VERTICAL STACK */}
          <div className="flex flex-col space-y-4 my-3 text-xs max-h-[460px] overflow-y-auto pr-1">
            {/* 1. Foto Profil Karyawan (Upload) */}
            <div className="p-3 bg-muted/30 border border-border rounded-lg space-y-2">
              <label className="block text-xs font-semibold text-foreground">Foto Profil Karyawan</label>
              <div className="flex items-center gap-3">
                <img
                  src={avatarPreview || formAvatar}
                  alt="Preview"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shrink-0"
                />
                <div className="flex-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-input bg-card hover:bg-accent text-xs font-medium cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-muted-foreground mt-1">Format JPG, PNG (Maksimal 2 MB)</p>
                </div>
              </div>
            </div>

            {/* 2. Nama Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Nama Lengkap</label>
              <Input
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Contoh: Muhammad Farhan"
                className="text-xs"
              />
            </div>

            {/* 3. Email Kantor */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Email Kantor (@falah.one)</label>
              <Input
                required
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="farhan@falah.one"
                className="text-xs font-mono"
              />
            </div>

            {/* 4. Penugasan Divisi */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Penugasan Divisi <span className="text-primary">*</span>
              </label>
              <select
                value={formDept}
                onChange={(e) => setFormDept(e.target.value as DepartmentName)}
                className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs outline-none focus:ring-1 focus:ring-primary cursor-pointer font-medium"
              >
                {departmentList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Jabatan / Peran */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Jabatan / Peran</label>
              <Input
                required
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                placeholder="Contoh: Senior Backend Engineer"
                className="text-xs"
              />
            </div>

            {/* 6. Status Akun */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Status Awal</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as "active" | "offline")}
                className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs outline-none cursor-pointer"
              >
                <option value="active">Aktif (Tersedia untuk Rapat)</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan & Daftarkan Karyawan</Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* MODAL: EDIT KARYAWAN & ASSIGN DIVISI (Inputs strictly stacked vertically) */}
      <Dialog open={!!editingEmployee} onOpenChange={(open) => !open && setEditingEmployee(null)}>
        {editingEmployee && (
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-2">
                <Pencil className="w-5 h-5" />
              </div>
              <DialogTitle>Edit & Assign Divisi Karyawan</DialogTitle>
              <DialogDescription>
                Perbarui profil, foto, dan penugasan divisi untuk <span className="font-semibold text-foreground">{editingEmployee.name}</span>.
              </DialogDescription>
            </DialogHeader>

            {/* STRICT VERTICAL STACK */}
            <div className="flex flex-col space-y-4 my-3 text-xs max-h-[460px] overflow-y-auto pr-1">
              {/* 1. Upload Foto Profil */}
              <div className="p-3 bg-muted/30 border border-border rounded-lg space-y-2">
                <label className="block text-xs font-semibold text-foreground">Ganti Foto Profil</label>
                <div className="flex items-center gap-3">
                  <img
                    src={avatarPreview || formAvatar}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shrink-0"
                  />
                  <div className="flex-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-input bg-card hover:bg-accent text-xs font-medium cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Pilih Foto Baru</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-muted-foreground mt-1">Perbarui avatar resmi karyawan</p>
                  </div>
                </div>
              </div>

              {/* 2. Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Nama Lengkap</label>
                <Input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="text-xs"
                />
              </div>

              {/* 3. Email Kantor */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Email Kantor</label>
                <Input
                  required
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>

              {/* 4. Assign Divisi */}
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 space-y-1">
                <label className="block text-xs font-bold text-primary">
                  Ubah Penugasan Divisi
                </label>
                <select
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value as DepartmentName)}
                  className="w-full h-9 rounded-md border border-primary/40 bg-card px-3 text-xs outline-none font-semibold text-foreground cursor-pointer"
                >
                  {departmentList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Karyawan ini otomatis dipindahkan ke daftar anggota divisi tersebut.
                </p>
              </div>

              {/* 5. Jabatan / Peran */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Jabatan / Peran</label>
                <Input
                  required
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="text-xs"
                />
              </div>

              {/* 6. Status Akun */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Status Akun</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "active" | "offline")}
                  className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs outline-none cursor-pointer"
                >
                  <option value="active">Aktif (Tersedia Rapat)</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingEmployee(null)}>
                Batal
              </Button>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        )}
      </Dialog>

      {/* MODAL: PILIH RUANG RAPAT AKTIF (PANGGIL INDIVIDUAL / BULK) */}
      <Dialog open={!!callModalTarget} onOpenChange={(open) => !open && setCallModalTarget(null)}>
        {callModalTarget && (
          <>
            <DialogHeader>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                <PhoneCall className="w-5 h-5" />
              </div>
              <DialogTitle>Panggil Karyawan ke Ruang Rapat</DialogTitle>
              <DialogDescription>
                Pilih sesi rapat aktif tujuan untuk memasukkan{" "}
                <span className="font-semibold text-foreground">
                  {callModalTarget.count === 1
                    ? callModalTarget.names[0]
                    : `${callModalTarget.count} karyawan terpilih`}
                </span>
                . Notifikasi pringatan akan berdering langsung di layar mereka.
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
                            name="target_meeting_emp"
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

      {/* MODAL: HAPUS KARYAWAN INDIVIDUAL */}
      <Dialog open={!!deletingEmployee} onOpenChange={(open) => !open && setDeletingEmployee(null)}>
        {deletingEmployee && (
          <>
            <DialogHeader>
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2">
                <AlertCircle className="w-5 h-5" />
              </div>
              <DialogTitle>Hapus Data Karyawan?</DialogTitle>
              <DialogDescription>
                Anda akan menghapus akun <span className="font-semibold text-foreground">&quot;{deletingEmployee.name}&quot;</span> ({deletingEmployee.email}). Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingEmployee(null)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDeleteSubmit}>
                Hapus Karyawan
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>

      {/* MODAL: BULK DELETE CONFIRMATION */}
      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogHeader>
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2">
            <AlertCircle className="w-5 h-5" />
          </div>
          <DialogTitle>Hapus {selectedIds.size} Karyawan Terpilih?</DialogTitle>
          <DialogDescription>
            Tindakan ini akan menghapus akun {selectedIds.size} karyawan yang dicentang secara permanen dari sistem.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleBulkDeleteSubmit}>
            Hapus {selectedIds.size} Karyawan
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
