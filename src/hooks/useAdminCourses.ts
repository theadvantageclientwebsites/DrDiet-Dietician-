import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'

export const adminCoursesKey = ['admin', 'courses'] as const

export function useAdminCourses() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminCoursesKey,
    queryFn:  () => adminService.getCourses(),
    retry: 1,
  })

  return {
    courses: data?.data ?? [],
    isLoading,
    isError,
    refetch,
  }
}
