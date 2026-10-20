
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
      className={`vsf:flex vsf:gap-3 vsf:border-b vsf:border-slate-100 vsf:p-3 vsf:transition ${
        unread ? "vsf:bg-lime-50/60" : "vsf:bg-white"
      }`}
    >
      <div className="vsf:mt-1 vsf:shrink-0">
        <div
          className={`vsf:h-2.5 vsf:w-2.5 vsf:rounded-full ${
            unread ? "vsf:bg-primary" : "vsf:bg-slate-200"
          }`}
        />
      </div>

      <div className="vsf:min-w-0 vsf:flex-1">
        <button
          type="button"
          onClick={() => onOpen(notification)}
          className="vsf:w-full vsf:cursor-pointer vsf:text-left"
        >
          <p className="vsf:text-[0.95rem] vsf:font-semibold vsf:text-black">
            {notification.title}
          </p>
          <p className="vsf:mt-1 vsf:line-clamp-3 vsf:text-[0.85rem] vsf:text-slate-600">
            {notification.message}
          </p>
          <p className="vsf:mt-2 vsf:text-[11px] vsf:text-slate-400">
            {new Date(notification.created_at).toLocaleString(
              "fr-CA",
              { dateStyle: "medium", timeStyle: "short" },
            )}
          </p>
        </button>

        <div className="vsf:mt-2 vsf:flex vsf:items-center vsf:gap-3">
          <button
            type="button"
            onClick={() => onToggleRead(notification)}
            className="vsf:flex vsf:items-center vsf:gap-1 vsf:text-xs vsf:text-slate-500 vsf:hover:text-secondary"
          >
            {unread ? <Check size={14} /> : <Undo2 size={14} />}
            {unread ? "Marquer comme lu" : "Marquer non lu"}
          </button>

          {notification.action_link && (
            <button
              type="button"
              onClick={() => onOpen(notification)}
              className="vsf:flex vsf:items-center vsf:gap-1 vsf:text-xs vsf:text-secondary vsf:hover:underline"
            >
              <ExternalLink size={14} />
              Ouvrir
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(notification)}
            aria-label="Supprimer la notification"
            className="vsf:ml-auto vsf:text-slate-400 vsf:hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
