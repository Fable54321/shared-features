
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
        vsf:relative vsf:flex vsf:min-h-16 vsf:flex-col vsf:items-center
        vsf:gap-2 vsf:border-b vsf:border-r vsf:border-slate-300
        vsf:px-1 vsf:py-3 vsf:transition-colors vsf:sm:min-h-30
        ${!isCurrentMonth
          ? "vsf:cursor-default vsf:bg-slate-50 vsf:text-slate-300"
          : "vsf:cursor-pointer vsf:hover:bg-green-50"}
        ${isSelected ? "vsf:bg-lime-50 vsf:ring-1 vsf:ring-inset vsf:ring-primary" : ""}
      `}
    >
      <span
        className={`
          vsf:flex vsf:h-7 vsf:w-7 vsf:items-center vsf:justify-center
          vsf:rounded-full vsf:text-[0.975rem] vsf:font-medium
          ${isToday
            ? "vsf:bg-secondary vsf:text-white"
            : isCurrentMonth
              ? "vsf:text-slate-700"
              : "vsf:text-slate-300"}
        `}
      >
        {day}
      </span>

      {isCurrentMonth && (
        <div className="vsf:flex vsf:items-center vsf:justify-center vsf:gap-1">
          {hasTimeOff && (
            <span
              className="vsf:h-2.5 vsf:w-2.5 vsf:rounded-full vsf:bg-yellow-500"
              title="Au moins une personne est absente cette journée"
            />
          )}
        </div>
      )}
    </button>
  );
}
