"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CreatorNotification } from "@/types/creator";
import { getAuthToken } from "@/lib/authSession";
import { creatorNotificationService } from "@/services/creatorNotificationService";
import {
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
    loading: false,
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

export function CreatorNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<CreatorNotification[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [toasts, setToasts] = useState<CreatorNotification[]>([]);

  const refreshNotifications = useCallback(async () => {
    if (!getAuthToken()) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    try {
      const next = await creatorNotificationService.list();
      setNotifications((current) => {
        const known = new Set(current.map((item) => item.id));
        const freshUnread = next.filter((item) => !item.read && !known.has(item.id));
        if (freshUnread.length > 0) {
          setToasts((toasts) => [...freshUnread, ...toasts].slice(0, 4));
        }
        return next;
      });
      setUnreadCount(next.filter((item) => !item.read).length);
    } catch (error) {
      console.error("Failed to refresh Creator Program notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    await creatorNotificationService.markRead(id);
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await creatorNotificationService.markAllRead();
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
    setUnreadCount(0);
  }, []);

  const removeNotification = useCallback(async (id: string) => {
    await creatorNotificationService.remove(id);
    setNotifications((current) => {
      const removed = current.find((notification) => notification.id === id);
      if (removed && !removed.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      return current.filter((notification) => notification.id !== id);
    });
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const clearAllNotifications = useCallback(async () => {
    await creatorNotificationService.clearAll();
    setNotifications([]);
    setUnreadCount(0);
    setToasts([]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    preloadEarningsNotificationSound();
    setupEarningsNotificationSoundUnlock();
  }, []);

  useEffect(() => {
    const refresh = () => void refreshNotifications();
    const clear = () => {
      setNotifications([]);
      setUnreadCount(0);
      setToasts([]);
    };

    window.addEventListener('cto-authenticated', refresh);
    window.addEventListener('cto-logged-out', clear);
    window.addEventListener('focus', refresh);
    if (getAuthToken()) refresh();
    const interval = window.setInterval(refresh, 30_000);

    return () => {
      window.removeEventListener('cto-authenticated', refresh);
      window.removeEventListener('cto-logged-out', clear);
      window.removeEventListener('focus', refresh);
      window.clearInterval(interval);
    };
  }, [refreshNotifications]);

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
