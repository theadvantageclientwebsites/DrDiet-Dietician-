import { useState } from 'react'
import { UtensilsCrossed, AlertTriangle, RefreshCw } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import { DIET_PLAN_DURATION_LABELS } from '@/config/constants'
import { useAdminDietPlans, useApproveDietPlan, useRejectDietPlan } from '@/hooks/useAdminDietPlans'
import type { DietPlanStatus } from '@/types'

const TABS: { value: DietPlanStatus | ''; label: string }[] = [
  { value: 'PENDING_APPROVAL', label: 'Needs approval' },
  { value: '', label: 'All' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
]

export default function AdminDietPlansPage() {
  const [status, setStatus] = useState<DietPlanStatus | ''>('PENDING_APPROVAL')
  const [openId, setOpenId] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const { plans, isLoading, isError, refetch } = useAdminDietPlans({ status, limit: 20 })
  const approve = useApproveDietPlan()
  const reject = useRejectDietPlan()
  const selected = plans.find(p => p.id === openId) ?? null

  return (
    <AdminPageShell title="Diet plans" subtitle="Approve before the patient can see meals. Nothing auto-publishes.">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {TABS.map(t => (
          <button key={t.value || 'all'} onClick={() => setStatus(t.value)} style={{
            padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: status === t.value ? COLORS.brand : COLORS.brandLight,
            color: status === t.value ? '#fff' : COLORS.brand,
            fontSize: 12, fontWeight: FONT_WEIGHT.semibold,
          }}>{t.label}</button>
        ))}
      </div>

      {isError && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, color: '#c2410c' }}>
          <AlertTriangle size={16} /> Failed to load.
          <button onClick={() => refetch()} style={{ background: 'none', border: 'none', color: COLORS.brand, cursor: 'pointer' }}><RefreshCw size={12} /> Retry</button>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${COLORS.divider}`, boxShadow: SHADOW.card, overflow: 'hidden' }}>
        {isLoading ? <p style={{ padding: 24, color: COLORS.muted }}>Loading…</p>
          : plans.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <UtensilsCrossed size={28} color={COLORS.brand} />
              <p style={{ fontWeight: FONT_WEIGHT.semibold }}>No plans in this filter</p>
            </div>
          ) : plans.map(p => (
            <div key={p.id} style={{
              padding: '14px 16px', borderBottom: `1px solid ${COLORS.divider}`,
              display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>{p.patient?.fullName ?? 'Patient'}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: COLORS.muted }}>
                  {p.doctor?.fullName ?? 'Doctor'} · {DIET_PLAN_DURATION_LABELS[p.duration] ?? p.duration}
                  {p.isOverdue ? ' · Overdue submit' : ''}
                </p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.brand }}>{p.status.replace(/_/g, ' ')}</span>
              {p.status === 'PENDING_APPROVAL' && (
                <>
                  <button onClick={() => approve.mutate(p.id)} disabled={approve.isPending} style={{
                    padding: '6px 12px', borderRadius: 8, border: 'none', background: COLORS.brand, color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  }}>Approve</button>
                  <button onClick={() => { setOpenId(p.id); setReason('') }} style={{
                    padding: '6px 12px', borderRadius: 8, border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#dc2626',
                  }}>Reject</button>
                </>
              )}
              <button onClick={() => setOpenId(p.id)} style={{
                padding: '6px 12px', borderRadius: 8, border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: 'pointer', fontSize: 12,
              }}>View</button>
            </div>
          ))}
      </div>

      {selected && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,61,74,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }} onClick={() => setOpenId(null)}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto', padding: 20 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 8px', color: COLORS.navy }}>Diet plan</h2>
            <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 0 }}>
              {selected.patient?.fullName} · {selected.doctor?.fullName} · {DIET_PLAN_DURATION_LABELS[selected.duration]}
            </p>
            {selected.calorieTarget != null && <p style={{ fontSize: 14 }}>{selected.calorieTarget} kcal / day</p>}
            <Meal label="Breakfast" value={selected.breakfast} />
            <Meal label="Lunch" value={selected.lunch} />
            <Meal label="Dinner" value={selected.dinner} />
            <Meal label="Snacks" value={selected.snacks} />
            {selected.foodsToEat?.length > 0 && <p style={{ fontSize: 13 }}><b>Eat:</b> {selected.foodsToEat.join(', ')}</p>}
            {selected.foodsToAvoid?.length > 0 && <p style={{ fontSize: 13 }}><b>Avoid:</b> {selected.foodsToAvoid.join(', ')}</p>}
            {selected.notes && <p style={{ fontSize: 13 }}><b>Notes:</b> {selected.notes}</p>}

            {selected.status === 'PENDING_APPROVAL' && (
              <div style={{ marginTop: 16 }}>
                <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} placeholder="Reject reason (optional)"
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${COLORS.divider}`, fontFamily: 'inherit', marginBottom: 8 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => approve.mutate(selected.id, { onSuccess: () => setOpenId(null) })} style={{
                    padding: '8px 14px', borderRadius: 8, border: 'none', background: COLORS.brand, color: '#fff', cursor: 'pointer', fontWeight: 600,
                  }}>Approve</button>
                  <button onClick={() => reject.mutate({ id: selected.id, reason: reason.trim() || undefined }, { onSuccess: () => setOpenId(null) })} style={{
                    padding: '8px 14px', borderRadius: 8, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontWeight: 600,
                  }}>Reject</button>
                </div>
              </div>
            )}
            <button onClick={() => setOpenId(null)} style={{ marginTop: 12, background: 'none', border: 'none', color: COLORS.muted, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </AdminPageShell>
  )
}

function Meal({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return <p style={{ fontSize: 13, margin: '8px 0' }}><b>{label}:</b> {value}</p>
}
