
import { Check, ExternalLink, Trash2, Undo2 } from "lucide-react";
import type { Notification } from "../Types/notification.types";

interface NotificationItemProps {
  notification: Notification;
  onOpen: (notification: Notification) => void;
  onToggleRead: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
}

export default function NotificationItem({
  notification,
  onOpen,
  onToggleRead,
  onDelete,
}: NotificationItemProps) {
  const unread = notification.read_at === null;

  return (
    <div
      className={`flex gap-3 border-b border-slate-100 p-3 transition ${
        unread ? "bg-lime-50/60" : "bg-white"
      }`}
    >
      <div className="mt-1 shrink-0">
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            unread ? "bg-primary" : "bg-slate-200"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onOpen(notification)}
          className="w-full cursor-pointer text-left"
        >
          <p className="text-sm font-semibold text-slate-800">
            {notification.title}
          </p>
          <p className="mt-1 line-clamp-3 text-xs text-slate-600">
            {notification.message}
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            {new Date(notification.created_at).toLocaleString(
              "fr-CA",
              { dateStyle: "medium", timeStyle: "short" },
            )}
          </p>
        </button>

        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggleRead(notification)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-secondary"
          >
            {unread ? <Check size={14} /> : <Undo2 size={14} />}
            {unread ? "Marquer comme lu" : "Marquer non lu"}
          </button>

          {notification.action_link && (
            <button
              type="button"
              onClick={() => onOpen(notification)}
              className="flex items-center gap-1 text-xs text-secondary hover:underline"
            >
              <ExternalLink size={14} />
              Ouvrir
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(notification)}
            aria-label="Supprimer la notification"
            className="ml-auto text-slate-400 hover:text-red-600"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
