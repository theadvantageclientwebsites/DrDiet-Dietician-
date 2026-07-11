/**
 * AdminAppointmentsPage — Live API-integrated appointment management
 * Server-side pagination + filters, skeleton loading, error states,
 * status updates, delete, detail modal. Follows the AdminPatientsPage pattern.
 */
import { useState, useCallback, useEffect, useRef } from 'react'
import {
  CalendarDays, Search, Eye, Trash2, AlertTriangle, RefreshCw,
  ChevronLeft, ChevronRight, X, Video, MapPin,
} from 'lucide-react'
import AdminPageShell       from '@/components/admin/AdminPageShell'
import StatusBadge          from '@/components/admin/StatusBadge'
import AdminBtn             from '@/components/admin/AdminBtn'
import AdminEmptyState      from '@/components/admin/AdminEmptyState'
import ConfirmModal         from '@/components/ui/ConfirmModal'
import AppointmentDetailModal from '@/components/admin/AppointmentDetailModal'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import {
  useAdminAppointments,
  useAdminAppointmentsSummary,
  DEFAULT_APPOINTMENTS_LIMIT,
} from '@/hooks/useAdminAppointments'
import {
  useUpdateAppointmentStatus,
  useDeleteAppointment,
} from '@/hooks/useAdminAppointmentMutations'
import type { AdminAppointment, AdminAppointmentStatus } from '@/types'

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_TABS = [
  { value: '',          label: 'All'       },
  { value: 'PENDING',   label: 'Pending'   },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const

const TYPE_OPTS = [
  { value: '',          label: 'All Types'  },
  { value: 'ONLINE',    label: 'Online'     },
  { value: 'IN_PERSON', label: 'In-Person'  },
] as const

const PAGE_SIZE_OPTS = [10, 20, 50]

// Next allowed transitions per current status
const NEXT_STATUSES: Record<AdminAppointmentStatus, AdminAppointmentStatus[]> = {
  PENDING:   ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

const STATUS_COLOR: Record<string, string> = {
  pending:   '#f59e0b',
  confirmed: COLORS.brand,
  completed: '#16a34a',
  cancelled: '#dc2626',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch { return '—' }
}

function formatTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit',
    })
  } catch { return '—' }
}

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Av({ name, photoUrl }: { name: string | null | undefined; photoUrl: string | null | undefined }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name ?? ''}
        style={{ width: '34px', height: '34px', minWidth: '34px', borderRadius: '50%', objectFit: 'cover' }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />
    )
  }
  return (
    <div style={{
      width: '34px', height: '34px', minWidth: '34px', borderRadius: '50%',
      background: COLORS.brandLight, color: COLORS.brand,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '12px', fontWeight: FONT_WEIGHT.semibold,
    }}>
      {getInitials(name)}
    </div>
  )
}

// ─── Type chip ────────────────────────────────────────────────────────────────
function TypeChip({ type }: { type: string | null | undefined }) {
  if (!type) return <span style={{ color: COLORS.muted }}>—</span>
  const isOnline = type === 'ONLINE'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      background: isOnline ? '#eff6ff' : '#f0fdf4',
      color: isOnline ? '#2563eb' : '#16a34a',
      borderRadius: '5px', padding: '2px 7px',
      fontSize: '11px', fontWeight: FONT_WEIGHT.semibold,
    }}>
      {isOnline ? <Video size={10} /> : <MapPin size={10} />}
      {isOnline ? 'Online' : 'In-Person'}
    </span>
  )
}

