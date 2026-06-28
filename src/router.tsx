import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

import RootLayout from '@/components/layout/RootLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import GuestRoute from '@/components/shared/GuestRoute'
import PageLoader from '@/components/shared/PageLoader'
import NotFound from '@/components/shared/NotFound'

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/public/HomePage'))

// Auth
const SignInPage = lazy(() => import('@/pages/auth/SignInPage'))
const SignUpPage = lazy(() => import('@/pages/auth/SignUpPage'))
const PatientRegisterPage = lazy(() => import('@/pages/auth/PatientRegisterPage'))
const InternRegisterPage = lazy(() => import('@/pages/auth/InternRegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))

// Doctor
const DoctorDashboard = lazy(() => import('@/pages/doctor/DoctorDashboard'))
const DoctorAppointmentsPage = lazy(() => import('@/pages/doctor/AppointmentsPage'))
const DoctorPatientsPage = lazy(() => import('@/pages/doctor/PatientsPage'))
const PatientDetailPage = lazy(() => import('@/pages/doctor/PatientDetailPage'))
const DoctorChatPage = lazy(() => import('@/pages/doctor/ChatPage'))
const DoctorVideoCallPage = lazy(() => import('@/pages/doctor/VideoCallPage'))
const DoctorBloodReportsPage = lazy(() => import('@/pages/doctor/BloodReportsPage'))
const DoctorServicesPage = lazy(() => import('@/pages/doctor/ServicesPage'))
const DoctorNotificationsPage = lazy(() => import('@/pages/doctor/NotificationsPage'))

// Patient
const PatientDashboard = lazy(() => import('@/pages/patient/PatientDashboard'))
const BookAppointmentPage = lazy(() => import('@/pages/patient/BookAppointmentPage'))
const PatientAppointmentsPage = lazy(() => import('@/pages/patient/AppointmentsPage'))
const PackagesPage = lazy(() => import('@/pages/patient/PackagesPage'))
const PatientServicesPage = lazy(() => import('@/pages/patient/ServicesPage'))
const DietPlansPage = lazy(() => import('@/pages/patient/DietPlansPage'))
const PatientBloodReportsPage = lazy(() => import('@/pages/patient/BloodReportsPage'))
const DigitalProductsPage = lazy(() => import('@/pages/patient/DigitalProductsPage'))
const PatientChatPage = lazy(() => import('@/pages/patient/ChatPage'))
const PatientVideoCallPage = lazy(() => import('@/pages/patient/VideoCallPage'))
const PatientNotificationsPage = lazy(() => import('@/pages/patient/NotificationsPage'))
const PatientProfilePage = lazy(() => import('@/pages/patient/ProfilePage'))

// Intern
const InternDashboard = lazy(() => import('@/pages/intern/InternDashboard'))
const CoursesPage = lazy(() => import('@/pages/intern/CoursesPage'))
const CourseDetailPage = lazy(() => import('@/pages/intern/CourseDetailPage'))
const ClassesPage = lazy(() => import('@/pages/intern/ClassesPage'))
const CertificationsPage = lazy(() => import('@/pages/intern/CertificationsPage'))
const EbooksPage = lazy(() => import('@/pages/intern/EbooksPage'))
const InternProfilePage = lazy(() => import('@/pages/intern/ProfilePage'))

// Admin
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const RevenuePage = lazy(() => import('@/pages/admin/RevenuePage'))
const AdminPatientsPage = lazy(() => import('@/pages/admin/AdminPatientsPage'))
const AdminInternsPage = lazy(() => import('@/pages/admin/AdminInternsPage'))
const AdminAppointmentsPage = lazy(() => import('@/pages/admin/AdminAppointmentsPage'))
const PackagesManagementPage = lazy(() => import('@/pages/admin/PackagesManagementPage'))
const AdminDigitalProductsPage = lazy(() => import('@/pages/admin/DigitalProductsPage'))
const CourseManagementPage = lazy(() => import('@/pages/admin/CourseManagementPage'))
const ServicesManagementPage = lazy(() => import('@/pages/admin/ServicesManagementPage'))
const BlogPage = lazy(() => import('@/pages/admin/BlogPage'))

// Lazy suspense wrapper
const S = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Public
      { index: true, element: <Navigate to={ROUTES.SIGN_IN} replace /> },
      { path: '/home', element: S(HomePage) },

      // Auth (guests only)
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: ROUTES.SIGN_IN,           element: S(SignInPage) },
              { path: ROUTES.SIGN_UP,           element: S(SignUpPage) },
              { path: ROUTES.SIGN_UP_PATIENT,   element: S(PatientRegisterPage) },
              { path: ROUTES.SIGN_UP_INTERN,    element: S(InternRegisterPage) },
              { path: ROUTES.FORGOT_PASSWORD,   element: S(ForgotPasswordPage) },
            ],
          },
        ],
      },

      // Doctor (protected)
      {
        element: <ProtectedRoute allowedRoles={['DOCTOR']} />,
        children: [
          {
            element: <DashboardLayout role="doctor" />,
            children: [
              { path: ROUTES.DOCTOR.ROOT,          element: <Navigate to={ROUTES.DOCTOR.DASHBOARD} replace /> },
              { path: ROUTES.DOCTOR.DASHBOARD,     element: S(DoctorDashboard) },
              { path: ROUTES.DOCTOR.APPOINTMENTS,  element: S(DoctorAppointmentsPage) },
              { path: ROUTES.DOCTOR.PATIENTS,      element: S(DoctorPatientsPage) },
              { path: ROUTES.DOCTOR.PATIENT_DETAIL,element: S(PatientDetailPage) },
              { path: ROUTES.DOCTOR.CHAT,          element: S(DoctorChatPage) },
              { path: ROUTES.DOCTOR.VIDEO_CALL,    element: S(DoctorVideoCallPage) },
              { path: ROUTES.DOCTOR.BLOOD_REPORTS, element: S(DoctorBloodReportsPage) },
              { path: ROUTES.DOCTOR.SERVICES,      element: S(DoctorServicesPage) },
              { path: ROUTES.DOCTOR.NOTIFICATIONS, element: S(DoctorNotificationsPage) },
            ],
          },
        ],
      },

      // Patient (protected)
      {
        element: <ProtectedRoute allowedRoles={['PATIENT']} />,
        children: [
          {
            element: <DashboardLayout role="patient" />,
            children: [
              { path: ROUTES.PATIENT.ROOT,             element: <Navigate to={ROUTES.PATIENT.DASHBOARD} replace /> },
              { path: ROUTES.PATIENT.DASHBOARD,        element: S(PatientDashboard) },
              { path: ROUTES.PATIENT.BOOK_APPOINTMENT, element: S(BookAppointmentPage) },
              { path: ROUTES.PATIENT.APPOINTMENTS,     element: S(PatientAppointmentsPage) },
              { path: ROUTES.PATIENT.PACKAGES,         element: S(PackagesPage) },
              { path: ROUTES.PATIENT.SERVICES,         element: S(PatientServicesPage) },
              { path: ROUTES.PATIENT.DIET_PLANS,       element: S(DietPlansPage) },
              { path: ROUTES.PATIENT.BLOOD_REPORTS,    element: S(PatientBloodReportsPage) },
              { path: ROUTES.PATIENT.DIGITAL_PRODUCTS, element: S(DigitalProductsPage) },
              { path: ROUTES.PATIENT.CHAT,             element: S(PatientChatPage) },
              { path: ROUTES.PATIENT.VIDEO_CALL,       element: S(PatientVideoCallPage) },
              { path: ROUTES.PATIENT.NOTIFICATIONS,    element: S(PatientNotificationsPage) },
              { path: ROUTES.PATIENT.PROFILE,          element: S(PatientProfilePage) },
            ],
          },
        ],
      },

      // Intern (protected)
      {
        element: <ProtectedRoute allowedRoles={['INTERN']} />,
        children: [
          {
            element: <DashboardLayout role="intern" />,
            children: [
              { path: ROUTES.INTERN.ROOT,          element: <Navigate to={ROUTES.INTERN.DASHBOARD} replace /> },
              { path: ROUTES.INTERN.DASHBOARD,     element: S(InternDashboard) },
              { path: ROUTES.INTERN.COURSES,       element: S(CoursesPage) },
              { path: ROUTES.INTERN.COURSE_DETAIL, element: S(CourseDetailPage) },
              { path: ROUTES.INTERN.CLASSES,       element: S(ClassesPage) },
              { path: ROUTES.INTERN.CERTIFICATIONS,element: S(CertificationsPage) },
              { path: ROUTES.INTERN.EBOOKS,        element: S(EbooksPage) },
              { path: ROUTES.INTERN.PROFILE,       element: S(InternProfilePage) },
            ],
          },
        ],
      },

      // Admin (protected)
      {
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
          {
            element: <DashboardLayout role="admin" />,
            children: [
              { path: ROUTES.ADMIN.ROOT,             element: <Navigate to={ROUTES.ADMIN.DASHBOARD} replace /> },
              { path: ROUTES.ADMIN.DASHBOARD,        element: S(AdminDashboard) },
              { path: ROUTES.ADMIN.REVENUE,          element: S(RevenuePage) },
              { path: ROUTES.ADMIN.PATIENTS,         element: S(AdminPatientsPage) },
              { path: ROUTES.ADMIN.INTERNS,          element: S(AdminInternsPage) },
              { path: ROUTES.ADMIN.APPOINTMENTS,     element: S(AdminAppointmentsPage) },
              { path: ROUTES.ADMIN.PACKAGES,         element: S(PackagesManagementPage) },
              { path: ROUTES.ADMIN.DIGITAL_PRODUCTS, element: S(AdminDigitalProductsPage) },
              { path: ROUTES.ADMIN.COURSES,          element: S(CourseManagementPage) },
              { path: ROUTES.ADMIN.SERVICES,         element: S(ServicesManagementPage) },
              { path: ROUTES.ADMIN.BLOG,             element: S(BlogPage) },
            ],
          },
        ],
      },

      // 404
      { path: '*', element: <NotFound /> },
    ],
  },
])
