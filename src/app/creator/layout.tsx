"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/creator/layout/Sidebar";
import TopBar from "@/components/creator/layout/TopBar";
import AuthGuard from "@/components/creator/auth/AuthGuard";
import {
  ThemeProvider,
  creatorThemeClass,
  useTheme,
} from "@/contexts/ThemeContext";
import { CreatorProfileProvider } from "@/contexts/CreatorProfileContext";
import { CreatorNotificationProvider } from "@/contexts/CreatorNotificationContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import NotificationToasts from "@/components/creator/layout/NotificationToasts";

const pageTitles: Record<string, string> = {
  "/creator": "Creator Dashboard",
  "/creator/referrals": "My Referrals",
  "/creator/earnings": "Earnings History",
  "/creator/payouts": "Payouts",
  "/creator/content": "Content & Promotion",
  "/creator/settings": "Settings",
};

function DashboardChrome({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <div className={`creator-shell ${creatorThemeClass(theme)}`}>
      <Sidebar />
      <div className="md:pl-60">
        <TopBar title={title} />
        <main className="px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-6 md:py-6">
          <div className="mx-auto max-w-[1200px]">{children}</div>
        </main>
      </div>
      <NotificationToasts />
    </div>
  );
}

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Creator Dashboard";

  return (
    <AuthGuard>
      <ThemeProvider>
        <CreatorProfileProvider>
          <CreatorNotificationProvider>
            <SidebarProvider>
              <DashboardChrome title={title}>{children}</DashboardChrome>
            </SidebarProvider>
          </CreatorNotificationProvider>
        </CreatorProfileProvider>
      </ThemeProvider>
    </AuthGuard>
  );
}
