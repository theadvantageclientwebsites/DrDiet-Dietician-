import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, UserRole } from '@/types'

// ─── Single localStorage key for all auth state ───────────────────────────────
export const AUTH_STORE_KEY = 'drdiet-auth'

// ─── One-time cleanup of legacy keys left by older versions ──────────────────
const LEGACY_KEYS = ['drdiet_token', 'drdiet_user', 'drdiet_refresh_token']
LEGACY_KEYS.forEach((k) => localStorage.removeItem(k))

// ─── State shape ─────────────────────────────────────────────────────────────
interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean

  setAuth: (user: AuthUser, token: string) => void
  clearAuth: () => void
  hasRole: (role: UserRole) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Only zustand persist writes to localStorage — no manual setItem calls
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),

      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),

      hasRole: (role) => get().user?.role === role,
    }),
    {
      name: AUTH_STORE_KEY,
      version: 3, // bumped — wipes any persisted state from older versions
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
