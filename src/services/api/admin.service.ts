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
  AdminDoctorDetail,
  AdminDoctorsPaginatedData,
  AdminDoctorsParams,
  AdminDoctorCreatePayload,
  AdminDoctorCreateResponse,
  AdminDoctorUpdatePayload,
  DoctorAccountStatus,
  AdminAppointmentsSummary,
  AdminAppointmentsPaginatedData,
  AdminAppointmentsParams,
  AdminAppointmentDetail,
  AdminAppointmentStatus,
  AdminPackage,
  AdminPackagesPaginatedData,
  AdminPackagesParams,
  AdminPackageCreatePayload,
  AdminPackageUpdatePayload,
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

  // ─── Doctors ──────────────────────────────────────────────────────────────

  getDoctors: (params: AdminDoctorsParams = {}) =>
    APICall<ApiResponse<AdminDoctorsPaginatedData>>(
      'get',
      { page: params.page ?? 1, limit: params.limit ?? 10, ...params },
      ENDPOINTS.ADMIN.DOCTORS_LIST,
    ).then((res) => res.data),

  getDoctorById: (id: string) =>
    APICall<ApiResponse<AdminDoctorDetail>>('get', null, ENDPOINTS.ADMIN.DOCTOR_BY_ID(id))
      .then((res) => res.data),

  createDoctor: (payload: AdminDoctorCreatePayload) =>
    APICall<ApiResponse<AdminDoctorCreateResponse>>('post', payload, ENDPOINTS.ADMIN.DOCTORS_LIST)
      .then((res) => res.data),

  updateDoctor: (id: string, payload: AdminDoctorUpdatePayload) =>
    APICall<ApiResponse<AdminDoctorDetail>>('put', payload, ENDPOINTS.ADMIN.DOCTOR_BY_ID(id))
      .then((res) => res.data),

  updateDoctorStatus: (id: string, status: DoctorAccountStatus) =>
    APICall<ApiResponse<AdminDoctorDetail>>('patch', { status }, ENDPOINTS.ADMIN.DOCTOR_STATUS(id))
      .then((res) => res.data),

  approveDoctor: (id: string) =>
    APICall<ApiResponse<AdminDoctorDetail>>('patch', {}, ENDPOINTS.ADMIN.DOCTOR_APPROVE(id))
      .then((res) => res.data),

  deleteDoctor: (id: string) =>
    APICall<ApiResponse<{ message: string }>>('delete', null, ENDPOINTS.ADMIN.DOCTOR_BY_ID(id))
      .then((res) => res.data),

  // ─── Admin: Appointments ───────────────────────────────────────────────────

  getAppointmentsSummary: () =>
    APICall<ApiResponse<AdminAppointmentsSummary>>('get', null, ENDPOINTS.ADMIN.APPOINTMENTS_SUMMARY)
      .then((res) => res.data),

  getAppointments: (params: AdminAppointmentsParams = {}) => {
    // Strip empty-string values so they don't get sent as query params
    const clean: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(params)) {
      if (v !== '' && v !== undefined && v !== null) clean[k] = v
    }
    return APICall<ApiResponse<AdminAppointmentsPaginatedData>>(
      'get',
      Object.keys(clean).length ? clean : null,
      ENDPOINTS.ADMIN.APPOINTMENTS,
    ).then((res) => res.data)
  },

  getAppointmentById: (id: string) =>
    APICall<ApiResponse<AdminAppointmentDetail>>('get', null, ENDPOINTS.ADMIN.APPOINTMENT_BY_ID(id))
      .then((res) => res.data),

  updateAppointmentStatus: (id: string, status: AdminAppointmentStatus) =>
    APICall<ApiResponse<AdminAppointmentDetail>>(
      'patch',
      { status },
      ENDPOINTS.ADMIN.APPOINTMENT_STATUS(id),
    ).then((res) => res.data),

  deleteAppointment: (id: string) =>
    APICall<ApiResponse<{ message: string }>>('delete', null, ENDPOINTS.ADMIN.APPOINTMENT_BY_ID(id))
      .then((res) => res.data),

  // ─── Admin: Packages ───────────────────────────────────────────────────────

  getAdminPackages: (params: AdminPackagesParams = {}) => {
    const clean: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(params)) {
      if (v !== '' && v !== undefined && v !== null) clean[k] = v
    }
    return APICall<ApiResponse<AdminPackagesPaginatedData>>(
      'get',
      Object.keys(clean).length ? clean : null,
      ENDPOINTS.ADMIN.PACKAGES,
    ).then((res) => res.data)
  },

  getAdminPackageById: (id: string) =>
    APICall<ApiResponse<AdminPackage>>('get', null, ENDPOINTS.ADMIN.PACKAGE_BY_ID(id))
      .then((res) => res.data),

  createAdminPackage: (payload: AdminPackageCreatePayload) =>
    APICall<ApiResponse<AdminPackage>>('post', payload, ENDPOINTS.ADMIN.PACKAGES)
      .then((res) => res.data),

  updateAdminPackage: (id: string, payload: AdminPackageUpdatePayload) =>
    APICall<ApiResponse<AdminPackage>>('put', payload, ENDPOINTS.ADMIN.PACKAGE_BY_ID(id))
      .then((res) => res.data),

  toggleAdminPackageStatus: (id: string, isActive: boolean) =>
    APICall<ApiResponse<AdminPackage>>(
      'patch',
      { isActive },
      ENDPOINTS.ADMIN.PACKAGE_STATUS(id),
    ).then((res) => res.data),

  deleteAdminPackage: (id: string) =>
    APICall<ApiResponse<{ message: string }>>('delete', null, ENDPOINTS.ADMIN.PACKAGE_BY_ID(id))
      .then((res) => res.data),
}
