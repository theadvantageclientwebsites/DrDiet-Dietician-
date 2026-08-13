/**
 * BookAppointmentPage — Patient books via POST /patient/appointments
 * Flow: choose doctor → details → date/time → pending confirmation
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays, Clock, FileText,
  Stethoscope, MapPin, Video, AlertCircle, ChevronLeft,
} from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'
import { ROUTES } from '@/config/routes'
import { usePatientDoctors, useBookPatientAppointment } from '@/hooks/usePatientPortal'
import type { PatientPortalDoctor, PatientAppointmentType, PatientPortalAppointment } from '@/types'
import { format, parseISO } from 'date-fns'

type Step = 'doctor' | 'details' | 'schedule' | 'success'

const STEPS: { key: Step; label: string }[] = [
  { key: 'doctor',   label: 'Choose Doctor' },
  { key: 'details',  label: 'Details'       },
  { key: 'schedule', label: 'Date & Time'   },
  { key: 'success',  label: 'Done'          },
]

function StepBar({ current }: { current: Step }) {
  const idx = STEPS.findIndex(s => s.key === current)
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
            i === idx ? 'bg-[#1a6b7a] text-white' : i < idx ? 'text-[#1a6b7a]' : 'text-[#9ab0bb]'
          }`}>
            {s.label}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-6 h-px mx-1 ${i < idx ? 'bg-[#1a6b7a]' : 'bg-[#e6edf0]'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function DoctorCard({ doc, selected, onSelect }: {
  doc: PatientPortalDoctor; selected: boolean; onSelect: () => void
}) {
  const p = doc.doctorProfile
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        selected ? 'border-[#1a6b7a] bg-[#e8f7f9]' : 'border-[#e6edf0] bg-white hover:border-[#a8d8e2]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-[#d0ecf2] flex items-center justify-center text-[#1a6b7a] font-bold shrink-0">
          {doc.profilePhotoUrl
            ? <img src={doc.profilePhotoUrl} alt="" className="w-full h-full rounded-full object-cover" />
            : doc.fullName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#1a3c4d]">{doc.fullName}</p>
          {p?.specialization && (
            <p className="text-[12px] text-[#6b8896] mt-0.5 flex items-center gap-1">
              <Stethoscope size={12} /> {p.specialization}
            </p>
          )}
          {p?.hospitalName && (
            <p className="text-[11px] text-[#9ab0bb] mt-1">{p.hospitalName}</p>
          )}
        </div>
      </div>
    </button>
  )
}

function buildDateTimeIso(date: string, time: string): string {
  return new Date(`${date}T${time}`).toISOString()
}

export default function BookAppointmentPage() {
  const nav = useNavigate()
  const [step, setStep]               = useState<Step>('doctor')
  const [search, setSearch]         = useState('')
  const [selectedDoctor, setDoctor] = useState<PatientPortalDoctor | null>(null)
  const [notes, setNotes]           = useState('')
  const [type, setType]             = useState<PatientAppointmentType>('ONLINE')
  const [selectedDate, setDate]     = useState('')
  const [selectedTime, setTime]     = useState('')
  const [booked, setBooked]         = useState<PatientPortalAppointment | null>(null)

  const { doctors, isLoading: doctorsLoading, isError: doctorsError, refetch } = usePatientDoctors({
    search: search || undefined,
  })

  const book = useBookPatientAppointment()

  const today = new Date().toISOString().split('T')[0]

  const handleBook = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return
    book.mutate(
      {
        doctorId: selectedDoctor.id,
        dateTime: buildDateTimeIso(selectedDate, selectedTime),
        type,
        notes:    notes.trim() || undefined,
      },
      {
        onSuccess: (res) => {
          setBooked(res.data ?? null)
          setStep('success')
        },
      },
    )
  }

  return (
    <PageShell title="Book Appointment" subtitle="Choose a doctor and pick a time for your consultation.">
      <StepBar current={step} />

      <div className="bg-white rounded-2xl border border-[#e6edf0] p-6 sm:p-8 max-w-lg mx-auto w-full">

        {step === 'doctor' && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[16px] font-bold text-[#1a3c4d] mb-1">Choose your doctor</p>
              <p className="text-[13px] text-[#6b8896]">Select a dietician for your consultation</p>
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or specialization…"
              className="w-full h-10 rounded-xl border border-[#d0dde2] bg-[#f7fafb] px-3 text-[13px] outline-none focus:border-[#1a6b7a]"
            />
            {doctorsError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#fff7ed] text-[#c2410c] text-[13px]">
                <AlertCircle size={16} />
                Could not load doctors.
                <button type="button" onClick={() => refetch()} className="underline ml-1">Retry</button>
              </div>
            )}
            {doctorsLoading ? (
              <p className="text-[13px] text-[#6b8896] py-4 text-center">Loading doctors…</p>
            ) : doctors.length === 0 ? (
              <p className="text-[13px] text-[#6b8896] py-4 text-center">No doctors available right now.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto">
                {doctors.map(doc => (
                  <DoctorCard
                    key={doc.id}
                    doc={doc}
                    selected={selectedDoctor?.id === doc.id}
                    onSelect={() => setDoctor(doc)}
                  />
                ))}
              </div>
            )}
            <PrimaryButton fullWidth disabled={!selectedDoctor} onClick={() => setStep('details')}>
              Continue
            </PrimaryButton>
          </div>
        )}

        {step === 'details' && selectedDoctor && (
          <div className="flex flex-col gap-4">
            <button type="button" onClick={() => setStep('doctor')} className="flex items-center gap-1 text-[12px] text-[#1a6b7a] font-semibold">
              <ChevronLeft size={14} /> Change doctor
            </button>
            <div className="p-3 rounded-xl bg-[#f0f4f6] text-[13px]">
              <span className="text-[#6b8896]">Doctor: </span>
              <span className="font-semibold text-[#1a3c4d]">{selectedDoctor.fullName}</span>
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#374955] mb-2">Consultation type</p>
              <div className="flex gap-2">
                {(['ONLINE', 'IN_PERSON'] as PatientAppointmentType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold border transition-all ${
                      type === t ? 'bg-[#1a6b7a] text-white border-[#1a6b7a]' : 'bg-white text-[#374955] border-[#e6edf0]'
                    }`}
                  >
                    {t === 'ONLINE' ? <Video size={13} /> : <MapPin size={13} />}
                    {t === 'ONLINE' ? 'Online' : 'In-Person'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#374955] flex items-center gap-1">
                <FileText size={14} /> Health notes (optional)
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe your health concern…"
                className="w-full rounded-xl border border-[#d0dde2] bg-[#f7fafb] px-3 py-2.5 text-[13px] outline-none resize-none focus:border-[#1a6b7a]"
              />
            </div>
            <PrimaryButton fullWidth onClick={() => setStep('schedule')}>
              Continue to Schedule
            </PrimaryButton>
          </div>
        )}

        {step === 'schedule' && selectedDoctor && (
          <div className="flex flex-col gap-4">
            <button type="button" onClick={() => setStep('details')} className="flex items-center gap-1 text-[12px] text-[#1a6b7a] font-semibold">
              <ChevronLeft size={14} /> Back
            </button>
            <div>
              <p className="text-[16px] font-bold text-[#1a3c4d] mb-1">Pick date & time</p>
              <p className="text-[13px] text-[#6b8896]">Choose a future slot. Your doctor will confirm the booking.</p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#374955] flex items-center gap-1">
                <CalendarDays size={14} /> Date
              </label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={e => setDate(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#d0dde2] bg-[#f7fafb] px-3 text-[13px] outline-none focus:border-[#1a6b7a]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#374955] flex items-center gap-1">
                <Clock size={14} /> Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={e => setTime(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#d0dde2] bg-[#f7fafb] px-3 text-[13px] outline-none focus:border-[#1a6b7a]"
              />
            </div>
            <PrimaryButton
              fullWidth
              loading={book.isPending}
              disabled={!selectedDate || !selectedTime}
              onClick={handleBook}
            >
              Request Appointment
            </PrimaryButton>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="w-14 h-14 rounded-full bg-[#fef3c7] flex items-center justify-center">
                <Clock size={28} className="text-[#d97706]" />
              </div>
              <p className="text-[17px] font-bold text-[#1a3c4d]">Booking Requested</p>
              <p className="text-[13px] text-[#6b8896] max-w-xs">
                Your appointment is <strong>Pending</strong> — the doctor will confirm it soon.
              </p>
            </div>
            <div className="bg-[#f0f4f6] rounded-xl p-4 flex flex-col gap-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#6b8896]">Doctor</span>
                <span className="font-semibold text-[#1a3c4d]">{booked?.doctor.fullName ?? selectedDoctor?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b8896]">Date & Time</span>
                <span className="font-semibold text-[#1a3c4d]">
                  {booked?.dateTime
                    ? format(parseISO(booked.dateTime), 'MMM d, yyyy · h:mm a')
                    : selectedDate && selectedTime
                      ? format(parseISO(buildDateTimeIso(selectedDate, selectedTime)), 'MMM d, yyyy · h:mm a')
                      : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b8896]">Status</span>
                <span className="font-semibold text-[#d97706]">Pending</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <PrimaryButton fullWidth onClick={() => nav(ROUTES.PATIENT.APPOINTMENTS)}>
                View My Appointments
              </PrimaryButton>
              <PrimaryButton fullWidth variant="ghost" onClick={() => nav(ROUTES.PATIENT.DASHBOARD)}>
                Back to Dashboard
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}
