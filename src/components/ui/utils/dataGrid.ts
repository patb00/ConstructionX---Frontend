import type { GridColDef, GridValidRowModel } from "@mui/x-data-grid-pro";

export function applyHeaderMappings<T extends GridValidRowModel>(
  columns: GridColDef<T>[],
  mappings: Array<{ original: string; translated: string }>
): GridColDef<T>[] {
  if (!mappings.length) return columns;

  const map = new Map<string, string>();
  for (const { original, translated } of mappings)
    map.set(original, translated);

  return columns.map((c) => {
    const current = (c.headerName ?? c.field) as string;
    const translated = map.get(current);
    return translated ? { ...c, headerName: translated } : c;
  });
}

export function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
