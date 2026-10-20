
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
    <div className="vsf:min-w-0">
      <div className="vsf:overflow-hidden vsf:rounded-xl vsf:border vsf:border-slate-200">
        <div className="vsf:grid vsf:grid-cols-7 vsf:bg-secondary vsf:text-white">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="vsf:border-b vsf:border-slate-200 vsf:border-r vsf:py-3 vsf:text-center vsf:text-xs vsf:font-semibold vsf:text-white vsf:sm:text-[0.95rem]"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="vsf:grid vsf:grid-cols-7">
          {days.map((day) => (
            <CalendarDay
              key={day.date}
              {...day}
            />
          ))}
        </div>
      </div>

      <div
        className="vsf:mt-3 vsf:flex vsf:flex-wrap vsf:items-center vsf:gap-x-5 vsf:gap-y-2 vsf:text-xs vsf:text-slate-600 vsf:sm:text-sm"
        aria-label="Légende du calendrier"
      >
        
      </div>
    </div>
  );
}
