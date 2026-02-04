import type { FieldConfig } from "../components/ui/smartform/SmartForm";

export function toDateOnly(v?: string | Date | null) {
  if (!v) return "";
  if (v instanceof Date && !isNaN(v.getTime())) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const datePart = s.split("T")[0];
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : "";
}

export function buildInitial<TValues extends Record<string, any>>(
  fields: FieldConfig<TValues>[],
  defaultValues?: Partial<TValues>
): TValues {
  const base: Record<string, any> = {};

  for (const f of fields) {
    if (f.type === "file") continue;

    const incoming =
      (defaultValues as any)?.[f.name] ??
      f.defaultValue ??
      (f.type === "checkbox" ? false : "");

    if (f.transformIn) {
      base[f.name] = f.transformIn(incoming, defaultValues ?? {});
    } else if (f.type === "datetime-local") {
      base[f.name] = incoming;
    } else if (f.type === "date") {
      base[f.name] = toDateOnly(incoming);
    } else if (f.type === "checkbox") {
      base[f.name] = Boolean(incoming);
    } else {
      base[f.name] = incoming ?? "";
    }
  }

  return base as TValues;
}
