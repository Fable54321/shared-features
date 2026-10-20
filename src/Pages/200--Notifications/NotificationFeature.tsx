
import {
  NotificationProvider,
  type NotificationApiFetch,
} from "./Contexts/NotificationsContext";

interface NotificationFeatureProps {
  apiFetch: NotificationApiFetch;
  children: React.ReactNode;
  pollingInterval?: number;
}

export default function NotificationFeature({
  apiFetch,
  children,
  pollingInterval = 30000,
}: NotificationFeatureProps) {
  return (
    <NotificationProvider
      apiFetch={apiFetch}
      pollingInterval={pollingInterval}
    >
      {children}
    </NotificationProvider>
  );
}
