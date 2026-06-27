import { useState } from 'react'
import { Clock } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'

const SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

const SERVICES = [
  {
    id:          'yoga',
    category:    'Wellness Session',
    name:        'Yoga Session',
    description: 'Mindful movement to reduce stress and improve flexibility with a certified trainer.',
    price:       599,
    duration:    '60 min',
    image:       'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
  },
  {
    id:          'zumba',
    category:    'Fitness Class',
    name:        'Zumba Class',
    description: 'High-energy dance fitness session to burn calories and boost your mood.',
    price:       499,
    duration:    '45 min',
    image:       'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
  },
  {
    id:          'blood_test',
    category:    'Diagnostics',
    name:        'Blood Test',
    description: 'Comprehensive blood panel reviewed and annotated by your dietician.',
    price:       799,
    duration:    '30 min',
    image:       'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80',
  },
]

interface Booking { serviceId: string; slot: string }

function SlotPicker({ selected, onSelect }: { selected: string; onSelect: (s: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SLOTS.map(s => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
            selected === s
              ? 'bg-[#1a6b7a] text-white border-[#1a6b7a]'
              : 'bg-white text-[#374955] border-[#e6edf0] hover:border-[#a8d8e2]'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  )
}

function ServiceCard({ svc, booking, onBook, onSlotSelect, onConfirm, onCancel, confirming }: {
  svc:          typeof SERVICES[0]
  booking:      Booking | null
  onBook:       () => void
  onSlotSelect: (slot: string) => void
  onConfirm:    () => void
  onCancel:     () => void
  confirming:   boolean
}) {
  const isSelected = booking?.serviceId === svc.id

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)] ${isSelected ? 'border-[#a8d8e2]' : 'border-[#e6edf0]'}`}>
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#f0f4f6]">
        <img
          src={svc.image}
          alt={svc.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#1a6b7a] text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <Clock size={11} /> {svc.duration}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[11px] font-semibold text-[#1a6b7a] uppercase tracking-wide mb-1">{svc.category}</p>
          <p className="text-[15px] font-bold text-[#1a3c4d] leading-snug">{svc.name}</p>
          <p className="text-[12px] text-[#6b8896] leading-relaxed mt-1.5">{svc.description}</p>
        </div>

        {isSelected && (
          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-semibold text-[#1a3c4d]">Pick a slot</p>
            <SlotPicker selected={booking!.slot} onSelect={onSlotSelect} />
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-1">
          <p className="text-[20px] font-bold text-[#1a3c4d]">₹{svc.price}</p>
          {isSelected ? (
            <div className="flex items-center gap-2">
              <PrimaryButton size="sm" variant="ghost" onClick={onCancel}>Cancel</PrimaryButton>
              <PrimaryButton size="sm" loading={confirming} disabled={!booking!.slot} onClick={onConfirm}>
                Confirm
              </PrimaryButton>
            </div>
          ) : (
            <PrimaryButton size="sm" onClick={onBook}>Book Now</PrimaryButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  const [booking, setBooking]       = useState<Booking | null>(null)
  const [confirming, setConfirming] = useState(false)

  const handleConfirm = () => {
    setConfirming(true)
    setTimeout(() => {
      setConfirming(false)
      setBooking(null)
      alert('Session booked successfully!')
    }, 1200)
  }

  return (
    <PageShell
      title="Clinical Services"
      subtitle="Book yoga, zumba, or blood test sessions at your preferred time."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map(svc => (
          <ServiceCard
            key={svc.id}
            svc={svc}
            booking={booking?.serviceId === svc.id ? booking : null}
            onBook={() => setBooking({ serviceId: svc.id, slot: '' })}
            onSlotSelect={slot => setBooking({ serviceId: svc.id, slot })}
            onConfirm={handleConfirm}
            onCancel={() => setBooking(null)}
            confirming={confirming}
          />
        ))}
      </div>
    </PageShell>
  )
}
