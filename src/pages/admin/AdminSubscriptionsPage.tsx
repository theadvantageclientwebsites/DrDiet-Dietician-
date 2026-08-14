/**
 * AdminSubscriptionsPage — assign doctors to paid package subscriptions.
 * GET /admin/subscriptions, PATCH /admin/subscriptions/:id/assign-doctor
 */
import { useState, useEffect, useRef } from 'react'
import { UserPlus, Search, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import { PACKAGE_DURATION_LABELS } from '@/config/constants'
import {
  useAdminSubscriptions,
  useAssignSubscriptionDoctor,
  DEFAULT_SUBSCRIPTIONS_LIMIT,
  SUBSCRIPTION_STATUS_LABEL,
} from '@/hooks/useAdminSubscriptions'
import { useAdminDoctors } from '@/hooks/useAdminDoctors'
import type { AdminSubscription, PackageSubscriptionStatus } from '@/types'
import { format, parseISO } from 'date-fns'

const STATUS_TABS: { value: PackageSubscriptionStatus | ''; label: string }[] = [
  { value: 'PENDING_ASSIGNMENT', label: 'Needs doctor' },
  { value: '',                   label: 'All' },
  { value: 'ACTIVE',             label: 'Active' },
  { value: 'EXPIRED',            label: 'Expired' },
  { value: 'CANCELLED',          label: 'Cancelled' },
]

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  PENDING_ASSIGNMENT: { bg: '#fef3c7', text: '#b45309' },
  ACTIVE:             { bg: '#dcfce7', text: '#16a34a' },
  EXPIRED:            { bg: '#f0f4f6', text: '#6b8896' },
  CANCELLED:          { bg: '#fee2e2', text: '#dc2626' },
}

function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—'
  try { return format(parseISO(iso), 'MMM d, yyyy') }
  catch { return iso }
}

