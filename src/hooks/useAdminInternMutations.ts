import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import { useToast } from '@/components/ui/toast'
import { adminInternsKey, adminInternsSummaryKey, DEFAULT_INTERNS_LIMIT } from '@/hooks/useAdminInterns'
import type { AdminInternCreatePayload, AdminInternUpdatePayload } from '@/types'

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

export function useCreateIntern(onSuccess?: (password: string) => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminInternCreatePayload) =>
      adminService.createIntern(payload),
    onSuccess: (res) => {
      const pwd = res.data.generatedPassword
      toast({
        variant: 'success',
        title: 'Intern created',
        description: res.message ?? `Auto-generated password: ${pwd}`,
      })
      qc.invalidateQueries({ queryKey: adminInternsKey({ page: 1, limit: DEFAULT_INTERNS_LIMIT }) })
      qc.invalidateQueries({ queryKey: adminInternsSummaryKey })
      onSuccess?.(pwd)
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Create failed',
        description: getErrorMessage(err, 'Could not create intern. Please try again.'),
      })
    },
  })
}

export function useUpdateIntern(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminInternUpdatePayload }) =>
      adminService.updateIntern(id, payload),
    onSuccess: (res, { id }) => {
      toast({
        variant: 'success',
        title: 'Intern updated',
        description: res.message ?? 'Changes saved successfully.',
      })
      qc.invalidateQueries({ queryKey: adminInternsKey({ page: 1, limit: DEFAULT_INTERNS_LIMIT }) })
      qc.invalidateQueries({ queryKey: ['admin', 'intern', id] })
      qc.invalidateQueries({ queryKey: adminInternsSummaryKey })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Update failed',
        description: getErrorMessage(err, 'Could not update intern. Please try again.'),
      })
    },
  })
}

export function useDeleteIntern(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.deleteIntern(id),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Intern deleted',
        description: res.message ?? 'Intern removed successfully.',
      })
      qc.invalidateQueries({ queryKey: ['admin', 'interns'] })
      qc.invalidateQueries({ queryKey: adminInternsSummaryKey })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Delete failed',
        description: getErrorMessage(err, 'Could not delete intern. Please try again.'),
      })
    },
  })
}
