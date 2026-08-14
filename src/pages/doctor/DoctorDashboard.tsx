/**
 * DoctorDashboard
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays:
 *  • Welcome header with doctor name + approval badge
 *  • 4 stat cards (today's appts, total patients, pending, completed)
 *  • Upcoming appointment card (or empty state)
 *  • Doctor profile summary strip
 *
 * Data: GET /doctor/dashboard via useDoctorDashboard hook
 */

import { useNavigate } from 'react-router-dom'
import {
  Calendar, Users, Clock, CheckCircle,
  Video, MapPin, RefreshCw, AlertTriangle,
  ArrowRight, UserCircle, CalendarCheck, FileText, PhoneCall,
} from 'lucide-react'
import { useDoctorDashboard } from '@/hooks/useDoctorDashboard'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import { ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/authStore'
import { format, parseISO } from 'date-fns'
import { canJoinVideoCall } from '@/lib/appointmentCall'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  try { return format(parseISO(iso), 'MMM d, yyyy · h:mm a') }
  catch { return iso }
}

const fmtDate = formatDate

function initials(name: string | null | undefined) {
  if (!name) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}


// ─── Status badge for appointment ────────────────────────────────────────────
const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PENDING:   { bg: '#fef3c7', color: '#d97706', label: 'Pending'   },
  CONFIRMED: { bg: '#d1fae5', color: '#059669', label: 'Confirmed' },
  COMPLETED: { bg: '#dbeafe', color: '#2563eb', label: 'Completed' },
  CANCELLED: { bg: '#fee2e2', color: '#dc2626', label: 'Cancelled' },
}

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { bg: '#f1f5f9', color: '#64748b', label: status }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 20,
      background: s.bg, color: s.color,
      fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
      {s.label}
    </span>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  accent?: string
  dark?: boolean
  onClick?: () => void
  link?: { label: string; onClick: () => void }
}

function StatCard({ icon, label, value, sub, accent, dark, onClick, link }: StatCardProps) {
  const bg = dark
    ? 'linear-gradient(135deg, #0f3d4a 0%, #1a6b7a 100%)'
    : COLORS.white
  const textColor = dark ? '#fff' : COLORS.navy
  const subColor  = dark ? 'rgba(255,255,255,0.65)' : COLORS.muted
  const iconBg    = dark ? 'rgba(255,255,255,0.15)' : COLORS.brandLight

  return (
    <div
      onClick={onClick}
      style={{
        background:   bg,
        borderRadius: 16,
        padding:      '20px',
        boxShadow:    SHADOW.card,
        border:       dark ? 'none' : `1px solid ${COLORS.divider}`,
        display:      'flex',
        alignItems:   'flex-start',
        gap:          14,
        cursor:       onClick ? 'pointer' : 'default',
        transition:   'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { if (onClick) (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: accent ? `${accent}20` : iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, color: accent ?? COLORS.brand,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: FONT_SIZE.xs, color: subColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: FONT_WEIGHT.medium }}>{label}</p>
        <p style={{ fontSize: '1.6rem', fontWeight: FONT_WEIGHT.bold, color: accent ?? textColor, margin: '4px 0 2px', lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: FONT_SIZE.xs, color: subColor, margin: 0 }}>{sub}</p>}
        {link && (
          <button
            onClick={e => { e.stopPropagation(); link.onClick() }}
            style={{
              background: 'none', border: 'none', padding: 0, marginTop: 6, cursor: 'pointer',
              color: dark ? 'rgba(255,255,255,0.65)' : COLORS.brand,
              fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, textAlign: 'left',
            }}
          >
            {link.label} →
          </button>
        )}
      </div>
    </div>
  )
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 14px', borderRadius: 10,
        background: COLORS.brandLight, color: COLORS.brand,
        border: 'none', cursor: 'pointer',
        fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{
      background:   dark ? 'linear-gradient(135deg,#1e4d5a,#1a5566)' : COLORS.white,
      borderRadius: 16, padding: 20,
      boxShadow: SHADOW.card, border: dark ? 'none' : `1px solid ${COLORS.divider}`,
      minHeight: 92,
    }}>
      <div className="sk" style={{ height: 12, width: '55%', borderRadius: 6, background: dark ? 'rgba(255,255,255,0.15)' : COLORS.divider, marginBottom: 10 }} />
      <div className="sk" style={{ height: 28, width: '40%', borderRadius: 6, background: dark ? 'rgba(255,255,255,0.2)' : '#e6edf0' }} />
    </div>
  )
}

