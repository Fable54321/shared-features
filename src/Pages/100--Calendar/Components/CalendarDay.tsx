
import { useCalendar } from "../Contexts/CalendarContext";

interface CalendarDayProps {
  date: string;
  day: number;
  isCurrentMonth: boolean;
}

export default function CalendarDay({
  date,
  day,
  isCurrentMonth,
}: CalendarDayProps) {
  const {
    selectedDate,
    setSelectedDate,
    getEventsByDate,

  } = useCalendar();



  const events = getEventsByDate(date);

  const isSelected = selectedDate === date;

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const isToday = date === todayString;

  const hasApproved = events.some(
    (event) => event.status === "approved",
  );

  const hasPending = events.some(
    (event) => event.status === "pending",
  );

  return (
    <button
      type="button"
      disabled={!isCurrentMonth}
      onClick={() => setSelectedDate(date)}
      aria-label={date}
      aria-pressed={isSelected}
      className={`
        relative flex min-h-16 flex-col items-center
        gap-2 border-b border-r border-slate-100
        px-1 py-3 transition-colors sm:min-h-22
        ${!isCurrentMonth
          ? "cursor-default bg-slate-50 text-slate-300"
          : "cursor-pointer hover:bg-green-50"}
        ${isSelected ? "bg-lime-50 ring-1 ring-inset ring-[#96c61c]" : ""}
      `}
    >
      <span
        className={`
          flex h-7 w-7 items-center justify-center
          rounded-full text-sm font-medium
          ${isToday
            ? "bg-[#4b7312] text-white"
            : isCurrentMonth
              ? "text-slate-700"
              : "text-slate-300"}
        `}
      >
        {day}
      </span>

      {isCurrentMonth && (
        <div className="flex items-center justify-center gap-1">
          {hasApproved && (
            <span
              className="h-2 w-2 rounded-full bg-[#4b7312]"
              title="Congé approuvé"
            />
          )}

          {hasPending && (
            <span
              className="h-2 w-2 rounded-full bg-amber-400"
              title="Congé en attente"
            />
          )}
        </div>
      )}
    </button>
  );
}
