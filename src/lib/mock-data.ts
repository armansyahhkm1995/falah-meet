export interface ActiveMeeting {
  id: string;
  title: string;
  roomCode: string;
  hostName: string;
  hostAvatar: string;
  department: string;
  participantCount: number;
  maxParticipants: number;
  startedAt: string;
  durationMinutes: number;
  isLocked: boolean;
  isRecording: boolean;
  hasPassword: boolean;
  attendees: {
    name: string;
    avatar: string;
    role: string;
    isMuted: boolean;
    isCameraOn: boolean;
  }[];
}

export type DepartmentName =
  | "Engineering"
  | "Product & Design"
  | "Marketing & Growth"
  | "People & Operations"
  | "Executive";

export interface DepartmentInfo {
  id: string;
  name: DepartmentName;
  leadName: string;
  leadAvatar: string;
  description: string;
  memberCount: number;
  activeInMeetingCount: number;
  color: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: DepartmentName;
  role: string;
  status: "active" | "in_meeting" | "offline";
  lastActive: string;
}

export interface Recording {
  id: string;
  title: string;
  roomCode: string;
  hostName: string;
  department: string;
  duration: string;
  date: string;
  fileSize: string;
  views: number;
  downloadUrl: string;
}

export const INITIAL_DEPARTMENTS: DepartmentInfo[] = [
  {
    id: "dept-1",
    name: "Engineering",
    leadName: "Rian Pratama",
    leadAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    description: "Pengembangan arsitektur backend, frontend, mobile, dan infrastruktur cloud.",
    memberCount: 74,
    activeInMeetingCount: 16,
    color: "blue",
  },
  {
    id: "dept-2",
    name: "Product & Design",
    leadName: "Aulia Rahma",
    leadAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    description: "Perancangan UI/UX Falah One, riset produk, dan roadmap fitur aplikasi.",
    memberCount: 28,
    activeInMeetingCount: 7,
    color: "purple",
  },
  {
    id: "dept-3",
    name: "Marketing & Growth",
    leadName: "Reza Mahendra",
    leadAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    description: "Strategi pertumbuhan, komunikasi eksternal, dan kampanye digital.",
    memberCount: 32,
    activeInMeetingCount: 5,
    color: "amber",
  },
  {
    id: "dept-4",
    name: "People & Operations",
    leadName: "Dewi Kusuma",
    leadAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    description: "Manajemen talenta, kultur perusahaan, rekrutmen, dan operasional kantor.",
    memberCount: 22,
    activeInMeetingCount: 0,
    color: "emerald",
  },
  {
    id: "dept-5",
    name: "Executive",
    leadName: "Arman Hakim",
    leadAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    description: "Dewan direksi dan kepemimpinan strategis perusahaan.",
    memberCount: 6,
    activeInMeetingCount: 2,
    color: "slate",
  },
];

