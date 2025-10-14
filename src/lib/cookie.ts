export type CookieOptions = {
  days?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "Lax" | "Strict" | "None";
};

export function setCookie(
  name: string,
  value: string,
  opts: CookieOptions = {}
) {
  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const { days = 7, path = "/", secure = isHttps, sameSite = "Lax" } = opts;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; Expires=${date.toUTCString()}; Path=${path}; SameSite=${sameSite}`;
  if (secure) cookie += "; Secure";
  document.cookie = cookie;
}

export function getCookie(name: string): string | null {
  const key = encodeURIComponent(name) + "=";
  const parts = document.cookie.split("; ");
  for (const p of parts) {
    if (p.indexOf(key) === 0)
      return decodeURIComponent(p.substring(key.length));
  }
  return null;
}

export function deleteCookie(name: string) {
  document.cookie = `${encodeURIComponent(
    name
  )}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`;
}
