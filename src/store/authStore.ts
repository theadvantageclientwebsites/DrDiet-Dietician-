import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, UserRole } from '@/types'
import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '@/config/constants'

interface AuthState {
  user: AuthUser | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  setAuth: (user: AuthUser, token: string, refreshToken: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  hasRole: (role: UserRole) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token, refreshToken) => {
        localStorage.setItem(TOKEN_KEY, token)
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        set({ user, token, refreshToken, isAuthenticated: true })
      },

      clearAuth: () => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
      },

      setLoading: (loading) => set({ isLoading: loading }),

      hasRole: (role) => get().user?.role === role,
    }),
    {
      name: 'drdiet-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
