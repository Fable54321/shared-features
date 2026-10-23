
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type {
  Notification,
  NotificationType,
  CreateNotificationInput,
  PaginatedNotifications,
  NotificationTypesResponse,
  UnreadCountResponse,
  ReadAllResponse,
} from "../Types/notification.types";

// ============================================
// API FETCH
// ============================================

export type NotificationApiFetch = <T>(
  path: string,
  options?: RequestInit,
) => Promise<T>;

// ============================================
// CONTEXT TYPES
// ============================================

interface NotificationContextType {
  notifications: Notification[];
  notificationTypes: NotificationType[];

  unreadCount: number;
  total: number;
  page: number;
  limit: number;

  loading: boolean;
  sending: boolean;
  error: string | null;

  fetchNotifications: (
    page?: number,
    limit?: number,
    unread?: boolean,
  ) => Promise<void>;

  fetchUnreadCount: () => Promise<void>;
  fetchNotificationTypes: () => Promise<void>;

  sendNotification: (
    input: CreateNotificationInput,
  ) => Promise<Notification>;

  markAsRead: (id: string | number) => Promise<void>;
  markAsUnread: (id: string | number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string | number) => Promise<void>;

  clearError: () => void;
}

interface NotificationProviderProps {
  children: ReactNode;
  apiFetch: NotificationApiFetch;

  /**
   * Automatically fetch new notification counts.
   * Default: 30 seconds.
   * Set to 0 to disable polling.
   */
  pollingInterval?: number;
}

const NotificationContext =
  createContext<NotificationContextType | undefined>(
    undefined,
  );

// ============================================
// PROVIDER
// ============================================

