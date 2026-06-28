import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/api/auth.service'
import { useToast } from '@/components/ui/toast'
import type { LoginPayload, PatientRegistration, InternRegistration } from '@/types'
import { ROUTES } from '@/config/routes'

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Extract a readable message from an axios error response */
const getErrorMessage = (err: unknown, fallback: string): string => {
  const axiosErr = err as { response?: { data?: { message?: string } } }
  return axiosErr?.response?.data?.message ?? fallback
}

// ─── Login ────────────────────────────────────────────────────────────────────
export const useLogin = () => {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (res) => {
      const { token, user } = res.data
      setAuth(user, token)

      toast({ variant: 'success', title: 'Welcome back!', description: `Signed in as ${user.fullName}` })

      // Backend returns uppercase roles: PATIENT, DOCTOR, INTERN, ADMIN
      const roleRedirects: Record<string, string> = {
        DOCTOR:  ROUTES.DOCTOR.DASHBOARD,
        PATIENT: ROUTES.PATIENT.DASHBOARD,
        INTERN:  ROUTES.INTERN.DASHBOARD,
        ADMIN:   ROUTES.ADMIN.DASHBOARD,
      }
      navigate(roleRedirects[user.role] ?? ROUTES.SIGN_IN)
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Sign in failed',
        description: getErrorMessage(err, 'Invalid email or password'),
      })
    },
  })
}

// ─── Register Patient ─────────────────────────────────────────────────────────
export const useRegisterPatient = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (payload: PatientRegistration) => authService.registerPatient(payload),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Registration successful',
        description: res.message ?? 'Your account is ready. Please sign in.',
      })
      // Register does not return a token — redirect to sign-in
      navigate(ROUTES.SIGN_IN)
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Registration failed',
        description: getErrorMessage(err, 'Something went wrong. Please try again.'),
      })
    },
  })
}

// ─── Register Intern ──────────────────────────────────────────────────────────
export const useRegisterIntern = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (payload: InternRegistration) => authService.registerIntern(payload),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Application submitted',
        description: res.message ?? 'Your internship application is under review.',
      })
      navigate(ROUTES.SIGN_IN)
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Registration failed',
        description: getErrorMessage(err, 'Something went wrong. Please try again.'),
      })
    },
  })
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export const useLogout = () => {
  const { clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth()
      toast({ variant: 'default', title: 'Signed out successfully' })
      navigate(ROUTES.SIGN_IN)
    },
  })
}
