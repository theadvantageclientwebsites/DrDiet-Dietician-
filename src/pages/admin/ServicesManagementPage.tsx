import { useState } from 'react'
import { Plus, Pencil, Trash2, PersonStanding, Music, Droplets, AlertTriangle, RefreshCw } from 'lucide-react'
import AdminPageShell  from '@/components/admin/AdminPageShell'
import StatusBadge     from '@/components/admin/StatusBadge'
import AdminBtn        from '@/components/admin/AdminBtn'
import AdminFormModal  from '@/components/admin/AdminFormModal'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import ConfirmModal    from '@/components/ui/ConfirmModal'
import FormField       from '@/components/shared/FormField'
import SelectField     from '@/components/shared/SelectField'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'
import { useAdminServices } from '@/hooks/useAdminServices'
import {
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '@/hooks/useAdminServiceMutations'
import type { Service } from '@/types'

const TYPE_OPTS = [
  { value: 'yoga',       label: 'Yoga' },
  { value: 'zumba',      label: 'Zumba' },
  { value: 'blood_test', label: 'Blood Test' },
]
const TYPE_ICONS: Record<string, React.ReactElement> = {
  yoga:       <PersonStanding size={24} strokeWidth={1.8}/>,
  zumba:      <Music          size={24} strokeWidth={1.8}/>,
  blood_test: <Droplets       size={24} strokeWidth={1.8}/>,
}
const TYPE_LABELS: Record<string, string> = { yoga: 'Yoga', zumba: 'Zumba', blood_test: 'Blood Test' }
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  yoga:       { bg: '#dcfce7', text: '#16a34a' },
  zumba:      { bg: '#fef3c7', text: '#d97706' },
  blood_test: { bg: '#fee2e2', text: '#dc2626' },
}

interface ServiceFormState {
  name: string
  type: string
  description: string
  price: string
  slots: string[]
  isActive: boolean
}

const EMPTY_FORM: ServiceFormState = {
  name: '', type: '', description: '', price: '', slots: [], isActive: true,
}

function SlotsInput({
  slots,
  onChange,
}: {
  slots: string[]
  onChange: (slots: string[]) => void
}) {
  const [input, setInput] = useState('')
  const add = () => {
    if (input.trim()) { onChange([...slots, input.trim()]); setInput('') }
  }
  const remove = (i: number) => onChange(slots.filter((_, idx) => idx !== i))
  return (
    <div>
      <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, display: 'block', marginBottom: '6px' }}>
        Available Slots
      </label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder="eg. 9:00 AM"
          style={{ flex: 1, height: '38px', padding: '0 12px', border: `1px solid ${COLORS.inputBorder}`, borderRadius: '10px', background: COLORS.inputBg, fontSize: FONT_SIZE.sm, color: COLORS.navy, outline: 'none', fontFamily: 'inherit' }}
        />
        <button type="button" onClick={add} style={{ padding: '0 14px', borderRadius: '10px', background: COLORS.brand, border: 'none', color: '#fff', cursor: 'pointer', fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, fontFamily: 'inherit' }}>
          Add
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {slots.map((s, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: COLORS.brandLight, color: COLORS.brand, padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600 }}>
            {s}
            <button type="button" onClick={() => remove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: COLORS.brand, fontSize: '12px', lineHeight: 1 }}>×</button>
          </span>
        ))}
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="svc-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="skeleton-pulse" style={{ width: '50px', height: '50px', minWidth: '50px', borderRadius: '14px', background: '#e8edf0' }}/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div className="skeleton-pulse" style={{ height: '14px', width: '70%', borderRadius: '6px', background: '#e8edf0' }}/>
          <div className="skeleton-pulse" style={{ height: '20px', width: '60px', borderRadius: '99px', background: '#e8edf0' }}/>
        </div>
      </div>
      <div className="skeleton-pulse" style={{ height: '12px', width: '100%', borderRadius: '6px', background: '#e8edf0' }}/>
      <div className="skeleton-pulse" style={{ height: '12px', width: '80%', borderRadius: '6px', background: '#e8edf0' }}/>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {[70, 60, 80].map((w, i) => (
          <div key={i} className="skeleton-pulse" style={{ height: '22px', width: `${w}px`, borderRadius: '6px', background: '#e8edf0' }}/>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: `1px solid ${COLORS.divider}` }}>
        <div className="skeleton-pulse" style={{ height: '20px', width: '80px', borderRadius: '6px', background: '#e8edf0' }}/>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div className="skeleton-pulse" style={{ height: '30px', width: '60px', borderRadius: '8px', background: '#e8edf0' }}/>
          <div className="skeleton-pulse" style={{ height: '30px', width: '72px', borderRadius: '8px', background: '#e8edf0' }}/>
        </div>
      </div>
    </div>
  )
}

