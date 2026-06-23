import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentService } from '@/services/api/appointment.service'
import type { BookAppointmentPayload, AppointmentStatus } from '@/types'

export const APPOINTMENT_KEYS = {
  all: ['appointments'] as const,
  lists: () => [...APPOINTMENT_KEYS.all, 'list'] as const,
  list: (filters: object) => [...APPOINTMENT_KEYS.lists(), filters] as const,
  detail: (id: string) => [...APPOINTMENT_KEYS.all, id] as const,
  slots: (date: string) => [...APPOINTMENT_KEYS.all, 'slots', date] as const,
}

export const useAppointments = (params?: {
  page?: number
  limit?: number
  status?: AppointmentStatus
  date?: string
}) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.list(params ?? {}),
    queryFn: () => appointmentService.getAll(params),
  })
}

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.detail(id),
    queryFn: () => appointmentService.getById(id),
    enabled: !!id,
  })
}

export const useAvailableSlots = (date: string) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.slots(date),
    queryFn: () => appointmentService.getAvailableSlots(date),
    enabled: !!date,
  })
}

export const useBookAppointment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BookAppointmentPayload) => appointmentService.book(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() })
    },
  })
}

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string
      status: AppointmentStatus
      notes?: string
    }) => appointmentService.updateStatus(id, status, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() })
    },
  })
}

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, date, slot }: { id: string; date: string; slot: string }) =>
      appointmentService.reschedule(id, { date, slot }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() })
    },
  })
}

export const useCancelAppointment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => appointmentService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() })
    },
  })
}
