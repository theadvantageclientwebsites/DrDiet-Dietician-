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
export type PackageDuration = '3_months' | '6_months' | '12_months'

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
export type DigitalProductStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED'

export interface DigitalProduct {
  id: string
  title: string
  description: string
  price: number
  fileUrl?: string
  previewUrl?: string | null
  thumbnailUrl?: string
  /** Free-form category string: 'Thyroid', 'Diabetes', 'Weight Loss', 'General', etc. */
  category: string
  status: DigitalProductStatus
  author?: string
  pageCount?: number
  language?: string
  isFree: boolean
  totalSales: number
  createdAt: string
  updatedAt: string
}

export interface DigitalProductCreatePayload {
  title: string
  category: string
  status?: DigitalProductStatus
  price?: number
  description?: string
  fileUrl?: string
  previewUrl?: string
  thumbnailUrl?: string
  author?: string
  pageCount?: number
  language?: string
  isFree?: boolean
}

export interface DigitalProductUpdatePayload {
  title?: string
  category?: string
  status?: DigitalProductStatus
  price?: number
  description?: string
  fileUrl?: string
  previewUrl?: string
  thumbnailUrl?: string
  author?: string
  pageCount?: number
  language?: string
  isFree?: boolean
}

export interface DigitalProductsPaginatedData {
  items: DigitalProduct[]
  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
  filters: {
    search: string | null
    category: string | null
    status: string | null
    isFree: boolean | null
    language: string | null
    minPrice: number | null
    maxPrice: number | null
  }
}

export interface DigitalProductUploadFileResponse {
  fileUrl: string
  previewUrl?: string | null
  originalName: string
  size: number
}

