/**
 * useAdminDashboard.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches the admin dashboard summary from GET /admin/dashboard/summary.
 * Keeps the page component presentation-only — zero data logic in the view.
 */

import { useQuery } from '@tanstack/react-query'
import { adminService, type DashboardSummary } from '@/services/api/admin.service'

// ─── Query key ────────────────────────────────────────────────────────────────
export const ADMIN_DASHBOARD_SUMMARY_KEY = ['admin', 'dashboard', 'summary'] as const

// ─── Fallback shown while loading or on error ─────────────────────────────────
const SUMMARY_FALLBACK: DashboardSummary = {
  totalPatients:  0,
  totalDoctors:   0,
  pendingDoctors: 0,
  totalInterns:   0,
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAdminDashboard() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ADMIN_DASHBOARD_SUMMARY_KEY,
    queryFn:  () => adminService.getDashboardSummary(),
    // Retry once — avoids flooding the server on persistent failures
    retry:    1,
  })

  // Null-safe: fall back to zeros so cards always render without crashing
  const summary: DashboardSummary = data?.data ?? SUMMARY_FALLBACK

  return {
    summary,
    isLoading,
    isError,
    error,
    refetch,
  }
}
