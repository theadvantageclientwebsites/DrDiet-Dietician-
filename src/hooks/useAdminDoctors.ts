import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useMemo } from 'react'
import { adminService } from '@/services/api/admin.service'
import type { AdminDoctor, AdminDoctorsParams } from '@/types'

export const DEFAULT_DOCTORS_LIMIT = 10

export const adminDoctorsKey = (params: AdminDoctorsParams) =>
  ['admin', 'doctors', params] as const

const FALLBACK_PAGINATION = {
  page:       1,
  limit:      DEFAULT_DOCTORS_LIMIT,
  totalItems: 0,
  totalPages: 1,
}

export interface UseAdminDoctorsOptions {
  page:             number
  limit?:           number
  searchTerm?:      string
  statusFilter?:    string
  isApproved?:      string
  specialization?:  string
}

export function useAdminDoctors({
  page,
  limit         = DEFAULT_DOCTORS_LIMIT,
  searchTerm    = '',
  statusFilter  = '',
  isApproved    = '',
  specialization = '',
}: UseAdminDoctorsOptions) {
  const params: AdminDoctorsParams = {
    page,
    limit,
    ...(statusFilter   && { status: statusFilter }),
    ...(isApproved     && { isApproved }),
    ...(specialization && { specialization }),
  }

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: adminDoctorsKey(params),
    queryFn:  () => adminService.getDoctors(params),
    placeholderData: keepPreviousData,
    retry: 1,
  })

  const rawItems: AdminDoctor[] = data?.data?.items ?? []
  const pagination               = data?.data?.pagination ?? FALLBACK_PAGINATION

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return rawItems
    const term = searchTerm.trim().toLowerCase()
    return rawItems.filter(
      (d) =>
        (d.fullName?.toLowerCase().includes(term)                          ?? false) ||
        (d.email?.toLowerCase().includes(term)                             ?? false) ||
        (d.doctorProfile?.phoneNumber?.includes(term)                      ?? false) ||
        (d.doctorProfile?.specialization?.toLowerCase().includes(term)     ?? false) ||
        (d.doctorProfile?.hospitalName?.toLowerCase().includes(term)       ?? false),
    )
  }, [rawItems, searchTerm])

  return {
    doctors:    filteredItems,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    isFiltered: filteredItems.length !== rawItems.length,
  }
}
