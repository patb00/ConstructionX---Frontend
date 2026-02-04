export function buildUnassign<
  TItem extends { id: number },
  TPayload extends { constructionSiteId: number }
>(args: {
  siteId: number;
  items: TItem[];
  mutate: (payload: TPayload) => void;
  payloadKey: keyof Omit<TPayload, "constructionSiteId">;
  mapItem: (item: TItem) => unknown;
}) {
  const { siteId, items, mutate, payloadKey, mapItem } = args;

  return (idToRemove: number) => {
    const remaining = items.filter((x) => x.id !== idToRemove).map(mapItem);

    mutate({
      constructionSiteId: siteId,
      [payloadKey]: remaining,
    } as TPayload);
  };
}
