/**
 * PatientsPage — Doctor's patient list with search and pagination.
 * Data: GET /doctor/patients
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, Search, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, ArrowRight,
} from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import { ROUTES } from '@/config/routes'
import { BLOOD_GROUP_LABELS } from '@/config/constants'
import {
  useDoctorPatients,
  DEFAULT_DOCTOR_PATIENTS_LIMIT,
} from '@/hooks/useDoctorPatients'
import type { DoctorPatientListItem } from '@/types'
import { format, parseISO } from 'date-fns'

function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—'
  try { return format(parseISO(iso), 'MMM d, yyyy') }
  catch { return '—' }
}

function getInitials(name: string | null | undefined) {
  if (!name?.trim()) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function genderLabel(g: string | null | undefined) {
  if (!g) return '—'
  const map: Record<string, string> = {
    MALE: 'Male', FEMALE: 'Female', OTHER: 'Other', PREFER_NOT_TO_SAY: 'Undisclosed',
  }
  return map[g] ?? g
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
        Could not load patients. Please try again.
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

export default function PatientsPage() {
  const nav = useNavigate()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_DOCTOR_PATIENTS_LIMIT)
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current)
    searchRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => { if (searchRef.current) clearTimeout(searchRef.current) }
  }, [search])

  const { patients, pagination, isLoading, isFetching, isError, refetch } = useDoctorPatients({
    search: debouncedSearch || undefined,
    page,
    limit,
  })

  const openPatient = (id: string) => nav(ROUTES.DOCTOR.PATIENT_DETAIL.replace(':id', id))

  return (
    <div style={{ padding: 16, width: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy, margin: 0 }}>
          My Patients
        </h1>
        <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, marginTop: 4 }}>
          Patients assigned to you through packages and appointments.
        </p>
      </div>

      {isError && <ErrorBanner onRetry={refetch} />}

      <div style={{
        background: '#fff', borderRadius: 16, padding: 16,
        border: `1px solid ${COLORS.divider}`, boxShadow: SHADOW.card, marginBottom: 16,
      }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <Search size={15} color={COLORS.muted} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            style={{
              width: '100%', padding: '8px 10px 8px 32px', borderRadius: 8,
              border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm,
            }}
          />
        </div>
      </div>

      <div style={{
        background: '#fff', borderRadius: 16, border: `1px solid ${COLORS.divider}`,
        boxShadow: SHADOW.card, overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center', color: COLORS.muted }}>Loading patients…</div>
        ) : patients.length === 0 ? (
          <div style={{
            padding: 48, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          }}>
            <Users size={40} color={COLORS.brand} style={{ marginBottom: 12 }} />
            <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>No patients found</p>
            <p style={{ margin: '6px 0 0', fontSize: FONT_SIZE.sm, color: COLORS.muted }}>
              Patients appear here after a package is assigned to you, or after their first appointment.
            </p>
          </div>
        ) : (
          <div>
            {patients.map((p: DoctorPatientListItem) => (
              <div
                key={p.id}
                onClick={() => openPatient(p.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                  padding: '14px 16px', borderBottom: `1px solid ${COLORS.divider}`,
                  cursor: 'pointer', opacity: isFetching ? 0.7 : 1,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = COLORS.inputBg }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: COLORS.brandLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: COLORS.brand, fontWeight: FONT_WEIGHT.bold, flexShrink: 0,
                }}>
                  {p.profilePhotoUrl
                    ? <img src={p.profilePhotoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    : getInitials(p.fullName)}
                </div>

                <div style={{ flex: 1, minWidth: 180 }}>
                  <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {p.fullName}
                    {!p.lastAppointment && p.packageSubscription && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                        background: '#fef3c7', color: '#b45309',
                      }}>
                        New package patient
                      </span>
                    )}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: FONT_SIZE.xs, color: COLORS.muted }}>{p.email}</p>
                  {p.packageSubscription?.package?.name && (
                    <p style={{ margin: '4px 0 0', fontSize: FONT_SIZE.xs, color: COLORS.brand, fontWeight: FONT_WEIGHT.semibold }}>
                      {p.packageSubscription.package.name}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 4 }}>
                    {p.patientProfile?.age != null && (
                      <span style={{ fontSize: FONT_SIZE.xs, color: COLORS.muted }}>Age {p.patientProfile.age}</span>
                    )}
                    {p.patientProfile?.gender && (
                      <span style={{ fontSize: FONT_SIZE.xs, color: COLORS.muted }}>{genderLabel(p.patientProfile.gender)}</span>
                    )}
                    {p.patientProfile?.bloodGroup && (
                      <span style={{ fontSize: FONT_SIZE.xs, color: COLORS.muted }}>
                        {BLOOD_GROUP_LABELS[p.patientProfile.bloodGroup] ?? p.patientProfile.bloodGroup}
                      </span>
                    )}
                  </div>
                </div>

                {p.lastAppointment && (
                  <div style={{ textAlign: 'right', minWidth: 120 }}>
                    <p style={{ margin: 0, fontSize: FONT_SIZE.xs, color: COLORS.muted }}>Last visit</p>
                    <p style={{ margin: '2px 0 4px', fontSize: FONT_SIZE.sm, color: COLORS.navy }}>{fmtDate(p.lastAppointment.dateTime)}</p>
                    <StatusBadge status={p.lastAppointment.status} />
                  </div>
                )}

                <ArrowRight size={16} color={COLORS.brand} />
              </div>
            ))}
          </div>
        )}

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
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                style={{ padding: 6, borderRadius: 6, border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>
                <ChevronLeft size={16} />
              </button>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}
                style={{ padding: 6, borderRadius: 6, border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
