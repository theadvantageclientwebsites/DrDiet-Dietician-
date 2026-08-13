/**
 * useDoctorDashboard.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches GET /doctor/dashboard — doctor profile summary, stats, and next
 * upcoming appointment. Keeps DoctorDashboard.tsx presentation-only.
 */

import { useQuery } from '@tanstack/react-query'
import { doctorService } from '@/services/api/doctor.service'
import type { DoctorDashboardData, DoctorStats } from '@/types'

// ─── Query key ────────────────────────────────────────────────────────────────
export const DOCTOR_DASHBOARD_KEY = ['doctor', 'dashboard'] as const

// ─── Fallback stat values shown while loading / on error ─────────────────────
const STATS_FALLBACK: DoctorStats = {
  todayAppointments:     0,
  totalPatients:         0,
  pendingAppointments:   0,
  completedAppointments: 0,
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useDoctorDashboard() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: DOCTOR_DASHBOARD_KEY,
    queryFn:  () => doctorService.getDashboard(),
    retry:    1,
    staleTime: 60_000, // 1 min — dashboard data doesn't need to be realtime
  })

  const dashboardData: DoctorDashboardData | null = data?.data ?? null

  return {
    doctor:              dashboardData?.doctor              ?? null,
    stats:               dashboardData?.stats               ?? STATS_FALLBACK,
    upcomingAppointment: dashboardData?.upcomingAppointment ?? null,
    isLoading,
    isError,
    error,
    refetch,
  }
}
