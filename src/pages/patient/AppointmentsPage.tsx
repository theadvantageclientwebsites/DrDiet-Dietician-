import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Clock, Video, MapPin, X, AlertCircle, RefreshCw } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'
import EmptyState from '@/components/patient/shared/EmptyState'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { ROUTES } from '@/config/routes'
import { usePatientPortalAppointments, useCancelPatientAppointment } from '@/hooks/usePatientPortal'
import AppointmentRescheduleNotice, { isDoctorRescheduled } from '@/components/patient/shared/AppointmentRescheduleNotice'
import type { PatientAppointmentStatus, PatientPortalAppointment } from '@/types'
import { format, parseISO } from 'date-fns'
import { canJoinVideoCall } from '@/lib/appointmentCall'

type Filter = 'all' | PatientAppointmentStatus

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all',       label: 'All'       },
  { value: 'PENDING',   label: 'Pending'   },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const STATUS_STYLES: Record<string, string> = {
  PENDING:   'bg-[#fef3c7] text-[#d97706]',
  CONFIRMED: 'bg-[#d0ecf2] text-[#1a6b7a]',
  COMPLETED: 'bg-[#dcfce7] text-[#16a34a]',
  CANCELLED: 'bg-[#fee2e2] text-[#dc2626]',
}

function fmtDateTime(iso: string) {
  try { return format(parseISO(iso), 'MMM d, yyyy · h:mm a') }
  catch { return iso }
}

export default function AppointmentsPage() {
  const nav = useNavigate()
  const [filter, setFilter]       = useState<Filter>('all')
  const [cancelId, setCancelId]   = useState<string | null>(null)
  const [page, setPage]           = useState(1)

  const params = {
    page,
    limit: 20,
    status: filter === 'all' ? '' as const : filter,
  }

  const { appointments, pagination, isLoading, isError, refetch } = usePatientPortalAppointments(params)
  const cancelAppt = useCancelPatientAppointment()

  const canCancel = (a: PatientPortalAppointment) =>
    a.status === 'PENDING' || a.status === 'CONFIRMED'

  return (
    <PageShell
      title="My Appointments"
      subtitle="Track your consultations and manage upcoming sessions."
      action={
        <PrimaryButton onClick={() => nav(ROUTES.PATIENT.BOOK_APPOINTMENT)}>
          + Book New
        </PrimaryButton>
      }
    >
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
              filter === f.value
                ? 'bg-[#1a6b7a] text-white border-[#1a6b7a]'
                : 'bg-white text-[#6b8896] border-[#e6edf0] hover:border-[#a8d8e2]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#fff7ed] text-[#c2410c] text-[13px]">
          <AlertCircle size={16} />
          Failed to load appointments.
          <button onClick={() => refetch()} className="flex items-center gap-1 underline ml-1">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="text-[13px] text-[#6b8896] py-8 text-center">Loading appointments…</p>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={24} />}
          title="No appointments found"
          description="Book a consultation to get started."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map(appt => (
            <div key={appt.id} className="bg-white rounded-2xl border border-[#e6edf0] p-4 sm:p-5">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="w-10 h-10 rounded-xl bg-[#d0ecf2] flex items-center justify-center text-[#1a6b7a] font-bold text-sm shrink-0">
                  {appt.doctor.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-[14px] font-semibold text-[#1a3c4d]">{appt.doctor.fullName}</p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[appt.status] ?? ''}`}>
                      {appt.status.charAt(0) + appt.status.slice(1).toLowerCase()}
                    </span>
                    {isDoctorRescheduled(appt) && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309]">
                        Doctor changed
                      </span>
                    )}
                  </div>
                  {isDoctorRescheduled(appt) && (
                    <AppointmentRescheduleNotice appointment={appt} className="mb-2" />
                  )}
                  {appt.doctor.doctorProfile?.specialization && (
                    <p className="text-[12px] text-[#6b8896] mb-2">{appt.doctor.doctorProfile.specialization}</p>
                  )}
                  <div className="flex items-center gap-3 flex-wrap text-[12px] text-[#6b8896]">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      {isDoctorRescheduled(appt) ? (
                        <span className="font-medium text-[#1a3c4d]">{fmtDateTime(appt.dateTime)}</span>
                      ) : (
                        fmtDateTime(appt.dateTime)
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      {appt.type === 'ONLINE' ? <Video size={12} /> : <MapPin size={12} />}
                      {appt.type === 'ONLINE' ? 'Online' : 'In-Person'}
                    </span>
                  </div>
                  {appt.notes && (
                    <p className="text-[12px] text-[#6b8896] mt-2 italic">{appt.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {canJoinVideoCall({ dateTime: appt.dateTime, status: appt.status, type: appt.type }) && (
                    <PrimaryButton size="sm" onClick={() => nav(`/patient/video-call/${appt.id}`)}>
                      <Video size={13} /> Join
                    </PrimaryButton>
                  )}
                  {canCancel(appt) && (
                    <PrimaryButton size="sm" variant="ghost" onClick={() => setCancelId(appt.id)}>
                      <X size={13} /> Cancel
                    </PrimaryButton>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <PrimaryButton size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </PrimaryButton>
          <span className="text-[12px] text-[#6b8896]">Page {page} of {pagination.totalPages}</span>
          <PrimaryButton size="sm" variant="outline" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>
            Next
          </PrimaryButton>
        </div>
      )}

      {cancelId && (
        <ConfirmModal
          open
          variant="warning"
          title="Cancel appointment?"
          description="This will cancel your booking. You can book a new slot anytime."
          confirmLabel="Cancel appointment"
          loading={cancelAppt.isPending}
          onConfirm={() => {
            cancelAppt.mutate(cancelId, { onSuccess: () => setCancelId(null) })
          }}
          onClose={() => setCancelId(null)}
        />
      )}
    </PageShell>
  )
}
