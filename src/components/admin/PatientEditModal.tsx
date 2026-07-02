import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { adminService } from '@/services/api/admin.service'
import { useUpdatePatient } from '@/hooks/useAdminPatientMutations'
import FormField   from '@/components/shared/FormField'
import SelectField from '@/components/shared/SelectField'
import AdminBtn    from '@/components/admin/AdminBtn'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import type { AdminPatientUpdatePayload } from '@/types'

const GENDER_OPTS = [
  { value: 'MALE',              label: 'Male'             },
  { value: 'FEMALE',            label: 'Female'           },
  { value: 'OTHER',             label: 'Other'            },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say'},
]

const BLOOD_OPTS = [
  { value: 'A_POS',  label: 'A+'  }, { value: 'A_NEG',  label: 'A-'  },
  { value: 'B_POS',  label: 'B+'  }, { value: 'B_NEG',  label: 'B-'  },
  { value: 'AB_POS', label: 'AB+' }, { value: 'AB_NEG', label: 'AB-' },
  { value: 'O_POS',  label: 'O+'  }, { value: 'O_NEG',  label: 'O-'  },
]

const STATUS_OPTS = [
  { value: 'ACTIVE',            label: 'Active'            },
  { value: 'INACTIVE',          label: 'Inactive'          },
  { value: 'PENDING_APPROVAL',  label: 'Pending Approval'  },
  { value: 'SUSPENDED',         label: 'Suspended'         },
]

interface FormState {
  fullName:           string
  email:              string
  accountStatus:      string
  gender:             string
  location:           string
  phoneNumber:        string
  whatsappNumber:     string
  age:                string
  heightCm:           string
  weightKg:           string
  bloodGroup:         string
  socialHandle:       string
  isDefencePersonnel: boolean
}

const EMPTY_FORM: FormState = {
  fullName: '', email: '', accountStatus: 'ACTIVE',
  gender: '', location: '', phoneNumber: '', whatsappNumber: '',
  age: '', heightCm: '', weightKg: '', bloodGroup: '',
  socialHandle: '', isDefencePersonnel: false,
}

interface PatientEditModalProps {
  patientId: string | null
  onClose:   () => void
}

