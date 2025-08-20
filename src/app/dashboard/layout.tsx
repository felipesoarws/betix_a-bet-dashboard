"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { DashSidedarMenu } from "@/components/ui/common/sidebar-menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <main className="w-full">{children}</main>
      <DashSidedarMenu />
    </SidebarProvider>
  );
}