// ─── Stat summary cards ───────────────────────────────────────────────────────
function SummaryCards() {
  const { summary, isLoading } = useAdminAppointmentsSummary()
  const cards = [
    { label: 'Total',     value: summary.total,     color: COLORS.brand  },
    { label: "Today",     value: summary.today,     color: '#2563eb'     },
    { label: 'Pending',   value: summary.pending,   color: '#f59e0b'     },
    { label: 'Confirmed', value: summary.confirmed, color: COLORS.brand  },
    { label: 'Completed', value: summary.completed, color: '#16a34a'     },
    { label: 'Cancelled', value: summary.cancelled, color: '#dc2626'     },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
      {cards.map(c => (
        <div key={c.label} style={{
          background: '#fff', borderRadius: '12px', padding: '12px 14px',
          border: `1px solid ${COLORS.divider}`, textAlign: 'center',
        }}>
          {isLoading
            ? <div className="skeleton-pulse" style={{ height: '28px', borderRadius: '6px', background: '#e6edf0', margin: '0 auto 4px', width: '50%' }} />
            : <p style={{ margin: '0 0 2px', fontSize: '1.4rem', fontWeight: FONT_WEIGHT.bold, color: c.color }}>{c.value}</p>
          }
          <p style={{ margin: 0, fontSize: '11px', color: COLORS.muted, fontWeight: FONT_WEIGHT.semibold, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            {c.label}
          </p>
        </div>
      ))}
    </div>
  )
}

// ─── Skeleton row / card ──────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      {[44, 120, 80, 80, 70, 70, 90].map((w, i) => (
        <td key={i} style={{ padding: '12px 14px' }}>
          <div className="skeleton-pulse" style={{ height: '13px', width: `${w}px`, borderRadius: '6px', background: '#e6edf0' }} />
        </td>
      ))}
    </tr>
  )
}

function SkeletonCard() {
  return (
    <div style={{
      display: 'flex', gap: '12px', padding: '12px 14px', borderRadius: '12px',
      background: '#f7fafb', border: `1px solid ${COLORS.divider}`,
    }}>
      <div className="skeleton-pulse" style={{ width: '34px', height: '34px', minWidth: '34px', borderRadius: '50%', background: '#e6edf0' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div className="skeleton-pulse" style={{ height: '13px', width: '55%', borderRadius: '6px', background: '#e6edf0' }} />
        <div className="skeleton-pulse" style={{ height: '11px', width: '75%', borderRadius: '6px', background: '#e6edf0' }} />
        <div className="skeleton-pulse" style={{ height: '11px', width: '40%', borderRadius: '6px', background: '#e6edf0' }} />
      </div>
    </div>
  )
}

// ─── Error banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '12px 16px', borderRadius: '12px',
      background: '#fff7ed', border: '1px solid #fed7aa', marginBottom: '16px', flexWrap: 'wrap',
    }}>
      <AlertTriangle size={16} color="#ea580c" />
      <span style={{ flex: 1, fontSize: FONT_SIZE.sm, color: '#c2410c', minWidth: '180px' }}>
        Failed to load appointments. Please check your connection and try again.
      </span>
      <button onClick={onRetry} style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        padding: '5px 12px', borderRadius: '7px', background: '#ea580c',
        color: '#fff', border: 'none', cursor: 'pointer',
        fontSize: '12px', fontWeight: FONT_WEIGHT.semibold, whiteSpace: 'nowrap',
      }}>
        <RefreshCw size={12} /> Retry
      </button>
    </div>
  )
}

// ─── Pagination bar ───────────────────────────────────────────────────────────
interface PaginationBarProps {
  page: number; totalPages: number; totalItems: number
  limit: number; isFetching: boolean
  onPage: (p: number) => void; onLimit: (l: number) => void
}

