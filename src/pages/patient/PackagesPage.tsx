import { useState } from 'react'
import { Check } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'

type Duration = '1_month' | '3_months' | '6_months'

const DURATION_LABELS: Record<Duration, string> = {
  '1_month':  '1 Month',
  '3_months': '3 Months',
  '6_months': '6 Months',
}

const PACKAGES = [
  {
    id: 'thyroid',
    name: 'Thyroid Care',
    description: 'Comprehensive diet plan tailored for thyroid health management.',
    features: ['Weekly diet charts', 'Hormone-friendly recipes', 'Doctor consultations', 'Monthly blood report review'],
    prices: { '1_month': 2499, '3_months': 6499, '6_months': 11999 },
    popular: false,
    color: '#e8f7f9',
    border: '#a8d8e2',
  },
  {
    id: 'diabetes',
    name: 'Diabetes Control',
    description: 'Science-backed nutritional roadmap for managing blood sugar levels.',
    features: ['Daily meal plans', 'Glycemic index guidance', 'HbA1c tracking support', '2x monthly consultations'],
    prices: { '1_month': 2999, '3_months': 7999, '6_months': 13999 },
    popular: true,
    color: '#eef8f0',
    border: '#86d4a0',
  },
  {
    id: 'weight_loss',
    name: 'Weight Loss',
    description: 'Sustainable fat-loss program with personalised calorie targets.',
    features: ['Calorie-deficit plans', 'Exercise synergy tips', 'Progress tracking', 'Weekly check-ins'],
    prices: { '1_month': 1999, '3_months': 5499, '6_months': 9999 },
    popular: false,
    color: '#fff8ed',
    border: '#f5d090',
  },
  {
    id: 'general',
    name: 'General Wellness',
    description: 'Balanced nutrition for everyday health and long-term vitality.',
    features: ['Balanced meal plans', 'Immunity-boosting diet', 'Gut health focus', 'Monthly consultation'],
    prices: { '1_month': 1499, '3_months': 3999, '6_months': 7499 },
    popular: false,
    color: '#f3f0ff',
    border: '#c4b5fd',
  },
]

function formatPrice(p: number) {
  return `₹${p.toLocaleString('en-IN')}`
}

export default function PackagesPage() {
  const [duration, setDuration] = useState<Duration>('1_month')

  const handleBuy = (packageId: string, price: number) => {
    console.log('Initiate Razorpay', packageId, price)
  }

  return (
    <PageShell
      title="Care Packages"
      subtitle="Choose a plan that fits your health goals. All plans include direct dietician support."
    >
      <div className="flex items-center gap-2 p-1 bg-[#f0f4f6] rounded-xl w-fit">
        {(Object.keys(DURATION_LABELS) as Duration[]).map(d => (
          <button
            key={d}
            onClick={() => setDuration(d)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              duration === d
                ? 'bg-white text-[#1a6b7a] shadow-sm'
                : 'text-[#6b8896] hover:text-[#1a3c4d]'
            }`}
          >
            {DURATION_LABELS[d]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {PACKAGES.map(pkg => (
          <div
            key={pkg.id}
            className="relative bg-white rounded-2xl border p-5 flex flex-col gap-4 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            style={{ borderColor: pkg.border }}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a6b7a] text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
                POPULAR
              </span>
            )}

            <div className="rounded-xl p-3 w-fit" style={{ background: pkg.color }}>
              <p className="text-[14px] font-bold text-[#1a3c4d]">{pkg.name}</p>
            </div>

            <p className="text-[12px] text-[#6b8896] leading-relaxed">{pkg.description}</p>

            <div>
              <p className="text-[26px] font-bold text-[#1a3c4d] leading-none">
                {formatPrice(pkg.prices[duration])}
              </p>
              <p className="text-[11px] text-[#6b8896] mt-0.5">{DURATION_LABELS[duration]}</p>
            </div>

            <ul className="flex flex-col gap-2 flex-1">
              {pkg.features.map(f => (
                <li key={f} className="flex items-start gap-2">
                  <Check size={14} className="text-[#1a6b7a] mt-0.5 shrink-0" />
                  <span className="text-[12px] text-[#374955]">{f}</span>
                </li>
              ))}
            </ul>

            <PrimaryButton fullWidth onClick={() => handleBuy(pkg.id, pkg.prices[duration])}>
              Buy Now
            </PrimaryButton>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
