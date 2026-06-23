import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types'
import { ROUTES } from '@/config/routes'

// Redirects authenticated users away from auth pages (login, register, etc.)
export default function GuestRoute() {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated && user) {
    const roleRedirects: Record<UserRole, string> = {
      doctor: ROUTES.DOCTOR.DASHBOARD,
      patient: ROUTES.PATIENT.DASHBOARD,
      intern: ROUTES.INTERN.DASHBOARD,
      admin: ROUTES.ADMIN.DASHBOARD,
    }
    return <Navigate to={roleRedirects[user.role]} replace />
  }

  return <Outlet />
}
