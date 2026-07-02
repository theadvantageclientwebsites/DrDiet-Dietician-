// ─── Roles ────────────────────────────────────────────────────────────────────
// Backend returns uppercase roles — keep them uppercase throughout the app
export type UserRole = 'DOCTOR' | 'PATIENT' | 'INTERN' | 'ADMIN'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string
  fullName: string
  email: string
  role: UserRole
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  avatar?: string
}

export interface LoginPayload {
  email: string
  password: string
}

/** Shape returned by POST /auth/login → data field */
export interface LoginResponseData {
  token: string
  user: AuthUser
}

/** Shape returned by POST /auth/register/patient → data field */
export interface PatientRegisterResponseData {
  id: string
  fullName: string
  email: string
  role: UserRole
  accountStatus: string
  registrationStatus: string
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
  patientProfile: {
    id: string
    userId: string
    gender: string
    location: string
    phoneNumber: string
    whatsappNumber: string
    age: number
    heightCm: number
    weightKg: number
    bloodGroup: string
    socialHandle: string | null
    isDefencePersonnel: boolean
    createdAt: string
    updatedAt: string
  }
}

/** Shape returned by POST /auth/register/intern → data field */
export interface InternRegisterResponseData {
  id: string
  fullName: string
  email: string
  role: UserRole
  accountStatus: string
  registrationStatus: string
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
  internProfile: {
    id: string
    userId: string
    phoneNumber: string
    universityName: string
    specialization: string
    semester: number
    year: number
    isApproved: boolean
    createdAt: string
    updatedAt: string
  }
}

// ─── API wrapper shape ────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// ─── Patient Registration payload (matches API exactly) ───────────────────────
export type GenderEnum = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
export type BloodGroupEnum =
  | 'A_POS' | 'A_NEG'
  | 'B_POS' | 'B_NEG'
  | 'AB_POS' | 'AB_NEG'
  | 'O_POS' | 'O_NEG'

export interface PatientRegistration {
  fullName: string
  email: string
  password: string
  gender: GenderEnum
  location: string
  phoneNumber: string
  whatsappNumber: string
  age: number
  heightCm: number
  weightKg: number
  bloodGroup: BloodGroupEnum
  socialHandle?: string
  isDefencePersonnel: boolean
}

// ─── Intern Registration payload (matches API exactly) ───────────────────────
export interface InternRegistration {
  fullName: string
  email: string
  password: string
  phoneNumber: string
  universityName: string
  specialization: string
  semester: number
  year: number
}

// ─── Patient (profile shape) ──────────────────────────────────────────────────
export interface Patient {
  id: string
  fullName: string
  phoneNumber: string
  whatsappNumber: string
  email: string
  gender: GenderEnum
  location: string
  age: number
  heightCm: number
  weightKg: number
  bloodGroup: BloodGroupEnum
  socialHandle?: string
  isDefencePersonnel: boolean
  avatar?: string
  createdAt: string
  updatedAt: string
}

// ─── Intern (profile shape) ───────────────────────────────────────────────────
export interface Intern {
  id: string
  fullName: string
  phoneNumber: string
  email: string
  universityName: string
  specialization: string
  semester: number
  year: number
  avatar?: string
  isApproved?: boolean
  createdAt: string
}

// ─── Appointment ──────────────────────────────────────────────────────────────
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled'

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  date: string
  slot: string
  status: AppointmentStatus
  packageId?: string
  notes?: string
  videoRoomUrl?: string
  createdAt: string
  updatedAt: string
}

export interface BookAppointmentPayload {
  packageId?: string
  date: string
  slot: string
  requirements?: string
}

// ─── Package ──────────────────────────────────────────────────────────────────
export type PackageCategory = 'thyroid' | 'diabetes' | 'weight_loss' | 'general' | 'other'
export type PackageDuration = '1_month' | '3_months' | '6_months'

export interface Package {
  id: string
  name: string
  category: PackageCategory
  duration: PackageDuration
  price: number
  description: string
  features: string[]
  isActive: boolean
}

