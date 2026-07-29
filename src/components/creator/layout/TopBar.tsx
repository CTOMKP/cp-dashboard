"use client";

import Link from "next/link";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCreatorProfile } from "@/contexts/CreatorProfileContext";
import { useSidebar } from "@/contexts/SidebarContext";
import NotificationPanel from "@/components/creator/layout/NotificationPanel";

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useCreatorProfile();
  const { toggleSidebar } = useSidebar();

  const initial = profile?.username?.charAt(0).toUpperCase() ?? "C";

  return (
    <header className="creator-topbar sticky top-0 z-30 flex h-14 items-center gap-3 px-4 backdrop-blur-sm transition-colors duration-200 md:h-16 md:gap-4 md:px-6">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Open navigation menu"
        className="creator-btn-outline rounded-lg p-2 text-creator-text-secondary md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="min-w-0 flex-1 truncate text-base font-semibold text-creator-text-primary md:text-xl">
        {title}
      </h1>

      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="creator-btn-outline rounded-lg p-2 text-creator-text-secondary"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <NotificationPanel />

        <Link
          href="/creator/settings"
          className="h-8 w-8 overflow-hidden rounded-full border border-creator-border bg-gradient-to-br from-[#ff007a] via-[#ff8c00] to-[#ffc107]"
          aria-label="Profile settings"
        >
          {profile?.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt={profile.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
              {initial}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
