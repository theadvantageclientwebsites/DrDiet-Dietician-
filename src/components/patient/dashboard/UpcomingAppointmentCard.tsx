/**
 * UpcomingAppointmentCard — shows next appointment from patient dashboard API
 */

import { Video, CalendarDays, Clock, MapPin } from 'lucide-react'
import type { PatientPortalAppointment } from '@/types'
import AppointmentRescheduleNotice, { isDoctorRescheduled } from '@/components/patient/shared/AppointmentRescheduleNotice'
import { format, parseISO } from 'date-fns'
import { canJoinVideoCall } from '@/lib/appointmentCall'
import { JOIN_CALL_MINUTES_BEFORE } from '@/config/constants'

function formatApptDateTime(iso: string): { date: string; time: string } {
  try {
    const d = parseISO(iso)
    return {
      date: format(d, 'MMM d, yyyy'),
      time: format(d, 'h:mm a'),
    }
  } catch {
    return { date: iso, time: '' }
  }
}

function AppointmentSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#e6edf0] p-5 flex items-center gap-4 animate-pulse" aria-busy="true">
      <div className="w-14 h-14 rounded-xl bg-[#e6edf0] shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3.5 w-[55%] rounded-md bg-[#e6edf0]" />
        <div className="h-2.5 w-[40%] rounded-md bg-[#e6edf0]" />
      </div>
    </div>
  )
}

function NoAppointment({ onBook }: { onBook?: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e6edf0] p-6 flex flex-col items-center gap-3 text-center">
      <div className="w-11 h-11 rounded-xl bg-[#d0ecf2] flex items-center justify-center">
        <CalendarDays size={22} color="#1a6b7a" strokeWidth={1.8} />
      </div>
      <p className="text-[14px] font-semibold text-[#1a3c4d]">No upcoming appointments</p>
      <p className="text-[12px] text-[#6b8896]">Book a consultation to get started</p>
      {onBook && (
        <button onClick={onBook} className="mt-1 px-5 py-2 rounded-full text-[13px] font-semibold text-white bg-[#1a6b7a] hover:bg-[#155f6d]">
          Book Now
        </button>
      )}
    </div>
  )
}

const STATUS_STYLE: Record<string, string> = {
  PENDING:   'bg-[#fef3c7] text-[#d97706]',
  CONFIRMED: 'bg-[#d0ecf2] text-[#1a6b7a]',
  COMPLETED: 'bg-[#dcfce7] text-[#16a34a]',
  CANCELLED: 'bg-[#fee2e2] text-[#dc2626]',
}

interface UpcomingAppointmentCardProps {
  appointment: PatientPortalAppointment | null
  isLoading:   boolean
  hasError:    boolean
  onJoinCall:  (id: string) => void
  onBookNow?:  () => void
}

export default function UpcomingAppointmentCard({
  appointment, isLoading, hasError, onJoinCall, onBookNow,
}: UpcomingAppointmentCardProps) {
  if (isLoading) return <AppointmentSkeleton />
  if (hasError || !appointment) return <NoAppointment onBook={onBookNow} />

  const doctor    = appointment.doctor
  const specialty = doctor.doctorProfile?.specialization ?? 'Consultation'
  const { date, time } = formatApptDateTime(appointment.dateTime)
  const canJoin = canJoinVideoCall({
    dateTime: appointment.dateTime,
    status: appointment.status,
    type: appointment.type,
  })
  const showJoinHint =
    appointment.status === 'CONFIRMED' && appointment.type === 'ONLINE' && !canJoin

  return (
    <article className="bg-white rounded-2xl border border-[#e6edf0] p-5 flex items-center gap-4 flex-wrap">
      <div className="w-14 h-14 rounded-xl bg-[#d0ecf2] shrink-0 flex items-center justify-center text-[#1a6b7a] font-bold text-xl overflow-hidden">
        {doctor.profilePhotoUrl
          ? <img src={doctor.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
          : doctor.fullName.charAt(0)}
      </div>

      <div className="flex-1 min-w-[120px]">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="text-[15px] font-semibold text-[#1a3c4d]">{doctor.fullName}</p>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[appointment.status] ?? ''}`}>
            {appointment.status.charAt(0) + appointment.status.slice(1).toLowerCase()}
          </span>
          {isDoctorRescheduled(appointment) && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309]">
              Doctor changed
            </span>
          )}
        </div>
        {isDoctorRescheduled(appointment) && (
          <AppointmentRescheduleNotice appointment={appointment} variant="compact" className="mb-2" />
        )}
        <div className="flex items-center flex-wrap gap-1.5 mb-2 text-[12px] text-[#6b8896]">
          {appointment.type === 'ONLINE' ? <Video size={13} /> : <MapPin size={13} />}
          <span>{specialty}</span>
          {time && (<><span className="text-[#e6edf0]">•</span><Clock size={12} /><span>{time}</span></>)}
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#d0ecf2] text-[10px] font-semibold text-[#1a6b7a] uppercase">
          <CalendarDays size={11} /> {date}
        </span>
      </div>

      {canJoin && (
        <button
          onClick={() => onJoinCall(appointment.id)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a6b7a] text-white text-[13px] font-semibold shrink-0 hover:bg-[#155f6d]"
        >
          <Video size={14} /> Join Call
        </button>
      )}
      {showJoinHint && (
        <p className="text-[11px] text-[#6b8896] shrink-0 max-w-[140px] text-right">
          Join opens {JOIN_CALL_MINUTES_BEFORE} min before the appointment
        </p>
      )}
    </article>
  )
}
