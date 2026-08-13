/**
 * useDoctorBloodReports.ts — TanStack Query hooks for doctor blood reports.
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { doctorService } from '@/services/api/doctor.service'
import type {
  DoctorBloodReportsParams,
  DoctorAppointmentsPagination,
  DoctorBloodReport,
  DoctorBloodReportDetail,
} from '@/types'

export const doctorBloodReportsKey = (params: DoctorBloodReportsParams) =>
  ['doctor', 'blood-reports', 'list', params] as const

export const doctorBloodReportDetailKey = (id: string) =>
  ['doctor', 'blood-report', id] as const

export const DEFAULT_DOCTOR_BLOOD_REPORTS_LIMIT = 10

const FALLBACK_PAGINATION: DoctorAppointmentsPagination = {
  page:       1,
  limit:      DEFAULT_DOCTOR_BLOOD_REPORTS_LIMIT,
  totalItems: 0,
  totalPages: 1,
}

export function useDoctorBloodReports(params: DoctorBloodReportsParams = {}) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: doctorBloodReportsKey(params),
    queryFn:  () => doctorService.getBloodReports(params),
    placeholderData: keepPreviousData,
    retry:    1,
  })

  return {
    reports:    data?.data?.items      ?? [] as DoctorBloodReport[],
    pagination: data?.data?.pagination ?? FALLBACK_PAGINATION,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}

export function useDoctorBloodReportDetail(id: string | null) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: doctorBloodReportDetailKey(id ?? ''),
    queryFn:  () => doctorService.getBloodReportById(id!),
    enabled:  !!id,
    retry:    1,
  })

  return {
    report: data?.data ?? null as DoctorBloodReportDetail | null,
    isLoading,
    isError,
    error,
    refetch,
  }
}
