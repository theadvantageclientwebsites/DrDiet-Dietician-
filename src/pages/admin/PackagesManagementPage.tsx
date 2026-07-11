/**
 * PackagesManagementPage — Live API-integrated package management
 * Real API shape: flat price fields (price1Month, price3Months, price6Months),
 * category as plain string ("Thyroid", "Diabetes", etc.), separate status
 * toggle endpoint (PATCH /status), update via PUT.
 * Follows the same patterns as AdminPatientsPage.
 */
import { useState, useCallback, useEffect, useRef } from 'react'
import {
  Package, Pencil, Trash2, Plus, X as XIcon,
  AlertTriangle, RefreshCw, Search, ChevronLeft, ChevronRight,
} from 'lucide-react'
import AdminPageShell  from '@/components/admin/AdminPageShell'
import AdminBtn        from '@/components/admin/AdminBtn'
import AdminFormModal  from '@/components/admin/AdminFormModal'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import ConfirmModal    from '@/components/ui/ConfirmModal'
import FormField       from '@/components/shared/FormField'
import SelectField     from '@/components/shared/SelectField'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import { useAdminPackages, DEFAULT_PACKAGES_LIMIT } from '@/hooks/useAdminPackages'
import {
  useCreateAdminPackage,
  useUpdateAdminPackage,
  useToggleAdminPackageStatus,
  useDeleteAdminPackage,
} from '@/hooks/useAdminPackageMutations'
import type { AdminPackage, AdminPackageCreatePayload, AdminPackageUpdatePayload } from '@/types'

// ─── Constants ────────────────────────────────────────────────────────────────
// Category values sent to / received from the API (plain strings, not enums)
const CAT_OPTS = [
  { value: 'Thyroid',     label: 'Thyroid'         },
  { value: 'Diabetes',    label: 'Diabetes'        },
  { value: 'Weight Loss', label: 'Weight Loss'     },
  { value: 'General',     label: 'General Wellness'},
  { value: 'Other',       label: 'Other'           },
]

const CAT_FILTER_OPTS = [
  { value: '',            label: 'All Categories' },
  ...CAT_OPTS,
]

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  Thyroid:      { bg: '#eff6ff', text: '#2563eb' },
  Diabetes:     { bg: '#fef3c7', text: '#d97706' },
  'Weight Loss':{ bg: '#dcfce7', text: '#16a34a' },
  General:      { bg: COLORS.brandLight, text: COLORS.brand },
}
const fallbackCatColor = { bg: '#f0f4f6', text: '#6b8896' }

