/**
 * endpoints.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for every API endpoint in the application.
 * Import `ENDPOINTS` wherever you need a path — never hardcode strings.
 *
 * Convention:
 *  • Static paths   → plain string
 *  • Dynamic paths  → arrow function that accepts the required param(s)
 */

const ENDPOINTS = {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN:              '/auth/login',
    REGISTER_PATIENT:   '/auth/register/patient',
    REGISTER_INTERN:    '/auth/register/intern',
    LOGOUT:             '/auth/logout',
    FORGOT_PASSWORD:    '/auth/forgot-password',
    RESET_PASSWORD:     '/auth/reset-password',
    REFRESH_TOKEN:      '/auth/refresh',
  },

  // ─── Patients ──────────────────────────────────────────────────────────────
  PATIENTS: {
    LIST:             '/patients',
    PROFILE:          '/patients/profile',
    BY_ID:            (id: string) => `/patients/${id}`,
    DIET_PLANS:       '/patients/diet-plans',
    DIET_PLANS_BY_ID: (patientId: string) => `/patients/${patientId}/diet-plans`,
    BLOOD_REPORTS:       '/patients/blood-reports',
    BLOOD_REPORTS_BY_ID: (patientId: string) => `/patients/${patientId}/blood-reports`,
  },

  // ─── Blood Reports ─────────────────────────────────────────────────────────
  BLOOD_REPORTS: {
    ADD_NOTES: (reportId: string) => `/blood-reports/${reportId}/notes`,
  },

  // ─── Appointments ──────────────────────────────────────────────────────────
  APPOINTMENTS: {
    LIST:           '/appointments',
    SLOTS:          '/appointments/slots',
    BY_ID:          (id: string) => `/appointments/${id}`,
    UPDATE_STATUS:  (id: string) => `/appointments/${id}/status`,
    RESCHEDULE:     (id: string) => `/appointments/${id}/reschedule`,
    CANCEL:         (id: string) => `/appointments/${id}/cancel`,
  },

  // ─── Packages ──────────────────────────────────────────────────────────────
  PACKAGES: {
    LIST:   '/packages',
    BY_ID:  (id: string) => `/packages/${id}`,
  },

  // ─── Services ──────────────────────────────────────────────────────────────
  SERVICES: {
    LIST:   '/services',
    BY_ID:  (id: string) => `/services/${id}`,
  },

  // ─── Chat ──────────────────────────────────────────────────────────────────
  CHAT: {
    THREADS:          '/chat/threads',
    MESSAGES:         (threadId: string) => `/chat/threads/${threadId}/messages`,
    SEND:             (threadId: string) => `/chat/threads/${threadId}/messages`,
    MARK_READ:        (threadId: string) => `/chat/threads/${threadId}/read`,
  },

  // ─── Notifications ─────────────────────────────────────────────────────────
  NOTIFICATIONS: {
    LIST:         '/notifications',
    MARK_READ:    (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },

  // ─── Digital Products ──────────────────────────────────────────────────────
  DIGITAL_PRODUCTS: {
    LIST:   '/digital-products',
    BY_ID:  (id: string) => `/digital-products/${id}`,
  },

  // ─── Courses (Intern) ──────────────────────────────────────────────────────
  COURSES: {
    LIST:   '/courses',
    BY_ID:  (id: string) => `/courses/${id}`,
  },

  // ─── Intern ────────────────────────────────────────────────────────────────
  INTERN: {
    PROFILE:          '/intern/profile',
    CERTIFICATIONS:   '/intern/certifications',
    EBOOKS:           '/intern/ebooks',
  },

  // ─── Admin ─────────────────────────────────────────────────────────────────
  ADMIN: {
    STATS:                '/admin/stats',
    REVENUE:              '/admin/revenue',
    DIGITAL_PRODUCTS:     '/admin/digital-products',
    DIGITAL_PRODUCT_BY_ID:(id: string) => `/admin/digital-products/${id}`,
    SERVICES:             '/admin/services',
    SERVICE_BY_ID:        (id: string) => `/admin/services/${id}`,
    COURSES:              '/admin/courses',
    COURSE_BY_ID:         (id: string) => `/admin/courses/${id}`,
    CERTIFICATES:         '/admin/certificates',
    INTERNS:              '/admin/interns',
    PATIENTS:             '/admin/patients',
    APPOINTMENTS:         '/admin/appointments',
    BLOG:                 '/admin/blog',
    BLOG_BY_ID:           (id: string) => `/admin/blog/${id}`,
  },

  // ─── Payments ──────────────────────────────────────────────────────────────
  PAYMENTS: {
    CREATE_ORDER:       '/payments/create-order',
    VERIFY:             '/payments/verify',
  },
} as const

export default ENDPOINTS
