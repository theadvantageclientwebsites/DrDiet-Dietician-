import axiosInstance from '@/lib/axios'
import type {
  LoginPayload,
  AuthResponse,
  PatientRegistration,
  InternRegistration,
  ApiResponse,
} from '@/types'

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', payload)
    return data
  },

  registerPatient: async (payload: PatientRegistration): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/register/patient', payload)
    return data
  },

  registerIntern: async (payload: InternRegistration): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/register/intern', payload)
    return data
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout')
  },

  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post<ApiResponse<null>>('/auth/forgot-password', { email })
    return data
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post<ApiResponse<null>>('/auth/reset-password', {
      token,
      password,
    })
    return data
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const { data } = await axiosInstance.post<{ token: string }>('/auth/refresh', { refreshToken })
    return data
  },
}