const PAGE_SIZE_OPTS = [10, 20, 50]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function priceStr(n: number | null | undefined): string {
  if (n == null) return '—'
  return `₹${n.toLocaleString('en-IN')}`
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
        Failed to load packages. Please check your connection and try again.
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

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.divider}`,
      boxShadow: SHADOW.card, overflow: 'hidden',
    }}>
      <div style={{ padding: '18px 18px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="skeleton-pulse" style={{ height: '20px', width: '45%', borderRadius: '99px', background: '#e6edf0' }} />
        <div className="skeleton-pulse" style={{ height: '18px', width: '70%', borderRadius: '6px', background: '#e6edf0' }} />
        <div className="skeleton-pulse" style={{ height: '13px', width: '90%', borderRadius: '6px', background: '#e6edf0' }} />
        <div style={{ display: 'flex', gap: '6px' }}>
          {[55, 65, 65].map((w, i) => (
            <div key={i} className="skeleton-pulse" style={{ height: '24px', width: `${w}px`, borderRadius: '6px', background: '#e6edf0' }} />
          ))}
        </div>
      </div>
      <div style={{ padding: '12px 18px', borderTop: `1px solid #f0f4f6`, display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton-pulse" style={{ height: '20px', width: '60px', borderRadius: '99px', background: '#e6edf0' }} />
        <div style={{ display: 'flex', gap: '6px' }}>
          <div className="skeleton-pulse" style={{ height: '28px', width: '52px', borderRadius: '8px', background: '#e6edf0' }} />
          <div className="skeleton-pulse" style={{ height: '28px', width: '60px', borderRadius: '8px', background: '#e6edf0' }} />
        </div>
      </div>
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
  const btnBase: React.CSSProperties = { height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: 'pointer' }
  return (
    <div style={{ padding: '12px 16px', borderTop: `1px solid ${COLORS.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: COLORS.muted }}>
          {totalItems === 0 ? 'No results' : `${from}–${to} of ${totalItems}`}
          {isFetching && <span style={{ marginLeft: '6px', color: COLORS.brand }}>loading…</span>}
        </span>
        <select value={limit} onChange={e => onLimit(Number(e.target.value))} style={{ height: '30px', padding: '0 8px', borderRadius: '8px', border: `1px solid ${COLORS.divider}`, background: '#f7fafb', fontSize: '12px', color: '#374955', outline: 'none', cursor: 'pointer' }}>
          {PAGE_SIZE_OPTS.map(s => <option key={s} value={s}>{s} / page</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button onClick={() => onPage(safePage - 1)} disabled={safePage <= 1 || isFetching} style={{ ...btnBase, width: '30px', cursor: safePage <= 1 ? 'not-allowed' : 'pointer', color: safePage <= 1 ? COLORS.divider : COLORS.muted }}>
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) =>
          p === '…'
            ? <span key={`e${i}`} style={{ padding: '0 4px', fontSize: '12px', color: COLORS.muted }}>…</span>
            : <button key={p} onClick={() => onPage(p as number)} disabled={isFetching} style={{ ...btnBase, minWidth: '30px', padding: '0 6px', border: p === safePage ? 'none' : `1px solid ${COLORS.divider}`, background: p === safePage ? COLORS.brand : '#fff', color: p === safePage ? '#fff' : '#374955', fontWeight: p === safePage ? FONT_WEIGHT.semibold : 400, cursor: isFetching ? 'not-allowed' : 'pointer' }}>{p}</button>
        )}
        <button onClick={() => onPage(safePage + 1)} disabled={safePage >= safeTotal || isFetching} style={{ ...btnBase, width: '30px', cursor: safePage >= safeTotal ? 'not-allowed' : 'pointer', color: safePage >= safeTotal ? COLORS.divider : COLORS.muted }}>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Package form (controlled, matches flat API shape) ────────────────────────
interface PackageFormProps {
  formId:   string
  pkg?:     AdminPackage | null
  onSubmit: (payload: AdminPackageCreatePayload) => void
}

function PackageForm({ formId, pkg, onSubmit }: PackageFormProps) {
  const [name,        setName]        = useState(pkg?.name         ?? '')
  const [category,    setCategory]    = useState(pkg?.category     ?? '')
  const [description, setDescription] = useState(pkg?.description  ?? '')
  const [price1Month, setPrice1Month] = useState(String(pkg?.price1Month  ?? ''))
  const [price3Months,setPrice3Months]= useState(String(pkg?.price3Months ?? ''))
  const [price6Months,setPrice6Months]= useState(String(pkg?.price6Months ?? ''))
  const [features,    setFeatures]    = useState<string[]>(pkg?.features ?? [])
  const [featureInput,setFeatureInput]= useState('')
  const [isActive,    setIsActive]    = useState(pkg?.isActive ?? true)

  const addFeature = () => {
    const val = featureInput.trim()
    if (!val) return
    setFeatures(f => [...f, val])
    setFeatureInput('')
  }
  const removeFeature = (i: number) => setFeatures(f => f.filter((_, idx) => idx !== i))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name:        name.trim(),
      category,
      description: description.trim() || undefined,
      price1Month:  Number(price1Month)  || 0,
      price3Months: Number(price3Months) || 0,
      price6Months: Number(price6Months) || 0,
      features,
      isActive,
    })
  }

  const priceInputStyle: React.CSSProperties = {
    width: '100%', height: '38px', padding: '0 12px',
    borderRadius: '10px', border: `1px solid ${COLORS.inputBorder}`,
    background: COLORS.inputBg, fontSize: FONT_SIZE.sm, color: COLORS.navy,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <FormField id="pkg-name" label="Package Name" placeholder="eg. Thyroid Management"
            value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <SelectField id="pkg-cat" label="Category" options={CAT_OPTS}
          value={category} onChange={v => setCategory(v)} placeholder="Select category" />
        <div className="sm:col-span-2">
          <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, display: 'block', marginBottom: '6px' }}>
            Description <span style={{ color: COLORS.muted, fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            placeholder="Describe the package benefits…"
            style={{ width: '100%', borderRadius: '10px', border: `1px solid ${COLORS.inputBorder}`, background: COLORS.inputBg, padding: '10px 12px', fontSize: FONT_SIZE.sm, color: COLORS.navy, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Pricing */}
      <div>
        <p style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, marginBottom: '10px' }}>
          Pricing (₹) <span style={{ color: COLORS.muted, fontWeight: 400, fontSize: '12px' }}>— all durations required</span>
        </p>
        <div className="grid grid-cols-3 gap-3">
          {([
            ['1 Month',  price1Month,  setPrice1Month ],
            ['3 Months', price3Months, setPrice3Months],
            ['6 Months', price6Months, setPrice6Months],
          ] as [string, string, (v: string) => void][]).map(([label, val, set]) => (
            <div key={label}>
              <label style={{ fontSize: '12px', fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, display: 'block', marginBottom: '5px' }}>{label}</label>
              <input type="number" min="0" value={val} onChange={e => set(e.target.value)}
                placeholder="0" required style={priceInputStyle} />
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <p style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, marginBottom: '8px' }}>
          Features <span style={{ color: COLORS.muted, fontWeight: 400, fontSize: '12px' }}>(optional)</span>
        </p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <input value={featureInput} onChange={e => setFeatureInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }}
            placeholder="Add a feature and press Enter or Add…"
            style={{ flex: 1, height: '38px', padding: '0 12px', border: `1px solid ${COLORS.inputBorder}`, borderRadius: '10px', background: COLORS.inputBg, fontSize: FONT_SIZE.sm, color: COLORS.navy, outline: 'none', fontFamily: 'inherit' }}
          />
          <button type="button" onClick={addFeature}
            style={{ padding: '0 14px', borderRadius: '10px', background: COLORS.brand, border: 'none', color: '#fff', cursor: 'pointer', fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, fontFamily: 'inherit' }}>
            Add
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {features.map((f, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: COLORS.brandLight, color: COLORS.brand, padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600 }}>
              {f}
              <button type="button" onClick={() => removeFeature(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: COLORS.brand }}>
                <XIcon size={11} strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Active toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button type="button" onClick={() => setIsActive(v => !v)} aria-pressed={isActive}
          style={{ width: '42px', height: '22px', borderRadius: '99px', background: isActive ? COLORS.brand : COLORS.divider, border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: '3px', left: isActive ? undefined : '3px', right: isActive ? '3px' : undefined, width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.15s, right 0.15s' }} />
        </button>
        <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>
          {isActive ? 'Active' : 'Inactive'}
        </label>
      </div>
    </form>
  )
}

// ─── Package card ─────────────────────────────────────────────────────────────
function PackageCard({ pkg, onEdit, onDelete, onToggle, isToggling }: {
  pkg:        AdminPackage
  onEdit:     (p: AdminPackage) => void
  onDelete:   (p: AdminPackage) => void
  onToggle:   (p: AdminPackage) => void
  isToggling: boolean
}) {
  const cc = CAT_COLORS[pkg.category] ?? fallbackCatColor

  return (
    <div className="pm-card" style={{ opacity: pkg.isActive ? 1 : 0.65 }}>
      <div className="pm-card-body">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
          <span style={{ background: cc.bg, color: cc.text, borderRadius: '99px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>
            {pkg.category || '—'}
          </span>
          {!pkg.isActive && (
            <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: '99px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>Inactive</span>
          )}
        </div>

        <p style={{ fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy, margin: '0 0 6px' }}>
          {pkg.name || '—'}
        </p>
        <p style={{ fontSize: '12px', color: COLORS.muted, lineHeight: 1.5, margin: 0 }}>
          {pkg.description || 'No description provided.'}
        </p>

        {/* Pricing chips */}
        <div className="pm-price-row">
          <span className="pm-price-chip">1M: {priceStr(pkg.price1Month)}</span>
          <span className="pm-price-chip">3M: {priceStr(pkg.price3Months)}</span>
          <span className="pm-price-chip">6M: {priceStr(pkg.price6Months)}</span>
        </div>

        {/* Feature tags */}
        {(pkg.features?.length ?? 0) > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {(pkg.features ?? []).slice(0, 3).map((f, i) => (
              <span key={i} style={{ background: COLORS.brandLight, color: COLORS.brand, borderRadius: '5px', padding: '2px 7px', fontSize: '11px', fontWeight: 500 }}>
                ✓ {f}
              </span>
            ))}
            {(pkg.features?.length ?? 0) > 3 && (
              <span style={{ fontSize: '11px', color: COLORS.muted }}>+{(pkg.features?.length ?? 0) - 3} more</span>
            )}
          </div>
        )}
      </div>

      <div className="pm-card-footer">
        {/* Active toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: COLORS.muted }}>{pkg.isActive ? 'Active' : 'Inactive'}</span>
          <button
            onClick={() => onToggle(pkg)}
            disabled={isToggling}
            aria-label={`${pkg.isActive ? 'Deactivate' : 'Activate'} ${pkg.name}`}
            style={{ width: '38px', height: '20px', borderRadius: '99px', border: 'none', background: pkg.isActive ? COLORS.brand : COLORS.divider, cursor: isToggling ? 'not-allowed' : 'pointer', position: 'relative', flexShrink: 0, opacity: isToggling ? 0.6 : 1 }}
          >
            <div style={{ position: 'absolute', top: '2px', left: pkg.isActive ? undefined : '2px', right: pkg.isActive ? '2px' : undefined, width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.15s, right 0.15s' }} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => onEdit(pkg)}
            style={{ padding: '5px 10px', borderRadius: '8px', border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: 'pointer', color: COLORS.brand, fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Pencil size={13} /> Edit
          </button>
          <button onClick={() => onDelete(pkg)}
            style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: '#fee2e2', cursor: 'pointer', color: '#dc2626', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PackagesManagementPage() {
  // ── Filters / pagination ──────────────────────────────────────────────────
  const [searchInput,  setSearchInput]  = useState('')
  const [searchTerm,   setSearchTerm]   = useState('')
  const [catFilter,    setCatFilter]    = useState('')
  const [activeFilter, setActiveFilter] = useState<'' | 'true' | 'false'>('')
  const [page,         setPage]         = useState(1)
  const [limit,        setLimit]        = useState(DEFAULT_PACKAGES_LIMIT)

  // ── Modal state ───────────────────────────────────────────────────────────
  const [modalOpen,    setModal]        = useState(false)
  const [deleteOpen,   setDelete]       = useState(false)
  const [selectedPkg,  setSelected]     = useState<AdminPackage | null>(null)
  const [togglingId,   setTogglingId]   = useState<string | null>(null)

  // ── Debounce search ────────────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearchChange = useCallback((val: string) => {
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setSearchTerm(val); setPage(1) }, 400)
  }, [])

  useEffect(() => { setPage(1) }, [catFilter, activeFilter, limit])

  // ── Query params ───────────────────────────────────────────────────────────
  const queryParams = {
    page,
    limit,
    ...(searchTerm   ? { search:   searchTerm } : {}),
    ...(catFilter    ? { category: catFilter }  : {}),
    ...(activeFilter ? { isActive: activeFilter === 'true' } : {}),
  }

  const { packages, pagination, isLoading, isFetching, isError, refetch } =
    useAdminPackages(queryParams)

  // ── Mutations ─────────────────────────────────────────────────────────────
  const createMutation = useCreateAdminPackage(() => { setModal(false); setSelected(null) })
  const updateMutation = useUpdateAdminPackage(() => { setModal(false); setSelected(null) })
  const toggleMutation = useToggleAdminPackageStatus()
  const deleteMutation = useDeleteAdminPackage(() => { setDelete(false); setSelected(null) })

  const handleFormSubmit = (payload: AdminPackageCreatePayload) => {
    if (selectedPkg) {
      updateMutation.mutate({ id: selectedPkg.id, payload: payload as AdminPackageUpdatePayload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleToggle = (pkg: AdminPackage) => {
    if (togglingId) return
    setTogglingId(pkg.id)
    toggleMutation.mutate(
      { id: pkg.id, isActive: !pkg.isActive },
      { onSettled: () => setTogglingId(null) },
    )
  }

  const isSaving          = createMutation.isPending || updateMutation.isPending
  const hasActiveFilters  = !!searchTerm || !!catFilter || !!activeFilter
  const clearFilters      = () => {
    setSearchInput(''); setSearchTerm('')
    setCatFilter(''); setActiveFilter(''); setPage(1)
  }

  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }

        .pm-grid { display:grid; grid-template-columns:1fr; gap:16px; }
        @media(min-width:640px)  { .pm-grid { grid-template-columns:1fr 1fr; } }
        @media(min-width:1024px) { .pm-grid { grid-template-columns:repeat(3,1fr); } }

        .pm-card { background:#fff; border-radius:16px; border:1px solid #e6edf0; box-shadow:0 1px 4px rgba(0,0,0,.08); overflow:hidden; display:flex; flex-direction:column; }
        .pm-card-body { padding:18px 18px 14px; flex:1; }
        .pm-card-footer { padding:12px 18px; border-top:1px solid #f0f4f6; display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap; }
        .pm-price-row { display:flex; gap:6px; flex-wrap:wrap; margin:12px 0; }
        .pm-price-chip { background:#f0f4f6; border-radius:6px; padding:3px 8px; font-size:11px; font-weight:600; color:#374955; }

        .pm-filters { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:16px; }
        .pm-search-wrap { flex:1; min-width:180px; max-width:300px; position:relative; display:flex; align-items:center; }
        .pm-search { width:100%; height:38px; padding:0 30px 0 34px; border:1px solid #e6edf0; border-radius:10px; background:#f7fafb; font-size:13px; color:#374955; outline:none; font-family:inherit; box-sizing:border-box; }
        .pm-search:focus { border-color: ${COLORS.brand}; background:#fff; }
        .pm-select { height:38px; padding:0 28px 0 12px; border:1px solid #e6edf0; border-radius:10px; background:#f7fafb; font-size:13px; color:#374955; outline:none; cursor:pointer; font-family:inherit; appearance:none; }
        .pm-fetching { opacity:0.65; pointer-events:none; transition:opacity 0.2s; }
      `}</style>

      <AdminPageShell
        title="Packages"
        subtitle={pagination.totalItems > 0 ? `${pagination.totalItems} packages` : 'Manage healthcare subscription packages'}
        actions={
          <AdminBtn icon={<Plus size={15} />} onClick={() => { setSelected(null); setModal(true) }}>
            Create Package
          </AdminBtn>
        }
      >
        {isError && <ErrorBanner onRetry={refetch} />}

        {/* ── Filters ──────────────────────────────────────────────── */}
        <div className="pm-filters">
          <div className="pm-search-wrap">
            <Search size={15} style={{ position: 'absolute', left: '10px', color: COLORS.muted, pointerEvents: 'none' }} />
            <input className="pm-search" placeholder="Search by name or category…"
              value={searchInput} onChange={e => handleSearchChange(e.target.value)} />
            {searchInput && (
              <button onClick={() => handleSearchChange('')}
                style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, display: 'flex', padding: '2px' }}>
                <XIcon size={13} />
              </button>
            )}
          </div>

          <select className="pm-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            {CAT_FILTER_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select className="pm-select" value={activeFilter} onChange={e => setActiveFilter(e.target.value as '' | 'true' | 'false')}>
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {hasActiveFilters && (
            <button onClick={clearFilters} style={{ height: '38px', padding: '0 12px', borderRadius: '10px', border: `1px solid #fed7aa`, background: '#fff7ed', color: '#c2410c', fontSize: '12px', fontWeight: FONT_WEIGHT.semibold, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
              <XIcon size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* ── Grid / states ────────────────────────────────────────── */}
        <div className={isFetching && !isLoading ? 'pm-fetching' : ''}>
          {isLoading ? (
            <div className="pm-grid">
              {Array.from({ length: limit > 6 ? 6 : limit }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : packages.length === 0 ? (
            <AdminEmptyState
              icon={<Package size={22} />}
              title={hasActiveFilters ? 'No packages match your filters' : 'No packages yet'}
              description={hasActiveFilters ? 'Try adjusting your search or filters' : 'Create your first healthcare subscription package'}
              action={
                !hasActiveFilters
                  ? <AdminBtn icon={<Plus size={14} />} onClick={() => { setSelected(null); setModal(true) }}>Create Package</AdminBtn>
                  : undefined
              }
            />
          ) : (
            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: SHADOW.card, border: `1px solid ${COLORS.divider}`, overflow: 'hidden' }}>
              <div className="pm-grid" style={{ padding: '16px' }}>
                {packages.map(pkg => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    onEdit={p => { setSelected(p); setModal(true) }}
                    onDelete={p => { setSelected(p); setDelete(true) }}
                    onToggle={handleToggle}
                    isToggling={togglingId === pkg.id}
                  />
                ))}
              </div>
              {pagination.totalItems > 0 && (
                <PaginationBar
                  page={page} totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems} limit={limit}
                  isFetching={isFetching}
                  onPage={p => setPage(p)}
                  onLimit={l => { setLimit(l); setPage(1) }}
                />
              )}
            </div>
          )}
        </div>
      </AdminPageShell>

      {/* Create / Edit modal */}
      <AdminFormModal
        open={modalOpen}
        onClose={() => { setModal(false); setSelected(null) }}
        title={selectedPkg ? 'Edit Package' : 'Create Package'}
        size="lg"
        footer={
          <>
            <AdminBtn variant="secondary" onClick={() => { setModal(false); setSelected(null) }} disabled={isSaving}>
              Cancel
            </AdminBtn>
            <AdminBtn
              onClick={() => {
                const form = document.getElementById('package-form') as HTMLFormElement | null
                form?.requestSubmit()
              }}
              disabled={isSaving}
            >
              {isSaving ? 'Saving…' : selectedPkg ? 'Save Changes' : 'Create Package'}
            </AdminBtn>
          </>
        }
      >
        {/* Re-mount form when switching between create/edit to reset state */}
        <PackageForm
          key={selectedPkg?.id ?? 'create'}
          formId="package-form"
          pkg={selectedPkg}
          onSubmit={handleFormSubmit}
        />
      </AdminFormModal>

      {/* Delete confirm */}
      <ConfirmModal
        open={deleteOpen}
        onClose={() => { setDelete(false); setSelected(null) }}
        onConfirm={() => { if (selectedPkg) deleteMutation.mutate(selectedPkg.id) }}
        variant="danger"
        title={`Delete "${selectedPkg?.name ?? 'this package'}"?`}
        description="This will permanently remove this package. Active patient subscriptions will not be affected."
        confirmLabel="Delete Package"
        loading={deleteMutation.isPending}
      />
    </>
  )
}
