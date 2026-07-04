import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, Copy, Check } from 'lucide-react'
import { adminService } from '@/services/api/admin.service'
import { useCreateDoctor, useUpdateDoctor } from '@/hooks/useAdminDoctorMutations'
import FormField   from '@/components/shared/FormField'
import SelectField from '@/components/shared/SelectField'
import AdminBtn    from '@/components/admin/AdminBtn'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import type { AdminDoctorCreatePayload, AdminDoctorUpdatePayload } from '@/types'

const STATUS_OPTS = [
  { value: 'ACTIVE',           label: 'Active'           },
  { value: 'INACTIVE',         label: 'Inactive'         },
  { value: 'SUSPENDED',        label: 'Suspended'        },
  { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
]

interface FormState {
  fullName:           string
  email:              string
  phoneNumber:        string
  specialization:     string
  qualification:      string
  licenseNumber:      string
  yearsOfExperience:  string
  hospitalName:       string
  clinicAddress:      string
  accountStatus:      string
  isApproved:         boolean
}

const EMPTY_FORM: FormState = {
  fullName: '', email: '', phoneNumber: '', specialization: '',
  qualification: '', licenseNumber: '', yearsOfExperience: '',
  hospitalName: '', clinicAddress: '', accountStatus: 'ACTIVE', isApproved: true,
}

interface DoctorFormModalProps {
  doctorId: string | null
  mode:     'create' | 'edit'
  onClose:  () => void
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

export default function DoctorFormModal({ doctorId, mode, onClose }: DoctorFormModalProps) {
  const isOpen = mode === 'create' || !!doctorId
  const [form, setForm]           = useState<FormState>(EMPTY_FORM)
  const [generatedPwd, setGeneratedPwd] = useState<string | null>(null)
  const [copied, setCopied]       = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'doctor', doctorId ?? ''],
    queryFn:  () => adminService.getDoctorById(doctorId!),
    enabled:  mode === 'edit' && !!doctorId,
    staleTime: 1000 * 60 * 2,
  })

  useEffect(() => {
    if (mode === 'create') { setForm(EMPTY_FORM); return }
    if (!data?.data) return
    const d  = data.data
    const pr = d.doctorProfile
    setForm({
      fullName:          d.fullName || '',
      email:             d.email || '',
      phoneNumber:       pr?.phoneNumber || '',
      specialization:    pr?.specialization || '',
      qualification:     pr?.qualification || '',
      licenseNumber:     pr?.licenseNumber || '',
      yearsOfExperience: pr?.yearsOfExperience != null ? String(pr.yearsOfExperience) : '',
      hospitalName:      pr?.hospitalName || '',
      clinicAddress:     pr?.clinicAddress || '',
      accountStatus:     d.accountStatus || 'ACTIVE',
      isApproved:        pr?.isApproved ?? true,
    })
  }, [data, mode])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !createMutation.isPending && !updateMutation.isPending && !generatedPwd)
        onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, generatedPwd])

  const createMutation = useCreateDoctor((pwd) => setGeneratedPwd(pwd))
  const updateMutation = useUpdateDoctor(onClose)

  const set = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'create') {
      const payload: AdminDoctorCreatePayload = {
        fullName:           form.fullName,
        email:              form.email,
        phoneNumber:        form.phoneNumber    || undefined,
        specialization:     form.specialization || undefined,
        qualification:      form.qualification  || undefined,
        licenseNumber:      form.licenseNumber  || undefined,
        yearsOfExperience:  form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
        hospitalName:       form.hospitalName   || undefined,
        clinicAddress:      form.clinicAddress  || undefined,
      }
      createMutation.mutate(payload)
    } else if (doctorId) {
      const payload: AdminDoctorUpdatePayload = {
        fullName:      form.fullName      || undefined,
        email:         form.email         || undefined,
        accountStatus: (form.accountStatus || undefined) as AdminDoctorUpdatePayload['accountStatus'],
        doctorProfile: {
          phoneNumber:       form.phoneNumber    || undefined,
          specialization:    form.specialization || undefined,
          qualification:     form.qualification  || undefined,
          licenseNumber:     form.licenseNumber  || undefined,
          yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
          hospitalName:      form.hospitalName   || undefined,
          clinicAddress:     form.clinicAddress  || undefined,
          isApproved:        form.isApproved,
        },
      }
      updateMutation.mutate({ id: doctorId, payload })
    }
  }

  const handleCopy = () => {
    if (!generatedPwd) return
    navigator.clipboard.writeText(generatedPwd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePasswordDone = () => {
    setGeneratedPwd(null)
    setCopied(false)
    onClose()
  }

  if (!isOpen) return null

  const isPending = createMutation.isPending || updateMutation.isPending

  // ── Password reveal screen ─────────────────────────────────────────────────
  if (generatedPwd) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1001,
        background: 'rgba(15,61,74,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', backdropFilter: 'blur(2px)',
      }}>
        <div style={{
          background: '#fff', borderRadius: '20px', boxShadow: SHADOW.popup,
          width: '100%', maxWidth: '420px', padding: '24px', textAlign: 'center',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: '#f0fdf4', color: '#16a34a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', margin: '0 auto 16px',
          }}>
            ✓
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy }}>
            Doctor Created Successfully
          </h3>
          <p style={{ margin: '0 0 20px', fontSize: FONT_SIZE.sm, color: COLORS.muted }}>
            Save this auto-generated password and share it with the doctor. It will not be shown again.
          </p>
          <div style={{
            background: '#f7fafb', border: `1px solid ${COLORS.divider}`,
            borderRadius: '10px', padding: '14px 16px', marginBottom: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'monospace', fontSize: FONT_SIZE.sm, color: COLORS.navy,
          }}>
            <span style={{ wordBreak: 'break-all' }}>{generatedPwd}</span>
            <button
              onClick={handleCopy}
              style={{
                padding: '6px 10px', borderRadius: '7px',
                border: `1px solid ${COLORS.divider}`, background: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: FONT_SIZE.xs, color: COLORS.brand, fontWeight: FONT_WEIGHT.semibold,
                marginLeft: '8px', flexShrink: 0,
              }}
            >
              {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>
          <AdminBtn onClick={handlePasswordDone} style={{ width: '100%' }}>Done</AdminBtn>
        </div>
      </div>
    )
  }

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }
        .df-scroll::-webkit-scrollbar { display: none; }
        .df-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .df-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .df-grid { grid-template-columns: 1fr; } }
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
            background: '#fff', borderRadius: '20px', boxShadow: SHADOW.popup,
            width: '100%', maxWidth: '600px',
            display: 'flex', flexDirection: 'column',
            maxHeight: 'calc(100vh - 48px)',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: `1px solid ${COLORS.divider}`, flexShrink: 0,
          }}>
            <div>
              <p style={{ margin: 0, fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>
                {mode === 'create' ? 'Add New Doctor' : 'Edit Doctor'}
              </p>
              {mode === 'edit' && data?.data?.fullName && (
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

          {/* Body */}
          <div className="df-scroll" style={{ overflowY: 'auto', flex: 1, padding: '20px' }}>
            {isLoading && mode === 'edit' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div className="skeleton-pulse" style={{ height: '11px', width: '30%', borderRadius: '5px', background: '#e6edf0' }} />
                    <div className="skeleton-pulse" style={{ height: '38px', width: '100%', borderRadius: '8px', background: '#e6edf0' }} />
                  </div>
                ))}
              </div>
            ) : (
              <form id="doctor-form" onSubmit={handleSubmit}>
                <SectionLabel>Basic Info</SectionLabel>
                <div className="df-grid" style={{ marginBottom: '20px' }}>
                  <FormField id="df-name"  label="Full Name" value={form.fullName}  onChange={(e) => set('fullName', e.target.value)}  placeholder="Dr. Jane Smith" required />
                  <FormField id="df-email" label="Email"     value={form.email}     onChange={(e) => set('email', e.target.value)}     placeholder="dr.jane@hospital.com" type="email" required />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <FormField id="df-phone" label="Phone Number" value={form.phoneNumber} onChange={(e) => set('phoneNumber', e.target.value)} type="tel" placeholder="+91 00000 00000" />
                  </div>
                </div>

                <SectionLabel>Professional Info</SectionLabel>
                <div className="df-grid" style={{ marginBottom: '20px' }}>
                  <FormField id="df-spec"  label="Specialization" value={form.specialization} onChange={(e) => set('specialization', e.target.value)} placeholder="e.g. Nutrition" />
                  <FormField id="df-qual"  label="Qualification"  value={form.qualification}  onChange={(e) => set('qualification', e.target.value)}  placeholder="e.g. MBBS, MD" />
                  <FormField id="df-lic"   label="License Number" value={form.licenseNumber}   onChange={(e) => set('licenseNumber', e.target.value)}   placeholder="e.g. LIC123456" />
                  <FormField id="df-exp"   label="Experience (years)" value={form.yearsOfExperience} onChange={(e) => set('yearsOfExperience', e.target.value)} type="number" placeholder="5" min="0" max="60" />
                </div>

                <SectionLabel>Practice</SectionLabel>
                <div className="df-grid" style={{ marginBottom: '20px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <FormField id="df-hosp" label="Hospital / Clinic" value={form.hospitalName} onChange={(e) => set('hospitalName', e.target.value)} placeholder="e.g. City Hospital" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <FormField id="df-addr" label="Clinic Address" value={form.clinicAddress} onChange={(e) => set('clinicAddress', e.target.value)} placeholder="123 Main Street, New Delhi" />
                  </div>
                </div>

                {mode === 'edit' && (
                  <>
                    <SectionLabel>Status</SectionLabel>
                    <div className="df-grid" style={{ marginBottom: '20px' }}>
                      <SelectField
                        id="df-status"
                        label="Account Status"
                        options={STATUS_OPTS}
                        value={form.accountStatus}
                        onChange={(v) => set('accountStatus', v)}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="checkbox"
                            id="df-approved"
                            checked={form.isApproved}
                            onChange={(e) => set('isApproved', e.target.checked)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: COLORS.brand }}
                          />
                          <label htmlFor="df-approved" style={{ fontSize: FONT_SIZE.sm, color: COLORS.body, cursor: 'pointer' }}>
                            Approved
                          </label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', gap: '10px', justifyContent: 'flex-end',
            padding: '14px 20px', borderTop: `1px solid ${COLORS.divider}`, flexShrink: 0,
          }}>
            <AdminBtn variant="secondary" onClick={onClose} disabled={isPending}>Cancel</AdminBtn>
            <AdminBtn form="doctor-form" type="submit" disabled={isPending || (mode === 'edit' && isLoading)}>
              {isPending
                ? (mode === 'create' ? 'Creating…' : 'Saving…')
                : (mode === 'create' ? 'Create Doctor' : 'Save Changes')}
            </AdminBtn>
          </div>
        </div>
      </div>
    </>
  )
}
