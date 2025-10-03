import { create } from "zustand";
import { setTenant as applyTenant, setTokens } from "../../../lib/auth";
import { queryClient } from "../../../app/providers/QueryProvider";
import type { CurrentUser } from "./currentUser";

type State = {
  isAuthed: boolean;
  tenant?: string;
  error?: string;
  user?: CurrentUser | null;
};
type Actions = {
  setTenant: (t: string) => void;
  setAuthed: (v: boolean) => void;
  setUser: (u: CurrentUser | null) => void;
  signOut: () => void;
};

export const useAuthStore = create<State & Actions>((set) => ({
  isAuthed: false,
  user: null,
  setTenant: (tenant) => {
    applyTenant(tenant);
    set({ tenant });
  },
  setAuthed: (v) => set({ isAuthed: v }),
  setUser: (u) => set({ user: u, tenant: u?.tenant }),
  signOut: () => {
    setTokens(null);
    queryClient.clear();
    set({ isAuthed: false, user: null, tenant: undefined });
  },
}));
