
import { CalendarDays, Clock3 } from "lucide-react";
import type {
  CalendarEventItem,
} from "../Types/Calendar.types";

interface CalendarEventItemProps {
  event: CalendarEventItem;
}

export default function CalendarEventItem({
  event,
}: CalendarEventItemProps) {
  const isApproved = event.status === "approved";

  const statusLabel = isApproved
    ? "Approuvé"
    : "En attente";

  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);

    return new Intl.DateTimeFormat("fr-CA", {
      day: "numeric",
      month: "short",
    }).format(new Date(year, month - 1, day));
  };

  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div
        className={`w-1 shrink-0 rounded-full ${
          isApproved ? "bg-secondary" : "bg-amber-400"
        }`}
      />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="font-semibold text-slate-800">
            {event.employeeName}
          </p>

          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              isApproved
                ? "bg-green-100 text-green-800"
                : "bg-orange-light text-orange-dark"
            }`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays size={14} />
          <span>
            {formatDate(event.startDate)}
            {event.startDate !== event.endDate &&
              ` - ${formatDate(event.endDate)}`}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock3 size={14} />
          <span>
            {event.requestedDates.length} jour
            {event.requestedDates.length > 1 ? "s" : ""}
            {" "}demandé
            {event.requestedDates.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
