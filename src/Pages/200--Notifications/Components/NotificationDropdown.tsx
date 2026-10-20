
import { useEffect, useState } from "react";
import {
  BellOff,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import { useNotifications } from "../Contexts/NotificationsContext";
import type {
  Notification,
  NotificationTargetApp,
} from "../Types/notification.types";

import NotificationItem from "./NotificationItem";

export type NotificationAppUrls = Record<
  NotificationTargetApp,
  string
>;

interface NotificationDropdownProps {
  appUrls: NotificationAppUrls;
  onClose: () => void;
}

export default function NotificationDropdown({
  appUrls,
  onClose,
}: NotificationDropdownProps) {
  const {
    notifications,
    unreadCount,
    page,
    limit,
    total,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [unreadOnly, setUnreadOnly] = useState(false);
  const [busyIds, setBusyIds] = useState<string[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    void fetchNotifications(1, 20).catch(() => {});
  }, [fetchNotifications]);

  const reload = async (
    nextPage = page,
    onlyUnread = unreadOnly,
  ) => {
    await fetchNotifications(nextPage, limit, onlyUnread ? true : undefined);
  };

  const withBusy = async (
    id: string,
    action: () => Promise<void>,
  ) => {
    if (busyIds.includes(id)) return;

    setBusyIds((prev) => [...prev, id]);
    setActionError(null);

    try {
      await action();
      if (unreadOnly) {
        await reload();
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    } finally {
      setBusyIds((prev) => prev.filter((value) => value !== id));
    }
  };

  const handleOpen = async (notification: Notification) => {
    setActionError(null);

    if (!notification.read_at) {
      try {
        await markAsRead(notification.id);
      } catch (err) {
        setActionError(
          err instanceof Error ? err.message : "Impossible de marquer comme lu.",
        );
        return;
      }
    }

    if (!notification.action_link) return;

    try {
      const path = notification.action_link;

      // Accept only local application paths.
      if (
        !path.startsWith("/") ||
        path.startsWith("//") ||
        path.includes("\\")
      ) {
        throw new Error("Lien de notification invalide.");
      }

      const base = appUrls[notification.target_app];

      if (!base) {
        throw new Error("Application de destination inconnue.");
      }

      const destination = new URL(path, base);
      const allowedOrigin = new URL(base).origin;

      if (destination.origin !== allowedOrigin) {
        throw new Error("Destination non autorisée.");
      }

      onClose();
      window.location.assign(destination.href);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Impossible d'ouvrir le lien.",
      );
    }
  };

  const handleToggleRead = (notification: Notification) =>
    withBusy(notification.id, async () => {
      if (notification.read_at) {
        await markAsUnread(notification.id);
      } else {
        await markAsRead(notification.id);
      }
    });

  const handleDelete = (notification: Notification) =>
    withBusy(notification.id, async () => {
      await deleteNotification(notification.id);
    });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section
      role="region"
      aria-label="Notifications"
      className="vsf:flex vsf:max-h-[min(75vh,560px)] vsf:w-full vsf:flex-col vsf:overflow-hidden vsf:rounded-xl vsf:border vsf:border-slate-200 vsf:bg-white vsf:text-slate-800 vsf:shadow-xl"
    >
      <header className="vsf:flex vsf:shrink-0 vsf:items-center vsf:justify-between vsf:border-b vsf:border-slate-100 vsf:px-4 vsf:py-3">
        <div>
          <h2 className="vsf:text-base vsf:font-bold">Notifications</h2>
          <p className="vsf:text-xs vsf:text-slate-500">
            {unreadCount} non lue{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="vsf:flex vsf:items-center vsf:gap-2">
          <button
            type="button"
            title="Actualiser"
            aria-label="Actualiser les notifications"
            onClick={() => void reload().catch(() => {})}
            className="vsf:rounded-lg vsf:p-2 vsf:text-slate-500 vsf:hover:bg-slate-100"
          >
            <RefreshCw size={17} className={loading ? "vsf:animate-spin" : ""} />
          </button>

          <button
            type="button"
            onClick={() => {
              void markAllAsRead()
                .then(() => reload())
                .catch((err: unknown) => {
                  setActionError(
                    err instanceof Error ? err.message : "Erreur.",
                  );
                });
            }}
            disabled={unreadCount === 0}
            title="Tout marquer comme lu"
            aria-label="Tout marquer comme lu"
            className="vsf:rounded-lg vsf:p-2 vsf:text-secondary vsf:hover:bg-lime-50 vsf:disabled:opacity-40"
          >
            <CheckCheck size={19} />
          </button>
        </div>
      </header>

      <div className="vsf:flex vsf:shrink-0 vsf:gap-2 vsf:border-b vsf:border-slate-100 vsf:px-4 vsf:py-2">
        <button
          type="button"
          onClick={() => {
            setUnreadOnly(false);
            void reload(1, false).catch(() => {});
          }}
          className={`vsf:rounded-full vsf:px-3 vsf:py-1.5 vsf:text-xs vsf:font-medium ${
            !unreadOnly
              ? "vsf:bg-secondary vsf:text-white"
              : "vsf:bg-slate-100 vsf:text-slate-600"
          }`}
        >
          Toutes
        </button>
        <button
          type="button"
          onClick={() => {
            setUnreadOnly(true);
            void reload(1, true).catch(() => {});
          }}
          className={`vsf:rounded-full vsf:px-3 vsf:py-1.5 vsf:text-xs vsf:font-medium ${
            unreadOnly
              ? "vsf:bg-secondary vsf:text-white"
              : "vsf:bg-slate-100 vsf:text-slate-600"
          }`}
        >
          Non lues
        </button>
      </div>

      {(error || actionError) && (
        <p role="alert" className="vsf:bg-red-50 vsf:px-4 vsf:py-2 vsf:text-xs vsf:text-red-700">
          {actionError || error}
        </p>
      )}

      <div className="vsf:min-h-0 vsf:flex-1 vsf:overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <p className="vsf:p-6 vsf:text-center vsf:text-sm vsf:text-slate-500">
            Chargement...
          </p>
        ) : notifications.length === 0 ? (
          <div className="vsf:flex vsf:flex-col vsf:items-center vsf:gap-2 vsf:px-4 vsf:py-12 vsf:text-slate-400">
            <BellOff size={30} />
            <p className="vsf:text-sm">Aucune notification</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={
                busyIds.includes(notification.id)
                  ? "vsf:pointer-events-none vsf:opacity-50"
                  : ""
              }
            >
              <NotificationItem
                notification={notification}
                onOpen={(item) => void handleOpen(item)}
                onToggleRead={(item) => void handleToggleRead(item)}
                onDelete={(item) => void handleDelete(item)}
              />
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <footer className="vsf:flex vsf:shrink-0 vsf:items-center vsf:justify-between vsf:border-t vsf:border-slate-100 vsf:px-4 vsf:py-3">
          <button
            type="button"
            disabled={loading || page <= 1}
            onClick={() => void reload(page - 1).catch(() => {})}
            className="vsf:rounded-lg vsf:p-2 vsf:disabled:opacity-30"
            aria-label="Page précédente"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="vsf:text-xs vsf:text-slate-500">
            Page {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={loading || page >= totalPages}
            onClick={() => void reload(page + 1).catch(() => {})}
            className="vsf:rounded-lg vsf:p-2 vsf:disabled:opacity-30"
            aria-label="Page suivante"
          >
            <ChevronRight size={18} />
          </button>
        </footer>
      )}
    </section>
  );
}
