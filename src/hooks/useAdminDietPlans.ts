import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import { useToast } from '@/components/ui/toast'
import type { DietPlansListParams } from '@/types'

export const adminDietPlansKey = (params: DietPlansListParams) =>
  ['admin', 'diet-plans', params] as const

const FALLBACK = { page: 1, limit: 10, totalItems: 0, totalPages: 1 }

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

export function useAdminDietPlans(params: DietPlansListParams = {}) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: adminDietPlansKey(params),
    queryFn:  () => adminService.getDietPlans(params),
    placeholderData: keepPreviousData,
    retry: 1,
  })
  return {
    plans:      data?.data?.items ?? [],
    pagination: data?.data?.pagination ?? FALLBACK,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}

export function useApproveDietPlan() {
  const { toast } = useToast()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.approveDietPlan(id),
    onSuccess: (res) => {
      toast({ variant: 'success', title: 'Approved', description: res.message ?? 'Patient can now see this plan.' })
      qc.invalidateQueries({ queryKey: ['admin', 'diet-plans'] })
    },
    onError: (err) => {
      toast({ variant: 'error', title: 'Approve failed', description: getErrorMessage(err, 'Could not approve plan.') })
    },
  })
}

export function useRejectDietPlan() {
  const { toast } = useToast()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminService.rejectDietPlan(id, reason),
    onSuccess: (res) => {
      toast({ variant: 'success', title: 'Rejected', description: res.message ?? 'Doctor can edit and resubmit.' })
      qc.invalidateQueries({ queryKey: ['admin', 'diet-plans'] })
    },
    onError: (err) => {
      toast({ variant: 'error', title: 'Reject failed', description: getErrorMessage(err, 'Could not reject plan.') })
    },
  })
}
