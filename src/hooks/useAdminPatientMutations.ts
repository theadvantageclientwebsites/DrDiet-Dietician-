import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import { useToast } from '@/components/ui/toast'
import { adminPatientsKey, DEFAULT_PATIENTS_LIMIT } from '@/hooks/useAdminPatients'
import type { AdminPatientUpdatePayload } from '@/types'

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

export function useUpdatePatient(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminPatientUpdatePayload }) =>
      adminService.updatePatient(id, payload),
    onSuccess: (res, { id }) => {
      toast({ variant: 'success', title: 'Patient updated', description: res.message ?? 'Changes saved successfully.' })
      qc.invalidateQueries({ queryKey: adminPatientsKey({ page: 1, limit: DEFAULT_PATIENTS_LIMIT }) })
      qc.invalidateQueries({ queryKey: ['admin', 'patient', id] })
      onSuccess?.()
    },
    onError: (err) => {
      toast({ variant: 'error', title: 'Update failed', description: getErrorMessage(err, 'Could not update patient. Please try again.') })
    },
  })
}

export function useDeletePatient(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.deletePatient(id),
    onSuccess: (res) => {
      toast({ variant: 'success', title: 'Patient deleted', description: res.message ?? 'Patient removed successfully.' })
      qc.invalidateQueries({ queryKey: ['admin', 'patients'] })
      onSuccess?.()
    },
    onError: (err) => {
      toast({ variant: 'error', title: 'Delete failed', description: getErrorMessage(err, 'Could not delete patient. Please try again.') })
    },
  })
}
