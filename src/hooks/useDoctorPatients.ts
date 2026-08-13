/**
 * useDoctorPatients.ts — TanStack Query hooks for doctor patients.
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { doctorService } from '@/services/api/doctor.service'
import type {
  DoctorPatientsParams,
  DoctorAppointmentsPagination,
  DoctorPatientListItem,
  DoctorPatientDetail,
} from '@/types'

export const doctorPatientsKey = (params: DoctorPatientsParams) =>
  ['doctor', 'patients', 'list', params] as const

export const doctorPatientDetailKey = (id: string) =>
  ['doctor', 'patient', id] as const

export const DEFAULT_DOCTOR_PATIENTS_LIMIT = 10

const FALLBACK_PAGINATION: DoctorAppointmentsPagination = {
  page:       1,
  limit:      DEFAULT_DOCTOR_PATIENTS_LIMIT,
  totalItems: 0,
  totalPages: 1,
}

export function useDoctorPatients(params: DoctorPatientsParams = {}) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: doctorPatientsKey(params),
    queryFn:  () => doctorService.getPatients(params),
    placeholderData: keepPreviousData,
    retry:    1,
  })

  return {
    patients:   data?.data?.items      ?? [] as DoctorPatientListItem[],
    pagination: data?.data?.pagination ?? FALLBACK_PAGINATION,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}

export function useDoctorPatientDetail(id: string | undefined) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: doctorPatientDetailKey(id ?? ''),
    queryFn:  () => doctorService.getPatientById(id!),
    enabled:  !!id,
    retry:    1,
  })

  return {
    patient: data?.data ?? null as DoctorPatientDetail | null,
    isLoading,
    isError,
    error,
    refetch,
  }
}
