/**
 * useAdminPackages.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * TanStack Query hook for fetching the admin packages list.
 * Supports server-side pagination, search, category, and isActive filters.
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import type {
  AdminPackage,
  AdminPackagesPagination,
  AdminPackagesParams,
} from '@/types'

// ─── Query key factory ────────────────────────────────────────────────────────
export const adminPackagesKey = (params: AdminPackagesParams = {}) =>
  ['admin', 'packages', params] as const

// ─── Pagination defaults ──────────────────────────────────────────────────────
export const DEFAULT_PACKAGES_LIMIT = 10

// ─── Fallback ─────────────────────────────────────────────────────────────────
const FALLBACK_PAGINATION: AdminPackagesPagination = {
  page:       1,
  limit:      DEFAULT_PACKAGES_LIMIT,
  totalItems: 0,
  totalPages: 1,
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAdminPackages(params: AdminPackagesParams = {}) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: adminPackagesKey(params),
    queryFn:  () => adminService.getAdminPackages(params),
    placeholderData: keepPreviousData,
    retry:     1,
    staleTime: 1000 * 60 * 5, // 5 min — packages change infrequently
  })

  const packages:  AdminPackage[]          = data?.data?.items      ?? []
  const pagination: AdminPackagesPagination = data?.data?.pagination ?? FALLBACK_PAGINATION

  return {
    packages,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}
