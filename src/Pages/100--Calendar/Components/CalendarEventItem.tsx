
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
    <div className="vsf:flex vsf:gap-3 vsf:rounded-xl vsf:border vsf:border-slate-200 vsf:bg-white vsf:p-3 vsf:shadow-sm">
      <div
        className={`vsf:w-1 vsf:shrink-0 vsf:rounded-full ${
          "vsf:bg-secondary"
        }`}
      /> 

      <div className="vsf:min-w-0 vsf:flex-1 vsf:space-y-2">
        <div className="vsf:flex vsf:flex-wrap vsf:items-start vsf:justify-between vsf:gap-2">
          <p className="vsf:font-semibold vsf:text-slate-800">
            {event.employeeName}
          </p>

       
        </div>

        <div className="vsf:flex vsf:items-center vsf:gap-2 vsf:text-md vsf:text-slate-500">
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
