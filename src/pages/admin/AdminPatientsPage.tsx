/**
 * AdminPatientsPage — Patient management with live API data,
 * server-side pagination, client-side search + status filter,
 * skeleton loading, error states, and null-safe rendering.
 */
import { useState, useCallback, useEffect, useRef } from 'react'
import { UserPlus, Search, Eye, Pencil, Trash2, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, X } from 'lucide-react'
import AdminPageShell    from '@/components/admin/AdminPageShell'
import StatusBadge       from '@/components/admin/StatusBadge'
import AdminBtn          from '@/components/admin/AdminBtn'
import AdminEmptyState   from '@/components/admin/AdminEmptyState'
import ConfirmModal      from '@/components/ui/ConfirmModal'
import PatientDetailModal from '@/components/admin/PatientDetailModal'
import PatientEditModal   from '@/components/admin/PatientEditModal'
import PatientCreateModal from '@/components/admin/PatientCreateModal'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import { useAdminPatients, DEFAULT_PATIENTS_LIMIT } from '@/hooks/useAdminPatients'
import { useDeletePatient } from '@/hooks/useAdminPatientMutations'import type { AdminPatient } from '@/types'
import { BLOOD_GROUP_LABELS } from '@/config/constants'

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_OPTS = [
  { value: '',         label: 'All Status' },
  { value: 'ACTIVE',   label: 'Active'     },
  { value: 'INACTIVE', label: 'Inactive'   },
  { value: 'PENDING',  label: 'Pending'    },
]

const BLOOD_OPTS = [
  { value: '',      label: 'All Blood Groups' },
  ...Object.entries(BLOOD_GROUP_LABELS).map(([v, l]) => ({ value: v, label: l })),
]

const PAGE_SIZE_OPTS = [10, 20, 50]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
  catch { return '—' }
}

