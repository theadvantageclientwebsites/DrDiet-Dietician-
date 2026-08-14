import { Download, AlertCircle, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { API_BASE_URL } from '@/config/constants'
import { usePatientDigitalProducts, usePatientDummyCheckout } from '@/hooks/usePatientPortal'
import type { PatientPortalDigitalProduct } from '@/types'

const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

function resolveUrl(url: string | null) {
  if (!url) return null
  return url.startsWith('http') ? url : `${SERVER_ORIGIN}${url}`
}

export default function DigitalProductsPage() {
  const { products, isLoading, isError, refetch } = usePatientDigitalProducts({ limit: 24 })
  const checkout = usePatientDummyCheckout()
  const [pending, setPending] = useState<PatientPortalDigitalProduct | null>(null)

  const handleBuy = (product: PatientPortalDigitalProduct) => {
    if (product.isFree) {
      alert('This product is free — download access coming soon.')
      return
    }
    setPending(product)
  }

  return (
    <PageShell title="Ebook Store" subtitle="Clinical guides, meal planners, and recipe books crafted by our dieticians.">
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
          {products.map(product => {
            const thumb = resolveUrl(product.thumbnailUrl)
            return (
              <div key={product.id} className="bg-white rounded-2xl border border-[#e6edf0] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="relative w-full aspect-[16/9] bg-[#f0f4f6] overflow-hidden">
                  {thumb ? (
                    <img src={thumb} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#9ab0bb] text-[13px]">No preview</div>
                  )}
                  {product.isFree && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold bg-[#16a34a] text-white px-2 py-0.5 rounded-full">FREE</span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-[10px] font-semibold text-[#1a6b7a] uppercase">{product.category}</p>
                  <p className="text-[14px] font-bold text-[#1a3c4d] mt-1 mb-1">{product.title}</p>
                  {product.description && (
                    <p className="text-[12px] text-[#6b8896] mb-3 line-clamp-2 flex-1">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <p className="text-[16px] font-bold text-[#1a3c4d]">
                      {product.isFree ? 'Free' : `₹${product.price.toLocaleString('en-IN')}`}
                    </p>
                    <PrimaryButton size="sm" onClick={() => handleBuy(product)}>
                      {product.isFree ? <><Download size={13} /> Get</> : 'Pay now (test mode)'}
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {pending && (
        <ConfirmModal
          open
          variant="info"
          title="Confirm test payment?"
          description={`Pay ₹${pending.price.toLocaleString('en-IN')} for ${pending.title}. Razorpay is not live — this marks the order as paid.`}
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
