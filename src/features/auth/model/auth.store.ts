import { create } from "zustand";
import { setTenant as applyTenant, setTokens } from "../../../lib/auth";
import { queryClient } from "../../../app/providers/QueryProvider";

type State = { isAuthed: boolean; tenant?: string; error?: string };
type Actions = {
  setTenant: (t: string) => void;
  setAuthed: (v: boolean) => void;
  signOut: () => void;
};

export const useAuthStore = create<State & Actions>((set) => ({
  isAuthed: false,
  setTenant: (tenant) => {
    applyTenant(tenant);
    set({ tenant });
  },
  setAuthed: (v) => set({ isAuthed: v }),
  signOut: () => {
    setTokens(null);
    queryClient.clear();
    set({ isAuthed: false });
  },
}));
