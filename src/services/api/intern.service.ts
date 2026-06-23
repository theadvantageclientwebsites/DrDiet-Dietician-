import axiosInstance from '@/lib/axios'
import type { Intern, Course, Certificate, ApiResponse, PaginatedResponse } from '@/types'

export const internService = {
  getProfile: async (): Promise<ApiResponse<Intern>> => {
    const { data } = await axiosInstance.get<ApiResponse<Intern>>('/interns/profile')
    return data
  },

  updateProfile: async (payload: Partial<Intern>): Promise<ApiResponse<Intern>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Intern>>('/interns/profile', payload)
    return data
  },

  checkEligibility: async (): Promise<ApiResponse<{ isEligible: boolean; reason?: string }>> => {
    const { data } = await axiosInstance.get<ApiResponse<{ isEligible: boolean; reason?: string }>>(
      '/interns/eligibility',
    )
    return data
  },

  // Courses
  getAvailableCourses: async (): Promise<ApiResponse<Course[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<Course[]>>('/interns/courses')
    return data
  },

  getCourseById: async (id: string): Promise<ApiResponse<Course>> => {
    const { data } = await axiosInstance.get<ApiResponse<Course>>(`/interns/courses/${id}`)
    return data
  },

  enrollInCourse: async (courseId: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post<ApiResponse<null>>(`/interns/courses/${courseId}/enroll`)
    return data
  },

  markVideoComplete: async (courseId: string, videoId: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post<ApiResponse<null>>(
      `/interns/courses/${courseId}/videos/${videoId}/complete`,
    )
    return data
  },

  submitTest: async (
    courseId: string,
    answers: Record<string, string>,
  ): Promise<ApiResponse<{ passed: boolean; score: number }>> => {
    const { data } = await axiosInstance.post<ApiResponse<{ passed: boolean; score: number }>>(
      `/interns/courses/${courseId}/test`,
      { answers },
    )
    return data
  },

  // Certificates
  getCertificates: async (): Promise<ApiResponse<Certificate[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<Certificate[]>>('/interns/certificates')
    return data
  },

  // Admin — manage interns
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<PaginatedResponse<Intern>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Intern>>('/interns', { params })
    return data
  },
}
