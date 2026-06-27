import { useState } from 'react'
import { User, Phone, Mail, MapPin, Droplets, Scale, Ruler, Camera } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'

const DUMMY_PROFILE = {
  name:         'Ananya Sharma',
  phone:        '+91 98765 43210',
  whatsappNo:   '+91 98765 43210',
  email:        'ananya.sharma@email.com',
  gender:       'female' as const,
  area:         'Banjara Hills, Hyderabad',
  age:          28,
  height:       162,
  weight:       65,
  bloodGroup:   'B+',
  defencePersonnel: false,
}

interface Field {
  id:    string
  label: string
  value: string
  icon:  React.ReactNode
  type?: string
  editable?: boolean
}

function InfoField({ field, editing, onChange }: { field: Field; editing: boolean; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold text-[#9ab0bb] uppercase tracking-wide flex items-center gap-1">
        <span className="text-[#1a6b7a]">{field.icon}</span>
        {field.label}
      </label>
      {editing && field.editable !== false ? (
        <input
          value={field.value}
          onChange={e => onChange(e.target.value)}
          type={field.type ?? 'text'}
          className="h-9 rounded-lg border border-[#d0dde2] bg-[#f7fafb] px-3 text-[13px] text-[#1a3c4d] outline-none focus:border-[#1a6b7a] transition-colors"
        />
      ) : (
        <p className="text-[14px] text-[#1a3c4d] font-medium">{field.value || '—'}</p>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(DUMMY_PROFILE)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); setEditing(false) }, 900)
  }

  const fields: Field[] = [
    { id: 'name',       label: 'Full Name',   value: profile.name,       icon: <User size={12} /> },
    { id: 'email',      label: 'Email',        value: profile.email,      icon: <Mail size={12} />, type: 'email', editable: false },
    { id: 'phone',      label: 'Phone',        value: profile.phone,      icon: <Phone size={12} />, type: 'tel' },
    { id: 'whatsappNo', label: 'WhatsApp',     value: profile.whatsappNo, icon: <Phone size={12} />, type: 'tel' },
    { id: 'area',       label: 'Area',         value: profile.area,       icon: <MapPin size={12} /> },
    { id: 'bloodGroup', label: 'Blood Group',  value: profile.bloodGroup, icon: <Droplets size={12} />, editable: false },
    { id: 'weight',     label: 'Weight (kg)',  value: String(profile.weight), icon: <Scale size={12} />, type: 'number' },
    { id: 'height',     label: 'Height (cm)',  value: String(profile.height), icon: <Ruler size={12} />, type: 'number', editable: false },
  ]

  const update = (id: string, val: string) => {
    setProfile(p => ({ ...p, [id]: id === 'weight' || id === 'height' || id === 'age' ? Number(val) : val }))
  }

  return (
    <PageShell
      title="My Profile"
      subtitle="Manage your personal and health information."
      action={
        editing
          ? <div className="flex gap-2">
              <PrimaryButton size="sm" loading={saving} onClick={handleSave}>Save</PrimaryButton>
              <PrimaryButton size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</PrimaryButton>
            </div>
          : <PrimaryButton size="sm" variant="outline" onClick={() => setEditing(true)}>Edit Profile</PrimaryButton>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="bg-white rounded-2xl border border-[#e6edf0] p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#d0ecf2] flex items-center justify-center text-[#1a6b7a] font-bold text-xl">
                {profile.name.charAt(0)}
              </div>
              {editing && (
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1a6b7a] text-white flex items-center justify-center">
                  <Camera size={12} />
                </button>
              )}
            </div>
            <div>
              <p className="text-[17px] font-bold text-[#1a3c4d]">{profile.name}</p>
              <p className="text-[12px] text-[#6b8896] mt-0.5">{profile.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] font-semibold bg-[#d0ecf2] text-[#1a6b7a] px-2 py-0.5 rounded-full">Patient</span>
                <span className="text-[11px] text-[#6b8896]">Age {profile.age} · {profile.gender}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map(f => (
              <InfoField
                key={f.id}
                field={f}
                editing={editing}
                onChange={v => update(f.id, v)}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#e6edf0] p-5">
          <p className="text-[13px] font-bold text-[#1a3c4d] mb-3">Health Summary</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Age',         value: `${profile.age}y`,        bg: '#e8f7f9' },
              { label: 'Weight',      value: `${profile.weight} kg`,   bg: '#eef8f0' },
              { label: 'Height',      value: `${profile.height} cm`,   bg: '#fff8ed' },
              { label: 'Blood Group', value: profile.bloodGroup,        bg: '#fee2e2' },
              { label: 'BMI',         value: (profile.weight / ((profile.height / 100) ** 2)).toFixed(1), bg: '#f3f0ff' },
              { label: 'Gender',      value: profile.gender,            bg: '#fce7f3' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: stat.bg }}>
                <p className="text-[16px] font-bold text-[#1a3c4d]">{stat.value}</p>
                <p className="text-[11px] text-[#6b8896] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
