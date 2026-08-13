/**
 * useDoctorAppointmentMutations.ts — status updates for doctor appointments.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorService } from '@/services/api/doctor.service'
import { useToast } from '@/components/ui/toast'
import {
  doctorAppointmentsKey,
  doctorAppointmentDetailKey,
  DEFAULT_DOCTOR_APPOINTMENTS_LIMIT,
} from '@/hooks/useDoctorAppointments'
import { DOCTOR_DASHBOARD_KEY } from '@/hooks/useDoctorDashboard'
import type { DoctorAppointmentStatusPayload, DoctorAppointmentUpdatePayload } from '@/types'

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

export function useUpdateDoctorAppointmentStatus(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DoctorAppointmentStatusPayload }) =>
      doctorService.updateAppointmentStatus(id, payload),

    onSuccess: (res, { id }) => {
      toast({
        variant:     'success',
        title:       'Status updated',
        description: res.message ?? 'Appointment status updated successfully.',
      })
      qc.invalidateQueries({ queryKey: doctorAppointmentDetailKey(id) })
      qc.invalidateQueries({ queryKey: ['doctor', 'appointments', 'list'] })
      qc.invalidateQueries({ queryKey: DOCTOR_DASHBOARD_KEY })
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant:     'error',
        title:       'Update failed',
        description: getErrorMessage(err, 'Could not update appointment status.'),
      })
    },
  })
}

export function useUpdateDoctorAppointment(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DoctorAppointmentUpdatePayload }) =>
      doctorService.updateAppointment(id, payload),

    onSuccess: (res, { id }) => {
      toast({
        variant:     'success',
        title:       'Appointment updated',
        description: res.message ?? 'Appointment rescheduled successfully.',
      })
      qc.invalidateQueries({ queryKey: doctorAppointmentDetailKey(id) })
      qc.invalidateQueries({ queryKey: ['doctor', 'appointments', 'list'] })
      qc.invalidateQueries({ queryKey: DOCTOR_DASHBOARD_KEY })
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant:     'error',
        title:       'Update failed',
        description: getErrorMessage(err, 'Could not update appointment.'),
      })
    },
  })
}

export function useDoctorAppointmentStatusQuick() {
  const update = useUpdateDoctorAppointmentStatus()
  return {
    ...update,
    confirm:   (id: string, notes?: string) =>
      update.mutate({ id, payload: { status: 'CONFIRMED', notes } }),
    complete:  (id: string, notes?: string) =>
      update.mutate({ id, payload: { status: 'COMPLETED', notes } }),
    cancel:    (id: string, notes?: string) =>
      update.mutate({ id, payload: { status: 'CANCELLED', notes } }),
    invalidateLists: () => {
      update.reset()
    },
    defaultListKey: doctorAppointmentsKey({ page: 1, limit: DEFAULT_DOCTOR_APPOINTMENTS_LIMIT }),
  }
}
