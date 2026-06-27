/**
 * usePatientDashboard.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Aggregates all data and derived state needed by the Patient Dashboard page.
 * Keeps the page component presentation-only — zero data logic in the view.
 */

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppointments } from '@/hooks/useAppointments'
import { usePatientProfile } from '@/hooks/usePatient'
import { ROUTES } from '@/config/routes'
import type { Appointment } from '@/types'

// ─── Quick-Action definition ──────────────────────────────────────────────────
export interface QuickAction {
  id: string
  icon: string          // lucide-react icon name
  label: string
  description?: string  // shown on featured card
  route: string
  variant: 'featured' | 'icon' | 'row'
  meta?: string         // small meta line (e.g. "Last updated: Yesterday")
}

// ─── Static quick actions config ─────────────────────────────────────────────
const QUICK_ACTIONS: QuickAction[] = [
  {
    id:          'book-appointment',
    icon:        'CalendarPlus',
    label:       'Book Appointment',
    description: 'Schedule your next medical checkup or lab consult.',
    route:       ROUTES.PATIENT.BOOK_APPOINTMENT,
    variant:     'featured',
  },
  {
    id:      'packages',
    icon:    'Gift',
    label:   'Packages',
    description: 'Care programs',
    route:   ROUTES.PATIENT.PACKAGES,
    variant: 'icon',
  },
  {
    id:      'services',
    icon:    'Briefcase',
    label:   'Services',
    description: 'Clinical therapies',
    route:   ROUTES.PATIENT.SERVICES,
    variant: 'icon',
  },
  {
    id:      'diet-plans',
    icon:    'Apple',
    label:   'Diet Plans',
    description: 'Nutritional roadmaps',
    route:   ROUTES.PATIENT.DIET_PLANS,
    variant: 'row',
  },
  {
    id:      'support-chat',
    icon:    'MessageSquare',
    label:   'Support Chat',
    description: 'Instant specialist',
    route:   ROUTES.PATIENT.CHAT,
    variant: 'icon',
  },
  {
    id:      'ebook-store',
    icon:    'BookOpen',
    label:   'Ebook Store',
    description: 'Clinical guides',
    route:   ROUTES.PATIENT.DIGITAL_PRODUCTS,
    variant: 'icon',
  },
  {
    id:      'blood-reports',
    icon:    'FileText',
    label:   'Blood Reports',
    description: 'Lab diagnostics',
    meta:    'Last updated: Yesterday',
    route:   ROUTES.PATIENT.BLOOD_REPORTS,
    variant: 'row',
  },
]

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function usePatientDashboard() {
  const navigate = useNavigate()

  // ── Upcoming appointments (confirmed/pending, limit 1 for the card) ─────────
  const {
    data: appointmentsData,
    isLoading: appointmentsLoading,
    isError: appointmentsError,
  } = useAppointments({ status: 'confirmed', limit: 1 })

  // ── Patient profile (used for personalisation when needed) ─────────────────
  const {
    data: profileData,
    isLoading: profileLoading,
  } = usePatientProfile()

  // ── Derived: next upcoming appointment ────────────────────────────────────
  const upcomingAppointment: Appointment | null = useMemo(() => {
    const list = appointmentsData?.data ?? []
    return list.length > 0 ? list[0] : null
  }, [appointmentsData])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleViewAllAppointments = () => navigate(ROUTES.PATIENT.APPOINTMENTS)

  const handleActionClick = (route: string) => navigate(route)

  const handleJoinCall = (appointmentId: string) => {
    navigate(`/patient/video-call/${appointmentId}`)
  }

  const handleViewAllActivity = () => navigate(ROUTES.PATIENT.NOTIFICATIONS)

  return {
    upcomingAppointment,
    profile:        profileData?.data ?? null,
    quickActions:   QUICK_ACTIONS,

    isLoadingAppointment:   appointmentsLoading,
    isLoadingProfile:       profileLoading,
    hasAppointmentError:    appointmentsError,

    handleViewAllAppointments,
    handleActionClick,
    handleJoinCall,
    handleViewAllActivity,
  }
}
