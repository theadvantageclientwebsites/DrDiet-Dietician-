/**
 * RevenuePage — Revenue analytics backed by live API data
 * GET /admin/revenue/summary  → summary cards + breakdown + recent transactions
 * GET /admin/revenue/orders   → paginated all-orders table with filters
 */
import { useState, useCallback, useEffect, useRef } from 'react'
import {
  IndianRupee, Package, BookOpen, ShoppingCart,
  AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, X, Search, Filter,
} from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'
import StatCard       from '@/components/admin/StatCard'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'
import {
  useAdminRevenueSummary,
  useAdminRevenueOrders,
  DEFAULT_ORDERS_LIMIT,
} from '@/hooks/useAdminRevenue'
import type { RevenueOrder, OrderStatus, OrderItemType } from '@/types'

// ─── Filter options ───────────────────────────────────────────────────────────
const STATUS_OPTS: { value: OrderStatus | ''; label: string }[] = [
  { value: '',         label: 'All Status'  },
  { value: 'PAID',     label: 'Paid'        },
  { value: 'PENDING',  label: 'Pending'     },
  { value: 'FAILED',   label: 'Failed'      },
  { value: 'REFUNDED', label: 'Refunded'    },
]

const TYPE_OPTS: { value: OrderItemType | ''; label: string }[] = [
  { value: '',                label: 'All Types'       },
  { value: 'PACKAGE',         label: 'Package'         },
  { value: 'DIGITAL_PRODUCT', label: 'Digital Product' },
]

const PAGE_SIZE_OPTS = [10, 20, 50]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtRupee(n: number | null | undefined): string {
  const v = n ?? 0
  if (v >= 10_00_000) return `₹${(v / 10_00_000).toFixed(2)}L`
  if (v >= 1_000)     return `₹${(v / 1_000).toFixed(1)}k`
  return `₹${v.toLocaleString('en-IN')}`
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch { return '—' }
}

function formatDuration(d: string | null | undefined): string {
  if (!d) return '—'
  const map: Record<string, string> = {
    ONE_MONTH:    '1 Month',
    THREE_MONTHS: '3 Months',
    SIX_MONTHS:   '6 Months',
    TWELVE_MONTHS: '12 Months',
  }
  return map[d] ?? d
}

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
}

// ─── Status badge styling ─────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  PAID:     { bg: '#dcfce7', text: '#16a34a' },
  PENDING:  { bg: '#fef3c7', text: '#d97706' },
  FAILED:   { bg: '#fee2e2', text: '#dc2626' },
  REFUNDED: { bg: '#ede9fe', text: '#7c3aed' },
}

const TYPE_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  PACKAGE:         { bg: COLORS.brandLight,  text: COLORS.brand,  label: 'Package'         },
  DIGITAL_PRODUCT: { bg: '#fef3c7',          text: '#d97706',     label: 'Digital Product' },
}

// ─── Skeleton components ──────────────────────────────────────────────────────
function StatCardSkeleton({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{
      background:   dark ? 'linear-gradient(135deg,#1e4d5a,#1a5566)' : COLORS.white,
      borderRadius: '16px', padding: '20px',
      boxShadow:    '0 1px 4px rgba(0,0,0,.08)',
      border:       dark ? 'none' : `1px solid ${COLORS.divider}`,
      minHeight:    '92px', overflow: 'hidden',
    }}>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        <div className="skeleton-pulse" style={{ height:'12px', width:'60%', borderRadius:'6px', background: dark ? 'rgba(255,255,255,.15)' : COLORS.divider }} />
        <div className="skeleton-pulse" style={{ height:'28px', width:'40%', borderRadius:'6px', background: dark ? 'rgba(255,255,255,.2)' : '#e6edf0'   }} />
        <div className="skeleton-pulse" style={{ height:'10px', width:'50%', borderRadius:'6px', background: dark ? 'rgba(255,255,255,.1)' : COLORS.divider }} />
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr>
      {[44, 130, 100, 70, 60, 80, 70].map((w, i) => (
        <td key={i} style={{ padding:'12px 14px' }}>
          <div className="skeleton-pulse" style={{ height:'13px', width:`${w}px`, borderRadius:'6px', background:'#e6edf0' }} />
        </td>
      ))}
    </tr>
  )
}

