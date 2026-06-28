import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types'
import { ROUTES } from '@/config/routes'

// Redirects authenticated users away from auth pages (login, register, etc.)
export default function GuestRoute() {
  const { isAuthenticated, user, clearAuth } = useAuthStore()

  if (isAuthenticated && user) {
    const roleRedirects: Record<UserRole, string> = {
      DOCTOR:  ROUTES.DOCTOR.DASHBOARD,
      PATIENT: ROUTES.PATIENT.DASHBOARD,
      INTERN:  ROUTES.INTERN.DASHBOARD,
      ADMIN:   ROUTES.ADMIN.DASHBOARD,
    }

    const destination = roleRedirects[user.role]

    // Guard against stale persisted state with old lowercase roles
    if (!destination) {
      clearAuth()
      return <Outlet />
    }

    return <Navigate to={destination} replace />
  }

  return <Outlet />
}