export default function AdminSubscriptionsPage() {
  const [status, setStatus] = useState<PackageSubscriptionStatus | ''>('PENDING_ASSIGNMENT')
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [page, setPage] = useState(1)
  const [assignTarget, setAssignTarget] = useState<AdminSubscription | null>(null)
  const [doctorId, setDoctorId] = useState('')
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current)
    searchRef.current = setTimeout(() => { setDebounced(search); setPage(1) }, 350)
    return () => { if (searchRef.current) clearTimeout(searchRef.current) }
  }, [search])

  const { subscriptions, pagination, isLoading, isFetching, isError, refetch } = useAdminSubscriptions({
    status,
    search: debounced || undefined,
    page,
    limit: DEFAULT_SUBSCRIPTIONS_LIMIT,
  })

  const { doctors } = useAdminDoctors({
    page: 1,
    limit: 50,
    isApproved: 'true',
    statusFilter: 'ACTIVE',
  })

  const assign = useAssignSubscriptionDoctor(() => {
    setAssignTarget(null)
    setDoctorId('')
  })

  return (
    <AdminPageShell
      title="Package subscriptions"
      subtitle="Assign a doctor after each purchase. Patients cannot book until assigned."
    >
      {isError && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
          borderRadius: 12, background: '#fff7ed', border: '1px solid #fed7aa', marginBottom: 16,
        }}>
          <AlertTriangle size={16} color="#ea580c" />
          <span style={{ flex: 1, fontSize: FONT_SIZE.sm, color: '#c2410c' }}>Failed to load subscriptions.</span>
          <button onClick={() => refetch()} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7,
            background: '#ea580c', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12,
          }}>
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      <div style={{
        background: '#fff', borderRadius: 16, padding: 16, border: `1px solid ${COLORS.divider}`,
        boxShadow: SHADOW.card, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {STATUS_TABS.map(t => (
            <button
              key={t.value || 'all'}
              onClick={() => { setStatus(t.value); setPage(1) }}
              style={{
                padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: status === t.value ? COLORS.brand : COLORS.brandLight,
                color: status === t.value ? '#fff' : COLORS.brand,
                fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <Search size={15} color={COLORS.muted} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patient name…"
            style={{
              width: '100%', padding: '8px 10px 8px 32px', borderRadius: 8,
              border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm,
            }}
          />
        </div>
      </div>

      <div style={{
        background: '#fff', borderRadius: 16, border: `1px solid ${COLORS.divider}`,
        boxShadow: SHADOW.card, overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center', color: COLORS.muted }}>Loading…</div>
        ) : subscriptions.length === 0 ? (
          <AdminEmptyState
            icon={<UserPlus size={28} />}
            title="No subscriptions"
            description="Paid packages waiting for a doctor will appear here."
          />
        ) : (
          subscriptions.map((s: AdminSubscription) => {
            const st = STATUS_STYLE[s.status] ?? STATUS_STYLE.EXPIRED
            return (
              <div
                key={s.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                  padding: '14px 16px', borderBottom: `1px solid ${COLORS.divider}`,
                  opacity: isFetching ? 0.7 : 1,
                }}
              >
                <div style={{ flex: 1, minWidth: 180 }}>
                  <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>
                    {s.patient?.fullName ?? 'Unknown patient'}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: FONT_SIZE.xs, color: COLORS.muted }}>
                    {s.patient?.email ?? '—'}
                  </p>
                </div>
                <div style={{ minWidth: 140 }}>
                  <p style={{ margin: 0, fontSize: FONT_SIZE.sm, color: COLORS.navy }}>{s.package?.name ?? '—'}</p>
                  <p style={{ margin: '2px 0 0', fontSize: FONT_SIZE.xs, color: COLORS.muted }}>
                    {PACKAGE_DURATION_LABELS[s.duration] ?? s.duration} · {fmtDate(s.startsAt)} – {fmtDate(s.endsAt)}
                  </p>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                  background: st.bg, color: st.text,
                }}>
                  {SUBSCRIPTION_STATUS_LABEL[s.status] ?? s.status}
                </span>
                <span style={{ fontSize: FONT_SIZE.xs, color: COLORS.body, minWidth: 120 }}>
                  {s.doctor?.fullName ?? 'No doctor'}
                </span>
                {s.status === 'PENDING_ASSIGNMENT' && (
                  <button
                    onClick={() => { setAssignTarget(s); setDoctorId('') }}
                    style={{
                      padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: COLORS.brand, color: '#fff', fontSize: 12, fontWeight: FONT_WEIGHT.semibold,
                    }}
                  >
                    Assign doctor
                  </button>
                )}
              </div>
            )
          })
        )}

        {pagination.totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderTop: `1px solid ${COLORS.divider}`,
          }}>
            <span style={{ fontSize: FONT_SIZE.xs, color: COLORS.muted }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: 6, borderRadius: 6, border: `1px solid ${COLORS.divider}`, background: '#fff' }}>
                <ChevronLeft size={16} />
              </button>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: 6, borderRadius: 6, border: `1px solid ${COLORS.divider}`, background: '#fff' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {assignTarget && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15, 61, 74, 0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
          onClick={() => { if (!assign.isPending) setAssignTarget(null) }}
        >
          <div
            style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 420, padding: 20, boxShadow: SHADOW.card }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 8px', fontSize: FONT_SIZE.lg, color: COLORS.navy }}>Assign doctor</h2>
            <p style={{ margin: '0 0 14px', fontSize: FONT_SIZE.sm, color: COLORS.muted }}>
              Assign an approved doctor to {assignTarget.patient?.fullName ?? 'this patient'} for {assignTarget.package?.name ?? 'their package'}.
            </p>
            <select
              value={doctorId}
              onChange={e => setDoctorId(e.target.value)}
              style={{
                width: '100%', marginBottom: 16, padding: '8px 10px', borderRadius: 8,
                border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm,
              }}
            >
              <option value="">Select doctor…</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.fullName}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                disabled={assign.isPending}
                onClick={() => setAssignTarget(null)}
                style={{
                  padding: '8px 14px', borderRadius: 8, border: `1px solid ${COLORS.divider}`,
                  background: '#fff', cursor: 'pointer', fontSize: FONT_SIZE.sm,
                }}
              >
                Cancel
              </button>
              <button
                disabled={!doctorId || assign.isPending}
                onClick={() => assign.mutate({ id: assignTarget.id, doctorId })}
                style={{
                  padding: '8px 14px', borderRadius: 8, border: 'none',
                  background: COLORS.brand, color: '#fff', cursor: doctorId ? 'pointer' : 'not-allowed',
                  fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
                  opacity: !doctorId || assign.isPending ? 0.6 : 1,
                }}
              >
                {assign.isPending ? 'Assigning…' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageShell>
  )
}
