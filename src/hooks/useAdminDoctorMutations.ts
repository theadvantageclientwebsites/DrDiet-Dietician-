import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import { useToast } from '@/components/ui/toast'
import { adminDoctorsKey, DEFAULT_DOCTORS_LIMIT } from '@/hooks/useAdminDoctors'
import type { AdminDoctorCreatePayload, AdminDoctorUpdatePayload, DoctorAccountStatus } from '@/types'

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

export function useCreateDoctor(onSuccess?: (password: string) => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminDoctorCreatePayload) =>
      adminService.createDoctor(payload),
    onSuccess: (res) => {
      const pwd = res.data.generatedPassword
      toast({
        variant: 'success',
        title: 'Doctor created',
        description: res.message ?? `Auto-generated password: ${pwd}`,
      })
      qc.invalidateQueries({ queryKey: adminDoctorsKey({ page: 1, limit: DEFAULT_DOCTORS_LIMIT }) })
      onSuccess?.(pwd)
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Create failed',
        description: getErrorMessage(err, 'Could not create doctor. Please try again.'),
      })
    },
  })
}

export function useUpdateDoctor(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminDoctorUpdatePayload }) =>
      adminService.updateDoctor(id, payload),
    onSuccess: (res, { id }) => {
      toast({
        variant: 'success',
        title: 'Doctor updated',
        description: res.message ?? 'Changes saved successfully.',
      })
      qc.invalidateQueries({ queryKey: adminDoctorsKey({ page: 1, limit: DEFAULT_DOCTORS_LIMIT }) })
      qc.invalidateQueries({ queryKey: ['admin', 'doctor', id] })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Update failed',
        description: getErrorMessage(err, 'Could not update doctor. Please try again.'),
      })
    },
  })
}

export function useUpdateDoctorStatus(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DoctorAccountStatus }) =>
      adminService.updateDoctorStatus(id, status),
    onSuccess: (res, { id }) => {
      toast({
        variant: 'success',
        title: 'Status updated',
        description: res.message ?? 'Doctor status changed successfully.',
      })
      qc.invalidateQueries({ queryKey: ['admin', 'doctors'] })
      qc.invalidateQueries({ queryKey: ['admin', 'doctor', id] })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Status update failed',
        description: getErrorMessage(err, 'Could not update doctor status. Please try again.'),
      })
    },
  })
}

export function useApproveDoctor(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.approveDoctor(id),
    onSuccess: (res, id) => {
      toast({
        variant: 'success',
        title: 'Doctor approved',
        description: res.message ?? 'Doctor approved successfully.',
      })
      qc.invalidateQueries({ queryKey: ['admin', 'doctors'] })
      qc.invalidateQueries({ queryKey: ['admin', 'doctor', id] })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Approval failed',
        description: getErrorMessage(err, 'Could not approve doctor. Please try again.'),
      })
    },
  })
}

export function useDeleteDoctor(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.deleteDoctor(id),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Doctor deleted',
        description: res.message ?? 'Doctor removed successfully.',
      })
      qc.invalidateQueries({ queryKey: ['admin', 'doctors'] })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Delete failed',
        description: getErrorMessage(err, 'Could not delete doctor. Please try again.'),
      })
    },
  })
}
