import { useState, useEffect } from 'react'
import { X, Copy, Check, UserPlus, KeyRound } from 'lucide-react'
import { useCreatePatient } from '@/hooks/useAdminPatientMutations'
import FormField   from '@/components/shared/FormField'
import SelectField from '@/components/shared/SelectField'
import AdminBtn    from '@/components/admin/AdminBtn'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import type { AdminPatientCreatePayload, GenderEnum, BloodGroupEnum } from '@/types'

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

interface FormState {
  fullName:           string
  email:              string
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
  fullName: '', email: '', gender: '', location: '',
  phoneNumber: '', whatsappNumber: '', age: '', heightCm: '',
  weightKg: '', bloodGroup: '', socialHandle: '', isDefencePersonnel: false,
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, color: COLORS.muted,
      textTransform: 'uppercase', letterSpacing: '0.6px',
      margin: '0 0 10px', paddingBottom: '6px', borderBottom: `1px solid ${COLORS.divider}`,
    }}>
      {children}
    </p>
  )
}

interface PatientCreateModalProps {
  open:    boolean
  onClose: () => void
}

export default function PatientCreateModal({ open, onClose }: PatientCreateModalProps) {
  const [form, setForm]               = useState<FormState>(EMPTY_FORM)
  const [generatedPwd, setGeneratedPwd] = useState<string | null>(null)
  const [copied, setCopied]           = useState(false)

  useEffect(() => {
    if (open) { setForm(EMPTY_FORM); setGeneratedPwd(null); setCopied(false) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !createMutation.isPending && !generatedPwd) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, generatedPwd])

  const createMutation = useCreatePatient((pwd) => setGeneratedPwd(pwd))

  const set = (field: keyof FormState, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: AdminPatientCreatePayload = {
      fullName:            form.fullName,
      email:               form.email,
      gender:              (form.gender as GenderEnum) || undefined,
      location:            form.location || undefined,
      phoneNumber:         form.phoneNumber || undefined,
      whatsappNumber:      form.whatsappNumber || undefined,
      age:                 form.age ? Number(form.age) : undefined,
      heightCm:            form.heightCm ? Number(form.heightCm) : undefined,
      weightKg:            form.weightKg ? Number(form.weightKg) : undefined,
      bloodGroup:          (form.bloodGroup as BloodGroupEnum) || undefined,
      socialHandle:        form.socialHandle || undefined,
      isDefencePersonnel:  form.isDefencePersonnel,
    }
    createMutation.mutate(payload)
  }

  const handleCopy = () => {
    if (!generatedPwd) return
    navigator.clipboard.writeText(generatedPwd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDone = () => {
    setGeneratedPwd(null)
    setCopied(false)
    onClose()
  }

  if (!open) return null

  const isPending = createMutation.isPending

  if (generatedPwd) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 1001,
          background: 'rgba(15,61,74,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px', backdropFilter: 'blur(2px)',
        }}
      >
        <div style={{
          background: '#fff', borderRadius: '20px', boxShadow: SHADOW.popup,
          width: '100%', maxWidth: '420px', padding: '28px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: '#f0fdf4', color: '#16a34a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <UserPlus size={24} strokeWidth={1.8} />
          </div>

          <h3 style={{ margin: '0 0 8px', fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy }}>
            Patient Created Successfully
          </h3>
          <p style={{ margin: '0 0 20px', fontSize: FONT_SIZE.sm, color: COLORS.muted, lineHeight: 1.6 }}>
            Save and share this auto-generated password with the patient. It will not be shown again.
          </p>

          <div style={{
            width: '100%', background: '#f7fafb',
            border: `1.5px solid ${COLORS.divider}`, borderRadius: '12px',
            padding: '14px 16px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <KeyRound size={16} color={COLORS.brand} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <span style={{
                fontFamily: 'monospace', fontSize: FONT_SIZE.sm,
                color: COLORS.navy, wordBreak: 'break-all',
              }}>
                {generatedPwd}
              </span>
            </div>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 12px', borderRadius: '8px',
                border: `1px solid ${copied ? '#16a34a' : COLORS.divider}`,
                background: copied ? '#f0fdf4' : '#fff',
                cursor: 'pointer', fontSize: '12px',
                color: copied ? '#16a34a' : COLORS.brand,
                fontWeight: FONT_WEIGHT.semibold, flexShrink: 0,
                transition: 'all 0.15s',
              }}
            >
              {copied
                ? <><Check size={12} strokeWidth={2.5} /> Copied</>
                : <><Copy size={12} strokeWidth={2} /> Copy</>}
            </button>
          </div>

          <AdminBtn onClick={handleDone} style={{ width: '100%' }}>
            Done
          </AdminBtn>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .pc-scroll::-webkit-scrollbar { display: none; }
        .pc-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .pc-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .pc-field-grid { grid-template-columns: 1fr; } }
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
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: '20px', boxShadow: SHADOW.popup,
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
                Add New Patient
              </p>
              <p style={{ margin: 0, fontSize: FONT_SIZE.xs, color: COLORS.muted }}>
                A password will be auto-generated and shown once
              </p>
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

          <div className="pc-scroll" style={{ overflowY: 'auto', flex: 1, padding: '20px' }}>
            <form id="patient-create-form" onSubmit={handleSubmit}>

              <SectionLabel>Account</SectionLabel>
              <div className="pc-field-grid" style={{ marginBottom: '20px' }}>
                <FormField
                  id="pc-name" label="Full Name" required
                  value={form.fullName} onChange={e => set('fullName', e.target.value)}
                  placeholder="Jane Doe"
                />
                <FormField
                  id="pc-email" label="Email" type="email" required
                  value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="jane@email.com"
                />
              </div>

              <SectionLabel>Personal Info</SectionLabel>
              <div className="pc-field-grid" style={{ marginBottom: '20px' }}>
                <SelectField
                  id="pc-gender" label="Gender"
                  options={GENDER_OPTS} value={form.gender}
                  onChange={v => set('gender', v)} placeholder="Select gender"
                />
                <SelectField
                  id="pc-blood" label="Blood Group"
                  options={BLOOD_OPTS} value={form.bloodGroup}
                  onChange={v => set('bloodGroup', v)} placeholder="Select"
                />
                <FormField
                  id="pc-age" label="Age" type="number"
                  value={form.age} onChange={e => set('age', e.target.value)}
                  placeholder="30" min="0" max="120"
                />
                <FormField
                  id="pc-height" label="Height (cm)" type="number"
                  value={form.heightCm} onChange={e => set('heightCm', e.target.value)}
                  placeholder="165" min="0"
                />
                <FormField
                  id="pc-weight" label="Weight (kg)" type="number"
                  value={form.weightKg} onChange={e => set('weightKg', e.target.value)}
                  placeholder="65" min="0"
                />
                <FormField
                  id="pc-social" label="Social Handle"
                  value={form.socialHandle} onChange={e => set('socialHandle', e.target.value)}
                  placeholder="@handle"
                />
                <div style={{ gridColumn: '1 / -1' }}>
                  <FormField
                    id="pc-loc" label="Location"
                    value={form.location} onChange={e => set('location', e.target.value)}
                    placeholder="eg. Mumbai, India"
                  />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="pc-defence"
                    checked={form.isDefencePersonnel}
                    onChange={e => set('isDefencePersonnel', e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: COLORS.brand }}
                  />
                  <label htmlFor="pc-defence" style={{ fontSize: FONT_SIZE.sm, color: COLORS.body, cursor: 'pointer' }}>
                    Defence Personnel
                  </label>
                </div>
              </div>

              <SectionLabel>Contact</SectionLabel>
              <div className="pc-field-grid">
                <FormField
                  id="pc-phone" label="Phone Number" type="tel"
                  value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)}
                  placeholder="+91 00000 00000"
                />
                <FormField
                  id="pc-wapp" label="WhatsApp Number" type="tel"
                  value={form.whatsappNumber} onChange={e => set('whatsappNumber', e.target.value)}
                  placeholder="+91 00000 00000"
                />
              </div>

            </form>
          </div>

          <div style={{
            display: 'flex', gap: '10px', justifyContent: 'flex-end',
            padding: '14px 20px', borderTop: `1px solid ${COLORS.divider}`, flexShrink: 0,
          }}>
            <AdminBtn variant="secondary" onClick={onClose} disabled={isPending}>
              Cancel
            </AdminBtn>
            <AdminBtn
              form="patient-create-form"
              type="submit"
              icon={<UserPlus size={14} strokeWidth={2} />}
              disabled={isPending}
            >
              {isPending ? 'Creating…' : 'Create Patient'}
            </AdminBtn>
          </div>
        </div>
      </div>
    </>
  )
}
