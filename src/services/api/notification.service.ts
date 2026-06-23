import axiosInstance from '@/lib/axios'
import type { Notification, ApiResponse, PaginatedResponse } from '@/types'

export const notificationService = {
  getAll: async (params?: {
    page?: number
    limit?: number
    unreadOnly?: boolean
  }): Promise<PaginatedResponse<Notification>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Notification>>('/notifications', {
      params,
    })
    return data
  },

  markAsRead: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.patch<ApiResponse<null>>(`/notifications/${id}/read`)
    return data
  },

  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.patch<ApiResponse<null>>('/notifications/read-all')
    return data
  },
}
