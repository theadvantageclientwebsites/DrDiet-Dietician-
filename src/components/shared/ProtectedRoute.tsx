import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types'
import { ROUTES } from '@/config/routes'

interface ProtectedRouteProps {
  allowedRoles: UserRole[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    // Not logged in — redirect to sign-in, preserve intended destination
    return <Navigate to={ROUTES.SIGN_IN} state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in but wrong role — redirect to their own dashboard
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
