import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UtensilsCrossed, AlertTriangle, RefreshCw } from 'lucide-react'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import { ROUTES } from '@/config/routes'
import { DIET_PLAN_DURATION_LABELS } from '@/config/constants'
import { useDoctorDietPlans } from '@/hooks/useDoctorDietPlans'
import type { DietPlanStatus } from '@/types'

const TABS: { value: DietPlanStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING_APPROVAL', label: 'Pending' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'APPROVED', label: 'Approved' },
]

const ST: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: '#f0f4f6', text: '#6b8896' },
  PENDING_APPROVAL: { bg: '#fef3c7', text: '#b45309' },
  APPROVED: { bg: '#dcfce7', text: '#16a34a' },
  REJECTED: { bg: '#fee2e2', text: '#dc2626' },
}

export default function DoctorDietPlansPage() {
  const nav = useNavigate()
  const [status, setStatus] = useState<DietPlanStatus | ''>('')
  const { plans, isLoading, isError, refetch } = useDoctorDietPlans({ status, limit: 20 })

  return (
    <div style={{ padding: 16, width: '100%' }}>
      <h1 style={{ margin: 0, fontSize: FONT_SIZE.xl, color: COLORS.navy }}>Diet plans</h1>
      <p style={{ margin: '4px 0 16px', fontSize: FONT_SIZE.sm, color: COLORS.muted }}>
        Write and submit plans within 24 hours of assignment. Patients see meals only after admin approval.
      </p>

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
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, color: '#c2410c', fontSize: 13 }}>
          <AlertTriangle size={16} /> Failed to load.
          <button onClick={() => refetch()} style={{ background: 'none', border: 'none', color: COLORS.brand, cursor: 'pointer' }}><RefreshCw size={12} /> Retry</button>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${COLORS.divider}`, boxShadow: SHADOW.card, overflow: 'hidden' }}>
        {isLoading ? (
          <p style={{ padding: 24, color: COLORS.muted }}>Loading…</p>
        ) : plans.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <UtensilsCrossed size={32} color={COLORS.brand} />
            <p style={{ fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>No diet plans</p>
            <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted }}>Open a package patient to create a plan.</p>
          </div>
        ) : plans.map(p => {
          const s = ST[p.status] ?? ST.DRAFT
          return (
            <div
              key={p.id}
              onClick={() => p.patientId && nav(ROUTES.DOCTOR.PATIENT_DIET_PLAN.replace(':id', p.patientId))}
              style={{
                padding: '14px 16px', borderBottom: `1px solid ${COLORS.divider}`, cursor: 'pointer',
                display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 160 }}>
                <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>{p.patient?.fullName ?? 'Patient'}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: COLORS.muted }}>
                  {DIET_PLAN_DURATION_LABELS[p.duration] ?? p.duration}
                  {p.isOverdue ? ' · Overdue' : p.hoursRemaining != null ? ` · Due in ${p.hoursRemaining}h` : ''}
                </p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: s.bg, color: s.text }}>
                {p.status.replace('_', ' ')}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
