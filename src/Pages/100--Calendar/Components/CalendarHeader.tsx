
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendar } from "../Contexts/CalendarContext";

export default function CalendarHeader() {
  const {
    currentMonth,
    currentYear,
    previousMonth,
    nextMonth,
    goToToday,
  } = useCalendar();

  const monthLabel = new Intl.DateTimeFormat("fr-CA", {
    month: "long",
    year: "numeric",
  }).format(new Date(currentYear, currentMonth, 1));

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-primary font-bold capitalize text-slate-800 md:text-2xl">
          {monthLabel}
        </h2>
        <p className="text-sm text-slate-500">
          Calendrier des absences
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goToToday}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-black transition hover:bg-slate-50"
        >
          Aujourd'hui
        </button>

        <button
          type="button"
          onClick={previousMonth}
          aria-label="Mois précédent"
          className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={nextMonth}
          aria-label="Mois suivant"
          className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
