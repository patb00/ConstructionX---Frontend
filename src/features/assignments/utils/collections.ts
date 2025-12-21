export function dedupeByKey<T, K extends string | number>(
  rows: T[],
  getKey: (row: T) => K
): T[] {
  const map = new Map<K, T>();
  rows.forEach((row) => {
    const key = getKey(row);
    if (!map.has(key)) map.set(key, row);
  });
  return Array.from(map.values());
}