function PaginationBar({ page, totalPages, totalItems, limit, isFetching, onPage, onLimit }: PaginationBarProps) {
  const safePage  = Math.max(1, page)
  const safeTotal = Math.max(1, totalPages)
  const from      = totalItems === 0 ? 0 : (safePage - 1) * limit + 1
  const to        = Math.min(safePage * limit, totalItems)

  const pages: (number | '…')[] = []
  for (let i = 1; i <= safeTotal; i++) {
    if (i === 1 || i === safeTotal || (i >= safePage - 1 && i <= safePage + 1)) pages.push(i)
    else if (pages[pages.length - 1] !== '…') pages.push('…')
  }

  const btnBase = { height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }

  return (
    <div style={{
      padding: '12px 16px', borderTop: `1px solid ${COLORS.divider}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: COLORS.muted }}>
          {totalItems === 0 ? 'No results' : `${from}–${to} of ${totalItems}`}
          {isFetching && <span style={{ marginLeft: '6px', color: COLORS.brand }}>loading…</span>}
        </span>
        <select value={limit} onChange={e => onLimit(Number(e.target.value))} style={{
          height: '30px', padding: '0 8px', borderRadius: '8px', border: `1px solid ${COLORS.divider}`,
          background: '#f7fafb', fontSize: '12px', color: '#374955', outline: 'none', cursor: 'pointer',
        }}>
          {PAGE_SIZE_OPTS.map(s => <option key={s} value={s}>{s} / page</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button onClick={() => onPage(safePage - 1)} disabled={safePage <= 1 || isFetching}
          style={{ ...btnBase, width: '30px', border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: safePage <= 1 ? 'not-allowed' : 'pointer', color: safePage <= 1 ? COLORS.divider : COLORS.muted }}>
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) =>
          p === '…'
            ? <span key={`e${i}`} style={{ padding: '0 4px', fontSize: '12px', color: COLORS.muted }}>…</span>
            : <button key={p} onClick={() => onPage(p as number)} disabled={isFetching} style={{
                ...btnBase, minWidth: '30px', padding: '0 6px',
                border: p === safePage ? 'none' : `1px solid ${COLORS.divider}`,
                background: p === safePage ? COLORS.brand : '#fff',
                color: p === safePage ? '#fff' : '#374955',
                fontWeight: p === safePage ? FONT_WEIGHT.semibold : 400,
                cursor: isFetching ? 'not-allowed' : 'pointer',
              }}>{p}</button>
        )}
        <button onClick={() => onPage(safePage + 1)} disabled={safePage >= safeTotal || isFetching}
          style={{ ...btnBase, width: '30px', border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: safePage >= safeTotal ? 'not-allowed' : 'pointer', color: safePage >= safeTotal ? COLORS.divider : COLORS.muted }}>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Action button ────────────────────────────────────────────────────────────
function ActionBtn({ title, color, bg = 'transparent', onClick, children }: {
  title: string; color: string; bg?: string; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button title={title} onClick={(e) => { e.stopPropagation(); onClick() }}
      style={{ padding: '5px 7px', borderRadius: '7px', border: 'none', background: bg, cursor: 'pointer', color, display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: FONT_WEIGHT.semibold }}>
      {children}
    </button>
  )
}

// ─── Status dropdown (inline quick-change) ────────────────────────────────────
function StatusDropdown({ appt, onUpdate }: { appt: AdminAppointment; onUpdate: (id: string, s: AdminAppointmentStatus) => void }) {
  const next = NEXT_STATUSES[appt.status] ?? []
  if (next.length === 0) return <StatusBadge status={appt.status.toLowerCase()} />
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
      <StatusBadge status={appt.status.toLowerCase()} />
      <select
        defaultValue=""
        onChange={e => { if (e.target.value) onUpdate(appt.id, e.target.value as AdminAppointmentStatus) }}
        onClick={e => e.stopPropagation()}
        style={{
          height: '24px', padding: '0 6px', borderRadius: '6px',
          border: `1px solid ${COLORS.divider}`, background: '#f7fafb',
          fontSize: '11px', color: '#374955', outline: 'none', cursor: 'pointer',
        }}
      >
        <option value="" disabled>Change…</option>
        {next.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
      </select>
    </div>
  )
}

// ─── Desktop table row ────────────────────────────────────────────────────────
function ApptRow({ a, onView, onDelete, onStatusChange }: {
  a: AdminAppointment
  onView: (id: string) => void
  onDelete: (a: AdminAppointment) => void
  onStatusChange: (id: string, s: AdminAppointmentStatus) => void
}) {
  return (
    <tr onClick={() => onView(a.id)} style={{ cursor: 'pointer' }}>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Av name={a.patient?.fullName} photoUrl={a.patient?.profilePhotoUrl} />
          <div>
            <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>
              {a.patient?.fullName || '—'}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: COLORS.muted }}>
              {a.patient?.patientProfile?.phoneNumber || a.patient?.email || '—'}
            </p>
          </div>
        </div>
      </td>
      <td>
        <div>
          <p style={{ margin: 0, fontSize: FONT_SIZE.sm, color: COLORS.navy }}>
            {a.doctor?.fullName || '—'}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: COLORS.muted }}>
            {a.doctor?.doctorProfile?.specialization || '—'}
          </p>
        </div>
      </td>
      <td>
        <p style={{ margin: 0, fontSize: FONT_SIZE.sm, color: COLORS.navy }}>{formatDate(a.dateTime)}</p>
        <p style={{ margin: 0, fontSize: '11px', color: COLORS.muted }}>{formatTime(a.dateTime)}</p>
      </td>
      <td><TypeChip type={a.type} /></td>
      <td onClick={e => e.stopPropagation()}>
        <StatusDropdown appt={a} onUpdate={onStatusChange} />
      </td>
      <td onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <ActionBtn title="View" color={COLORS.muted} onClick={() => onView(a.id)}>
            <Eye size={14} strokeWidth={1.8} />
          </ActionBtn>
          <ActionBtn title="Delete" color="#dc2626" bg="#fee2e2" onClick={() => onDelete(a)}>
            <Trash2 size={13} strokeWidth={1.8} />
          </ActionBtn>
        </div>
      </td>
    </tr>
  )
}

// ─── Mobile card ──────────────────────────────────────────────────────────────
function ApptCard({ a, onView, onDelete, onStatusChange }: {
  a: AdminAppointment
  onView: (id: string) => void
  onDelete: (a: AdminAppointment) => void
  onStatusChange: (id: string, s: AdminAppointmentStatus) => void
}) {
  const borderColor = STATUS_COLOR[a.status.toLowerCase()] ?? COLORS.divider
  return (
    <div onClick={() => onView(a.id)} style={{
      padding: '12px 14px', borderRadius: '12px', background: '#f7fafb',
      border: `1px solid ${COLORS.divider}`, borderLeft: `3px solid ${borderColor}`, cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Av name={a.patient?.fullName} photoUrl={a.patient?.profilePhotoUrl} />
          <span style={{ fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>
            {a.patient?.fullName || '—'}
          </span>
        </div>
        <TypeChip type={a.type} />
      </div>
      <p style={{ margin: '0 0 2px', fontSize: '12px', color: COLORS.muted }}>
        {a.doctor?.fullName || '—'} · {a.doctor?.doctorProfile?.specialization || ''}
      </p>
      <p style={{ margin: '0 0 8px', fontSize: '12px', color: COLORS.muted }}>
        {formatDate(a.dateTime)} · {formatTime(a.dateTime)}
      </p>
      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        <StatusDropdown appt={a} onUpdate={onStatusChange} />
        <ActionBtn title="Delete" color="#dc2626" bg="#fee2e2" onClick={() => onDelete(a)}>
          <Trash2 size={12} strokeWidth={1.8} /> Delete
        </ActionBtn>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminAppointmentsPage() {
  // ── Filter / pagination state ─────────────────────────────────────────────
  const [searchInput,  setSearchInput]  = useState('')
  const [searchTerm,   setSearchTerm]   = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminAppointmentStatus | ''>('')
  const [typeFilter,   setTypeFilter]   = useState<'ONLINE' | 'IN_PERSON' | ''>('')
  const [page,         setPage]         = useState(1)
  const [limit,        setLimit]        = useState(DEFAULT_APPOINTMENTS_LIMIT)

  // ── Modal state ───────────────────────────────────────────────────────────
  const [selectedId,   setSelectedId]   = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminAppointment | null>(null)

  // ── Debounce search (400ms) ────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearchChange = useCallback((val: string) => {
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setSearchTerm(val); setPage(1) }, 400)
  }, [])

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [statusFilter, typeFilter, limit])

  // ── Query ─────────────────────────────────────────────────────────────────
  const { appointments, pagination, isLoading, isFetching, isError, refetch } =
    useAdminAppointments({
      page,
      limit,
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      type:   typeFilter   || undefined,
    })

  // ── Mutations ─────────────────────────────────────────────────────────────
  const statusMutation = useUpdateAppointmentStatus()
  const deleteMutation = useDeleteAppointment(() => setDeleteTarget(null))

  const handleStatusChange = (id: string, status: AdminAppointmentStatus) => {
    statusMutation.mutate({ id, status })
  }

  const hasActiveFilters = !!searchTerm || !!statusFilter || !!typeFilter
  const clearFilters = () => {
    setSearchInput(''); setSearchTerm('')
    setStatusFilter(''); setTypeFilter(''); setPage(1)
  }

  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }

        .aa-table { width:100%; border-collapse:collapse; }
        .aa-table th { text-align:left; padding:9px 14px; font-size:11px; font-weight:600; color:#9ab0bb; text-transform:uppercase; letter-spacing:.5px; background:#f7fafb; border-bottom:1px solid #e6edf0; }
        .aa-table td { padding:10px 14px; font-size:13px; color:#374955; border-bottom:1px solid #f7fafb; vertical-align:middle; }
        .aa-table tr:last-child td { border-bottom:none; }
        .aa-table tr:hover td { background:#f0f8fa; }
        .aa-table-wrap { overflow-x:auto; }

        .aa-desktop { display:none; }
        .aa-mobile  { display:flex; flex-direction:column; gap:10px; padding:12px; }
        @media (min-width:768px) { .aa-desktop { display:block; } .aa-mobile { display:none; } }

        .aa-tabs { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px; }
        .aa-tab  { padding:6px 14px; border-radius:20px; border:none; font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; font-family:inherit; }

        .aa-filters { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:16px; }
        .aa-search-wrap { flex:1; min-width:180px; max-width:300px; position:relative; display:flex; align-items:center; }
        .aa-search { width:100%; height:38px; padding:0 30px 0 34px; border:1px solid #e6edf0; border-radius:10px; background:#f7fafb; font-size:13px; color:#374955; outline:none; font-family:inherit; box-sizing:border-box; }
        .aa-search:focus { border-color: ${COLORS.brand}; background:#fff; }
        .aa-select { height:38px; padding:0 28px 0 12px; border:1px solid #e6edf0; border-radius:10px; background:#f7fafb; font-size:13px; color:#374955; outline:none; cursor:pointer; font-family:inherit; appearance:none; }
        .aa-fetching { opacity:0.65; pointer-events:none; transition:opacity 0.2s; }

        .aa-sum-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:20px; }
        @media (min-width:640px) { .aa-sum-grid { grid-template-columns:repeat(6,1fr); } }
      `}</style>

      <AdminPageShell
        title="Appointments"
        subtitle={pagination.totalItems > 0 ? `${pagination.totalItems} total appointments` : 'Manage all consultation appointments'}
      >
        {isError && <ErrorBanner onRetry={refetch} />}

        <SummaryCards />

        {/* ── Status tabs ──────────────────────────────────────────── */}
        <div className="aa-tabs">
          {STATUS_TABS.map(t => (
            <button key={t.value} className="aa-tab"
              style={{ background: statusFilter === t.value ? COLORS.brand : COLORS.divider, color: statusFilter === t.value ? '#fff' : COLORS.body }}
              onClick={() => { setStatusFilter(t.value as AdminAppointmentStatus | ''); setPage(1) }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Filters ──────────────────────────────────────────────── */}
        <div className="aa-filters">
          <div className="aa-search-wrap">
            <Search size={15} style={{ position: 'absolute', left: '10px', color: COLORS.muted, pointerEvents: 'none' }} />
            <input className="aa-search" placeholder="Search patient or doctor…" value={searchInput} onChange={e => handleSearchChange(e.target.value)} />
            {searchInput && (
              <button onClick={() => handleSearchChange('')} style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, display: 'flex', padding: '2px' }}>
                <X size={13} />
              </button>
            )}
          </div>

          <select className="aa-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value as 'ONLINE' | 'IN_PERSON' | '')}>
            {TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {hasActiveFilters && (
            <button onClick={clearFilters} style={{
              height: '38px', padding: '0 12px', borderRadius: '10px',
              border: `1px solid #fed7aa`, background: '#fff7ed',
              color: '#c2410c', fontSize: '12px', fontWeight: FONT_WEIGHT.semibold,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap',
            }}>
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* ── Table card ───────────────────────────────────────────── */}
        <div
          className={isFetching && !isLoading ? 'aa-fetching' : ''}
          style={{ background: '#fff', borderRadius: '16px', boxShadow: SHADOW.card, border: `1px solid ${COLORS.divider}`, overflow: 'hidden' }}
        >
          {/* Desktop */}
          <div className="aa-desktop">
            {isLoading ? (
              <div className="aa-table-wrap">
                <table className="aa-table">
                  <thead><tr><th>Patient</th><th>Doctor</th><th>Date / Time</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>{Array.from({ length: limit }).map((_, i) => <SkeletonRow key={i} />)}</tbody>
                </table>
              </div>
            ) : appointments.length === 0 ? (
              <AdminEmptyState
                icon={<CalendarDays size={22} />}
                title={hasActiveFilters ? 'No appointments match your filters' : 'No appointments found'}
                description={hasActiveFilters ? 'Try adjusting your search or filters' : 'Appointments will appear here once booked'}
              />
            ) : (
              <div className="aa-table-wrap">
                <table className="aa-table">
                  <thead><tr><th>Patient</th><th>Doctor</th><th>Date / Time</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {appointments.map(a => (
                      <ApptRow
                        key={a.id} a={a}
                        onView={id => setSelectedId(id)}
                        onDelete={ap => setDeleteTarget(ap)}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="aa-mobile">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : appointments.length === 0
                ? <AdminEmptyState
                    icon={<CalendarDays size={22} />}
                    title={hasActiveFilters ? 'No appointments match your filters' : 'No appointments found'}
                    description={hasActiveFilters ? 'Try adjusting your filters' : 'Appointments will appear here once booked'}
                  />
                : appointments.map(a => (
                  <ApptCard
                    key={a.id} a={a}
                    onView={id => setSelectedId(id)}
                    onDelete={ap => setDeleteTarget(ap)}
                    onStatusChange={handleStatusChange}
                  />
                ))
            }
          </div>

          {!isLoading && pagination.totalItems > 0 && (
            <PaginationBar
              page={page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              limit={limit}
              isFetching={isFetching}
              onPage={p => setPage(p)}
              onLimit={l => { setLimit(l); setPage(1) }}
            />
          )}
        </div>
      </AdminPageShell>

      <AppointmentDetailModal
        appointmentId={selectedId}
        onClose={() => setSelectedId(null)}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id) }}
        variant="danger"
        title={`Delete this appointment?`}
        description={`This will permanently remove the appointment for ${deleteTarget?.patient?.fullName ?? 'this patient'}. This cannot be undone.`}
        confirmLabel="Delete Appointment"
        loading={deleteMutation.isPending}
      />
    </>
  )
}
