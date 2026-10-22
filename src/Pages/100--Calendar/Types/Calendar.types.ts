
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
  isOwnRequest: boolean;

  /**
   * Actual dates requested by the employee.
   * YYYY-MM-DD format.
   */
  requestedDates: string[];

  reason?: string | null;
}

export type CalendarEventItem = TimeOffCalendarEvent;

/**
 * GET /time-off/calendar response item.
 */
export interface CalendarTimeOffRequest {
  id: number;
  requester_user_id: number;
  requested_dates: string[];
  status: string;
  requester_name: string | null;
  requester_surname: string | null;
  requester_username: string | null;
  is_own_request: boolean;
}

export interface CalendarTimeOffResponse {
  data: CalendarTimeOffRequest[];
}
