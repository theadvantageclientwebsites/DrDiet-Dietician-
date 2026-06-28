import APICall from '@/lib/apiCall'
import ENDPOINTS from '@/config/endpoints'
import type { Patient, DietPlan, BloodReport, ApiResponse, PaginatedResponse } from '@/types'

export const patientService = {
  /** Get own profile (patient role) */
  getProfile: () =>
    APICall<ApiResponse<Patient>>('get', null, ENDPOINTS.PATIENTS.PROFILE)
      .then((res) => res.data),

  /** Update own profile */
  updateProfile: (payload: Partial<Patient>) =>
    APICall<ApiResponse<Patient>>('patch', payload, ENDPOINTS.PATIENTS.PROFILE)
      .then((res) => res.data),

  /** Doctor/Admin — get a single patient by ID */
  getById: (id: string) =>
    APICall<ApiResponse<Patient>>('get', null, ENDPOINTS.PATIENTS.BY_ID(id))
      .then((res) => res.data),

  /** Doctor/Admin — get paginated patient list */
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    APICall<PaginatedResponse<Patient>>('get', params ?? null, ENDPOINTS.PATIENTS.LIST)
      .then((res) => res.data),

  // ─── Diet Plans ────────────────────────────────────────────────────────────

  /** Patient fetches own plans; doctor fetches by patientId */
  getDietPlans: (patientId?: string) => {
    const url = patientId
      ? ENDPOINTS.PATIENTS.DIET_PLANS_BY_ID(patientId)
      : ENDPOINTS.PATIENTS.DIET_PLANS
    return APICall<ApiResponse<DietPlan[]>>('get', null, url).then((res) => res.data)
  },

  /** Doctor — create a diet plan for a patient */
  createDietPlan: (patientId: string, payload: Partial<DietPlan>) =>
    APICall<ApiResponse<DietPlan>>(
      'post',
      payload,
      ENDPOINTS.PATIENTS.DIET_PLANS_BY_ID(patientId),
    ).then((res) => res.data),

  // ─── Blood Reports ─────────────────────────────────────────────────────────

  /** Upload a blood report (multipart/form-data) */
  uploadBloodReport: (patientId: string, formData: FormData) =>
    APICall<ApiResponse<BloodReport>>(
      'post',
      formData,
      ENDPOINTS.PATIENTS.BLOOD_REPORTS_BY_ID(patientId),
      {},
      true, // formData = true
    ).then((res) => res.data),

  /** Patient fetches own reports; doctor fetches by patientId */
  getBloodReports: (patientId?: string) => {
    const url = patientId
      ? ENDPOINTS.PATIENTS.BLOOD_REPORTS_BY_ID(patientId)
      : ENDPOINTS.PATIENTS.BLOOD_REPORTS
    return APICall<ApiResponse<BloodReport[]>>('get', null, url).then((res) => res.data)
  },

  /** Doctor — add notes to a blood report */
  addBloodReportNotes: (reportId: string, notes: string) =>
    APICall<ApiResponse<BloodReport>>(
      'patch',
      { notes },
      ENDPOINTS.BLOOD_REPORTS.ADD_NOTES(reportId),
    ).then((res) => res.data),
}
