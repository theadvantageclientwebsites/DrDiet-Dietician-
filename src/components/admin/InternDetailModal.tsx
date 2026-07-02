import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, RefreshCw } from 'lucide-react'
import { adminService } from '@/services/api/admin.service'
import StatusBadge from '@/components/admin/StatusBadge'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import type { AdminInternDetail } from '@/types'

const internDetailKey = (id: string) => ['admin', 'intern', id] as const

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
  catch { return '—' }
}

function getInitials(name: string | null | undefined) {
  if (!name?.trim()) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function InfoRow({ label, value, mono }: { label: string; value: string | number | boolean | null | undefined; mono?: boolean }) {
  const display = value === null || value === undefined || value === ''
    ? '—'
    : typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: FONT_SIZE.xs, color: COLORS.muted, fontWeight: FONT_WEIGHT.semibold, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </span>
      <span style={{ fontSize: FONT_SIZE.sm, color: COLORS.navy, fontFamily: mono ? 'monospace' : undefined, wordBreak: 'break-all' }}>
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
      {[1, 2].map(s => (
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

function ModalContent({ data }: { data: AdminInternDetail }) {
  const profile = data.internProfile

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${COLORS.divider}`,
      }}>
        {data.profilePhotoUrl ? (
          <img
            src={data.profilePhotoUrl}
            alt={data.fullName ?? 'Intern'}
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
            <span style={{
              background: profile?.isApproved ? '#f0fdf4' : '#fffbeb',
              color: profile?.isApproved ? '#16a34a' : '#d97706',
              borderRadius: '6px', padding: '2px 8px', fontSize: '12px', fontWeight: FONT_WEIGHT.semibold,
            }}>
              {profile?.isApproved ? 'Approved' : 'Pending Approval'}
            </span>
          </div>
        </div>
      </div>

      <Section title="Account">
        <InfoRow label="Email"     value={data.email}              mono />
        <InfoRow label="Intern ID" value={data.id}                 mono />
        <InfoRow label="Joined"    value={formatDate(data.createdAt)} />
        <InfoRow label="Last Updated" value={formatDate(data.updatedAt)} />
      </Section>

      <Section title="Academic Info">
        <InfoRow label="University"      value={profile?.universityName} />
        <InfoRow label="Specialization"  value={profile?.specialization} />
        <InfoRow label="Semester"        value={profile?.semester != null ? `Sem ${profile.semester}` : null} />
        <InfoRow label="Year"            value={profile?.year} />
      </Section>

      <Section title="Contact">
        <InfoRow label="Phone" value={profile?.phoneNumber} mono />
      </Section>
    </div>
  )
}

interface InternDetailModalProps {
  internId: string | null
  onClose:  () => void
}

export default function InternDetailModal({ internId, onClose }: InternDetailModalProps) {
  const isOpen = !!internId

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: internDetailKey(internId ?? ''),
    queryFn:  () => adminService.getInternById(internId!),
    enabled:  !!internId,
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

  const intern = data?.data ?? null

  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }
        .id-scroll::-webkit-scrollbar { display: none; }
        .id-scroll { -ms-overflow-style: none; scrollbar-width: none; }
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
            width: '100%', maxWidth: '520px',
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
                Intern Details
              </p>
              {intern?.fullName && (
                <p style={{ margin: 0, fontSize: FONT_SIZE.xs, color: COLORS.muted }}>{intern.fullName}</p>
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

          <div className="id-scroll" style={{ overflowY: 'auto', flex: 1 }}>
            {isLoading && <ModalSkeleton />}
            {isError && !isLoading && (
              <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
                <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, margin: 0 }}>Could not load intern details.</p>
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
            {!isLoading && !isError && intern && <ModalContent data={intern} />}
            {!isLoading && !isError && !intern && (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, margin: 0 }}>Intern not found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
