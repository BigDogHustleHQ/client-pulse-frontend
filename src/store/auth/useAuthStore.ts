import { create } from 'zustand';
import type { AuthState } from './types';

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearAuth: () => set({ user: null }),
}));

export default useAuthStore;
