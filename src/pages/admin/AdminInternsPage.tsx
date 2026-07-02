import { useState, useCallback, useEffect, useRef } from 'react'
import { GraduationCap, Search, Eye, Pencil, Trash2, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, X } from 'lucide-react'
import AdminPageShell    from '@/components/admin/AdminPageShell'
import StatCard          from '@/components/admin/StatCard'
import StatusBadge       from '@/components/admin/StatusBadge'
import AdminBtn          from '@/components/admin/AdminBtn'
import AdminEmptyState   from '@/components/admin/AdminEmptyState'
import ConfirmModal      from '@/components/ui/ConfirmModal'
import InternDetailModal from '@/components/admin/InternDetailModal'
import InternFormModal   from '@/components/admin/InternFormModal'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import { useAdminInterns, useAdminInternsSummary, DEFAULT_INTERNS_LIMIT } from '@/hooks/useAdminInterns'
import { useDeleteIntern } from '@/hooks/useAdminInternMutations'
import type { AdminIntern } from '@/types'

const STATUS_OPTS = [
  { value: '',         label: 'All Status' },
  { value: 'ACTIVE',   label: 'Active'     },
  { value: 'INACTIVE', label: 'Inactive'   },
  { value: 'PENDING',  label: 'Pending'    },
]

const APPROVAL_OPTS = [
  { value: '',      label: 'All Approval' },
  { value: 'true',  label: 'Approved'     },
  { value: 'false', label: 'Pending'      },
]

const PAGE_SIZE_OPTS = [10, 20, 50]

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
  catch { return '—' }
}

function Av({ name, photoUrl }: { name: string | null; photoUrl: string | null }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name ?? 'Intern'}
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
    }}>{getInitials(name)}</div>
  )
}

function ApprovalBadge({ isApproved }: { isApproved: boolean | undefined | null }) {
  if (isApproved == null) return <span style={{ color: COLORS.muted, fontSize: '12px' }}>—</span>
  return (
    <span style={{
      background: isApproved ? '#f0fdf4' : '#fffbeb',
      color: isApproved ? '#16a34a' : '#d97706',
      borderRadius: '6px', padding: '2px 8px', fontSize: '12px', fontWeight: FONT_WEIGHT.semibold,
    }}>
      {isApproved ? 'Approved' : 'Pending'}
    </span>
  )
}

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

