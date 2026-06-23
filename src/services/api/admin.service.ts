import axiosInstance from '@/lib/axios'
import type { ApiResponse, DigitalProduct, Service, Course } from '@/types'

interface RevenueStats {
  consultationIncome: number
  packageSales: number
  digitalProductSales: number
  total: number
  monthly: { month: string; amount: number }[]
  yearly: { year: number; amount: number }[]
}

interface DashboardStats {
  totalPatients: number
  activePatients: number
  totalInterns: number
  totalAppointmentsToday: number
  pendingAppointments: number
  revenue: number
}

export const adminService = {
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const { data } = await axiosInstance.get<ApiResponse<DashboardStats>>('/admin/stats')
    return data
  },

  getRevenue: async (params?: {
    period?: 'monthly' | 'yearly'
    year?: number
  }): Promise<ApiResponse<RevenueStats>> => {
    const { data } = await axiosInstance.get<ApiResponse<RevenueStats>>('/admin/revenue', {
      params,
    })
    return data
  },

  // Digital Products
  getDigitalProducts: async (): Promise<ApiResponse<DigitalProduct[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<DigitalProduct[]>>('/admin/digital-products')
    return data
  },

  createDigitalProduct: async (formData: FormData): Promise<ApiResponse<DigitalProduct>> => {
    const { data } = await axiosInstance.post<ApiResponse<DigitalProduct>>(
      '/admin/digital-products',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return data
  },

  updateDigitalProduct: async (
    id: string,
    payload: Partial<DigitalProduct>,
  ): Promise<ApiResponse<DigitalProduct>> => {
    const { data } = await axiosInstance.patch<ApiResponse<DigitalProduct>>(
      `/admin/digital-products/${id}`,
      payload,
    )
    return data
  },

  deleteDigitalProduct: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(
      `/admin/digital-products/${id}`,
    )
    return data
  },

  // Services (Yoga, Zumba, Blood Test)
  getServices: async (): Promise<ApiResponse<Service[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<Service[]>>('/admin/services')
    return data
  },

  createService: async (payload: Partial<Service>): Promise<ApiResponse<Service>> => {
    const { data } = await axiosInstance.post<ApiResponse<Service>>('/admin/services', payload)
    return data
  },

  updateService: async (id: string, payload: Partial<Service>): Promise<ApiResponse<Service>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Service>>(
      `/admin/services/${id}`,
      payload,
    )
    return data
  },

  // Courses
  createCourse: async (payload: Partial<Course>): Promise<ApiResponse<Course>> => {
    const { data } = await axiosInstance.post<ApiResponse<Course>>('/admin/courses', payload)
    return data
  },

  updateCourse: async (id: string, payload: Partial<Course>): Promise<ApiResponse<Course>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Course>>(
      `/admin/courses/${id}`,
      payload,
    )
    return data
  },

  deleteCourse: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(`/admin/courses/${id}`)
    return data
  },

  issueCertificate: async (
    internId: string,
    courseId: string,
  ): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post<ApiResponse<null>>('/admin/certificates', {
      internId,
      courseId,
    })
    return data
  },
}
