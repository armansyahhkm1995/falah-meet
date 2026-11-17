"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  ScreenShare,
  Hand,
  Smile,
  PhoneOff,
  Users,
  MessageSquare,
  Info,
  Radio,
  Lock,
  Unlock,
  Copy,
  Check,
  Sparkles,
  Grid,
  Layout,
  Monitor,
  Send,
  Search,
  UserPlus,
  PhoneCall,
  Wifi,
  Disc,
  Volume2,
  FileText,
  PenTool,
  BarChart3,
  Dices,
  Crown,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCheck,
  UserCheck,
  UserX,
  Bell,
  SlidersHorizontal,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  Calendar,
  AlertTriangle,
  RotateCcw,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Pin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { INITIAL_ACTIVE_MEETINGS, INITIAL_EMPLOYEES, type ActiveMeeting, type Employee } from "@/lib/mock-data";
import { ExcalidrawWhiteboard } from "@/components/meeting/excalidraw-wrapper";

interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  department: string;
  time: string;
  text: string;
  isSelf?: boolean;
}

interface ReactionItem {
  id: number;
  emoji: string;
  left: number;
}

interface WaitingUser {
  id: string;
  name: string;
  avatar: string;
  department: string;
  role: string;
  requestedAt: string;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollItem {
  id: string;
  question: string;
  createdAt: string;
  isOpen: boolean;
  options: PollOption[];
}

interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  done: boolean;
}

// Helper to switch user preview photo based on virtual background selection
function getSelfPhotoByBg(bg: string) {
  switch (bg) {
    case "office":
      return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80"; // In modern bright office
    case "boardroom":
      return "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1000&auto=format&fit=crop&q=80"; // In executive boardroom
    case "cyber":
      return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80"; // Studio lighting
    case "blur":
    case "heavy-blur":
    case "none":
    default:
      return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=1000&auto=format&fit=crop&q=80"; // Original selfie camera preview
  }
}