function SkeletonRow() {
  return (
    <tr>
      {[44, 120, 100, 80, 60, 70, 80].map((w, i) => (
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

function StatCardSkeleton() {
  return (
    <div style={{
      background: COLORS.white, borderRadius: '16px', padding: '20px',
      boxShadow: SHADOW.card, border: `1px solid ${COLORS.divider}`,
      display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '92px',
    }}>
      <div className="skeleton-pulse" style={{ height:'12px', width:'60%', borderRadius:'6px', background:'#e6edf0' }} />
      <div className="skeleton-pulse" style={{ height:'28px', width:'40%', borderRadius:'6px', background:'#e6edf0' }} />
    </div>
  )
}

function ErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'10px',
      padding:'12px 16px', borderRadius:'12px',
      background:'#fff7ed', border:'1px solid #fed7aa', marginBottom:'16px', flexWrap:'wrap',
    }}>
      <AlertTriangle size={16} color="#ea580c" />
      <span style={{ flex:1, fontSize: FONT_SIZE.sm, color:'#c2410c', minWidth:'180px' }}>
        Failed to load interns. Please check your connection and try again.
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

interface PaginationBarProps {
  page: number; totalPages: number; totalItems: number; limit: number; isFetching: boolean;
  onPage: (p: number) => void; onLimit: (l: number) => void;
}

function PaginationBar({ page, totalPages, totalItems, limit, isFetching, onPage, onLimit }: PaginationBarProps) {
  const safePage  = Math.max(1, page)
  const safeTotal = Math.max(1, totalPages)
  const from      = totalItems === 0 ? 0 : (safePage - 1) * limit + 1
  const to        = Math.min(safePage * limit, totalItems)

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
      display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px',
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
          {PAGE_SIZE_OPTS.map(s => <option key={s} value={s}>{s} / page</option>)}
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

function InternRow({ i, onView, onEdit, onDelete }: { i: AdminIntern; onView: (id: string) => void; onEdit: (id: string) => void; onDelete: (i: AdminIntern) => void }) {
  const profile = i.internProfile

  return (
    <tr onClick={() => onView(i.id)} style={{ cursor: 'pointer' }}>
      <td>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <Av name={i.fullName} photoUrl={i.profilePhotoUrl} />
          <div>
            <p style={{ margin:0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>
              {i.fullName || '—'}
            </p>
            <p style={{ margin:0, fontSize:'11px', color: COLORS.muted }}>{i.email || '—'}</p>
          </div>
        </div>
      </td>
      <td style={{ color: COLORS.muted }}>{profile?.universityName || '—'}</td>
      <td>{profile?.specialization || '—'}</td>
      <td style={{ color: COLORS.muted }}>
        {profile?.semester != null ? `Sem ${profile.semester}` : '—'}
        {profile?.year ? ` / ${profile.year}` : ''}
      </td>
      <td><StatusBadge status={i.accountStatus?.toLowerCase() ?? 'unknown'} /></td>
      <td><ApprovalBadge isApproved={profile?.isApproved} /></td>
      <td style={{ color: COLORS.muted, fontSize:'12px' }}>{formatDate(i.createdAt)}</td>
      <td onClick={(e) => e.stopPropagation()}>
        <div style={{ display:'flex', gap:'4px' }}>
          <ActionBtn title="View"   color={COLORS.muted}  onClick={() => onView(i.id)}>
            <Eye size={15} strokeWidth={1.8} />
          </ActionBtn>
          <ActionBtn title="Edit"   color={COLORS.brand}  onClick={() => onEdit(i.id)}>
            <Pencil size={15} strokeWidth={1.8} />
          </ActionBtn>
          <ActionBtn title="Delete" color="#dc2626"        onClick={() => onDelete(i)}>
            <Trash2 size={15} strokeWidth={1.8} />
          </ActionBtn>
        </div>
      </td>
    </tr>
  )
}

function InternCard({ i, onView, onEdit, onDelete }: { i: AdminIntern; onView: (id: string) => void; onEdit: (id: string) => void; onDelete: (i: AdminIntern) => void }) {
  const profile = i.internProfile

  return (
    <div
      onClick={() => onView(i.id)}
      style={{
        display:'flex', alignItems:'center', gap:'12px',
        padding:'12px 14px', borderRadius:'12px', background:'#f7fafb',
        border:`1px solid ${COLORS.divider}`, cursor: 'pointer',
      }}
    >
      <Av name={i.fullName} photoUrl={i.profilePhotoUrl} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'8px', flexWrap:'wrap' }}>
          <span style={{ fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>
            {i.fullName || '—'}
          </span>
          <StatusBadge status={i.accountStatus?.toLowerCase() ?? 'unknown'} />
        </div>
        <p style={{ margin:'2px 0 0', fontSize:'12px', color: COLORS.muted }}>
          {profile?.universityName || i.email || '—'}
        </p>
        <p style={{ margin:'2px 0 4px', fontSize:'12px', color: COLORS.muted }}>
          {profile?.specialization || '—'}
          {profile?.semester != null ? ` · Sem ${profile.semester}` : ''}
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
          <ApprovalBadge isApproved={profile?.isApproved} />
        </div>
        <div onClick={(e) => e.stopPropagation()} style={{ display:'flex', gap:'4px' }}>
          <ActionBtn title="View"   color={COLORS.muted}  onClick={() => onView(i.id)}>
            <Eye size={14} strokeWidth={1.8} />
          </ActionBtn>
          <ActionBtn title="Edit"   color={COLORS.brand}  onClick={() => onEdit(i.id)}>
            <Pencil size={14} strokeWidth={1.8} />
          </ActionBtn>
          <ActionBtn title="Delete" color="#dc2626"        onClick={() => onDelete(i)}>
            <Trash2 size={14} strokeWidth={1.8} />
          </ActionBtn>
        </div>
      </div>
    </div>
  )
}

export default function AdminInternsPage() {
  const [searchInput,   setSearchInput]   = useState('')
  const [searchTerm,    setSearchTerm]    = useState('')
  const [statusFilter,  setStatusFilter]  = useState('')
  const [approvalFilter, setApprovalFilter] = useState('')
  const [page,          setPage]          = useState(1)
  const [limit,         setLimit]         = useState(DEFAULT_INTERNS_LIMIT)
  const [selectedId,    setSelectedId]    = useState<string | null>(null)
  const [editId,        setEditId]        = useState<string | null>(null)
  const [isCreating,    setIsCreating]    = useState(false)
  const [deleteTarget,  setDeleteTarget]  = useState<AdminIntern | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearchChange = useCallback((val: string) => {
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearchTerm(val)
      setPage(1)
    }, 400)
  }, [])

  useEffect(() => { setPage(1) }, [statusFilter, approvalFilter, limit])

  const { summary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } =
    useAdminInternsSummary()

  const { interns, pagination, isLoading, isFetching, isError, refetch } =
    useAdminInterns({ page, limit, searchTerm, statusFilter, isApproved: approvalFilter })

  const deleteMutation = useDeleteIntern(() => setDeleteTarget(null))

  const hasActiveFilters = !!searchTerm || !!statusFilter || !!approvalFilter

  const clearFilters = () => {
    setSearchInput(''); setSearchTerm('')
    setStatusFilter(''); setApprovalFilter('')
    setPage(1)
  }

  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }

        .it-stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
        @media(min-width:1024px){ .it-stat-grid{grid-template-columns:repeat(4,1fr);} }

        .it-table { width:100%; border-collapse:collapse; }
        .it-table th { text-align:left;padding:9px 14px;font-size:11px;font-weight:600;color:#9ab0bb;text-transform:uppercase;letter-spacing:.5px;background:#f7fafb;border-bottom:1px solid #e6edf0; }
        .it-table td { padding:10px 14px;font-size:13px;color:#374955;border-bottom:1px solid #f7fafb;vertical-align:middle; }
        .it-table tr:last-child td{border-bottom:none;}
        .it-table tr:hover td{background:#f0f8fa; cursor: pointer;}
        .it-table-wrap { overflow-x:auto; }

        .it-desktop{display:none;}
        .it-mobile{display:flex;flex-direction:column;gap:10px;padding:12px;}
        @media(min-width:768px){.it-desktop{display:block;}.it-mobile{display:none;}}

        .it-filters{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px;}
        .it-search-wrap{flex:1;min-width:180px;max-width:320px;position:relative;display:flex;align-items:center;}
        .it-search{width:100%;height:38px;padding:0 30px 0 34px;border:1px solid #e6edf0;border-radius:10px;background:#f7fafb;font-size:13px;color:#374955;outline:none;font-family:inherit;box-sizing:border-box;}
        .it-search:focus { border-color: ${COLORS.brand}; background:#fff; }
        .it-select{height:38px;padding:0 28px 0 12px;border:1px solid #e6edf0;border-radius:10px;background:#f7fafb;font-size:13px;color:#374955;outline:none;cursor:pointer;font-family:inherit;appearance:none;}
        .it-select:focus { border-color: ${COLORS.brand}; }
        .it-fetching { opacity: 0.65; pointer-events: none; transition: opacity 0.2s; }
      `}</style>

      <AdminPageShell
        title="Intern Management"
        subtitle={`${pagination.totalItems > 0 ? `${pagination.totalItems} interns enrolled` : 'Manage internship enrollments and approvals'}`}
        actions={
          <AdminBtn icon={<GraduationCap size={15}/>} onClick={() => setIsCreating(true)}>
            Add Intern
          </AdminBtn>
        }
      >
        {summaryError && <ErrorBanner onRetry={refetchSummary} />}

        <div className="it-stat-grid">
          {summaryLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard icon={<GraduationCap size={20} strokeWidth={1.8}/>} label="Total Interns"       value={summary.totalInterns} />
              <StatCard icon={<GraduationCap size={20} strokeWidth={1.8}/>} label="Approved"            value={summary.approved}     accentColor="#16a34a" />
              <StatCard icon={<GraduationCap size={20} strokeWidth={1.8}/>} label="Pending Approval"    value={summary.pending}      accentColor="#d97706" />
              <StatCard icon={<GraduationCap size={20} strokeWidth={1.8}/>} label="Completed Courses"   value={summary.completedCourses} />
            </>
          )}
        </div>

        {isError && <ErrorBanner onRetry={refetch} />}

        <div className="it-filters">
          <div className="it-search-wrap">
            <Search size={15} style={{ position:'absolute', left:'10px', color: COLORS.muted, pointerEvents:'none' }} />
            <input
              className="it-search"
              placeholder="Search by name, university, email…"
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

          <select className="it-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select className="it-select" value={approvalFilter} onChange={(e) => setApprovalFilter(e.target.value)}>
            {APPROVAL_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
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

        <div
          className={isFetching && !isLoading ? 'it-fetching' : ''}
          style={{ background:'#fff', borderRadius:'16px', boxShadow: SHADOW.card, border:`1px solid ${COLORS.divider}`, overflow:'hidden' }}
        >
          <div className="it-desktop">
            {isLoading ? (
              <div className="it-table-wrap">
                <table className="it-table">
                  <thead>
                    <tr>
                      <th>Intern</th><th>University</th><th>Specialization</th><th>Sem / Yr</th>
                      <th>Status</th><th>Approval</th><th>Joined</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: limit }).map((_, i) => <SkeletonRow key={i} />)}
                  </tbody>
                </table>
              </div>
            ) : interns.length === 0 ? (
              <AdminEmptyState
                icon={<GraduationCap size={22}/>}
                title={hasActiveFilters ? 'No interns match your filters' : 'No interns found'}
                description={hasActiveFilters ? 'Try adjusting your search or filters' : 'Interns will appear here once enrolled'}
              />
            ) : (
              <div className="it-table-wrap">
                <table className="it-table">
                  <thead>
                    <tr>
                      <th>Intern</th><th>University</th><th>Specialization</th><th>Sem / Yr</th>
                      <th>Status</th><th>Approval</th><th>Joined</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interns.map(i => (
                      <InternRow
                        key={i.id} i={i}
                        onView={(id) => setSelectedId(id)}
                        onEdit={(id) => setEditId(id)}
                        onDelete={(intern) => setDeleteTarget(intern)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="it-mobile">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : interns.length === 0
                ? <AdminEmptyState
                    icon={<GraduationCap size={22}/>}
                    title={hasActiveFilters ? 'No interns match your filters' : 'No interns found'}
                    description={hasActiveFilters ? 'Try adjusting search or filters' : 'Interns will appear here once enrolled'}
                  />
                : interns.map(i => (
                  <InternCard
                    key={i.id} i={i}
                    onView={(id) => setSelectedId(id)}
                    onEdit={(id) => setEditId(id)}
                    onDelete={(intern) => setDeleteTarget(intern)}
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
              onPage={(p) => setPage(p)}
              onLimit={(l) => { setLimit(l); setPage(1) }}
            />
          )}
        </div>
      </AdminPageShell>

      <InternDetailModal internId={selectedId} onClose={() => setSelectedId(null)} />

      <InternFormModal
        internId={isCreating ? null : editId}
        mode={isCreating ? 'create' : 'edit'}
        onClose={() => { setIsCreating(false); setEditId(null) }}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id) }}
        variant="danger"
        title={`Delete ${deleteTarget?.fullName ?? 'this intern'}?`}
        description="This will permanently remove the intern and all their course progress and certifications. This cannot be undone."
        confirmLabel="Delete Intern"
        loading={deleteMutation.isPending}
      />
    </>
  )
}
