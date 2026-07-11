"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useCreatorNotifications } from "@/contexts/CreatorNotificationContext";
import NotificationIcon from "@/components/creator/layout/NotificationIcon";
import {
  getNotificationActionLabel,
  getNotificationHref,
} from "@/lib/notification-display";

export default function NotificationToasts() {
  const { toasts, dismissToast, markAsRead } = useCreatorNotifications();

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 top-[4.5rem] z-50 flex flex-col gap-3 md:inset-x-auto md:right-6 md:top-20 md:w-full md:max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="creator-notification-toast pointer-events-auto flex items-start gap-3 rounded-xl border border-creator-border bg-creator-card p-4 shadow-lg"
        >
          <NotificationIcon notification={toast} />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-creator-text-primary">
              {toast.title}
            </p>
            <p className="mt-1 text-sm text-creator-text-secondary">
              {toast.message}
            </p>
            <Link
              href={getNotificationHref(toast.type)}
              onClick={() => {
                markAsRead(toast.id);
                dismissToast(toast.id);
              }}
              className="mt-2 inline-block text-xs font-medium text-creator-success transition-opacity hover:opacity-80"
            >
              {getNotificationActionLabel(toast.type)}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="shrink-0 rounded-lg p-1 text-creator-text-secondary transition-colors hover:text-creator-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