function SkeletonCard() {
  return (
    <div style={{ display:'flex', gap:'12px', padding:'12px 14px', borderRadius:'12px', background:'#f7fafb', border:`1px solid ${COLORS.divider}` }}>
      <div className="skeleton-pulse" style={{ width:'36px', height:'36px', minWidth:'36px', borderRadius:'50%', background:'#e6edf0' }} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'6px' }}>
        <div className="skeleton-pulse" style={{ height:'13px', width:'55%', borderRadius:'6px', background:'#e6edf0' }} />
        <div className="skeleton-pulse" style={{ height:'11px', width:'75%', borderRadius:'6px', background:'#e6edf0' }} />
        <div className="skeleton-pulse" style={{ height:'11px', width:'40%', borderRadius:'6px', background:'#e6edf0' }} />
      </div>
    </div>
  )
}

// ─── Error banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'10px',
      padding:'12px 16px', borderRadius:'12px',
      background:'#fff7ed', border:'1px solid #fed7aa',
      marginBottom:'16px', flexWrap:'wrap',
    }}>
      <AlertTriangle size={16} color="#ea580c" />
      <span style={{ flex:1, fontSize: FONT_SIZE.sm, color:'#c2410c', minWidth:'180px' }}>
        {message}
      </span>
      <button onClick={onRetry} style={{
        display:'flex', alignItems:'center', gap:'5px',
        padding:'5px 12px', borderRadius:'7px',
        background:'#ea580c', color:'#fff', border:'none', cursor:'pointer',
        fontSize:'12px', fontWeight: FONT_WEIGHT.semibold, whiteSpace:'nowrap',
      }}>
        <RefreshCw size={12} /> Retry
      </button>
    </div>
  )
}

// ─── Patient Avatar ───────────────────────────────────────────────────────────
function PatientAvatar({ name, photoUrl }: { name: string | null; photoUrl: string | null }) {
  const initials = getInitials(name)
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name ?? 'Patient'}
        style={{ width:'32px', height:'32px', minWidth:'32px', borderRadius:'50%', objectFit:'cover' }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />
    )
  }
  return (
    <div style={{
      width:'32px', height:'32px', minWidth:'32px', borderRadius:'50%',
      background: COLORS.brandLight, color: COLORS.brand,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:'11px', fontWeight: FONT_WEIGHT.semibold,
    }}>
      {initials}
    </div>
  )
}

// ─── Pagination bar ───────────────────────────────────────────────────────────
interface PaginationBarProps {
  page:       number
  totalPages: number
  totalItems: number
  limit:      number
  isFetching: boolean
  onPage:     (p: number) => void
  onLimit:    (l: number) => void
}

