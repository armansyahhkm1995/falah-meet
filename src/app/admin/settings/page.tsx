"use client";

import * as React from "react";
import { Shield, Check, Lock, MicOff, Disc, Clock, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function AdminPoliciesPage() {
  // Meeting policies state
  const [muteOnEntry, setMuteOnEntry] = React.useState(true);
  const [requirePassword, setRequirePassword] = React.useState(false);
  const [allowRecording, setAllowRecording] = React.useState(true);
  const [maxMeetingDuration, setMaxMeetingDuration] = React.useState("unlimited");

  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Kebijakan Rapat</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Aturan dan standar default yang otomatis diterapkan saat karyawan membuat ruang rapat baru.
          </p>
        </div>

        {savedSuccess && (
          <Badge variant="success" className="gap-1.5 py-1 px-3 animate-in fade-in duration-200">
            <Check className="w-3.5 h-3.5" />
            Kebijakan Berhasil Disimpan
          </Badge>
        )}
      </div>

      {/* POLICY CARD (100% Full Width) */}
      <Card className="border-border bg-card shadow-xs w-full">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Kebijakan Default Ruangan Rapat
          </CardTitle>
          <CardDescription>
            Konfigurasi ini berlaku serentak untuk seluruh ruangan rapat baru yang dibuat oleh 180 karyawan kantor.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 text-xs divide-y divide-border">
          {/* Policy 1: Mute on entry */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5 max-w-3xl">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <MicOff className="w-3.5 h-3.5 text-muted-foreground" />
                Semua Peserta Mute Saat Masuk (Mute on Entry)
              </div>
              <div className="text-[11px] text-muted-foreground">
                Mencegah feedback suara dan kebisingan latar belakang saat peserta bergabung ke ruangan rapat yang sedang berlangsung.
              </div>
            </div>
            <Switch checked={muteOnEntry} onCheckedChange={setMuteOnEntry} />
          </div>

          {/* Policy 2: Require Password / PIN */}
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5 max-w-3xl">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                Wajibkan Kata Sandi / PIN Ruangan Default
              </div>
              <div className="text-[11px] text-muted-foreground">
                Setiap link rapat yang digenerate otomatis dilengkapi PIN proteksi 6-digit agar tidak sembarang orang bisa masuk.
              </div>
            </div>
            <Switch checked={requirePassword} onCheckedChange={setRequirePassword} />
          </div>

          {/* Policy 3: Allow cloud recording */}
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5 max-w-3xl">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <Disc className="w-3.5 h-3.5 text-muted-foreground" />
                Izinkan Host Merekam Pertemuan ke Cloud
              </div>
              <div className="text-[11px] text-muted-foreground">
                Pembuat rapat (Host) dapat memulai rekaman cloud. File rekaman akan otomatis diarsipkan di menu Arsip Rekaman.
              </div>
            </div>
            <Switch checked={allowRecording} onCheckedChange={setAllowRecording} />
          </div>

          {/* Policy 4: Max duration */}
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5 max-w-3xl">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                Batasan Maksimal Durasi Pertemuan
              </div>
              <div className="text-[11px] text-muted-foreground">
                Sesi rapat akan otomatis dihentikan jika mencapai batas waktu durasi yang ditentukan untuk efisiensi server.
              </div>
            </div>
            <select
              value={maxMeetingDuration}
              onChange={(e) => setMaxMeetingDuration(e.target.value)}
              className="h-8 rounded-md border border-input bg-card px-3 text-xs outline-none cursor-pointer"
            >
              <option value="unlimited">Tidak Terbatas (Default Kantor)</option>
              <option value="60">Maksimal 60 Menit (1 Jam)</option>
              <option value="120">Maksimal 120 Menit (2 Jam)</option>
              <option value="180">Maksimal 180 Menit (3 Jam)</option>
            </select>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border justify-between pt-4 bg-muted/10">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Pengaturan berlaku otomatis secara real-time.
          </span>
          <Button onClick={handleSaveSettings} className="text-xs">
            Simpan Kebijakan Rapat
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