export interface DigitalProductUploadThumbnailResponse {
  thumbnailUrl: string
  originalName: string
  size: number
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

export interface AdminPatientCreatePayload {
  fullName:            string
  email:               string
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

export interface AdminPatientCreateResponse extends AdminPatientDetail {
  generatedPassword: string
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

// ─── Admin: Doctor types ───────────────────────────────────────────────────────
export type DoctorAccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL'

export interface AdminDoctorProfile {
  phoneNumber:       string | null
  specialization:    string | null
  qualification:     string | null
  licenseNumber:     string | null
  yearsOfExperience: number | null
  hospitalName:      string | null
  clinicAddress:     string | null
  isApproved:        boolean
}

export interface AdminDoctor {
  id:              string
  fullName:        string
  email:           string
  accountStatus:   DoctorAccountStatus
  profilePhotoUrl: string | null
  createdAt:       string
  doctorProfile:   AdminDoctorProfile | null
}

export interface AdminDoctorDetail extends AdminDoctor {
  updatedAt: string
}

export interface AdminDoctorsPagination {
  page:       number
  limit:      number
  totalItems: number
  totalPages: number
}

export interface AdminDoctorsFilters {
  search?:         string | null
  status?:         string | null
  isApproved?:     string | null
  specialization?: string | null
  hospital?:       string | null
  minExperience?:  string | null
  maxExperience?:  string | null
}

export interface AdminDoctorsPaginatedData {
  items:      AdminDoctor[]
  pagination: AdminDoctorsPagination
  filters?:   AdminDoctorsFilters
}

export interface AdminDoctorsParams {
  page?:           number
  limit?:          number
  search?:         string
  status?:         string
  isApproved?:     string
  specialization?: string
  hospital?:       string
  minExperience?:  number
  maxExperience?:  number
}

export interface AdminDoctorCreatePayload {
  fullName:           string
  email:              string
  phoneNumber?:       string
  specialization?:    string
  qualification?:     string
  licenseNumber?:     string
  yearsOfExperience?: number
  hospitalName?:      string
  clinicAddress?:     string
}

export interface AdminDoctorCreateResponse extends AdminDoctorDetail {
  generatedPassword: string
}

export interface AdminDoctorUpdatePayload {
  fullName?:       string
  email?:          string
  accountStatus?:  DoctorAccountStatus
  profilePhotoUrl?: string
  doctorProfile?: {
    phoneNumber?:       string
    specialization?:    string
    qualification?:     string
    licenseNumber?:     string
    yearsOfExperience?: number
    hospitalName?:      string
    clinicAddress?:     string
    isApproved?:        boolean
  }
}

// ─── Admin: Appointments ──────────────────────────────────────────────────────

export type AdminAppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
export type AdminAppointmentType   = 'ONLINE'  | 'IN_PERSON'

export interface AdminAppointmentPatientProfile {
  phoneNumber:  string | null
  gender?:      string | null
  age?:         number | null
  bloodGroup?:  string | null
  location?:    string | null
}

export interface AdminAppointmentDoctorProfile {
  phoneNumber:    string | null
  specialization: string | null
  qualification?: string | null
  hospitalName?:  string | null
}

export interface AdminAppointmentPatient {
  id:              string
  fullName:        string
  email:           string
  profilePhotoUrl: string | null
  patientProfile:  AdminAppointmentPatientProfile | null
}

export interface AdminAppointmentDoctor {
  id:              string
  fullName:        string
  email:           string
  profilePhotoUrl: string | null
  doctorProfile:   AdminAppointmentDoctorProfile | null
}

/** Shape returned in the paginated list */
export interface AdminAppointment {
  id:        string
  dateTime:  string
  type:      AdminAppointmentType
  status:    AdminAppointmentStatus
  notes:     string | null
  createdAt: string
  patient:   AdminAppointmentPatient | null
  doctor:    AdminAppointmentDoctor  | null
}

/** Shape returned by GET /admin/appointments/:id */
export interface AdminAppointmentDetail extends AdminAppointment {
  updatedAt: string
}

export interface AdminAppointmentsSummary {
  total:     number
  today:     number
  pending:   number
  confirmed: number
  completed: number
  cancelled: number
}

export interface AdminAppointmentsPagination {
  page:       number
  limit:      number
  totalItems: number
  totalPages: number
}

export interface AdminAppointmentsFilters {
  search:    string | null
  status:    string | null
  type:      string | null
  doctorId:  string | null
  patientId: string | null
  fromDate:  string | null
  toDate:    string | null
  today:     boolean | null
}

export interface AdminAppointmentsPaginatedData {
  items:      AdminAppointment[]
  pagination: AdminAppointmentsPagination
  filters:    AdminAppointmentsFilters
}

export interface AdminAppointmentsParams {
  page?:      number
  limit?:     number
  search?:    string
  status?:    AdminAppointmentStatus | ''
  type?:      AdminAppointmentType   | ''
  doctorId?:  string
  patientId?: string
  fromDate?:  string
  toDate?:    string
  today?:     boolean
}

// ─── Admin: Packages ──────────────────────────────────────────────────────────

/** Digital products bundled free with a 12-month package (no full fileUrl). */
export interface PackageFreebiePreview {
  id:            string
  title:         string
  category:      string
  thumbnailUrl:  string | null
  previewUrl:    string | null
  author:        string | null
  price:         number
  isFree?:       boolean
}

/** Category values used in the API (sent/received as plain strings) */
export type AdminPackageCategory = 'Thyroid' | 'Diabetes' | 'Weight Loss' | 'General' | string

export interface AdminPackage {
  id:            string
  name:          string
  category:      AdminPackageCategory
  description:   string | null
  price3Months:  number
  price6Months:  number
  price12Months: number
  price1Month?:  number
  features:      string[]
  isActive:      boolean
  createdAt:     string
  updatedAt:     string
  freebies?:     PackageFreebiePreview[]
}

export interface AdminPackagesPagination {
  page:       number
  limit:      number
  totalItems: number
  totalPages: number
}

export interface AdminPackagesFilters {
  search:   string | null
  category: string | null
  isActive: string | null
}

export interface AdminPackagesPaginatedData {
  items:      AdminPackage[]
  pagination: AdminPackagesPagination
  filters:    AdminPackagesFilters
}

export interface AdminPackagesParams {
  page?:     number
  limit?:    number
  search?:   string
  category?: string
  isActive?: boolean
}

export interface AdminPackageCreatePayload {
  name:          string
  category:      AdminPackageCategory
  description?:  string
  price3Months:  number
  price6Months:  number
  price12Months: number
  features?:          string[]
  isActive?:          boolean
  freebieProductIds?: string[]
}

export interface AdminPackageUpdatePayload {
  name?:              string
  category?:          AdminPackageCategory
  description?:       string
  price3Months?:      number
  price6Months?:      number
  price12Months?:     number
  features?:          string[]
  isActive?:          boolean
  freebieProductIds?: string[]
}

// ─── Admin: Revenue ───────────────────────────────────────────────────────────

export type OrderStatus   = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type OrderItemType = 'PACKAGE' | 'DIGITAL_PRODUCT'
export type OrderDuration = 'ONE_MONTH' | 'THREE_MONTHS' | 'SIX_MONTHS' | 'TWELVE_MONTHS' | null

export interface RevenueOrderPatient {
  id:              string
  fullName:        string | null
  email:           string | null
  profilePhotoUrl: string | null
}

/** Shape used in recentTransactions from /admin/revenue/summary */
export interface RecentTransaction {
  id:       string
  itemType: OrderItemType
  itemName: string | null
  amount:   number
  duration: OrderDuration
  paidAt:   string | null
  patient:  RevenueOrderPatient | null
}

export interface RevenueSummaryStats {
  totalRevenue: number
  thisMonth:    number
  thisWeek:     number
  totalOrders:  number
}

export interface RevenueCategoryBreakdown {
  revenue:    number
  percentage: number
}

export interface RevenueBreakdown {
  packages:        RevenueCategoryBreakdown
  digitalProducts: RevenueCategoryBreakdown
}

export interface RevenueSummaryData {
  summary:            RevenueSummaryStats
  breakdown:          RevenueBreakdown
  recentTransactions: RecentTransaction[]
}

/** Full paginated order item from /admin/revenue/orders */
export interface RevenueOrder {
  id:                string
  itemType:          OrderItemType
  itemName:          string | null
  amount:            number
  currency:          string | null
  duration:          OrderDuration
  status:            OrderStatus
  razorpayOrderId:   string | null
  razorpayPaymentId: string | null
  paidAt:            string | null
  createdAt:         string
  patient:           RevenueOrderPatient | null
}

export interface RevenueOrdersPagination {
  page:       number
  limit:      number
  totalItems: number
  totalPages: number
}

export interface RevenueOrdersPaginatedData {
  items:      RevenueOrder[]
  pagination: RevenueOrdersPagination
}

export interface RevenueOrdersParams {
  page?:      number
  limit?:     number
  status?:    OrderStatus | ''
  itemType?:  OrderItemType | ''
  fromDate?:  string
  toDate?:    string
}

// ─── Doctor ───────────────────────────────────────────────────────────────────

export type DoctorAppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
export type DoctorAppointmentType   = 'ONLINE'  | 'IN_PERSON'

export interface DoctorProfile {
  phoneNumber:       string | null
  specialization:    string | null
  qualification:     string | null
  licenseNumber:     string | null
  yearsOfExperience: number | null
  hospitalName:      string | null
  clinicAddress:     string | null
  isApproved:        boolean
}

export interface DoctorUser {
  id:              string
  fullName:        string
  email:           string
  profilePhotoUrl: string | null
  lastLoginAt:     string | null
  isEmailVerified?: boolean
  createdAt?:      string
  updatedAt?:      string
  doctorProfile:   DoctorProfile | null
}

export interface DoctorStats {
  todayAppointments:    number
  totalPatients:        number
  pendingAppointments:  number
  completedAppointments:number
}

export interface DoctorAppointmentPatientProfile {
  phoneNumber:       string | null
  age:               number | null
  gender:            GenderEnum | null
  bloodGroup:        BloodGroupEnum | null
  location?:         string | null
  heightCm?:         number | null
  weightKg?:         number | null
  whatsappNumber?:   string | null
  socialHandle?:     string | null
  isDefencePersonnel?:boolean
}

export interface DoctorAppointmentPatient {
  id:              string
  fullName:        string
  email?:          string
  profilePhotoUrl: string | null
  patientProfile:  DoctorAppointmentPatientProfile | null
}

export interface DoctorAppointment {
  id:        string
  dateTime:  string
  type:      DoctorAppointmentType
  status:    DoctorAppointmentStatus
  notes:     string | null
  createdAt: string
  updatedAt?: string
  patient:   DoctorAppointmentPatient | null
}

export interface DoctorAppointmentDetail extends DoctorAppointment {
  updatedAt: string
  patient: DoctorAppointmentPatient & {
    email: string
    patientProfile: NonNullable<DoctorAppointmentPatient['patientProfile']>
  }
}

export interface DoctorDashboardData {
  doctor:              DoctorUser
  stats:               DoctorStats
  upcomingAppointment: DoctorAppointment | null
}

// Doctor profile update payload
export interface DoctorProfileUpdatePayload {
  fullName?:        string
  profilePhotoUrl?: string
  doctorProfile?: {
    phoneNumber?:       string
    specialization?:    string
    qualification?:     string
    yearsOfExperience?: number
    hospitalName?:      string
    clinicAddress?:     string
  }
}

// Doctor appointments list
export interface DoctorAppointmentsParams {
  status?:   DoctorAppointmentStatus | ''
  type?:     DoctorAppointmentType   | ''
  upcoming?: boolean
  today?:    boolean
  search?:   string
  page?:     number
  limit?:    number
}

export interface DoctorAppointmentsPagination {
  page:       number
  limit:      number
  totalItems: number
  totalPages: number
}

export interface DoctorAppointmentsPaginatedData {
  items:      DoctorAppointment[]
  pagination: DoctorAppointmentsPagination
}

export interface DoctorAppointmentStatusPayload {
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  notes?: string
}

/** PATCH /doctor/appointments/:id — reschedule / edit (at least one field required) */
export interface DoctorAppointmentUpdatePayload {
  dateTime?: string
  type?:     DoctorAppointmentType
  notes?:    string
}

// Doctor patients
export interface DoctorPatientListItem {
  id:              string
  fullName:        string
  email:           string
  profilePhotoUrl: string | null
  patientProfile:  DoctorAppointmentPatientProfile | null
  lastAppointment: {
    id:       string
    dateTime: string
    status:   DoctorAppointmentStatus
    type:     DoctorAppointmentType
  } | null
  packageSubscription?: DoctorPatientPackageSubscription | null
  dietPlan?: DoctorPatientDietPlanSummary | null
}

export interface DoctorPatientsPaginatedData {
  items:      DoctorPatientListItem[]
  pagination: DoctorAppointmentsPagination
}

export interface DoctorPatientsParams {
  search?: string
  page?:   number
  limit?:  number
}

export interface DoctorPatientAppointmentHistoryItem {
  id:       string
  dateTime: string
  type:     DoctorAppointmentType
  status:   DoctorAppointmentStatus
  notes:    string | null
}

export interface DoctorPatientDetail {
  id:              string
  fullName:        string
  email:           string
  profilePhotoUrl: string | null
  createdAt:       string
  patientProfile:  DoctorAppointmentPatientProfile | null
  appointmentHistory: DoctorPatientAppointmentHistoryItem[]
  packageSubscription?: DoctorPatientPackageSubscription | null
  dietPlan?: DoctorPatientDietPlanSummary | null
}

// Blood reports
export interface DoctorBloodReport {
  id:          string
  title:       string
  fileUrl:     string
  notes:       string | null
  uploadedAt:  string
  updatedAt:   string
  patient:     {
    id:              string
    fullName:        string
    email?:          string
    profilePhotoUrl: string | null
    patientProfile?: DoctorAppointmentPatientProfile | null
  }
}

export interface DoctorBloodReportDetail extends DoctorBloodReport {
  patient: DoctorBloodReport['patient'] & {
    email:          string
    patientProfile: {
      age:         number | null
      gender:      GenderEnum | null
      bloodGroup:  BloodGroupEnum | null
      phoneNumber: string | null
    } | null
  }
}

export interface DoctorBloodReportCreatePayload {
  patientId: string
  title:     string
  fileUrl:   string
  notes?:    string
}

export interface DoctorBloodReportUpdatePayload {
  title?:   string
  notes?:   string
  fileUrl?: string
}

export interface DoctorBloodReportsPaginatedData {
  items:      DoctorBloodReport[]
  pagination: DoctorAppointmentsPagination
}

export interface DoctorBloodReportsParams {
  patientId?: string
  search?:    string
  page?:      number
  limit?:     number
}

export interface UploadBloodReportResponse {
  fileUrl:      string
  originalName: string
  size:         number
}

export interface UploadProfilePhotoResponse {
  url: string
}

// ─── Patient Portal ───────────────────────────────────────────────────────────

export type PatientAppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
export type PatientAppointmentType   = 'ONLINE'  | 'IN_PERSON'
export type PatientPackageDuration   = 'THREE_MONTHS' | 'SIX_MONTHS' | 'TWELVE_MONTHS'
export type PatientOrderItemType     = 'PACKAGE' | 'DIGITAL_PRODUCT'
export type PatientOrderStatus       = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type PackageSubscriptionStatus = 'PENDING_ASSIGNMENT' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED'

export interface PatientPortalDoctorProfile {
  specialization:    string | null
  qualification?:    string | null
  hospitalName:      string | null
  clinicAddress?:    string | null
  phoneNumber:       string | null
  yearsOfExperience?: number | null
}

export interface PatientPortalDoctor {
  id:              string
  fullName:        string
  email?:          string
  profilePhotoUrl: string | null
  doctorProfile:   PatientPortalDoctorProfile | null
}

export interface PatientAppointmentRescheduleInfo {
  rescheduledByDoctor: boolean
  rescheduledAt:       string
  previousDateTime:    string
  message:             string
}

export interface PatientPortalAppointment {
  id:        string
  dateTime:  string
  type:      PatientAppointmentType
  status:    PatientAppointmentStatus
  notes:     string | null
  createdAt: string
  updatedAt?: string
  /** Set when doctor changed the appointment time */
  rescheduledByDoctor?: boolean
  previousDateTime?:   string | null
  rescheduledAt?:      string | null
  rescheduleInfo?:     PatientAppointmentRescheduleInfo | null
  doctor:    PatientPortalDoctor
}

export interface PatientBookAppointmentPayload {
  doctorId: string
  dateTime: string
  type?:    PatientAppointmentType
  notes?:   string
}

export interface PatientAppointmentsParams {
  page?:     number
  limit?:    number
  status?:   PatientAppointmentStatus | ''
  type?:     PatientAppointmentType | ''
  upcoming?: boolean
  past?:     boolean
}

export interface PatientPortalPagination {
  page:       number
  limit:      number
  totalItems: number
  totalPages: number
}

export interface PatientAppointmentsPaginatedData {
  items:      PatientPortalAppointment[]
  pagination: PatientPortalPagination
}

export interface PatientDoctorsParams {
  search?:          string
  specialization?:  string
}

export interface PatientPortalVitals {
  gender:       GenderEnum | null
  age:          number | null
  heightCm:     number | null
  weightKg:     number | null
  bloodGroup:   BloodGroupEnum | null
  location:     string | null
  bmi:          number | null
  bmiStatus:    string | null
  vitalsStatus: string | null
}

export interface PatientDashboardPatient {
  id:              string
  fullName:        string
  email:           string
  profilePhotoUrl: string | null
  memberSince:     string
  vitals:          PatientPortalVitals | null
}

export interface PatientDashboardData {
  patient:              PatientDashboardPatient
  upcomingAppointment:  PatientPortalAppointment | null
  nextCheckup:          { days: number | null; label: string | null } | null
  stats:                { totalAppointments: number }
  quickActions:         { availablePackages: number; availableDigitalProducts: number }
  dietPlan:             PatientDietPlanView | null
  recentActivity:       unknown[]
  activePackage:        PatientPackageSubscription | null
  library?:             PatientLibraryPaginatedData
}

export interface PatientPortalProfileData {
  id:              string
  fullName:        string
  email:           string
  profilePhotoUrl: string | null
  isEmailVerified: boolean
  lastLoginAt:     string | null
  createdAt:       string
  patientProfile: {
    gender:             GenderEnum | null
    location:           string | null
    phoneNumber:        string | null
    whatsappNumber:     string | null
    age:                number | null
    heightCm:           number | null
    weightKg:           number | null
    bloodGroup:         BloodGroupEnum | null
    socialHandle:       string | null
    isDefencePersonnel: boolean
    bmi?:               number | null
    bmiStatus?:         string | null
  } | null
}

export interface PatientPortalProfileUpdatePayload {
  fullName?: string
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

export interface PatientPortalPackage {
  id:            string
  name:          string
  category:      string
  description:   string | null
  price3Months:  number
  price6Months:  number
  price12Months: number
  price1Month?:  number
  features:      string[]
  isActive:      boolean
  createdAt:     string
  freebies?:     PackageFreebiePreview[]
}

export type DigitalProductAccessType = 'PURCHASED' | 'PACKAGE_FREEBIE' | 'FREE' | null

export interface PatientPortalDigitalProduct {
  id:           string
  title:        string
  category:     string
  price:        number
  description:  string | null
  thumbnailUrl: string | null
  previewUrl:   string | null
  fileUrl:      string | null
  hasAccess:    boolean
  accessType:   DigitalProductAccessType
  author:       string | null
  pageCount:    number | null
  language:     string | null
  isFree:       boolean
  totalSales:   number
  createdAt:    string
}

export interface PatientDigitalProductsParams {
  page?:     number
  limit?:    number
  search?:   string
  category?: string
  isFree?:   boolean
  language?: string
  minPrice?: number
  maxPrice?: number
}

export interface PatientDigitalProductsPaginatedData {
  items:      PatientPortalDigitalProduct[]
  pagination: PatientPortalPagination
}

export interface PatientLibraryParams {
  page?:  number
  limit?: number
}

export interface PatientLibraryPaginatedData {
  items:      PatientPortalDigitalProduct[]
  pagination: PatientPortalPagination
}

export interface PatientPortalBloodReport {
  id:         string
  patientId:  string
  doctorId:   string
  title:      string
  fileUrl:    string
  notes:      string | null
  uploadedAt: string
  updatedAt:  string
  doctor:     PatientPortalDoctor
}

export interface PatientBloodReportsPaginatedData {
  items:      PatientPortalBloodReport[]
  pagination: PatientPortalPagination
}

export interface PatientCreateOrderPayload {
  itemType:  PatientOrderItemType
  itemId:    string
  duration?: PatientPackageDuration
}

export interface PatientRazorpayOrderData {
  orderId:   string
  amount:    number
  currency:  string
  keyId:     string
  itemName:  string
  dbOrderId: string
}

export interface PatientPaymentVerifyPayload {
  razorpayOrderId:   string
  razorpayPaymentId: string
  razorpaySignature: string
}

export interface PatientOrder {
  id:                string
  itemType:          PatientOrderItemType
  itemId:            string
  itemName:          string
  amount:            number
  currency:          string
  duration:          string | null
  status:            PatientOrderStatus
  razorpayOrderId:   string | null
  razorpayPaymentId: string | null
  paidAt:            string | null
  createdAt:         string
}

export interface PatientOrdersPaginatedData {
  items:      PatientOrder[]
  pagination: PatientPortalPagination
}

export interface PatientPackageSummary {
  id:       string
  name:     string
  category: string
  features?: string[]
}

export interface PatientPackageSubscription {
  id:                         string
  status:                     PackageSubscriptionStatus
  duration:                   PatientPackageDuration | string
  meetingsPerMonth:           number
  meetingsUsedThisMonth?:     number
  meetingsRemainingThisMonth?: number
  startsAt:                   string
  endsAt:                     string
  assignedAt?:                string | null
  package:                    PatientPackageSummary | null
  doctor:                     PatientPortalDoctor | null
}

export interface PatientDummyCheckoutPayload {
  itemType:  PatientOrderItemType
  itemId:    string
  duration?: PatientPackageDuration
}

export interface PatientDummyCheckoutData {
  dummy:        boolean
  orderId:      string
  itemType:     PatientOrderItemType
  itemName:     string
  amount:       number
  currency:     string
  paidAt:       string
  subscription?: PatientPackageSubscription | null
}

export interface PatientSubscriptionsParams {
  page?:   number
  limit?:  number
  status?: PackageSubscriptionStatus | ''
}

export interface PatientSubscriptionsPaginatedData {
  items:      PatientPackageSubscription[]
  pagination: PatientPortalPagination
}

export interface DoctorPatientPackageSubscription {
  id:       string
  status:   PackageSubscriptionStatus
  duration: string
  endsAt:   string
  startsAt?: string
  package:  PatientPackageSummary | null
}

export interface AdminSubscriptionPatient {
  id:              string
  fullName:        string
  email:           string
  profilePhotoUrl: string | null
}

export interface AdminSubscription {
  id:               string
  status:           PackageSubscriptionStatus
  duration:         string
  meetingsPerMonth: number
  startsAt:         string
  endsAt:           string
  assignedAt?:      string | null
  createdAt?:       string
  patient:          AdminSubscriptionPatient | null
  package:          PatientPackageSummary | null
  doctor:           PatientPortalDoctor | null
}

export interface AdminSubscriptionsParams {
  page?:   number
  limit?:  number
  status?: PackageSubscriptionStatus | ''
  search?: string
}

export interface AdminSubscriptionsPaginatedData {
  items:      AdminSubscription[]
  pagination: PatientPortalPagination
}

export type DietPlanStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'
export type DietPlanDuration = 'SEVEN_DAYS' | 'TEN_DAYS' | 'FIFTEEN_DAYS'
export type PatientDietPlanStatus =
  | 'NO_PACKAGE'
  | 'WAITING_FOR_DOCTOR_ASSIGNMENT'
  | 'IN_PROGRESS'
  | 'PENDING_APPROVAL'
  | 'APPROVED'

export interface DoctorPatientDietPlanSummary {
  plan: { id: string; status: DietPlanStatus } | null
  dueAt: string | null
  isOverdue: boolean
  hoursRemaining: number | null
}

export interface DietPlanRecord {
  id:               string
  duration:         DietPlanDuration | string
  durationDays?:    number | null
  calorieTarget:    number | null
  foodsToEat:       string[]
  foodsToAvoid:     string[]
  breakfast:        string | null
  lunch:            string | null
  dinner:           string | null
  snacks:           string | null
  notes:            string | null
  status:           DietPlanStatus
  submittedAt?:     string | null
  approvedAt?:      string | null
  rejectedAt?:      string | null
  rejectionReason?: string | null
  createdAt?:       string
  updatedAt?:       string
  patientId?:       string
  doctorId?:        string
  dueAt?:           string | null
  isOverdue?:       boolean
  hoursRemaining?:  number | null
  patient?:         { id: string; fullName: string; email?: string; profilePhotoUrl?: string | null } | null
  doctor?:          { id?: string; fullName: string; profilePhotoUrl?: string | null } | null
  subscription?:    { id: string; assignedAt?: string | null; package?: PatientPackageSummary | null } | null
}

export interface DoctorDietPlanPayload {
  patientId:      string
  duration:       DietPlanDuration
  calorieTarget?: number | null
  foodsToEat?:    string[]
  foodsToAvoid?:  string[]
  breakfast?:     string
  lunch?:         string
  dinner?:        string
  snacks?:        string
  notes?:         string
}

export interface DoctorPatientDietPlanData {
  subscriptionId: string
  assignedAt:     string | null
  plan:           DietPlanRecord | null
  dueAt:          string | null
  isOverdue:      boolean
  hoursRemaining: number | null
}

export interface DietPlansPaginatedData {
  items:      DietPlanRecord[]
  pagination: PatientPortalPagination
}

export interface DietPlansListParams {
  page?:      number
  limit?:     number
  status?:    DietPlanStatus | ''
  patientId?: string
  doctorId?:  string
  search?:    string
}

export interface PatientDietPlanView {
  visible:       boolean
  patientStatus: PatientDietPlanStatus | string
  message:       string
  plan:          DietPlanRecord | null
}
