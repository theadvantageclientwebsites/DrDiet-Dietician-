import { useState, useRef } from 'react'
import { FileText, Plus, Pencil, Trash2, Upload, Eye, AlertTriangle, RefreshCw } from 'lucide-react'
import AdminPageShell  from '@/components/admin/AdminPageShell'
import StatusBadge     from '@/components/admin/StatusBadge'
import AdminBtn        from '@/components/admin/AdminBtn'
import AdminFormModal  from '@/components/admin/AdminFormModal'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import ConfirmModal    from '@/components/ui/ConfirmModal'
import FormField       from '@/components/shared/FormField'
import SelectField     from '@/components/shared/SelectField'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'
import { useAdminDigitalProducts } from '@/hooks/useAdminDigitalProducts'
import {
  useCreateDigitalProduct,
  useUpdateDigitalProduct,
  useDeleteDigitalProduct,
} from '@/hooks/useAdminDigitalProductMutations'
import type { DigitalProduct } from '@/types'

const CAT_OPTS = [
  { value: 'ebook',       label: 'eBook' },
  { value: 'diet_guide',  label: 'Diet Guide' },
  { value: 'recipe_book', label: 'Recipe Book' },
]
const STATUS_OPTS = [
  { value: 'true',  label: 'Published' },
  { value: 'false', label: 'Draft' },
]
const CAT_LABELS: Record<string, string> = {
  ebook: 'eBook', diet_guide: 'Diet Guide', recipe_book: 'Recipe Book',
}
const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  ebook:       { bg: '#eff6ff', text: '#2563eb' },
  diet_guide:  { bg: '#dcfce7', text: '#16a34a' },
  recipe_book: { bg: '#fef3c7', text: '#d97706' },
}

interface ProductFormState {
  title: string
  category: string
  isActive: string
  price: string
  description: string
  file: File | null
  thumb: File | null
  fileName: string
  thumbName: string
}

const EMPTY_FORM: ProductFormState = {
  title: '', category: '', isActive: 'true', price: '',
  description: '', file: null, thumb: null, fileName: '', thumbName: '',
}

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
        <div className="skeleton-pulse" style={{ height: '28px', width: '28px', borderRadius: '7px', background: '#e8edf0' }}/>
        <div className="skeleton-pulse" style={{ height: '28px', width: '28px', borderRadius: '7px', background: '#e8edf0' }}/>
        <div className="skeleton-pulse" style={{ height: '28px', width: '28px', borderRadius: '7px', background: '#e8edf0' }}/>
      </div>
    </div>
  )
}

function ProductForm({
  id,
  form,
  setForm,
}: {
  id: string
  form: ProductFormState
  setForm: React.Dispatch<React.SetStateAction<ProductFormState>>
}) {
  const fileRef  = useRef<HTMLInputElement>(null)
  const thumbRef = useRef<HTMLInputElement>(null)

  return (
    <form id={id} className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
      <FormField
        id="dp-title" label="Product Title" placeholder="eg. Thyroid Diet Guide"
        value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          id="dp-cat" label="Category" options={CAT_OPTS}
          value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))}
          placeholder="Select category"
        />
        <SelectField
          id="dp-status" label="Status" options={STATUS_OPTS}
          value={form.isActive} onChange={v => setForm(f => ({ ...f, isActive: v }))}
          placeholder="Select status"
        />
        <FormField
          id="dp-price" label="Price (₹)" type="number" placeholder="299"
          value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
        />
      </div>
      <div>
        <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, display: 'block', marginBottom: '6px' }}>
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Describe this product…"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          style={{ width: '100%', borderRadius: '10px', border: `1px solid ${COLORS.inputBorder}`, background: COLORS.inputBg, padding: '10px 12px', fontSize: FONT_SIZE.sm, color: COLORS.navy, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
      </div>
      <div>
        <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, display: 'block', marginBottom: '6px' }}>
          Product File (PDF)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', border: `2px dashed ${COLORS.inputBorder}`, borderRadius: '10px', cursor: 'pointer', background: COLORS.inputBg }}>
          <Upload size={18} color={COLORS.brand} strokeWidth={1.8}/>
          <span style={{ fontSize: FONT_SIZE.sm, color: form.fileName ? COLORS.navy : COLORS.muted }}>
            {form.fileName || 'Click to upload PDF file'}
          </span>
          <input
            ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
            onChange={e => {
              const f = e.target.files?.[0] ?? null
              setForm(prev => ({ ...prev, file: f, fileName: f?.name ?? '' }))
            }}
          />
        </label>
      </div>
      <div>
        <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, display: 'block', marginBottom: '6px' }}>
          Thumbnail Image
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', border: `2px dashed ${COLORS.inputBorder}`, borderRadius: '10px', cursor: 'pointer', background: COLORS.inputBg }}>
          <Upload size={18} color={COLORS.brand} strokeWidth={1.8}/>
          <span style={{ fontSize: FONT_SIZE.sm, color: form.thumbName ? COLORS.navy : COLORS.muted }}>
            {form.thumbName || 'Click to upload thumbnail'}
          </span>
          <input
            ref={thumbRef} type="file" accept="image/*" style={{ display: 'none' }}
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

