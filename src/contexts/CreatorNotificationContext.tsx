"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  clearAllNotifications as clearAllNotificationsApi,
  getNotifications,
  markAllNotificationsRead as markAllReadApi,
  markNotificationRead as markReadApi,
  removeNotification as removeNotificationApi,
  simulateReferralNotification as simulateReferralNotificationApi,
  simulateEarningNotification as simulateEarningNotificationApi,
  simulatePayoutPaidNotification as simulatePayoutPaidNotificationApi,
} from "@/lib/api/creator";
import type { CreatorNotification } from "@/types/creator";
import {
  playEarningsNotificationSound,
  preloadEarningsNotificationSound,
  setupEarningsNotificationSoundUnlock,
} from "@/lib/earnings-notification-sound";

interface CreatorNotificationContextValue {
  notifications: CreatorNotification[];
  unreadCount: number;
  loading: boolean;
  panelOpen: boolean;
  toasts: CreatorNotification[];
  setPanelOpen: (open: boolean) => void;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  dismissToast: (id: string) => void;
}

const CreatorNotificationContext =
  createContext<CreatorNotificationContextValue>({
    notifications: [],
    unreadCount: 0,
    loading: true,
    panelOpen: false,
    toasts: [],
    setPanelOpen: () => {},
    refreshNotifications: async () => {},
    markAsRead: async () => {},
    markAllAsRead: async () => {},
    removeNotification: async () => {},
    clearAllNotifications: async () => {},
    dismissToast: () => {},
  });

const POLL_INTERVAL_MS = 4000;
const TOAST_DURATION_MS = 6000;

export function CreatorNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<CreatorNotification[]>(
    []
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [toasts, setToasts] = useState<CreatorNotification[]>([]);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const sessionStartRef = useRef(Date.now());
  const refreshNotificationsRef = useRef(async () => {});

  const pushToast = useCallback((notification: CreatorNotification) => {
    setToasts((current) => {
      if (current.some((toast) => toast.id === notification.id)) {
        return current;
      }

      return [notification, ...current].slice(0, 3);
    });

    window.setTimeout(() => {
      setToasts((current) =>
        current.filter((toast) => toast.id !== notification.id)
      );
    }, TOAST_DURATION_MS);
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const result = await getNotifications();
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);

      const knownIds = knownIdsRef.current;

      for (const notification of result.notifications) {
        if (knownIds.has(notification.id)) continue;
        knownIds.add(notification.id);

        const isRecent =
          new Date(notification.createdAt).getTime() >=
          sessionStartRef.current - 1000;

        if (!notification.read && isRecent) {
          if (notification.type === "new_earning") {
            void playEarningsNotificationSound();
          }
          pushToast(notification);
        }
      }
    } catch {
      // Keep existing notifications on transient failures.
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  refreshNotificationsRef.current = refreshNotifications;

  const markAsRead = useCallback(async (id: string) => {
    const result = await markReadApi(id);
    setNotifications(result.notifications);
    setUnreadCount(result.unreadCount);
  }, []);

  const markAllAsRead = useCallback(async () => {
    const result = await markAllReadApi();
    setNotifications(result.notifications);
    setUnreadCount(result.unreadCount);
  }, []);

  const removeNotification = useCallback(async (id: string) => {
    const result = await removeNotificationApi(id);
    knownIdsRef.current.delete(id);
    setNotifications(result.notifications);
    setUnreadCount(result.unreadCount);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const clearAllNotifications = useCallback(async () => {
    const result = await clearAllNotificationsApi();
    knownIdsRef.current.clear();
    setNotifications(result.notifications);
    setUnreadCount(result.unreadCount);
    setToasts([]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    refreshNotifications();
    const interval = window.setInterval(refreshNotifications, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [refreshNotifications]);

  useEffect(() => {
    preloadEarningsNotificationSound();
    setupEarningsNotificationSoundUnlock();
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("ctom-demo-referral-fired")) return;
    sessionStorage.setItem("ctom-demo-referral-fired", "1");

    const timer = window.setTimeout(async () => {
      try {
        await simulateReferralNotificationApi();
        await refreshNotificationsRef.current();
      } catch {
        // Ignore demo failures in production-like environments.
      }
    }, 5000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("ctom-demo-earning-fired")) return;
    sessionStorage.setItem("ctom-demo-earning-fired", "1");

    const timer = window.setTimeout(async () => {
      try {
        await simulateEarningNotificationApi();
        await refreshNotificationsRef.current();
      } catch {
        // Ignore demo failures in production-like environments.
      }
    }, 12000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("ctom-demo-payout-fired")) return;
    sessionStorage.setItem("ctom-demo-payout-fired", "1");

    const timer = window.setTimeout(async () => {
      try {
        await simulatePayoutPaidNotificationApi();
        await refreshNotificationsRef.current();
      } catch {
        // Ignore demo failures in production-like environments.
      }
    }, 18000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <CreatorNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        panelOpen,
        toasts,
        setPanelOpen,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        dismissToast,
      }}
    >
      {children}
    </CreatorNotificationContext.Provider>
  );
}

export function useCreatorNotifications() {
  return useContext(CreatorNotificationContext);
}
