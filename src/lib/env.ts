export const API_BASE = import.meta.env.DEV
  ? ""
  : "https://fradotovic-001-site1.jtempurl.com";
export const DEFAULT_TENANT = import.meta.env.VITE_API_TENANT ?? "root";
