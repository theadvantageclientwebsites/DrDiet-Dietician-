import APICall from '@/lib/apiCall'
import ENDPOINTS from '@/config/endpoints'
import type {
  Appointment,
  BookAppointmentPayload,
  ApiResponse,
  PaginatedResponse,
  AppointmentStatus,
} from '@/types'

export const appointmentService = {
  /** Patient — book a new appointment */
  book: (payload: BookAppointmentPayload) =>
    APICall<ApiResponse<Appointment>>('post', payload, ENDPOINTS.APPOINTMENTS.LIST)
      .then((res) => res.data),

  /** Get appointments list (doctor sees all, patient sees own) */
  getAll: (params?: {
    page?: number
    limit?: number
    status?: AppointmentStatus
    date?: string
  }) =>
    APICall<PaginatedResponse<Appointment>>('get', params ?? null, ENDPOINTS.APPOINTMENTS.LIST)
      .then((res) => res.data),

  getById: (id: string) =>
    APICall<ApiResponse<Appointment>>('get', null, ENDPOINTS.APPOINTMENTS.BY_ID(id))
      .then((res) => res.data),

  /** Doctor — update appointment status */
  updateStatus: (id: string, status: AppointmentStatus, notes?: string) =>
    APICall<ApiResponse<Appointment>>(
      'patch',
      { status, notes },
      ENDPOINTS.APPOINTMENTS.UPDATE_STATUS(id),
    ).then((res) => res.data),

  /** Patient — reschedule appointment */
  reschedule: (id: string, payload: { date: string; slot: string }) =>
    APICall<ApiResponse<Appointment>>(
      'patch',
      payload,
      ENDPOINTS.APPOINTMENTS.RESCHEDULE(id),
    ).then((res) => res.data),

  /** Cancel appointment */
  cancel: (id: string) =>
    APICall<ApiResponse<null>>('patch', null, ENDPOINTS.APPOINTMENTS.CANCEL(id))
      .then((res) => res.data),

  /** Get available booking slots for a given date */
  getAvailableSlots: (date: string) =>
    APICall<ApiResponse<string[]>>('get', { date }, ENDPOINTS.APPOINTMENTS.SLOTS)
      .then((res) => res.data),
}
