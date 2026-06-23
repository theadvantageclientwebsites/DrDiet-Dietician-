import axiosInstance from '@/lib/axios'
import type {
  Appointment,
  BookAppointmentPayload,
  ApiResponse,
  PaginatedResponse,
  AppointmentStatus,
} from '@/types'

export const appointmentService = {
  // Patient — book appointment
  book: async (payload: BookAppointmentPayload): Promise<ApiResponse<Appointment>> => {
    const { data } = await axiosInstance.post<ApiResponse<Appointment>>('/appointments', payload)
    return data
  },

  // Get appointments (doctor sees all, patient sees own)
  getAll: async (params?: {
    page?: number
    limit?: number
    status?: AppointmentStatus
    date?: string
  }): Promise<PaginatedResponse<Appointment>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Appointment>>('/appointments', {
      params,
    })
    return data
  },

  getById: async (id: string): Promise<ApiResponse<Appointment>> => {
    const { data } = await axiosInstance.get<ApiResponse<Appointment>>(`/appointments/${id}`)
    return data
  },

  // Doctor — update status
  updateStatus: async (
    id: string,
    status: AppointmentStatus,
    notes?: string,
  ): Promise<ApiResponse<Appointment>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/status`,
      { status, notes },
    )
    return data
  },

  // Patient — reschedule
  reschedule: async (
    id: string,
    payload: { date: string; slot: string },
  ): Promise<ApiResponse<Appointment>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/reschedule`,
      payload,
    )
    return data
  },

  // Cancel
  cancel: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.patch<ApiResponse<null>>(
      `/appointments/${id}/cancel`,
    )
    return data
  },

  // Get available slots for a date
  getAvailableSlots: async (date: string): Promise<ApiResponse<string[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<string[]>>('/appointments/slots', {
      params: { date },
    })
    return data
  },
}