function PaginationBar({ page, totalPages, totalItems, limit, isFetching, onPage, onLimit }: PaginationBarProps) {
  const safePage  = Math.max(1, page ?? 1)
  const safeTotal = Math.max(1, totalPages ?? 1)
  const from      = totalItems === 0 ? 0 : (safePage - 1) * limit + 1
  const to        = Math.min(safePage * limit, totalItems ?? 0)

  const pages: (number | '…')[] = []
  for (let i = 1; i <= safeTotal; i++) {
    if (i === 1 || i === safeTotal || (i >= safePage - 1 && i <= safePage + 1)) pages.push(i)
    else if (pages[pages.length - 1] !== '…') pages.push('…')
  }

  return (
    <div style={{
      padding:'12px 16px', borderTop:`1px solid ${COLORS.divider}`,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      flexWrap:'wrap', gap:'10px',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
        <span style={{ fontSize:'12px', color: COLORS.muted }}>
          {totalItems === 0 ? 'No results' : `${from}–${to} of ${totalItems}`}
          {isFetching && <span style={{ marginLeft:'6px', color: COLORS.brand }}>loading…</span>}
        </span>
        <select value={limit} onChange={(e) => onLimit(Number(e.target.value))} style={{
          height:'30px', padding:'0 8px', borderRadius:'8px',
          border:`1px solid ${COLORS.divider}`, background:'#f7fafb',
          fontSize:'12px', color:'#374955', outline:'none', cursor:'pointer',
        }}>
          {PAGE_SIZE_OPTS.map((s) => <option key={s} value={s}>{s} / page</option>)}
        </select>
      </div>
      <div style={{ display:'flex', gap:'4px', alignItems:'center' }}>
        <button onClick={() => onPage(safePage - 1)} disabled={safePage <= 1 || isFetching} style={{
          width:'30px', height:'30px', borderRadius:'8px', display:'flex',
          alignItems:'center', justifyContent:'center',
          border:`1px solid ${COLORS.divider}`, background:'#fff',
          cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
          color: safePage <= 1 ? COLORS.divider : COLORS.muted,
        }}>
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) =>
          p === '…'
            ? <span key={`e-${i}`} style={{ padding:'0 4px', fontSize:'12px', color: COLORS.muted }}>…</span>
            : <button key={p} onClick={() => onPage(p as number)} disabled={isFetching} style={{
                minWidth:'30px', height:'30px', padding:'0 6px', borderRadius:'8px',
                border: p === safePage ? 'none' : `1px solid ${COLORS.divider}`,
                background: p === safePage ? COLORS.brand : '#fff',
                color: p === safePage ? '#fff' : '#374955',
                fontSize:'12px', fontWeight: p === safePage ? FONT_WEIGHT.semibold : 'normal',
                cursor: isFetching ? 'not-allowed' : 'pointer',
              }}>{p}</button>
        )}
        <button onClick={() => onPage(safePage + 1)} disabled={safePage >= safeTotal || isFetching} style={{
          width:'30px', height:'30px', borderRadius:'8px', display:'flex',
          alignItems:'center', justifyContent:'center',
          border:`1px solid ${COLORS.divider}`, background:'#fff',
          cursor: safePage >= safeTotal ? 'not-allowed' : 'pointer',
          color: safePage >= safeTotal ? COLORS.divider : COLORS.muted,
        }}>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Breakdown bar ────────────────────────────────────────────────────────────
function BreakdownBar({ label, revenue, percentage, color }: {
  label: string; revenue: number; percentage: number; color: string
}) {
  const safePct = isFinite(percentage) && percentage >= 0 ? Math.min(percentage, 100) : 0
  return (
    <div style={{ marginBottom:'12px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px', flexWrap:'wrap', gap:'4px' }}>
        <span style={{ fontSize: FONT_SIZE.sm, color: COLORS.navy, fontWeight: FONT_WEIGHT.medium }}>{label}</span>
        <div style={{ display:'flex', gap:'10px' }}>
          <span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>
            {fmtRupee(revenue)}
          </span>
          <span style={{ fontSize:'12px', color: COLORS.muted }}>{safePct.toFixed(1)}%</span>
        </div>
      </div>
      <div style={{ height:'8px', background: COLORS.divider, borderRadius:'99px', overflow:'hidden' }}>
        <div style={{
          height:'100%', width:`${safePct}%`, background: color,
          borderRadius:'99px', transition:'width 0.5s ease',
        }} />
      </div>
    </div>
  )
}

// ─── Order row (desktop table) ────────────────────────────────────────────────
function OrderRow({ order }: { order: RevenueOrder }) {
  const ts = STATUS_STYLE[order.status] ?? { bg:'#f3f4f6', text:'#6b7280' }
  const tt = TYPE_STYLE[order.itemType] ?? { bg:'#f3f4f6', text:'#6b7280', label: order.itemType }

  return (
    <tr>
      <td>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <PatientAvatar name={order.patient?.fullName ?? null} photoUrl={order.patient?.profilePhotoUrl ?? null} />
          <div>
            <p style={{ margin:0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>
              {order.patient?.fullName || '—'}
            </p>
            <p style={{ margin:0, fontSize:'11px', color: COLORS.muted }}>
              {order.patient?.email || '—'}
            </p>
          </div>
        </div>
      </td>
      <td>
        <p style={{ margin:0, fontWeight: FONT_WEIGHT.medium, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>
          {order.itemName || '—'}
        </p>
        {order.duration && order.duration !== null && (
          <p style={{ margin:0, fontSize:'11px', color: COLORS.muted }}>{formatDuration(order.duration)}</p>
        )}
      </td>
      <td>
        <span style={{ background: tt.bg, color: tt.text, borderRadius:'6px', padding:'2px 8px', fontSize:'11px', fontWeight:700 }}>
          {tt.label}
        </span>
      </td>
      <td style={{ fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>
        ₹{(order.amount ?? 0).toLocaleString('en-IN')}
      </td>
      <td>
        <span style={{ background: ts.bg, color: ts.text, borderRadius:'99px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
          {order.status}
        </span>
      </td>
      <td style={{ color: COLORS.muted, fontSize:'12px' }}>
        {order.status === 'PAID' ? fmtDate(order.paidAt) : fmtDate(order.createdAt)}
      </td>
      <td style={{ color: COLORS.muted, fontSize:'11px', maxWidth:'130px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
        {order.razorpayPaymentId || '—'}
      </td>
    </tr>
  )
}

// ─── Order card (mobile) ──────────────────────────────────────────────────────
function OrderCard({ order }: { order: RevenueOrder }) {
  const ts = STATUS_STYLE[order.status] ?? { bg:'#f3f4f6', text:'#6b7280' }
  const tt = TYPE_STYLE[order.itemType] ?? { bg:'#f3f4f6', text:'#6b7280', label: order.itemType }

  return (
    <div style={{
      padding:'12px 14px', borderRadius:'12px', background:'#f7fafb',
      border:`1px solid ${COLORS.divider}`,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
        <PatientAvatar name={order.patient?.fullName ?? null} photoUrl={order.patient?.profilePhotoUrl ?? null} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', gap:'6px', flexWrap:'wrap' }}>
            <span style={{ fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>
              {order.patient?.fullName || '—'}
            </span>
            <span style={{ fontWeight: FONT_WEIGHT.bold, color: COLORS.navy }}>
              ₹{(order.amount ?? 0).toLocaleString('en-IN')}
            </span>
          </div>
          <p style={{ margin:0, fontSize:'11px', color: COLORS.muted }}>
            {order.itemName || '—'}
            {order.duration ? ` · ${formatDuration(order.duration)}` : ''}
          </p>
        </div>
      </div>
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center' }}>
        <span style={{ background: tt.bg, color: tt.text, borderRadius:'6px', padding:'2px 8px', fontSize:'11px', fontWeight:700 }}>
          {tt.label}
        </span>
        <span style={{ background: ts.bg, color: ts.text, borderRadius:'99px', padding:'2px 8px', fontSize:'11px', fontWeight:600 }}>
          {order.status}
        </span>
        <span style={{ fontSize:'11px', color: COLORS.muted }}>
          {order.status === 'PAID' ? fmtDate(order.paidAt) : fmtDate(order.createdAt)}
        </span>
      </div>
    </div>
  )
}

// ─── Recent Transaction item ──────────────────────────────────────────────────
function RecentTxItem({ tx }: { tx: import('@/types').RecentTransaction }) {
  const tt = TYPE_STYLE[tx.itemType] ?? { bg:'#f3f4f6', text:'#6b7280', label: tx.itemType }

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'10px',
      padding:'10px 0', borderBottom:`1px solid ${COLORS.divider}`,
    }}>
      <PatientAvatar name={tx.patient?.fullName ?? null} photoUrl={tx.patient?.profilePhotoUrl ?? null} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', gap:'6px', flexWrap:'wrap' }}>
          <span style={{ fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>
            {tx.patient?.fullName || '—'}
          </span>
          <span style={{ fontWeight: FONT_WEIGHT.bold, color: COLORS.navy }}>
            ₹{(tx.amount ?? 0).toLocaleString('en-IN')}
          </span>
        </div>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center', marginTop:'3px' }}>
          <span style={{ fontSize:'12px', color: COLORS.muted }}>{tx.itemName || '—'}</span>
          <span style={{ background: tt.bg, color: tt.text, borderRadius:'6px', padding:'1px 7px', fontSize:'11px', fontWeight:700 }}>
            {tt.label}
          </span>
        </div>
      </div>
      <div style={{ textAlign:'right', flexShrink:0 }}>
        <p style={{ margin:0, fontSize:'11px', color: COLORS.muted }}>{fmtDate(tx.paidAt)}</p>
        {tx.duration && (
          <p style={{ margin:'2px 0 0', fontSize:'11px', color: COLORS.muted }}>{formatDuration(tx.duration)}</p>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RevenuePage() {
  // ── Summary ────────────────────────────────────────────────────────────
  const {
    summary, breakdown, recentTransactions,
    isLoading: summaryLoading, isError: summaryError, refetch: retrySummary,
  } = useAdminRevenueSummary()

  // ── Orders filter state ────────────────────────────────────────────────
  const [statusFilter, setStatusFilter]   = useState<OrderStatus | ''>('')
  const [typeFilter,   setTypeFilter]     = useState<OrderItemType | ''>('')
  const [fromDate,     setFromDate]       = useState('')
  const [toDate,       setToDate]         = useState('')
  const [page,         setPage]           = useState(1)
  const [limit,        setLimit]          = useState(DEFAULT_ORDERS_LIMIT)

  // ── Reset to page 1 whenever filters change ────────────────────────────
  const prevFilters = useRef({ statusFilter, typeFilter, fromDate, toDate, limit })
  useEffect(() => {
    const p = prevFilters.current
    if (
      p.statusFilter !== statusFilter ||
      p.typeFilter   !== typeFilter   ||
      p.fromDate     !== fromDate     ||
      p.toDate       !== toDate       ||
      p.limit        !== limit
    ) {
      setPage(1)
      prevFilters.current = { statusFilter, typeFilter, fromDate, toDate, limit }
    }
  }, [statusFilter, typeFilter, fromDate, toDate, limit])

  // ── Validate date range (toDate must be >= fromDate) ───────────────────
  const dateRangeValid = useCallback((): boolean => {
    if (!fromDate || !toDate) return true
    return new Date(toDate) >= new Date(fromDate)
  }, [fromDate, toDate])

  const effectiveFrom = dateRangeValid() ? fromDate : ''
  const effectiveTo   = dateRangeValid() ? toDate   : ''

  // ── Orders data ────────────────────────────────────────────────────────
  const {
    orders, pagination,
    isLoading: ordersLoading, isFetching: ordersFetching,
    isError: ordersError, refetch: retryOrders,
  } = useAdminRevenueOrders({
    page,
    limit,
    status:   statusFilter   || undefined,
    itemType: typeFilter      || undefined,
    fromDate: effectiveFrom   || undefined,
    toDate:   effectiveTo     || undefined,
  })

  const hasFilters = !!statusFilter || !!typeFilter || !!fromDate || !!toDate

  const clearFilters = () => {
    setStatusFilter(''); setTypeFilter('')
    setFromDate('');     setToDate('')
    setPage(1)
  }

  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }

        .rv-stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
        @media(min-width:1024px){ .rv-stat-grid{ grid-template-columns:repeat(4,1fr); } }

        .rv-mid-grid { display:grid; grid-template-columns:1fr; gap:16px; margin-bottom:20px; }
        @media(min-width:900px){ .rv-mid-grid{ grid-template-columns:1fr 340px; } }

        .rv-card { background:#fff; border-radius:16px; padding:20px; box-shadow:0 1px 4px rgba(0,0,0,.08); border:1px solid #e6edf0; }
        .rv-card-title { font-size:${FONT_SIZE.base}; font-weight:${FONT_WEIGHT.semibold}; color:${COLORS.navy}; margin:0 0 16px; }

        .rv-table { width:100%; border-collapse:collapse; }
        .rv-table th { text-align:left; padding:9px 14px; font-size:11px; font-weight:600; color:#9ab0bb; text-transform:uppercase; letter-spacing:.5px; background:#f7fafb; border-bottom:1px solid #e6edf0; }
        .rv-table td { padding:10px 14px; font-size:13px; color:#374955; border-bottom:1px solid #f7fafb; vertical-align:middle; }
        .rv-table tr:last-child td { border-bottom:none; }
        .rv-table tr:hover td { background:#f7fafb; }

        .rv-desktop { display:none; }
        .rv-mobile  { display:flex; flex-direction:column; gap:10px; padding:12px; }
        @media(min-width:640px){ .rv-desktop{ display:block; } .rv-mobile{ display:none; } }

        .rv-filters { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:16px; }
        .rv-select {
          height:38px; padding:0 28px 0 12px; border:1px solid #e6edf0; border-radius:10px;
          background:#f7fafb; font-size:13px; color:#374955; outline:none;
          cursor:pointer; font-family:inherit; appearance:none;
        }
        .rv-select:focus { border-color: ${COLORS.brand}; }
        .rv-date { height:38px; padding:0 10px; border:1px solid #e6edf0; border-radius:10px; background:#f7fafb; font-size:13px; color:#374955; outline:none; font-family:inherit; }
        .rv-date:focus { border-color: ${COLORS.brand}; }
        .rv-fetching { opacity:0.65; pointer-events:none; transition:opacity .2s; }
      `}</style>

      <AdminPageShell
        title="Revenue Analytics"
        subtitle="Financial overview — all amounts in ₹ (Indian Rupees)"
      >
        {/* ── Summary error ────────────────────────────────────────── */}
        {summaryError && (
          <ErrorBanner
            message="Could not load revenue summary. Showing cached or zero values."
            onRetry={retrySummary}
          />
        )}

        {/* ── Stat cards ───────────────────────────────────────────── */}
        <div className="rv-stat-grid">
          {summaryLoading ? (
            <><StatCardSkeleton dark /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>
          ) : (
            <>
              <StatCard dark icon={<IndianRupee size={22} strokeWidth={1.8}/>}
                label="Total Revenue"
                value={fmtRupee(summary.totalRevenue)}
              />
              <StatCard icon={<IndianRupee size={20} strokeWidth={1.8}/>}
                label="This Month"
                value={fmtRupee(summary.thisMonth)}
              />
              <StatCard icon={<IndianRupee size={20} strokeWidth={1.8}/>}
                label="This Week"
                value={fmtRupee(summary.thisWeek)}
              />
              <StatCard icon={<ShoppingCart size={20} strokeWidth={1.8}/>}
                label="Total Orders"
                value={(summary.totalOrders ?? 0).toLocaleString('en-IN')}
              />
            </>
          )}
        </div>

        {/* ── Breakdown + Recent Transactions ─────────────────────── */}
        <div className="rv-mid-grid">
          {/* Revenue Breakdown */}
          <div className="rv-card">
            <p className="rv-card-title">Revenue Breakdown</p>
            {summaryLoading ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                {[1,2].map(i => (
                  <div key={i}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                      <div className="skeleton-pulse" style={{ height:'13px', width:'80px', borderRadius:'6px', background:'#e6edf0' }} />
                      <div className="skeleton-pulse" style={{ height:'13px', width:'60px', borderRadius:'6px', background:'#e6edf0' }} />
                    </div>
                    <div className="skeleton-pulse" style={{ height:'8px', borderRadius:'99px', background:'#e6edf0' }} />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <BreakdownBar
                  label="Packages"
                  revenue={breakdown.packages?.revenue ?? 0}
                  percentage={breakdown.packages?.percentage ?? 0}
                  color={COLORS.brand}
                />
                <BreakdownBar
                  label="Digital Products"
                  revenue={breakdown.digitalProducts?.revenue ?? 0}
                  percentage={breakdown.digitalProducts?.percentage ?? 0}
                  color="#f59e0b"
                />
                {/* Summary totals row */}
                <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginTop:'16px', paddingTop:'14px', borderTop:`1px solid ${COLORS.divider}` }}>
                  <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                    <Package size={14} color={COLORS.brand} />
                    <span style={{ fontSize:'12px', color: COLORS.muted }}>
                      Packages: <strong style={{ color: COLORS.navy }}>{fmtRupee(breakdown.packages?.revenue ?? 0)}</strong>
                    </span>
                  </div>
                  <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                    <BookOpen size={14} color="#f59e0b" />
                    <span style={{ fontSize:'12px', color: COLORS.muted }}>
                      Digital: <strong style={{ color: COLORS.navy }}>{fmtRupee(breakdown.digitalProducts?.revenue ?? 0)}</strong>
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="rv-card">
            <p className="rv-card-title">Recent Transactions</p>
            {summaryLoading ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                    <div className="skeleton-pulse" style={{ width:'32px', height:'32px', minWidth:'32px', borderRadius:'50%', background:'#e6edf0' }} />
                    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'5px' }}>
                      <div className="skeleton-pulse" style={{ height:'12px', width:'60%', borderRadius:'6px', background:'#e6edf0' }} />
                      <div className="skeleton-pulse" style={{ height:'10px', width:'80%', borderRadius:'6px', background:'#e6edf0' }} />
                    </div>
                    <div className="skeleton-pulse" style={{ height:'12px', width:'50px', borderRadius:'6px', background:'#e6edf0' }} />
                  </div>
                ))}
              </div>
            ) : recentTransactions.length === 0 ? (
              <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, textAlign:'center', padding:'20px 0' }}>
                No recent transactions
              </p>
            ) : (
              <div>
                {recentTransactions.map((tx, idx) => (
                  <div key={tx.id ?? idx} style={{ paddingBottom: idx === recentTransactions.length - 1 ? 0 : undefined }}>
                    <RecentTxItem tx={tx} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── All Orders ──────────────────────────────────────────── */}
        <div style={{ background:'#fff', borderRadius:'16px', boxShadow:'0 1px 4px rgba(0,0,0,.08)', border:`1px solid ${COLORS.divider}`, overflow:'hidden' }}>
          {/* Table header row */}
          <div style={{ padding:'14px 16px', borderBottom:`1px solid ${COLORS.divider}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
            <p style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, margin:0 }}>
              All Orders
              {pagination.totalItems > 0 && (
                <span style={{ fontSize:'12px', fontWeight:400, color: COLORS.muted, marginLeft:'8px' }}>
                  ({pagination.totalItems.toLocaleString('en-IN')})
                </span>
              )}
            </p>
          </div>

          {/* Filters */}
          <div style={{ padding:'12px 16px', borderBottom:`1px solid ${COLORS.divider}` }}>
            {!dateRangeValid() && (
              <div style={{ marginBottom:'8px', padding:'6px 12px', borderRadius:'8px', background:'#fff7ed', border:'1px solid #fed7aa', fontSize:'12px', color:'#c2410c', display:'flex', alignItems:'center', gap:'6px' }}>
                <AlertTriangle size={13} color="#ea580c" />
                "To Date" must be on or after "From Date"
              </div>
            )}
            <div className="rv-filters">
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <Filter size={14} color={COLORS.muted} />
              </div>
              <select className="rv-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}>
                {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select className="rv-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as OrderItemType | '')}>
                {TYPE_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                <input
                  type="date"
                  className="rv-date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(e) => setFromDate(e.target.value)}
                  title="From date"
                  aria-label="From date"
                />
                <span style={{ fontSize:'12px', color: COLORS.muted }}>to</span>
                <input
                  type="date"
                  className="rv-date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => setToDate(e.target.value)}
                  title="To date"
                  aria-label="To date"
                />
              </div>
              {hasFilters && (
                <button onClick={clearFilters} style={{
                  height:'38px', padding:'0 12px', borderRadius:'10px',
                  border:'1px solid #fed7aa', background:'#fff7ed',
                  color:'#c2410c', fontSize:'12px', fontWeight: FONT_WEIGHT.semibold,
                  cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', whiteSpace:'nowrap',
                }}>
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Orders error */}
          {ordersError && (
            <div style={{ padding:'12px 16px' }}>
              <ErrorBanner message="Could not load orders. Please try again." onRetry={retryOrders} />
            </div>
          )}

          {/* Desktop table */}
          <div className={`rv-desktop${ordersFetching && !ordersLoading ? ' rv-fetching' : ''}`}>
            {ordersLoading ? (
              <div style={{ overflowX:'auto' }}>
                <table className="rv-table">
                  <thead><tr>
                    <th>Patient</th><th>Item</th><th>Type</th>
                    <th>Amount</th><th>Status</th><th>Date</th><th>Payment ID</th>
                  </tr></thead>
                  <tbody>{Array.from({ length: limit }).map((_, i) => <SkeletonRow key={i} />)}</tbody>
                </table>
              </div>
            ) : orders.length === 0 ? (
              <AdminEmptyState
                icon={<Search size={22} />}
                title={hasFilters ? 'No orders match your filters' : 'No orders found'}
                description={hasFilters ? 'Try adjusting filters or date range' : 'Orders will appear here once patients make purchases'}
              />
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table className="rv-table">
                  <thead><tr>
                    <th>Patient</th><th>Item</th><th>Type</th>
                    <th>Amount</th><th>Status</th><th>Date</th><th>Payment ID</th>
                  </tr></thead>
                  <tbody>
                    {orders.map((o) => <OrderRow key={o.id} order={o} />)}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className={`rv-mobile${ordersFetching && !ordersLoading ? ' rv-fetching' : ''}`}>
            {ordersLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : orders.length === 0
                ? <AdminEmptyState
                    icon={<Search size={22} />}
                    title={hasFilters ? 'No orders match filters' : 'No orders found'}
                    description={hasFilters ? 'Try adjusting filters' : 'Orders appear here once patients make purchases'}
                  />
                : orders.map((o) => <OrderCard key={o.id} order={o} />)
            }
          </div>

          {/* Pagination */}
          {!ordersLoading && pagination.totalItems > 0 && (
            <PaginationBar
              page={page}
              totalPages={pagination.totalPages ?? 1}
              totalItems={pagination.totalItems ?? 0}
              limit={limit}
              isFetching={ordersFetching}
              onPage={(p) => setPage(p)}
              onLimit={(l) => { setLimit(l); setPage(1) }}
            />
          )}
        </div>
      </AdminPageShell>
    </>
  )
}
