import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'

export const adminCoursesKey = ['admin', 'courses'] as const

export function useAdminCourses() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminCoursesKey,
    queryFn:  () => adminService.getCourses(),
    retry: 1,
  })

  // Guard against API returning a non-array (e.g. wrapped object or null)
  const rawCourses = data?.data
  const courses = Array.isArray(rawCourses) ? rawCourses : []

  return {
    courses,
    isLoading,
    isError,
    refetch,
  }
}
