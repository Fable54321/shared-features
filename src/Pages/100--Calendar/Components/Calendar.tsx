
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import CalendarEventPanel from "./CalendarEventPanel";
import "../../../tailwind.css";

export default function Calendar() {
  return (
    <div className="w-full rounded-2xl border border-slate-200 font-primary bg-white p-4 shadow-sm md:p-6">
      <CalendarHeader />

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <CalendarGrid />
        <CalendarEventPanel />
      </div>
    </div>
  );
}
