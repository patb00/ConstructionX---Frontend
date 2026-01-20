export type WorkLogMinutesSource = {
  totalWorkMinutes?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export function formatMinutesToHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

export function getWorkLogMinutes(row: WorkLogMinutesSource): number {
  if (typeof row.totalWorkMinutes === "number") return row.totalWorkMinutes;
  const h = typeof row.hours === "number" ? row.hours : 0;
  const m = typeof row.minutes === "number" ? row.minutes : 0;
  const s = typeof row.seconds === "number" ? row.seconds : 0;
  return h * 60 + m + (s ? Math.round(s / 60) : 0);
}

export function formatSitesLabel(sites: string[], emptyLabel = "—"): string {
  if (sites.length === 0) return emptyLabel;
  if (sites.length <= 2) return sites.join(" · ");
  return `${sites.slice(0, 2).join(" · ")} +${sites.length - 2}`;
}
