import HeroBanner from '@/components/shared/HeroBanner'

const HERO_PILLS = [
  { label: 'Vitals', value: 'Normal' },
  { label: 'Next checkup', value: '2 days' },
]

export default function PatientDashboard() {
  return (
    <div className='px-2 pt-6 lg:px-32 lg:pt-12'  style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Hero Banner */}
      <HeroBanner
        badge="CLINICAL PORTAL"
        headline="Your health, our clinical priority."
        body="Manage consultations, view verified blood diagnostics, and access personalized, doctor-approved diet protocols."
        pills={HERO_PILLS}
      />

    </div>
  )
}
