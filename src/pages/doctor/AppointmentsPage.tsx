/**
 * AppointmentsPage — Doctor appointments list with filters, pagination, status updates.
 * Data: GET /doctor/appointments, PATCH /doctor/appointments/:id/status, PATCH /doctor/appointments/:id
 */
import { useState, useCallback, useEffect, useRef } from 'react'
import {
  CalendarDays, Search, AlertTriangle, RefreshCw,
  ChevronLeft, ChevronRight, Video, MapPin, X, CalendarClock,
} from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import {
  useDoctorAppointments,
  useDoctorAppointmentDetail,
  DEFAULT_DOCTOR_APPOINTMENTS_LIMIT,
} from '@/hooks/useDoctorAppointments'
import { useUpdateDoctorAppointmentStatus, useUpdateDoctorAppointment } from '@/hooks/useDoctorAppointmentMutations'
import type { DoctorAppointment, DoctorAppointmentStatus, DoctorAppointmentType } from '@/types'
import { format, parseISO } from 'date-fns'

const STATUS_TABS = [
  { value: '',          label: 'All'       },
  { value: 'PENDING',   label: 'Pending'   },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const

const TYPE_OPTS = [
  { value: '',          label: 'All Types' },
  { value: 'ONLINE',    label: 'Online'    },
  { value: 'IN_PERSON', label: 'In-Person' },
] as const

const NEXT_STATUSES: Record<DoctorAppointmentStatus, DoctorAppointmentStatus[]> = {
  PENDING:   ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

function fmtDateTime(iso: string) {
  try { return format(parseISO(iso), 'MMM d, yyyy · h:mm a') }
  catch { return iso }
}

function isoToDateInput(iso: string) {
  try { return format(parseISO(iso), 'yyyy-MM-dd') }
  catch { return '' }
}

function isoToTimeInput(iso: string) {
  try { return format(parseISO(iso), 'HH:mm') }
  catch { return '' }
}

function buildDateTimeIso(date: string, time: string): string {
  return new Date(`${date}T${time}`).toISOString()
}

function canReschedule(status: DoctorAppointmentStatus) {
  return status === 'PENDING' || status === 'CONFIRMED'
}

function getInitials(name: string | null | undefined) {
  if (!name?.trim()) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function ErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px', borderRadius: 12, marginBottom: 16,
      background: '#fff7ed', border: '1px solid #fed7aa', flexWrap: 'wrap',
    }}>
      <AlertTriangle size={16} color="#ea580c" />
      <span style={{ flex: 1, fontSize: FONT_SIZE.sm, color: '#c2410c' }}>
        Could not load appointments. Please try again.
      </span>
      <button onClick={onRetry} style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 12px', borderRadius: 7, background: '#ea580c', color: '#fff',
        border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: FONT_WEIGHT.semibold,
      }}>
        <RefreshCw size={12} /> Retry
      </button>
    </div>
  )
}