function normalizeGender(g: string | null | undefined): string {
  if (!g) return '—'
  const map: Record<string, string> = { MALE: 'Male', FEMALE: 'Female', OTHER: 'Other', PREFER_NOT_TO_SAY: 'Prefer not to say' }
  return map[g] ?? g
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Av({ name, photoUrl }: { name: string | null; photoUrl: string | null }) {
  const initials = getInitials(name)
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name ?? 'Patient'}
        style={{ width:'36px', height:'36px', minWidth:'36px', borderRadius:'50%', objectFit:'cover' }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />
    )
  }
  return (
    <div style={{
      width:'36px', height:'36px', minWidth:'36px', borderRadius:'50%',
      background: COLORS.brandLight, color: COLORS.brand,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:'12px', fontWeight: FONT_WEIGHT.semibold,
    }}>{initials}</div>
  )
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      {[44, 120, 100, 80, 60, 70, 80].map((w, i) => (
        <td key={i} style={{ padding:'12px 14px' }}>
          <div className="skeleton-pulse" style={{
            height:'13px', width:`${w}px`, borderRadius:'6px', background:'#e6edf0',
          }} />
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
function ErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'10px',
      padding:'12px 16px', borderRadius:'12px',
      background:'#fff7ed', border:'1px solid #fed7aa', marginBottom:'16px', flexWrap:'wrap',
    }}>
      <AlertTriangle size={16} color="#ea580c" />
      <span style={{ flex:1, fontSize: FONT_SIZE.sm, color:'#c2410c', minWidth:'180px' }}>
        Failed to load patients. Please check your connection and try again.
      </span>
      <button onClick={onRetry} style={{
        display:'flex', alignItems:'center', gap:'5px',
        padding:'5px 12px', borderRadius:'7px', background:'#ea580c',
        color:'#fff', border:'none', cursor:'pointer',
        fontSize:'12px', fontWeight: FONT_WEIGHT.semibold, whiteSpace:'nowrap',
      }}>
        <RefreshCw size={12} /> Retry
      </button>
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
  const safePage  = Math.max(1, page)
  const safeTotal = Math.max(1, totalPages)
  const from      = totalItems === 0 ? 0 : (safePage - 1) * limit + 1
  const to        = Math.min(safePage * limit, totalItems)

  // Build page numbers: always show first, last, current ±1
  const pages: (number | '…')[] = []
  for (let i = 1; i <= safeTotal; i++) {
    if (i === 1 || i === safeTotal || (i >= safePage - 1 && i <= safePage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
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
        <select
          value={limit}
          onChange={(e) => onLimit(Number(e.target.value))}
          style={{
            height:'30px', padding:'0 8px', borderRadius:'8px',
            border:`1px solid ${COLORS.divider}`, background:'#f7fafb',
            fontSize:'12px', color:'#374955', outline:'none', cursor:'pointer',
          }}
        >
          {PAGE_SIZE_OPTS.map((s) => <option key={s} value={s}>{s} / page</option>)}
        </select>
      </div>

      <div style={{ display:'flex', gap:'4px', alignItems:'center' }}>
        <button
          onClick={() => onPage(safePage - 1)}
          disabled={safePage <= 1 || isFetching}
          style={{
            width:'30px', height:'30px', borderRadius:'8px', display:'flex',
            alignItems:'center', justifyContent:'center',
            border:`1px solid ${COLORS.divider}`, background:'#fff',
            cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
            color: safePage <= 1 ? COLORS.divider : COLORS.muted,
          }}
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p, i) =>
          p === '…'
            ? <span key={`ellipsis-${i}`} style={{ padding:'0 4px', fontSize:'12px', color: COLORS.muted }}>…</span>
            : (
              <button
                key={p}
                onClick={() => onPage(p as number)}
                disabled={isFetching}
                style={{
                  minWidth:'30px', height:'30px', padding:'0 6px', borderRadius:'8px',
                  border: p === safePage ? 'none' : `1px solid ${COLORS.divider}`,
                  background: p === safePage ? COLORS.brand : '#fff',
                  color: p === safePage ? '#fff' : '#374955',
                  fontSize:'12px', fontWeight: p === safePage ? FONT_WEIGHT.semibold : 'normal',
                  cursor: isFetching ? 'not-allowed' : 'pointer',
                }}
              >
                {p}
              </button>
            )
        )}

        <button
          onClick={() => onPage(safePage + 1)}
          disabled={safePage >= safeTotal || isFetching}
          style={{
            width:'30px', height:'30px', borderRadius:'8px', display:'flex',
            alignItems:'center', justifyContent:'center',
            border:`1px solid ${COLORS.divider}`, background:'#fff',
            cursor: safePage >= safeTotal ? 'not-allowed' : 'pointer',
            color: safePage >= safeTotal ? COLORS.divider : COLORS.muted,
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Reusable icon action button ──────────────────────────────────────────────
function ActionBtn({ title, color, onClick, children }: { title: string; color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      title={title}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      style={{ padding:'5px', borderRadius:'7px', border:'none', background:'transparent', cursor:'pointer', color, display:'flex' }}
    >
      {children}
    </button>
  )
}

// ─── Patient row / card renderers ─────────────────────────────────────────────
function PatientRow({ p, onView, onEdit, onDelete }: { p: AdminPatient; onView: (id: string) => void; onEdit: (id: string) => void; onDelete: (p: AdminPatient) => void }) {
  const profile    = p.patientProfile
  const bloodLabel = profile?.bloodGroup ? (BLOOD_GROUP_LABELS[profile.bloodGroup] ?? profile.bloodGroup) : '—'

  return (
    <tr onClick={() => onView(p.id)} style={{ cursor: 'pointer' }}>
      <td>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <Av name={p.fullName} photoUrl={p.profilePhotoUrl} />
          <div>
            <p style={{ margin:0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>
              {p.fullName || '—'}
            </p>
            <p style={{ margin:0, fontSize:'11px', color: COLORS.muted }}>
              {normalizeGender(profile?.gender)}{profile?.age ? `, ${profile.age}y` : ''}
            </p>
          </div>
        </div>
      </td>
      <td style={{ color: COLORS.muted }}>{p.email || '—'}</td>
      <td>{profile?.phoneNumber || '—'}</td>
      <td>
        <span style={{
          background: COLORS.brandLight, color: COLORS.brand,
          borderRadius:'6px', padding:'2px 8px', fontSize:'12px', fontWeight:600,
        }}>
          {bloodLabel}
        </span>
      </td>
      <td><StatusBadge status={p.accountStatus?.toLowerCase() ?? 'unknown'} /></td>
      <td style={{ color: COLORS.muted, fontSize:'12px' }}>{formatDate(p.createdAt)}</td>
      <td onClick={(e) => e.stopPropagation()}>
        <div style={{ display:'flex', gap:'4px' }}>
          <ActionBtn title="View"   color={COLORS.muted}  onClick={() => onView(p.id)}>
            <Eye size={15} strokeWidth={1.8} />
          </ActionBtn>
          <ActionBtn title="Edit"   color={COLORS.brand}  onClick={() => onEdit(p.id)}>
            <Pencil size={15} strokeWidth={1.8} />
          </ActionBtn>
          <ActionBtn title="Delete" color="#dc2626"        onClick={() => onDelete(p)}>
            <Trash2 size={15} strokeWidth={1.8} />
          </ActionBtn>
        </div>
      </td>
    </tr>
  )
}

function PatientCard({ p, onView, onEdit, onDelete }: { p: AdminPatient; onView: (id: string) => void; onEdit: (id: string) => void; onDelete: (p: AdminPatient) => void }) {
  const profile    = p.patientProfile
  const bloodLabel = profile?.bloodGroup ? (BLOOD_GROUP_LABELS[profile.bloodGroup] ?? profile.bloodGroup) : null

  return (
    <div
      onClick={() => onView(p.id)}
      style={{
        display:'flex', alignItems:'center', gap:'12px',
        padding:'12px 14px', borderRadius:'12px', background:'#f7fafb',
        border:`1px solid ${COLORS.divider}`, cursor: 'pointer',
      }}
    >
      <Av name={p.fullName} photoUrl={p.profilePhotoUrl} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'8px', flexWrap:'wrap' }}>
          <span style={{ fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>
            {p.fullName || '—'}
          </span>
          <StatusBadge status={p.accountStatus?.toLowerCase() ?? 'unknown'} />
        </div>
        <p style={{ margin:'2px 0 0', fontSize:'12px', color: COLORS.muted }}>
          {profile?.phoneNumber || p.email || '—'}
          {bloodLabel ? ` · ${bloodLabel}` : ''}
        </p>
        <p style={{ margin:'2px 0 4px', fontSize:'12px', color: COLORS.muted }}>
          Joined {formatDate(p.createdAt)}
          {profile?.location ? ` · ${profile.location}` : ''}
        </p>
        <div onClick={(e) => e.stopPropagation()} style={{ display:'flex', gap:'4px' }}>
          <ActionBtn title="View"   color={COLORS.muted}  onClick={() => onView(p.id)}>
            <Eye size={14} strokeWidth={1.8} />
          </ActionBtn>
          <ActionBtn title="Edit"   color={COLORS.brand}  onClick={() => onEdit(p.id)}>
            <Pencil size={14} strokeWidth={1.8} />
          </ActionBtn>
          <ActionBtn title="Delete" color="#dc2626"        onClick={() => onDelete(p)}>
            <Trash2 size={14} strokeWidth={1.8} />
          </ActionBtn>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminPatientsPage() {
  // ── Filter state ────────────────────────────────────────────────────────
  const [searchInput,   setSearchInput]   = useState('')
  const [searchTerm,    setSearchTerm]    = useState('')
  const [statusFilter,  setStatusFilter]  = useState('')
  const [bloodFilter,   setBloodFilter]   = useState('')
  const [page,          setPage]          = useState(1)
  const [limit,         setLimit]         = useState(DEFAULT_PATIENTS_LIMIT)
  const [selectedId,    setSelectedId]    = useState<string | null>(null)
  const [editId,        setEditId]        = useState<string | null>(null)
  const [isCreating,    setIsCreating]    = useState(false)
  const [deleteTarget,  setDeleteTarget]  = useState<AdminPatient | null>(null)

  // ── Debounce search (400 ms) ─────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearchChange = useCallback((val: string) => {
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearchTerm(val)
      setPage(1)          // reset to page 1 on new search
    }, 400)
  }, [])

  // Reset page when filter changes
  useEffect(() => { setPage(1) }, [statusFilter, bloodFilter, limit])

  // ── Data ─────────────────────────────────────────────────────────────────
  const { patients, pagination, isLoading, isFetching, isError, refetch } =
    useAdminPatients({ page, limit, searchTerm, statusFilter })

  const deleteMutation = useDeletePatient(() => setDeleteTarget(null))

  // Apply blood group filter client-side (API doesn't support it as param)
  const displayPatients = bloodFilter
    ? patients.filter((p) => p.patientProfile?.bloodGroup === bloodFilter)
    : patients

  const hasActiveFilters = !!searchTerm || !!statusFilter || !!bloodFilter

  const clearFilters = () => {
    setSearchInput(''); setSearchTerm('')
    setStatusFilter(''); setBloodFilter('')
    setPage(1)
  }

  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }

        .pt-table { width:100%; border-collapse:collapse; }
        .pt-table th {
          text-align:left; padding:9px 14px;
          font-size:11px; font-weight:600; color:#9ab0bb;
          text-transform:uppercase; letter-spacing:0.5px;
          background:#f7fafb; border-bottom:1px solid #e6edf0;
        }
        .pt-table td {
          padding:10px 14px; font-size:13px; color:#374955;
          border-bottom:1px solid #f7fafb; vertical-align:middle;
        }
        .pt-table tr:last-child td { border-bottom:none; }
        .pt-table tr:hover td { background:#f0f8fa; cursor: pointer; }
        .pt-table-wrap { overflow-x:auto; }

        .pt-desktop { display:none; }
        .pt-mobile  { display:flex; flex-direction:column; gap:10px; padding:12px; }
        @media (min-width:768px) {
          .pt-desktop { display:block; }
          .pt-mobile  { display:none; }
        }

        .pt-filters {
          display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:16px;
        }
        .pt-search-wrap {
          flex:1; min-width:180px; max-width:320px; position:relative; display:flex; align-items:center;
        }
        .pt-search {
          width:100%; height:38px; padding:0 30px 0 34px;
          border:1px solid #e6edf0; border-radius:10px;
          background:#f7fafb; font-size:13px; color:#374955;
          outline:none; font-family:inherit; box-sizing:border-box;
        }
        .pt-search:focus { border-color: ${COLORS.brand}; background:#fff; }
        .pt-select {
          height:38px; padding:0 28px 0 12px;
          border:1px solid #e6edf0; border-radius:10px;
          background:#f7fafb; font-size:13px; color:#374955;
          outline:none; cursor:pointer; font-family:inherit; appearance:none;
        }
        .pt-select:focus { border-color: ${COLORS.brand}; }
        .pt-fetching { opacity: 0.65; pointer-events: none; transition: opacity 0.2s; }
      `}</style>

      <AdminPageShell
        title="Patient Management"
        subtitle={`${pagination.totalItems > 0 ? `${pagination.totalItems} registered patients` : 'Manage all registered patients'}`}
        actions={
          <AdminBtn icon={<UserPlus size={15} />} onClick={() => setIsCreating(true)}>
            Add Patient
          </AdminBtn>
        }
      >
        {isError && <ErrorBanner onRetry={refetch} />}

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <div className="pt-filters">
          <div className="pt-search-wrap">
            <Search size={15} style={{ position:'absolute', left:'10px', color: COLORS.muted, pointerEvents:'none' }} />
            <input
              className="pt-search"
              placeholder="Search by name, email, phone…"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchInput && (
              <button
                onClick={() => handleSearchChange('')}
                style={{ position:'absolute', right:'8px', background:'none', border:'none', cursor:'pointer', color: COLORS.muted, display:'flex', padding:'2px' }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          <select className="pt-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select className="pt-select" value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)}>
            {BLOOD_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {hasActiveFilters && (
            <button onClick={clearFilters} style={{
              height:'38px', padding:'0 12px', borderRadius:'10px',
              border:`1px solid #fed7aa`, background:'#fff7ed',
              color:'#c2410c', fontSize:'12px', fontWeight: FONT_WEIGHT.semibold,
              cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', whiteSpace:'nowrap',
            }}>
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* ── Table card ──────────────────────────────────────────────── */}
        <div
          className={isFetching && !isLoading ? 'pt-fetching' : ''}
          style={{ background:'#fff', borderRadius:'16px', boxShadow: SHADOW.card, border:`1px solid ${COLORS.divider}`, overflow:'hidden' }}
        >
          {/* Desktop table */}
          <div className="pt-desktop">
            {isLoading ? (
              <div className="pt-table-wrap">
                <table className="pt-table">
                  <thead>
                    <tr>
                      <th>Patient</th><th>Email</th><th>Phone</th>
                      <th>Blood Grp</th><th>Status</th><th>Joined</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: limit }).map((_, i) => <SkeletonRow key={i} />)}
                  </tbody>
                </table>
              </div>
            ) : displayPatients.length === 0 ? (
              <AdminEmptyState
                icon={<UserPlus size={22} />}
                title={hasActiveFilters ? 'No patients match your filters' : 'No patients found'}
                description={hasActiveFilters ? 'Try adjusting your search or filters' : 'Patients will appear here once registered'}
              />
            ) : (
              <div className="pt-table-wrap">
                <table className="pt-table">
                  <thead>
                    <tr>
                      <th>Patient</th><th>Email</th><th>Phone</th>
                      <th>Blood Grp</th><th>Status</th><th>Joined</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayPatients.map((p) => (
                      <PatientRow
                        key={p.id} p={p}
                        onView={(id) => setSelectedId(id)}
                        onEdit={(id) => setEditId(id)}
                        onDelete={(pt) => setDeleteTarget(pt)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="pt-mobile">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : displayPatients.length === 0
                ? <AdminEmptyState
                    icon={<UserPlus size={22} />}
                    title={hasActiveFilters ? 'No patients match your filters' : 'No patients found'}
                    description={hasActiveFilters ? 'Try adjusting search or filters' : 'Patients will appear here once registered'}
                  />
                : displayPatients.map((p) => (
                  <PatientCard
                    key={p.id} p={p}
                    onView={(id) => setSelectedId(id)}
                    onEdit={(id) => setEditId(id)}
                    onDelete={(pt) => setDeleteTarget(pt)}
                  />
                ))
            }
          </div>

          {/* Pagination */}
          {!isLoading && pagination.totalItems > 0 && (
            <PaginationBar
              page={page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              limit={limit}
              isFetching={isFetching}
              onPage={(p) => setPage(p)}
              onLimit={(l) => { setLimit(l); setPage(1) }}
            />
          )}
        </div>
      </AdminPageShell>

      <PatientDetailModal
        patientId={selectedId}
        onClose={() => setSelectedId(null)}
      />

      <PatientCreateModal
        open={isCreating}
        onClose={() => setIsCreating(false)}
      />

      <PatientEditModal
        patientId={editId}
        onClose={() => setEditId(null)}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id) }}
        variant="danger"
        title={`Delete ${deleteTarget?.fullName ?? 'this patient'}?`}
        description="This will permanently remove the patient and all associated data including their profile, appointments, and reports. This cannot be undone."
        confirmLabel="Delete Patient"
        loading={deleteMutation.isPending}
      />
    </>
  )
}
