/**
 * AppointmentDetailModal
 * ─────────────────────────────────────────────────────────────────────────────
 * Shows full detail for a single admin appointment.
 * Follows the same pattern as InternDetailModal — query on open,
 * skeleton → data → error states, Escape key to close.
 */

import { useEffect } from 'react'
import { X, RefreshCw, Calendar, Clock, Video, MapPin } from 'lucide-react'
import { useAdminAppointmentDetail } from '@/hooks/useAdminAppointments'
import StatusBadge from '@/components/admin/StatusBadge'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import type { AdminAppointmentDetail } from '@/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch { return '—' }
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch { return '—' }
}

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function InfoRow({
  label, value, mono,
}: {
  label: string
  value: string | number | boolean | null | undefined
  mono?: boolean
}) {
  const display =
    value === null || value === undefined || value === ''
      ? '—'
      : typeof value === 'boolean'
      ? value ? 'Yes' : 'No'
      : String(value)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{
        fontSize: FONT_SIZE.xs, color: COLORS.muted, fontWeight: FONT_WEIGHT.semibold,
        textTransform: 'uppercase', letterSpacing: '0.4px',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: FONT_SIZE.sm, color: COLORS.navy,
        fontFamily: mono ? 'monospace' : undefined,
        wordBreak: 'break-all',
      }}>
        {display}
      </span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <p style={{
        fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, color: COLORS.muted,
        textTransform: 'uppercase', letterSpacing: '0.6px',
        margin: '0 0 10px', paddingBottom: '6px', borderBottom: `1px solid ${COLORS.divider}`,
      }}>
        {title}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
        {children}
      </div>
    </div>
  )
}

