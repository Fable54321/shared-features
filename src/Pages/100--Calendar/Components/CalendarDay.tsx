
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

  const hasTimeOff = events.length > 0;

  return (
    <button
      type="button"
      disabled={!isCurrentMonth}
      onClick={() => setSelectedDate(date)}
      aria-label={date}
      aria-pressed={isSelected}
      className={`
        relative flex min-h-16 flex-col items-center
        gap-2 border-b border-r border-slate-300
        px-1 py-3 transition-colors sm:min-h-30
        ${!isCurrentMonth
          ? "cursor-default bg-slate-50 text-slate-300"
          : "cursor-pointer hover:bg-green-50"}
        ${isSelected ? "bg-lime-50 ring-1 ring-inset ring-primary" : ""}
      `}
    >
      <span
        className={`
          flex h-7 w-7 items-center justify-center
          rounded-full text-[0.975rem] font-medium
          ${isToday
            ? "bg-secondary text-white"
            : isCurrentMonth
              ? "text-slate-700"
              : "text-slate-300"}
        `}
      >
        {day}
      </span>

      {isCurrentMonth && (
        <div className="flex items-center justify-center gap-1">
          {hasTimeOff && (
            <span
              className="h-2 w-2 rounded-full bg-yellow-500"
              title="Au moins une personne est absente cette journée"
            />
          )}
        </div>
      )}
    </button>
  );
}
