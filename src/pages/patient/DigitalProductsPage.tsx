import { Download } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'

const CATEGORY_LABELS: Record<string, string> = {
  ebook:       'Clinical Ebook',
  diet_guide:  'Dietary Guide',
  recipe_book: 'Recipe Book',
}

const PRODUCTS = [
  {
    id: '1',
    title:       'Thyroid-Friendly Diet Guide',
    description: 'A complete 60-page guide covering foods that help regulate thyroid function naturally.',
    price:       299,
    category:    'diet_guide',
    purchased:   false,
    image:       'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
  },
  {
    id: '2',
    title:       'Anti-Inflammatory Cookbook',
    description: '50+ recipes designed to reduce inflammation and support immune health.',
    price:       399,
    category:    'recipe_book',
    purchased:   true,
    image:       'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  },
  {
    id: '3',
    title:       'Gut Health Reset E-book',
    description: 'Understand your microbiome and heal your gut with evidence-based dietary strategies.',
    price:       199,
    category:    'ebook',
    purchased:   false,
    image:       'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
  },
  {
    id: '4',
    title:       'Diabetes Meal Planner',
    description: '12-week structured meal plan for managing blood sugar with Indian food options.',
    price:       499,
    category:    'diet_guide',
    purchased:   false,
    image:       'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=600&q=80',
  },
  {
    id: '5',
    title:       'Weight Loss Blueprint',
    description: 'Science-backed fat loss protocols with sustainable, long-term lifestyle changes.',
    price:       349,
    category:    'ebook',
    purchased:   true,
    image:       'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  },
  {
    id: '6',
    title:       'High-Protein Indian Recipes',
    description: '40 delicious high-protein recipes crafted for the Indian palate and lifestyle.',
    price:       249,
    category:    'recipe_book',
    purchased:   false,
    image:       'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
  },
]

function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  const handleBuy = () => {
    console.log('Razorpay', product.id, product.price)
    alert(`Opening Razorpay for ₹${product.price}…`)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e6edf0] overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)]">
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#f0f4f6]">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {product.purchased && (
          <span className="absolute top-3 right-3 bg-[#16a34a] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            Purchased
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[11px] font-semibold text-[#1a6b7a] uppercase tracking-wide mb-1">
            {CATEGORY_LABELS[product.category]}
          </p>
          <p className="text-[15px] font-bold text-[#1a3c4d] leading-snug">{product.title}</p>
          <p className="text-[12px] text-[#6b8896] leading-relaxed mt-1.5">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <p className="text-[20px] font-bold text-[#1a3c4d]">₹{product.price}</p>
          {product.purchased ? (
            <PrimaryButton size="sm" variant="outline" onClick={() => alert('Downloading…')}>
              <Download size={13} /> Download
            </PrimaryButton>
          ) : (
            <PrimaryButton size="sm" onClick={handleBuy}>
              Buy Now
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DigitalProductsPage() {
  return (
    <PageShell
      title="Ebook Store"
      subtitle="Clinical guides, meal planners, and recipe books crafted by our dieticians."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PRODUCTS.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </PageShell>
  )
}
