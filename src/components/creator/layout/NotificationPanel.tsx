"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import { useCreatorNotifications } from "@/contexts/CreatorNotificationContext";
import NotificationIcon from "@/components/creator/layout/NotificationIcon";
import { formatDateTime } from "@/lib/format";
import {
  getNotificationActionLabel,
  getNotificationHref,
} from "@/lib/notification-display";

export default function NotificationPanel() {
  const {
    notifications,
    unreadCount,
    loading,
    panelOpen,
    setPanelOpen,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  } = useCreatorNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  const hasEarnings = notifications.some((n) => n.type === "new_earning");
  const hasReferrals = notifications.some((n) => n.type === "new_referral");
  const hasPayouts = notifications.some((n) => n.type === "payout_paid");

  useEffect(() => {
    if (!panelOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelOpen, setPanelOpen]);

  useEffect(() => {
    if (!panelOpen) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [panelOpen]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setPanelOpen(!panelOpen)}
        aria-label="Notifications"
        aria-expanded={panelOpen}
        className="creator-btn-outline relative rounded-lg p-2 text-creator-text-secondary"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-creator-accent px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {panelOpen && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setPanelOpen(false)}
            className="creator-notification-backdrop fixed inset-0 z-40 bg-black/50 md:hidden"
          />

          <div className="creator-notification-panel fixed inset-x-0 bottom-0 z-50 flex max-h-[min(75vh,32rem)] flex-col overflow-hidden rounded-t-2xl border border-creator-border bg-creator-card shadow-xl md:absolute md:inset-x-auto md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-2 md:max-h-none md:w-80 md:rounded-xl">
            <div className="flex items-center justify-between border-b border-creator-border px-4 py-3">
              <h2 className="text-sm font-semibold text-creator-text-primary">
                Notifications
              </h2>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllAsRead()}
                    className="text-xs text-creator-success transition-opacity hover:opacity-80"
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearAllNotifications()}
                    className="text-xs text-creator-text-secondary transition-colors hover:text-creator-text-primary"
                  >
                    Clear all
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  aria-label="Close notifications"
                  className="rounded-lg p-1 text-creator-text-secondary transition-colors hover:text-creator-text-primary md:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto md:max-h-80">
              {loading && notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-creator-text-secondary">
                  Loading...
                </p>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="mx-auto mb-2 h-8 w-8 text-creator-text-secondary opacity-40" />
                  <p className="text-sm text-creator-text-secondary">
                    No notifications yet
                  </p>
                  <p className="mt-1 text-xs text-creator-text-secondary">
                    You&apos;ll be notified about referrals, earnings, and
                    payouts
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group flex items-start gap-2 border-b border-creator-border px-3 py-3 transition-colors last:border-0 hover:bg-creator-bg/50 ${
                      notification.read ? "opacity-70" : ""
                    }`}
                  >
                    <Link
                      href={getNotificationHref(notification.type)}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                        setPanelOpen(false);
                      }}
                      className="flex min-w-0 flex-1 items-start gap-3"
                    >
                      <NotificationIcon notification={notification} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-creator-text-primary">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-creator-accent" />
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-creator-text-secondary">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-[11px] text-creator-text-secondary">
                          {formatDateTime(notification.createdAt)}
                        </p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeNotification(notification.id)}
                      aria-label="Clear notification"
                      className="shrink-0 rounded-lg p-1.5 text-creator-text-secondary opacity-60 transition-all hover:bg-creator-bg hover:text-creator-text-primary hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="space-y-2 border-t border-creator-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-3">
                {hasReferrals && (
                  <Link
                    href="/creator/referrals"
                    onClick={() => setPanelOpen(false)}
                    className="block text-xs font-medium text-creator-success transition-opacity hover:opacity-80"
                  >
                    View all referrals →
                  </Link>
                )}
                {hasEarnings && (
                  <Link
                    href="/creator/earnings"
                    onClick={() => setPanelOpen(false)}
                    className="block text-xs font-medium text-creator-success transition-opacity hover:opacity-80"
                  >
                    {getNotificationActionLabel("new_earning")}
                  </Link>
                )}
                {hasPayouts && (
                  <Link
                    href="/creator/payouts"
                    onClick={() => setPanelOpen(false)}
                    className="block text-xs font-medium text-creator-success transition-opacity hover:opacity-80"
                  >
                    {getNotificationActionLabel("payout_paid")}
                  </Link>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
