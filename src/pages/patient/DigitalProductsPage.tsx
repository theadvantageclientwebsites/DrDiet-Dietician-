import { AlertCircle, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '@/components/patient/shared/PageShell'
import ConfirmModal from '@/components/ui/ConfirmModal'
import DigitalProductCard from '@/components/patient/library/DigitalProductCard'
import { ROUTES } from '@/config/routes'
import { usePatientDigitalProducts, usePatientDummyCheckout } from '@/hooks/usePatientPortal'
import type { PatientPortalDigitalProduct } from '@/types'

export default function DigitalProductsPage() {
  const { products, isLoading, isError, refetch } = usePatientDigitalProducts({ limit: 24 })
  const checkout = usePatientDummyCheckout()
  const [pending, setPending] = useState<PatientPortalDigitalProduct | null>(null)

  return (
    <PageShell
      title="Ebook Store"
      subtitle="Preview any guide for free (first 2 pages). Full PDFs unlock after purchase or a 12-month package."
      action={
        <Link to={ROUTES.PATIENT.LIBRARY} className="text-[13px] font-semibold text-[#1a6b7a] hover:underline">
          My library
        </Link>
      }
    >
      {isError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#fff7ed] text-[#c2410c] text-[13px] mb-4">
          <AlertCircle size={16} /> Failed to load products.
          <button onClick={() => refetch()} className="underline flex items-center gap-1"><RefreshCw size={12} /> Retry</button>
        </div>
      )}

      {isLoading ? (
        <p className="text-[13px] text-[#6b8896] py-8 text-center">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="text-[13px] text-[#6b8896] py-8 text-center">No digital products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <DigitalProductCard key={product.id} product={product} onBuy={setPending} />
          ))}
        </div>
      )}

      {pending && (
        <ConfirmModal
          open
          variant="info"
          title="Confirm test payment?"
          description={`Pay ₹${pending.price.toLocaleString('en-IN')} for ${pending.title}. Razorpay is not live — this marks the order as paid and adds the PDF to your library.`}
          confirmLabel={checkout.isPending ? 'Processing…' : 'Pay now (test mode)'}
          loading={checkout.isPending}
          onConfirm={() => {
            checkout.mutate(
              { itemType: 'DIGITAL_PRODUCT', itemId: pending.id },
              { onSuccess: () => setPending(null) },
            )
          }}
          onClose={() => { if (!checkout.isPending) setPending(null) }}
        />
      )}
    </PageShell>
  )
}
