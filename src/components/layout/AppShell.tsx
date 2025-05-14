'use client';

import type React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarRail,
} from '@/components/ui/sidebar';
import Header from '@/components/layout/Header';
import SidebarNav from '@/components/layout/SidebarNav';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <SidebarRail />
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarNav />
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
        <footer className="py-4 px-6 text-center text-sm text-muted-foreground border-t">
          © {new Date().getFullYear()} IndoSimVest. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
