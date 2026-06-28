import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/config/constants'
import { AUTH_STORE_KEY } from '@/store/authStore'

// ─── Read token from the single zustand persist entry ─────────────────────────
const getToken = (): string | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { state?: { token?: string } }
    return parsed?.state?.token ?? null
  } catch {
    return null
  }
}

// ─── Clear all auth state (called on 401) ─────────────────────────────────────
const clearAuthAndRedirect = () => {
  localStorage.removeItem(AUTH_STORE_KEY)
  window.location.replace('/sign-in')
}

// ─── Axios instance ───────────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request: attach Bearer token ────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response: 401 → wipe state and redirect to sign-in ──────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuthAndRedirect()
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
