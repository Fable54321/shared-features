
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
}

export default function NotificationFeature({
  apiFetch,
  appUrls,
  pollingInterval = 30000,
}: NotificationFeatureProps) {
  return (
    <NotificationProvider
      apiFetch={apiFetch}
      pollingInterval={pollingInterval}
    >
      <NotificationBell appUrls={appUrls} />
    </NotificationProvider>
  );
}
