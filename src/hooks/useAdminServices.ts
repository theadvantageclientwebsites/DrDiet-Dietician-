import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'

export const adminServicesKey = ['admin', 'services'] as const

export function useAdminServices() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminServicesKey,
    queryFn:  () => adminService.getServices(),
    retry: 1,
  })

  // Guard against API returning a non-array (e.g. wrapped object or null)
  const rawServices = data?.data
  const services = Array.isArray(rawServices) ? rawServices : []

  return {
    services,
    isLoading,
    isError,
    refetch,
  }
}
