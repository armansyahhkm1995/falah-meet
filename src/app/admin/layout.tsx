import * as React from "react";
import { AdminLayout } from "@/components/admin/admin-layout";

export const metadata = {
  title: "Falah Meet • Super Admin Console",
  description: "Enterprise Video Conferencing Management System powered by LiveKit",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
