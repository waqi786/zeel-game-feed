import { create } from "zustand";
import { api } from "../services/api";

export type User = {
  id: number;
  uuid: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  themePreference: "system" | "dark" | "light";
  xp: number;
  streakCount: number;
  level?: number;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateTheme: (themePreference: User["themePreference"]) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  async checkAuth() {
    set({ isLoading: true });
    try {
      const { data } = await api.get("/users/me");
      set({ user: data.user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    set({ user: data.user });
  },
  async register(username, email, password) {
    const { data } = await api.post("/auth/register", { username, email, password });
    set({ user: data.user });
  },
  async logout() {
    await api.get("/auth/logout");
    set({ user: null });
  },
  async updateTheme(themePreference) {
    const { data } = await api.patch("/users/theme", { themePreference });
    set((state) => ({ user: state.user ? { ...state.user, ...data.user, themePreference } : state.user }));
  }
}));
