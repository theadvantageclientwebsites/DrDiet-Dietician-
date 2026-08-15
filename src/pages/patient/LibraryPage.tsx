import { AlertCircle, RefreshCw, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageShell from '@/components/patient/shared/PageShell'
import DigitalProductCard from '@/components/patient/library/DigitalProductCard'
import { ROUTES } from '@/config/routes'
import { usePatientLibrary } from '@/hooks/usePatientPortal'

export default function LibraryPage() {
  const { items, pagination, isLoading, isError, refetch } = usePatientLibrary({ page: 1, limit: 20 })

  return (
    <PageShell
      title="My library"
      subtitle="Purchased guides and 12-month package freebies. Full PDFs are available here."
      action={
        <Link to={ROUTES.PATIENT.DIGITAL_PRODUCTS} className="text-[13px] font-semibold text-[#1a6b7a] hover:underline">
          Browse store
        </Link>
      }
    >
      {isError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#fff7ed] text-[#c2410c] text-[13px] mb-4">
          <AlertCircle size={16} /> Failed to load library.
          <button onClick={() => refetch()} className="underline flex items-center gap-1"><RefreshCw size={12} /> Retry</button>
        </div>
      )}

      {isLoading ? (
        <p className="text-[13px] text-[#6b8896] py-8 text-center">Loading library…</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e6edf0] p-8 text-center">
          <BookOpen size={28} className="mx-auto mb-3 text-[#1a6b7a]" />
          <p className="text-[14px] font-semibold text-[#1a3c4d] m-0">No items yet</p>
          <p className="text-[13px] text-[#6b8896] mt-1 mb-4">Buy a guide or take a 12-month package to fill your library.</p>
          <Link to={ROUTES.PATIENT.DIGITAL_PRODUCTS} className="text-[13px] font-semibold text-[#1a6b7a] hover:underline">
            Go to ebook store
          </Link>
        </div>
      ) : (
        <>
          <p className="text-[12px] text-[#6b8896] m-0">{pagination.totalItems} item{pagination.totalItems === 1 ? '' : 's'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(product => (
              <DigitalProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </PageShell>
  )
}
