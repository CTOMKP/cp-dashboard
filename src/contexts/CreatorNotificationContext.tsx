"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CreatorNotification } from "@/types/creator";
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
    setLoading(false);
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
    setUnreadCount(0);
  }, []);

  const removeNotification = useCallback(async (id: string) => {
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
