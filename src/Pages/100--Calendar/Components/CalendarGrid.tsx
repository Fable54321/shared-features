
import { useMemo } from "react";
import { useCalendar } from "../Contexts/CalendarContext";
import CalendarDay from "./CalendarDay";

const WEEKDAYS = [
  "Lun",
  "Mar",
  "Mer",
  "Jeu",
  "Ven",
  "Sam",
  "Dim",
];

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

interface CalendarCell {
  date: string;
  day: number;
  isCurrentMonth: boolean;
}

export default function CalendarGrid() {
  const { currentYear, currentMonth } = useCalendar();

  const days = useMemo<CalendarCell[]>(() => {
    const firstDay = new Date(
      currentYear,
      currentMonth,
      1,
    );

    const daysInMonth = new Date(
      currentYear,
      currentMonth + 1,
      0,
    ).getDate();

    // Convert Sunday-first to Monday-first.
    const startOffset = (firstDay.getDay() + 6) % 7;

    // Include trailing days to complete the final week.
    const totalCells =
      Math.ceil((startOffset + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, index) => {
      const date = new Date(
        currentYear,
        currentMonth,
        index - startOffset + 1,
      );

      return {
        date: formatDate(date),
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === currentMonth,
      };
    });
  }, [currentYear, currentMonth]);

  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-7 bg-secondary text-white">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="border-b border-slate-200 border-r py-3 text-center text-xs font-semibold text-white sm:text-[0.95rem]"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => (
            <CalendarDay
              key={day.date}
              {...day}
            />
          ))}
        </div>
      </div>

      <div
        className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 sm:text-sm"
        aria-label="Légende du calendrier"
      >
        
      </div>
    </div>
  );
}
