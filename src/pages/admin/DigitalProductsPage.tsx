import { useState, useCallback, useEffect, useRef } from 'react'
import {
  FileText, Plus, Pencil, Trash2, Upload, Eye,
  AlertTriangle, RefreshCw, Loader2, Search, X,
  ChevronLeft, ChevronRight, BookOpen, DollarSign, ShoppingBag,
  ExternalLink, Download, Tag, Globe, BookMarked, ShoppingCart,
  Calendar,
} from 'lucide-react'
import AdminPageShell   from '@/components/admin/AdminPageShell'
import StatCard         from '@/components/admin/StatCard'
import StatusBadge      from '@/components/admin/StatusBadge'
import AdminBtn         from '@/components/admin/AdminBtn'
import AdminFormModal   from '@/components/admin/AdminFormModal'
import AdminEmptyState  from '@/components/admin/AdminEmptyState'
import ConfirmModal     from '@/components/ui/ConfirmModal'
import FormField        from '@/components/shared/FormField'
import SelectField      from '@/components/shared/SelectField'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import { API_BASE_URL } from '@/config/constants'
import { useAdminDigitalProducts, DEFAULT_DIGITAL_PRODUCTS_LIMIT } from '@/hooks/useAdminDigitalProducts'
import {
  useCreateDigitalProduct,
  useUpdateDigitalProduct,
  useDeleteDigitalProduct,
} from '@/hooks/useAdminDigitalProductMutations'
import type { DigitalProduct, DigitalProductStatus } from '@/types'

/** Strip /api suffix and return the server origin, e.g. http://localhost:5000 */
const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_OPTS = [
  { value: 'Thyroid',      label: 'Thyroid'      },
  { value: 'Diabetes',     label: 'Diabetes'     },
  { value: 'Weight Loss',  label: 'Weight Loss'  },
  { value: 'General',      label: 'General'      },
  { value: 'PCOS',         label: 'PCOS'         },
  { value: 'Heart Health', label: 'Heart Health' },
]

const STATUS_OPTS: { value: DigitalProductStatus; label: string }[] = [
  { value: 'PUBLISHED',   label: 'Published'   },
  { value: 'DRAFT',       label: 'Draft'       },
  { value: 'UNPUBLISHED', label: 'Unpublished' },
]

const STATUS_FILTER_OPTS = [
  { value: '',            label: 'All Status'  },
  { value: 'PUBLISHED',   label: 'Published'   },
  { value: 'DRAFT',       label: 'Draft'       },
  { value: 'UNPUBLISHED', label: 'Unpublished' },
]

const CATEGORY_FILTER_OPTS = [
  { value: '',             label: 'All Categories' },
  { value: 'Thyroid',      label: 'Thyroid'        },
  { value: 'Diabetes',     label: 'Diabetes'       },
  { value: 'Weight Loss',  label: 'Weight Loss'    },
  { value: 'General',      label: 'General'        },
  { value: 'PCOS',         label: 'PCOS'           },
  { value: 'Heart Health', label: 'Heart Health'   },
]

const FREE_FILTER_OPTS = [
  { value: '',      label: 'All Products' },
  { value: 'true',  label: 'Free'         },
  { value: 'false', label: 'Paid'         },
]

const PAGE_SIZE_OPTS = [10, 20, 50]

const STATUS_BADGE_MAP: Record<DigitalProductStatus, string> = {
  PUBLISHED:   'published',
  DRAFT:       'draft',
  UNPUBLISHED: 'inactive',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCatStyle(category: string): { bg: string; text: string } {
  const palette: { bg: string; text: string }[] = [
    { bg: '#eff6ff', text: '#2563eb' },
    { bg: '#dcfce7', text: '#16a34a' },
    { bg: '#fef3c7', text: '#d97706' },
    { bg: '#fce7f3', text: '#db2777' },
    { bg: '#f3e8ff', text: '#9333ea' },
    { bg: '#e0f2fe', text: '#0284c7' },
  ]
  let hash = 0
  for (let i = 0; i < category.length; i++) hash = category.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface ProductFormState {
  title:       string
  category:    string
  status:      DigitalProductStatus
  price:       string
  description: string
  author:      string
  pageCount:   string
  language:    string
  isFree:      boolean
  file:        File | null
  fileName:    string
  thumb:       File | null
  thumbName:   string
}

const EMPTY_FORM: ProductFormState = {
  title: '', category: '', status: 'DRAFT', price: '0',
  description: '', author: '', pageCount: '', language: 'English',
  isFree: false, file: null, fileName: '', thumb: null, thumbName: '',
}

// ─── Skeleton components ──────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="dp-card">
      <div className="dp-thumb skeleton-pulse" style={{ background: '#e8edf0' }}/>
      <div className="dp-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
          <div className="skeleton-pulse" style={{ height: '22px', width: '80px', borderRadius: '99px', background: '#e8edf0' }}/>
          <div className="skeleton-pulse" style={{ height: '22px', width: '64px', borderRadius: '99px', background: '#e8edf0' }}/>
        </div>
        <div className="skeleton-pulse" style={{ height: '16px', width: '90%', borderRadius: '6px', background: '#e8edf0' }}/>
        <div className="skeleton-pulse" style={{ height: '12px', width: '100%', borderRadius: '6px', background: '#e8edf0' }}/>
        <div className="skeleton-pulse" style={{ height: '12px', width: '75%', borderRadius: '6px', background: '#e8edf0' }}/>
        <div className="skeleton-pulse" style={{ height: '18px', width: '48px', borderRadius: '6px', background: '#e8edf0' }}/>
      </div>
      <div className="dp-footer" style={{ justifyContent: 'flex-end', gap: '8px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-pulse" style={{ height: '28px', width: '28px', borderRadius: '7px', background: '#e8edf0' }}/>
        ))}
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
      <div className="skeleton-pulse" style={{ height: '12px', width: '60%', borderRadius: '6px', background: '#e6edf0' }} />
      <div className="skeleton-pulse" style={{ height: '28px', width: '40%', borderRadius: '6px', background: '#e6edf0' }} />
    </div>
  )
}

