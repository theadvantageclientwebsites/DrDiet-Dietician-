// ─── Roles ───────────────────────────────────────────────────────────────────
export type UserRole = 'doctor' | 'patient' | 'intern' | 'admin'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
  refreshToken: string
}

// ─── Patient ──────────────────────────────────────────────────────────────────
export interface PatientRegistration {
  name: string
  phone: string
  whatsappNo: string
  email: string
  password: string
  gender: 'male' | 'female' | 'other'
  area: string
  age: number
  height: number   // cm
  weight: number   // kg
  bloodGroup: string
  instagramOrLinkedinId?: string
  defencePersonnel: boolean
}

export interface Patient {
  id: string
  name: string
  phone: string
  whatsappNo: string
  email: string
  gender: 'male' | 'female' | 'other'
  area: string
  age: number
  height: number
  weight: number
  bloodGroup: string
  instagramOrLinkedinId?: string
  defencePersonnel: boolean
  avatar?: string
  createdAt: string
  updatedAt: string
}

// ─── Intern ───────────────────────────────────────────────────────────────────
export interface InternRegistration {
  name: string
  phone: string
  email: string
  password: string
  university: string
  semester: number
  year: number
  course: string
}

export interface Intern {
  id: string
  name: string
  phone: string
  email: string
  university: string
  semester: number
  year: number
  course: string
  avatar?: string
  isEligible?: boolean
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

// ─── API Shared ───────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