// ─── Diet Plan ────────────────────────────────────────────────────────────────
export interface DietPlan {
  id: string
  patientId: string
  title: string
  content: string
  fileUrl?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

// ─── Blood Report ─────────────────────────────────────────────────────────────
export interface BloodReport {
  id: string
  patientId: string
  fileUrl: string
  fileName: string
  uploadedAt: string
  doctorNotes?: string
  reviewedAt?: string
}

// ─── Service ──────────────────────────────────────────────────────────────────
export type ServiceType = 'yoga' | 'zumba' | 'blood_test'

export interface Service {
  id: string
  type: ServiceType
  name: string
  description: string
  price: number
  slots: string[]
  isActive: boolean
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: UserRole
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
}

export interface ChatThread {
  id: string
  participantId: string
  participantName: string
  participantAvatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

// ─── Digital Product ──────────────────────────────────────────────────────────
export interface DigitalProduct {
  id: string
  title: string
  description: string
  price: number
  fileUrl: string
  thumbnailUrl?: string
  category: 'ebook' | 'diet_guide' | 'recipe_book'
  isActive: boolean
  createdAt: string
}

// ─── Course (Intern) ──────────────────────────────────────────────────────────
export interface Course {
  id: string
  title: string
  description: string
  thumbnailUrl?: string
  eligibility: {
    minSemester: number
    minYear: number
    courses: string[]
  }
  videos: CourseVideo[]
  hasTest: boolean
  isActive: boolean
}

export interface CourseVideo {
  id: string
  title: string
  cloudinaryUrl: string
  duration: number  // seconds
  order: number
}

export interface Certificate {
  id: string
  internId: string
  courseId: string
  courseName: string
  issuedAt: string
  fileUrl: string
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'appointment' | 'diet_plan' | 'chat' | 'payment' | 'system'
  isRead: boolean
  createdAt: string
}

// ─── Payment ──────────────────────────────────────────────────────────────────
export interface RazorpayOrder {
  orderId: string
  amount: number
  currency: string
  receipt: string
}

export interface PaymentVerification {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}

// ─── Paginated response ───────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Admin: Patient list item (GET /admin/patients) ───────────────────────────
export interface AdminPatientProfile {
  phoneNumber:        string | null
  whatsappNumber:     string | null
  gender:             GenderEnum | null
  age:                number | null
  bloodGroup:         BloodGroupEnum | null
  location:           string | null
  heightCm:           number | null
  weightKg:           number | null
  socialHandle:       string | null
  isDefencePersonnel: boolean
}

export interface AdminPatient {
  id:              string
  fullName:        string
  email:           string
  accountStatus:   'ACTIVE' | 'INACTIVE' | 'PENDING'
  profilePhotoUrl: string | null
  createdAt:       string
  patientProfile:  AdminPatientProfile | null
}

export interface AdminPatientDetail extends AdminPatient {
  updatedAt: string
}

export interface AdminPatientsPagination {
  page:       number
  limit:      number
  totalItems: number
  totalPages: number
}

export interface AdminPatientsPaginatedData {
  items:      AdminPatient[]
  pagination: AdminPatientsPagination
}

export interface AdminPatientsParams {
  page?:   number
  limit?:  number
  search?: string
  status?: string
}

export interface AdminPatientUpdatePayload {
  fullName?:       string
  email?:          string
  accountStatus?:  'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL'
  profilePhotoUrl?: string
  patientProfile?: {
    gender?:             GenderEnum
    location?:           string
    phoneNumber?:        string
    whatsappNumber?:     string
    age?:                number
    heightCm?:           number
    weightKg?:           number
    bloodGroup?:         BloodGroupEnum
    socialHandle?:       string
    isDefencePersonnel?: boolean
  }
}

export interface InternsSummary {
  totalInterns:     number
  approved:         number
  pending:          number
  completedCourses: number
}

export interface AdminInternProfile {
  phoneNumber:     string | null
  universityName:  string | null
  specialization:  string | null
  semester:        number | null
  year:            number | null
  isApproved:      boolean
}

export interface AdminIntern {
  id:              string
  fullName:        string
  email:           string
  accountStatus:   'ACTIVE' | 'INACTIVE' | 'PENDING'
  profilePhotoUrl: string | null
  createdAt:       string
  internProfile:   AdminInternProfile | null
}

export interface AdminInternDetail extends AdminIntern {
  updatedAt: string
}

export interface AdminInternsPagination {
  page:       number
  limit:      number
  totalItems: number
  totalPages: number
}

export interface AdminInternsFilters {
  search?:        string | null
  status?:        string | null
  isApproved?:    string | null
  university?:    string | null
  specialization?: string | null
  semester?:      string | null
  year?:          string | null
  minSemester?:   string | null
  maxSemester?:   string | null
}

export interface AdminInternsPaginatedData {
  items:      AdminIntern[]
  pagination: AdminInternsPagination
  filters:    AdminInternsFilters
}

export interface AdminInternsParams {
  page?:          number
  limit?:         number
  search?:        string
  status?:        string
  isApproved?:    string
  university?:    string
  specialization?: string
  semester?:      number
  year?:          number
  minSemester?:   number
  maxSemester?:   number
}

export interface AdminInternCreatePayload {
  fullName:        string
  email:           string
  phoneNumber?:    string
  universityName?: string
  specialization?: string
  semester?:       number
  year?:           number
}

export interface AdminInternCreateResponse extends AdminInternDetail {
  generatedPassword: string
}

export interface AdminInternUpdatePayload {
  fullName?:      string
  email?:         string
  accountStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL'
  internProfile?: {
    phoneNumber?:     string
    universityName?:  string
    specialization?:  string
    semester?:        number
    year?:            number
    isApproved?:      boolean
  }
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
