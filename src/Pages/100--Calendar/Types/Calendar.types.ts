
export type CalendarEventType = "time_off";

export type CalendarEventStatus = "pending" | "approved";

export interface CalendarEvent {
  id: string;
  type: CalendarEventType;
  title: string;

  startDate: string;
  endDate: string;

  status: CalendarEventStatus;

  sourceId?: number;
}

export interface TimeOffCalendarEvent extends CalendarEvent {
  type: "time_off";

  employeeId: number;
  employeeName: string;

  /**
   * Actual dates requested by the employee.
   * YYYY-MM-DD format.
   */
  requestedDates: string[];

  reason?: string | null;
}

export type CalendarEventItem = TimeOffCalendarEvent;

/**
 * Existing backend response.
 */
export interface TimeOffRequest {
  id: number;
  requester_user_id: number;
  requested_dates: string[];

  reason: string | null;
  payment_preference: string;
  payment_preference_other: string | null;

  status: string;

  reviewed_by_user_id: number | null;
  reviewed_at: string | null;
  review_note: string | null;

  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface CalendarEmployee {
  id: number;
  username: string;
  email: string | null;
  name: string | null;
  surname: string | null;
  is_office: boolean;
  is_active: boolean;
}

export interface EmployeesResponse {
  success: boolean;
  users: CalendarEmployee[];
}
