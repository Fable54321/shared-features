
import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../Contexts/NotificationsContext";
import NotificationDropdown, {
  type NotificationAppUrls,
} from "./NotificationDropdown";

interface NotificationBellProps {
  appUrls: NotificationAppUrls;
}

export default function NotificationBell({
  appUrls,
}: NotificationBellProps) {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-label={`Notifications, ${unreadCount} non lues`}
        aria-expanded={open}
        aria-haspopup="true"
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition shadow-sm ${
          open
            ? "bg-secondary text-white"
            : "bg-white text-secondary hover:bg-lime-50"
        }`}
      >
        <Bell size={21} />

        {unreadCount > 0 && (
          <p className="absolute -left-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </p>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-1000 mt-2 w-[min(380px,calc(100vw-24px))]">
          <NotificationDropdown
            appUrls={appUrls}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
