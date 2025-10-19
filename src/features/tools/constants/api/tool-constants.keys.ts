export const toolConstantsKeys = {
  all: ["tool-constants"] as const,
  statuses: () => [...toolConstantsKeys.all, "statuses"] as const,
  conditions: () => [...toolConstantsKeys.all, "conditions"] as const,
};
