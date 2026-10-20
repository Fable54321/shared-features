
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
    <div ref={containerRef} className="vsf:relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-label={`Notifications, ${unreadCount} non lues`}
        aria-expanded={open}
        aria-haspopup="true"
        className={`vsf:relative vsf:flex vsf:h-10 vsf:w-10 vsf:items-center vsf:justify-center vsf:rounded-xl vsf:transition vsf:shadow-sm ${
          open
            ? "vsf:bg-secondary vsf:text-white"
            : "vsf:bg-white vsf:text-secondary vsf:hover:bg-lime-50"
        }`}
      >
        <Bell size={21} />

        {unreadCount > 0 && (
          <p className="vsf:absolute vsf:-left-1 vsf:-top-1 vsf:flex vsf:min-h-5 vsf:min-w-5 vsf:items-center vsf:justify-center vsf:rounded-full vsf:bg-red-500 vsf:px-1 vsf:text-[10px] vsf:font-bold vsf:text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </p>
        )}
      </button>

      {open && (
        <div className="vsf:absolute vsf:right-0 vsf:top-full vsf:z-1000 vsf:mt-2 vsf:w-[min(380px,calc(100vw-24px))]">
          <NotificationDropdown
            appUrls={appUrls}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
