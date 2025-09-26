export function decodeJwt<T = any>(token: string): T | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);

    const json = atob(padded);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
