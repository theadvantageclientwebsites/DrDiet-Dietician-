import APICall from '@/lib/apiCall'
import ENDPOINTS from '@/config/endpoints'
import type { Notification, ApiResponse, PaginatedResponse } from '@/types'

export const notificationService = {
  getAll: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    APICall<PaginatedResponse<Notification>>(
      'get',
      params ?? null,
      ENDPOINTS.NOTIFICATIONS.LIST,
    ).then((res) => res.data),

  markAsRead: (id: string) =>
    APICall<ApiResponse<null>>('patch', null, ENDPOINTS.NOTIFICATIONS.MARK_READ(id))
      .then((res) => res.data),

  markAllAsRead: () =>
    APICall<ApiResponse<null>>('patch', null, ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
      .then((res) => res.data),
}
