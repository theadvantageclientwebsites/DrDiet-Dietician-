import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import { useToast } from '@/components/ui/toast'
import type { AdminSubscriptionsParams, PackageSubscriptionStatus } from '@/types'

export const DEFAULT_SUBSCRIPTIONS_LIMIT = 10

export const adminSubscriptionsKey = (params: AdminSubscriptionsParams) =>
  ['admin', 'subscriptions', params] as const

const FALLBACK_PAGINATION = {
  page: 1, limit: DEFAULT_SUBSCRIPTIONS_LIMIT, totalItems: 0, totalPages: 1,
}

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

export function useAdminSubscriptions(params: AdminSubscriptionsParams = {}) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: adminSubscriptionsKey(params),
    queryFn:  () => adminService.getSubscriptions(params),
    placeholderData: keepPreviousData,
    retry: 1,
  })
  return {
    subscriptions: data?.data?.items ?? [],
    pagination:    data?.data?.pagination ?? FALLBACK_PAGINATION,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}

export function useAssignSubscriptionDoctor(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, doctorId }: { id: string; doctorId: string }) =>
      adminService.assignSubscriptionDoctor(id, doctorId),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Doctor assigned',
        description: res.message ?? 'Package is now active for the patient.',
      })
      qc.invalidateQueries({ queryKey: ['admin', 'subscriptions'] })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Assign failed',
        description: getErrorMessage(err, 'Could not assign doctor.'),
      })
    },
  })
}

export const SUBSCRIPTION_STATUS_LABEL: Record<PackageSubscriptionStatus, string> = {
  PENDING_ASSIGNMENT: 'Waiting for doctor',
  ACTIVE:             'Active',
  EXPIRED:            'Expired',
  CANCELLED:          'Cancelled',
}
