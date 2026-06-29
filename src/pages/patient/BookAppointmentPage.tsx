import { useState } from 'react'
import { CalendarDays, Clock, FileText, CreditCard, CheckCircle2 } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'

type Step = 'payment' | 'requirements' | 'slot' | 'confirm'

const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: 'payment',      label: 'Payment',      icon: <CreditCard size={15} /> },
  { key: 'requirements', label: 'Requirements', icon: <FileText size={15} /> },
  { key: 'slot',         label: 'Pick Slot',    icon: <Clock size={15} /> },
  { key: 'confirm',      label: 'Confirmed',    icon: <CheckCircle2 size={15} /> },
]

const SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']

function StepBar({ current }: { current: Step }) {
  const idx = STEPS.findIndex(s => s.key === current)
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((s, i) => {
        const done    = i < idx
        const active  = i === idx
        return (
          <div key={s.key} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              active ? 'bg-[#1a6b7a] text-white' : done ? 'text-[#1a6b7a]' : 'text-[#9ab0bb]'
            }`}>
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-6 h-px mx-1 ${i < idx ? 'bg-[#1a6b7a]' : 'bg-[#e6edf0]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function BookAppointmentPage() {
  const [step, setStep]             = useState<Step>('payment')
  const [requirements, setReqs]     = useState('')
  const [selectedSlot, setSlot]     = useState('')
  const [selectedDate, setDate]     = useState('')
  const [paying, setPaying]         = useState(false)

  const handlePay = () => {
    setPaying(true)
    setTimeout(() => { setPaying(false); setStep('requirements') }, 1500)
  }

  const handleSlotNext = () => {
    if (selectedDate && selectedSlot) setStep('confirm')
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <PageShell title="Book Appointment" subtitle="Secure your consultation with the dietician.">
      <StepBar current={step} />

      <div className="bg-white rounded-2xl border border-[#e6edf0] p-6 sm:p-8 max-w-lg">

        {step === 'payment' && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[16px] font-bold text-[#1a3c4d] mb-1">Consultation Fee</p>
              <p className="text-[13px] text-[#6b8896]">Pay to unlock appointment booking</p>
            </div>
            <div className="bg-[#f0f4f6] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[#6b8896]">Initial consultation</p>
                <p className="text-[22px] font-bold text-[#1a3c4d] mt-0.5">₹999</p>
              </div>
              <CreditCard size={32} className="text-[#1a6b7a] opacity-60" />
            </div>
            <div className="text-[12px] text-[#6b8896] space-y-1">
              <p>✓ Secure payment via Razorpay</p>
              <p>✓ Instant confirmation</p>
              <p>✓ Refundable if doctor cancels</p>
            </div>
            <PrimaryButton fullWidth loading={paying} onClick={handlePay}>
              Pay ₹999 via Razorpay
            </PrimaryButton>
          </div>
        )}

        {step === 'requirements' && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[16px] font-bold text-[#1a3c4d] mb-1">Health Requirements</p>
              <p className="text-[13px] text-[#6b8896]">Share your concerns so the doctor can prepare</p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#374955]">Describe your health concern</label>
              <textarea
                rows={5}
                value={requirements}
                onChange={e => setReqs(e.target.value)}
                placeholder="e.g. Weight gain, thyroid issues, diabetes management..."
                className="w-full rounded-xl border border-[#d0dde2] bg-[#f7fafb] px-3 py-2.5 text-[13px] text-[#1a3c4d] outline-none resize-none focus:border-[#1a6b7a] focus:bg-white transition-colors placeholder:text-[#9ab0bb]"
              />
            </div>
            <PrimaryButton fullWidth disabled={!requirements.trim()} onClick={() => setStep('slot')}>
              Continue to Slot Selection
            </PrimaryButton>
          </div>
        )}

        {step === 'slot' && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[16px] font-bold text-[#1a3c4d] mb-1">Pick a Slot</p>
              <p className="text-[13px] text-[#6b8896]">Select your preferred date and time</p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#374955] flex items-center gap-1.5">
                <CalendarDays size={14} /> Date
              </label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={e => setDate(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#d0dde2] bg-[#f7fafb] px-3 text-[13px] text-[#1a3c4d] outline-none focus:border-[#1a6b7a] transition-colors"
              />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#374955] mb-2 flex items-center gap-1.5">
                <Clock size={14} /> Available Slots
              </p>
              <div className="flex flex-wrap gap-2">
                {SLOTS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                      selectedSlot === s
                        ? 'bg-[#1a6b7a] text-white border-[#1a6b7a]'
                        : 'bg-white text-[#374955] border-[#e6edf0] hover:border-[#a8d8e2]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <PrimaryButton fullWidth disabled={!selectedDate || !selectedSlot} onClick={handleSlotNext}>
              Review Booking
            </PrimaryButton>
          </div>
        )}

        {step === 'confirm' && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-14 h-14 rounded-full bg-[#d0ecf2] flex items-center justify-center">
                <CheckCircle2 size={28} className="text-[#1a6b7a]" />
              </div>
              <p className="text-[17px] font-bold text-[#1a3c4d]">Appointment Confirmed!</p>
              <p className="text-[13px] text-[#6b8896] text-center">Your session has been scheduled. You'll receive a confirmation email.</p>
            </div>
            <div className="bg-[#f0f4f6] rounded-xl p-4 flex flex-col gap-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#6b8896]">Date</span>
                <span className="font-semibold text-[#1a3c4d]">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b8896]">Slot</span>
                <span className="font-semibold text-[#1a3c4d]">{selectedSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b8896]">Status</span>
                <span className="font-semibold text-green-600">Confirmed</span>
              </div>
            </div>
          </div>
        )}

        {step !== 'confirm' && step !== 'slot' && step !== 'requirements' && step !== 'payment' && null}
      </div>
    </PageShell>
  )
}
