/**
 * navigation.ts — Nav item definitions per role.
 * Icon names map to lucide-react exports.
 */
import type { UserRole } from '@/types'
import { ROUTES } from './routes'

export interface NavItem {
  label: string
  path: string
  icon: string          // lucide-react icon name
  badge?: number | null // optional notification count
}

// ─── Patient Nav ─────────────────────────────────────────────────────────────
const patientNav: NavItem[] = [
  { label: 'Home',          path: ROUTES.PATIENT.DASHBOARD,        icon: 'LayoutDashboard' },
  { label: 'Services',      path: ROUTES.PATIENT.SERVICES,         icon: 'Briefcase' },
  { label: 'Diet Plans',    path: ROUTES.PATIENT.DIET_PLANS,       icon: 'UtensilsCrossed' },
  { label: 'Activity',      path: ROUTES.PATIENT.APPOINTMENTS,     icon: 'Activity' },
  { label: 'Profile',       path: ROUTES.PATIENT.PROFILE,          icon: 'UserCircle' },
]

// ─── Doctor Nav ──────────────────────────────────────────────────────────────
const doctorNav: NavItem[] = [
  { label: 'Dashboard',     path: ROUTES.DOCTOR.DASHBOARD,         icon: 'LayoutDashboard' },
  { label: 'Appointments',  path: ROUTES.DOCTOR.APPOINTMENTS,      icon: 'CalendarDays' },
  { label: 'Patients',      path: ROUTES.DOCTOR.PATIENTS,          icon: 'Users' },
  { label: 'Blood Reports', path: ROUTES.DOCTOR.BLOOD_REPORTS,     icon: 'FileText' },
  { label: 'Services',      path: ROUTES.DOCTOR.SERVICES,          icon: 'Stethoscope' },
  { label: 'Chat',          path: ROUTES.DOCTOR.CHAT,              icon: 'MessageSquare' },
]

// ─── Intern Nav ───────────────────────────────────────────────────────────────
const internNav: NavItem[] = [
  { label: 'Dashboard',     path: ROUTES.INTERN.DASHBOARD,         icon: 'LayoutDashboard' },
  { label: 'Courses',       path: ROUTES.INTERN.COURSES,           icon: 'BookOpen' },
  { label: 'Classes',       path: ROUTES.INTERN.CLASSES,           icon: 'Video' },
  { label: 'Certifications',path: ROUTES.INTERN.CERTIFICATIONS,    icon: 'Award' },
  { label: 'Ebooks',        path: ROUTES.INTERN.EBOOKS,            icon: 'Library' },
  { label: 'Profile',       path: ROUTES.INTERN.PROFILE,           icon: 'UserCircle' },
]

// ─── Admin Nav ────────────────────────────────────────────────────────────────
const adminNav: NavItem[] = [
  { label: 'Dashboard',      path: ROUTES.ADMIN.DASHBOARD,         icon: 'LayoutDashboard' },
  { label: 'Revenue',        path: ROUTES.ADMIN.REVENUE,           icon: 'TrendingUp' },
  { label: 'Patients',       path: ROUTES.ADMIN.PATIENTS,          icon: 'Users' },
  { label: 'Interns',        path: ROUTES.ADMIN.INTERNS,           icon: 'GraduationCap' },
  { label: 'Appointments',   path: ROUTES.ADMIN.APPOINTMENTS,      icon: 'CalendarDays' },
  { label: 'Packages',       path: ROUTES.ADMIN.PACKAGES,          icon: 'Package' },
  { label: 'Digital Prods',  path: ROUTES.ADMIN.DIGITAL_PRODUCTS,  icon: 'FileText' },
  { label: 'Courses',        path: ROUTES.ADMIN.COURSES,           icon: 'BookOpen' },
  { label: 'Services',       path: ROUTES.ADMIN.SERVICES,          icon: 'Briefcase' },
  { label: 'Blog',           path: ROUTES.ADMIN.BLOG,              icon: 'Newspaper' },
]

export const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  PATIENT: patientNav,
  DOCTOR:  doctorNav,
  INTERN:  internNav,
  ADMIN:   adminNav,
}

/** Items shown in the mobile bottom tab bar (max 5) */
export const BOTTOM_TAB_ITEMS: Record<UserRole, NavItem[]> = {
  PATIENT: patientNav.slice(0, 5),
  DOCTOR:  doctorNav.slice(0, 5),
  INTERN:  internNav.slice(0, 5),
  ADMIN:   adminNav.slice(0, 5),
}
