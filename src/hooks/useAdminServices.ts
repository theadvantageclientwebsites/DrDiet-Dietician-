import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'

export const adminServicesKey = ['admin', 'services'] as const

export function useAdminServices() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminServicesKey,
    queryFn:  () => adminService.getServices(),
    retry: 1,
  })

  return {
    services: data?.data ?? [],
    isLoading,
    isError,
    refetch,
  }
}
