type MutateFn<TPayload> = (payload: TPayload) => void;

export function buildUnassign<
  TItem extends { id: number },
  TPayload extends object
>(args: {
  siteId: number;
  items: TItem[];
  mutate: MutateFn<TPayload>;
  payloadKey: keyof TPayload;
  mapItem: (item: TItem) => any;
  idKey?: string;
}) {
  const { siteId, items, mutate, payloadKey, mapItem } = args;

  return (idToRemove: number) => {
    const remaining = items.filter((x) => x.id !== idToRemove).map(mapItem);

    mutate({
      constructionSiteId: siteId,
      [payloadKey]: remaining,
    } as unknown as TPayload);
  };
}
