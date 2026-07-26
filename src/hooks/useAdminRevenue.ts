/**
 * useAdminRevenue.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * TanStack Query hooks for the admin revenue section.
 *
 * - useAdminRevenueSummary  → GET /admin/revenue/summary
 * - useAdminRevenueOrders   → GET /admin/revenue/orders  (paginated + filtered)
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import type {
  RevenueSummaryData,
  RevenueOrdersPaginatedData,
  RevenueOrdersParams,
  RevenueSummaryStats,
  RevenueBreakdown,
  RecentTransaction,
  RevenueOrder,
  RevenueOrdersPagination,
} from '@/types'

// ─── Query key factories ──────────────────────────────────────────────────────
export const ADMIN_REVENUE_SUMMARY_KEY = ['admin', 'revenue', 'summary'] as const

export const adminRevenueOrdersKey = (params: RevenueOrdersParams) =>
  ['admin', 'revenue', 'orders', params] as const

// ─── Fallback shapes ──────────────────────────────────────────────────────────
const FALLBACK_SUMMARY_STATS: RevenueSummaryStats = {
  totalRevenue: 0,
  thisMonth:    0,
  thisWeek:     0,
  totalOrders:  0,
}

const FALLBACK_BREAKDOWN: RevenueBreakdown = {
  packages:        { revenue: 0, percentage: 0 },
  digitalProducts: { revenue: 0, percentage: 0 },
}

const FALLBACK_SUMMARY_DATA: RevenueSummaryData = {
  summary:            FALLBACK_SUMMARY_STATS,
  breakdown:          FALLBACK_BREAKDOWN,
  recentTransactions: [],
}

const FALLBACK_PAGINATION: RevenueOrdersPagination = {
  page:       1,
  limit:      10,
  totalItems: 0,
  totalPages: 1,
}

// ─── Revenue Summary hook ─────────────────────────────────────────────────────
export function useAdminRevenueSummary() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey:  ADMIN_REVENUE_SUMMARY_KEY,
    queryFn:   () => adminService.getRevenueSummary(),
    retry:     1,
    // Revenue summary can be a bit stale — 3 min cache
    staleTime: 1000 * 60 * 3,
  })

  // Null-safe destructure so the page never crashes on partial API responses
  const rawData: RevenueSummaryData = data?.data ?? FALLBACK_SUMMARY_DATA

  const summary:            RevenueSummaryStats   = rawData.summary            ?? FALLBACK_SUMMARY_STATS
  const breakdown:          RevenueBreakdown       = rawData.breakdown          ?? FALLBACK_BREAKDOWN
  const recentTransactions: RecentTransaction[]    = Array.isArray(rawData.recentTransactions)
    ? rawData.recentTransactions
    : []

  return {
    summary,
    breakdown,
    recentTransactions,
    isLoading,
    isError,
    error,
    refetch,
  }
}

// ─── Revenue Orders hook ──────────────────────────────────────────────────────
export interface UseAdminRevenueOrdersOptions extends RevenueOrdersParams {}

export const DEFAULT_ORDERS_LIMIT = 10

export function useAdminRevenueOrders(params: UseAdminRevenueOrdersOptions = {}) {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey:        adminRevenueOrdersKey(params),
    queryFn:         () => adminService.getRevenueOrders(params),
    placeholderData: keepPreviousData,
    retry:           1,
  })

  const rawData: RevenueOrdersPaginatedData | null = data?.data ?? null

  const orders:     RevenueOrder[]          = Array.isArray(rawData?.items)      ? rawData!.items      : []
  const pagination: RevenueOrdersPagination = rawData?.pagination                ?? FALLBACK_PAGINATION

  return {
    orders,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}
