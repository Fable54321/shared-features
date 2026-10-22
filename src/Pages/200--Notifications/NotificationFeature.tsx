
import NotificationBell from "./Components/NotificationBell";
import "../../tailwind.css"

import {
  NotificationProvider,
  type NotificationApiFetch,
} from "./Contexts/NotificationsContext";

import type {
  NotificationAppUrls,
} from "./Components/NotificationDropdown";

export interface NotificationFeatureProps {
  apiFetch: NotificationApiFetch;
  appUrls: NotificationAppUrls;
  pollingInterval?: number;

  /**
   * Time the overlay must remain open before all notifications are marked read.
   * Default: 2 seconds. Set to a negative value to disable this behavior.
   */
  autoReadDelayMs?: number;
}

export default function NotificationFeature({
  apiFetch,
  appUrls,
  pollingInterval = 30000,
  autoReadDelayMs = 2000,
}: NotificationFeatureProps) {
  return (
    <NotificationProvider
      apiFetch={apiFetch}
      pollingInterval={pollingInterval}
    >
      <NotificationBell
        appUrls={appUrls}
        autoReadDelayMs={autoReadDelayMs}
      />
    </NotificationProvider>
  );
}
