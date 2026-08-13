/**
 * doctor.service.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * All API calls for the Doctor panel.
 * Follows the same pattern as admin.service.ts — thin wrappers over APICall.
 */

import APICall from '@/lib/apiCall'
import ENDPOINTS from '@/config/endpoints'
import type {
  ApiResponse,
  DoctorDashboardData,
  DoctorUser,
  DoctorProfileUpdatePayload,
  DoctorAppointment,
  DoctorAppointmentDetail,
  DoctorAppointmentsPaginatedData,
  DoctorAppointmentsParams,
  DoctorAppointmentStatusPayload,
  DoctorPatientsPaginatedData,
  DoctorPatientsParams,
  DoctorPatientDetail,
  DoctorBloodReport,
  DoctorBloodReportDetail,
  DoctorBloodReportsPaginatedData,
  DoctorBloodReportsParams,
  DoctorBloodReportCreatePayload,
  DoctorBloodReportUpdatePayload,
  UploadBloodReportResponse,
  UploadProfilePhotoResponse,
} from '@/types'

function cleanParams<T extends Record<string, unknown>>(params: T): Record<string, unknown> {
  const clean: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(params)) {
    if (v !== '' && v !== undefined && v !== null) clean[k] = v
  }
  return clean
}

export const doctorService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────
  getDashboard: () =>
    APICall<ApiResponse<DoctorDashboardData>>('get', null, ENDPOINTS.DOCTOR.DASHBOARD)
      .then((res) => res.data),

  // ─── Profile ────────────────────────────────────────────────────────────────
  getProfile: () =>
    APICall<ApiResponse<DoctorUser>>('get', null, ENDPOINTS.DOCTOR.PROFILE)
      .then((res) => res.data),

  updateProfile: (payload: DoctorProfileUpdatePayload) =>
    APICall<ApiResponse<DoctorUser>>('put', payload, ENDPOINTS.DOCTOR.PROFILE)
      .then((res) => res.data),

  // ─── Upload ─────────────────────────────────────────────────────────────────
  uploadProfilePhoto: (file: File) => {
    const fd = new FormData()
    fd.append('photo', file)
    return APICall<ApiResponse<UploadProfilePhotoResponse>>(
      'post', fd, ENDPOINTS.UPLOAD.PROFILE_PHOTO, {}, true,
    ).then((res) => res.data)
  },

  uploadBloodReportFile: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return APICall<ApiResponse<UploadBloodReportResponse>>(
      'post', fd, ENDPOINTS.UPLOAD.BLOOD_REPORT, {}, true,
    ).then((res) => res.data)
  },

  // ─── Appointments ───────────────────────────────────────────────────────────
  getAppointments: (params: DoctorAppointmentsParams = {}) => {
    const clean = cleanParams(params as Record<string, unknown>)
    return APICall<ApiResponse<DoctorAppointmentsPaginatedData>>(
      'get',
      Object.keys(clean).length ? clean : null,
      ENDPOINTS.DOCTOR.APPOINTMENTS,
    ).then((res) => res.data)
  },

  getAppointmentById: (id: string) =>
    APICall<ApiResponse<DoctorAppointmentDetail>>('get', null, ENDPOINTS.DOCTOR.APPOINTMENT_BY_ID(id))
      .then((res) => res.data),

  updateAppointmentStatus: (id: string, payload: DoctorAppointmentStatusPayload) =>
    APICall<ApiResponse<DoctorAppointment>>('patch', payload, ENDPOINTS.DOCTOR.APPOINTMENT_STATUS(id))
      .then((res) => res.data),

  // ─── Patients ───────────────────────────────────────────────────────────────
  getPatients: (params: DoctorPatientsParams = {}) => {
    const clean = cleanParams(params as Record<string, unknown>)
    return APICall<ApiResponse<DoctorPatientsPaginatedData>>(
      'get',
      Object.keys(clean).length ? clean : null,
      ENDPOINTS.DOCTOR.PATIENTS,
    ).then((res) => res.data)
  },

  getPatientById: (id: string) =>
    APICall<ApiResponse<DoctorPatientDetail>>('get', null, ENDPOINTS.DOCTOR.PATIENT_BY_ID(id))
      .then((res) => res.data),

  // ─── Blood Reports ─────────────────────────────────────────────────────────
  getBloodReports: (params: DoctorBloodReportsParams = {}) => {
    const clean = cleanParams(params as Record<string, unknown>)
    return APICall<ApiResponse<DoctorBloodReportsPaginatedData>>(
      'get',
      Object.keys(clean).length ? clean : null,
      ENDPOINTS.DOCTOR.BLOOD_REPORTS,
    ).then((res) => res.data)
  },

  getBloodReportById: (id: string) =>
    APICall<ApiResponse<DoctorBloodReportDetail>>('get', null, ENDPOINTS.DOCTOR.BLOOD_REPORT_BY_ID(id))
      .then((res) => res.data),

  createBloodReport: (payload: DoctorBloodReportCreatePayload) =>
    APICall<ApiResponse<DoctorBloodReport>>('post', payload, ENDPOINTS.DOCTOR.BLOOD_REPORTS)
      .then((res) => res.data),

  updateBloodReport: (id: string, payload: DoctorBloodReportUpdatePayload) =>
    APICall<ApiResponse<DoctorBloodReport>>('put', payload, ENDPOINTS.DOCTOR.BLOOD_REPORT_BY_ID(id))
      .then((res) => res.data),

  deleteBloodReport: (id: string) =>
    APICall<ApiResponse<{ message: string }>>('delete', null, ENDPOINTS.DOCTOR.BLOOD_REPORT_BY_ID(id))
      .then((res) => res.data),
}
