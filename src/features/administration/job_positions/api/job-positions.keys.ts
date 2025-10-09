export const jobPositionsKeys = {
  all: ["job-positions"] as const,
  list: () => [...jobPositionsKeys.all, "list"] as const,
  detail: (id: number) => [...jobPositionsKeys.all, "detail", id] as const,
};
