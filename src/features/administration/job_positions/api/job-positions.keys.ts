export const jobPositionsKeys = {
  all: ["job-positions"] as const,
  list: () => [...jobPositionsKeys.all, "list"] as const,
  detail: (id: number | string) =>
    [...jobPositionsKeys.all, "detail", id] as const,
};
