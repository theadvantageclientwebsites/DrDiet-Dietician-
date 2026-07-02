import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import { useToast } from '@/components/ui/toast'
import { adminDigitalProductsKey } from '@/hooks/useAdminDigitalProducts'
import type { DigitalProduct } from '@/types'

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

export function useCreateDigitalProduct(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => adminService.createDigitalProduct(formData),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Product created',
        description: res.message ?? 'Digital product added successfully.',
      })
      qc.invalidateQueries({ queryKey: adminDigitalProductsKey })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Create failed',
        description: getErrorMessage(err, 'Could not create product. Please try again.'),
      })
    },
  })
}

export function useUpdateDigitalProduct(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<DigitalProduct> }) =>
      adminService.updateDigitalProduct(id, payload),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Product updated',
        description: res.message ?? 'Changes saved successfully.',
      })
      qc.invalidateQueries({ queryKey: adminDigitalProductsKey })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Update failed',
        description: getErrorMessage(err, 'Could not update product. Please try again.'),
      })
    },
  })
}

export function useDeleteDigitalProduct(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.deleteDigitalProduct(id),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Product deleted',
        description: res.message ?? 'Removed successfully.',
      })
      qc.invalidateQueries({ queryKey: adminDigitalProductsKey })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Delete failed',
        description: getErrorMessage(err, 'Could not delete product. Please try again.'),
      })
    },
  })
}
