import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/api/notification.service'
import { useNotificationStore } from '@/store/notificationStore'
import { useEffect } from 'react'

export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  list: (params: object) => [...NOTIFICATION_KEYS.all, params] as const,
}

export const useNotifications = (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
  const { setNotifications } = useNotificationStore()

  const query = useQuery({
    queryKey: NOTIFICATION_KEYS.list(params ?? {}),
    queryFn: () => notificationService.getAll(params),
  })

  useEffect(() => {
    if (query.data?.data) {
      setNotifications(query.data.data)
    }
  }, [query.data, setNotifications])

  return query
}

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient()
  const { markAsRead } = useNotificationStore()

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: (_, id) => {
      markAsRead(id)
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all })
    },
  })
}

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient()
  const { markAllAsRead } = useNotificationStore()

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      markAllAsRead()
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all })
    },
  })
}
