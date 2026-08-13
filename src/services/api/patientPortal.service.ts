/**
 * patientPortal.service.ts — Patient portal API (/patient/*)
 */

import APICall from '@/lib/apiCall'
import ENDPOINTS from '@/config/endpoints'
import type {
  ApiResponse,
  PatientDashboardData,
  PatientPortalProfileData,
  PatientPortalProfileUpdatePayload,
  PatientPortalDoctor,
  PatientPortalAppointment,
  PatientBookAppointmentPayload,
  PatientAppointmentsParams,
  PatientAppointmentsPaginatedData,
  PatientDoctorsParams,
  PatientPortalPackage,
  PatientPortalDigitalProduct,
  PatientDigitalProductsParams,
  PatientDigitalProductsPaginatedData,
  PatientBloodReportsPaginatedData,
  PatientCreateOrderPayload,
  PatientRazorpayOrderData,
  PatientPaymentVerifyPayload,
  PatientOrdersPaginatedData,
  UploadProfilePhotoResponse,
} from '@/types'

function cleanParams<T extends Record<string, unknown>>(params: T): Record<string, unknown> {
  const clean: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(params)) {
    if (v !== '' && v !== undefined && v !== null) clean[k] = v
  }
  return clean
}

export const patientPortalService = {
  getDashboard: () =>
    APICall<ApiResponse<PatientDashboardData>>('get', null, ENDPOINTS.PATIENT.DASHBOARD)
      .then((res) => res.data),

  getProfile: () =>
    APICall<ApiResponse<PatientPortalProfileData>>('get', null, ENDPOINTS.PATIENT.PROFILE)
      .then((res) => res.data),

  updateProfile: (payload: PatientPortalProfileUpdatePayload) =>
    APICall<ApiResponse<PatientPortalProfileData>>('put', payload, ENDPOINTS.PATIENT.PROFILE)
      .then((res) => res.data),

  uploadProfilePhoto: (file: File) => {
    const fd = new FormData()
    fd.append('photo', file)
    return APICall<ApiResponse<UploadProfilePhotoResponse>>(
      'post', fd, ENDPOINTS.UPLOAD.PROFILE_PHOTO, {}, true,
    ).then((res) => res.data)
  },

  getDoctors: (params: PatientDoctorsParams = {}) => {
    const clean = cleanParams(params as Record<string, unknown>)
    return APICall<ApiResponse<PatientPortalDoctor[]>>(
      'get',
      Object.keys(clean).length ? clean : null,
      ENDPOINTS.PATIENT.APPOINTMENTS_DOCTORS,
    ).then((res) => res.data)
  },

  getAppointments: (params: PatientAppointmentsParams = {}) => {
    const clean = cleanParams(params as Record<string, unknown>)
    return APICall<ApiResponse<PatientAppointmentsPaginatedData>>(
      'get',
      Object.keys(clean).length ? clean : null,
      ENDPOINTS.PATIENT.APPOINTMENTS,
    ).then((res) => res.data)
  },

  getAppointmentById: (id: string) =>
    APICall<ApiResponse<PatientPortalAppointment>>('get', null, ENDPOINTS.PATIENT.APPOINTMENT_BY_ID(id))
      .then((res) => res.data),

  bookAppointment: (payload: PatientBookAppointmentPayload) =>
    APICall<ApiResponse<PatientPortalAppointment>>('post', payload, ENDPOINTS.PATIENT.APPOINTMENTS)
      .then((res) => res.data),

  cancelAppointment: (id: string) =>
    APICall<ApiResponse<PatientPortalAppointment>>('patch', null, ENDPOINTS.PATIENT.APPOINTMENT_CANCEL(id))
      .then((res) => res.data),

  getPackages: (params?: { search?: string; category?: string }) => {
    const clean = cleanParams((params ?? {}) as Record<string, unknown>)
    return APICall<ApiResponse<PatientPortalPackage[]>>(
      'get',
      Object.keys(clean).length ? clean : null,
      ENDPOINTS.PATIENT.PACKAGES,
    ).then((res) => res.data)
  },

  getPackageById: (id: string) =>
    APICall<ApiResponse<PatientPortalPackage>>('get', null, ENDPOINTS.PATIENT.PACKAGE_BY_ID(id))
      .then((res) => res.data),

  getDigitalProducts: (params: PatientDigitalProductsParams = {}) => {
    const clean = cleanParams(params as Record<string, unknown>)
    return APICall<ApiResponse<PatientDigitalProductsPaginatedData>>(
      'get',
      Object.keys(clean).length ? clean : null,
      ENDPOINTS.PATIENT.DIGITAL_PRODUCTS,
    ).then((res) => res.data)
  },

  getDigitalProductById: (id: string) =>
    APICall<ApiResponse<PatientPortalDigitalProduct>>('get', null, ENDPOINTS.PATIENT.DIGITAL_PRODUCT_BY_ID(id))
      .then((res) => res.data),

  getBloodReports: (params?: { page?: number; limit?: number }) => {
    const clean = cleanParams((params ?? {}) as Record<string, unknown>)
    return APICall<ApiResponse<PatientBloodReportsPaginatedData>>(
      'get',
      Object.keys(clean).length ? clean : null,
      ENDPOINTS.PATIENT.BLOOD_REPORTS,
    ).then((res) => res.data)
  },

  createPaymentOrder: (payload: PatientCreateOrderPayload) =>
    APICall<ApiResponse<PatientRazorpayOrderData>>('post', payload, ENDPOINTS.PATIENT.PAYMENTS_CREATE_ORDER)
      .then((res) => res.data),

  verifyPayment: (payload: PatientPaymentVerifyPayload) =>
    APICall<ApiResponse<{ success: boolean; message: string }>>('post', payload, ENDPOINTS.PATIENT.PAYMENTS_VERIFY)
      .then((res) => res.data),

  getMyOrders: (params?: { page?: number; limit?: number; status?: string; itemType?: string }) => {
    const clean = cleanParams((params ?? {}) as Record<string, unknown>)
    return APICall<ApiResponse<PatientOrdersPaginatedData>>(
      'get',
      Object.keys(clean).length ? clean : null,
      ENDPOINTS.PATIENT.PAYMENTS_MY_ORDERS,
    ).then((res) => res.data)
  },
}
