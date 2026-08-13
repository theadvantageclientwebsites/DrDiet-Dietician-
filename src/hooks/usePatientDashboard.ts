/**
 * usePatientDashboard.ts — uses GET /patient/dashboard
 */

import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { usePatientPortalDashboard } from '@/hooks/usePatientPortal'

export interface QuickAction {
  id: string
  icon: string
  label: string
  description?: string
  route: string
  variant: 'featured' | 'icon' | 'row'
  meta?: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'book-appointment', icon: 'CalendarPlus', label: 'Book Appointment',
    description: 'Schedule your next medical checkup or lab consult.',
    route: ROUTES.PATIENT.BOOK_APPOINTMENT, variant: 'featured',
  },
  { id: 'packages', icon: 'Gift', label: 'Packages', description: 'Care programs', route: ROUTES.PATIENT.PACKAGES, variant: 'icon' },
  { id: 'services', icon: 'Briefcase', label: 'Services', description: 'Clinical therapies', route: ROUTES.PATIENT.SERVICES, variant: 'icon' },
  { id: 'diet-plans', icon: 'Apple', label: 'Diet Plans', description: 'Nutritional roadmaps', route: ROUTES.PATIENT.DIET_PLANS, variant: 'row' },
  { id: 'support-chat', icon: 'MessageSquare', label: 'Support Chat', description: 'Instant specialist', route: ROUTES.PATIENT.CHAT, variant: 'icon' },
  { id: 'ebook-store', icon: 'BookOpen', label: 'Ebook Store', description: 'Clinical guides', route: ROUTES.PATIENT.DIGITAL_PRODUCTS, variant: 'icon' },
  { id: 'blood-reports', icon: 'FileText', label: 'Blood Reports', description: 'Lab diagnostics', route: ROUTES.PATIENT.BLOOD_REPORTS, variant: 'row' },
]

export function usePatientDashboard() {
  const navigate = useNavigate()
  const { dashboard, isLoading, isError, refetch } = usePatientPortalDashboard()

  return {
    dashboard,
    upcomingAppointment: dashboard?.upcomingAppointment ?? null,
    patient:             dashboard?.patient ?? null,
    nextCheckup:         dashboard?.nextCheckup ?? null,
    vitals:              dashboard?.patient?.vitals ?? null,
    quickActions:        QUICK_ACTIONS,
    isLoading,
    hasAppointmentError: isError,
    handleViewAllAppointments: () => navigate(ROUTES.PATIENT.APPOINTMENTS),
    handleActionClick:         (route: string) => navigate(route),
    handleJoinCall:            (id: string) => navigate(`/patient/video-call/${id}`),
    handleViewAllActivity:     () => navigate(ROUTES.PATIENT.NOTIFICATIONS),
    refetch,
  }
}
