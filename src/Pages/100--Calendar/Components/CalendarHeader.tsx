
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
    <div className="vsf:flex vsf:flex-wrap vsf:items-center vsf:justify-between">
      <div className="vsf:flex vsf:items-end vsf:gap-5">
        <div className="vsf:flex vsf:flex-col">
        <h2 className="vsf:text-xl vsf:font-primary vsf:font-bold vsf:capitalize vsf:text-secondary-alt vsf:md:text-2xl">
          {monthLabel}
        </h2>
        <p className="vsf:text-sm vsf:text-slate-500">
          Calendrier des absences
        </p>
</div>
         <div className="vsf:flex vsf:items-center vsf:gap-2">
          <span
            aria-hidden="true"
            className="vsf:h-3 vsf:w-3 vsf:shrink-0 vsf:rounded-full vsf:bg-yellow-500"
          />
          <span className="vsf:text-sm">: Au moins une personne est absente cette journée</span>
        </div>
      </div>

     

      <div className="vsf:flex vsf:items-center vsf:gap-2">
        <button
          type="button"
          onClick={goToToday}
          className="vsf:rounded-lg vsf:border vsf:border-slate-200 vsf:px-3 vsf:py-2 vsf:text-sm vsf:font-medium vsf:text-black vsf:transition vsf:hover:bg-slate-50"
        >
          Aujourd'hui
        </button>

        <button
          type="button"
          onClick={previousMonth}
          aria-label="Mois précédent"
          className="vsf:rounded-lg vsf:border vsf:border-slate-200 vsf:p-2 vsf:transition vsf:hover:bg-slate-50"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={nextMonth}
          aria-label="Mois suivant"
          className="vsf:rounded-lg vsf:border vsf:border-slate-200 vsf:p-2 vsf:transition vsf:hover:bg-slate-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
