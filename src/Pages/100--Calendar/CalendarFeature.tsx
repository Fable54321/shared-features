import Calendar from "./Components/Calendar";
import {
  CalendarProvider,
  type CalendarApiFetch,
} from "./Contexts/CalendarContext";

interface CalendarFeatureProps {
  apiFetch: CalendarApiFetch;
}

export default function CalendarFeature({
  apiFetch,
}: CalendarFeatureProps) {
  return (
    <CalendarProvider apiFetch={apiFetch}>
      <Calendar />
    </CalendarProvider>
  );
}