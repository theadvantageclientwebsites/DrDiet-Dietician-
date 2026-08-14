import { useState } from 'react'
import { Check, AlertCircle, RefreshCw } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'
import ActivePackageCard from '@/components/patient/shared/ActivePackageCard'
import ConfirmModal from '@/components/ui/ConfirmModal'
import {
  usePatientPortalPackages,
  usePatientDummyCheckout,
  usePatientActiveSubscription,
} from '@/hooks/usePatientPortal'
import type { PatientPackageDuration, PatientPortalPackage } from '@/types'

type Duration = PatientPackageDuration

const DURATION_TABS: { value: Duration; label: string }[] = [
  { value: 'THREE_MONTHS',  label: '3 Months'  },
  { value: 'SIX_MONTHS',    label: '6 Months'  },
  { value: 'TWELVE_MONTHS', label: '12 Months' },
]

function formatPrice(p: number) {
  return `₹${p.toLocaleString('en-IN')}`
}

function getPrice(pkg: PatientPortalPackage, d: Duration) {
  if (d === 'THREE_MONTHS') return pkg.price3Months
  if (d === 'SIX_MONTHS') return pkg.price6Months
  return pkg.price12Months
}

export default function PackagesPage() {
  const [duration, setDuration] = useState<Duration>('THREE_MONTHS')
  const [pendingBuy, setPendingBuy] = useState<{ pkg: PatientPortalPackage; price: number } | null>(null)
  const [paidName, setPaidName] = useState<string | null>(null)

  const { packages, isLoading, isError, refetch } = usePatientPortalPackages()
  const { subscription } = usePatientActiveSubscription()
  const checkout = usePatientDummyCheckout()

  const handleConfirmBuy = () => {
    if (!pendingBuy) return
    checkout.mutate(
      { itemType: 'PACKAGE', itemId: pendingBuy.pkg.id, duration },
      {
        onSuccess: (res) => {
          setPaidName(res.data?.itemName ?? pendingBuy.pkg.name)
          setPendingBuy(null)
        },
      },
    )
  }

  return (
    <PageShell title="Care Packages" subtitle="Choose a 3, 6, or 12 month plan. Appointments start after a doctor is assigned.">
      <ActivePackageCard subscription={subscription} compact />

      {paidName && (
        <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-4">
          <p className="text-[14px] font-semibold text-[#15803d] m-0">Payment successful</p>
          <p className="text-[13px] text-[#166534] mt-1 mb-0">
            {paidName} is waiting for doctor assignment. Admin will assign a doctor soon — you cannot book until then.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 p-1 bg-[#f0f4f6] rounded-xl w-fit">
        {DURATION_TABS.map(d => (
          <button
            key={d.value}
            onClick={() => setDuration(d.value)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              duration === d.value ? 'bg-white text-[#1a6b7a] shadow-sm' : 'text-[#6b8896]'
            }`}
          >
            {d.label}
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
                <PrimaryButton fullWidth onClick={() => setPendingBuy({ pkg, price })}>
                  Pay now (test mode)
                </PrimaryButton>
              </div>
            )
          })}
        </div>
      )}

      {pendingBuy && (
        <ConfirmModal
          open
          variant="info"
          title="Confirm test payment?"
          description={`Pay ₹${pendingBuy.price.toLocaleString('en-IN')} for ${pendingBuy.pkg.name} (${DURATION_TABS.find(d => d.value === duration)?.label}). Razorpay is not live — this marks the package as paid.`}
          confirmLabel={checkout.isPending ? 'Processing…' : 'Pay now (test mode)'}
          loading={checkout.isPending}
          onConfirm={handleConfirmBuy}
          onClose={() => { if (!checkout.isPending) setPendingBuy(null) }}
        />
      )}
    </PageShell>
  )
}
