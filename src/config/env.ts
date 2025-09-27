export const env = {
  apiBaseUrl: import.meta.env.PROD ? "/api" : "http://localhost:5173/api", // dev overridden by Vite proxy below
  authMode: "header",
};
