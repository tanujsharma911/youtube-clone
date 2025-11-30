import type { User } from "@/types";
import { create } from "zustand";

// Interface for auth store state
interface AuthState {
  user: { loggedIn: boolean; data: User | null };
  login: (userData: User) => void;
  logout: () => void;
}

const useAuth = create<AuthState>((set) => ({
  user: { loggedIn: false, data: null },
  login: (userData: User) => set({ user: { loggedIn: true, data: userData } }),
  logout: () => set({ user: { loggedIn: false, data: null } }),
}));

export default useAuth;