// ─── Error banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px', borderRadius: 12, marginBottom: 20,
      background: '#fff7ed', border: '1px solid #fed7aa', flexWrap: 'wrap',
    }}>
      <AlertTriangle size={16} color="#ea580c" />
      <span style={{ flex: 1, fontSize: FONT_SIZE.sm, color: '#c2410c', minWidth: 200 }}>
        Could not load dashboard data. Check your connection and try again.
      </span>
      <button
        onClick={onRetry}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 12px', borderRadius: 7,
          background: '#ea580c', color: '#fff',
          border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: FONT_WEIGHT.semibold,
        }}
      >
        <RefreshCw size={12} /> Retry
      </button>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function DoctorDashboard() {
  const nav         = useNavigate()
  const { user }    = useAuthStore()
  const { doctor, stats, upcomingAppointment, isLoading, isError, refetch } = useDoctorDashboard()

  const firstName = doctor?.fullName?.split(' ')[0] ?? user?.fullName?.split(' ')[0] ?? 'Doctor'

  return (
    <>
      <style>{`
        @keyframes skPulse { 0%,100%{opacity:1} 50%{opacity:0.45} }

        .dd-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (min-width: 1024px) { .dd-grid { grid-template-columns: repeat(4,1fr); } }

        .dd-lower {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 1024px) { .dd-lower { grid-template-columns: 2fr 1fr; } }

        .dd-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid ${COLORS.divider};
          box-shadow: ${SHADOW.card};
        }
        .dd-card-title {
          font-size: ${FONT_SIZE.base};
          font-weight: ${FONT_WEIGHT.semibold};
          color: ${COLORS.navy};
          margin: 0 0 16px;
        }

        .dd-quick-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .dd-profile-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 12px;
          background: ${COLORS.inputBg};
          margin-bottom: 16px;
        }
      `}</style>

      <div style={{ padding: '16px', width: '100%' }}>

        {/* ── Error banner ─────────────────────────────────────── */}
        {isError && <ErrorBanner onRetry={refetch} />}

        {/* ── Welcome header ───────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy, margin: 0 }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, Dr. {firstName} 👋
          </h1>
          <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, marginTop: 4 }}>
            Here's an overview of your practice today.
          </p>
        </div>

        {/* ── Stat cards ───────────────────────────────────────── */}
        <div className="dd-grid">
          {isLoading ? (
            <><SkeletonCard dark /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : (
            <>
              <StatCard
                dark
                icon={<Users size={22} strokeWidth={1.8} />}
                label="Total Patients"
                value={stats.totalPatients}
                link={{ label: 'View All Patients', onClick: () => nav(ROUTES.DOCTOR.PATIENTS) }}
              />
              <StatCard
                icon={<Calendar size={20} strokeWidth={1.8} />}
                label="Today's Appointments"
                value={stats.todayAppointments}
                link={{ label: 'View Today', onClick: () => nav(ROUTES.DOCTOR.APPOINTMENTS) }}
              />
              <StatCard
                icon={<Clock size={20} strokeWidth={1.8} />}
                label="Pending Appointments"
                value={stats.pendingAppointments}
                accent={stats.pendingAppointments > 0 ? '#f59e0b' : undefined}
                link={{ label: 'Review Now', onClick: () => nav(ROUTES.DOCTOR.APPOINTMENTS) }}
              />
              <StatCard
                icon={<CheckCircle size={20} strokeWidth={1.8} />}
                label="Completed Sessions"
                value={stats.completedAppointments}
                accent={COLORS.green}
                link={{ label: 'View History', onClick: () => nav(ROUTES.DOCTOR.APPOINTMENTS) }}
              />
            </>
          )}
        </div>

        {/* ── Lower section ────────────────────────────────────── */}
        <div className="dd-lower">

          {/* Left: Quick actions + doctor profile strip */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Quick actions */}
            <div className="dd-card">
              <p className="dd-card-title">Quick Actions</p>
              <div className="dd-quick-row">
                <QuickAction icon={<CalendarCheck size={20} strokeWidth={1.8} />} label="All Appointments" onClick={() => nav(ROUTES.DOCTOR.APPOINTMENTS)} />
                <QuickAction icon={<Users size={20} strokeWidth={1.8} />} label="My Patients" onClick={() => nav(ROUTES.DOCTOR.PATIENTS)} />
                <QuickAction icon={<FileText size={20} strokeWidth={1.8} />} label="Blood Reports" onClick={() => nav(ROUTES.DOCTOR.BLOOD_REPORTS)} />
                <QuickAction icon={<UserCircle size={20} strokeWidth={1.8} />} label="My Profile" onClick={() => nav(ROUTES.DOCTOR.DASHBOARD)} />
              </div>
            </div>

            {/* Doctor profile strip */}
            {!isLoading && doctor && (
              <div className="dd-card">
                <p className="dd-card-title">Your Profile</p>
                <div className="dd-profile-row">
                  {/* Avatar */}
                  <div style={{
                    width: 48, height: 48, minWidth: 48, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${COLORS.sidebarBg}, #1a5566)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 16, fontWeight: FONT_WEIGHT.bold,
                  }}>
                    {doctor.profilePhotoUrl
                      ? <img src={doctor.profilePhotoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : initials(doctor.fullName)
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, margin: 0 }}>{doctor.fullName}</p>
                    <p style={{ fontSize: FONT_SIZE.xs, color: COLORS.muted, margin: '2px 0 0' }}>{doctor.email}</p>
                  </div>
                  {doctor.doctorProfile?.isApproved && (
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '11px',
                      fontWeight: FONT_WEIGHT.semibold, background: '#d1fae5', color: '#065f46', whiteSpace: 'nowrap' }}>
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* Profile details grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                  {[
                    { label: 'Specialization', value: doctor.doctorProfile?.specialization },
                    { label: 'Qualification',  value: doctor.doctorProfile?.qualification  },
                    { label: 'Experience',     value: doctor.doctorProfile?.yearsOfExperience != null ? `${doctor.doctorProfile.yearsOfExperience} yrs` : null },
                    { label: 'Hospital',       value: doctor.doctorProfile?.hospitalName   },
                    { label: 'Phone',          value: doctor.doctorProfile?.phoneNumber    },
                    { label: 'License',        value: doctor.doctorProfile?.licenseNumber  },
                  ].map(row => row.value ? (
                    <div key={row.label}>
                      <p style={{ fontSize: '10px', color: COLORS.muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{row.label}</p>
                      <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.navy, margin: '2px 0 0', fontWeight: FONT_WEIGHT.medium }}>{row.value}</p>
                    </div>
                  ) : null)}
                </div>

                {doctor.doctorProfile?.clinicAddress && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 12,
                    padding: '8px 12px', borderRadius: 8, background: COLORS.inputBg }}>
                    <MapPin size={13} color={COLORS.brand} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: FONT_SIZE.xs, color: COLORS.body }}>{doctor.doctorProfile.clinicAddress}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Upcoming appointment */}
          <div className="dd-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p className="dd-card-title" style={{ margin: 0 }}>Next Appointment</p>
              <button
                onClick={() => nav(ROUTES.DOCTOR.APPOINTMENTS)}
                style={{ background: 'none', border: 'none', cursor: 'pointer',
                  color: COLORS.brand, fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold,
                  display: 'flex', alignItems: 'center', gap: 4 }}
              >
                View All <ArrowRight size={13} />
              </button>
            </div>

            {isLoading ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1,2,3].map(i => <div key={i} style={{ height: 16, borderRadius: 6, background: COLORS.divider,
                  animation: 'skPulse 1.5s ease-in-out infinite' }} />)}
              </div>
            ) : upcomingAppointment ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Patient header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 48, height: 48, minWidth: 48, borderRadius: '50%',
                    background: COLORS.brandLight, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: COLORS.brand, fontSize: 15, fontWeight: FONT_WEIGHT.bold,
                  }}>
                    {upcomingAppointment.patient?.profilePhotoUrl
                      ? <img src={upcomingAppointment.patient.profilePhotoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : initials(upcomingAppointment.patient?.fullName)
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, margin: 0 }}>
                      {upcomingAppointment.patient?.fullName ?? 'Patient'}
                    </p>
                    <p style={{ fontSize: FONT_SIZE.xs, color: COLORS.muted, margin: '2px 0 0' }}>
                      {fmtDate(upcomingAppointment.dateTime)}
                    </p>
                  </div>
                  <StatusPill status={upcomingAppointment.status} />
                </div>

                {/* Details grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', padding: '12px', borderRadius: 10, background: COLORS.inputBg }}>
                  {[
                    { label: 'Type',       value: upcomingAppointment.type === 'ONLINE' ? '🖥 Online' : '🏥 In-Person' },
                    { label: 'Phone',      value: upcomingAppointment.patient?.patientProfile?.phoneNumber },
                    { label: 'Age',        value: upcomingAppointment.patient?.patientProfile?.age != null ? `${upcomingAppointment.patient?.patientProfile?.age} yrs` : null },
                    { label: 'Blood Grp',  value: upcomingAppointment.patient?.patientProfile?.bloodGroup?.replace('_', ' ') },
                  ].map(row => row.value ? (
                    <div key={row.label}>
                      <p style={{ fontSize: '10px', color: COLORS.muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{row.label}</p>
                      <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.navy, margin: '2px 0 0', fontWeight: FONT_WEIGHT.medium }}>{row.value}</p>
                    </div>
                  ) : null)}
                </div>

                {/* Notes */}
                {upcomingAppointment.notes && (
                  <div style={{ padding: '10px 12px', borderRadius: 8, background: COLORS.brandLight, borderLeft: `3px solid ${COLORS.brand}` }}>
                    <p style={{ fontSize: '10px', color: COLORS.brand, margin: '0 0 3px', fontWeight: FONT_WEIGHT.semibold, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Notes</p>
                    <p style={{ fontSize: FONT_SIZE.xs, color: COLORS.body, margin: 0, lineHeight: 1.5 }}>{upcomingAppointment.notes}</p>
                  </div>
                )}

                {/* CTA buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  {canJoinVideoCall({
                    dateTime: upcomingAppointment.dateTime,
                    status: upcomingAppointment.status,
                    type: upcomingAppointment.type,
                  }) && (
                    <button
                      onClick={() => nav(ROUTES.DOCTOR.VIDEO_CALL.replace(':roomId', upcomingAppointment.id))}
                      style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '10px 0', borderRadius: 10, background: COLORS.brand, color: '#fff',
                      border: 'none', cursor: 'pointer', fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
                    }}>
                      <Video size={15} /> Start Video Call
                    </button>
                  )}
                  {upcomingAppointment.type === 'IN_PERSON' && upcomingAppointment.status === 'CONFIRMED' && (
                    <button style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '10px 0', borderRadius: 10, background: COLORS.brand, color: '#fff',
                      border: 'none', cursor: 'pointer', fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
                    }}>
                      <PhoneCall size={15} /> Call Patient
                    </button>
                  )}
                  <button
                    onClick={() => nav(ROUTES.DOCTOR.APPOINTMENTS)}
                    style={{
                      flex: upcomingAppointment.status === 'PENDING' ? 1 : undefined,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '10px 16px', borderRadius: 10,
                      background: COLORS.brandLight, color: COLORS.brand,
                      border: 'none', cursor: 'pointer', fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
                    }}>
                    View Details
                  </button>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 10, padding: '24px 0', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: COLORS.brandLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.brand }}>
                  <Calendar size={26} strokeWidth={1.5} />
                </div>
                <p style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, margin: 0 }}>No Upcoming Appointments</p>
                <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, margin: 0, maxWidth: 220, lineHeight: 1.5 }}>
                  Your schedule is clear. New appointments will appear here when patients book.
                </p>
                <button
                  onClick={() => nav(ROUTES.DOCTOR.APPOINTMENTS)}
                  style={{
                    marginTop: 4, display: 'flex', alignItems: 'center', gap: 5,
                    padding: '8px 16px', borderRadius: 8, background: COLORS.brand,
                    color: '#fff', border: 'none', cursor: 'pointer',
                    fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
                  }}>
                  View All Appointments <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
