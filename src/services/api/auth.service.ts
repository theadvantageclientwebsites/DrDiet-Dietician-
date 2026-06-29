import APICall from '@/lib/apiCall'
import ENDPOINTS from '@/config/endpoints'
import type {
  LoginPayload,
  PatientRegistration,
  InternRegistration,
  ApiResponse,
  LoginResponseData,
  PatientRegisterResponseData,
  InternRegisterResponseData,
} from '@/types'

export const authService = {
  /** POST /auth/login → { success, message, data: { token, user } } */
  login: (payload: LoginPayload) =>
    APICall<ApiResponse<LoginResponseData>>('post', payload, ENDPOINTS.AUTH.LOGIN)
      .then((res) => res.data),

  /** POST /auth/register/patient → { success, message, data: { ...user, patientProfile } } */
  registerPatient: (payload: PatientRegistration) =>
    APICall<ApiResponse<PatientRegisterResponseData>>(
      'post',
      payload,
      ENDPOINTS.AUTH.REGISTER_PATIENT,
    ).then((res) => res.data),

  /** POST /auth/register/intern → { success, message, data: { ...user, internProfile } } */
  registerIntern: (payload: InternRegistration) =>
    APICall<ApiResponse<InternRegisterResponseData>>(
      'post',
      payload,
      ENDPOINTS.AUTH.REGISTER_INTERN,
    ).then((res) => res.data),

  /** POST /auth/logout — protected, no body required */
  logout: () =>
    APICall<ApiResponse<null>>('post', null, ENDPOINTS.AUTH.LOGOUT)
      .then((res) => res.data),

  forgotPassword: (email: string) =>
    APICall<ApiResponse<null>>('post', { email }, ENDPOINTS.AUTH.FORGOT_PASSWORD)
      .then((res) => res.data),

  resetPassword: (token: string, password: string) =>
    APICall<ApiResponse<null>>('post', { token, password }, ENDPOINTS.AUTH.RESET_PASSWORD)
      .then((res) => res.data),

  refreshToken: (refreshToken: string) =>
    APICall<{ token: string }>('post', { refreshToken }, ENDPOINTS.AUTH.REFRESH_TOKEN)
      .then((res) => res.data),
}
