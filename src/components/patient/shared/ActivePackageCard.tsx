import { useNavigate } from 'react-router-dom'
import { Gift, Stethoscope, Clock } from 'lucide-react'
import type { PatientPackageSubscription } from '@/types'
import { ROUTES } from '@/config/routes'
import { PACKAGE_DURATION_LABELS } from '@/config/constants'
import { format, parseISO } from 'date-fns'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'

function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—'
  try { return format(parseISO(iso), 'MMM d, yyyy') }
  catch { return iso }
}

const STATUS_COPY: Record<string, { badge: string; className: string }> = {
  PENDING_ASSIGNMENT: { badge: 'Waiting for doctor assignment', className: 'bg-[#fef3c7] text-[#b45309]' },
  ACTIVE:             { badge: 'Active — can book',             className: 'bg-[#dcfce7] text-[#16a34a]' },
  EXPIRED:            { badge: 'Expired',                       className: 'bg-[#f0f4f6] text-[#6b8896]' },
  CANCELLED:          { badge: 'Cancelled',                     className: 'bg-[#fee2e2] text-[#dc2626]' },
}

function remainingMeetings(sub: {
  meetingsRemainingThisMonth?: number
  meetingsUsedThisMonth?: number
  meetingsPerMonth?: number
} | null) {
  if (!sub) return null
  if (typeof sub.meetingsRemainingThisMonth === 'number') return sub.meetingsRemainingThisMonth
  if (typeof sub.meetingsPerMonth === 'number') {
    return Math.max(0, sub.meetingsPerMonth - (sub.meetingsUsedThisMonth ?? 0))
  }
  return null
}

interface ActivePackageCardProps {
  subscription: PatientPackageSubscription | null
  compact?: boolean
}

export default function ActivePackageCard({ subscription, compact }: ActivePackageCardProps) {
  const nav = useNavigate()

  if (!subscription) {
    return (
      <div className="bg-white rounded-2xl border border-[#e6edf0] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#d0ecf2] flex items-center justify-center shrink-0">
          <Gift size={20} color="#1a6b7a" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-[#1a3c4d] m-0">No active package</p>
          <p className="text-[12px] text-[#6b8896] mt-1 mb-0">Buy a care package to book appointments with an assigned doctor.</p>
        </div>
        <PrimaryButton size="sm" onClick={() => nav(ROUTES.PATIENT.PACKAGES)}>
          Browse packages
        </PrimaryButton>
      </div>
    )
  }

  const status = STATUS_COPY[subscription.status] ?? STATUS_COPY.EXPIRED
  const remaining = remainingMeetings(subscription)
  const perMonth = subscription.meetingsPerMonth
  const used = subscription.meetingsUsedThisMonth

  return (
    <div className="bg-white rounded-2xl border border-[#e6edf0] p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
        <div>
          <p className="text-[11px] font-semibold text-[#1a6b7a] uppercase m-0">
            {subscription.package?.category ?? 'Package'}
          </p>
          <p className="text-[16px] font-bold text-[#1a3c4d] mt-0.5 mb-0">
            {subscription.package?.name ?? 'Care package'}
          </p>
          <p className="text-[12px] text-[#6b8896] mt-1 mb-0">
            {PACKAGE_DURATION_LABELS[subscription.duration] ?? subscription.duration}
            {' · '}
            {fmtDate(subscription.startsAt)} – {fmtDate(subscription.endsAt)}
          </p>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
          {status.badge}
        </span>
      </div>

      {subscription.status === 'PENDING_ASSIGNMENT' && (
        <p className="text-[13px] text-[#92400e] bg-[#fffbeb] border border-[#fde68a] rounded-xl px-3 py-2 mb-3">
          Package activated. A doctor will be assigned shortly.
        </p>
      )}

      {subscription.status === 'ACTIVE' && subscription.doctor && (
        <div className="flex items-center gap-2 text-[13px] text-[#1a3c4d] mb-2">
          <Stethoscope size={14} className="text-[#1a6b7a]" />
          <span>Your doctor: <span className="font-semibold">{subscription.doctor.fullName}</span></span>
        </div>
      )}

      {subscription.status === 'ACTIVE' && perMonth != null && (
        <div className="flex items-center gap-2 text-[13px] text-[#374955] mb-3">
          <Clock size={14} className="text-[#1a6b7a]" />
          {remaining != null
            ? <span>{remaining} of {perMonth} meetings left this month</span>
            : used != null
              ? <span>{used} of {perMonth} meetings used this month</span>
              : <span>{perMonth} meetings per month</span>}
        </div>
      )}

      {!compact && subscription.status === 'ACTIVE' && (
        <PrimaryButton size="sm" onClick={() => nav(ROUTES.PATIENT.BOOK_APPOINTMENT)}>
          Book appointment
        </PrimaryButton>
      )}
    </div>
  )
}
