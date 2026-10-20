
import { CalendarDays, RefreshCw } from "lucide-react";
import { useCalendar } from "../Contexts/CalendarContext";
import CalendarEventItem from "./CalendarEventItem";

function formatSelectedDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("fr-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(year, month - 1, day));
}

export default function CalendarEventPanel() {
  const {
    selectedDate,
    getEventsByDate,
    loading,
    error,
    refreshEvents,
  } = useCalendar();

  const events = getEventsByDate(selectedDate);

  return (
    <aside className="vsf:min-w-0 vsf:rounded-xl vsf:border vsf:border-slate-200 vsf:bg-tertiary vsf:p-4">
      <div className="vsf:mb-5 vsf:flex vsf:items-start vsf:justify-between vsf:gap-3">
        <div>
          <h3 className="vsf:text-base vsf:font-bold vsf:capitalize vsf:text-slate-800">
            {formatSelectedDate(selectedDate)}
          </h3>

          <p className="vsf:mt-1 vsf:text-sm vsf:text-slate-500">
            Absence(s) de la journée
          </p>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => void refreshEvents()}
          aria-label="Actualiser les événements"
          className="vsf:rounded-lg vsf:p-2 vsf:text-slate-500 vsf:transition vsf:hover:bg-slate-200 vsf:disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={loading ? "vsf:animate-spin" : ""}
          />
        </button>
      </div>

      {error && (
        <div role="alert" className="vsf:mb-4 vsf:rounded-lg vsf:bg-red-50 vsf:p-3 vsf:text-sm vsf:text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="vsf:text-sm vsf:text-slate-500">
          Chargement des événements...
        </p>
      ) : error ? null : events.length === 0 ? (
        <div className="vsf:flex vsf:flex-col vsf:items-center vsf:justify-center vsf:gap-3 vsf:py-12 vsf:text-center">
          <CalendarDays size={32} className="vsf:text-slate-300" />
          <p className="vsf:text-sm vsf:text-slate-500">
            Aucune absence pour cette journée.
          </p>
        </div>
      ) : (
        <div className="vsf:space-y-3">
          {events.map((event) => (
            <CalendarEventItem
              key={event.id}
              event={event}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
