
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type {
  CalendarEventItem,
  PaginatedResponse,
  TimeOffRequest,
  CalendarEmployee,
  EmployeesResponse,
} from "../Types/Calendar.types";

import {
  getEventsForDate,
  getEventsInRange,
  mapTimeOffToCalendarEvent,
} from "../Utils/Calendar.utils";

/**
 * Compatible with your existing fetchWithAuth.
 *
 * Each host app supplies its own authenticated fetcher.
 */
export type CalendarApiFetch = <T>(
  path: string,
  options?: RequestInit,
) => Promise<T>;

interface CalendarContextType {
  events: CalendarEventItem[];

  employees: CalendarEmployee[];

  loading: boolean;
  error: string | null;

  selectedDate: string;
  setSelectedDate: (date: string) => void;

  currentMonth: number;
  currentYear: number;

  nextMonth: () => void;
  previousMonth: () => void;
  goToMonth: (year: number, month: number) => void;
  goToToday: () => void;

  refreshEvents: () => Promise<void>;

  getEventsByDate: (date: string) => CalendarEventItem[];
  getEventsByRange: (
    startDate: string,
    endDate: string,
  ) => CalendarEventItem[];
}

interface CalendarProviderProps {
  children: ReactNode;
  apiFetch: CalendarApiFetch;
}

const CalendarContext =
  createContext<CalendarContextType | undefined>(undefined);

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function CalendarProvider({
  children,
  apiFetch,
}: CalendarProviderProps) {
  const [selectedDate, setSelectedDate] = useState(
    () => formatLocalDate(new Date()),
  );

  const [currentMonth, setCurrentMonth] = useState(
    () => new Date().getMonth(),
  );

  const [currentYear, setCurrentYear] = useState(
    () => new Date().getFullYear(),
  );

  const [employees, setEmployees] = useState<CalendarEmployee[]>([]);

  const [events, setEvents] =
    useState<CalendarEventItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent older requests from overwriting newer results.
  const requestId = useRef(0);

  /**
   * Calendar events visible in the current month.
   */
  const monthRange = useMemo(() => {
    return {
      start: formatLocalDate(
        new Date(currentYear, currentMonth, 1),
      ),
      end: formatLocalDate(
        new Date(currentYear, currentMonth + 1, 0),
      ),
    };
  }, [currentMonth, currentYear]);

  /**
   * First event source: employee time off.
   *
   * Current backend:
   * GET /time-off (admin-only collection route)
   *
   * This route is admin-only.
   */
  
  const loadEmployees = useCallback(async (): Promise<
    Map<number, string>
  > => {
    const response = await apiFetch<EmployeesResponse>(
      "/portal/list",
    );

    if (!response.success) {
      throw new Error("Failed to load employees");
    }

    const normalizedEmployees = response.users.map((user) => ({
      ...user,
      id: Number(user.id),
    }));

    setEmployees(normalizedEmployees);

    return new Map(
      normalizedEmployees.map((user) => [
        user.id,
        [user.surname, user.name]
          .filter(Boolean)
          .join(" ")
          .trim() || user.username,
      ]),
    );
  }, [apiFetch]);









const loadTimeOffEvents = useCallback(
  async (): Promise<CalendarEventItem[]> => {
    const [employeeNames, allRequests] = await Promise.all([
      loadEmployees(),
      (async () => {
        const requests: TimeOffRequest[] = [];

        const limit = 100;
        let page = 1;
        let total: number;

        do {
          const response = await apiFetch<
            PaginatedResponse<TimeOffRequest>
          >(
            `/time-off?page=${page}&limit=${limit}`,
          );

          requests.push(...response.data);
          total = response.total;

          if (response.data.length === 0) break;

          page++;
        } while (requests.length < total);

        return requests;
      })(),
    ]);

    return allRequests
      .map((request) =>
        mapTimeOffToCalendarEvent(
          request,
          employeeNames.get(Number(request.requester_user_id)),
        ),
      )
      .filter(
        (event): event is CalendarEventItem =>
          event !== null,
      );
  },
  [apiFetch, loadEmployees],
);


 
  const refreshEvents = useCallback(async () => {
    const id = ++requestId.current;

    setLoading(true);
    setError(null);

    try {
      const [timeOffEvents] = await Promise.all([
        loadTimeOffEvents(),

        // Future sources:
        // loadCompanyEvents(),
        // loadHolidays(),
      ]);

      const combinedEvents: CalendarEventItem[] = [
        ...timeOffEvents,
      ];

      const visibleEvents = getEventsInRange(
        combinedEvents,
        monthRange.start,
        monthRange.end,
      );

      if (id !== requestId.current) return;

      setEvents(visibleEvents);
    } catch (err) {
      if (id !== requestId.current) return;

      setEvents([]);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load calendar events",
      );
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  }, [loadTimeOffEvents, monthRange]);

  /**
   * Reload when the displayed month changes.
   */
 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  void refreshEvents();

  const currentRequestId = requestId;

  return () => {
    currentRequestId.current++;
  };
}, [refreshEvents]);

  /**
   * Month navigation.
   */
  const goToMonth = useCallback(
    (year: number, month: number) => {
      const date = new Date(year, month, 1);

      setCurrentYear(date.getFullYear());
      setCurrentMonth(date.getMonth());

      setSelectedDate(formatLocalDate(date));
    },
    [],
  );

  const nextMonth = useCallback(() => {
    goToMonth(currentYear, currentMonth + 1);
  }, [goToMonth, currentYear, currentMonth]);

  const previousMonth = useCallback(() => {
    goToMonth(currentYear, currentMonth - 1);
  }, [goToMonth, currentYear, currentMonth]);

  const goToToday = useCallback(() => {
    const today = new Date();

    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(formatLocalDate(today));
  }, []);

  /**
   * Calendar event selectors.
   */
  const getEventsByDate = useCallback(
    (date: string) => getEventsForDate(events, date),
    [events],
  );

  const getEventsByRange = useCallback(
    (startDate: string, endDate: string) =>
      getEventsInRange(events, startDate, endDate),
    [events],
  );

  const value = useMemo<CalendarContextType>(
    () => ({
      events,
      employees,

      loading,
      error,

      selectedDate,
      setSelectedDate,

      currentMonth,
      currentYear,

      nextMonth,
      previousMonth,
      goToMonth,
      goToToday,

      refreshEvents,

      getEventsByDate,
      getEventsByRange,
    }),
    [
      events,
      employees,
      loading,
      error,
      selectedDate,
      currentMonth,
      currentYear,
      nextMonth,
      previousMonth,
      goToMonth,
      goToToday,
      refreshEvents,
      getEventsByDate,
      getEventsByRange,
    ],
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCalendar(): CalendarContextType {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error(
      "useCalendar must be used inside CalendarProvider",
    );
  }

  return context;
}
