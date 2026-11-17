"use client";

import * as React from "react";
import {
  Search,
  Play,
  Download,
  Share2,
  Trash2,
  Check,
  HardDrive,
  FileVideo,
  Pause,
  Volume2,
  Maximize2,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { INITIAL_RECORDINGS, type Recording } from "@/lib/mock-data";

export default function AdminRecordingsPage() {
  const [recordings, setRecordings] = React.useState<Recording[]>(INITIAL_RECORDINGS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [previewRecording, setPreviewRecording] = React.useState<Recording | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Recording | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);

  const filteredRecordings = recordings.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roomCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAllSelected =
    filteredRecordings.length > 0 &&
    filteredRecordings.every((r) => selectedIds.has(r.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRecordings.map((r) => r.id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopyLink = (id: string, code: string) => {
    navigator.clipboard.writeText(`https://meet.falah.one/recordings/${code}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setDeleteConfirm(null);
  };

  const handleBulkDeleteSubmit = () => {
    setRecordings((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
    setBulkDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Arsip Rekaman Kantor</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Seluruh rekaman cloud rapat internal perusahaan. Tersimpan aman di bucket S3 privat internal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs py-1 px-3 bg-card border-border gap-2">
            <HardDrive className="w-3.5 h-3.5 text-primary" />
            <span>Penyimpanan: 18.4 GB / 100 GB</span>
          </Badge>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul rekaman rapat atau nama host..."
            className="pl-9 text-xs"
          />
        </div>

        <span className="text-xs text-muted-foreground">
          Menampilkan <span className="font-semibold text-foreground">{filteredRecordings.length}</span> rekaman
        </span>
      </div>

      {/* BULK ACTION BAR */}
      {selectedIds.size > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-medium text-primary">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>{selectedIds.size} rekaman dipilih</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setBulkDeleteOpen(true)}
              className="h-8 text-xs gap-1.5 bg-red-600 hover:bg-red-700 text-white shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Terpilih ({selectedIds.size})</span>
            </Button>
          </div>
        </div>
      )}

      {/* RECORDINGS TABLE */}
      <Card className="border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    aria-label="Pilih Semua Rekaman"
                    className="w-4 h-4 rounded border-border text-primary cursor-pointer accent-primary align-middle"
                  />
                </th>
                <th className="py-3 px-4">Judul Rapat</th>
                <th className="py-3 px-4">Inisiator (Host)</th>
                <th className="py-3 px-4">Divisi</th>
                <th className="py-3 px-4">Tanggal Rekam</th>
                <th className="py-3 px-4">Durasi</th>
                <th className="py-3 px-4">Ukuran</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecordings.map((rec) => (
                <tr
                  key={rec.id}
                  className={`hover:bg-muted/30 transition-colors ${
                    selectedIds.has(rec.id) ? "bg-primary/5" : ""
                  }`}
                >
                  {/* Row Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(rec.id)}
                      onChange={() => handleToggleSelect(rec.id)}
                      aria-label={`Pilih rekaman ${rec.title}`}
                      className="w-4 h-4 rounded border-border text-primary cursor-pointer accent-primary align-middle"
                    />
                  </td>

                  {/* Title & Preview Button */}
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPreviewRecording(rec)}
                        className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Tonton Preview"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>
                      <div>
                        <div
                          onClick={() => setPreviewRecording(rec)}
                          className="font-semibold text-sm text-foreground hover:text-primary transition-colors cursor-pointer line-clamp-1"
                        >
                          {rec.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">#{rec.roomCode}</div>
                      </div>
                    </div>
                  </td>

                  {/* Host */}
                  <td className="py-3.5 px-4 text-foreground">{rec.hostName}</td>

                  {/* Department */}
                  <td className="py-3.5 px-4">
                    <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700 border-slate-200">
                      {rec.department}
                    </Badge>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-muted-foreground">{rec.date}</td>

                  {/* Duration */}
                  <td className="py-3.5 px-4 font-mono text-muted-foreground">{rec.duration}</td>

                  {/* File size */}
                  <td className="py-3.5 px-4 font-mono text-muted-foreground">{rec.fileSize}</td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Copy Share Link */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(rec.id, rec.roomCode)}
                        className="h-7 px-2 text-xs gap-1"
                        title="Salin Tautan Berbagi"
                      >
                        {copiedId === rec.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3 h-3" />
                            <span>Bagikan</span>
                          </>
                        )}
                      </Button>

                      {/* Download */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => alert(`Mengunduh file rekaman: ${rec.title} (${rec.fileSize})`)}
                        className="h-7 w-7 p-0"
                        title="Unduh MP4"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(rec)}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Hapus Rekaman"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DIALOG: VIDEO PREVIEW PLAYER (Apple Style Sleek Video Modal) */}
      <Dialog open={!!previewRecording} onOpenChange={(open) => !open && setPreviewRecording(null)}>
        {previewRecording && (
          <div className="-m-6">
            {/* Fake Video Player Canvas */}
            <div className="relative aspect-video w-full bg-slate-950 flex flex-col justify-between p-4 overflow-hidden rounded-t-xl group">
              {/* Meeting watermark info */}
              <div className="flex items-center justify-between text-xs text-white/80 z-10">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="bg-red-600 text-white font-mono text-[10px] py-0">
                    RECORDED
                  </Badge>
                  <span className="font-medium truncate max-w-xs">{previewRecording.title}</span>
                </div>
                <span className="font-mono text-[11px] text-white/60">{previewRecording.date}</span>
              </div>

              {/* Simulated video playback visuals */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2 opacity-80">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto border border-white/20">
                    <FileVideo className="w-8 h-8 text-white/90" />
                  </div>
                  <div className="text-xs text-white/70 font-medium">Sesi Rapat: {previewRecording.roomCode}</div>
                </div>
              </div>

              {/* Player Bottom Control Bar */}
              <div className="z-10 space-y-2 bg-gradient-to-t from-slate-950/90 to-transparent p-2 rounded-lg">
                {/* Progress bar */}
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                  <div className="h-full bg-primary rounded-full w-1/3" />
                </div>

                <div className="flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <span className="font-mono text-[11px] text-white/80">14:22 / {previewRecording.duration}</span>
                    <Volume2 className="w-4 h-4 text-white/80" />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-white/80">
                    <span className="px-1.5 py-0.5 rounded bg-white/10 font-mono">1.0x</span>
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Video Meta & Actions */}
            <div className="p-6 bg-card rounded-b-xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-foreground">{previewRecording.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Dipandu oleh <span className="font-medium text-foreground">{previewRecording.hostName}</span> ({previewRecording.department}) • Ditonton {previewRecording.views} kali
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(previewRecording.id, previewRecording.roomCode)}
                  className="gap-1.5 text-xs"
                >
                  <Share2 className="w-3.5 h-3.5" /> Bagikan Tautan
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => alert(`Mengunduh file: ${previewRecording.title}`)}
                  className="gap-1.5 text-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh MP4 ({previewRecording.fileSize})
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* DIALOG: DELETE CONFIRMATION */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        {deleteConfirm && (
          <>
            <DialogHeader>
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2">
                <AlertCircle className="w-5 h-5" />
              </div>
              <DialogTitle>Hapus Rekaman Rapat?</DialogTitle>
              <DialogDescription>
                File rekaman <span className="font-semibold text-foreground">&quot;{deleteConfirm.title}&quot;</span> ({deleteConfirm.fileSize}) akan dihapus secara permanen dari server penyimpanan cloud. Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm.id)}>
                Hapus Permanen
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
          <DialogTitle>Hapus {selectedIds.size} Rekaman Terpilih?</DialogTitle>
          <DialogDescription>
            Sebanyak <span className="font-semibold text-foreground">{selectedIds.size} file rekaman</span> akan dihapus secara permanen dari server penyimpanan cloud. Ruang kuota penyimpanan akan segera dibebaskan. Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleBulkDeleteSubmit}>
            Hapus Semua ({selectedIds.size})
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
