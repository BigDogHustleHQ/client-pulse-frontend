export interface AuthUser {
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
}
