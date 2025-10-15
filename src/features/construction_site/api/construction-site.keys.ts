export const constructionSitesKeys = {
  all: ["construction-sites"] as const,
  list: () => [...constructionSitesKeys.all, "list"] as const,
  detail: (id: number) => [...constructionSitesKeys.all, "detail", id] as const,
};
