
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
      className="flex max-h-[min(75vh,560px)] w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xl"
    >
      <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h2 className="text-base font-bold">Notifications</h2>
          <p className="text-xs text-slate-500">
            {unreadCount} non lue{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Actualiser"
            aria-label="Actualiser les notifications"
            onClick={() => void reload().catch(() => {})}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
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
            className="rounded-lg p-2 text-secondary hover:bg-lime-50 disabled:opacity-40"
          >
            <CheckCheck size={19} />
          </button>
        </div>
      </header>

      <div className="flex shrink-0 gap-2 border-b border-slate-100 px-4 py-2">
        <button
          type="button"
          onClick={() => {
            setUnreadOnly(false);
            void reload(1, false).catch(() => {});
          }}
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
            !unreadOnly
              ? "bg-secondary text-white"
              : "bg-slate-100 text-slate-600"
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
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
            unreadOnly
              ? "bg-secondary text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Non lues
        </button>
      </div>

      {(error || actionError) && (
        <p role="alert" className="bg-red-50 px-4 py-2 text-xs text-red-700">
          {actionError || error}
        </p>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">
            Chargement...
          </p>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-12 text-slate-400">
            <BellOff size={30} />
            <p className="text-sm">Aucune notification</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={
                busyIds.includes(notification.id)
                  ? "pointer-events-none opacity-50"
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
        <footer className="flex shrink-0 items-center justify-between border-t border-slate-100 px-4 py-3">
          <button
            type="button"
            disabled={loading || page <= 1}
            onClick={() => void reload(page - 1).catch(() => {})}
            className="rounded-lg p-2 disabled:opacity-30"
            aria-label="Page précédente"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-xs text-slate-500">
            Page {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={loading || page >= totalPages}
            onClick={() => void reload(page + 1).catch(() => {})}
            className="rounded-lg p-2 disabled:opacity-30"
            aria-label="Page suivante"
          >
            <ChevronRight size={18} />
          </button>
        </footer>
      )}
    </section>
  );
}
