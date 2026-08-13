/**
 * Shows when a doctor rescheduled the patient's appointment.
 * Uses fields from GET /patient/appointments and /patient/dashboard.
 */

import { CalendarClock } from 'lucide-react'
import type { PatientPortalAppointment } from '@/types'
import { format, parseISO } from 'date-fns'

function fmtDateTime(iso: string) {
  try { return format(parseISO(iso), 'MMM d, yyyy · h:mm a') }
  catch { return iso }
}

export function isDoctorRescheduled(appt: Pick<PatientPortalAppointment, 'rescheduledByDoctor' | 'rescheduleInfo'>) {
  return appt.rescheduledByDoctor === true || appt.rescheduleInfo?.rescheduledByDoctor === true
}

export function getRescheduleMessage(appt: PatientPortalAppointment) {
  return appt.rescheduleInfo?.message ?? 'Rescheduled by your doctor'
}

function getPreviousDateTime(appt: PatientPortalAppointment) {
  return appt.previousDateTime ?? appt.rescheduleInfo?.previousDateTime ?? null
}

interface AppointmentRescheduleNoticeProps {
  appointment: PatientPortalAppointment
  /** compact = inline badge + strikethrough; full = banner with details */
  variant?: 'compact' | 'full'
  className?: string
}

export default function AppointmentRescheduleNotice({
  appointment,
  variant = 'full',
  className = '',
}: AppointmentRescheduleNoticeProps) {
  if (!isDoctorRescheduled(appointment)) return null

  const message = getRescheduleMessage(appointment)
  const previous = getPreviousDateTime(appointment)

  if (variant === 'compact') {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] text-[10px] font-semibold">
          <CalendarClock size={11} />
          {message}
        </span>
        {previous && (
          <span className="text-[11px] text-[#94a3b8] line-through">
            Was: {fmtDateTime(previous)}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`rounded-xl border border-[#fde68a] bg-[#fffbeb] px-3 py-2.5 ${className}`}>
      <div className="flex items-start gap-2">
        <CalendarClock size={15} className="text-[#d97706] shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-[#b45309] m-0">{message}</p>
          {previous && (
            <p className="text-[11px] text-[#92400e] mt-1 mb-0">
              Previous time:{' '}
              <span className="line-through text-[#94a3b8]">{fmtDateTime(previous)}</span>
            </p>
          )}
          <p className="text-[11px] text-[#78716c] mt-1 mb-0">
            New time: <span className="font-semibold text-[#1a3c4d]">{fmtDateTime(appointment.dateTime)}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
