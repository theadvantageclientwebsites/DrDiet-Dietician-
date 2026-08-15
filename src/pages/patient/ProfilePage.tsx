import { useState, useEffect, useRef } from 'react'
import { User, Phone, Mail, MapPin, Droplets, Scale, Ruler, Camera, AlertCircle, RefreshCw, Library } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'
import { BLOOD_GROUP_LABELS } from '@/config/constants'
import {
  usePatientPortalProfile,
  useUpdatePatientPortalProfile,
  useUploadPatientProfilePhoto,
  usePatientActiveSubscription,
} from '@/hooks/usePatientPortal'
import type { PatientPortalProfileData } from '@/types'
import ActivePackageCard from '@/components/patient/shared/ActivePackageCard'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

interface FormState {
  fullName: string
  phone: string
  whatsapp: string
  location: string
  age: string
  height: string
  weight: string
}

function profileToForm(p: PatientPortalProfileData): FormState {
  const pp = p.patientProfile
  return {
    fullName: p.fullName,
    phone:    pp?.phoneNumber ?? '',
    whatsapp: pp?.whatsappNumber ?? '',
    location: pp?.location ?? '',
    age:      pp?.age != null ? String(pp.age) : '',
    height:   pp?.heightCm != null ? String(pp.heightCm) : '',
    weight:   pp?.weightKg != null ? String(pp.weightKg) : '',
  }
}