function InMeetingContent() {
  const params = useParams();
  const router = useRouter();
  const roomId = (params?.roomId as string) || "eng-sprint-42";

  // Match room data or fallback
  const initialMeeting =
    INITIAL_ACTIVE_MEETINGS.find(
      (m) => m.roomCode.toLowerCase() === roomId.toLowerCase() || m.id === roomId
    ) || INITIAL_ACTIVE_MEETINGS[0];

  // Lobby vs In-Meeting Stage
  const [isInLobby, setIsInLobby] = React.useState(true);

  // User In-Meeting Media State
  const [isMicOn, setIsMicOn] = React.useState(true);
  const [isCameraOn, setIsCameraOn] = React.useState(true);
  const [isScreenSharing, setIsScreenSharing] = React.useState(false);
  const [isHandRaised, setIsHandRaised] = React.useState(false);
  const [virtualBg, setVirtualBg] = React.useState<"none" | "blur" | "heavy-blur" | "office" | "boardroom" | "cyber">("none");

  // Meeting Telemetry & Layout Controls
  const [isRecording, setIsRecording] = React.useState(initialMeeting.isRecording);
  const [isLocked, setIsLocked] = React.useState(initialMeeting.isLocked);
  const [layoutMode, setLayoutMode] = React.useState<"grid" | "speaker" | "presentation">("grid");
  const [pinnedParticipantId, setPinnedParticipantId] = React.useState<string | null>(null);
  const [mobileFocusedId, setMobileFocusedId] = React.useState<string | null>(null);
  const [activeSpeakerName, setActiveSpeakerName] = React.useState<string>("Sarah Nabila");
  const [elapsedSeconds, setElapsedSeconds] = React.useState(initialMeeting.durationMinutes * 60 + 15);
  const [copiedLink, setCopiedLink] = React.useState(false);

  // Side Drawer Panels
  const [activeDrawer, setActiveDrawer] = React.useState<"none" | "participants" | "chat" | "details" | "polling">("none");
  const [showActivePollOverlay, setShowActivePollOverlay] = React.useState(true);
  const [unreadMessages, setUnreadMessages] = React.useState(2);

  // Reaction Emojis
  const [reactions, setReactions] = React.useState<ReactionItem[]>([]);
  const [reactionMenuOpen, setReactionMenuOpen] = React.useState(false);

  // Call / Invite Modal within Meeting
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [inviteSearch, setInviteSearch] = React.useState("");

  // End Call & Leave Modals
  const [leaveModalOpen, setLeaveModalOpen] = React.useState(false);
  const [endMeetingForAllModalOpen, setEndMeetingForAllModalOpen] = React.useState(false);

  // Collaboration Feature Modals
  const [notesModalOpen, setNotesModalOpen] = React.useState(false);
  const [whiteboardModalOpen, setWhiteboardModalOpen] = React.useState(false);
  const [virtualBgModalOpen, setVirtualBgModalOpen] = React.useState(false);
  const [randomPickerModalOpen, setRandomPickerModalOpen] = React.useState(false);

  // WAITING ROOM & APPROVAL STATE
  const [waitingUsers, setWaitingUsers] = React.useState<WaitingUser[]>([
    {
      id: "wait-1",
      name: "Budi Pratama",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      department: "Product & Design",
      role: "Product Manager",
      requestedAt: "10:44 WIB",
    },
  ]);

  // RANDOM USER PICKER STATE
  const [isSpinningPicker, setIsSpinningPicker] = React.useState(false);
  const [pickedUser, setPickedUser] = React.useState<string | null>(null);
  const [pickerAnnouncement, setPickerAnnouncement] = React.useState<string | null>(null);

  // WYSIWYG SHARED NOTES STATE (Super Admin exclusive editor)
  const [notesContent, setNotesContent] = React.useState(
    `# Notulensi Rapat Internal Falah Meet\n\n- Evaluasi Arsitektur WebRTC SFU: Kinerja stabil pada 18ms latency.\n- Fitur in-meeting Google/Apple-grade siap rilis untuk 180 karyawan.\n- Catatan Kolaboratif & Polling resmi diadopsi dari desain LiveKit existing.`
  );
  const [actionItems, setActionItems] = React.useState<ActionItem[]>([
    { id: "act-1", text: "Integrasi Excalidraw Whiteboard ke seluruh room", assignee: "Rian Pratama", done: true },
    { id: "act-2", text: "Verifikasi alur approval ruang tunggu tamu", assignee: "Arman Hakim", done: true },
    { id: "act-3", text: "Uji coba load test 60 peserta paralel", assignee: "Dimas Anggara", done: false },
  ]);
  const [newActionText, setNewActionText] = React.useState("");
  const [newActionAssignee, setNewActionAssignee] = React.useState("Engineering");
  const [copiedNotesFeedback, setCopiedNotesFeedback] = React.useState(false);
  const [copiedActionsFeedback, setCopiedActionsFeedback] = React.useState(false);

  // USER ROLE & PERMISSIONS STATE (Super Admin vs User Biasa)
  const [isSuperAdmin, setIsSuperAdmin] = React.useState(true);
  const [isSuperAdminPollView, setIsSuperAdminPollView] = React.useState(true);

  // Sync role from login (Admin vs User Biasa)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get("role");
      const storedRole = localStorage.getItem("falah_user_role");
      if (roleParam === "user" || storedRole === "user") {
        setIsSuperAdmin(false);
        setIsSuperAdminPollView(false);
      } else if (roleParam === "admin" || storedRole === "admin") {
        setIsSuperAdmin(true);
        setIsSuperAdminPollView(true);
      }
    }
  }, []);

  const [isCreatePollOpen, setIsCreatePollOpen] = React.useState(true);
  const [newPollQuestion, setNewPollQuestion] = React.useState("");
  const [newPollOption1, setNewPollOption1] = React.useState("");
  const [newPollOption2, setNewPollOption2] = React.useState("");
  const [newPollOption3, setNewPollOption3] = React.useState("");
  const [newPollOption4, setNewPollOption4] = React.useState("");
  const [newPollOption5, setNewPollOption5] = React.useState("");

  const [activePoll, setActivePoll] = React.useState<PollItem>({
    id: "poll-active",
    question: "Apakah Bapak/Ibu menyetujui ketentuan rapat ini?",
    createdAt: "01 Januari 2026, 13:30 WIB",
    isOpen: true,
    options: [
      { id: "opt-1", text: "Setuju", votes: 1 },
      { id: "opt-2", text: "Setuju dengan syarat", votes: 2 },
      { id: "opt-3", text: "Setuju bila syarat dipenuhi tahun", votes: 1 },
      { id: "opt-4", text: "Tidak setuju", votes: 5 },
      { id: "opt-5", text: "Tidak setuju dengan syarat", votes: 0 },
      { id: "opt-6", text: "Lewati pendapat", votes: 4 },
    ],
  });

  const [pollHistory, setPollHistory] = React.useState<PollItem[]>([
    {
      id: "poll-hist-1",
      question: "Apakah alur sprint backlog disetujui?",
      createdAt: "10 November 2026, 10:00 WIB",
      isOpen: false,
      options: [
        { id: "h1", text: "Setuju", votes: 14 },
        { id: "h2", text: "Perlu Revisi", votes: 2 },
      ],
    },
  ]);
  const [userVotedPollOption, setUserVotedPollOption] = React.useState<string | null>(null);

  // Chat state
  const [chatInput, setChatInput] = React.useState("");
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([
    {
      id: "msg-1",
      senderName: "Rian Pratama",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      department: "Engineering",
      time: "10:18",
      text: "Selamat pagi tim. Hari ini kita selesaikan review sprint backlog v2.0.",
    },
    {
      id: "msg-2",
      senderName: "Dimas Anggara",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      department: "Engineering",
      time: "10:20",
      text: "Arsitektur SFU sudah terpasang. Latency stabil di bawah 20ms.",
    },
  ]);

  // Participants in Room
  const [participants, setParticipants] = React.useState([
    {
      id: "p-self",
      name: "Arman Hakim (Anda)",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      department: "Executive",
      role: "Super Admin",
      isHost: true,
      isMuted: !isMicOn,
      isCameraOn: isCameraOn,
      isSpeaking: false,
      isHandRaised: isHandRaised,
    },
    {
      id: "p-1",
      name: "Rian Pratama",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      department: "Engineering",
      role: "Lead Engineer",
      isHost: false,
      isMuted: false,
      isCameraOn: true,
      isSpeaking: false,
      isHandRaised: false,
    },
    {
      id: "p-2",
      name: "Sarah Nabila",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      department: "Engineering",
      role: "Frontend Dev",
      isHost: false,
      isMuted: false,
      isCameraOn: true,
      isSpeaking: true,
      isHandRaised: false,
    },
    {
      id: "p-3",
      name: "Dimas Anggara",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      department: "Engineering",
      role: "Backend Architect",
      isHost: false,
      isMuted: true,
      isCameraOn: true,
      isSpeaking: false,
      isHandRaised: true,
    },
    {
      id: "p-4",
      name: "Fajar Santoso",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      department: "Engineering",
      role: "DevOps Engineer",
      isHost: false,
      isMuted: true,
      isCameraOn: false,
      isSpeaking: false,
      isHandRaised: false,
    },
  ]);

  // Sync self media states into participants list
  React.useEffect(() => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === "p-self"
          ? {
              ...p,
              isMuted: !isMicOn,
              isCameraOn: isCameraOn,
              isHandRaised: isHandRaised,
            }
          : p
      )
    );
  }, [isMicOn, isCameraOn, isHandRaised]);

  // Google Meet Style partition for Mobile:
  // 1. Featured on main screen (max 2 participants):
  //    - If mobileFocusedId is set, that participant is featured
  //    - Super Admin / Host
  //    - Active speaker / Unmuted participant
  // 2. The rest appear in the horizontal swipeable carousel
  const mobileFeaturedParticipants = React.useMemo(() => {
    const list: typeof participants = [];

    // If a participant is tapped to focus on mobile
    if (mobileFocusedId) {
      const focused = participants.find((p) => p.id === mobileFocusedId);
      if (focused) list.push(focused);
    }

    // Host / Super Admin
    const host = participants.find((p) => p.isHost && p.id !== mobileFocusedId);
    if (host && list.length < 2) list.push(host);

    // Active speaker or unmuted participant
    const speaker = participants.find(
      (p) => (p.isSpeaking || !p.isMuted) && !list.some((item) => item.id === p.id)
    );
    if (speaker && list.length < 2) list.push(speaker);

    // Fallback to fill up to 2 slots if needed
    for (const p of participants) {
      if (list.length >= 2) break;
      if (!list.some((item) => item.id === p.id)) {
        list.push(p);
      }
    }

    return list;
  }, [participants, mobileFocusedId]);

  const mobileOtherParticipants = React.useMemo(() => {
    return participants.filter(
      (p) => !mobileFeaturedParticipants.some((featured) => featured.id === p.id)
    );
  }, [participants, mobileFeaturedParticipants]);

  // Meeting timer
  React.useEffect(() => {
    if (isInLobby) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isInLobby]);

  // Simulated Active Speaker oscillation
  React.useEffect(() => {
    if (isInLobby) return;
    const interval = setInterval(() => {
      const candidates = ["Sarah Nabila", "Rian Pratama", "Dimas Anggara"];
      const nextSpeaker = candidates[Math.floor(Math.random() * candidates.length)];
      setActiveSpeakerName(nextSpeaker);
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          isSpeaking: p.name === nextSpeaker && !p.isMuted,
        }))
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [isInLobby]);

  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://meet.falah.one/${initialMeeting.roomCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // STOP SCREEN SHARING (Restores own camera view / grid view)
  const handleStopScreenShare = () => {
    setIsScreenSharing(false);
    setLayoutMode("grid");
  };

  // TRIGGER REACTION EMOJI
  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const left = 25 + Math.random() * 50;
    setReactions((prev) => [...prev, { id, emoji, left }]);
    setReactionMenuOpen(false);

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2400);
  };

  // LOWER ALL HANDS (Super Admin Action)
  const handleLowerAllHands = () => {
    setIsHandRaised(false);
    setParticipants((prev) => prev.map((p) => ({ ...p, isHandRaised: false })));
  };

  // WAITING ROOM APPROVAL
  const handleAdmitUser = (user: WaitingUser) => {
    setParticipants((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        name: user.name,
        avatar: user.avatar,
        department: user.department,
        role: user.role,
        isHost: false,
        isMuted: false,
        isCameraOn: true,
        isSpeaking: false,
        isHandRaised: false,
      },
    ]);
    setWaitingUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const handleRejectUser = (id: string) => {
    setWaitingUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSimulateNewWaitingUser = () => {
    const candidates = [
      { name: "Aulia Rahma", dept: "Product & Design", role: "Product Lead", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" },
      { name: "Dewi Kusuma", dept: "People & Operations", role: "People Lead", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80" },
      { name: "Reza Mahendra", dept: "Marketing & Growth", role: "Growth Lead", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80" },
    ];
    const candidate = candidates[Math.floor(Math.random() * candidates.length)];
    setWaitingUsers((prev) => [
      ...prev,
      {
        id: `wait-${Date.now()}`,
        name: candidate.name,
        avatar: candidate.avatar,
        department: candidate.dept,
        role: candidate.role,
        requestedAt: "Baru saja",
      },
    ]);
  };

  // RANDOM USER PICKER (For Standups / QA / Presentation roll)
  const handlePickRandomUser = () => {
    setIsSpinningPicker(true);
    setPickedUser(null);

    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * participants.length);
      setPickedUser(participants[randomIdx].name);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        const finalPick = participants[Math.floor(Math.random() * participants.length)];
        setPickedUser(finalPick.name);
        setIsSpinningPicker(false);
        setPickerAnnouncement(`🎉 Giliran Berbicara: ${finalPick.name} terpilih secara acak!`);
        setTimeout(() => setPickerAnnouncement(null), 6000);
      }
    }, 120);
  };

  // SEND CHAT MESSAGE
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: "Arman Hakim (Anda)",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      department: "Executive",
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      text: chatInput.trim(),
      isSelf: true,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  // INSTANT INVITE/CALL
  const handleInstantCallEmployee = (emp: Employee) => {
    alert(
      `📞 Memanggil ${emp.name} (${emp.department})...\n\n` +
      `Notifikasi panggilan berdering langsung di layar perangkat mereka.`
    );
    setParticipants((prev) => [
      ...prev,
      {
        id: emp.id,
        name: emp.name,
        avatar: emp.avatar,
        department: emp.department,
        role: emp.role,
        isHost: false,
        isMuted: true,
        isCameraOn: true,
        isSpeaking: false,
        isHandRaised: false,
      },
    ]);
    setInviteModalOpen(false);
  };

  // CREATE POLL SUBMIT
  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPollQuestion.trim() || !newPollOption1.trim() || !newPollOption2.trim()) {
      alert("Harap masukkan pertanyaan dan minimal 2 opsi jawaban.");
      return;
    }

    const options: PollOption[] = [
      { id: `opt-${Date.now()}-1`, text: newPollOption1.trim(), votes: 0 },
      { id: `opt-${Date.now()}-2`, text: newPollOption2.trim(), votes: 0 },
    ];
    if (newPollOption3.trim()) options.push({ id: `opt-${Date.now()}-3`, text: newPollOption3.trim(), votes: 0 });
    if (newPollOption4.trim()) options.push({ id: `opt-${Date.now()}-4`, text: newPollOption4.trim(), votes: 0 });
    if (newPollOption5.trim()) options.push({ id: `opt-${Date.now()}-5`, text: newPollOption5.trim(), votes: 0 });

    // Archive current active poll into history if existed
    if (activePoll) {
      setPollHistory((prev) => [activePoll, ...prev]);
    }

    setActivePoll({
      id: `poll-${Date.now()}`,
      question: newPollQuestion.trim(),
      createdAt: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) + ", " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      isOpen: true,
      options,
    });

    setUserVotedPollOption(null);
    setNewPollQuestion("");
    setNewPollOption1("");
    setNewPollOption2("");
    setNewPollOption3("");
    setNewPollOption4("");
    setNewPollOption5("");
    setIsCreatePollOpen(false);
  };

  // CLOSE ACTIVE POLL (Super Admin action)
  const handleCloseActivePoll = () => {
    if (!activePoll) return;
    const closed = { ...activePoll, isOpen: false };
    setActivePoll(closed);
    setPollHistory((prev) => [closed, ...prev.filter((p) => p.id !== closed.id)]);
    alert("Pendapat / Polling telah ditutup untuk seluruh peserta.");
  };

  // CAST VOTE IN POLL
  const handleVote = (optionId: string) => {
    if (!activePoll || !activePoll.isOpen) return;
    setUserVotedPollOption(optionId);
    setActivePoll((prev) => ({
      ...prev,
      options: prev.options.map((opt) => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)),
    }));
  };

  // ADD ACTION ITEM
  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim()) return;
    setActionItems((prev) => [
      ...prev,
      {
        id: `act-${Date.now()}`,
        text: newActionText.trim(),
        assignee: newActionAssignee.trim() || "Semua",
        done: false,
      },
    ]);
    setNewActionText("");
  };

  // COPY WYSIWYG CONTENT ONLY
  const handleCopyWysiwygNotes = () => {
    navigator.clipboard.writeText(notesContent);
    setCopiedNotesFeedback(true);
    setTimeout(() => setCopiedNotesFeedback(false), 2000);
  };

  // COPY ACTION ITEMS ONLY
  const handleCopyActionItems = () => {
    const text = actionItems
      .map((item, idx) => `${idx + 1}. [${item.done ? "✓" : " "}] ${item.text} (PIC: ${item.assignee})`)
      .join("\n");
    navigator.clipboard.writeText(`Daftar Action Items Rapat:\n${text}`);
    setCopiedActionsFeedback(true);
    setTimeout(() => setCopiedActionsFeedback(false), 2000);
  };

  // CLEAR ALL NOTES
  const handleClearAllNotes = () => {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh notulensi rapat bersama?")) {
      setNotesContent("");
      setActionItems([]);
    }
  };

  // END MEETING FOR ALL
  const handleEndMeetingForAll = () => {
    setEndMeetingForAllModalOpen(false);
    alert(`🔴 Sesi Rapat "${initialMeeting.title}" Telah Diakhiri untuk Seluruh Peserta.`);
    router.push("/admin");
  };

  // ---------------------------------------------------------------------------
  // VIEW 1: LOBBY / PRE-JOIN ROOM (HAIR CHECK & DEVICE VERIFICATION)
  // ---------------------------------------------------------------------------
  if (isInLobby) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 antialiased selection:bg-primary/20 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[120px] pointer-events-none" />

        {/* Top Navbar */}
        <header className="max-w-5xl w-full mx-auto flex items-center justify-between z-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Radio className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                Falah Meet <span className="text-secondary text-[10px] font-mono font-semibold px-1 py-0.5 rounded bg-white/10">v2.0</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Lobi Masuk Rapat Internal</div>
            </div>
          </Link>

          <Link href="/admin">
            <Button variant="outline" size="sm" className="text-xs bg-white/5 border-white/15 text-white hover:bg-white/10 hover:text-white">
              Kembali ke Dashboard Admin
            </Button>
          </Link>
        </header>

        {/* Main Pre-join Split Canvas */}
        <main className="max-w-5xl w-full mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
          {/* Left Canvas: Camera Preview (Hair Check) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-video w-full rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group">
              {isCameraOn ? (
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={getSelfPhotoByBg(virtualBg)}
                    alt="Self Preview"
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      virtualBg === "blur"
                        ? "blur-[4px] scale-105"
                        : virtualBg === "heavy-blur"
                        ? "blur-[10px] scale-110"
                        : ""
                    }`}
                  />
                  {virtualBg === "cyber" && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-transparent to-primary/30 pointer-events-none" />
                  )}

                  {/* Active Virtual Background Status Pill */}
                  <div className="absolute top-4 right-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-blue-300 border border-white/10 shadow-md">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>
                      {virtualBg === "none"
                        ? "Kamera Asli"
                        : virtualBg === "office"
                        ? "Kantor Modern"
                        : virtualBg === "boardroom"
                        ? "Ruang Rapat"
                        : virtualBg === "cyber"
                        ? "Studio Falah"
                        : virtualBg === "blur"
                        ? "Blur Halus"
                        : "Blur Pekat"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto text-2xl font-bold border border-primary/30 shadow-inner">
                    AH
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Kamera Dinonaktifkan</div>
                </div>
              )}

              {/* Watermark in Preview */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Pratinjau Anda</span>
              </div>

              {/* Audio meter simulation */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-white border border-white/10">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-1 bg-emerald-400 h-2 rounded-full animate-pulse" />
                  <span className="w-1 bg-emerald-400 h-3 rounded-full animate-pulse delay-75" />
                  <span className="w-1 bg-emerald-400 h-1.5 rounded-full animate-pulse delay-150" />
                </div>
              </div>

              {/* Bottom Quick Controls in Camera Box */}
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
                <Button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`w-11 h-11 rounded-full shadow-lg transition-all ${
                    isMicOn ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md" : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                  title={isMicOn ? "Matikan Mikrofon" : "Nyalakan Mikrofon"}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>

                <Button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`w-11 h-11 rounded-full shadow-lg transition-all ${
                    isCameraOn ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md" : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                  title={isCameraOn ? "Matikan Kamera" : "Nyalakan Kamera"}
                >
                  {isCameraOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>

                <Button
                  onClick={() => setVirtualBgModalOpen(true)}
                  className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md shadow-lg"
                  title="Ganti Latar Belakang (Virtual Background)"
                >
                  <Sparkles className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Mikrofon: Realtek HD Audio (Bawaan)</span>
              <span>Latar Belakang: {virtualBg === "none" ? "Kamera Asli" : virtualBg.toUpperCase()}</span>
            </div>
          </div>

          {/* Right Canvas: Room Info & Join Actions */}
          <div className="lg:col-span-5 space-y-6 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                {initialMeeting.title}
              </h1>
              <p className="text-xs text-slate-400">
                Inisiator: <span className="text-slate-200 font-semibold">{initialMeeting.hostName}</span> ({initialMeeting.department})
              </p>
            </div>

            {/* Attendees Already In Room */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Sudah berada di ruangan:</span>
                <span className="text-emerald-400 font-semibold">{initialMeeting.attendees.length} orang aktif</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  {initialMeeting.attendees.map((att, i) => (
                    <img
                      key={i}
                      src={att.avatar}
                      alt={att.name}
                      title={att.name}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-300">
                  {initialMeeting.attendees.slice(0, 2).map((a) => a.name.split(" ")[0]).join(", ")} & lainnya
                </span>
              </div>
            </div>

            {/* Join Action Button (Removed present only button as requested) */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={() => setIsInLobby(false)}
                className="w-full h-11 text-sm font-semibold bg-primary hover:bg-primary/95 text-white rounded-xl shadow-lg gap-2 cursor-pointer"
              >
                <VideoIcon className="w-4 h-4" />
                <span>Gabung Sekarang</span>
              </Button>
            </div>

            {/* Meeting Link Pill */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <div className="truncate text-slate-400 font-mono text-[11px] pr-2">
                meet.falah.one/{initialMeeting.roomCode}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="h-7 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 gap-1 shrink-0"
              >
                {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? "Tersalin" : "Salin"}</span>
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="max-w-5xl w-full mx-auto flex items-center justify-between text-xs text-slate-500 z-10 pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Enkripsi End-to-End LiveKit SFU • Bebas Batasan Waktu</span>
          </div>
          <div>Falah Meet v2.0</div>
        </footer>

        {/* VIRTUAL BG MODAL MOUNTED IN LOBBY TOO */}
        <Dialog open={virtualBgModalOpen} onOpenChange={setVirtualBgModalOpen}>
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <DialogTitle>Ganti Latar Belakang (Virtual Background)</DialogTitle>
            <DialogDescription>
              Pilih efek latar belakang kamera Anda seperti pada acuan Figma LiveKit Meeting.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3">
            <div
              onClick={() => setVirtualBg("none")}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                virtualBg === "none" ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:bg-muted/40"
              }`}
            >
              <div className="w-full aspect-video rounded-lg bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 mb-2">
                Kamera Asli
              </div>
              <div className="text-xs font-semibold text-foreground">Tanpa Efek</div>
            </div>

            <div
              onClick={() => setVirtualBg("blur")}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                virtualBg === "blur" ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:bg-muted/40"
              }`}
            >
              <div className="w-full aspect-video rounded-lg bg-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700 mb-2">
                Blur Halus
              </div>
              <div className="text-xs font-semibold text-foreground">Blur Halus</div>
            </div>

            <div
              onClick={() => setVirtualBg("heavy-blur")}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                virtualBg === "heavy-blur" ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:bg-muted/40"
              }`}
            >
              <div className="w-full aspect-video rounded-lg bg-slate-400 flex items-center justify-center text-xs font-semibold text-slate-800 mb-2">
                Blur Pekat
              </div>
              <div className="text-xs font-semibold text-foreground">Blur Maksimal</div>
            </div>

            <div
              onClick={() => setVirtualBg("office")}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                virtualBg === "office" ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:bg-muted/40"
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&auto=format&fit=crop&q=80"
                alt="Office"
                className="w-full aspect-video rounded-lg object-cover mb-2"
              />
              <div className="text-xs font-semibold text-foreground">Kantor Modern</div>
            </div>

            <div
              onClick={() => setVirtualBg("boardroom")}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                virtualBg === "boardroom" ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:bg-muted/40"
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&auto=format&fit=crop&q=80"
                alt="Boardroom"
                className="w-full aspect-video rounded-lg object-cover mb-2"
              />
              <div className="text-xs font-semibold text-foreground">Ruang Rapat</div>
            </div>

            <div
              onClick={() => setVirtualBg("cyber")}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                virtualBg === "cyber" ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:bg-muted/40"
              }`}
            >
              <div className="w-full aspect-video rounded-lg bg-gradient-to-tr from-slate-950 via-primary to-blue-500 flex items-center justify-center text-[10px] font-bold text-white mb-2">
                Falah Sapphire
              </div>
              <div className="text-xs font-semibold text-foreground">Studio Falah</div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setVirtualBgModalOpen(false)}>
              Selesai
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW 2: ACTIVE IN-MEETING ROOM (GOOGLE & APPLE GRADE SEAMLESS EXPERIENCE)
  // ---------------------------------------------------------------------------
  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden relative select-none">
      {/* FLOATING EMOJI REACTIONS (Animated upwards smoothly) */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {reactions.map((r) => (
          <div
            key={r.id}
            style={{ left: `${r.left}%`, bottom: "90px" }}
            className="fixed text-5xl animate-reaction-float pointer-events-none drop-shadow-2xl"
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* FLOATING TOP BANNER: WAITING GUEST APPROVAL NOTIFICATION (Super Admin only) */}
      {isSuperAdmin && waitingUsers.length > 0 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-xl border border-primary/50 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={waitingUsers[0].avatar}
                alt={waitingUsers[0].name}
                className="w-8 h-8 rounded-full object-cover border border-primary/40 shrink-0"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900 absolute -bottom-0.5 -right-0.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{waitingUsers[0].name}</span>
                <Badge variant="outline" className="text-[9px] py-0 border-white/20 text-slate-300">
                  {waitingUsers[0].department}
                </Badge>
              </div>
              <div className="text-[10px] text-slate-400">Menunggu persetujuan bergabung ({waitingUsers.length} orang)...</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={() => handleAdmitUser(waitingUsers[0])}
              className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white gap-1 px-3 rounded-lg shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Izinkan</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleRejectUser(waitingUsers[0].id)}
              className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2.5 rounded-lg"
            >
              Tolak
            </Button>
          </div>
        </div>
      )}

      {/* FLOATING BANNER: RANDOM USER PICKED ANNOUNCEMENT */}
      {pickerAnnouncement && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce border-2 border-white">
          <Crown className="w-4 h-4 fill-current" />
          <span>{pickerAnnouncement}</span>
        </div>
      )}

      {/* TOP BAR: Room Title, Room Code, Live Timer, Security & Layout */}
      <header className="h-14 px-4 sm:px-6 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-30 shrink-0">
        {/* Left: Room Title, Code & Timer */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href={isSuperAdmin ? "/admin" : "/"} title={isSuperAdmin ? "Kembali ke Console Admin" : "Falah Meet"} className="shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-xs hover:scale-105 transition-transform">
              <Radio className="w-4 h-4 text-white animate-pulse" />
            </div>
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight truncate max-w-xs sm:max-w-md">
                {initialMeeting.title}
              </h1>
              {isLocked ? (
                <Badge variant="outline" className="text-[9px] py-0 border-amber-500/40 text-amber-400 bg-amber-500/10 gap-1">
                  <Lock className="w-2.5 h-2.5" /> Terkunci
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[9px] py-0 border-emerald-500/40 text-emerald-400 bg-emerald-500/10 gap-1">
                  <Unlock className="w-2.5 h-2.5" /> Terbuka
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span>#{initialMeeting.roomCode}</span>
              <span>•</span>
              <span className="font-semibold text-slate-300">{formatTime(elapsedSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Center: Live Recording Indicator & Self Raise Hand Pill */}
        <div className="flex items-center gap-2">
          {isRecording && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs animate-pulse">
              <Disc className="w-3.5 h-3.5 animate-spin" />
              <span className="font-semibold text-[11px] tracking-wide">REC MENYALA</span>
            </div>
          )}

          {isHandRaised && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold animate-pulse">
              <Hand className="w-3.5 h-3.5 fill-current" />
              <span>Tangan Terangkat</span>
            </div>
          )}
        </div>

        {/* Right: Layout Switcher, SFU Ping & Quick Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SFU Latency Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px]">18ms</span>
          </div>

          {/* Layout Toggle (Grid vs Speaker vs Presentation) */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setLayoutMode("grid")}
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                layoutMode === "grid" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Tampilan Galeri Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode("speaker")}
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                layoutMode === "speaker" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Tampilan Pembicara Aktif"
            >
              <Layout className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode("presentation")}
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                layoutMode === "presentation" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Tampilan Presentasi Layar"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MIDDLE BODY: Video Grid Canvas + Optional Right Side Drawer */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden p-3 gap-3">
        {/* MAIN VIDEO STAGE */}
        <div className="flex-1 flex flex-col justify-center min-w-0 relative">
          {/* PRESENTATION / SCREEN SHARE VIEW */}
          {(layoutMode === "presentation" || isScreenSharing) ? (
            <div className="h-full w-full flex flex-col md:flex-row gap-3 min-h-0">
              {/* Big Shared Screen Canvas */}
              <div className="flex-1 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden relative flex flex-col justify-between p-4 shadow-2xl">
                {/* Mock Screen Content */}
                <div className="flex items-center justify-between text-xs text-slate-300 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-primary" />
                    <span className="font-medium">Layar Bersama: Falah Meet SFU Architecture Spec v2.0.pdf</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">1080p 60fps</Badge>
                </div>

                {/* Simulated Presentation Graphic */}
                <div className="my-auto text-center space-y-4 max-w-lg mx-auto">
                  <div className="p-6 rounded-2xl bg-slate-950/70 border border-white/10 shadow-xl space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mx-auto">
                      <Radio className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="text-base font-bold text-white">LiveKit SFU Architecture for 180 Employees</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Komunikasi terenkripsi penuh tanpa server pihak ketiga. Mendukung 60+ room paralel dengan penanganan bandwidth adaptif (Simulcast SVC).
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
                  <span>Dipresentasikan oleh {isScreenSharing ? "Anda (Arman Hakim)" : "Rian Pratama"}</span>
                  {isScreenSharing && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleStopScreenShare}
                      className="h-6 text-[10px] px-2.5 cursor-pointer"
                    >
                      Hentikan Berbagi
                    </Button>
                  )}
                </div>
              </div>

              {/* Side Strip of Participant Tiles */}
              <div className="w-full md:w-56 flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto shrink-0">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className={`relative aspect-video rounded-xl bg-slate-900 border overflow-hidden shrink-0 ${
                      p.name === pickedUser
                        ? "border-amber-400 ring-2 ring-amber-400"
                        : p.isSpeaking
                        ? "border-emerald-500 ring-2 ring-emerald-500/30"
                        : "border-white/10"
                    }`}
                  >
                    {p.isCameraOn ? (
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                        {p.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px]">
                      {p.isMuted ? <MicOff className="w-2.5 h-2.5 text-red-400" /> : <Mic className="w-2.5 h-2.5 text-emerald-400" />}
                      <span className="truncate max-w-[80px]">{p.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : layoutMode === "speaker" ? (
            /* ACTIVE SPEAKER SPOTLIGHT VIEW */
            <div className="h-full w-full flex flex-col md:flex-row gap-3 min-h-0">
              {/* Big Spotlight Tile */}
              <div className="flex-1 bg-slate-900 border-2 border-emerald-500 ring-4 ring-emerald-500/20 rounded-2xl overflow-hidden relative shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&auto=format&fit=crop&q=80"
                  alt="Spotlight"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-emerald-500 text-white font-semibold text-xs px-3 py-1 rounded-full shadow-lg">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>Sedang Berbicara: {activeSpeakerName}</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                  <div className="font-bold text-white">{activeSpeakerName}</div>
                  <div className="text-[10px] text-slate-300">Engineering • Frontend Lead</div>
                </div>
              </div>

              {/* Side Participant Column */}
              <div className="w-full md:w-60 flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto shrink-0">
                {participants
                  .filter((p) => p.name !== activeSpeakerName)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="relative aspect-video rounded-xl bg-slate-900 border border-white/10 overflow-hidden shrink-0"
                    >
                      {p.isCameraOn ? (
                        <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                          {p.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px]">
                        {p.isMuted ? <MicOff className="w-3 h-3 text-red-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                        <span className="truncate max-w-[100px]">{p.name}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            /* ADAPTIVE GALLERY GRID VIEW (Default) */
            (() => {
              const renderParticipantTile = (p: (typeof participants)[0], isMobile = false) => {
                const isSpeaking = p.isSpeaking;
                const isSelf = p.id === "p-self";
                const isChosenRandom = p.name === pickedUser;

                return (
                  <div
                    key={p.id}
                    className={`relative rounded-2xl bg-slate-900 border overflow-hidden flex items-center justify-center shadow-lg transition-all ${
                      isMobile ? "flex-1 min-h-[160px] max-h-[290px] w-full" : "h-full w-full min-h-[180px]"
                    } ${
                      isChosenRandom
                        ? "border-amber-400 ring-4 ring-amber-400/50"
                        : isSpeaking
                        ? "border-emerald-500 ring-2 ring-emerald-500/40"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Video Stream or Avatar fallback */}
                    {p.isCameraOn ? (
                      <div className="relative w-full h-full overflow-hidden">
                        <img
                          src={isSelf ? getSelfPhotoByBg(virtualBg) : p.avatar}
                          alt={p.name}
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            isSelf && virtualBg === "blur"
                              ? "blur-[4px] scale-105"
                              : isSelf && virtualBg === "heavy-blur"
                              ? "blur-[10px] scale-110"
                              : ""
                          }`}
                        />
                        {isSelf && virtualBg === "cyber" && (
                          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-transparent to-primary/30 pointer-events-none" />
                        )}

                        {/* In-Meeting Virtual Background indicator badge on self */}
                        {isSelf && virtualBg !== "none" && (
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-medium text-blue-300 border border-white/10 z-10 shadow-sm">
                            <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                            <span>
                              {virtualBg === "office"
                                ? "Kantor"
                                : virtualBg === "boardroom"
                                ? "Boardroom"
                                : virtualBg === "cyber"
                                ? "Studio"
                                : "Blur"}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto text-xl font-bold border border-primary/30">
                          {p.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">Kamera Dinonaktifkan</div>
                      </div>
                    )}

                    {/* Top Right Badges: Hand Raise, Host, and Random Crown */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {isChosenRandom && (
                        <div className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1 text-[10px] font-bold shadow-md animate-bounce">
                          <Crown className="w-3 h-3 fill-current" />
                          <span>Terpilih Acak</span>
                        </div>
                      )}
                      {p.isHandRaised && (
                        <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center animate-bounce shadow-md" title="Mengangkat Tangan">
                          <Hand className="w-4 h-4 fill-current" />
                        </div>
                      )}
                      {p.isHost && (
                        <Badge variant="outline" className="text-[9px] py-0 bg-primary/30 text-white border-primary/40 font-semibold">
                          Host
                        </Badge>
                      )}
                    </div>

                    {/* Self Raised Hand Feedback Banner */}
                    {isSelf && isHandRaised && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg animate-pulse">
                        <Hand className="w-3.5 h-3.5 fill-current" />
                        <span>Tangan Anda Terangkat</span>
                      </div>
                    )}

                    {/* Bottom Pill: Participant Info & Mic Status */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-xs text-white max-w-[80%]">
                        {p.isMuted ? (
                          <MicOff className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        ) : (
                          <div className="flex items-center gap-1">
                            <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            {isSpeaking && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            )}
                          </div>
                        )}
                        <span className="font-medium truncate">{p.name}</span>
                        <span className="text-[10px] text-slate-400">({p.department})</span>
                      </div>

                      {/* Pin Button */}
                      <button
                        onClick={() => setPinnedParticipantId(pinnedParticipantId === p.id ? null : p.id)}
                        className="pointer-events-auto w-7 h-7 rounded-lg bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title={pinnedParticipantId === p.id ? "Lepas Pin" : "Sematkan Video"}
                      >
                        <Pin className={`w-3.5 h-3.5 ${pinnedParticipantId === p.id ? "text-primary fill-current" : ""}`} />
                      </button>
                    </div>
                  </div>
                );
              };

              return (
                <div className="h-full w-full min-h-0">
                  {/* DESKTOP & TABLET: RESPONSIVE GRID (sm: and up) */}
                  <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 h-full min-h-0">
                    {participants.map((p) => renderParticipantTile(p, false))}
                  </div>

                  {/* MOBILE: GOOGLE MEET STYLE (Featured on top, swipeable carousel below) */}
                  <div className="flex sm:hidden flex-col h-full min-h-0 gap-2.5">
                    {/* Main Stage (1 or 2 featured members, natural height, never squished) */}
                    <div className="flex-1 flex flex-col min-h-0 gap-2.5">
                      {mobileFeaturedParticipants.map((p) => renderParticipantTile(p, true))}
                    </div>

                    {/* Google Meet Horizontal Swipeable Carousel for other participants */}
                    {mobileOtherParticipants.length > 0 && (
                      <div className="shrink-0 w-full pt-1 pb-0.5 space-y-1">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-blue-400" />
                            <span>Peserta Lainnya ({mobileOtherParticipants.length})</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">Geser untuk melihat &gt;</span>
                        </div>

                        <div className="flex gap-2.5 overflow-x-auto pb-1.5 pt-0.5 px-0.5 snap-x no-scrollbar">
                          {mobileOtherParticipants.map((p) => {
                            const isSpeaking = p.isSpeaking;
                            const isSelf = p.id === "p-self";
                            const isChosenRandom = p.name === pickedUser;

                            return (
                              <div
                                key={p.id}
                                onClick={() => setMobileFocusedId(p.id === mobileFocusedId ? null : p.id)}
                                className={`w-36 h-28 shrink-0 snap-start rounded-xl bg-slate-900 border overflow-hidden relative shadow-md cursor-pointer transition-all active:scale-95 ${
                                  isChosenRandom
                                    ? "border-amber-400 ring-2 ring-amber-400/50"
                                    : isSpeaking
                                    ? "border-emerald-500 ring-2 ring-emerald-500/40"
                                    : "border-white/10 hover:border-white/30"
                                }`}
                                title={`Ketuk untuk tampilkan ${p.name}`}
                              >
                                {p.isCameraOn ? (
                                  <img
                                    src={isSelf ? getSelfPhotoByBg(virtualBg) : p.avatar}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-primary gap-1">
                                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs border border-primary/30">
                                      {p.name.substring(0, 2).toUpperCase()}
                                    </div>
                                  </div>
                                )}

                                {/* Hand raise / Host badge */}
                                <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                                  {p.isHandRaised && (
                                    <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                                      <Hand className="w-3 h-3 fill-current" />
                                    </div>
                                  )}
                                  {p.isHost && (
                                    <span className="text-[8px] px-1 py-0.2 rounded bg-primary text-white font-bold">
                                      Host
                                    </span>
                                  )}
                                </div>

                                {/* Bottom pill: name + mic */}
                                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-white">
                                  <span className="truncate max-w-[80px] font-medium">{p.name.split(" ")[0]}</span>
                                  {p.isMuted ? (
                                    <MicOff className="w-2.5 h-2.5 text-red-400 shrink-0" />
                                  ) : (
                                    <Mic className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          )}
        </div>

        {/* RIGHT DRAWER: Slide-Over Panel for Participants / Chat / Meeting Info */}
        {activeDrawer !== "none" && (
          <aside className="w-full sm:w-80 md:w-96 max-w-full bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl z-20 shrink-0 animate-in slide-in-from-right-10 duration-200">
            {/* Drawer Header Tabs: Peserta | Obrolan | Info & Rekaman | Pendapat */}
            <div className="h-12 border-b border-white/10 px-3 sm:px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveDrawer("participants")}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                    activeDrawer === "participants" ? "bg-white/10 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Peserta ({participants.length})
                </button>
                <button
                  onClick={() => {
                    setActiveDrawer("chat");
                    setUnreadMessages(0);
                  }}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer relative shrink-0 ${
                    activeDrawer === "chat" ? "bg-white/10 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Obrolan
                  {unreadMessages > 0 && activeDrawer !== "chat" && (
                    <span className="ml-1 w-2 h-2 rounded-full bg-primary inline-block" />
                  )}
                </button>
                {isSuperAdmin && (
                  <button
                    onClick={() => setActiveDrawer("details")}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                      activeDrawer === "details" ? "bg-white/10 text-white font-bold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Info & Rekaman
                  </button>
                )}
                <button
                  onClick={() => setActiveDrawer("polling")}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                    activeDrawer === "polling" ? "bg-white/10 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Pendapat
                </button>
              </div>

              <button
                onClick={() => setActiveDrawer("none")}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-md hover:bg-white/10 cursor-pointer ml-1 shrink-0"
                title="Tutup Panel"
              >
                ✕
              </button>
            </div>

            {/* DRAWER CONTENT: PARTICIPANTS TAB */}
            {activeDrawer === "participants" && (
              <div className="flex-1 flex flex-col min-h-0 p-4 space-y-4">
                {/* WAITING ROOM LIST IN DRAWER (If any - Super Admin only) */}
                {isSuperAdmin && waitingUsers.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5" /> Ruang Tunggu ({waitingUsers.length})
                      </span>
                      <span className="text-[10px] text-slate-400">Persetujuan Super Admin</span>
                    </div>

                    <div className="space-y-1.5">
                      {waitingUsers.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-2 rounded-lg bg-black/40 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                            <div className="min-w-0">
                              <div className="font-semibold text-white truncate">{u.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{u.department}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleAdmitUser(u)}
                              className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold cursor-pointer"
                            >
                              Izinkan
                            </button>
                            <button
                              onClick={() => handleRejectUser(u.id)}
                              className="px-2 py-0.5 rounded bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white text-[10px] cursor-pointer"
                            >
                              Tolak
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Host Quick Actions (Super Admin only) */}
                {isSuperAdmin && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setParticipants((prev) => prev.map((p) => (p.id === "p-self" ? p : { ...p, isMuted: true })));
                          alert("Seluruh mikrofon peserta telah dibisukan (Muted All).");
                        }}
                        className="flex-1 h-8 text-xs bg-white/5 border-white/15 text-slate-200 hover:bg-white/10 hover:text-white"
                      >
                        <MicOff className="w-3 h-3" />
                        <span>Bisukan Semua</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleLowerAllHands}
                        className="flex-1 h-8 text-xs bg-white/5 border-white/15 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
                        title="Turunkan Semua Raise Hand Peserta"
                      >
                        <Hand className="w-3 h-3" />
                        <span>Turunkan Semua</span>
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => setInviteModalOpen(true)}
                        className="flex-1 h-8 text-xs gap-1.5 shadow-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Panggil Karyawan</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSimulateNewWaitingUser}
                        className="h-8 text-[11px] bg-white/5 border-white/15 text-slate-300 hover:bg-white/10"
                        title="Simulasi ada karyawan kantor minta izin masuk"
                      >
                        + Tamu Masuk
                      </Button>
                    </div>
                  </div>
                )}

                {/* Participant List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {participants.map((p) => (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all text-xs ${
                        p.name === pickedUser
                          ? "bg-amber-500/20 border-amber-400"
                          : "bg-white/5 border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="font-semibold text-white flex items-center gap-1.5 truncate">
                            <span className="truncate">{p.name}</span>
                            {p.isHost && (
                              <span className="text-[9px] px-1 py-0 rounded bg-primary/20 text-primary font-mono shrink-0">
                                Host
                              </span>
                            )}
                            {p.name === pickedUser && (
                              <Crown className="w-3 h-3 text-amber-400 fill-current shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{p.role} • {p.department}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {p.isHandRaised && (
                          <Hand className="w-3.5 h-3.5 text-amber-400 fill-current animate-bounce" />
                        )}
                        {p.isMuted ? (
                          <MicOff className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <Mic className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {p.isCameraOn ? (
                          <VideoIcon className="w-3.5 h-3.5 text-slate-300" />
                        ) : (
                          <VideoOff className="w-3.5 h-3.5 text-red-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DRAWER CONTENT: CHAT TAB */}
            {activeDrawer === "chat" && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] leading-relaxed">
                    Pesan dalam ruang rapat ini tersimpan sementara untuk kolaborasi internal dan dienkripsi secara aman.
                  </div>

                  {chatMessages.map((m) => (
                    <div key={m.id} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-200">{m.senderName}</span>
                        <span>{m.time}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs leading-relaxed">
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Tulis pesan ke semua peserta..."
                    className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
                  />
                  <Button type="submit" size="sm" className="h-9 w-9 p-0 bg-primary hover:bg-primary/95 text-white">
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </div>
            )}

            {/* DRAWER CONTENT: DETAILS TAB (Super Admin only) */}
            {isSuperAdmin && activeDrawer === "details" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
                {/* 1. SHARE LINK */}
                <div>
                  <h4 className="font-semibold text-white">Tautan Bergabung</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Bagikan tautan ini ke rekan kantor untuk bergabung:</p>
                  <div className="mt-2 p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-300 truncate">
                      meet.falah.one/{initialMeeting.roomCode}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyLink}
                      className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1 shrink-0"
                    >
                      {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedLink ? "Tersalin" : "Salin"}</span>
                    </Button>
                  </div>
                </div>

                {/* 2. SECURITY & SESSION CONTROL */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <h4 className="font-semibold text-white">Keamanan & Kontrol Sesi</h4>
                  <div className="space-y-2 text-slate-300 text-[11px]">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
                      <div>
                        <div className="font-medium text-white">Kunci Ruang Rapat</div>
                        <div className="text-[10px] text-slate-400">Cegah tamu baru masuk tanpa approval</div>
                      </div>
                      <button
                        onClick={() => setIsLocked(!isLocked)}
                        className={`text-xs px-2.5 py-1 rounded font-medium cursor-pointer ${
                          isLocked ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {isLocked ? "Terkunci" : "Buka Kunci"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. CLOUD RECORDING SECTION */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">Perekaman Cloud Rapat (Cloud Recording)</h4>
                    {isRecording && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold animate-pulse">
                        ● AKTIF
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Rekam seluruh sesi audio, video peserta, dan layar presentasi ke server penyimpanan cloud privat internal kantor (S3 Bucket).
                  </p>
                  <div className="pt-1">
                    <Button
                      size="sm"
                      onClick={() => setIsRecording(!isRecording)}
                      className={`w-full h-8 text-xs font-semibold gap-1.5 shadow-md cursor-pointer ${
                        isRecording
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-primary hover:bg-primary/95 text-white"
                      }`}
                    >
                      <Disc className="w-3.5 h-3.5" />
                      <span>{isRecording ? "Hentikan Rekaman Rapat" : "Mulai Rekam Rapat"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* DRAWER CONTENT: POLLING TAB (DARK SLEEK GLASSMORPHIC THEME) */}
            {activeDrawer === "polling" && (
              <div className="flex-1 flex flex-col min-h-0 text-white overflow-y-auto p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/20 text-blue-400 flex items-center justify-center border border-primary/30">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">Pendapat / Polling</h3>
                      <p className="text-[10px] text-slate-400">Jajak pendapat real-time seluruh peserta</p>
                    </div>
                  </div>
                  {isSuperAdmin && (
                    <button
                      onClick={() => setIsSuperAdminPollView(!isSuperAdminPollView)}
                      className="text-[10px] px-2.5 py-1 rounded-md border border-white/15 bg-white/10 text-blue-300 hover:bg-white/20 font-semibold cursor-pointer transition-colors"
                    >
                      Simulasi: {isSuperAdminPollView ? "Super Admin" : "Peserta"}
                    </button>
                  )}
                </div>

                {/* SUPER ADMIN VIEW: ACCORDION BUAT PENDAPAT + MONITORING HASIL */}
                {isSuperAdminPollView ? (
                  <div className="space-y-4">
                    {/* Accordion: Buat Pendapat */}
                    <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 shadow-xs">
                      <button
                        type="button"
                        onClick={() => setIsCreatePollOpen(!isCreatePollOpen)}
                        className="w-full p-3 bg-white/5 hover:bg-white/10 font-bold text-xs text-white flex items-center justify-between cursor-pointer border-b border-white/10 transition-colors"
                      >
                        <span className="flex items-center gap-2 text-blue-400">
                          <Plus className="w-3.5 h-3.5" />
                          <span className="text-white">Buat Pendapat Baru</span>
                        </span>
                        {isCreatePollOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>

                      {isCreatePollOpen && (
                        <form onSubmit={handleCreatePoll} className="p-3.5 space-y-2.5 bg-black/20">
                          <div>
                            <Input
                              value={newPollQuestion}
                              onChange={(e) => setNewPollQuestion(e.target.value)}
                              placeholder="Masukkan pertanyaan Pendapat ..."
                              className="text-xs h-9 bg-slate-950/60 border-white/15 text-white placeholder:text-slate-400 focus:border-primary"
                              required
                            />
                          </div>
                          <div>
                            <Input
                              value={newPollOption1}
                              onChange={(e) => setNewPollOption1(e.target.value)}
                              placeholder="Opsi 1"
                              className="text-xs h-8 bg-slate-950/60 border-white/15 text-white placeholder:text-slate-400 focus:border-primary"
                              required
                            />
                          </div>
                          <div>
                            <Input
                              value={newPollOption2}
                              onChange={(e) => setNewPollOption2(e.target.value)}
                              placeholder="Opsi 2"
                              className="text-xs h-8 bg-slate-950/60 border-white/15 text-white placeholder:text-slate-400 focus:border-primary"
                              required
                            />
                          </div>
                          <div>
                            <Input
                              value={newPollOption3}
                              onChange={(e) => setNewPollOption3(e.target.value)}
                              placeholder="Opsi 3 (opsional)"
                              className="text-xs h-8 bg-slate-950/60 border-white/15 text-white placeholder:text-slate-400 focus:border-primary"
                            />
                          </div>
                          <div>
                            <Input
                              value={newPollOption4}
                              onChange={(e) => setNewPollOption4(e.target.value)}
                              placeholder="Opsi 4 (opsional)"
                              className="text-xs h-8 bg-slate-950/60 border-white/15 text-white placeholder:text-slate-400 focus:border-primary"
                            />
                          </div>
                          <div>
                            <Input
                              value={newPollOption5}
                              onChange={(e) => setNewPollOption5(e.target.value)}
                              placeholder="Opsi 5 (opsional)"
                              className="text-xs h-8 bg-slate-950/60 border-white/15 text-white placeholder:text-slate-400 focus:border-primary"
                            />
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-9 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer mt-2"
                          >
                            Luncurkan Polling ke Peserta
                          </Button>
                        </form>
                      )}
                    </div>

                    {/* SUPER ADMIN: LIVE MONITORING RESULTS (Menunggu Hasil Voting) */}
                    {activePoll && (
                      <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 shadow-xs space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${activePoll.isOpen ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                              {activePoll.isOpen ? "Monitoring Voting Masuk (Live)" : "Polling Selesai"}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white leading-snug">
                            {activePoll.question}
                          </h4>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{activePoll.createdAt}</span>
                          </div>
                        </div>

                        {/* Progress bars in Falah Meet Blue */}
                        <div className="space-y-2 pt-1">
                          {activePoll.options.map((opt) => {
                            const total = activePoll.options.reduce((a, b) => a + b.votes, 0);
                            const pct = total > 0 ? (opt.votes / total) * 100 : 0;

                            return (
                              <div key={opt.id} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-medium text-slate-200">{opt.text}</span>
                                  <span className="font-mono text-xs font-bold text-blue-400">
                                    {opt.votes} suara ({Math.round(pct)}%)
                                  </span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full transition-all duration-300"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {activePoll.isOpen && (
                          <div className="pt-2">
                            <Button
                              type="button"
                              onClick={handleCloseActivePoll}
                              className="w-full h-8 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs rounded-lg cursor-pointer transition-colors"
                            >
                              Tutup Pendapat
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* REGULAR PARTICIPANT DRAWER VIEW (Voting interface) */
                  <div className="space-y-3">
                    {activePoll && activePoll.isOpen ? (
                      <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 shadow-xs space-y-3">
                        <div className="text-xs font-bold text-white">{activePoll.question}</div>
                        <div className="space-y-2">
                          {activePoll.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => handleVote(opt.id)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                                userVotedPollOption === opt.id
                                  ? "border-primary bg-primary/20 text-blue-300 font-semibold"
                                  : "border-white/10 hover:border-white/20 text-slate-200 bg-black/20"
                              }`}
                            >
                              <span>{opt.text}</span>
                              {userVotedPollOption === opt.id && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center text-xs text-slate-400">
                        Tidak ada polling aktif yang membutuhkan voting saat ini.
                      </div>
                    )}
                  </div>
                )}

                {/* Riwayat Pendapat in Dark Theme */}
                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Riwayat Pendapat</h4>

                  {pollHistory.map((hist) => (
                    <div key={hist.id} className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1">
                      <div className="text-xs font-bold text-white">{hist.question}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{hist.createdAt}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary/20 text-blue-300 font-medium">Selesai</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* BOTTOM FLOATING CONTROL DOCK (WITH PIPELINE SEPARATOR & END MEETING BUTTON & LIVEKIT DOCK STYLE) */}
      <footer className="h-20 px-4 sm:px-6 flex items-center justify-between relative z-40 shrink-0 pb-3 gap-3">
        {/* LEFT: ROOM CODE BOX (EXACT LIVEKIT STYLE AS IN IMAGE 2) */}
        <div className="flex flex-col gap-0.5 hidden xl:flex shrink-0">
          <span className="text-[10px] font-semibold text-slate-400">Kode ruangan</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/15 backdrop-blur-xl shadow-lg">
            <span className="font-mono text-xs text-slate-200 font-medium">{roomId}</span>
            <button
              onClick={handleCopyLink}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded hover:bg-white/10"
              title={copiedLink ? "Tersalin!" : "Salin kode ruangan"}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* CENTER: MEDIA CONTROLS & COLLABORATION DOCK */}
        <div className="mx-auto bg-slate-900/90 backdrop-blur-xl border border-white/15 px-4 sm:px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 sm:gap-2.5">
          {/* 1. MIC TOGGLE */}
          <Button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all cursor-pointer ${
              isMicOn
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-900/40"
            }`}
            title={isMicOn ? "Matikan Mikrofon" : "Nyalakan Mikrofon"}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          {/* 2. CAMERA TOGGLE */}
          <Button
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all cursor-pointer ${
              isCameraOn
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-900/40"
            }`}
            title={isCameraOn ? "Matikan Kamera" : "Nyalakan Kamera"}
          >
            {isCameraOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          {/* 3. SCREEN SHARE */}
          <Button
            onClick={() => {
              if (isScreenSharing) {
                handleStopScreenShare();
              } else {
                setIsScreenSharing(true);
                setLayoutMode("presentation");
              }
            }}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all cursor-pointer ${
              isScreenSharing
                ? "bg-primary text-white ring-2 ring-primary/40"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title={isScreenSharing ? "Hentikan Berbagi Layar" : "Bagikan Layar"}
          >
            <ScreenShare className="w-5 h-5" />
          </Button>

          {/* 4. RAISE HAND (TABLET+) */}
          <Button
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all cursor-pointer hidden sm:flex ${
              isHandRaised
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950 ring-4 ring-amber-500/40 shadow-lg scale-105"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title={isHandRaised ? "Turunkan Tangan Anda" : "Angkat Tangan"}
          >
            <Hand className={`w-5 h-5 ${isHandRaised ? "fill-current" : ""}`} />
          </Button>

          {/* 5. EMOJI REACTIONS (TABLET+) */}
          <div className="relative hidden sm:block">
            <Button
              onClick={() => setReactionMenuOpen(!reactionMenuOpen)}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Kirim Reaksi Emoji"
            >
              <Smile className="w-5 h-5" />
            </Button>

            {reactionMenuOpen && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl border border-white/20 p-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 z-50">
                {["❤️", "👍", "👏", "🎉", "💡", "😂"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => triggerReaction(emoji)}
                    className="w-10 h-10 rounded-xl hover:bg-white/15 text-2xl flex items-center justify-center transition-transform hover:scale-125 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-[1px] h-7 bg-white/20 mx-0.5 hidden md:block" />

          {/* 6. COLLABORATION TOOLS: Excalidraw Whiteboard, Notes, Polling, Random Picker, Virtual BG */}
          <Button
            onClick={() => setWhiteboardModalOpen(true)}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer hidden md:flex"
            title="Buka Excalidraw Whiteboard"
          >
            <PenTool className="w-5 h-5" />
          </Button>

          {isSuperAdmin && (
            <Button
              onClick={() => setNotesModalOpen(true)}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer hidden md:flex"
              title="Catatan Rapat Bersama (WYSIWYG & Action Items)"
            >
              <FileText className="w-5 h-5" />
            </Button>
          )}

          {/* POLLING (Opens LiveKit Sidebar) */}
          <Button
            onClick={() => {
              setActiveDrawer(activeDrawer === "polling" ? "none" : "polling");
            }}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all cursor-pointer hidden lg:flex ${
              activeDrawer === "polling"
                ? "bg-primary text-white ring-2 ring-primary/40 shadow-lg"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title="Pendapat / Polling"
          >
            <BarChart3 className="w-5 h-5" />
          </Button>

          {isSuperAdmin && (
            <Button
              onClick={() => setRandomPickerModalOpen(true)}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 hover:text-amber-200 transition-all cursor-pointer hidden lg:flex"
              title="Pilih Karyawan Acak"
            >
              <Dices className="w-5 h-5" />
            </Button>
          )}

          <Button
            onClick={() => setVirtualBgModalOpen(true)}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer hidden sm:flex"
            title="Ganti Latar Belakang (Virtual Background)"
          >
            <Sparkles className="w-5 h-5" />
          </Button>

          <div className="w-[1px] h-7 bg-white/20 mx-0.5" />

          {/* 7. PARTICIPANTS DRAWER */}
          <Button
            onClick={() => setActiveDrawer(activeDrawer === "participants" ? "none" : "participants")}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all cursor-pointer relative ${
              activeDrawer === "participants" ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title="Daftar Peserta"
          >
            <Users className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-primary text-[10px] font-bold text-white border border-slate-900">
              {participants.length}
            </span>
          </Button>

          {/* 8. CHAT DRAWER */}
          <Button
            onClick={() => {
              setActiveDrawer(activeDrawer === "chat" ? "none" : "chat");
              setUnreadMessages(0);
            }}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all cursor-pointer relative ${
              activeDrawer === "chat" ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title="Obrolan Peserta"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            )}
          </Button>

          {/* 9. MEETING DETAILS (TABLET+ - Super Admin only) */}
          {isSuperAdmin && (
            <Button
              onClick={() => setActiveDrawer(activeDrawer === "details" ? "none" : "details")}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all cursor-pointer hidden sm:flex ${
                activeDrawer === "details" ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title="Informasi Rapat & Perekaman"
            >
              <Info className="w-5 h-5" />
            </Button>
          )}

          <div className="w-[1px] h-7 bg-white/20 mx-0.5 hidden sm:block" />

          {/* 10. LEAVE BUTTON (KELUAR SENDIRI - ESSENTIAL ON ALL DEVICES) */}
          <Button
            onClick={() => setLeaveModalOpen(true)}
            className="h-11 sm:h-12 px-3 sm:px-4 rounded-full bg-red-600/90 hover:bg-red-700 text-white font-semibold text-xs gap-1.5 shadow-md cursor-pointer"
            title="Tinggalkan Rapat"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>

          {/* PIPELINE DIVIDER & 11. END MEETING FOR ALL (Super Admin only) */}
          {isSuperAdmin && (
            <>
              {/* PIPELINE DIVIDER (PEMBATAS PIPELINE - TABLET+) */}
              <div className="w-[2px] h-7 bg-red-400/40 mx-0.5 hidden sm:block" />

              {/* 11. END MEETING FOR ALL (AKHIRI RAPAT UNTUK SEMUA - TABLET+) */}
              <Button
                onClick={() => setEndMeetingForAllModalOpen(true)}
                className="h-11 sm:h-12 px-3 sm:px-4 rounded-full bg-red-950 hover:bg-red-900 border border-red-500/50 text-red-100 font-bold text-xs gap-1.5 shadow-lg shadow-red-950/60 cursor-pointer hidden sm:flex"
                title="Akhiri Rapat untuk Seluruh Peserta"
              >
                <PhoneOff className="w-4 h-4 text-red-400" />
                <span className="hidden sm:inline">Akhiri Rapat</span>
              </Button>
            </>
          )}
        </div>
      </footer>

      {/* MODAL: EXCALIDRAW WHITEBOARD */}
      <Dialog
        open={whiteboardModalOpen}
        onOpenChange={setWhiteboardModalOpen}
        className="max-w-6xl p-0 overflow-hidden bg-slate-900 border border-white/15 shadow-2xl"
        hideCloseButton
      >
        <div className="px-5 py-3.5 bg-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
              <PenTool className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Whiteboard Kolaboratif Excalidraw
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-blue-300 font-mono font-semibold">
                  {initialMeeting.title}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Papan visual, diagram flowchart, dan coretan tim Falah Meet real-time</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setWhiteboardModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            title="Tutup Whiteboard"
            aria-label="Tutup Whiteboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-0 bg-white">
          <ExcalidrawWhiteboard onClose={() => setWhiteboardModalOpen(false)} />
        </div>
      </Dialog>

      {/* MODAL: CATATAN RAPAT BERSAMA (WYSIWYG & ACTION ITEMS - Super Admin only) */}
      {isSuperAdmin && (
        <Dialog open={notesModalOpen} onOpenChange={setNotesModalOpen} className="max-w-2xl bg-white text-slate-900 border-slate-200">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-slate-900">Catatan Rapat Bersama</DialogTitle>
              <DialogDescription className="text-slate-500">
                Notulensi dan daftar tindak lanjut rapat kantor.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 my-2 text-xs">
          {/* WYSIWYG Editor Container */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Notulensi Rapat (WYSIWYG):
              </label>

              {/* Copy WYSIWYG button right above editor */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyWysiwygNotes}
                className="h-7 text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-300 font-semibold gap-1"
              >
                {copiedNotesFeedback ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedNotesFeedback ? "Tersalin!" : "Salin Notulensi"}</span>
              </Button>
            </div>

            {/* WYSIWYG Toolbar */}
            <div className="flex items-center gap-1 p-1.5 rounded-t-xl bg-slate-100 border border-b-0 border-slate-300 text-slate-700">
              <button
                type="button"
                onClick={() => setNotesContent((prev) => prev + "\n**Teks Tebal**")}
                className="p-1 rounded hover:bg-slate-200 cursor-pointer text-slate-800"
                title="Tebal (Bold)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setNotesContent((prev) => prev + "\n*Teks Miring*")}
                className="p-1 rounded hover:bg-slate-200 cursor-pointer text-slate-800"
                title="Miring (Italic)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-4 bg-slate-300 mx-1" />
              <button
                type="button"
                onClick={() => setNotesContent((prev) => prev + "\n# Judul Utama\n")}
                className="p-1 rounded hover:bg-slate-200 cursor-pointer text-slate-800"
                title="Heading 1"
              >
                <Heading1 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setNotesContent((prev) => prev + "\n## Sub-Judul\n")}
                className="p-1 rounded hover:bg-slate-200 cursor-pointer text-slate-800"
                title="Heading 2"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-4 bg-slate-300 mx-1" />
              <button
                type="button"
                onClick={() => setNotesContent((prev) => prev + "\n- Poin catatan\n")}
                className="p-1 rounded hover:bg-slate-200 cursor-pointer text-slate-800"
                title="Daftar Poin"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setNotesContent((prev) => prev + "\n```json\n{\n  \"status\": \"ok\"\n}\n```")}
                className="p-1 rounded hover:bg-slate-200 cursor-pointer text-slate-800"
                title="Blok Kode"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* High Contrast Editor Area */}
            <textarea
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              rows={6}
              className="w-full p-3 rounded-b-xl border border-slate-300 bg-white text-slate-900 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
              placeholder="Tulis notulensi keputusan rapat..."
            />
          </div>

          {/* Action Items Section */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Action Items (Daftar Tindak Lanjut):
              </label>

              {/* Copy Action Items button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyActionItems}
                className="h-7 text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-300 font-semibold gap-1"
              >
                {copiedActionsFeedback ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedActionsFeedback ? "Tersalin!" : "Salin Action Items"}</span>
              </Button>
            </div>

            {/* Action Items List */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {actionItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() =>
                        setActionItems((prev) =>
                          prev.map((a) => (a.id === item.id ? { ...a, done: !a.done } : a))
                        )
                      }
                      className="w-4 h-4 rounded accent-primary cursor-pointer shrink-0"
                    />
                    <span className={`text-xs truncate ${item.done ? "line-through text-slate-400" : "font-medium text-slate-800"}`}>
                      {item.text}
                    </span>
                  </label>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 font-medium text-slate-600">
                      PIC: {item.assignee}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActionItems((prev) => prev.filter((a) => a.id !== item.id))}
                      className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Action Item Form */}
            <form onSubmit={handleAddActionItem} className="flex items-center gap-2 pt-1">
              <Input
                value={newActionText}
                onChange={(e) => setNewActionText(e.target.value)}
                placeholder="Tambah tugas/action item baru..."
                className="text-xs h-8 text-slate-900 bg-white border-slate-300 flex-1"
              />
              <Button type="submit" size="sm" className="h-8 text-xs font-semibold gap-1 shrink-0 bg-primary text-white">
                <Plus className="w-3.5 h-3.5" /> Tambah
              </Button>
            </form>
          </div>
        </div>

        {/* Action Buttons as requested: Simpan dan Tutup, Hapus Catatan, Batal */}
        <DialogFooter className="flex items-center justify-between border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClearAllNotes}
            className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 font-semibold gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Hapus Catatan
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setNotesModalOpen(false)}
              className="text-xs text-slate-800 bg-white hover:bg-slate-100 border-slate-300 font-semibold cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={() => {
                setNotesModalOpen(false);
                alert("Catatan rapat bersama dan action items berhasil disimpan.");
              }}
              className="text-xs bg-primary hover:bg-primary/95 text-white font-semibold cursor-pointer"
            >
              Simpan dan Tutup
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
      )}

      {/* MODAL: VIRTUAL BACKGROUND SELECTOR IN-MEETING */}
      <Dialog open={virtualBgModalOpen} onOpenChange={setVirtualBgModalOpen}>
        <DialogHeader>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <DialogTitle>Ganti Latar Belakang (Virtual Background)</DialogTitle>
          <DialogDescription>
            Pilih efek latar belakang kamera Anda seperti pada acuan Figma LiveKit Meeting.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3">
          <div
            onClick={() => setVirtualBg("none")}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
              virtualBg === "none" ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:bg-muted/40"
            }`}
          >
            <div className="w-full aspect-video rounded-lg bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 mb-2">
              Kamera Asli
            </div>
            <div className="text-xs font-semibold text-foreground">Tanpa Efek</div>
          </div>

          <div
            onClick={() => setVirtualBg("blur")}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
              virtualBg === "blur" ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:bg-muted/40"
            }`}
          >
            <div className="w-full aspect-video rounded-lg bg-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700 mb-2">
              Blur Halus
            </div>
            <div className="text-xs font-semibold text-foreground">Blur Halus</div>
          </div>

          <div
            onClick={() => setVirtualBg("heavy-blur")}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
              virtualBg === "heavy-blur" ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:bg-muted/40"
            }`}
          >
            <div className="w-full aspect-video rounded-lg bg-slate-400 flex items-center justify-center text-xs font-semibold text-slate-800 mb-2">
              Blur Pekat
            </div>
            <div className="text-xs font-semibold text-foreground">Blur Maksimal</div>
          </div>

          <div
            onClick={() => setVirtualBg("office")}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
              virtualBg === "office" ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:bg-muted/40"
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&auto=format&fit=crop&q=80"
              alt="Office"
              className="w-full aspect-video rounded-lg object-cover mb-2"
            />
            <div className="text-xs font-semibold text-foreground">Kantor Modern</div>
          </div>

          <div
            onClick={() => setVirtualBg("boardroom")}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
              virtualBg === "boardroom" ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:bg-muted/40"
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&auto=format&fit=crop&q=80"
              alt="Boardroom"
              className="w-full aspect-video rounded-lg object-cover mb-2"
            />
            <div className="text-xs font-semibold text-foreground">Ruang Rapat</div>
          </div>

          <div
            onClick={() => setVirtualBg("cyber")}
            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
              virtualBg === "cyber" ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:bg-muted/40"
            }`}
          >
            <div className="w-full aspect-video rounded-lg bg-gradient-to-tr from-slate-950 via-primary to-blue-500 flex items-center justify-center text-[10px] font-bold text-white mb-2">
              Falah Sapphire
            </div>
            <div className="text-xs font-semibold text-foreground">Studio Falah</div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setVirtualBgModalOpen(false)}>
            Selesai
          </Button>
        </DialogFooter>
      </Dialog>

      {/* MODAL: RANDOM USER PICKER (Super Admin only) */}
      {isSuperAdmin && (
        <Dialog open={randomPickerModalOpen} onOpenChange={setRandomPickerModalOpen} className="max-w-md bg-card">
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
              <Dices className="w-5 h-5" />
            </div>
            <DialogTitle>Pilih Karyawan Acak</DialogTitle>
            <DialogDescription>
              Pilih secara acak peserta di dalam ruangan rapat untuk berbicara berikutnya atau memimpin sesi demo.
            </DialogDescription>
          </DialogHeader>

          {/* Clean Result Without Black Box Card */}
          {(isSpinningPicker || pickedUser) && (
            <div className="text-center py-4 space-y-2 animate-in zoom-in-95">
              {isSpinningPicker ? (
                <div className="space-y-1.5">
                  <div className="text-2xl font-extrabold text-amber-600 animate-pulse">
                    {pickedUser || "Memilih peserta..."}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Mengacak dari {participants.length} peserta di ruangan...</div>
                </div>
              ) : pickedUser ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border-2 border-amber-300 shadow-sm">
                    <Crown className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <div className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">Peserta Terpilih:</div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">{pickedUser}</div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRandomPickerModalOpen(false)}
              className="text-slate-900 bg-white hover:bg-slate-100 border-slate-300 font-bold cursor-pointer"
            >
              Tutup
            </Button>
            <Button
              onClick={handlePickRandomUser}
              disabled={isSpinningPicker}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer"
            >
              <Dices className="w-4 h-4" />
              <span>{isSpinningPicker ? "Mengacak..." : "Putar Pengacak"}</span>
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {/* MODAL: INSTANT CALL / INVITE EMPLOYEE (Super Admin only) */}
      {isSuperAdmin && (
        <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
              <UserPlus className="w-5 h-5" />
            </div>
            <DialogTitle>Panggil Karyawan ke Rapat Ini</DialogTitle>
            <DialogDescription>
              Panggil rekan kerja kantor langsung ke ruang <span className="font-semibold text-foreground">&quot;{initialMeeting.title}&quot;</span>. Layar mereka akan berdering instan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
              <Input
                value={inviteSearch}
                onChange={(e) => setInviteSearch(e.target.value)}
                placeholder="Cari nama karyawan atau divisi..."
                className="pl-8 text-xs h-8"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {INITIAL_EMPLOYEES.filter(
                (e) =>
                  !participants.some((p) => p.name.includes(e.name)) &&
                  (e.name.toLowerCase().includes(inviteSearch.toLowerCase()) ||
                    e.department.toLowerCase().includes(inviteSearch.toLowerCase()) ||
                    e.role.toLowerCase().includes(inviteSearch.toLowerCase()))
              )
                .slice(0, 8)
                .map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-2 rounded-xl border border-border hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-foreground text-xs">{emp.name}</div>
                        <div className="text-[10px] text-muted-foreground">{emp.role} • {emp.department}</div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleInstantCallEmployee(emp)}
                      className="h-7 text-xs gap-1"
                    >
                      <PhoneCall className="w-3 h-3" /> Panggil
                    </Button>
                  </div>
                ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {/* MODAL: LEAVE CONFIRMATION (KELUAR SENDIRI) */}
      <Dialog open={leaveModalOpen} onOpenChange={setLeaveModalOpen}>
        <DialogHeader>
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2">
            <PhoneOff className="w-5 h-5" />
          </div>
          <DialogTitle>Tinggalkan Sesi Rapat?</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin keluar dari ruang rapat <span className="font-semibold text-foreground">&quot;{initialMeeting.title}&quot;</span>? Rapat akan tetap berlangsung untuk peserta lain.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLeaveModalOpen(false)}
            className="text-xs text-slate-800 bg-white hover:bg-slate-100 border-slate-300 font-semibold cursor-pointer"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setLeaveModalOpen(false);
              router.push(isSuperAdmin ? "/admin" : "/");
            }}
            className="text-xs gap-1.5"
          >
            <PhoneOff className="w-3.5 h-3.5" /> {isSuperAdmin ? "Keluar ke Dashboard" : "Keluar dari Rapat"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* MODAL: END MEETING FOR ALL (AKHIRI RAPAT UNTUK SELURUH PESERTA - Super Admin only) */}
      {isSuperAdmin && (
        <Dialog open={endMeetingForAllModalOpen} onOpenChange={setEndMeetingForAllModalOpen}>
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle>Akhiri Rapat untuk Seluruh Peserta?</DialogTitle>
            <DialogDescription>
              Sebagai Super Admin, tindakan ini akan menutup ruang rapat <span className="font-semibold text-foreground">&quot;{initialMeeting.title}&quot;</span> (#{initialMeeting.roomCode}) dan mengeluarkan seluruh peserta secara serentak. Rekaman cloud akan difinalisasi.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEndMeetingForAllModalOpen(false)}
              className="text-xs text-slate-800 bg-white hover:bg-slate-100 border-slate-300 font-semibold cursor-pointer"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleEndMeetingForAll}
              className="text-xs gap-1.5 font-bold bg-red-700 hover:bg-red-800"
            >
              <PhoneOff className="w-3.5 h-3.5" /> Akhiri untuk Semua
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}

export default function InMeetingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white text-xs gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span>Menghubungkan ke Ruang Rapat Falah Meet...</span>
        </div>
      }
    >
      <InMeetingContent />
    </React.Suspense>
  );
}