function ServiceForm({
  id,
  form,
  setForm,
}: {
  id: string
  form: ServiceFormState
  setForm: React.Dispatch<React.SetStateAction<ServiceFormState>>
}) {
  return (
    <form id={id} className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="svc-name" label="Service Name" placeholder="eg. Morning Yoga"
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <SelectField
          id="svc-type" label="Type" options={TYPE_OPTS}
          value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))}
          placeholder="Select type"
        />
        <div className="sm:col-span-2">
          <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, display: 'block', marginBottom: '6px' }}>Description</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe the service…"
            style={{ width: '100%', borderRadius: '10px', border: `1px solid ${COLORS.inputBorder}`, background: COLORS.inputBg, padding: '10px 12px', fontSize: FONT_SIZE.sm, color: COLORS.navy, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>
        <FormField
          id="svc-price" label="Price per Session (₹)" type="number" placeholder="799"
          value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
        />
      </div>
      <SlotsInput slots={form.slots} onChange={slots => setForm(f => ({ ...f, slots }))}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>Active</label>
        <button
          type="button"
          onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
          style={{ width: '42px', height: '22px', borderRadius: '99px', background: form.isActive ? COLORS.brand : COLORS.divider, border: 'none', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{ position: 'absolute', top: '3px', left: form.isActive ? undefined : '3px', right: form.isActive ? '3px' : undefined, width: '16px', height: '16px', borderRadius: '50%', background: '#fff' }}/>
        </button>
      </div>
    </form>
  )
}

export default function ServicesManagementPage() {
  const [modalOpen,  setModal]   = useState(false)
  const [deleteOpen, setDelete]  = useState(false)
  const [selected,   setSelected] = useState<Service | null>(null)
  const [form, setForm] = useState<ServiceFormState>(EMPTY_FORM)

  const { services, isLoading, isError, refetch } = useAdminServices()

  const createMutation = useCreateService(() => { setModal(false); setForm(EMPTY_FORM) })
  const updateMutation = useUpdateService(() => { setModal(false); setSelected(null) })
  const deleteMutation = useDeleteService(() => { setDelete(false); setSelected(null) })

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  function openCreate() {
    setSelected(null)
    setForm(EMPTY_FORM)
    setModal(true)
  }

  function openEdit(svc: Service) {
    setSelected(svc)
    setForm({
      name: svc.name, type: svc.type, description: svc.description,
      price: String(svc.price), slots: svc.slots ?? [], isActive: svc.isActive,
    })
    setModal(true)
  }

  function handleToggleActive(svc: Service) {
    updateMutation.mutate({ id: svc.id, payload: { isActive: !svc.isActive } })
  }

  function handleSubmit() {
    const payload = {
      name: form.name,
      type: form.type as Service['type'],
      description: form.description,
      price: Number(form.price),
      slots: form.slots,
      isActive: form.isActive,
    }
    if (selected) {
      updateMutation.mutate({ id: selected.id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }

        .svc-grid{display:grid;grid-template-columns:1fr;gap:16px;}
        @media(min-width:640px){.svc-grid{grid-template-columns:1fr 1fr;}}
        @media(min-width:1024px){.svc-grid{grid-template-columns:repeat(3,1fr);}}

        .svc-card{background:#fff;border-radius:16px;border:1px solid #e6edf0;box-shadow:0 1px 4px rgba(0,0,0,.08);padding:18px;display:flex;flex-direction:column;gap:12px;}
      `}</style>

      <AdminPageShell
        title="Services"
        subtitle="Manage yoga, zumba, and blood test services"
        actions={<AdminBtn icon={<Plus size={15}/>} onClick={openCreate}>Add Service</AdminBtn>}
      >
        {isError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: '#fff7ed', border: '1px solid #fed7aa', marginBottom: '16px', flexWrap: 'wrap' }}>
            <AlertTriangle size={16} color="#ea580c"/>
            <span style={{ flex: 1, fontSize: FONT_SIZE.sm, color: '#c2410c' }}>Failed to load services. Please try again.</span>
            <button onClick={() => refetch()} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '7px', background: '#ea580c', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: FONT_WEIGHT.semibold }}>
              <RefreshCw size={12}/> Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="svc-grid">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i}/>)}
          </div>
        ) : !isError && services.length === 0 ? (
          <AdminEmptyState icon={<PersonStanding size={22}/>} title="No services yet" description="Add your first service"/>
        ) : (
          <div className="svc-grid" style={{ opacity: isMutating ? 0.65 : 1, transition: 'opacity 0.2s' }}>
            {services.map(svc => {
              const cc = TYPE_COLORS[svc.type] ?? { bg: '#f0f4f6', text: '#6b8896' }
              return (
                <div key={svc.id} className="svc-card" style={{ opacity: svc.isActive ? 1 : 0.65 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '50px', height: '50px', minWidth: '50px', borderRadius: '14px', background: COLORS.brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.brand }}>
                      {TYPE_ICONS[svc.type] ?? <PersonStanding size={24} strokeWidth={1.8}/>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '3px' }}>
                        <p style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy, margin: 0, lineHeight: 1.2 }}>{svc.name}</p>
                      </div>
                      <span style={{ background: cc.bg, color: cc.text, borderRadius: '99px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>
                        {TYPE_LABELS[svc.type] ?? svc.type}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: COLORS.muted, lineHeight: 1.5, margin: 0 }}>{svc.description}</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy }}>₹{svc.price}</span>
                      <span style={{ fontSize: '12px', color: COLORS.muted }}> / session</span>
                    </div>
                    <StatusBadge status={svc.isActive ? 'active' : 'inactive'}/>
                  </div>

                  <div>
                    <p style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      Slots ({(svc.slots ?? []).length})
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {(svc.slots ?? []).map(s => (
                        <span key={s} style={{ background: '#f0f4f6', color: COLORS.body, borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 500 }}>{s}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: `1px solid ${COLORS.divider}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: COLORS.muted }}>{svc.isActive ? 'Active' : 'Inactive'}</span>
                      <button
                        onClick={() => handleToggleActive(svc)}
                        disabled={updateMutation.isPending}
                        style={{ width: '38px', height: '20px', borderRadius: '99px', border: 'none', background: svc.isActive ? COLORS.brand : COLORS.divider, cursor: updateMutation.isPending ? 'not-allowed' : 'pointer', position: 'relative', flexShrink: 0 }}
                      >
                        <div style={{ position: 'absolute', top: '2px', left: svc.isActive ? undefined : '2px', right: svc.isActive ? '2px' : undefined, width: '16px', height: '16px', borderRadius: '50%', background: '#fff' }}/>
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEdit(svc)} style={{ padding: '5px 10px', borderRadius: '8px', border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: 'pointer', color: COLORS.brand, fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Pencil size={13}/> Edit
                      </button>
                      <button onClick={() => { setSelected(svc); setDelete(true) }} style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: '#fee2e2', cursor: 'pointer', color: '#dc2626', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trash2 size={13}/> Delete
                      </button>
                    </div>
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
        title={selected ? 'Edit Service' : 'Add Service'}
        size="md"
        footer={
          <>
            <AdminBtn variant="secondary" onClick={() => { setModal(false); setForm(EMPTY_FORM) }}>Cancel</AdminBtn>
            <AdminBtn onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving…' : selected ? 'Save Changes' : 'Add Service'}
            </AdminBtn>
          </>
        }
      >
        <ServiceForm id="svc-form" form={form} setForm={setForm}/>
      </AdminFormModal>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => { setDelete(false); setSelected(null) }}
        onConfirm={() => selected && deleteMutation.mutate(selected.id)}
        loading={deleteMutation.isPending}
        variant="danger"
        title={`Delete "${selected?.name}"?`}
        description="This will permanently remove this service and all associated bookings."
        confirmLabel="Delete Service"
      />
    </>
  )
}
