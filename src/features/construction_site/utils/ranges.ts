type EmpRange = { from: string; to: string; custom: boolean };

export function getCommonRange(
  selectedIds: number[],
  map: Record<number, { from: string; to: string }>
): { from: string; to: string } | null {
  if (selectedIds.length === 0) return null;
  const first = map[selectedIds[0]];
  if (!first) return null;
  const allSame = selectedIds.every(
    (id) => map[id]?.from === first.from && map[id]?.to === first.to
  );
  return allSame ? first : null;
}

export function isRowGloballySynced(
  row: { from: string; to: string },
  globalFrom: string,
  globalTo: string
) {
  return row.from === globalFrom && row.to === globalTo;
}

export function buildPayload(
  constructionSiteId: number,
  selected: number[],
  ranges: Record<number, EmpRange>,
  fallbackFrom: string,
  fallbackTo: string
) {
  return {
    constructionSiteId,
    employees:
      selected.length === 0
        ? []
        : selected.map((employeeId) => {
            const r = ranges[employeeId] ?? {
              from: fallbackFrom,
              to: fallbackTo,
              custom: false,
            };
            return { employeeId, dateFrom: r.from, dateTo: r.to };
          }),
  };
}
