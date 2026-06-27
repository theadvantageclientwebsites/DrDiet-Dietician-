import { useState } from 'react'
import { CalendarDays, Clock, Video, RotateCcw, X } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'
import EmptyState from '@/components/patient/shared/EmptyState'

type Status = 'all' | 'confirmed' | 'completed' | 'cancelled'

const DUMMY_APPOINTMENTS = [
  { id: '1', date: '2025-07-10', slot: '10:00 AM', status: 'confirmed',  doctor: 'Dr. James Wilson',  type: 'General Consultation',  videoRoomUrl: 'room-abc' },
  { id: '2', date: '2025-06-28', slot: '2:00 PM',  status: 'completed',  doctor: 'Dr. Priya Sharma',  type: 'Thyroid Follow-up',     videoRoomUrl: '' },
  { id: '3', date: '2025-06-15', slot: '11:00 AM', status: 'completed',  doctor: 'Dr. James Wilson',  type: 'Diet Review',           videoRoomUrl: '' },
  { id: '4', date: '2025-07-18', slot: '4:00 PM',  status: 'confirmed',  doctor: 'Dr. Priya Sharma',  type: 'Nutrition Planning',    videoRoomUrl: 'room-xyz' },
  { id: '5', date: '2025-06-01', slot: '9:00 AM',  status: 'cancelled',  doctor: 'Dr. James Wilson',  type: 'Initial Consultation',  videoRoomUrl: '' },
]

const STATUS_STYLES: Record<string, string> = {
  confirmed:  'bg-[#d0ecf2] text-[#1a6b7a]',
  completed:  'bg-[#dcfce7] text-[#16a34a]',
  cancelled:  'bg-[#fee2e2] text-[#dc2626]',
  rescheduled:'bg-[#fef3c7] text-[#d97706]',
}

const RESCHEDULE_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

function canReschedule(date: string, slot: string): boolean {
  const slotTime = new Date(`${date} ${slot}`)
  return (slotTime.getTime() - Date.now()) > 2 * 60 * 60 * 1000
}

export default function AppointmentsPage() {
  const [filter, setFilter]       = useState<Status>('all')
  const [rescheduleId, setRescId] = useState<string | null>(null)
  const [newSlot, setNewSlot]     = useState('')
  const [newDate, setNewDate]     = useState('')

  const filtered = filter === 'all'
    ? DUMMY_APPOINTMENTS
    : DUMMY_APPOINTMENTS.filter(a => a.status === filter)

  const today = new Date().toISOString().split('T')[0]

  return (
    <PageShell
      title="My Appointments"
      subtitle="Track your consultations and manage upcoming sessions."
      action={
        <PrimaryButton onClick={() => window.location.href = '/patient/book-appointment'}>
          + Book New
        </PrimaryButton>
      }
    >
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'confirmed', 'completed', 'cancelled'] as Status[]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-[12px] font-semibold capitalize border transition-all ${
              filter === s
                ? 'bg-[#1a6b7a] text-white border-[#1a6b7a]'
                : 'bg-white text-[#6b8896] border-[#e6edf0] hover:border-[#a8d8e2]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={24} />}
          title="No appointments found"
          description="You have no appointments in this category."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(appt => (
            <div key={appt.id} className="bg-white rounded-2xl border border-[#e6edf0] p-4 sm:p-5">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="w-10 h-10 rounded-xl bg-[#d0ecf2] flex items-center justify-center text-[#1a6b7a] font-bold text-sm shrink-0">
                  {appt.doctor.split(' ')[1]?.[0]}{appt.doctor.split(' ')[2]?.[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-[14px] font-semibold text-[#1a3c4d]">{appt.doctor}</p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[appt.status] ?? ''}`}>
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#6b8896] mb-2">{appt.type}</p>
                  <div className="flex items-center gap-3 flex-wrap text-[12px] text-[#6b8896]">
                    <span className="flex items-center gap-1"><CalendarDays size={12} />{appt.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{appt.slot}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {appt.status === 'confirmed' && appt.videoRoomUrl && (
                    <PrimaryButton size="sm" onClick={() => window.location.href = `/patient/video-call/${appt.id}`}>
                      <Video size={13} /> Join
                    </PrimaryButton>
                  )}
                  {appt.status === 'confirmed' && canReschedule(appt.date, appt.slot) && (
                    <PrimaryButton size="sm" variant="outline" onClick={() => setRescId(appt.id)}>
                      <RotateCcw size={13} /> Reschedule
                    </PrimaryButton>
                  )}
                  {appt.status === 'confirmed' && (
                    <PrimaryButton size="sm" variant="ghost" onClick={() => alert('Cancelled')}>
                      <X size={13} />
                    </PrimaryButton>
                  )}
                </div>
              </div>

              {rescheduleId === appt.id && (
                <div className="mt-4 pt-4 border-t border-[#e6edf0] flex flex-col gap-3">
                  <p className="text-[13px] font-semibold text-[#1a3c4d]">Reschedule Appointment</p>
                  <input
                    type="date"
                    min={today}
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full h-9 rounded-lg border border-[#d0dde2] bg-[#f7fafb] px-3 text-[13px] outline-none focus:border-[#1a6b7a] transition-colors"
                  />
                  <div className="flex flex-wrap gap-2">
                    {RESCHEDULE_SLOTS.map(s => (
                      <button
                        key={s}
                        onClick={() => setNewSlot(s)}
                        className={`px-2.5 py-1 rounded-lg text-[12px] font-medium border transition-all ${
                          newSlot === s
                            ? 'bg-[#1a6b7a] text-white border-[#1a6b7a]'
                            : 'bg-white text-[#374955] border-[#e6edf0] hover:border-[#a8d8e2]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <PrimaryButton size="sm" disabled={!newDate || !newSlot} onClick={() => { setRescId(null); alert('Rescheduled!') }}>
                      Confirm
                    </PrimaryButton>
                    <PrimaryButton size="sm" variant="ghost" onClick={() => setRescId(null)}>
                      Cancel
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
