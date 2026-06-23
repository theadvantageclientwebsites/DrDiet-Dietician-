import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/api/auth.service'
import type { LoginPayload, PatientRegistration, InternRegistration } from '@/types'
import { ROUTES } from '@/config/routes'

export const useLogin = () => {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.token, data.refreshToken)
      // Redirect based on role
      const roleRedirects: Record<string, string> = {
        doctor: ROUTES.DOCTOR.DASHBOARD,
        patient: ROUTES.PATIENT.DASHBOARD,
        intern: ROUTES.INTERN.DASHBOARD,
        admin: ROUTES.ADMIN.DASHBOARD,
      }
      navigate(roleRedirects[data.user.role] ?? ROUTES.HOME)
    },
  })
}

export const useRegisterPatient = () => {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: PatientRegistration) => authService.registerPatient(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.token, data.refreshToken)
      navigate(ROUTES.PATIENT.DASHBOARD)
    },
  })
}

export const useRegisterIntern = () => {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: InternRegistration) => authService.registerIntern(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.token, data.refreshToken)
      navigate(ROUTES.INTERN.DASHBOARD)
    },
  })
}

export const useLogout = () => {
  const { clearAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth()
      navigate(ROUTES.SIGN_IN)
    },
  })
}