// ─── PaginationBar ────────────────────────────────────────────────────────────

interface PaginationBarProps {
  page: number; totalPages: number; totalItems: number; limit: number; isFetching: boolean
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
        <select value={limit} onChange={(e) => onLimit(Number(e.target.value))} style={{
          height: '30px', padding: '0 8px', borderRadius: '8px',
          border: `1px solid ${COLORS.divider}`, background: '#f7fafb',
          fontSize: '12px', color: '#374955', outline: 'none', cursor: 'pointer',
        }}>
          {PAGE_SIZE_OPTS.map(s => <option key={s} value={s}>{s} / page</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button onClick={() => onPage(safePage - 1)} disabled={safePage <= 1 || isFetching} style={{
          width: '30px', height: '30px', borderRadius: '8px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${COLORS.divider}`, background: '#fff',
          cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
          color: safePage <= 1 ? COLORS.divider : COLORS.muted,
        }}><ChevronLeft size={14} /></button>
        {pages.map((p, i) =>
          p === '…'
            ? <span key={`e-${i}`} style={{ padding: '0 4px', fontSize: '12px', color: COLORS.muted }}>…</span>
            : <button key={p} onClick={() => onPage(p as number)} disabled={isFetching} style={{
                minWidth: '30px', height: '30px', padding: '0 6px', borderRadius: '8px',
                border: p === safePage ? 'none' : `1px solid ${COLORS.divider}`,
                background: p === safePage ? COLORS.brand : '#fff',
                color: p === safePage ? '#fff' : '#374955',
                fontSize: '12px', fontWeight: p === safePage ? FONT_WEIGHT.semibold : 'normal',
                cursor: isFetching ? 'not-allowed' : 'pointer',
              }}>{p}</button>
        )}
        <button onClick={() => onPage(safePage + 1)} disabled={safePage >= safeTotal || isFetching} style={{
          width: '30px', height: '30px', borderRadius: '8px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${COLORS.divider}`, background: '#fff',
          cursor: safePage >= safeTotal ? 'not-allowed' : 'pointer',
          color: safePage >= safeTotal ? COLORS.divider : COLORS.muted,
        }}><ChevronRight size={14} /></button>
      </div>
    </div>
  )
}

// ─── SectionLabel (inside modal form) ─────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, color: COLORS.muted,
      textTransform: 'uppercase', letterSpacing: '0.6px',
      margin: '0 0 10px', paddingBottom: '6px', borderBottom: `1px solid ${COLORS.divider}`,
    }}>
      {children}
    </p>
  )
}

// ─── ProductForm ──────────────────────────────────────────────────────────────

