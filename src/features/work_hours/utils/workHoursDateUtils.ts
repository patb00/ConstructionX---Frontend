import type { DateRange } from "@mui/x-date-pickers-pro/models";

import { addDays, formatLocalIsoDate } from "../../../utils/dateFormatters";

function shortDayLabel(date: Date, locale: string) {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
    date,
  );
  const ddmm = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
  return `${weekday}, ${ddmm}.`;
}

export function shiftRange(
  range: DateRange<Date>,
  direction: -1 | 1,
): DateRange<Date> {
  const [start, end] = range;
  if (!start || !end) return range;
  const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  const delta = diffDays * direction;
  return [addDays(start, delta), addDays(end, delta)];
}

export function buildWeekDays(range: DateRange<Date>, locale: string) {
  const start = range[0];
  const end = range[1];
  if (!start || !end) return [];
  const days: { iso: string; label: string }[] = [];
  const diffDays = Math.max(
    0,
    Math.round((end.getTime() - start.getTime()) / 86400000),
  );
  const count = Math.min(diffDays + 1, 60);
  for (let i = 0; i < count; i++) {
    const d = addDays(start, i);
    days.push({
      iso: formatLocalIsoDate(d),
      label: shortDayLabel(d, locale),
    });
  }
  return days;
}
