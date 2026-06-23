// ─── Public Routes ────────────────────────────────────────────────────────────
export const ROUTES = {
  // Public
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  SIGN_UP_PATIENT: '/sign-up/patient',
  SIGN_UP_INTERN: '/sign-up/intern',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Doctor
  DOCTOR: {
    ROOT: '/doctor',
    DASHBOARD: '/doctor/dashboard',
    APPOINTMENTS: '/doctor/appointments',
    PATIENTS: '/doctor/patients',
    PATIENT_DETAIL: '/doctor/patients/:id',
    CHAT: '/doctor/chat',
    VIDEO_CALL: '/doctor/video-call/:roomId',
    BLOOD_REPORTS: '/doctor/blood-reports',
    SERVICES: '/doctor/services',
    NOTIFICATIONS: '/doctor/notifications',
  },

  // Patient
  PATIENT: {
    ROOT: '/patient',
    DASHBOARD: '/patient/dashboard',
    BOOK_APPOINTMENT: '/patient/book-appointment',
    APPOINTMENTS: '/patient/appointments',
    PACKAGES: '/patient/packages',
    SERVICES: '/patient/services',
    DIET_PLANS: '/patient/diet-plans',
    BLOOD_REPORTS: '/patient/blood-reports',
    DIGITAL_PRODUCTS: '/patient/digital-products',
    CHAT: '/patient/chat',
    VIDEO_CALL: '/patient/video-call/:roomId',
    NOTIFICATIONS: '/patient/notifications',
    PROFILE: '/patient/profile',
  },

  // Intern
  INTERN: {
    ROOT: '/intern',
    DASHBOARD: '/intern/dashboard',
    COURSES: '/intern/courses',
    COURSE_DETAIL: '/intern/courses/:id',
    CLASSES: '/intern/classes',
    CERTIFICATIONS: '/intern/certifications',
    EBOOKS: '/intern/ebooks',
    PROFILE: '/intern/profile',
  },

  // Admin
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    REVENUE: '/admin/revenue',
    PATIENTS: '/admin/patients',
    INTERNS: '/admin/interns',
    APPOINTMENTS: '/admin/appointments',
    PACKAGES: '/admin/packages',
    DIGITAL_PRODUCTS: '/admin/digital-products',
    COURSES: '/admin/courses',
    SERVICES: '/admin/services',
    BLOG: '/admin/blog',
    NOTIFICATIONS: '/admin/notifications',
  },
} as const
