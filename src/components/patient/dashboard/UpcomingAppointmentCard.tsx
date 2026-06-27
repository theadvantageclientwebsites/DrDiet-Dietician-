/**
 * UpcomingAppointmentCard
 * Shows the next upcoming appointment. Handles loading, empty, and filled states.
 */

import { Video, CalendarDays, Clock } from 'lucide-react'
import type { Appointment } from '@/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day:   'numeric',
      year:  'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatTime(timeStr: string): string {
  try {
    if (/am|pm/i.test(timeStr)) return timeStr
    const [h, m] = timeStr.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
  } catch {
    return timeStr
  }
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function AppointmentSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl border border-[#e6edf0] p-5 flex items-center gap-4 animate-pulse"
      aria-busy="true"
      aria-label="Loading appointment"
    >
      <div className="w-14 h-14 rounded-xl bg-[#e6edf0] shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3.5 w-[55%] rounded-md bg-[#e6edf0]" />
        <div className="h-2.5 w-[40%] rounded-md bg-[#e6edf0]" />
        <div className="h-2.5 w-[30%] rounded-md bg-[#e6edf0]" />
      </div>
      <div className="w-24 h-10 rounded-full bg-[#e6edf0] shrink-0" />
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function NoAppointment({ onBook }: { onBook?: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e6edf0] p-6 flex flex-col items-center gap-3 text-center">
      <div className="w-11 h-11 rounded-xl bg-[#d0ecf2] flex items-center justify-center">
        <CalendarDays size={22} color="#1a6b7a" strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-[14px] font-semibold text-[#1a3c4d] mb-1">
          No upcoming appointments
        </p>
        <p className="text-[12px] text-[#6b8896]">
          Book a consultation to get started
        </p>
      </div>
      {onBook && (
        <button
          onClick={onBook}
          className="mt-1 px-5 py-2 rounded-full text-[13px] font-semibold text-white bg-[#1a6b7a] hover:bg-[#155f6d] hover:-translate-y-0.5 transition-all"
        >
          Book Now
        </button>
      )}
    </div>
  )
}

// ─── Main card ────────────────────────────────────────────────────────────────
interface UpcomingAppointmentCardProps {
  appointment: Appointment | null
  isLoading:   boolean
  hasError:    boolean
  onJoinCall:  (id: string) => void
  onBookNow?:  () => void
}

export default function UpcomingAppointmentCard({
  appointment,
  isLoading,
  hasError,
  onJoinCall,
  onBookNow,
}: UpcomingAppointmentCardProps) {

  if (isLoading) return <AppointmentSkeleton />
  if (hasError || !appointment) return <NoAppointment onBook={onBookNow} />

  const doctorName    = 'Your Doctor'
  const specialty     = 'Consultation'
  const dateFormatted = formatDate(appointment.date)
  const timeFormatted = formatTime(appointment.slot)
  const avatarInitial = doctorName.charAt(0).toUpperCase()

  return (
    <article
      className="bg-white rounded-2xl border border-[#e6edf0] p-5 flex items-center gap-4 flex-wrap"
      aria-label={`Upcoming appointment with ${doctorName}`}
    >
      {/* Doctor avatar */}
      <div className="w-14 h-14 rounded-xl bg-[#d0ecf2] shrink-0 flex items-center justify-center text-[#1a6b7a] font-bold text-xl">
        {avatarInitial}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-[120px]">
        <p className="text-[15px] font-semibold text-[#1a3c4d] leading-snug mb-1">
          {doctorName}
        </p>

        {/* Specialty + time */}
        <div className="flex items-center flex-wrap gap-1.5 mb-2">
          <Video size={13} color="#6b8896" strokeWidth={1.8} />
          <span className="text-[12px] text-[#6b8896]">{specialty}</span>
          {timeFormatted && (
            <>
              <span className="text-[#e6edf0] text-xs">•</span>
              <Clock size={12} color="#6b8896" strokeWidth={1.8} />
              <span className="text-[12px] text-[#6b8896]">{timeFormatted}</span>
            </>
          )}
        </div>

        {/* Date badge */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#d0ecf2] text-[10px] font-semibold text-[#1a6b7a] uppercase tracking-wide">
          <CalendarDays size={11} strokeWidth={2} />
          {dateFormatted}
        </span>
      </div>

      {/* Join Call CTA */}
      <button
        onClick={() => onJoinCall(appointment.id)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a6b7a] text-white text-[13px] font-semibold shrink-0 hover:bg-[#155f6d] hover:-translate-y-px transition-all"
        aria-label={`Join video call with ${doctorName}`}
      >
        <Video size={14} strokeWidth={2} />
        Join Call
      </button>
    </article>
  )
}
