export const examinationTypesKeys = {
  all: ["examination-types"] as const,
  list: () => [...examinationTypesKeys.all, "list"] as const,
  detail: (id: number) => [...examinationTypesKeys.all, "detail", id] as const,
};
