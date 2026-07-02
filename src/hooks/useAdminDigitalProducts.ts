import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'

export const adminDigitalProductsKey = ['admin', 'digital-products'] as const

export function useAdminDigitalProducts() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminDigitalProductsKey,
    queryFn:  () => adminService.getDigitalProducts(),
    retry: 1,
  })

  return {
    products: data?.data ?? [],
    isLoading,
    isError,
    refetch,
  }
}
