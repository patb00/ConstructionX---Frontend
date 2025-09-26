export const env = {
  apiBaseUrl: import.meta.env.DEV
    ? ""
    : import.meta.env.VITE_API_BASE_URL ?? "",
  authMode: (import.meta.env.VITE_AUTH_MODE ?? "header") as "header" | "cookie",
};
