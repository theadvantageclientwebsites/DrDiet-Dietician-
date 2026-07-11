/**
 * useAdminAppointments.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * TanStack Query hooks for the admin appointments section.
 * Provides summary stats and the paginated, filterable appointments list.
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import type {
  AdminAppointmentsParams,
  AdminAppointmentsSummary,
  AdminAppointmentsPagination,
  AdminAppointment,
} from '@/types'

// ─── Query key factory ────────────────────────────────────────────────────────
export const adminAppointmentsKey = (params: AdminAppointmentsParams) =>
  ['admin', 'appointments', 'list', params] as const

export const ADMIN_APPOINTMENTS_SUMMARY_KEY = ['admin', 'appointments', 'summary'] as const

export const adminAppointmentDetailKey = (id: string) =>
  ['admin', 'appointment', id] as const

// ─── Pagination defaults ──────────────────────────────────────────────────────
export const DEFAULT_APPOINTMENTS_LIMIT = 10

// ─── Fallback shapes ──────────────────────────────────────────────────────────
const FALLBACK_PAGINATION: AdminAppointmentsPagination = {
  page:       1,
  limit:      DEFAULT_APPOINTMENTS_LIMIT,
  totalItems: 0,
  totalPages: 1,
}

const FALLBACK_SUMMARY: AdminAppointmentsSummary = {
  total:     0,
  today:     0,
  pending:   0,
  confirmed: 0,
  completed: 0,
  cancelled: 0,
}

// ─── Appointments summary hook ────────────────────────────────────────────────
export function useAdminAppointmentsSummary() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ADMIN_APPOINTMENTS_SUMMARY_KEY,
    queryFn:  () => adminService.getAppointmentsSummary(),
    retry:    1,
    staleTime: 1000 * 60 * 2, // 2 min — summary can refresh quickly
  })

  return {
    summary:   data?.data ?? FALLBACK_SUMMARY,
    isLoading,
    isError,
    error,
    refetch,
  }
}

// ─── Paginated appointments list hook ─────────────────────────────────────────
export interface UseAdminAppointmentsOptions extends AdminAppointmentsParams {}

export function useAdminAppointments(params: UseAdminAppointmentsOptions = {}) {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: adminAppointmentsKey(params),
    queryFn:  () => adminService.getAppointments(params),
    placeholderData: keepPreviousData,
    retry:    1,
  })

  const items:      AdminAppointment[]       = data?.data?.items      ?? []
  const pagination: AdminAppointmentsPagination = data?.data?.pagination ?? FALLBACK_PAGINATION

  return {
    appointments: items,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}

// ─── Single appointment detail hook ──────────────────────────────────────────
export function useAdminAppointmentDetail(id: string | null) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: adminAppointmentDetailKey(id ?? ''),
    queryFn:  () => adminService.getAppointmentById(id!),
    enabled:  !!id,
    retry:    1,
    staleTime: 1000 * 60 * 2,
  })

  return {
    appointment: data?.data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  }
}
