/**
 * useDoctorAppointments.ts — TanStack Query hooks for doctor appointments.
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { doctorService } from '@/services/api/doctor.service'
import type {
  DoctorAppointmentsParams,
  DoctorAppointmentsPagination,
  DoctorAppointment,
  DoctorAppointmentDetail,
} from '@/types'

export const doctorAppointmentsKey = (params: DoctorAppointmentsParams) =>
  ['doctor', 'appointments', 'list', params] as const

export const doctorAppointmentDetailKey = (id: string) =>
  ['doctor', 'appointment', id] as const

export const DEFAULT_DOCTOR_APPOINTMENTS_LIMIT = 10

const FALLBACK_PAGINATION: DoctorAppointmentsPagination = {
  page:       1,
  limit:      DEFAULT_DOCTOR_APPOINTMENTS_LIMIT,
  totalItems: 0,
  totalPages: 1,
}

export function useDoctorAppointments(params: DoctorAppointmentsParams = {}) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: doctorAppointmentsKey(params),
    queryFn:  () => doctorService.getAppointments(params),
    placeholderData: keepPreviousData,
    retry:    1,
  })

  return {
    appointments: data?.data?.items      ?? [] as DoctorAppointment[],
    pagination:   data?.data?.pagination ?? FALLBACK_PAGINATION,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}

export function useDoctorAppointmentDetail(id: string | null) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: doctorAppointmentDetailKey(id ?? ''),
    queryFn:  () => doctorService.getAppointmentById(id!),
    enabled:  !!id,
    retry:    1,
  })

  return {
    appointment: data?.data ?? null as DoctorAppointmentDetail | null,
    isLoading,
    isError,
    error,
    refetch,
  }
}
