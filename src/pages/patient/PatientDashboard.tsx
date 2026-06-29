import HeroBanner from '@/components/shared/HeroBanner'
import UpcomingAppointmentCard from '@/components/patient/dashboard/UpcomingAppointmentCard'
import QuickActionsGrid from '@/components/patient/dashboard/QuickActionsGrid'
import RecentActivityList from '@/components/patient/dashboard/RecentActivityList'
import { usePatientDashboard } from '@/hooks/usePatientDashboard'

const HERO_PILLS = [
  { label: 'Vitals',       value: 'Normal' },
  { label: 'Next checkup', value: '2 days' },
]

// ─── Section heading row ──────────────────────────────────────────────────────
interface SectionHeadingProps {
  title:        string
  actionLabel?: string
  onAction?:    () => void
}

function SectionHeading({ title, actionLabel, onAction }: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[17px] font-medium" style={{ color: 'hsl(200 40% 14%)' }}>
        {title}
      </h2>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-[13px] font-semibold rounded px-1 transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2"
          style={{ color: '#1a6b7a' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PatientDashboard() {
  const {
    upcomingAppointment,
    profile,
    quickActions,
    isLoadingAppointment,
    hasAppointmentError,
    handleViewAllAppointments,
    handleActionClick,
    handleJoinCall,
    handleViewAllActivity,
  } = usePatientDashboard()

  const heroHeadline = profile?.fullName
    ? `Welcome back, ${profile.fullName.split(' ')[0]}.`
    : 'Your health, our clinical priority.'

  return (
    /* Outer: full width, centers the inner column */
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-40 py-6 sm:py-8">

      {/* Inner: max-width column, all sections stacked */}
      <div className="w-full flex flex-col gap-7">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <HeroBanner
          badge="CLINICAL PORTAL"
          headline={heroHeadline}
          body="Manage consultations, view blood diagnostics, and access doctor-approved diet protocols."
          pills={HERO_PILLS}
        />

        {/* ── Upcoming Appointment ──────────────────────────────────────── */}
        <section aria-labelledby="section-upcoming">
          <SectionHeading
            title="Upcoming Appointment"
            actionLabel="View All"
            onAction={handleViewAllAppointments}
          />
          <UpcomingAppointmentCard
            appointment={upcomingAppointment}
            isLoading={isLoadingAppointment}
            hasError={hasAppointmentError}
            onJoinCall={handleJoinCall}
            onBookNow={() => handleActionClick('/patient/book-appointment')}
          />
        </section>

        {/* ── Quick Actions ─────────────────────────────────────────────── */}
        <section aria-labelledby="section-quick-actions">
          <SectionHeading title="Quick Actions" />
          <QuickActionsGrid
            actions={quickActions}
            onAction={handleActionClick}
          />
        </section>

        {/* ── Recent Activity ───────────────────────────────────────────── */}
        <section aria-labelledby="section-recent-activity">
          <SectionHeading
            title="Recent Activity"
            actionLabel="View All"
            onAction={handleViewAllActivity}
          />
          <RecentActivityList />
        </section>

      </div>
    </div>
  )
}
