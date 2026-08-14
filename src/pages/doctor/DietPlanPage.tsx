/**
 * DoctorDietPlanPage — create/update draft and submit for admin approval.
 * POST /doctor/diet-plans, PATCH /doctor/diet-plans/:id/submit
 */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import { ROUTES } from '@/config/routes'
import { DIET_PLAN_DURATION_LABELS } from '@/config/constants'
import {
  useDoctorPatientDietPlan,
  useUpsertDoctorDietPlan,
  useSubmitDoctorDietPlan,
} from '@/hooks/useDoctorDietPlans'
import type { DietPlanDuration, DietPlanStatus } from '@/types'

const DURATIONS: DietPlanDuration[] = ['SEVEN_DAYS', 'TEN_DAYS', 'FIFTEEN_DAYS']

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT:             { bg: '#f0f4f6', text: '#6b8896', label: 'Draft' },
  PENDING_APPROVAL:  { bg: '#fef3c7', text: '#b45309', label: 'Waiting for admin' },
  APPROVED:          { bg: '#dcfce7', text: '#16a34a', label: 'Approved' },
  REJECTED:          { bg: '#fee2e2', text: '#dc2626', label: 'Rejected' },
}

function splitList(s: string) {
  return s.split(',').map(x => x.trim()).filter(Boolean)
}

