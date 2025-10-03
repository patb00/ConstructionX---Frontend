import { useEffect } from "react";
import { useAuthStore } from "../../../features/auth/model/auth.store";
import { getCurrentUser } from "../../../features/auth/model/currentUser";
import { isAuthed } from "../../../lib/auth";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setAuthed = useAuthStore((s) => s.setAuthed);

  useEffect(() => {
    if (isAuthed()) {
      const user = getCurrentUser();
      setUser(user);
      setAuthed(!!user);
    }
  }, [setUser, setAuthed]);

  return <>{children}</>;
}
