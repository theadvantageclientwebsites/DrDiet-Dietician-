import { FileText, UtensilsCrossed, AlertCircle, RefreshCw } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'
import EmptyState from '@/components/patient/shared/EmptyState'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { DIET_PLAN_DURATION_LABELS } from '@/config/constants'
import { usePatientDietPlan } from '@/hooks/usePatientPortal'

export default function DietPlansPage() {
  const nav = useNavigate()
  const { dietPlan, isLoading, isError, refetch } = usePatientDietPlan()

  if (isLoading) {
    return (
      <PageShell title="Diet Plans" subtitle="Personalised nutrition from your dietician.">
        <p className="text-[13px] text-[#6b8896] py-8 text-center">Loading…</p>
      </PageShell>
    )
  }

  if (isError) {
    return (
      <PageShell title="Diet Plans" subtitle="Personalised nutrition from your dietician.">
        <div className="flex items-center gap-2 text-[#c2410c] text-[13px]">
          <AlertCircle size={16} /> Could not load your diet plan.
          <button onClick={() => refetch()} className="underline flex items-center gap-1"><RefreshCw size={12} /> Retry</button>
        </div>
      </PageShell>
    )
  }

  const visible = dietPlan?.visible === true && dietPlan.plan?.status === 'APPROVED' && dietPlan.plan
  const plan = visible ? dietPlan.plan : null

  if (!plan) {
    const status = dietPlan?.patientStatus
    const cta = status === 'NO_PACKAGE'
      ? <PrimaryButton size="sm" onClick={() => nav(ROUTES.PATIENT.PACKAGES)}>Browse packages</PrimaryButton>
      : undefined
    return (
      <PageShell title="Diet Plans" subtitle="Personalised nutrition from your dietician.">
        <EmptyState
          icon={<FileText size={24} />}
          title={dietPlan?.message ?? 'Your plan is being prepared'}
          description={
            status === 'WAITING_FOR_DOCTOR_ASSIGNMENT'
              ? 'Admin will assign a doctor first.'
              : status === 'PENDING_APPROVAL'
                ? 'Admin is reviewing your plan. Meals appear after approval.'
                : 'You will see breakfast, lunch, dinner, and foods to eat or avoid once it is approved.'
          }
          action={cta}
        />
      </PageShell>
    )
  }

  return (
    <PageShell title="Diet Plans" subtitle={dietPlan?.message ?? 'Your diet plan is ready'}>
      <div className="bg-white rounded-2xl border border-[#e6edf0] p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#d0ecf2] flex items-center justify-center shrink-0">
            <UtensilsCrossed size={18} className="text-[#1a6b7a]" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-[#1a3c4d] m-0">
              {DIET_PLAN_DURATION_LABELS[plan.duration] ?? plan.duration} plan
            </p>
            {plan.doctor?.fullName && (
              <p className="text-[12px] text-[#6b8896] mt-0.5">By {plan.doctor.fullName}</p>
            )}
            {plan.calorieTarget != null && (
              <p className="text-[13px] text-[#1a6b7a] font-semibold mt-1">{plan.calorieTarget} kcal / day</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Meal title="Breakfast" body={plan.breakfast} />
          <Meal title="Lunch" body={plan.lunch} />
          <Meal title="Dinner" body={plan.dinner} />
          <Meal title="Snacks" body={plan.snacks} />
        </div>

        {plan.foodsToEat?.length > 0 && (
          <div className="mt-4">
            <p className="text-[12px] font-semibold text-[#1a3c4d] mb-1">Foods to eat</p>
            <p className="text-[13px] text-[#374955]">{plan.foodsToEat.join(', ')}</p>
          </div>
        )}
        {plan.foodsToAvoid?.length > 0 && (
          <div className="mt-3">
            <p className="text-[12px] font-semibold text-[#1a3c4d] mb-1">Foods to avoid</p>
            <p className="text-[13px] text-[#374955]">{plan.foodsToAvoid.join(', ')}</p>
          </div>
        )}
        {plan.notes && (
          <p className="text-[13px] text-[#374955] mt-4 bg-[#f7fafb] rounded-xl p-3">{plan.notes}</p>
        )}
      </div>
    </PageShell>
  )
}

function Meal({ title, body }: { title: string; body: string | null }) {
  if (!body) return null
  return (
    <div className="rounded-xl border border-[#e6edf0] p-3 bg-[#f7fafb]">
      <p className="text-[11px] font-semibold uppercase text-[#1a6b7a] m-0">{title}</p>
      <p className="text-[13px] text-[#374955] mt-1 mb-0">{body}</p>
    </div>
  )
}