export default function DoctorDietPlanPage() {
  const { id: patientId } = useParams<{ id: string }>()
  const nav = useNavigate()
  const { data, isLoading, isError, refetch } = useDoctorPatientDietPlan(patientId)
  const save = useUpsertDoctorDietPlan()
  const submit = useSubmitDoctorDietPlan(patientId)

  const plan = data?.plan ?? null
  const status = (plan?.status ?? 'DRAFT') as DietPlanStatus
  const locked = status === 'PENDING_APPROVAL' || status === 'APPROVED'

  const [duration, setDuration] = useState<DietPlanDuration>('SEVEN_DAYS')
  const [calorieTarget, setCalorieTarget] = useState('')
  const [foodsToEat, setFoodsToEat] = useState('')
  const [foodsToAvoid, setFoodsToAvoid] = useState('')
  const [breakfast, setBreakfast] = useState('')
  const [lunch, setLunch] = useState('')
  const [dinner, setDinner] = useState('')
  const [snacks, setSnacks] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!plan) return
    setDuration((plan.duration as DietPlanDuration) || 'SEVEN_DAYS')
    setCalorieTarget(plan.calorieTarget != null ? String(plan.calorieTarget) : '')
    setFoodsToEat((plan.foodsToEat ?? []).join(', '))
    setFoodsToAvoid((plan.foodsToAvoid ?? []).join(', '))
    setBreakfast(plan.breakfast ?? '')
    setLunch(plan.lunch ?? '')
    setDinner(plan.dinner ?? '')
    setSnacks(plan.snacks ?? '')
    setNotes(plan.notes ?? '')
  }, [plan?.id, plan?.updatedAt])

  const payload = () => ({
    patientId: patientId!,
    duration,
    calorieTarget: calorieTarget ? Number(calorieTarget) : null,
    foodsToEat: splitList(foodsToEat),
    foodsToAvoid: splitList(foodsToAvoid),
    breakfast: breakfast.trim() || undefined,
    lunch: lunch.trim() || undefined,
    dinner: dinner.trim() || undefined,
    snacks: snacks.trim() || undefined,
    notes: notes.trim() || undefined,
  })

  const handleSave = () => save.mutate(payload())
  const handleSubmit = () => {
    const go = (id: string) => submit.mutate(id)
    if (plan?.id && status !== 'REJECTED' && status !== 'DRAFT') {
      go(plan.id)
      return
    }
    save.mutate(payload(), {
      onSuccess: (res) => {
        const id = res.data?.id
        if (id) go(id)
      },
    })
  }

  const st = STATUS_STYLE[status] ?? STATUS_STYLE.DRAFT
  const input: React.CSSProperties = {
    width: '100%', padding: '8px 10px', borderRadius: 8,
    border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm, fontFamily: 'inherit',
  }

  return (
    <div style={{ padding: 16, width: '100%', maxWidth: 720 }}>
      <button onClick={() => nav(ROUTES.DOCTOR.PATIENT_DETAIL.replace(':id', patientId ?? ''))} style={{
        display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
        color: COLORS.brand, cursor: 'pointer', marginBottom: 16, fontWeight: FONT_WEIGHT.semibold,
      }}>
        <ArrowLeft size={16} /> Back to patient
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: FONT_SIZE.xl, color: COLORS.navy }}>Diet plan</h1>
          <p style={{ margin: '4px 0 0', fontSize: FONT_SIZE.sm, color: COLORS.muted }}>
            One daily menu that repeats for 7, 10, or 15 days. Submit for admin approval before the patient can see it.
          </p>
        </div>
        <span style={{ padding: '4px 10px', borderRadius: 99, background: st.bg, color: st.text, fontSize: 12, fontWeight: 700 }}>
          {st.label}
        </span>
      </div>

      {data?.isOverdue && (
        <div style={{ padding: 12, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', marginBottom: 16, color: '#b91c1c', fontSize: FONT_SIZE.sm }}>
          Overdue — this plan was due within 24 hours of assignment.
        </div>
      )}
      {!data?.isOverdue && data?.hoursRemaining != null && !['PENDING_APPROVAL', 'APPROVED'].includes(status) && (
        <div style={{ padding: 12, borderRadius: 12, background: '#fffbeb', border: '1px solid #fde68a', marginBottom: 16, color: '#92400e', fontSize: FONT_SIZE.sm }}>
          Plan due in {data.hoursRemaining}h
        </div>
      )}
      {status === 'REJECTED' && plan?.rejectionReason && (
        <div style={{ padding: 12, borderRadius: 12, background: '#fff7ed', border: '1px solid #fed7aa', marginBottom: 16, color: '#c2410c', fontSize: FONT_SIZE.sm }}>
          Admin feedback: {plan.rejectionReason}
        </div>
      )}

      {isError && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, color: '#c2410c' }}>
          <AlertTriangle size={16} /> Could not load diet plan.
          <button onClick={() => refetch()} style={{ background: 'none', border: 'none', color: COLORS.brand, cursor: 'pointer' }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <p style={{ color: COLORS.muted }}>Loading…</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: `1px solid ${COLORS.divider}`, boxShadow: SHADOW.card }}>
          <fieldset disabled={locked} style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: FONT_WEIGHT.semibold, marginBottom: 6 }}>Duration</label>
              <select value={duration} onChange={e => setDuration(e.target.value as DietPlanDuration)} style={input}>
                {DURATIONS.map(d => <option key={d} value={d}>{DIET_PLAN_DURATION_LABELS[d]}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: FONT_WEIGHT.semibold, marginBottom: 6 }}>Calorie target</label>
              <input type="number" min={0} value={calorieTarget} onChange={e => setCalorieTarget(e.target.value)} placeholder="e.g. 1800" style={input} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: FONT_WEIGHT.semibold, marginBottom: 6 }}>Foods to eat (comma separated)</label>
              <input value={foodsToEat} onChange={e => setFoodsToEat(e.target.value)} placeholder="Oats, Dal, Green vegetables" style={input} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: FONT_WEIGHT.semibold, marginBottom: 6 }}>Foods to avoid (comma separated)</label>
              <input value={foodsToAvoid} onChange={e => setFoodsToAvoid(e.target.value)} placeholder="Sugar, Fried food" style={input} />
            </div>
            {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map(meal => (
              <div key={meal}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: FONT_WEIGHT.semibold, marginBottom: 6, textTransform: 'capitalize' }}>{meal}</label>
                <textarea
                  rows={2}
                  value={{ breakfast, lunch, dinner, snacks }[meal]}
                  onChange={e => {
                    const setters = { breakfast: setBreakfast, lunch: setLunch, dinner: setDinner, snacks: setSnacks }
                    setters[meal](e.target.value)
                  }}
                  style={{ ...input, resize: 'vertical' }}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: FONT_WEIGHT.semibold, marginBottom: 6 }}>Notes</label>
              <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} style={{ ...input, resize: 'vertical' }} />
            </div>
          </fieldset>

          {locked && (
            <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, marginTop: 12 }}>
              {status === 'APPROVED' ? 'Approved plans cannot be edited.' : 'Waiting for admin — you cannot edit until it is approved or rejected.'}
            </p>
          )}

          {!locked && (
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              <button
                disabled={save.isPending}
                onClick={handleSave}
                style={{
                  padding: '10px 16px', borderRadius: 10, border: `1px solid ${COLORS.divider}`,
                  background: '#fff', cursor: 'pointer', fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy,
                }}
              >
                {save.isPending ? 'Saving…' : 'Save draft'}
              </button>
              <button
                disabled={save.isPending || submit.isPending}
                onClick={handleSubmit}
                style={{
                  padding: '10px 16px', borderRadius: 10, border: 'none',
                  background: COLORS.brand, color: '#fff', cursor: 'pointer', fontWeight: FONT_WEIGHT.semibold,
                }}
              >
                {submit.isPending ? 'Submitting…' : 'Submit for admin'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