function DetailModal({ id, startRescheduling = false, onClose }: {
  id: string
  startRescheduling?: boolean
  onClose: () => void
}) {
  const { appointment, isLoading } = useDoctorAppointmentDetail(id)
  const updateStatus = useUpdateDoctorAppointmentStatus(onClose)
  const updateAppointment = useUpdateDoctorAppointment(() => setRescheduling(false))
  const [pendingStatus, setPendingStatus] = useState<DoctorAppointmentStatus | null>(null)
  const [rescheduling, setRescheduling] = useState(startRescheduling)
  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editType, setEditType] = useState<DoctorAppointmentType>('ONLINE')
  const [editNotes, setEditNotes] = useState('')

  const next = appointment ? NEXT_STATUSES[appointment.status] : []
  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    if (startRescheduling && appointment) openRescheduleForm(appointment)
  }, [startRescheduling, appointment?.id])

  const openRescheduleForm = (appt: DoctorAppointment) => {
    setEditDate(isoToDateInput(appt.dateTime))
    setEditTime(isoToTimeInput(appt.dateTime))
    setEditType(appt.type)
    setEditNotes(appt.notes ?? '')
    setRescheduling(true)
  }

  const openReschedule = () => {
    if (!appointment) return
    openRescheduleForm(appointment)
  }

  const handleReschedule = () => {
    if (!appointment || !editDate || !editTime) return
    updateAppointment.mutate({
      id,
      payload: {
        dateTime: buildDateTimeIso(editDate, editTime),
        type:     editType,
        notes:    editNotes.trim() || undefined,
      },
    })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(15, 61, 74, 0.45)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520,
        maxHeight: '90vh', overflow: 'auto', boxShadow: SHADOW.card,
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: `1px solid ${COLORS.divider}`,
        }}>
          <h2 style={{ margin: 0, fontSize: FONT_SIZE.lg, color: COLORS.navy }}>Appointment Details</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {isLoading || !appointment ? (
            <p style={{ color: COLORS.muted, fontSize: FONT_SIZE.sm }}>Loading…</p>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: COLORS.brandLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: COLORS.brand, fontWeight: FONT_WEIGHT.bold,
                }}>
                  {getInitials(appointment.patient?.fullName)}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>
                    {appointment.patient?.fullName ?? '—'}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: FONT_SIZE.xs, color: COLORS.muted }}>
                    {appointment.patient?.email ?? appointment.patient?.patientProfile?.phoneNumber ?? '—'}
                  </p>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <StatusBadge status={appointment.status} />
                </div>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
                padding: 14, borderRadius: 12, background: COLORS.inputBg, marginBottom: 16,
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: 10, color: COLORS.muted, textTransform: 'uppercase' }}>Date & Time</p>
                  <p style={{ margin: '4px 0 0', fontSize: FONT_SIZE.sm, color: COLORS.navy }}>{fmtDateTime(appointment.dateTime)}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 10, color: COLORS.muted, textTransform: 'uppercase' }}>Type</p>
                  <p style={{ margin: '4px 0 0', fontSize: FONT_SIZE.sm, color: COLORS.navy, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {appointment.type === 'ONLINE' ? <Video size={14} /> : <MapPin size={14} />}
                    {appointment.type === 'ONLINE' ? 'Online' : 'In-Person'}
                  </p>
                </div>
              </div>

              {appointment.notes && !rescheduling && (
                <div style={{
                  padding: '10px 12px', borderRadius: 8, background: COLORS.brandLight,
                  borderLeft: `3px solid ${COLORS.brand}`, marginBottom: 16,
                }}>
                  <p style={{ margin: 0, fontSize: FONT_SIZE.sm, color: COLORS.body }}>{appointment.notes}</p>
                </div>
              )}

              {rescheduling && (
                <div style={{
                  padding: 14, borderRadius: 12, background: COLORS.inputBg,
                  border: `1px solid ${COLORS.divider}`, marginBottom: 16,
                }}>
                  <p style={{ margin: '0 0 12px', fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>
                    Reschedule appointment
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: COLORS.muted, marginBottom: 4, textTransform: 'uppercase' }}>
                        New date
                      </label>
                      <input
                        type="date"
                        min={today}
                        value={editDate}
                        onChange={e => setEditDate(e.target.value)}
                        style={{
                          width: '100%', padding: '8px 10px', borderRadius: 8,
                          border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm,
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: COLORS.muted, marginBottom: 4, textTransform: 'uppercase' }}>
                        New time
                      </label>
                      <input
                        type="time"
                        value={editTime}
                        onChange={e => setEditTime(e.target.value)}
                        style={{
                          width: '100%', padding: '8px 10px', borderRadius: 8,
                          border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm,
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ display: 'block', fontSize: 10, color: COLORS.muted, marginBottom: 4, textTransform: 'uppercase' }}>
                      Type
                    </label>
                    <select
                      value={editType}
                      onChange={e => setEditType(e.target.value as DoctorAppointmentType)}
                      style={{
                        width: '100%', padding: '8px 10px', borderRadius: 8,
                        border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm,
                      }}
                    >
                      <option value="ONLINE">Online</option>
                      <option value="IN_PERSON">In-Person</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 10, color: COLORS.muted, marginBottom: 4, textTransform: 'uppercase' }}>
                      Notes
                    </label>
                    <textarea
                      value={editNotes}
                      onChange={e => setEditNotes(e.target.value)}
                      rows={3}
                      placeholder="Optional notes for the patient"
                      style={{
                        width: '100%', padding: '8px 10px', borderRadius: 8,
                        border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm,
                        resize: 'vertical', fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      disabled={updateAppointment.isPending || !editDate || !editTime}
                      onClick={handleReschedule}
                      style={{
                        padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: COLORS.brand, color: '#fff',
                        fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
                        opacity: updateAppointment.isPending || !editDate || !editTime ? 0.6 : 1,
                      }}
                    >
                      {updateAppointment.isPending ? 'Saving…' : 'Save changes'}
                    </button>
                    <button
                      disabled={updateAppointment.isPending}
                      onClick={() => setRescheduling(false)}
                      style={{
                        padding: '8px 14px', borderRadius: 8,
                        border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: 'pointer',
                        fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!rescheduling && canReschedule(appointment.status) && (
                <button
                  onClick={openReschedule}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 8, marginBottom: 12,
                    border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: 'pointer',
                    fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.brand,
                  }}
                >
                  <CalendarClock size={15} /> Reschedule
                </button>
              )}

              {!rescheduling && next.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {next.map(s => (
                    <button
                      key={s}
                      disabled={updateStatus.isPending}
                      onClick={() => setPendingStatus(s)}
                      style={{
                        padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: s === 'CANCELLED' ? '#fee2e2' : COLORS.brand,
                        color: s === 'CANCELLED' ? '#dc2626' : '#fff',
                        fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
                        opacity: updateStatus.isPending ? 0.6 : 1,
                      }}
                    >
                      Mark {s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {pendingStatus && (
        <ConfirmModal
          open
          title={`Mark as ${pendingStatus.toLowerCase()}?`}
          description="This will update the appointment status for the patient."
          confirmLabel="Update"
          onConfirm={() => {
            updateStatus.mutate({ id, payload: { status: pendingStatus as 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' } })
            setPendingStatus(null)
          }}
          onClose={() => setPendingStatus(null)}
        />
      )}
    </div>
  )
}

export default function AppointmentsPage() {
  const [status, setStatus]       = useState('')
  const [type, setType]           = useState('')
  const [upcoming, setUpcoming]   = useState(false)
  const [today, setToday]         = useState(false)
  const [search, setSearch]       = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage]           = useState(1)
  const [limit, setLimit]         = useState(DEFAULT_DOCTOR_APPOINTMENTS_LIMIT)
  const [detailTarget, setDetailTarget] = useState<{ id: string; reschedule?: boolean } | null>(null)
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current)
    searchRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => { if (searchRef.current) clearTimeout(searchRef.current) }
  }, [search])

  const params = {
    status:   status as DoctorAppointmentStatus | '',
    type:     type as '' | 'ONLINE' | 'IN_PERSON',
    upcoming: upcoming || undefined,
    today:    today || undefined,
    search:   debouncedSearch || undefined,
    page,
    limit,
  }

  const { appointments, pagination, isLoading, isFetching, isError, refetch } = useDoctorAppointments(params)
  const updateStatus = useUpdateDoctorAppointmentStatus()

  const resetFilters = useCallback(() => {
    setStatus('')
    setType('')
    setUpcoming(false)
    setToday(false)
    setSearch('')
    setPage(1)
  }, [])

  return (
    <div style={{ padding: 16, width: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy, margin: 0 }}>
          Appointments
        </h1>
        <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, marginTop: 4 }}>
          Manage and update your patient appointments.
        </p>
      </div>

      {isError && <ErrorBanner onRetry={refetch} />}

      {/* Filters */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: 16,
        border: `1px solid ${COLORS.divider}`, boxShadow: SHADOW.card, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {STATUS_TABS.map(t => (
            <button
              key={t.value}
              onClick={() => { setStatus(t.value); setPage(1) }}
              style={{
                padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: status === t.value ? COLORS.brand : COLORS.brandLight,
                color: status === t.value ? '#fff' : COLORS.brand,
                fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
            <Search size={15} color={COLORS.muted} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by patient name…"
              style={{
                width: '100%', padding: '8px 10px 8px 32px', borderRadius: 8,
                border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm,
              }}
            />
          </div>

          <select
            value={type}
            onChange={e => { setType(e.target.value); setPage(1) }}
            style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm }}
          >
            {TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: FONT_SIZE.sm, color: COLORS.body, cursor: 'pointer' }}>
            <input type="checkbox" checked={today} onChange={e => { setToday(e.target.checked); setPage(1) }} />
            Today only
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: FONT_SIZE.sm, color: COLORS.body, cursor: 'pointer' }}>
            <input type="checkbox" checked={upcoming} onChange={e => { setUpcoming(e.target.checked); setPage(1) }} />
            Upcoming
          </label>

          {(status || type || upcoming || today || search) && (
            <button onClick={resetFilters} style={{
              background: 'none', border: 'none', color: COLORS.brand, cursor: 'pointer',
              fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
            }}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div style={{
        background: '#fff', borderRadius: 16, border: `1px solid ${COLORS.divider}`,
        boxShadow: SHADOW.card, overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center', color: COLORS.muted }}>Loading appointments…</div>
        ) : appointments.length === 0 ? (
          <div style={{
            padding: 48, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          }}>
            <CalendarDays size={40} color={COLORS.brand} style={{ marginBottom: 12 }} />
            <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>No appointments found</p>
            <p style={{ margin: '6px 0 0', fontSize: FONT_SIZE.sm, color: COLORS.muted }}>
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div>
            {appointments.map((appt: DoctorAppointment) => {
              const next = NEXT_STATUSES[appt.status]
              return (
                <div
                  key={appt.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                    padding: '14px 16px', borderBottom: `1px solid ${COLORS.divider}`,
                    opacity: isFetching ? 0.7 : 1,
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', background: COLORS.brandLight,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: COLORS.brand, fontSize: 13, fontWeight: FONT_WEIGHT.bold, flexShrink: 0,
                  }}>
                    {getInitials(appt.patient?.fullName)}
                  </div>

                  <div style={{ flex: 1, minWidth: 160 }}>
                    <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>
                      {appt.patient?.fullName ?? 'Unknown patient'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: FONT_SIZE.xs, color: COLORS.muted }}>
                      {fmtDateTime(appt.dateTime)}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {appt.type === 'ONLINE' ? <Video size={14} color={COLORS.brand} /> : <MapPin size={14} color={COLORS.brand} />}
                    <span style={{ fontSize: FONT_SIZE.xs, color: COLORS.body }}>
                      {appt.type === 'ONLINE' ? 'Online' : 'In-Person'}
                    </span>
                  </div>

                  <StatusBadge status={appt.status} />

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {next.slice(0, 1).map(s => (
                      <button
                        key={s}
                        disabled={updateStatus.isPending}
                        onClick={() => updateStatus.mutate({
                          id: appt.id,
                          payload: { status: s as 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' },
                        })}
                        style={{
                          padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                          background: COLORS.brandLight, color: COLORS.brand,
                          fontSize: 11, fontWeight: FONT_WEIGHT.semibold,
                        }}
                      >
                        {s === 'CONFIRMED' ? 'Confirm' : s === 'COMPLETED' ? 'Complete' : 'Cancel'}
                      </button>
                    ))}
                    <button
                      onClick={() => setDetailTarget({ id: appt.id })}
                      style={{
                        padding: '5px 10px', borderRadius: 7,
                        border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: 'pointer',
                        fontSize: 11, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy,
                      }}
                    >
                      Details
                    </button>
                    {canReschedule(appt.status) && (
                      <button
                        onClick={() => setDetailTarget({ id: appt.id, reschedule: true })}
                        style={{
                          padding: '5px 10px', borderRadius: 7,
                          border: `1px solid ${COLORS.brand}`, background: COLORS.brandLight, cursor: 'pointer',
                          fontSize: 11, fontWeight: FONT_WEIGHT.semibold, color: COLORS.brand,
                        }}
                      >
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderTop: `1px solid ${COLORS.divider}`, flexWrap: 'wrap', gap: 8,
          }}>
            <span style={{ fontSize: FONT_SIZE.xs, color: COLORS.muted }}>
              Page {pagination.page} of {pagination.totalPages} · {pagination.totalItems} total
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <select
                value={limit}
                onChange={e => { setLimit(Number(e.target.value)); setPage(1) }}
                style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${COLORS.divider}`, fontSize: 12 }}
              >
                {[10, 20, 50].map(n => <option key={n} value={n}>{n} / page</option>)}
              </select>
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                style={{ padding: 6, borderRadius: 6, border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                style={{ padding: 6, borderRadius: 6, border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {detailTarget && (
        <DetailModal
          id={detailTarget.id}
          startRescheduling={detailTarget.reschedule}
          onClose={() => setDetailTarget(null)}
        />
      )}
    </div>
  )
}
