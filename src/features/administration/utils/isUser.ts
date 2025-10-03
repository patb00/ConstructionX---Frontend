import type { User } from "../users";

export function isUser(x: any): x is User {
  return !!x && typeof x.id === "string";
}
