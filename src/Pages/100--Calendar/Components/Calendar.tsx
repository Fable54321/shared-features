
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import CalendarEventPanel from "./CalendarEventPanel";
import "../../../tailwind.css";

export default function Calendar() {
  return (
    <div className="vsf:w-full vsf:rounded-2xl vsf:border vsf:border-slate-200 vsf:font-primary vsf:bg-white vsf:p-4 vsf:shadow-sm vsf:md:p-6">
      <CalendarHeader />

      <div className="vsf:mt-6 vsf:grid vsf:grid-cols-1 vsf:gap-6 vsf:xl:grid-cols-[minmax(0,1fr)_320px]">
        <CalendarGrid />
        <CalendarEventPanel />
      </div>
    </div>
  );
}