function ProductForm({
  id, form, setForm, isEdit, isUploading,
}: {
  id: string
  form: ProductFormState
  setForm: React.Dispatch<React.SetStateAction<ProductFormState>>
  isEdit: boolean
  isUploading: boolean
}) {
  const fileRef  = useRef<HTMLInputElement>(null)
  const thumbRef = useRef<HTMLInputElement>(null)

  return (
    <form id={id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={e => e.preventDefault()}>

      {/* ── Basic Info ─────────────────────────────────────────────────── */}
      <SectionLabel>Basic Info</SectionLabel>
      <div className="dpf-grid">
        <div style={{ gridColumn: '1 / -1' }}>
          <FormField
            id="dp-title" label="Product Title *" placeholder="e.g. Thyroid Diet Guide"
            value={form.title} required
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
        </div>
        <SelectField
          id="dp-cat" label="Category *" options={CATEGORY_OPTS}
          value={form.category}
          onChange={v => setForm(f => ({ ...f, category: v }))}
          placeholder="Select category"
        />
        <SelectField
          id="dp-status" label="Status"
          options={STATUS_OPTS.map(o => ({ value: o.value, label: o.label }))}
          value={form.status}
          onChange={v => setForm(f => ({ ...f, status: v as DigitalProductStatus }))}
        />
      </div>

      {/* ── Pricing ────────────────────────────────────────────────────── */}
      <SectionLabel>Pricing</SectionLabel>
      <div className="dpf-grid">
        <FormField
          id="dp-price" label="Price (₹)" type="number" placeholder="299" min="0"
          value={form.isFree ? '0' : form.price}
          disabled={form.isFree}
          onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '6px' }}>
          <label style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Free Product</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '38px' }}>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, isFree: !f.isFree, price: !f.isFree ? '0' : f.price }))}
              style={{
                width: '42px', height: '22px', borderRadius: '99px', border: 'none',
                background: form.isFree ? COLORS.brand : COLORS.divider,
                cursor: 'pointer', position: 'relative', flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute', top: '3px',
                left: form.isFree ? undefined : '3px',
                right: form.isFree ? '3px' : undefined,
                width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
              }}/>
            </button>
            <span style={{ fontSize: FONT_SIZE.sm, color: COLORS.body }}>
              {form.isFree ? 'Free (₹0)' : 'Paid'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Details ────────────────────────────────────────────────────── */}
      <SectionLabel>Details</SectionLabel>
      <div className="dpf-grid">
        <FormField
          id="dp-author" label="Author" placeholder="Dr. Smith"
          value={form.author}
          onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
        />
        <FormField
          id="dp-lang" label="Language" placeholder="English"
          value={form.language}
          onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
        />
        <FormField
          id="dp-pages" label="Page Count" type="number" placeholder="45" min="1"
          value={form.pageCount}
          onChange={e => setForm(f => ({ ...f, pageCount: e.target.value }))}
        />
      </div>
      <div>
        <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, display: 'block', marginBottom: '6px' }}>
          Description
        </label>
        <textarea
          rows={3} placeholder="Describe this product…" value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          style={{
            width: '100%', borderRadius: '10px', border: `1px solid ${COLORS.inputBorder}`,
            background: COLORS.inputBg, padding: '10px 12px', fontSize: FONT_SIZE.sm,
            color: COLORS.navy, outline: 'none', resize: 'vertical',
            fontFamily: 'inherit', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* ── Files ──────────────────────────────────────────────────────── */}
      <SectionLabel>Files</SectionLabel>
      {/* PDF upload */}
      <div>
        <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, display: 'block', marginBottom: '6px' }}>
          Product File (PDF){isEdit && <span style={{ color: COLORS.muted, fontWeight: 400 }}> — leave blank to keep existing</span>}
        </label>
        <label style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
          border: `2px dashed ${COLORS.inputBorder}`, borderRadius: '10px',
          cursor: isUploading ? 'not-allowed' : 'pointer', background: COLORS.inputBg,
          opacity: isUploading ? 0.6 : 1,
        }}>
          {isUploading ? <Loader2 size={18} color={COLORS.brand} style={{ animation: 'spin 1s linear infinite' }}/> : <Upload size={18} color={COLORS.brand} strokeWidth={1.8}/>}
          <span style={{ fontSize: FONT_SIZE.sm, color: form.fileName ? COLORS.navy : COLORS.muted }}>
            {form.fileName || 'Click to upload PDF (max 50 MB)'}
          </span>
          <input
            ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
            disabled={isUploading}
            onChange={e => {
              const f = e.target.files?.[0] ?? null
              setForm(prev => ({ ...prev, file: f, fileName: f?.name ?? '' }))
            }}
          />
        </label>
      </div>
      {/* Thumbnail upload */}
      <div>
        <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, display: 'block', marginBottom: '6px' }}>
          Thumbnail Image{isEdit && <span style={{ color: COLORS.muted, fontWeight: 400 }}> — leave blank to keep existing</span>}
        </label>
        <label style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
          border: `2px dashed ${COLORS.inputBorder}`, borderRadius: '10px',
          cursor: isUploading ? 'not-allowed' : 'pointer', background: COLORS.inputBg,
          opacity: isUploading ? 0.6 : 1,
        }}>
          {isUploading ? <Loader2 size={18} color={COLORS.brand} style={{ animation: 'spin 1s linear infinite' }}/> : <Upload size={18} color={COLORS.brand} strokeWidth={1.8}/>}
          <span style={{ fontSize: FONT_SIZE.sm, color: form.thumbName ? COLORS.navy : COLORS.muted }}>
            {form.thumbName || 'Click to upload thumbnail (JPEG / PNG / WebP, max 5 MB)'}
          </span>
          <input
            ref={thumbRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }}
            disabled={isUploading}
            onChange={e => {
              const f = e.target.files?.[0] ?? null
              setForm(prev => ({ ...prev, thumb: f, thumbName: f?.name ?? '' }))
            }}
          />
        </label>
      </div>
    </form>
  )
}

