/**
 * PatientDetailPage — Single patient profile + appointment history.
 * Data: GET /doctor/patients/:id
 */
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, AlertTriangle, RefreshCw, Calendar, FileText, Phone, MapPin,
} from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import { ROUTES } from '@/config/routes'
import { BLOOD_GROUP_LABELS } from '@/config/constants'
import { useDoctorPatientDetail } from '@/hooks/useDoctorPatients'
import { format, parseISO } from 'date-fns'

function fmtDateTime(iso: string) {
  try { return format(parseISO(iso), 'MMM d, yyyy · h:mm a') }
  catch { return iso }
}

function getInitials(name: string | null | undefined) {
  if (!name?.trim()) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function genderLabel(g: string | null | undefined) {
  if (!g) return '—'
  const map: Record<string, string> = {
    MALE: 'Male', FEMALE: 'Female', OTHER: 'Other', PREFER_NOT_TO_SAY: 'Undisclosed',
  }
  return map[g] ?? g
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const { patient, isLoading, isError, refetch } = useDoctorPatientDetail(id)

  if (isLoading) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: COLORS.muted }}>
        Loading patient…
      </div>
    )
  }

  if (isError || !patient) {
    return (
      <div style={{ padding: 16, width: '100%' }}>
        <button onClick={() => nav(ROUTES.DOCTOR.PATIENTS)} style={{
          display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
          color: COLORS.brand, cursor: 'pointer', marginBottom: 16, fontWeight: FONT_WEIGHT.semibold,
        }}>
          <ArrowLeft size={16} /> Back to patients
        </button>
        <div style={{
          padding: 24, borderRadius: 12, background: '#fff7ed', border: '1px solid #fed7aa',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <AlertTriangle size={18} color="#ea580c" />
          <span style={{ flex: 1, color: '#c2410c' }}>Could not load patient details.</span>
          <button onClick={() => { void refetch() }} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px',
            borderRadius: 7, background: '#ea580c', color: '#fff', border: 'none', cursor: 'pointer',
          }}>
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      </div>
    )
  }

  const profile = patient.patientProfile

  return (
    <div style={{ padding: 16, width: '100%' }}>
      <button onClick={() => nav(ROUTES.DOCTOR.PATIENTS)} style={{
        display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
        color: COLORS.brand, cursor: 'pointer', marginBottom: 16, fontWeight: FONT_WEIGHT.semibold,
      }}>
        <ArrowLeft size={16} /> Back to patients
      </button>

      {/* Profile card */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: 20,
        border: `1px solid ${COLORS.divider}`, boxShadow: SHADOW.card, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: COLORS.brandLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: COLORS.brand, fontSize: 22, fontWeight: FONT_WEIGHT.bold,
          }}>
            {patient.profilePhotoUrl
              ? <img src={patient.profilePhotoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : getInitials(patient.fullName)}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: FONT_SIZE.xl, color: COLORS.navy }}>{patient.fullName}</h1>
            <p style={{ margin: '4px 0 0', fontSize: FONT_SIZE.sm, color: COLORS.muted }}>{patient.email}</p>
          </div>
          <button
            onClick={() => nav(`${ROUTES.DOCTOR.BLOOD_REPORTS}?patientId=${patient.id}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 10, background: COLORS.brand,
              color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
            }}
          >
            <FileText size={15} /> Blood Reports
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
          {[
            { label: 'Age',        value: profile?.age != null ? `${profile.age} yrs` : null },
            { label: 'Gender',     value: profile?.gender ? genderLabel(profile.gender) : null },
            { label: 'Blood Group', value: profile?.bloodGroup ? (BLOOD_GROUP_LABELS[profile.bloodGroup] ?? profile.bloodGroup) : null },
            { label: 'Phone',      value: profile?.phoneNumber },
            { label: 'WhatsApp',   value: profile?.whatsappNumber },
            { label: 'Location',   value: profile?.location },
            { label: 'Height',     value: profile?.heightCm != null ? `${profile.heightCm} cm` : null },
            { label: 'Weight',     value: profile?.weightKg != null ? `${profile.weightKg} kg` : null },
          ].map(row => row.value ? (
            <div key={row.label}>
              <p style={{ margin: 0, fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{row.label}</p>
              <p style={{ margin: '4px 0 0', fontSize: FONT_SIZE.sm, color: COLORS.navy, fontWeight: FONT_WEIGHT.medium }}>{row.value}</p>
            </div>
          ) : null)}
        </div>

        {profile?.location && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 16,
            padding: '10px 12px', borderRadius: 8, background: COLORS.inputBg,
          }}>
            <MapPin size={14} color={COLORS.brand} style={{ marginTop: 2 }} />
            <span style={{ fontSize: FONT_SIZE.sm, color: COLORS.body }}>{profile.location}</span>
          </div>
        )}

        {profile?.phoneNumber && (
          <a href={`tel:${profile.phoneNumber}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12,
            color: COLORS.brand, fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, textDecoration: 'none',
          }}>
            <Phone size={14} /> Call {profile.phoneNumber}
          </a>
        )}
      </div>

      {patient.packageSubscription && (
        <div style={{
          background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16,
          border: `1px solid ${COLORS.divider}`, boxShadow: SHADOW.card,
        }}>
          <p style={{ margin: 0, fontSize: 10, color: COLORS.muted, textTransform: 'uppercase' }}>Package</p>
          <p style={{ margin: '4px 0 0', fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.md }}>
            {patient.packageSubscription.package?.name ?? 'Care package'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: FONT_SIZE.sm, color: COLORS.body }}>
            {patient.packageSubscription.status} · ends {fmtDateTime(patient.packageSubscription.endsAt)}
          </p>
          {patient.dietPlan?.isOverdue && (
            <p style={{ margin: '8px 0 0', fontSize: FONT_SIZE.sm, color: '#dc2626', fontWeight: FONT_WEIGHT.semibold }}>Diet plan overdue</p>
          )}
          {!patient.dietPlan?.isOverdue && patient.dietPlan?.hoursRemaining != null && (
            <p style={{ margin: '8px 0 0', fontSize: FONT_SIZE.sm, color: '#b45309' }}>Plan due in {patient.dietPlan.hoursRemaining}h</p>
          )}
          <button
            onClick={() => nav(ROUTES.DOCTOR.PATIENT_DIET_PLAN.replace(':id', patient.id))}
            style={{
              marginTop: 12, padding: '8px 14px', borderRadius: 8, border: 'none',
              background: COLORS.brand, color: '#fff', cursor: 'pointer',
              fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
            }}
          >
            {patient.dietPlan?.plan ? 'Edit diet plan' : 'Create diet plan'}
          </button>
        </div>
      )}

      {/* Appointment history */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: 20,
        border: `1px solid ${COLORS.divider}`, boxShadow: SHADOW.card,
      }}>
        <h2 style={{ margin: '0 0 16px', fontSize: FONT_SIZE.lg, color: COLORS.navy, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={18} /> Appointment History
        </h2>

        {patient.appointmentHistory.length === 0 ? (
          <p style={{ color: COLORS.muted, fontSize: FONT_SIZE.sm, margin: 0 }}>No appointments on record.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {patient.appointmentHistory.map(appt => (
              <div key={appt.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap',
                padding: '12px 14px', borderRadius: 10, background: COLORS.inputBg,
              }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <p style={{ margin: 0, fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>
                    {fmtDateTime(appt.dateTime)}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: FONT_SIZE.xs, color: COLORS.muted }}>
                    {appt.type === 'ONLINE' ? 'Online consultation' : 'In-person visit'}
                  </p>
                  {appt.notes && (
                    <p style={{ margin: '6px 0 0', fontSize: FONT_SIZE.xs, color: COLORS.body }}>{appt.notes}</p>
                  )}
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
