import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import { useToast } from '@/components/ui/toast'
import { adminCoursesKey } from '@/hooks/useAdminCourses'
import type { Course } from '@/types'

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

export function useCreateCourse(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<Course>) => adminService.createCourse(payload),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Course created',
        description: res.message ?? 'Course added successfully.',
      })
      qc.invalidateQueries({ queryKey: adminCoursesKey })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Create failed',
        description: getErrorMessage(err, 'Could not create course. Please try again.'),
      })
    },
  })
}

export function useUpdateCourse(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Course> }) =>
      adminService.updateCourse(id, payload),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Course updated',
        description: res.message ?? 'Changes saved successfully.',
      })
      qc.invalidateQueries({ queryKey: adminCoursesKey })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Update failed',
        description: getErrorMessage(err, 'Could not update course. Please try again.'),
      })
    },
  })
}

export function useDeleteCourse(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.deleteCourse(id),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Course deleted',
        description: res.message ?? 'Course removed successfully.',
      })
      qc.invalidateQueries({ queryKey: adminCoursesKey })
      onSuccess?.()
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Delete failed',
        description: getErrorMessage(err, 'Could not delete course. Please try again.'),
      })
    },
  })
}
