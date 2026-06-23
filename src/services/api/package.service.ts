import axiosInstance from '@/lib/axios'
import type { Package, ApiResponse, RazorpayOrder, PaymentVerification } from '@/types'

export const packageService = {
  getAll: async (): Promise<ApiResponse<Package[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<Package[]>>('/packages')
    return data
  },

  getById: async (id: string): Promise<ApiResponse<Package>> => {
    const { data } = await axiosInstance.get<ApiResponse<Package>>(`/packages/${id}`)
    return data
  },

  // Admin — create / update / delete
  create: async (payload: Partial<Package>): Promise<ApiResponse<Package>> => {
    const { data } = await axiosInstance.post<ApiResponse<Package>>('/packages', payload)
    return data
  },

  update: async (id: string, payload: Partial<Package>): Promise<ApiResponse<Package>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Package>>(`/packages/${id}`, payload)
    return data
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(`/packages/${id}`)
    return data
  },

  // Payment via Razorpay
  createOrder: async (packageId: string): Promise<ApiResponse<RazorpayOrder>> => {
    const { data } = await axiosInstance.post<ApiResponse<RazorpayOrder>>('/payments/order', {
      packageId,
    })
    return data
  },

  verifyPayment: async (payload: PaymentVerification): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post<ApiResponse<null>>('/payments/verify', payload)
    return data
  },
}