export function NotificationProvider({
  children,
  apiFetch,
  pollingInterval = 30000,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [notificationTypes, setNotificationTypes] =
    useState<NotificationType[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent older list requests overwriting newer ones.
  const listRequestId = useRef(0);

  // Prevent older count responses overwriting newer ones.
  const countRequestId = useRef(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getErrorMessage = (err: unknown) =>
    err instanceof Error
      ? err.message
      : "Une erreur est survenue.";

  // ============================================
  // GET NOTIFICATIONS
  // ============================================

  const fetchNotifications = useCallback(
    async (
      requestedPage = 1,
      requestedLimit = 20,
      unread?: boolean,
    ) => {
      const requestId = ++listRequestId.current;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(requestedPage),
          limit: String(requestedLimit),
        });

        if (unread !== undefined) {
          params.set("unread", String(unread));
        }

        const response =
          await apiFetch<PaginatedNotifications>(
            `/notifications?${params.toString()}`,
          );

        if (requestId !== listRequestId.current) return;

        setNotifications(response.data);
        setTotal(response.total);
        setPage(response.page);
        setLimit(response.limit);
      } catch (err) {
        if (requestId !== listRequestId.current) return;

        setError(getErrorMessage(err));
        throw err;
      } finally {
        if (requestId === listRequestId.current) {
          setLoading(false);
        }
      }
    },
    [apiFetch],
  );

  // ============================================
  // GET UNREAD COUNT
  // ============================================

  const fetchUnreadCount = useCallback(async () => {
    const requestId = ++countRequestId.current;

    try {
      const response = await apiFetch<UnreadCountResponse>(
        "/notifications/unread-count",
      );

      if (requestId === countRequestId.current) {
        setUnreadCount(response.count);
      }
    } catch (err) {
      console.error(
        "Failed to fetch unread notification count:",
        err,
      );
      throw err;
    }
  }, [apiFetch]);

  // ============================================
  // GET NOTIFICATION TYPES
  // ============================================

  const fetchNotificationTypes = useCallback(async () => {
    try {
      const response =
        await apiFetch<NotificationTypesResponse>(
          "/notifications/types",
        );

      setNotificationTypes(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [apiFetch]);

  // ============================================
  // POST NOTIFICATION
  // ============================================

  const sendNotification = useCallback(
    async (
      input: CreateNotificationInput,
    ): Promise<Notification> => {
      setSending(true);
      setError(null);

      try {
        const created = await apiFetch<Notification>(
          "/notifications",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...input,
              source_id:
                input.source_id != null
                  ? String(input.source_id)
                  : null,
              target_app: input.target_app ?? "portal",
            }),
          },
        );

        await Promise.allSettled([
          fetchNotifications(page, limit),
          fetchUnreadCount(),
        ]);

        return created;
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setSending(false);
      }
    },
    [
      apiFetch,
      fetchNotifications,
      fetchUnreadCount,
      page,
      limit,
    ],
  );

  // ============================================
  // MARK AS READ
  // ============================================

  const markAsRead = useCallback(
    async (id: string | number) => {
      setError(null);

      try {
        const updated = await apiFetch<Notification>(
          `/notifications/${encodeURIComponent(String(id))}/read`,
          { method: "PATCH" },
        );

        setNotifications((previous) =>
          previous.map((notification) =>
            notification.id === String(id)
              ? { ...notification, read_at: updated.read_at }
              : notification,
          ),
        );

        await Promise.allSettled([
          fetchUnreadCount(),
        ]);
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      }
    },
    [apiFetch, fetchUnreadCount],
  );

  // ============================================
  // MARK AS UNREAD
  // ============================================

  const markAsUnread = useCallback(
    async (id: string | number) => {
      setError(null);

      try {
        await apiFetch(
          `/notifications/${encodeURIComponent(String(id))}/unread`,
          { method: "PATCH" },
        );

        setNotifications((previous) =>
          previous.map((notification) =>
            notification.id === String(id)
              ? { ...notification, read_at: null }
              : notification,
          ),
        );

        await Promise.allSettled([
          fetchUnreadCount(),
        ]);
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      }
    },
    [apiFetch, fetchUnreadCount],
  );

  // ============================================
  // MARK ALL AS READ
  // ============================================

  const markAllAsRead = useCallback(async () => {
    setError(null);

    try {
      await apiFetch<ReadAllResponse>(
        "/notifications/read-all",
        { method: "PATCH" },
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read_at: notification.read_at ?? new Date().toISOString(),
        })),
      );

      setUnreadCount(0);
      countRequestId.current++;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [apiFetch]);

  // ============================================
  // DELETE NOTIFICATION
  // ============================================

  const deleteNotification = useCallback(
    async (id: string | number) => {
      setError(null);

      try {
        await apiFetch(
          `/notifications/${encodeURIComponent(String(id))}`,
          { method: "DELETE" },
        );

        setNotifications((previous) =>
          previous.filter(
            (notification) =>
              notification.id !== String(id),
          ),
        );

        // Refresh the current page to refill after deletion.
        await Promise.allSettled([
          fetchNotifications(page, limit),
          fetchUnreadCount(),
        ]);
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      }
    },
    [
      apiFetch,
      fetchNotifications,
      fetchUnreadCount,
      page,
      limit,
    ],
  );

  // ============================================
  // INITIAL FETCH + POLLING
  // ============================================

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNotifications().catch(console.error);
    void fetchUnreadCount().catch(console.error);

    if (pollingInterval <= 0) return;

    const interval = window.setInterval(() => {
      void fetchUnreadCount().catch(console.error);
    }, pollingInterval);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    fetchNotifications,
    fetchUnreadCount,
    pollingInterval,
  ]);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value = useMemo<NotificationContextType>(
    () => ({
      notifications,
      notificationTypes,

      unreadCount,
      total,
      page,
      limit,

      loading,
      sending,
      error,

      fetchNotifications,
      fetchUnreadCount,
      fetchNotificationTypes,

      sendNotification,

      markAsRead,
      markAsUnread,
      markAllAsRead,
      deleteNotification,

      clearError,
    }),
    [
      notifications,
      notificationTypes,
      unreadCount,
      total,
      page,
      limit,
      loading,
      sending,
      error,
      fetchNotifications,
      fetchUnreadCount,
      fetchNotificationTypes,
      sendNotification,
      markAsRead,
      markAsUnread,
      markAllAsRead,
      deleteNotification,
      clearError,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }

  return context;
}
