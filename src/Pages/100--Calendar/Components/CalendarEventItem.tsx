
import { CalendarDays } from "lucide-react";
import type {
  CalendarEventItem,
} from "../Types/Calendar.types";

interface CalendarEventItemProps {
  event: CalendarEventItem;
}

export default function CalendarEventItem({
  event,
}: CalendarEventItemProps) {
  



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
          "bg-secondary"
        }`}
      /> 

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="font-semibold text-slate-800">
            {event.employeeName}
          </p>

       
        </div>

        <div className="flex items-center gap-2 text-md text-slate-500">
          <CalendarDays size={14} />
          <span>
            {formatDate(event.startDate)}
            {event.startDate !== event.endDate &&
              ` - ${formatDate(event.endDate)}`}
          </span>
        </div>

       
      </div>
    </div>
  );
}
