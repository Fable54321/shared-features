
export type NotificationTargetApp =
  | "portal"
  | "timesheets";

export interface NotificationType {
  id: number;
  code: string;
  label: string;
  icon: string | null;
  is_active: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  sender_user_id: string | null;

  type_id: number;
  type_code: string;
  type_label: string;
  type_icon: string | null;

  title: string;
  message: string;

  action_link: string | null;
  target_app: NotificationTargetApp;

  source_type: string | null;
  source_id: string | null;

  read_at: string | null;
  created_at: string;
}

export interface CreateNotificationInput {
  user_id: number;
  type_code: string;

  title: string;
  message: string;

  action_link?: string | null;
  target_app?: NotificationTargetApp;

  source_type?: string | null;
  source_id?: string | number | null;
}

export interface PaginatedNotifications {
  data: Notification[];
  page: number;
  limit: number;
  total: number;
}

export interface NotificationTypesResponse {
  data: NotificationType[];
}

export interface UnreadCountResponse {
  count: number;
}

export interface ReadAllResponse {
  success: boolean;
  updated: number;
}
