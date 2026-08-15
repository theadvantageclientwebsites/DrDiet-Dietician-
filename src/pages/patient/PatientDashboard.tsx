import HeroBanner from '@/components/shared/HeroBanner'
import UpcomingAppointmentCard from '@/components/patient/dashboard/UpcomingAppointmentCard'
import QuickActionsGrid from '@/components/patient/dashboard/QuickActionsGrid'
import RecentActivityList from '@/components/patient/dashboard/RecentActivityList'
import ActivePackageCard from '@/components/patient/shared/ActivePackageCard'
import DigitalProductCard from '@/components/patient/library/DigitalProductCard'
import { usePatientDashboard } from '@/hooks/usePatientDashboard'
import { ROUTES } from '@/config/routes'

function SectionHeading({ title, actionLabel, onAction }: {
  title: string; actionLabel?: string; onAction?: () => void
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[17px] font-medium" style={{ color: 'hsl(200 40% 14%)' }}>{title}</h2>
      {actionLabel && onAction && (
        <button onClick={onAction} className="text-[13px] font-semibold rounded px-1 hover:opacity-70" style={{ color: '#1a6b7a' }}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default function PatientDashboard() {
  const {
    upcomingAppointment,
    patient,
    nextCheckup,
    vitals,
    quickActions,
    dashboard,
    isLoading,
    hasAppointmentError,
    handleViewAllAppointments,
    handleActionClick,
    handleJoinCall,
    handleViewAllActivity,
    handleViewLibrary,
  } = usePatientDashboard()

  const heroHeadline = patient?.fullName
    ? `Welcome back, ${patient.fullName.split(' ')[0]}.`
    : 'Your health, our clinical priority.'

  const heroPills = [
    { label: 'Vitals',       value: vitals?.vitalsStatus ?? '—' },
    { label: 'Next checkup', value: nextCheckup?.label ?? '—'   },
  ]

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-40 py-6 sm:py-8">
      <div className="w-full flex flex-col gap-7">
        <HeroBanner
          badge="CLINICAL PORTAL"
          headline={heroHeadline}
          body="Manage consultations, view blood diagnostics, and access doctor-approved diet protocols."
          pills={heroPills}
        />

        <section>
          <SectionHeading title="Your package" />
          <ActivePackageCard subscription={dashboard?.activePackage ?? null} />
        </section>

        {dashboard?.dietPlan && (
          <section>
            <SectionHeading title="Diet plan" actionLabel="Open" onAction={() => handleActionClick(ROUTES.PATIENT.DIET_PLANS)} />
            <div className={`rounded-2xl border p-4 ${dashboard.dietPlan.visible ? 'bg-white border-[#e6edf0]' : 'bg-[#fffbeb] border-[#fde68a]'}`}>
              <p className="text-[14px] font-semibold text-[#1a3c4d] m-0">{dashboard.dietPlan.message}</p>
              {!dashboard.dietPlan.visible && (
                <p className="text-[12px] text-[#92400e] mt-1 mb-0">Meals appear after admin approval.</p>
              )}
            </div>
          </section>
        )}

        <section>
          <SectionHeading title="Upcoming Appointment" actionLabel="View All" onAction={handleViewAllAppointments} />
          <UpcomingAppointmentCard
            appointment={upcomingAppointment}
            isLoading={isLoading}
            hasError={hasAppointmentError}
            onJoinCall={handleJoinCall}
            onBookNow={() => handleActionClick('/patient/book-appointment')}
          />
        </section>

        {!!dashboard?.library?.items?.length && (
          <section>
            <SectionHeading
              title="My library"
              actionLabel="View all"
              onAction={handleViewLibrary}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dashboard.library.items.slice(0, 4).map(item => (
                <DigitalProductCard key={item.id} product={item} compact />
              ))}
            </div>
          </section>
        )}

        <section>
          <SectionHeading title="Quick Actions" />
          <QuickActionsGrid actions={quickActions} onAction={handleActionClick} />
        </section>

        <section>
          <SectionHeading title="Recent Activity" actionLabel="View All" onAction={handleViewAllActivity} />
          <RecentActivityList />
        </section>
      </div>
    </div>
  )
}