export const INITIAL_ACTIVE_MEETINGS: ActiveMeeting[] = [
  {
    id: "meet-1",
    title: "Sprint Planning & Backlog Refinement",
    roomCode: "eng-sprint-42",
    hostName: "Rian Pratama",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    department: "Engineering",
    participantCount: 12,
    maxParticipants: 30,
    startedAt: "10:15 WIB",
    durationMinutes: 42,
    isLocked: false,
    isRecording: true,
    hasPassword: false,
    attendees: [
      { name: "Rian Pratama", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", role: "Host", isMuted: false, isCameraOn: true },
      { name: "Dimas Anggara", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", role: "Member", isMuted: true, isCameraOn: true },
      { name: "Sarah Nabila", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", role: "Member", isMuted: false, isCameraOn: true },
      { name: "Fajar Santoso", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", role: "Member", isMuted: true, isCameraOn: false },
    ],
  },
  {
    id: "meet-2",
    title: "Weekly Product Design Critique (Falah One V2)",
    roomCode: "des-critique-hub",
    hostName: "Aulia Rahma",
    hostAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    department: "Product & Design",
    participantCount: 7,
    maxParticipants: 20,
    startedAt: "10:30 WIB",
    durationMinutes: 27,
    isLocked: false,
    isRecording: false,
    hasPassword: true,
    attendees: [
      { name: "Aulia Rahma", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", role: "Host", isMuted: false, isCameraOn: true },
      { name: "Budi Gunawan", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80", role: "Member", isMuted: true, isCameraOn: true },
      { name: "Citra Lestari", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80", role: "Member", isMuted: false, isCameraOn: false },
    ],
  },
  {
    id: "meet-3",
    title: "Monthly Town Hall / All-Hands Q4 Sync",
    roomCode: "all-hands-q4",
    hostName: "Arman Hakim (Super Admin)",
    hostAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    department: "Executive",
    participantCount: 68,
    maxParticipants: 180,
    startedAt: "09:00 WIB",
    durationMinutes: 117,
    isLocked: true,
    isRecording: true,
    hasPassword: true,
    attendees: [
      { name: "Arman Hakim", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", role: "Host", isMuted: false, isCameraOn: true },
      { name: "Dewi Kusuma", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80", role: "Member", isMuted: true, isCameraOn: true },
    ],
  },
  {
    id: "meet-4",
    title: "Q4 Marketing Campaign Strategy",
    roomCode: "mkt-q4-sync",
    hostName: "Reza Mahendra",
    hostAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    department: "Marketing & Growth",
    participantCount: 5,
    maxParticipants: 15,
    startedAt: "10:45 WIB",
    durationMinutes: 12,
    isLocked: false,
    isRecording: false,
    hasPassword: false,
    attendees: [
      { name: "Reza Mahendra", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80", role: "Host", isMuted: false, isCameraOn: true },
    ],
  },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "emp-1",
    name: "Arman Hakim",
    email: "arman@falah.one",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    department: "Executive",
    role: "Chief Technology Officer / Super Admin",
    status: "in_meeting",
    lastActive: "Sedang dalam rapat",
  },
  {
    id: "emp-2",
    name: "Rian Pratama",
    email: "rian.pratama@falah.one",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    department: "Engineering",
    role: "Lead Software Architect",
    status: "in_meeting",
    lastActive: "Sedang dalam rapat",
  },
  {
    id: "emp-3",
    name: "Aulia Rahma",
    email: "aulia.rahma@falah.one",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    department: "Product & Design",
    role: "Principal Product Designer",
    status: "in_meeting",
    lastActive: "Sedang dalam rapat",
  },
  {
    id: "emp-4",
    name: "Dimas Anggara",
    email: "dimas.a@falah.one",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    department: "Engineering",
    role: "Senior Backend Engineer",
    status: "in_meeting",
    lastActive: "Sedang dalam rapat",
  },
  {
    id: "emp-5",
    name: "Sarah Nabila",
    email: "sarah.nabila@falah.one",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    department: "Engineering",
    role: "Senior Frontend Engineer",
    status: "in_meeting",
    lastActive: "Sedang dalam rapat",
  },
  {
    id: "emp-6",
    name: "Reza Mahendra",
    email: "reza.m@falah.one",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    department: "Marketing & Growth",
    role: "Head of Marketing",
    status: "in_meeting",
    lastActive: "Sedang dalam rapat",
  },
  {
    id: "emp-7",
    name: "Dewi Kusuma",
    email: "dewi.k@falah.one",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    department: "People & Operations",
    role: "Head of People & Culture",
    status: "active",
    lastActive: "Aktif 5 menit lalu",
  },
  {
    id: "emp-8",
    name: "Budi Gunawan",
    email: "budi.g@falah.one",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    department: "Product & Design",
    role: "UI/UX Designer",
    status: "active",
    lastActive: "Aktif 12 menit lalu",
  },
  {
    id: "emp-9",
    name: "Fajar Santoso",
    email: "fajar.s@falah.one",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    department: "Engineering",
    role: "DevOps & Cloud Engineer",
    status: "active",
    lastActive: "Aktif sekarang",
  },
  {
    id: "emp-10",
    name: "Citra Lestari",
    email: "citra.l@falah.one",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    department: "Product & Design",
    role: "Product Manager",
    status: "active",
    lastActive: "Aktif 20 menit lalu",
  },
  {
    id: "emp-11",
    name: "Hendra Wijaya",
    email: "hendra.w@falah.one",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    department: "Engineering",
    role: "Mobile App Engineer",
    status: "offline",
    lastActive: "Kemarin, 18:30 WIB",
  },
  {
    id: "emp-12",
    name: "Nadia Utami",
    email: "nadia.u@falah.one",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    department: "People & Operations",
    role: "HR Talent Acquisition",
    status: "offline",
    lastActive: "Kemarin, 17:45 WIB",
  },
];

export const INITIAL_RECORDINGS: Recording[] = [
  {
    id: "rec-1",
    title: "All-Hands Meeting Q3 Performance & Roadmap 2026",
    roomCode: "all-hands-q3",
    hostName: "Arman Hakim",
    department: "Executive",
    duration: "01:24:18",
    date: "14 Nov 2026, 09:00 WIB",
    fileSize: "748.2 MB",
    views: 142,
    downloadUrl: "#download",
  },
  {
    id: "rec-2",
    title: "Engineering Tech Talk: WebRTC SFU Scaling",
    roomCode: "eng-tech-talk-09",
    hostName: "Rian Pratama",
    department: "Engineering",
    duration: "48:12",
    date: "12 Nov 2026, 14:00 WIB",
    fileSize: "384.5 MB",
    views: 56,
    downloadUrl: "#download",
  },
  {
    id: "rec-3",
    title: "Falah One Design System Handover Session",
    roomCode: "des-handover-falah",
    hostName: "Aulia Rahma",
    department: "Product & Design",
    duration: "35:40",
    date: "10 Nov 2026, 11:15 WIB",
    fileSize: "264.1 MB",
    views: 89,
    downloadUrl: "#download",
  },
  {
    id: "rec-4",
    title: "Brand Guideline & Content Strategy Brainstorming",
    roomCode: "mkt-brainstorm-26",
    hostName: "Reza Mahendra",
    department: "Marketing & Growth",
    duration: "52:05",
    date: "08 Nov 2026, 13:30 WIB",
    fileSize: "410.8 MB",
    views: 31,
    downloadUrl: "#download",
  },
  {
    id: "rec-5",
    title: "Sprint Retrospective: Batch 14 Delivery",
    roomCode: "eng-retro-b14",
    hostName: "Sarah Nabila",
    department: "Engineering",
    duration: "29:14",
    date: "05 Nov 2026, 16:00 WIB",
    fileSize: "198.3 MB",
    views: 24,
    downloadUrl: "#download",
  },
];
