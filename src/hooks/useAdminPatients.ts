import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useMemo } from 'react'
import { adminService } from '@/services/api/admin.service'
import type { AdminPatient, AdminPatientsParams } from '@/types'

// ─── Query key factory ────────────────────────────────────────────────────────
export const adminPatientsKey = (params: AdminPatientsParams) =>
  ['admin', 'patients', params] as const

// ─── Pagination defaults ──────────────────────────────────────────────────────
export const DEFAULT_PATIENTS_LIMIT = 5

// ─── Fallback pagination shape ────────────────────────────────────────────────
const FALLBACK_PAGINATION = {
  page:       1,
  limit:      DEFAULT_PATIENTS_LIMIT,
  totalItems: 0,
  totalPages: 1,
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export interface UseAdminPatientsOptions {
  page:         number
  limit?:       number
  /** Raw search string (debounced by caller before passing here) */
  searchTerm?:  string
  /** 'ACTIVE' | 'INACTIVE' | 'PENDING' | '' (all) */
  statusFilter?: string
}

export function useAdminPatients({
  page,
  limit = DEFAULT_PATIENTS_LIMIT,
  searchTerm  = '',
  statusFilter = '',
}: UseAdminPatientsOptions) {
  const params: AdminPatientsParams = { page, limit }

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: adminPatientsKey(params),
    queryFn:  () => adminService.getPatients(params),
    placeholderData: keepPreviousData,
    retry: 1,
  })

  // ── Null-safe base data ───────────────────────────────────────────────────
  const rawItems: AdminPatient[]         = data?.data?.items      ?? []
  const pagination                        = data?.data?.pagination ?? FALLBACK_PAGINATION

  // ── Client-side search + status filter on current page items ─────────────
  const filteredItems = useMemo(() => {
    let result = rawItems

    const term = searchTerm.trim().toLowerCase()
    if (term) {
      result = result.filter(
        (p) =>
          (p.fullName?.toLowerCase().includes(term) ?? false) ||
          (p.email?.toLowerCase().includes(term)    ?? false) ||
          (p.patientProfile?.phoneNumber?.includes(term) ?? false) ||
          (p.patientProfile?.location?.toLowerCase().includes(term) ?? false),
      )
    }

    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter((p) => p.accountStatus === statusFilter)
    }

    return result
  }, [rawItems, searchTerm, statusFilter])

  return {
    /** Filtered items for current page */
    patients:       filteredItems,
    /** Unfiltered total (from server) for pagination controls */
    pagination,
    isLoading,
    /** True during background refetch / page transition */
    isFetching,
    isError,
    error,
    refetch,
    /** Whether filters have narrowed the visible set */
    isFiltered: filteredItems.length !== rawItems.length,
  }
}