export default function ProfilePage() {
  const { data, isLoading, isError, refetch } = usePatientPortalProfile()
  const { subscription } = usePatientActiveSubscription()
  const update = useUpdatePatientPortalProfile()
  const uploadPhoto = useUploadPatientProfilePhoto()
  const fileRef = useRef<HTMLInputElement>(null)

  const profile = data?.data ?? null
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<FormState | null>(null)

  useEffect(() => {
    if (profile) setForm(profileToForm(profile))
  }, [profile])

  const handleSave = () => {
    if (!form) return
    update.mutate({
      fullName: form.fullName,
      patientProfile: {
        phoneNumber:    form.phone || undefined,
        whatsappNumber: form.whatsapp || undefined,
        location:       form.location || undefined,
        age:            form.age ? Number(form.age) : undefined,
        heightCm:       form.height ? Number(form.height) : undefined,
        weightKg:       form.weight ? Number(form.weight) : undefined,
      },
    }, { onSuccess: () => setEditing(false) })
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadPhoto.mutate(file)
  }

  if (isLoading) {
    return (
      <PageShell title="My Profile" subtitle="Manage your personal and health information.">
        <p className="text-[13px] text-[#6b8896] py-8 text-center">Loading profile…</p>
      </PageShell>
    )
  }

  if (isError || !profile || !form) {
    return (
      <PageShell title="My Profile" subtitle="Manage your personal and health information.">
        <div className="flex items-center gap-2 p-4 rounded-xl bg-[#fff7ed] text-[#c2410c] text-[13px]">
          <AlertCircle size={16} /> Could not load profile.
          <button onClick={() => refetch()} className="underline flex items-center gap-1"><RefreshCw size={12} /> Retry</button>
        </div>
      </PageShell>
    )
  }

  const pp = profile.patientProfile
  const bloodLabel = pp?.bloodGroup ? (BLOOD_GROUP_LABELS[pp.bloodGroup] ?? pp.bloodGroup) : '—'
  const genderLabel = pp?.gender
    ? ({ MALE: 'Male', FEMALE: 'Female', OTHER: 'Other', PREFER_NOT_TO_SAY: 'Undisclosed' } as Record<string, string>)[pp.gender] ?? pp.gender
    : '—'

  return (
    <PageShell
      title="My Profile"
      subtitle="Manage your personal and health information."
      action={
        editing
          ? <div className="flex gap-2">
              <PrimaryButton size="sm" loading={update.isPending} onClick={handleSave}>Save</PrimaryButton>
              <PrimaryButton size="sm" variant="ghost" onClick={() => { setForm(profileToForm(profile)); setEditing(false) }}>Cancel</PrimaryButton>
            </div>
          : <PrimaryButton size="sm" variant="outline" onClick={() => setEditing(true)}>Edit Profile</PrimaryButton>
      }
    >
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />

      <ActivePackageCard subscription={subscription} />

      <Link
        to={ROUTES.PATIENT.LIBRARY}
        className="flex items-center gap-3 bg-white rounded-2xl border border-[#e6edf0] p-4 hover:border-[#a8d8e2] transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-[#d0ecf2] flex items-center justify-center shrink-0">
          <Library size={18} className="text-[#1a6b7a]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#1a3c4d] m-0">My library</p>
          <p className="text-[12px] text-[#6b8896] m-0">Purchased guides and 12-month package freebies</p>
        </div>
      </Link>

      <div className="flex flex-col gap-5">
        <div className="bg-white rounded-2xl border border-[#e6edf0] p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#d0ecf2] flex items-center justify-center text-[#1a6b7a] font-bold text-xl overflow-hidden">
                {profile.profilePhotoUrl
                  ? <img src={profile.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                  : profile.fullName.charAt(0)}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1a6b7a] text-white flex items-center justify-center"
              >
                <Camera size={12} />
              </button>
            </div>
            <div>
              <p className="text-[17px] font-bold text-[#1a3c4d]">{profile.fullName}</p>
              <p className="text-[12px] text-[#6b8896] mt-0.5">{profile.email}</p>
              <p className="text-[11px] text-[#6b8896] mt-1.5">Age {pp?.age ?? '—'} · {genderLabel}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: 'Full Name', value: form.fullName, key: 'fullName' as const, icon: <User size={12} />, edit: true },
              { label: 'Email', value: profile.email, icon: <Mail size={12} />, edit: false },
              { label: 'Phone', value: form.phone, key: 'phone' as const, icon: <Phone size={12} />, edit: true },
              { label: 'WhatsApp', value: form.whatsapp, key: 'whatsapp' as const, icon: <Phone size={12} />, edit: true },
              { label: 'Location', value: form.location, key: 'location' as const, icon: <MapPin size={12} />, edit: true },
              { label: 'Blood Group', value: bloodLabel, icon: <Droplets size={12} />, edit: false },
              { label: 'Weight (kg)', value: form.weight, key: 'weight' as const, icon: <Scale size={12} />, edit: true },
              { label: 'Height (cm)', value: form.height, key: 'height' as const, icon: <Ruler size={12} />, edit: true },
            ].map(f => (
              <div key={f.label} className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#9ab0bb] uppercase flex items-center gap-1">
                  <span className="text-[#1a6b7a]">{f.icon}</span>{f.label}
                </label>
                {editing && f.edit && f.key ? (
                  <input
                    value={f.value}
                    onChange={e => setForm(prev => prev ? { ...prev, [f.key!]: e.target.value } : prev)}
                    className="h-9 rounded-lg border border-[#d0dde2] bg-[#f7fafb] px-3 text-[13px] outline-none focus:border-[#1a6b7a]"
                  />
                ) : (
                  <p className="text-[14px] text-[#1a3c4d] font-medium">{f.value || '—'}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {pp && (
          <div className="bg-white rounded-2xl border border-[#e6edf0] p-5">
            <p className="text-[13px] font-bold text-[#1a3c4d] mb-3">Health Summary</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'BMI', value: pp.bmi != null ? String(pp.bmi) : '—' },
                { label: 'BMI Status', value: pp.bmiStatus ?? '—' },
                { label: 'Blood Group', value: bloodLabel },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-3 text-center bg-[#f0f4f6]">
                  <p className="text-[16px] font-bold text-[#1a3c4d]">{s.value}</p>
                  <p className="text-[11px] text-[#6b8896] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}
