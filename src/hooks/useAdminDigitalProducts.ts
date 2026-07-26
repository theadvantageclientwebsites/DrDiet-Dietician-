import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import type { AdminDigitalProductsParams } from '@/services/api/admin.service'
import type { DigitalProduct } from '@/types'

export const adminDigitalProductsKey = ['admin', 'digital-products'] as const
export const DEFAULT_DIGITAL_PRODUCTS_LIMIT = 10

export function useAdminDigitalProducts(params: AdminDigitalProductsParams = {}) {
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: [...adminDigitalProductsKey, params] as const,
    queryFn:  () => adminService.getDigitalProducts(params),
    retry: 1,
    placeholderData: (prev) => prev,
  })

  // API returns { data: { items: [], pagination: {}, filters: {} } }
  const paginatedData = data?.data
  const products: DigitalProduct[] = Array.isArray(paginatedData?.items)
    ? paginatedData.items
    : []

  const pagination = paginatedData?.pagination ?? {
    page: 1,
    limit: DEFAULT_DIGITAL_PRODUCTS_LIMIT,
    totalItems: 0,
    totalPages: 1,
  }

  const filters = paginatedData?.filters ?? null

  return {
    products,
    pagination,
    filters,
    isLoading,
    isFetching,
    isError,
    refetch,
  }
}
