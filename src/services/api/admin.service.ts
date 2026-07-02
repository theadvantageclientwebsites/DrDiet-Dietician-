import APICall from '@/lib/apiCall'
import ENDPOINTS from '@/config/endpoints'
import type {
  ApiResponse,
  DigitalProduct,
  Service,
  Course,
  AdminPatientDetail,
  AdminPatientsPaginatedData,
  AdminPatientsParams,
  AdminPatientUpdatePayload,
  AdminPatientCreatePayload,
  AdminPatientCreateResponse,
  InternsSummary,
  AdminInternDetail,
  AdminInternsPaginatedData,
  AdminInternsParams,
  AdminInternCreatePayload,
  AdminInternCreateResponse,
  AdminInternUpdatePayload,
} from '@/types'

interface RevenueStats {
  consultationIncome: number
  packageSales: number
  digitalProductSales: number
  total: number
  monthly: { month: string; amount: number }[]
  yearly: { year: number; amount: number }[]
}

interface DashboardStats {
  totalPatients: number
  activePatients: number
  totalInterns: number
  totalAppointmentsToday: number
  pendingAppointments: number
  revenue: number
}

export interface DashboardSummary {
  totalPatients: number
  totalDoctors: number
  pendingDoctors: number
  totalInterns: number
}

export { type InternsSummary }

export const adminService = {
  getDashboardStats: () =>
    APICall<ApiResponse<DashboardStats>>('get', null, ENDPOINTS.ADMIN.STATS)
      .then((res) => res.data),

  getDashboardSummary: () =>
    APICall<ApiResponse<DashboardSummary>>('get', null, ENDPOINTS.ADMIN.DASHBOARD_SUMMARY)
      .then((res) => res.data),

  // ─── Patients ──────────────────────────────────────────────────────────────

  getPatients: (params: AdminPatientsParams = {}) =>
    APICall<ApiResponse<AdminPatientsPaginatedData>>(
      'get',
      { page: params.page ?? 1, limit: params.limit ?? 10 },
      ENDPOINTS.ADMIN.PATIENTS_LIST,
    ).then((res) => res.data),

  createPatient: (payload: AdminPatientCreatePayload) =>
    APICall<ApiResponse<AdminPatientCreateResponse>>('post', payload, ENDPOINTS.ADMIN.PATIENTS_LIST)
      .then((res) => res.data),

  getPatientById: (id: string) =>
    APICall<ApiResponse<AdminPatientDetail>>('get', null, ENDPOINTS.ADMIN.PATIENT_BY_ID(id))
      .then((res) => res.data),

  updatePatient: (id: string, payload: AdminPatientUpdatePayload) =>
    APICall<ApiResponse<AdminPatientDetail>>('put', payload, ENDPOINTS.ADMIN.PATIENT_BY_ID(id))
      .then((res) => res.data),

  deletePatient: (id: string) =>
    APICall<ApiResponse<{ message: string }>>('delete', null, ENDPOINTS.ADMIN.PATIENT_BY_ID(id))
      .then((res) => res.data),

  getInternsSummary: () =>
    APICall<ApiResponse<InternsSummary>>('get', null, ENDPOINTS.ADMIN.INTERNS_SUMMARY)
      .then((res) => res.data),

  getInterns: (params: AdminInternsParams = {}) =>
    APICall<ApiResponse<AdminInternsPaginatedData>>(
      'get',
      params,
      ENDPOINTS.ADMIN.INTERNS_LIST,
    ).then((res) => res.data),

  getInternById: (id: string) =>
    APICall<ApiResponse<AdminInternDetail>>('get', null, ENDPOINTS.ADMIN.INTERN_BY_ID(id))
      .then((res) => res.data),

  createIntern: (payload: AdminInternCreatePayload) =>
    APICall<ApiResponse<AdminInternCreateResponse>>('post', payload, ENDPOINTS.ADMIN.INTERNS_LIST)
      .then((res) => res.data),

  updateIntern: (id: string, payload: AdminInternUpdatePayload) =>
    APICall<ApiResponse<AdminInternDetail>>('put', payload, ENDPOINTS.ADMIN.INTERN_BY_ID(id))
      .then((res) => res.data),

  deleteIntern: (id: string) =>
    APICall<ApiResponse<{ message: string }>>('delete', null, ENDPOINTS.ADMIN.INTERN_BY_ID(id))
      .then((res) => res.data),

  getRevenue: (params?: { period?: 'monthly' | 'yearly'; year?: number }) =>
    APICall<ApiResponse<RevenueStats>>('get', params ?? null, ENDPOINTS.ADMIN.REVENUE)
      .then((res) => res.data),

  // ─── Digital Products ──────────────────────────────────────────────────────

  getDigitalProducts: () =>
    APICall<ApiResponse<DigitalProduct[]>>('get', null, ENDPOINTS.ADMIN.DIGITAL_PRODUCTS)
      .then((res) => res.data),

  createDigitalProduct: (formData: FormData) =>
    APICall<ApiResponse<DigitalProduct>>(
      'post',
      formData,
      ENDPOINTS.ADMIN.DIGITAL_PRODUCTS,
      {},
      true,
    ).then((res) => res.data),

  updateDigitalProduct: (id: string, payload: Partial<DigitalProduct>) =>
    APICall<ApiResponse<DigitalProduct>>(
      'patch',
      payload,
      ENDPOINTS.ADMIN.DIGITAL_PRODUCT_BY_ID(id),
    ).then((res) => res.data),

  deleteDigitalProduct: (id: string) =>
    APICall<ApiResponse<null>>('delete', null, ENDPOINTS.ADMIN.DIGITAL_PRODUCT_BY_ID(id))
      .then((res) => res.data),

  // ─── Services (Yoga, Zumba, Blood Test) ───────────────────────────────────

  getServices: () =>
    APICall<ApiResponse<Service[]>>('get', null, ENDPOINTS.ADMIN.SERVICES)
      .then((res) => res.data),

  createService: (payload: Partial<Service>) =>
    APICall<ApiResponse<Service>>('post', payload, ENDPOINTS.ADMIN.SERVICES)
      .then((res) => res.data),

  updateService: (id: string, payload: Partial<Service>) =>
    APICall<ApiResponse<Service>>('patch', payload, ENDPOINTS.ADMIN.SERVICE_BY_ID(id))
      .then((res) => res.data),

  deleteService: (id: string) =>
    APICall<ApiResponse<null>>('delete', null, ENDPOINTS.ADMIN.SERVICE_BY_ID(id))
      .then((res) => res.data),

  // ─── Courses ──────────────────────────────────────────────────────────────

  getCourses: () =>
    APICall<ApiResponse<Course[]>>('get', null, ENDPOINTS.ADMIN.COURSES)
      .then((res) => res.data),

  createCourse: (payload: Partial<Course>) =>
    APICall<ApiResponse<Course>>('post', payload, ENDPOINTS.ADMIN.COURSES)
      .then((res) => res.data),

  updateCourse: (id: string, payload: Partial<Course>) =>
    APICall<ApiResponse<Course>>('patch', payload, ENDPOINTS.ADMIN.COURSE_BY_ID(id))
      .then((res) => res.data),

  deleteCourse: (id: string) =>
    APICall<ApiResponse<null>>('delete', null, ENDPOINTS.ADMIN.COURSE_BY_ID(id))
      .then((res) => res.data),

  issueCertificate: (internId: string, courseId: string) =>
    APICall<ApiResponse<null>>('post', { internId, courseId }, ENDPOINTS.ADMIN.CERTIFICATES)
      .then((res) => res.data),
}
