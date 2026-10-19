
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
    <aside className="min-w-0 rounded-xl border border-slate-200 bg-tertiary p-4">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold capitalize text-slate-800">
            {formatSelectedDate(selectedDate)}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Absence(s) de la journée
          </p>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => void refreshEvents()}
          aria-label="Actualiser les événements"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">
          Chargement des événements...
        </p>
      ) : error ? null : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <CalendarDays size={32} className="text-slate-300" />
          <p className="text-sm text-slate-500">
            Aucune absence pour cette journée.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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
