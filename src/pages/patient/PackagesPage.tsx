import { useState } from 'react'
import { Check, AlertCircle, RefreshCw } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'
import { usePatientPortalPackages } from '@/hooks/usePatientPortal'
import type { PatientPackageDuration } from '@/types'

type Duration = '1_month' | '3_months' | '6_months'

const DURATION_LABELS: Record<Duration, string> = {
  '1_month':  '1 Month',
  '3_months': '3 Months',
  '6_months': '6 Months',
}

const DURATION_TO_API: Record<Duration, PatientPackageDuration> = {
  '1_month':  'ONE_MONTH',
  '3_months': 'THREE_MONTHS',
  '6_months': 'SIX_MONTHS',
}

function formatPrice(p: number) {
  return `₹${p.toLocaleString('en-IN')}`
}

function getPrice(pkg: { price1Month: number; price3Months: number; price6Months: number }, d: Duration) {
  if (d === '1_month') return pkg.price1Month
  if (d === '3_months') return pkg.price3Months
  return pkg.price6Months
}

export default function PackagesPage() {
  const [duration, setDuration] = useState<Duration>('1_month')
  const { packages, isLoading, isError, refetch } = usePatientPortalPackages()

  const handleBuy = (packageId: string, price: number) => {
    // Razorpay flow: usePatientCreateOrder + verify — wire when checkout modal added
    alert(`Payment integration: package ${packageId}, ₹${price} (${DURATION_TO_API[duration]})`)
  }

  return (
    <PageShell title="Care Packages" subtitle="Choose a plan that fits your health goals. All plans include direct dietician support.">
      <div className="flex items-center gap-2 p-1 bg-[#f0f4f6] rounded-xl w-fit">
        {(Object.keys(DURATION_LABELS) as Duration[]).map(d => (
          <button
            key={d}
            onClick={() => setDuration(d)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              duration === d ? 'bg-white text-[#1a6b7a] shadow-sm' : 'text-[#6b8896]'
            }`}
          >
            {DURATION_LABELS[d]}
          </button>
        ))}
      </div>

      {isError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#fff7ed] text-[#c2410c] text-[13px]">
          <AlertCircle size={16} /> Failed to load packages.
          <button onClick={() => refetch()} className="underline flex items-center gap-1"><RefreshCw size={12} /> Retry</button>
        </div>
      )}

      {isLoading ? (
        <p className="text-[13px] text-[#6b8896] py-8 text-center">Loading packages…</p>
      ) : packages.length === 0 ? (
        <p className="text-[13px] text-[#6b8896] py-8 text-center">No packages available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {packages.map(pkg => {
            const price = getPrice(pkg, duration)
            return (
              <div key={pkg.id} className="bg-white rounded-2xl border border-[#e6edf0] p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-[11px] font-semibold text-[#1a6b7a] uppercase">{pkg.category}</p>
                    <p className="text-[16px] font-bold text-[#1a3c4d] mt-0.5">{pkg.name}</p>
                  </div>
                  <p className="text-[18px] font-bold text-[#1a3c4d]">{formatPrice(price)}</p>
                </div>
                {pkg.description && (
                  <p className="text-[12px] text-[#6b8896] mb-3">{pkg.description}</p>
                )}
                <ul className="flex flex-col gap-1.5 mb-4 flex-1">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-[12px] text-[#374955]">
                      <Check size={13} className="text-[#1a6b7a] shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <PrimaryButton fullWidth onClick={() => handleBuy(pkg.id, price)}>
                  Buy {DURATION_LABELS[duration]}
                </PrimaryButton>
              </div>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
