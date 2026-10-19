
import type {
  CalendarEventItem,
  CalendarEventStatus,
  TimeOffCalendarEvent,
  TimeOffRequest,
} from "../Types/Calendar.types";

export function isVisibleCalendarStatus(
  status: string,
): status is CalendarEventStatus {
  return status === "pending" || status === "approved";
}

/**
 * Converts one backend time-off request
 * into a calendar event.
 */

export function mapTimeOffToCalendarEvent(
  request: TimeOffRequest,
  employeeName?: string,
): TimeOffCalendarEvent | null {
  if (!isVisibleCalendarStatus(request.status)) {
    return null;
  }

  // Normalize ISO timestamps to YYYY-MM-DD.
  const dates = [
    ...new Set(
      request.requested_dates
        .map((date) => date.slice(0, 10))
        .filter((date) =>
          /^\d{4}-\d{2}-\d{2}$/.test(date)
        ),
    ),
  ].sort();

  if (dates.length === 0) return null;

  const name =
    employeeName?.trim() ||
    `Employee #${request.requester_user_id}`;

  return {
    id: `time-off-${request.id}`,
    type: "time_off",

    title: `${name} - Time off`,

    startDate: dates[0],
    endDate: dates[dates.length - 1],

    requestedDates: dates,

    status: request.status,

    employeeId: Number(request.requester_user_id),
    employeeName: name,

    reason: request.reason,
    sourceId: Number(request.id),
  };
}


/**
 * Checks whether an event actually occurs
 * on the given date.
 */
export function eventOccursOnDate(
  event: CalendarEventItem,
  date: string,
): boolean {
  if (event.type === "time_off") {
    return event.requestedDates.includes(date);
  }

  return (
    date >= event.startDate &&
    date <= event.endDate
  );
}

export function getEventsForDate(
  events: CalendarEventItem[],
  date: string,
): CalendarEventItem[] {
  return events.filter((event) =>
    eventOccursOnDate(event, date)
  );
}

export function getEventsInRange(
  events: CalendarEventItem[],
  startDate: string,
  endDate: string,
): CalendarEventItem[] {
  return events.filter((event) => {
    if (event.type === "time_off") {
      return event.requestedDates.some(
        (date) => date >= startDate && date <= endDate,
      );
    }

    return (
      event.startDate <= endDate &&
      event.endDate >= startDate
    );
  });
}
