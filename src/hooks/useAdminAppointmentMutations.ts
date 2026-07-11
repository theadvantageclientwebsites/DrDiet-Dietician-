/**
 * useAdminAppointmentMutations.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Mutation hooks for admin appointment actions:
 *   - Update status (CONFIRMED / COMPLETED / CANCELLED / PENDING)
 *   - Delete appointment
 *
 * Each mutation shows toast feedback and invalidates the relevant query keys.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import { useToast } from '@/components/ui/toast'
import {
  adminAppointmentsKey,
  adminAppointmentDetailKey,
  ADMIN_APPOINTMENTS_SUMMARY_KEY,
  DEFAULT_APPOINTMENTS_LIMIT,
} from '@/hooks/useAdminAppointments'
import type { AdminAppointmentStatus } from '@/types'

// ─── Helper ───────────────────────────────────────────────────────────────────
function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

// ─── Update appointment status ────────────────────────────────────────────────
export function useUpdateAppointmentStatus(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminAppointmentStatus }) =>
      adminService.updateAppointmentStatus(id, status),

    onSuccess: (res, { id }) => {
      const statusLabel = res.data?.status ?? ''
      toast({
        variant:     'success',
        title:       'Status updated',
        description: res.message ?? `Appointment marked as ${statusLabel.toLowerCase()}.`,
      })
      // Invalidate detail + all list queries + summary counters
      qc.invalidateQueries({ queryKey: adminAppointmentDetailKey(id) })
      qc.invalidateQueries({ queryKey: ['admin', 'appointments', 'list'] })
      qc.invalidateQueries({ queryKey: ADMIN_APPOINTMENTS_SUMMARY_KEY })
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant:     'error',
        title:       'Update failed',
        description: getErrorMessage(err, 'Could not update appointment status. Please try again.'),
      })
    },
  })
}

// ─── Delete appointment ───────────────────────────────────────────────────────
export function useDeleteAppointment(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.deleteAppointment(id),

    onSuccess: (res) => {
      toast({
        variant:     'success',
        title:       'Appointment deleted',
        description: res.message ?? 'Appointment removed successfully.',
      })
      qc.invalidateQueries({ queryKey: ['admin', 'appointments', 'list'] })
      qc.invalidateQueries({
        queryKey: adminAppointmentsKey({ page: 1, limit: DEFAULT_APPOINTMENTS_LIMIT }),
      })
      qc.invalidateQueries({ queryKey: ADMIN_APPOINTMENTS_SUMMARY_KEY })
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant:     'error',
        title:       'Delete failed',
        description: getErrorMessage(err, 'Could not delete appointment. Please try again.'),
      })
    },
  })
}
