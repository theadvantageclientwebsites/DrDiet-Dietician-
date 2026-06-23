import axiosInstance from '@/lib/axios'
import type { Patient, DietPlan, BloodReport, ApiResponse, PaginatedResponse } from '@/types'

export const patientService = {
  getProfile: async (): Promise<ApiResponse<Patient>> => {
    const { data } = await axiosInstance.get<ApiResponse<Patient>>('/patients/profile')
    return data
  },

  updateProfile: async (payload: Partial<Patient>): Promise<ApiResponse<Patient>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Patient>>('/patients/profile', payload)
    return data
  },

  // Doctor — get patient by ID
  getById: async (id: string): Promise<ApiResponse<Patient>> => {
    const { data } = await axiosInstance.get<ApiResponse<Patient>>(`/patients/${id}`)
    return data
  },

  // Doctor / Admin — get all patients
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<PaginatedResponse<Patient>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Patient>>('/patients', { params })
    return data
  },

  // Diet Plans
  getDietPlans: async (patientId?: string): Promise<ApiResponse<DietPlan[]>> => {
    const url = patientId ? `/patients/${patientId}/diet-plans` : '/patients/diet-plans'
    const { data } = await axiosInstance.get<ApiResponse<DietPlan[]>>(url)
    return data
  },

  createDietPlan: async (
    patientId: string,
    payload: Partial<DietPlan>,
  ): Promise<ApiResponse<DietPlan>> => {
    const { data } = await axiosInstance.post<ApiResponse<DietPlan>>(
      `/patients/${patientId}/diet-plans`,
      payload,
    )
    return data
  },

  // Blood Reports
  uploadBloodReport: async (patientId: string, formData: FormData): Promise<ApiResponse<BloodReport>> => {
    const { data } = await axiosInstance.post<ApiResponse<BloodReport>>(
      `/patients/${patientId}/blood-reports`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return data
  },

  getBloodReports: async (patientId?: string): Promise<ApiResponse<BloodReport[]>> => {
    const url = patientId ? `/patients/${patientId}/blood-reports` : '/patients/blood-reports'
    const { data } = await axiosInstance.get<ApiResponse<BloodReport[]>>(url)
    return data
  },

  addBloodReportNotes: async (
    reportId: string,
    notes: string,
  ): Promise<ApiResponse<BloodReport>> => {
    const { data } = await axiosInstance.patch<ApiResponse<BloodReport>>(
      `/blood-reports/${reportId}/notes`,
      { notes },
    )
    return data
  },
}
