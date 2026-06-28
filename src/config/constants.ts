// ─── API ──────────────────────────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// ─── App ──────────────────────────────────────────────────────────────────────
export const APP_NAME = 'DrDietTherapy'
export const APP_TAGLINE = 'Your Personalized Nutrition Partner'

// ─── Auth storage ─────────────────────────────────────────────────────────────
// Single source of truth — managed entirely by zustand persist in authStore.ts
// Do not add separate TOKEN_KEY / USER_KEY here.

// ─── Appointment Slots ────────────────────────────────────────────────────────
export const APPOINTMENT_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']
export const RESCHEDULE_CUTOFF_HOURS = 2   // minimum hours before slot
export const NOTICE_HOURS = 24             // 24-hour notice rule

// ─── Blood Groups ─────────────────────────────────────────────────────────────
export const BLOOD_GROUPS = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'] as const

/** Human-readable label for display purposes */
export const BLOOD_GROUP_LABELS: Record<string, string> = {
  A_POS: 'A+', A_NEG: 'A-',
  B_POS: 'B+', B_NEG: 'B-',
  AB_POS: 'AB+', AB_NEG: 'AB-',
  O_POS: 'O+', O_NEG: 'O-',
}

// ─── Gender ───────────────────────────────────────────────────────────────────
export const GENDERS = [
  { value: 'MALE',              label: 'Male' },
  { value: 'FEMALE',            label: 'Female' },
  { value: 'OTHER',             label: 'Other' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
]

// ─── Packages ─────────────────────────────────────────────────────────────────
export const PACKAGE_DURATIONS = [
  { value: '1_month', label: '1 Month' },
  { value: '3_months', label: '3 Months' },
  { value: '6_months', label: '6 Months' },
]

export const PACKAGE_CATEGORIES = [
  { value: 'thyroid', label: 'Thyroid' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'general', label: 'General Wellness' },
  { value: 'other', label: 'Other' },
]

// ─── Services ─────────────────────────────────────────────────────────────────
export const SERVICE_TYPES = [
  { value: 'yoga', label: 'Yoga' },
  { value: 'zumba', label: 'Zumba' },
  { value: 'blood_test', label: 'Blood Test' },
]

// ─── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10

// ─── File Upload ──────────────────────────────────────────────────────────────
export const ALLOWED_REPORT_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
export const MAX_FILE_SIZE_MB = 10
