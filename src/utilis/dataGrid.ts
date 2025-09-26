// Generic "isArrayOf" guard
export function isArrayOf<T>(x: unknown, check: (v: any) => v is T): x is T[] {
  return Array.isArray(x) && x.every(check);
}

// Common extractor (looks for array, or { items } or { data })
export function extractRows<T>(data: unknown, isT: (v: any) => v is T): T[] {
  if (isArrayOf<T>(data, isT)) return data;
  const items = (data as any)?.items ?? (data as any)?.data;
  return isArrayOf<T>(items, isT) ? items : [];
}
