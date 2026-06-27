import { Download, FileText, Calendar } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'
import EmptyState from '@/components/patient/shared/EmptyState'

const DUMMY_PLANS = [
  {
    id: '1',
    title: 'Week 1-2: Detox & Reset',
    content: 'Start with light foods. Avoid processed sugar, dairy, and red meat. Focus on hydration (3L/day). Include green leafy vegetables in every meal.',
    createdBy: 'Dr. Priya Sharma',
    createdAt: '2025-06-20',
    updatedAt: '2025-06-22',
    fileUrl: '#',
  },
  {
    id: '2',
    title: 'Week 3-4: Balanced Macros',
    content: 'Introduce complex carbs (brown rice, oats). 30% protein, 40% carbs, 30% healthy fats. Pre-workout banana or dates. Post-workout protein within 45 min.',
    createdBy: 'Dr. Priya Sharma',
    createdAt: '2025-07-01',
    updatedAt: '2025-07-01',
    fileUrl: '#',
  },
  {
    id: '3',
    title: 'July Thyroid Meal Plan',
    content: 'Avoid cruciferous vegetables raw (broccoli, cauliflower). Increase selenium foods: eggs, sunflower seeds. Brazil nuts (2/day). Iodine-rich foods: seaweed, fish.',
    createdBy: 'Dr. James Wilson',
    createdAt: '2025-07-05',
    updatedAt: '2025-07-06',
    fileUrl: '#',
  },
]

export default function DietPlansPage() {
  if (DUMMY_PLANS.length === 0) {
    return (
      <PageShell title="Diet Plans" subtitle="Personalised nutrition plans from your dietician.">
        <EmptyState
          icon={<FileText size={24} />}
          title="No diet plans yet"
          description="Your dietician will share personalised meal plans here after your consultation."
        />
      </PageShell>
    )
  }

  return (
    <PageShell title="Diet Plans" subtitle="Personalised nutrition plans shared by your dietician.">
      <div className="flex flex-col gap-4">
        {DUMMY_PLANS.map(plan => (
          <div key={plan.id} className="bg-white rounded-2xl border border-[#e6edf0] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d0ecf2] flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-[#1a6b7a]" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[#1a3c4d] leading-snug">{plan.title}</p>
                  <p className="text-[12px] text-[#6b8896] mt-0.5">By {plan.createdBy}</p>
                </div>
              </div>

              {plan.fileUrl && (
                <PrimaryButton size="sm" variant="outline" onClick={() => window.open(plan.fileUrl)}>
                  <Download size={13} /> Download
                </PrimaryButton>
              )}
            </div>

            <p className="text-[13px] text-[#374955] leading-relaxed bg-[#f7fafb] rounded-xl p-4 border border-[#e6edf0]">
              {plan.content}
            </p>

            <div className="flex items-center gap-4 mt-3 text-[11px] text-[#9ab0bb]">
              <span className="flex items-center gap-1">
                <Calendar size={11} /> Created {plan.createdAt}
              </span>
              {plan.updatedAt !== plan.createdAt && (
                <span>Updated {plan.updatedAt}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
