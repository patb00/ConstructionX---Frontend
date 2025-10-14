export const API_BASE = import.meta.env.DEV ? "" : "https://localhost:7118";
export const DEFAULT_TENANT = import.meta.env.VITE_API_TENANT ?? "root";
