import { Download, Eye, BookOpen } from 'lucide-react'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'
import MediaImg from '@/components/shared/MediaImg'
import { openMediaUrl } from '@/lib/mediaUrl'
import type { DigitalProductAccessType, PatientPortalDigitalProduct } from '@/types'

const ACCESS_LABEL: Record<Exclude<DigitalProductAccessType, null>, string> = {
  PURCHASED:       'Purchased',
  PACKAGE_FREEBIE: '12-month freebie',
  FREE:            'Free',
}

function AccessBadge({ type }: { type: DigitalProductAccessType }) {
  if (!type) return null
  return (
    <span className="text-[10px] font-bold bg-[#d0ecf2] text-[#1a6b7a] px-2 py-0.5 rounded-full">
      {ACCESS_LABEL[type]}
    </span>
  )
}

interface ProductCardProps {
  product: PatientPortalDigitalProduct
  onBuy?: (product: PatientPortalDigitalProduct) => void
  compact?: boolean
}

export default function DigitalProductCard({ product, onBuy, compact }: ProductCardProps) {
  const showBuy = product.hasAccess !== true && !product.isFree

  return (
    <div className="bg-white rounded-2xl border border-[#e6edf0] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="relative w-full aspect-[16/9] bg-[#f0f4f6] overflow-hidden">
        {product.thumbnailUrl ? (
          <MediaImg src={product.thumbnailUrl} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#9ab0bb] text-[13px]">No cover</div>
        )}
        {product.isFree && !product.hasAccess && (
          <span className="absolute top-2 left-2 text-[10px] font-bold bg-[#16a34a] text-white px-2 py-0.5 rounded-full">FREE</span>
        )}
        {product.hasAccess && (
          <span className="absolute top-2 left-2">
            <AccessBadge type={product.accessType} />
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] font-semibold text-[#1a6b7a] uppercase">{product.category}</p>
        <p className="text-[14px] font-bold text-[#1a3c4d] mt-1 mb-1">{product.title}</p>
        {!compact && product.description && (
          <p className="text-[12px] text-[#6b8896] mb-3 line-clamp-2 flex-1">{product.description}</p>
        )}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2 flex-wrap">
          <p className="text-[16px] font-bold text-[#1a3c4d]">
            {product.isFree || product.accessType === 'PACKAGE_FREEBIE' || product.accessType === 'FREE'
              ? 'Free'
              : `₹${product.price.toLocaleString('en-IN')}`}
          </p>
          <div className="flex items-center gap-2">
            {product.previewUrl && (
              <PrimaryButton size="sm" variant="outline" onClick={() => openMediaUrl(product.previewUrl)}>
                <Eye size={13} /> Preview
              </PrimaryButton>
            )}
            {product.hasAccess && product.fileUrl ? (
              <PrimaryButton size="sm" onClick={() => openMediaUrl(product.fileUrl)}>
                <BookOpen size={13} /> Read full PDF
              </PrimaryButton>
            ) : showBuy && onBuy ? (
              <PrimaryButton size="sm" onClick={() => onBuy(product)}>
                Pay now (test mode)
              </PrimaryButton>
            ) : product.isFree && product.fileUrl ? (
              <PrimaryButton size="sm" onClick={() => openMediaUrl(product.fileUrl)}>
                <Download size={13} /> Get
              </PrimaryButton>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