export default function DigitalProductsPage() {
  const [modalOpen,  setModal]  = useState(false)
  const [deleteOpen, setDelete] = useState(false)
  const [selected,   setSelected] = useState<DigitalProduct | null>(null)
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM)

  const { products, isLoading, isError, refetch } = useAdminDigitalProducts()

  const createMutation = useCreateDigitalProduct(() => { setModal(false); setForm(EMPTY_FORM) })
  const updateMutation = useUpdateDigitalProduct(() => { setModal(false); setSelected(null) })
  const deleteMutation = useDeleteDigitalProduct(() => { setDelete(false); setSelected(null) })

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  function openCreate() {
    setSelected(null)
    setForm(EMPTY_FORM)
    setModal(true)
  }

  function openEdit(p: DigitalProduct) {
    setSelected(p)
    setForm({
      title: p.title, category: p.category,
      isActive: p.isActive ? 'true' : 'false',
      price: String(p.price), description: p.description,
      file: null, thumb: null, fileName: '', thumbName: '',
    })
    setModal(true)
  }

  function handleSubmit() {
    if (selected) {
      updateMutation.mutate({
        id: selected.id,
        payload: {
          title: form.title,
          category: form.category as DigitalProduct['category'],
          isActive: form.isActive === 'true',
          price: Number(form.price),
          description: form.description,
        },
      })
    } else {
      const fd = new FormData()
      fd.append('title',       form.title)
      fd.append('category',    form.category)
      fd.append('isActive',    form.isActive)
      fd.append('price',       form.price)
      fd.append('description', form.description)
      if (form.file)  fd.append('file',      form.file)
      if (form.thumb) fd.append('thumbnail', form.thumb)
      createMutation.mutate(fd)
    }
  }

  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }

        .dp-grid{display:grid;grid-template-columns:1fr;gap:16px;}
        @media(min-width:640px){.dp-grid{grid-template-columns:1fr 1fr;}}
        @media(min-width:1024px){.dp-grid{grid-template-columns:repeat(3,1fr);}}

        .dp-card{background:#fff;border-radius:16px;border:1px solid #e6edf0;box-shadow:0 1px 4px rgba(0,0,0,.08);overflow:hidden;display:flex;flex-direction:column;}
        .dp-thumb{height:140px;background:#f0f4f6;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .dp-body{padding:14px 16px;flex:1;display:flex;flex-direction:column;gap:8px;}
        .dp-footer{padding:10px 16px;border-top:1px solid #f0f4f6;display:flex;align-items:center;justify-content:flex-end;gap:8px;}
      `}</style>

      <AdminPageShell
        title="Digital Products"
        subtitle="Manage ebooks, diet guides, and recipe books"
        actions={<AdminBtn icon={<Plus size={15}/>} onClick={openCreate}>Add Product</AdminBtn>}
      >
        {isError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: '#fff7ed', border: '1px solid #fed7aa', marginBottom: '16px', flexWrap: 'wrap' }}>
            <AlertTriangle size={16} color="#ea580c"/>
            <span style={{ flex: 1, fontSize: FONT_SIZE.sm, color: '#c2410c' }}>Failed to load products. Please try again.</span>
            <button onClick={() => refetch()} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '7px', background: '#ea580c', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: FONT_WEIGHT.semibold }}>
              <RefreshCw size={12}/> Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="dp-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i}/>)}
          </div>
        ) : !isError && products.length === 0 ? (
          <AdminEmptyState icon={<FileText size={22}/>} title="No products yet" description="Add your first digital product"/>
        ) : (
          <div className="dp-grid" style={{ opacity: isMutating ? 0.65 : 1, transition: 'opacity 0.2s' }}>
            {products.map(p => {
              const cc = CAT_COLORS[p.category] ?? { bg: '#f0f4f6', text: '#6b8896' }
              return (
                <div key={p.id} className="dp-card">
                  <div className="dp-thumb">
                    {p.thumbnailUrl
                      ? <img src={p.thumbnailUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                      : <FileText size={36} color={COLORS.muted} strokeWidth={1.5}/>
                    }
                  </div>
                  <div className="dp-body">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ background: cc.bg, color: cc.text, borderRadius: '99px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>
                        {CAT_LABELS[p.category] ?? p.category}
                      </span>
                      <StatusBadge status={p.isActive ? 'published' : 'draft'}/>
                    </div>
                    <p style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, margin: 0, lineHeight: 1.3 }}>{p.title}</p>
                    <p style={{ fontSize: '12px', color: COLORS.muted, margin: 0, lineHeight: 1.5 }}>{p.description}</p>
                    <p style={{ fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy, margin: 0 }}>₹{p.price}</p>
                  </div>
                  <div className="dp-footer">
                    {p.fileUrl && (
                      <a href={p.fileUrl} target="_blank" rel="noreferrer" title="Preview" style={{ padding: '5px', borderRadius: '7px', border: 'none', background: 'transparent', cursor: 'pointer', color: COLORS.muted, display: 'flex' }}>
                        <Eye size={15} strokeWidth={1.8}/>
                      </a>
                    )}
                    <button onClick={() => openEdit(p)} title="Edit" style={{ padding: '5px', borderRadius: '7px', border: 'none', background: 'transparent', cursor: 'pointer', color: COLORS.brand }}>
                      <Pencil size={15} strokeWidth={1.8}/>
                    </button>
                    <button onClick={() => { setSelected(p); setDelete(true) }} title="Delete" style={{ padding: '5px', borderRadius: '7px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#dc2626' }}>
                      <Trash2 size={15} strokeWidth={1.8}/>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </AdminPageShell>

      <AdminFormModal
        open={modalOpen}
        onClose={() => { setModal(false); setForm(EMPTY_FORM) }}
        title={selected ? 'Edit Product' : 'Add Digital Product'}
        size="md"
        footer={
          <>
            <AdminBtn variant="secondary" onClick={() => { setModal(false); setForm(EMPTY_FORM) }}>Cancel</AdminBtn>
            <AdminBtn onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving…' : selected ? 'Save Changes' : 'Add Product'}
            </AdminBtn>
          </>
        }
      >
        <ProductForm id="dp-form" form={form} setForm={setForm}/>
      </AdminFormModal>

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
    </>
  )
}
