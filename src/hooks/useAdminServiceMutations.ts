import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import { useToast } from '@/components/ui/toast'
import { adminServicesKey } from '@/hooks/useAdminServices'
import type { Service } from '@/types'

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

export function useCreateService(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<Service>) => adminService.createService(payload),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Service created',
        description: res.message ?? 'Service added successfully.',
      })
      qc.invalidateQueries({ queryKey: adminServicesKey })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Create failed',
        description: getErrorMessage(err, 'Could not create service. Please try again.'),
      })
    },
  })
}

export function useUpdateService(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Service> }) =>
      adminService.updateService(id, payload),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Service updated',
        description: res.message ?? 'Changes saved successfully.',
      })
      qc.invalidateQueries({ queryKey: adminServicesKey })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Update failed',
        description: getErrorMessage(err, 'Could not update service. Please try again.'),
      })
    },
  })
}

export function useDeleteService(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.deleteService(id),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Service deleted',
        description: res.message ?? 'Service removed successfully.',
      })
      qc.invalidateQueries({ queryKey: adminServicesKey })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Delete failed',
        description: getErrorMessage(err, 'Could not delete service. Please try again.'),
      })
    },
  })
}