// ─── ProductDetailModal ───────────────────────────────────────────────────────

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: `1px solid ${COLORS.divider}` }}>
      <div style={{ color: COLORS.brand, flexShrink: 0, marginTop: '1px' }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '11px', color: COLORS.muted, fontWeight: FONT_WEIGHT.semibold, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: FONT_SIZE.sm, color: COLORS.navy, wordBreak: 'break-word' }}>{value}</p>
      </div>
    </div>
  )
}

function ProductDetailModal({ product, onClose, onEdit }: {
  product: DigitalProduct | null
  onClose: () => void
  onEdit: (p: DigitalProduct) => void
}) {
  const p = product

  useEffect(() => {
    if (!p) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [p])

  useEffect(() => {
    if (!p) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [p, onClose])

  if (!p) return null

  const cc          = getCatStyle(p.category ?? '')
  const badgeStatus = STATUS_BADGE_MAP[p.status] ?? 'draft'
  const fileFullUrl = p.fileUrl
    ? (p.fileUrl.startsWith('http') ? p.fileUrl : `${SERVER_ORIGIN}${p.fileUrl}`)
    : null
  const thumbFullUrl = p.thumbnailUrl
    ? (p.thumbnailUrl.startsWith('http') ? p.thumbnailUrl : `${SERVER_ORIGIN}${p.thumbnailUrl}`)
    : null

  function formatDate(iso: string) {
    try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) }
    catch { return '—' }
  }

  return (
    <>
      <style>{`
        .pdm-scroll::-webkit-scrollbar { display: none; }
        .pdm-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pdm-backdrop { from{opacity:0} to{opacity:1} }
        @keyframes pdm-enter { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(15,61,74,0.5)', backdropFilter: 'blur(3px)',
          animation: 'pdm-backdrop 0.2s ease',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed', zIndex: 2001,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100vw - 32px)',
          maxWidth: '760px',
          maxHeight: 'calc(100vh - 48px)',
          background: '#fff',
          borderRadius: '20px',
          boxShadow: SHADOW.popup,
          display: 'flex',
          flexDirection: 'column',
          animation: 'pdm-enter 0.22s ease',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: `1px solid ${COLORS.divider}`, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <span style={{ background: cc.bg, color: cc.text, borderRadius: '99px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
              {p.category || '—'}
            </span>
            <StatusBadge status={badgeStatus}/>
          </div>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '10px', border: 'none', background: COLORS.divider, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.muted, flexShrink: 0, marginLeft: '10px' }}
          >
            <X size={16}/>
          </button>
        </div>

        {/* Body */}
        <div className="pdm-scroll" style={{ overflowY: 'auto', flex: 1 }}>
          {/* Thumbnail / PDF preview strip */}
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
            {/* Left: thumbnail */}
            <div style={{
              width: '200px', minWidth: '200px', background: '#f0f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, minHeight: '200px',
            }}>
              {thumbFullUrl
                ? <img src={thumbFullUrl} alt={p.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}/>
                : <FileText size={48} color={COLORS.muted} strokeWidth={1.2}/>
              }
            </div>

            {/* Right: title + key info */}
            <div style={{ flex: 1, minWidth: 0, padding: '20px 20px 16px' }}>
              <h2 style={{ margin: '0 0 6px', fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy, lineHeight: 1.3 }}>
                {p.title}
              </h2>
              {p.author && (
                <p style={{ margin: '0 0 12px', fontSize: FONT_SIZE.sm, color: COLORS.muted }}>by {p.author}</p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: FONT_WEIGHT.bold, color: COLORS.navy }}>
                  {p.isFree ? 'Free' : `₹${p.price}`}
                </span>
                {p.isFree && (
                  <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '12px', fontWeight: 700, borderRadius: '6px', padding: '2px 8px' }}>FREE</span>
                )}
                {p.totalSales > 0 && (
                  <span style={{ fontSize: '12px', color: COLORS.muted }}>{p.totalSales} sold</span>
                )}
              </div>

              {p.description && (
                <p style={{ margin: 0, fontSize: FONT_SIZE.sm, color: COLORS.body, lineHeight: 1.6 }}>
                  {p.description}
                </p>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div style={{ padding: '0 20px 8px' }}>
            <DetailRow icon={<Tag size={15}/>}       label="Category"    value={p.category || '—'} />
            <DetailRow icon={<Globe size={15}/>}     label="Language"    value={p.language || '—'} />
            {p.pageCount != null && (
              <DetailRow icon={<BookMarked size={15}/>} label="Pages" value={`${p.pageCount} pages`} />
            )}
            <DetailRow icon={<ShoppingCart size={15}/>} label="Total Sales" value={p.totalSales ?? 0} />
            <DetailRow icon={<Calendar size={15}/>}  label="Created"     value={formatDate(p.createdAt)} />
            <DetailRow icon={<Calendar size={15}/>}  label="Last Updated" value={formatDate(p.updatedAt)} />
          </div>

          {/* PDF preview */}
          {fileFullUrl && (
            <div style={{ padding: '16px 20px 20px' }}>
              <p style={{ margin: '0 0 10px', fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                PDF Preview
              </p>
              <div style={{ border: `1px solid ${COLORS.divider}`, borderRadius: '12px', overflow: 'hidden', height: '420px', background: '#f7fafb', display: 'flex', flexDirection: 'column' }}>
                <iframe
                  src={fileFullUrl}
                  title={`Preview: ${p.title}`}
                  style={{ flex: 1, width: '100%', border: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <a
                  href={fileFullUrl} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '9px', background: COLORS.brandLight, color: COLORS.brand, fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, textDecoration: 'none' }}
                >
                  <ExternalLink size={14}/> Open in new tab
                </a>
                <a
                  href={fileFullUrl} download
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '9px', background: '#f7fafb', border: `1px solid ${COLORS.divider}`, color: COLORS.body, fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, textDecoration: 'none' }}
                >
                  <Download size={14}/> Download
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${COLORS.divider}`, display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
          <AdminBtn variant="secondary" onClick={onClose}>Close</AdminBtn>
          <AdminBtn onClick={() => { onClose(); onEdit(p) }}>
            <Pencil size={14}/> Edit Product
          </AdminBtn>
        </div>
      </div>
    </>
  )
}

// ─── ProductCard (grid item) ──────────────────────────────────────────────────

function ProductCard({
  p, onView, onEdit, onDelete,
}: { p: DigitalProduct; onView: (p: DigitalProduct) => void; onEdit: (p: DigitalProduct) => void; onDelete: (p: DigitalProduct) => void }) {
  const cc = getCatStyle(p.category ?? '')
  const badgeStatus = STATUS_BADGE_MAP[p.status] ?? 'draft'

  return (
    <div className="dp-card">
      <div className="dp-thumb">
        {p.thumbnailUrl
          ? <img src={p.thumbnailUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
               onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}/>
          : <FileText size={36} color={COLORS.muted} strokeWidth={1.5}/>
        }
      </div>
      <div className="dp-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
          <span style={{ background: cc.bg, color: cc.text, borderRadius: '99px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>
            {p.category || '—'}
          </span>
          <StatusBadge status={badgeStatus}/>
        </div>
        <p style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, margin: 0, lineHeight: 1.3 }}>
          {p.title}
        </p>
        {p.description && (
          <p style={{ fontSize: '12px', color: COLORS.muted, margin: 0, lineHeight: 1.5 }}>
            {p.description.length > 80 ? p.description.slice(0, 80) + '…' : p.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <p style={{ fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy, margin: 0 }}>
            {p.isFree ? 'Free' : `₹${p.price}`}
          </p>
          {p.totalSales > 0 && (
            <span style={{ fontSize: '11px', color: COLORS.muted }}>{p.totalSales} sold</span>
          )}
        </div>
        {(p.author || p.pageCount || p.language) && (
          <p style={{ fontSize: '11px', color: COLORS.muted, margin: 0 }}>
            {[p.author ? `by ${p.author}` : null, p.pageCount ? `${p.pageCount} pages` : null, p.language].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
      <div className="dp-footer">
        <button onClick={() => onView(p)} title="View details"
          style={{ padding: '5px', borderRadius: '7px', border: 'none', background: 'transparent', cursor: 'pointer', color: COLORS.muted, display: 'flex' }}>
          <Eye size={15} strokeWidth={1.8}/>
        </button>
        <button onClick={() => onEdit(p)} title="Edit"
          style={{ padding: '5px', borderRadius: '7px', border: 'none', background: 'transparent', cursor: 'pointer', color: COLORS.brand }}>
          <Pencil size={15} strokeWidth={1.8}/>
        </button>
        <button onClick={() => onDelete(p)} title="Delete"
          style={{ padding: '5px', borderRadius: '7px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#dc2626' }}>
          <Trash2 size={15} strokeWidth={1.8}/>
        </button>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DigitalProductsPage() {
  // ── Filter / pagination state ────────────────────────────────────────────
  const [searchInput,     setSearchInput]     = useState('')
  const [searchTerm,      setSearchTerm]      = useState('')
  const [statusFilter,    setStatusFilter]    = useState('')
  const [categoryFilter,  setCategoryFilter]  = useState('')
  const [freeFilter,      setFreeFilter]      = useState('')
  const [minPrice,        setMinPrice]        = useState('')
  const [maxPrice,        setMaxPrice]        = useState('')
  const [page,            setPage]            = useState(1)
  const [limit,           setLimit]           = useState(DEFAULT_DIGITAL_PRODUCTS_LIMIT)

  // ── Modal state ──────────────────────────────────────────────────────────
  const [modalOpen,    setModal]    = useState(false)
  const [deleteOpen,   setDelete]   = useState(false)
  const [selected,     setSelected] = useState<DigitalProduct | null>(null)
  const [viewProduct,  setViewProduct] = useState<DigitalProduct | null>(null)
  const [form,         setForm]     = useState<ProductFormState>(EMPTY_FORM)

  // ── Debounced search ─────────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearchChange = useCallback((val: string) => {
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setSearchTerm(val); setPage(1) }, 400)
  }, [])

  // Reset page on filter changes
  useEffect(() => { setPage(1) }, [statusFilter, categoryFilter, freeFilter, minPrice, maxPrice, limit])

  // Build query params
  const queryParams = {
    page,
    limit,
    ...(searchTerm      ? { search:   searchTerm }                    : {}),
    ...(statusFilter    ? { status:   statusFilter }                  : {}),
    ...(categoryFilter  ? { category: categoryFilter }                : {}),
    ...(freeFilter      ? { isFree:   freeFilter === 'true' }         : {}),
    ...(minPrice        ? { minPrice: Number(minPrice) }              : {}),
    ...(maxPrice        ? { maxPrice: Number(maxPrice) }              : {}),
  }

  const { products, pagination, isLoading, isFetching, isError, refetch } =
    useAdminDigitalProducts(queryParams)

  const createMutation = useCreateDigitalProduct(() => { setModal(false); setForm(EMPTY_FORM) })
  const updateMutation = useUpdateDigitalProduct(() => { setModal(false); setSelected(null) })
  const deleteMutation = useDeleteDigitalProduct(() => { setDelete(false); setSelected(null) })

  const isUploading = createMutation.isUploading || updateMutation.isUploading
  const isMutating  = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  const hasActiveFilters = !!searchTerm || !!statusFilter || !!categoryFilter || !!freeFilter || !!minPrice || !!maxPrice

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalItems  = pagination.totalItems
  const published   = products.filter(p => p.status === 'PUBLISHED').length
  const freeCount   = products.filter(p => p.isFree).length
  const totalSales  = products.reduce((acc, p) => acc + (p.totalSales ?? 0), 0)

  function clearFilters() {
    setSearchInput(''); setSearchTerm('')
    setStatusFilter(''); setCategoryFilter('')
    setFreeFilter(''); setMinPrice(''); setMaxPrice('')
    setPage(1)
  }

  function openCreate() {
    setSelected(null); setForm(EMPTY_FORM); setModal(true)
  }

  function openEdit(p: DigitalProduct) {
    setSelected(p)
    setForm({
      title:       p.title       ?? '',
      category:    p.category    ?? '',
      status:      p.status      ?? 'DRAFT',
      price:       String(p.price ?? 0),
      description: p.description ?? '',
      author:      p.author      ?? '',
      pageCount:   p.pageCount   != null ? String(p.pageCount) : '',
      language:    p.language    ?? 'English',
      isFree:      p.isFree      ?? false,
      file: null, fileName: '', thumb: null, thumbName: '',
    })
    setModal(true)
  }

  function closeModal() { setModal(false); setForm(EMPTY_FORM); setSelected(null) }

  function handleSubmit() {
    if (!form.title.trim()) return
    if (!form.category)     return

    const fields = {
      title:       form.title.trim(),
      category:    form.category,
      status:      form.status,
      price:       form.isFree ? 0 : Number(form.price) || 0,
      description: form.description.trim() || undefined,
      author:      form.author.trim()      || undefined,
      pageCount:   form.pageCount          ? Number(form.pageCount) : undefined,
      language:    form.language.trim()    || 'English',
      isFree:      form.isFree,
    }

    if (selected) {
      updateMutation.mutate({ id: selected.id, payload: fields, file: form.file ?? undefined, thumbnail: form.thumb ?? undefined })
    } else {
      createMutation.mutate({ fields, file: form.file ?? undefined, thumbnail: form.thumb ?? undefined })
    }
  }

  const saveLabel = () => {
    if (isUploading) return 'Uploading…'
    if (createMutation.isPending || updateMutation.isPending) return 'Saving…'
    return selected ? 'Save Changes' : 'Add Product'
  }

  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }

        .dp-stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
        @media(min-width:1024px){ .dp-stat-grid{grid-template-columns:repeat(4,1fr);} }

        .dp-grid{display:grid;grid-template-columns:1fr;gap:16px;}
        @media(min-width:640px){.dp-grid{grid-template-columns:1fr 1fr;}}
        @media(min-width:1024px){.dp-grid{grid-template-columns:repeat(3,1fr);}}

        .dp-card{background:#fff;border-radius:16px;border:1px solid #e6edf0;box-shadow:0 1px 4px rgba(0,0,0,.08);overflow:hidden;display:flex;flex-direction:column;}
        .dp-thumb{height:140px;background:#f0f4f6;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .dp-body{padding:14px 16px;flex:1;display:flex;flex-direction:column;gap:8px;}
        .dp-footer{padding:10px 16px;border-top:1px solid #f0f4f6;display:flex;align-items:center;justify-content:flex-end;gap:8px;}

        .dp-filters{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px;}
        .dp-search-wrap{flex:1;min-width:180px;max-width:300px;position:relative;display:flex;align-items:center;}
        .dp-search{width:100%;height:38px;padding:0 30px 0 34px;border:1px solid #e6edf0;border-radius:10px;background:#f7fafb;font-size:13px;color:#374955;outline:none;font-family:inherit;box-sizing:border-box;}
        .dp-search:focus{border-color:${COLORS.brand};background:#fff;}
        .dp-select{height:38px;padding:0 8px;border:1px solid #e6edf0;border-radius:10px;background:#f7fafb;font-size:13px;color:#374955;outline:none;cursor:pointer;font-family:inherit;}
        .dp-select:focus{border-color:${COLORS.brand};}
        .dp-price-input{height:38px;width:90px;padding:0 10px;border:1px solid #e6edf0;border-radius:10px;background:#f7fafb;font-size:13px;color:#374955;outline:none;font-family:inherit;box-sizing:border-box;}
        .dp-price-input:focus{border-color:${COLORS.brand};}
        .dp-fetching{opacity:0.65;pointer-events:none;transition:opacity 0.2s;}

        .dpf-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:4px;}
        @media(max-width:480px){.dpf-grid{grid-template-columns:1fr;}}
      `}</style>

      <AdminPageShell
        title="Digital Products"
        subtitle={totalItems > 0 ? `${totalItems} products` : 'Manage ebooks, diet guides, and recipe books'}
        actions={<AdminBtn icon={<Plus size={15}/>} onClick={openCreate}>Add Product</AdminBtn>}
      >
        {/* ── Stat Cards ──────────────────────────────────────────────── */}
        <div className="dp-stat-grid">
          {isLoading ? (
            <><StatCardSkeleton/><StatCardSkeleton/><StatCardSkeleton/><StatCardSkeleton/></>
          ) : (
            <>
              <StatCard icon={<BookOpen size={20} strokeWidth={1.8}/>} label="Total Products" value={totalItems} />
              <StatCard icon={<BookOpen size={20} strokeWidth={1.8}/>} label="Published" value={published} accentColor="#16a34a" />
              <StatCard icon={<DollarSign size={20} strokeWidth={1.8}/>} label="Free Products" value={freeCount} accentColor="#0284c7" />
              <StatCard icon={<ShoppingBag size={20} strokeWidth={1.8}/>} label="Page Total Sales" value={totalSales} accentColor="#d97706" />
            </>
          )}
        </div>

        {/* ── Error Banner ─────────────────────────────────────────────── */}
        {isError && (
          <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', borderRadius:'12px', background:'#fff7ed', border:'1px solid #fed7aa', marginBottom:'16px', flexWrap:'wrap' }}>
            <AlertTriangle size={16} color="#ea580c"/>
            <span style={{ flex:1, fontSize: FONT_SIZE.sm, color:'#c2410c' }}>Failed to load products. Please try again.</span>
            <button onClick={() => refetch()} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'5px 12px', borderRadius:'7px', background:'#ea580c', color:'#fff', border:'none', cursor:'pointer', fontSize:'12px', fontWeight: FONT_WEIGHT.semibold }}>
              <RefreshCw size={12}/> Retry
            </button>
          </div>
        )}

        {/* ── Filters ──────────────────────────────────────────────────── */}
        <div className="dp-filters">
          {/* Search */}
          <div className="dp-search-wrap">
            <Search size={15} style={{ position:'absolute', left:'10px', color: COLORS.muted, pointerEvents:'none' }}/>
            <input
              className="dp-search" placeholder="Search title or author…"
              value={searchInput} onChange={e => handleSearchChange(e.target.value)}
            />
            {searchInput && (
              <button onClick={() => handleSearchChange('')}
                style={{ position:'absolute', right:'8px', background:'none', border:'none', cursor:'pointer', color: COLORS.muted, display:'flex', padding:'2px' }}>
                <X size={13}/>
              </button>
            )}
          </div>

          {/* Status */}
          <select className="dp-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {STATUS_FILTER_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Category */}
          <select className="dp-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            {CATEGORY_FILTER_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Free/Paid */}
          <select className="dp-select" value={freeFilter} onChange={e => setFreeFilter(e.target.value)}>
            {FREE_FILTER_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Price range */}
          <input className="dp-price-input" type="number" placeholder="Min ₹" min="0"
            value={minPrice} onChange={e => setMinPrice(e.target.value)}/>
          <input className="dp-price-input" type="number" placeholder="Max ₹" min="0"
            value={maxPrice} onChange={e => setMaxPrice(e.target.value)}/>

          {/* Clear */}
          {hasActiveFilters && (
            <button onClick={clearFilters} style={{
              height:'38px', padding:'0 12px', borderRadius:'10px',
              border:'1px solid #fed7aa', background:'#fff7ed',
              color:'#c2410c', fontSize:'12px', fontWeight: FONT_WEIGHT.semibold,
              cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', whiteSpace:'nowrap',
            }}>
              <X size={12}/> Clear filters
            </button>
          )}
        </div>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        <div
          className={isFetching && !isLoading ? 'dp-fetching' : ''}
          style={{ background:'#fff', borderRadius:'16px', boxShadow: SHADOW.card, border:`1px solid ${COLORS.divider}`, overflow:'hidden' }}
        >
          {isLoading ? (
            <div className="dp-grid" style={{ padding: '16px' }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i}/>)}
            </div>
          ) : products.length === 0 ? (
            <AdminEmptyState
              icon={<FileText size={22}/>}
              title={hasActiveFilters ? 'No products match your filters' : 'No products yet'}
              description={hasActiveFilters ? 'Try adjusting your search or filters' : 'Add your first digital product'}
            />
          ) : (
            <div className="dp-grid" style={{ padding: '16px', opacity: isMutating ? 0.65 : 1, transition: 'opacity 0.2s' }}>
              {products.map(p => (
                <ProductCard key={p.id} p={p} onView={p => setViewProduct(p)} onEdit={openEdit} onDelete={p => { setSelected(p); setDelete(true) }}/>
              ))}
            </div>
          )}

          {!isLoading && pagination.totalItems > 0 && (
            <PaginationBar
              page={page} totalPages={pagination.totalPages}
              totalItems={pagination.totalItems} limit={limit}
              isFetching={isFetching}
              onPage={p => setPage(p)}
              onLimit={l => { setLimit(l); setPage(1) }}
            />
          )}
        </div>
      </AdminPageShell>

      {/* ── Create / Edit Modal ───────────────────────────────────────── */}
      <AdminFormModal
        open={modalOpen}
        onClose={closeModal}
        title={selected ? 'Edit Digital Product' : 'Add Digital Product'}
        subtitle={selected ? `Editing: ${selected.title}` : 'Fill in the details to create a new product'}
        size="md"
        loading={isMutating || isUploading}
        footer={
          <>
            <AdminBtn variant="secondary" onClick={closeModal} disabled={isMutating || isUploading}>
              Cancel
            </AdminBtn>
            <AdminBtn onClick={handleSubmit} disabled={isMutating || isUploading || !form.title.trim() || !form.category}>
              {isUploading
                ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite', marginRight: '6px' }}/>{saveLabel()}</>
                : saveLabel()
              }
            </AdminBtn>
          </>
        }
      >
        <ProductForm
          id="dp-form"
          form={form}
          setForm={setForm}
          isEdit={!!selected}
          isUploading={isUploading}
        />
      </AdminFormModal>

      {/* ── Delete Confirm ───────────────────────────────────────────── */}
      <ConfirmModal
        open={deleteOpen}
        onClose={() => { setDelete(false); setSelected(null) }}
        onConfirm={() => selected && deleteMutation.mutate(selected.id)}
        loading={deleteMutation.isPending}
        variant="danger"
        title={`Delete "${selected?.title}"?`}
        description="This will permanently remove this product. Existing purchases will still have access."
        confirmLabel="Delete Product"
      />

      {/* ── Detail / Preview Modal ────────────────────────────────────── */}
      <ProductDetailModal
        product={viewProduct}
        onClose={() => setViewProduct(null)}
        onEdit={(p) => { setViewProduct(null); openEdit(p) }}
      />
    </>
  )
}
