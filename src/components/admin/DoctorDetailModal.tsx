import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, RefreshCw } from 'lucide-react'
import { adminService } from '@/services/api/admin.service'
import StatusBadge from '@/components/admin/StatusBadge'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import type { AdminDoctorDetail } from '@/types'

const doctorDetailKey = (id: string) => ['admin', 'doctor', id] as const

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return '—'
  }
}

function getInitials(name: string | null | undefined) {
  if (!name?.trim()) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function InfoRow({ label, value, mono }: { label: string; value: string | number | boolean | null | undefined; mono?: boolean }) {
  const display =
    value === null || value === undefined || value === ''
      ? '—'
      : typeof value === 'boolean'
        ? value ? 'Yes' : 'No'
        : String(value)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{
        fontSize: FONT_SIZE.xs, color: COLORS.muted,
        fontWeight: FONT_WEIGHT.semibold, textTransform: 'uppercase', letterSpacing: '0.4px',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: FONT_SIZE.sm, color: COLORS.navy,
        fontFamily: mono ? 'monospace' : undefined, wordBreak: 'break-all',
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

function ModalSkeleton() {
  const bar = (w: string, h = '13px') => (
    <div className="skeleton-pulse" style={{ height: h, width: w, borderRadius: '6px', background: '#e6edf0' }} />
  )
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
        <div className="skeleton-pulse" style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e6edf0', minWidth: '60px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {bar('50%', '18px')}
          {bar('35%')}
        </div>
      </div>
      {[1, 2, 3].map(s => (
        <div key={s}>
          {bar('25%', '10px')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', marginTop: '10px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {bar('40%', '9px')}
                {bar('70%')}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ApprovalBadge({ isApproved }: { isApproved: boolean | null | undefined }) {
  if (isApproved == null) return null
  return (
    <span style={{
      background: isApproved ? '#f0fdf4' : '#fffbeb',
      color: isApproved ? '#16a34a' : '#d97706',
      borderRadius: '6px', padding: '2px 8px',
      fontSize: '12px', fontWeight: FONT_WEIGHT.semibold,
    }}>
      {isApproved ? 'Approved' : 'Pending Approval'}
    </span>
  )
}

function ModalContent({ data }: { data: AdminDoctorDetail }) {
  const p = data.doctorProfile

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${COLORS.divider}`,
      }}>
        {data.profilePhotoUrl ? (
          <img
            src={data.profilePhotoUrl}
            alt={data.fullName ?? 'Doctor'}
            style={{ width: '60px', height: '60px', minWidth: '60px', borderRadius: '50%', objectFit: 'cover' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div style={{
            width: '60px', height: '60px', minWidth: '60px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${COLORS.brand} 0%, ${COLORS.brandMid} 100%)`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: FONT_WEIGHT.bold,
          }}>
            {getInitials(data.fullName)}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: '0 0 4px', fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy }}>
            {data.fullName || '—'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <StatusBadge status={data.accountStatus?.toLowerCase() ?? 'unknown'} />
            <ApprovalBadge isApproved={p?.isApproved} />
          </div>
        </div>
      </div>

      <Section title="Account">
        <InfoRow label="Email"        value={data.email}               mono />
        <InfoRow label="Doctor ID"    value={data.id}                  mono />
        <InfoRow label="Joined"       value={formatDate(data.createdAt)} />
        <InfoRow label="Last Updated" value={formatDate(data.updatedAt)} />
      </Section>

      <Section title="Professional Info">
        <InfoRow label="Specialization"     value={p?.specialization} />
        <InfoRow label="Qualification"      value={p?.qualification} />
        <InfoRow label="License Number"     value={p?.licenseNumber}   mono />
        <InfoRow label="Experience (years)" value={p?.yearsOfExperience} />
      </Section>

      <Section title="Practice">
        <div style={{ gridColumn: '1 / -1' }}>
          <InfoRow label="Hospital / Clinic" value={p?.hospitalName} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <InfoRow label="Clinic Address" value={p?.clinicAddress} />
        </div>
      </Section>

      <Section title="Contact">
        <InfoRow label="Phone" value={p?.phoneNumber} mono />
      </Section>
    </div>
  )
}

interface DoctorDetailModalProps {
  doctorId: string | null
  onClose:  () => void
}

export default function DoctorDetailModal({ doctorId, onClose }: DoctorDetailModalProps) {
  const isOpen = !!doctorId

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: doctorDetailKey(doctorId ?? ''),
    queryFn:  () => adminService.getDoctorById(doctorId!),
    enabled:  !!doctorId,
    retry: 1,
    staleTime: 1000 * 60 * 2,
  })

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const doctor = data?.data ?? null

  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }
        .dd-scroll::-webkit-scrollbar { display: none; }
        .dd-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

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
            width: '100%', maxWidth: '540px',
            display: 'flex', flexDirection: 'column',
            maxHeight: 'calc(100vh - 48px)',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: `1px solid ${COLORS.divider}`, flexShrink: 0,
          }}>
            <div>
              <p style={{ margin: 0, fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>
                Doctor Details
              </p>
              {doctor?.fullName && (
                <p style={{ margin: 0, fontSize: FONT_SIZE.xs, color: COLORS.muted }}>{doctor.fullName}</p>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                width: '32px', height: '32px', borderRadius: '10px', border: 'none',
                background: COLORS.divider, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: COLORS.muted, flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="dd-scroll" style={{ overflowY: 'auto', flex: 1 }}>
            {isLoading && <ModalSkeleton />}
            {isError && !isLoading && (
              <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
                <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, margin: 0 }}>Could not load doctor details.</p>
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
            {!isLoading && !isError && doctor && <ModalContent data={doctor} />}
            {!isLoading && !isError && !doctor && (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, margin: 0 }}>Doctor not found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
