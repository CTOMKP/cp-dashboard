"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Home,
  LogOut,
  Megaphone,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";

const navItems = [
  { href: "/creator", label: "Overview", icon: Home, exact: true },
  { href: "/creator/referrals", label: "Referrals", icon: Users },
  { href: "/creator/earnings", label: "Earnings", icon: BarChart3 },
  { href: "/creator/payouts", label: "Payouts", icon: Wallet },
  { href: "/creator/content", label: "Content & Promotion", icon: Megaphone },
  { href: "/creator/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebar();
  const { logout } = usePrivyAuth();

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={closeSidebar}
        className={`creator-sidebar-backdrop fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`creator-sidebar fixed left-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-r border-creator-border bg-creator-sidebar transition-transform duration-300 md:z-40 md:w-60 md:max-w-none md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-creator-border px-4 py-5">
          <Image
            src="/ctom-marketplace-logo.png"
            alt="CTO Marketplace"
            width={180}
            height={36}
            className="h-8 w-auto"
            priority
          />
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close menu"
            className="rounded-lg p-2 text-creator-text-secondary transition-colors hover:text-creator-text-primary md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-creator-accent-glow text-creator-accent shadow-[0_0_20px_rgba(255,80,40,0.15)] [&_svg]:text-creator-accent"
                    : "text-creator-text-secondary hover:bg-creator-accent-muted hover:text-creator-text-primary"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0 md:h-4 md:w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-creator-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => {
              closeSidebar();
              void logout();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-creator-text-secondary transition-colors hover:bg-creator-accent-muted hover:text-creator-text-primary"
          >
            <LogOut className="h-5 w-5 shrink-0 md:h-4 md:w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
