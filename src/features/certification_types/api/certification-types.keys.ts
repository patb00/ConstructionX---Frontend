export const certificationTypesKeys = {
  all: ["certification-types"] as const,
  list: () => [...certificationTypesKeys.all, "list"] as const,
  detail: (id: number) =>
    [...certificationTypesKeys.all, "detail", id] as const,
};