export default function PatientEditModal({ patientId, onClose }: PatientEditModalProps) {
  const isOpen = !!patientId
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'patient', patientId ?? ''],
    queryFn:  () => adminService.getPatientById(patientId!),
    enabled:  !!patientId,
    staleTime: 1000 * 60 * 2,
  })

  useEffect(() => {
    if (!data?.data) return
    const p = data.data
    const pr = p.patientProfile
    setForm({
      fullName:           p.fullName           ?? '',
      email:              p.email              ?? '',
      accountStatus:      p.accountStatus      ?? 'ACTIVE',
      gender:             pr?.gender           ?? '',
      location:           pr?.location         ?? '',
      phoneNumber:        pr?.phoneNumber       ?? '',
      whatsappNumber:     pr?.whatsappNumber    ?? '',
      age:                pr?.age != null       ? String(pr.age)      : '',
      heightCm:           pr?.heightCm != null  ? String(pr.heightCm) : '',
      weightKg:           pr?.weightKg != null  ? String(pr.weightKg) : '',
      bloodGroup:         pr?.bloodGroup        ?? '',
      socialHandle:       pr?.socialHandle      ?? '',
      isDefencePersonnel: pr?.isDefencePersonnel ?? false,
    })
  }, [data])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !updateMutation.isPending) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const updateMutation = useUpdatePatient(onClose)

  const set = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientId) return

    const payload: AdminPatientUpdatePayload = {
      fullName:      form.fullName      || undefined,
      email:         form.email         || undefined,
      accountStatus: (form.accountStatus || undefined) as AdminPatientUpdatePayload['accountStatus'],
      patientProfile: {
        gender:             (form.gender || undefined) as AdminPatientUpdatePayload['patientProfile']['gender'],
        location:           form.location      || undefined,
        phoneNumber:        form.phoneNumber    || undefined,
        whatsappNumber:     form.whatsappNumber || undefined,
        age:                form.age            ? Number(form.age)      : undefined,
        heightCm:           form.heightCm       ? Number(form.heightCm) : undefined,
        weightKg:           form.weightKg       ? Number(form.weightKg) : undefined,
        bloodGroup:         (form.bloodGroup || undefined) as AdminPatientUpdatePayload['patientProfile']['bloodGroup'],
        socialHandle:       form.socialHandle   || undefined,
        isDefencePersonnel: form.isDefencePersonnel,
      },
    }

    updateMutation.mutate({ id: patientId, payload })
  }

  if (!isOpen) return null

  const isPending = updateMutation.isPending

  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }
        .pe-scroll::-webkit-scrollbar { display: none; }
        .pe-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .pe-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .pe-field-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div
        onClick={() => { if (!isPending) onClose() }}
        style={{
          position: 'fixed', inset: 0, zIndex: 1001,
          background: 'rgba(15,61,74,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px', backdropFilter: 'blur(2px)',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: '20px',
            boxShadow: SHADOW.popup,
            width: '100%', maxWidth: '580px',
            display: 'flex', flexDirection: 'column',
            maxHeight: 'calc(100vh - 48px)',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: `1px solid ${COLORS.divider}`, flexShrink: 0,
          }}>
            <div>
              <p style={{ margin: 0, fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>
                Edit Patient
              </p>
              {data?.data?.fullName && (
                <p style={{ margin: 0, fontSize: FONT_SIZE.xs, color: COLORS.muted }}>{data.data.fullName}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              style={{
                width: '32px', height: '32px', borderRadius: '10px', border: 'none',
                background: COLORS.divider, cursor: isPending ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: COLORS.muted, flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="pe-scroll" style={{ overflowY: 'auto', flex: 1, padding: '20px' }}>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div className="skeleton-pulse" style={{ height: '11px', width: '30%', borderRadius: '5px', background: '#e6edf0' }} />
                    <div className="skeleton-pulse" style={{ height: '38px', width: '100%', borderRadius: '8px', background: '#e6edf0' }} />
                  </div>
                ))}
              </div>
            ) : (
              <form id="patient-edit-form" onSubmit={handleSubmit}>
                <SectionLabel>Account</SectionLabel>
                <div className="pe-field-grid" style={{ marginBottom: '20px' }}>
                  <FormField id="pe-name"   label="Full Name"  value={form.fullName}  onChange={(e) => set('fullName', e.target.value)}  placeholder="Jane Doe" />
                  <FormField id="pe-email"  label="Email"      value={form.email}     onChange={(e) => set('email', e.target.value)}     placeholder="jane@email.com" type="email" />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <SelectField id="pe-status" label="Account Status" options={STATUS_OPTS} value={form.accountStatus} onChange={(v) => set('accountStatus', v)} />
                  </div>
                </div>

                <SectionLabel>Personal Info</SectionLabel>
                <div className="pe-field-grid" style={{ marginBottom: '20px' }}>
                  <SelectField id="pe-gender" label="Gender"      options={GENDER_OPTS} value={form.gender}     onChange={(v) => set('gender', v)}     placeholder="Select gender" />
                  <SelectField id="pe-blood"  label="Blood Group" options={BLOOD_OPTS}  value={form.bloodGroup} onChange={(v) => set('bloodGroup', v)} placeholder="Select" />
                  <FormField id="pe-age"    label="Age"        value={form.age}      onChange={(e) => set('age', e.target.value)}      type="number" placeholder="30" min="0" max="120" />
                  <FormField id="pe-height" label="Height (cm)" value={form.heightCm} onChange={(e) => set('heightCm', e.target.value)} type="number" placeholder="165" min="0" />
                  <FormField id="pe-weight" label="Weight (kg)" value={form.weightKg} onChange={(e) => set('weightKg', e.target.value)} type="number" placeholder="65"  min="0" />
                  <FormField id="pe-social" label="Social Handle" value={form.socialHandle} onChange={(e) => set('socialHandle', e.target.value)} placeholder="@handle" />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <FormField id="pe-loc" label="Location" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="eg. Mumbai, India" />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="pe-defence"
                      checked={form.isDefencePersonnel}
                      onChange={(e) => set('isDefencePersonnel', e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: COLORS.brand }}
                    />
                    <label htmlFor="pe-defence" style={{ fontSize: FONT_SIZE.sm, color: COLORS.body, cursor: 'pointer' }}>
                      Defence Personnel
                    </label>
                  </div>
                </div>

                <SectionLabel>Contact</SectionLabel>
                <div className="pe-field-grid">
                  <FormField id="pe-phone" label="Phone Number"    value={form.phoneNumber}    onChange={(e) => set('phoneNumber', e.target.value)}    type="tel" placeholder="+91 00000 00000" />
                  <FormField id="pe-wapp"  label="WhatsApp Number" value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} type="tel" placeholder="+91 00000 00000" />
                </div>
              </form>
            )}
          </div>

          <div style={{
            display: 'flex', gap: '10px', justifyContent: 'flex-end',
            padding: '14px 20px', borderTop: `1px solid ${COLORS.divider}`, flexShrink: 0,
          }}>
            <AdminBtn variant="secondary" onClick={onClose} disabled={isPending}>Cancel</AdminBtn>
            <AdminBtn form="patient-edit-form" type="submit" disabled={isPending || isLoading}>
              {isPending ? 'Saving…' : 'Save Changes'}
            </AdminBtn>
          </div>
        </div>
      </div>
    </>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, color: COLORS.muted,
      textTransform: 'uppercase', letterSpacing: '0.6px',
      margin: '0 0 10px', paddingBottom: '6px',
      borderBottom: `1px solid ${COLORS.divider}`,
    }}>
      {children}
    </p>
  )
}