function Avatar({ name, photoUrl, size = 44 }: { name: string | null; photoUrl: string | null; size?: number }) {
  return photoUrl ? (
    <img
      src={photoUrl}
      alt={name ?? ''}
      style={{ width: size, height: size, minWidth: size, borderRadius: '50%', objectFit: 'cover' }}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
    />
  ) : (
    <div style={{
      width: size, height: size, minWidth: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${COLORS.brand} 0%, ${COLORS.brandMid} 100%)`,
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size > 40 ? '1rem' : '0.75rem', fontWeight: FONT_WEIGHT.bold,
    }}>
      {getInitials(name)}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ModalSkeleton() {
  const bar = (w: string, h = '13px') => (
    <div className="skeleton-pulse" style={{ height: h, width: w, borderRadius: '6px', background: '#e6edf0' }} />
  )
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {bar('60px', '60px')}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {bar('45%', '16px')}
          {bar('30%', '12px')}
        </div>
      </div>
      {[1, 2, 3].map(s => (
        <div key={s}>
          {bar('20%', '10px')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', marginTop: '10px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {bar('38%', '9px')}
                {bar('68%')}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Type/status chips ────────────────────────────────────────────────────────
const TYPE_STYLES: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  ONLINE:    { bg: '#eff6ff', color: '#2563eb', icon: <Video size={11} /> },
  IN_PERSON: { bg: '#f0fdf4', color: '#16a34a', icon: <MapPin size={11} /> },
}

function TypeChip({ type }: { type: string | null | undefined }) {
  if (!type) return <span style={{ color: COLORS.muted }}>—</span>
  const s = TYPE_STYLES[type] ?? { bg: '#f0f4f6', color: COLORS.muted, icon: null }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      background: s.bg, color: s.color,
      borderRadius: '6px', padding: '3px 9px',
      fontSize: '12px', fontWeight: FONT_WEIGHT.semibold,
    }}>
      {s.icon} {type.replace('_', ' ')}
    </span>
  )
}

// ─── Modal content ────────────────────────────────────────────────────────────
function ModalContent({ data }: { data: AdminAppointmentDetail }) {
  const patient = data.patient
  const doctor  = data.doctor

  return (
    <div style={{ padding: '20px' }}>
      {/* Appointment header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px', marginBottom: '20px',
        background: COLORS.brandLight, borderRadius: '12px',
      }}>
        <Calendar size={18} color={COLORS.brand} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>
            {formatDateTime(data.dateTime)}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
            <TypeChip type={data.type} />
            <StatusBadge status={data.status?.toLowerCase() ?? 'unknown'} />
          </div>
        </div>
      </div>

      {/* Patient */}
      {patient && (
        <Section title="Patient">
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <Avatar name={patient.fullName} photoUrl={patient.profilePhotoUrl} size={40} />
            <div>
              <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>
                {patient.fullName || '—'}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: COLORS.muted }}>{patient.email || '—'}</p>
            </div>
          </div>
          <InfoRow label="Phone"      value={patient.patientProfile?.phoneNumber} mono />
          <InfoRow label="Gender"     value={patient.patientProfile?.gender} />
          <InfoRow label="Age"        value={patient.patientProfile?.age != null ? `${patient.patientProfile.age}y` : null} />
          <InfoRow label="Blood Group" value={patient.patientProfile?.bloodGroup?.replace('_', '') ?? null} />
          <InfoRow label="Location"   value={patient.patientProfile?.location} />
        </Section>
      )}

      {/* Doctor */}
      {doctor && (
        <Section title="Doctor / Dietician">
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <Avatar name={doctor.fullName} photoUrl={doctor.profilePhotoUrl} size={40} />
            <div>
              <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>
                {doctor.fullName || '—'}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: COLORS.muted }}>{doctor.email || '—'}</p>
            </div>
          </div>
          <InfoRow label="Phone"          value={doctor.doctorProfile?.phoneNumber} mono />
          <InfoRow label="Specialization" value={doctor.doctorProfile?.specialization} />
          <InfoRow label="Qualification"  value={doctor.doctorProfile?.qualification} />
          <InfoRow label="Hospital"       value={doctor.doctorProfile?.hospitalName} />
        </Section>
      )}

      {/* Appointment metadata */}
      <Section title="Appointment Info">
        <InfoRow label="Appointment ID" value={data.id} mono />
        <InfoRow label="Type"           value={data.type?.replace('_', ' ') ?? null} />
        <InfoRow label="Created"        value={formatDate(data.createdAt)} />
        <InfoRow label="Last Updated"   value={formatDate(data.updatedAt)} />
        {data.notes && (
          <div style={{ gridColumn: '1 / -1' }}>
            <InfoRow label="Notes" value={data.notes} />
          </div>
        )}
      </Section>
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface AppointmentDetailModalProps {
  appointmentId: string | null
  onClose:       () => void
}

export default function AppointmentDetailModal({
  appointmentId,
  onClose,
}: AppointmentDetailModalProps) {
  const isOpen = !!appointmentId

  const { appointment, isLoading, isError, refetch } =
    useAdminAppointmentDetail(appointmentId)

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  // Escape key close
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }
        .adm-scroll::-webkit-scrollbar { display: none; }
        .adm-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15,61,74,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px', backdropFilter: 'blur(2px)',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: '20px', boxShadow: SHADOW.popup,
            width: '100%', maxWidth: '560px',
            display: 'flex', flexDirection: 'column',
            maxHeight: 'calc(100vh - 48px)',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: `1px solid ${COLORS.divider}`, flexShrink: 0,
          }}>
            <div>
              <p style={{ margin: 0, fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>
                Appointment Details
              </p>
              {appointment?.patient?.fullName && (
                <p style={{ margin: 0, fontSize: FONT_SIZE.xs, color: COLORS.muted }}>
                  {appointment.patient.fullName}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                width: '32px', height: '32px', borderRadius: '10px', border: 'none',
                background: COLORS.divider, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: COLORS.muted, flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="adm-scroll" style={{ overflowY: 'auto', flex: 1 }}>
            {isLoading && <ModalSkeleton />}

            {isError && !isLoading && (
              <div style={{
                padding: '40px 20px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '12px', textAlign: 'center',
              }}>
                <Clock size={28} color={COLORS.muted} />
                <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, margin: 0 }}>
                  Could not load appointment details.
                </p>
                <button
                  onClick={() => refetch()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 16px', borderRadius: '8px',
                    background: COLORS.brand, color: '#fff', border: 'none',
                    cursor: 'pointer', fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
                  }}
                >
                  <RefreshCw size={13} /> Try again
                </button>
              </div>
            )}

            {!isLoading && !isError && appointment && (
              <ModalContent data={appointment} />
            )}

            {!isLoading && !isError && !appointment && (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, margin: 0 }}>
                  Appointment not found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
