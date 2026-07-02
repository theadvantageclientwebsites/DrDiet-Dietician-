import APICall from '@/lib/apiCall'
import ENDPOINTS from '@/config/endpoints'
import type { Intern, Course, Certificate, ApiResponse, PaginatedResponse } from '@/types'

export const internService = {
  getProfile: () =>
    APICall<ApiResponse<Intern>>('get', null, ENDPOINTS.INTERN.PROFILE)
      .then((res) => res.data),

  updateProfile: (payload: Partial<Intern>) =>
    APICall<ApiResponse<Intern>>('patch', payload, ENDPOINTS.INTERN.PROFILE)
      .then((res) => res.data),

  // ─── Courses ──────────────────────────────────────────────────────────────

  getAvailableCourses: () =>
    APICall<ApiResponse<Course[]>>('get', null, ENDPOINTS.COURSES.LIST)
      .then((res) => res.data),

  getCourseById: (id: string) =>
    APICall<ApiResponse<Course>>('get', null, ENDPOINTS.COURSES.BY_ID(id))
      .then((res) => res.data),

  enrollInCourse: (courseId: string) =>
    APICall<ApiResponse<null>>('post', null, `${ENDPOINTS.COURSES.BY_ID(courseId)}/enroll`)
      .then((res) => res.data),

  markVideoComplete: (courseId: string, videoId: string) =>
    APICall<ApiResponse<null>>(
      'post',
      null,
      `${ENDPOINTS.COURSES.BY_ID(courseId)}/videos/${videoId}/complete`,
    ).then((res) => res.data),

  submitTest: (courseId: string, answers: Record<string, string>) =>
    APICall<ApiResponse<{ passed: boolean; score: number }>>(
      'post',
      { answers },
      `${ENDPOINTS.COURSES.BY_ID(courseId)}/test`,
    ).then((res) => res.data),

  // ─── Certificates ─────────────────────────────────────────────────────────

  getCertificates: () =>
    APICall<ApiResponse<Certificate[]>>('get', null, ENDPOINTS.INTERN.CERTIFICATIONS)
      .then((res) => res.data),

  // ─── Admin — manage interns ────────────────────────────────────────────────

  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    APICall<PaginatedResponse<Intern>>('get', params ?? null, ENDPOINTS.ADMIN.INTERNS_LIST)
      .then((res) => res.data),
}
