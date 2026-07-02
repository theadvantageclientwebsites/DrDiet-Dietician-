import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useMemo } from 'react'
import { adminService } from '@/services/api/admin.service'
import type { AdminIntern, AdminInternsParams, InternsSummary } from '@/types'

export const DEFAULT_INTERNS_LIMIT = 10

export const adminInternsKey = (params: AdminInternsParams) =>
  ['admin', 'interns', params] as const

export const adminInternsSummaryKey = ['admin', 'interns', 'summary'] as const

const FALLBACK_PAGINATION = { page: 1, limit: DEFAULT_INTERNS_LIMIT, totalItems: 0, totalPages: 1 }

export const SUMMARY_FALLBACK: InternsSummary = {
  totalInterns: 0, approved: 0, pending: 0, completedCourses: 0,
}

export function useAdminInternsSummary() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminInternsSummaryKey,
    queryFn:  () => adminService.getInternsSummary(),
    retry: 1,
    staleTime: 1000 * 60 * 2,
  })

  return {
    summary:   data?.data ?? SUMMARY_FALLBACK,
    isLoading, isError, refetch,
  }
}

export interface UseAdminInternsOptions {
  page:          number
  limit?:        number
  searchTerm?:   string
  statusFilter?: string
  isApproved?:   string
}

export function useAdminInterns({
  page,
  limit = DEFAULT_INTERNS_LIMIT,
  searchTerm   = '',
  statusFilter = '',
  isApproved   = '',
}: UseAdminInternsOptions) {
  const params: AdminInternsParams = {
    page,
    limit,
    ...(statusFilter && { status: statusFilter }),
    ...(isApproved   && { isApproved }),
  }

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: adminInternsKey(params),
    queryFn:  () => adminService.getInterns(params),
    placeholderData: keepPreviousData,
    retry: 1,
  })

  const rawItems: AdminIntern[] = data?.data?.items ?? []
  const pagination               = data?.data?.pagination ?? FALLBACK_PAGINATION

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return rawItems
    const term = searchTerm.trim().toLowerCase()
    return rawItems.filter(
      (i) =>
        (i.fullName?.toLowerCase().includes(term)                    ?? false) ||
        (i.email?.toLowerCase().includes(term)                       ?? false) ||
        (i.internProfile?.phoneNumber?.includes(term)                ?? false) ||
        (i.internProfile?.universityName?.toLowerCase().includes(term) ?? false) ||
        (i.internProfile?.specialization?.toLowerCase().includes(term) ?? false),
    )
  }, [rawItems, searchTerm])

  return {
    interns:    filteredItems,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    isFiltered: filteredItems.length !== rawItems.length,
  }
}
