
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
    <div className="flex flex-wrap items-center justify-between ">
      <div className="flex items-end gap-5">
        <div className="flex flex-col">
        <h2 className="text-xl font-primary font-bold capitalize text-secondary-alt md:text-2xl">
          {monthLabel}
        </h2>
        <p className="text-sm text-slate-500">
          Calendrier des absences
        </p>
</div>
         <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-3 w-3  shrink-0 rounded-full bg-yellow-500"
          />
          <span className="text-sm">: Au moins une personne est absente cette journée</span>
        </div>
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
