import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormField from '@/components/shared/FormField'
import SelectField from '@/components/shared/SelectField'
import SectionHeader from '@/components/shared/SectionHeader'
import FormPageShell from '@/components/shared/FormPageShell'
import { ROUTES } from '@/config/routes'
import { BLOOD_GROUPS, GENDERS } from '@/config/constants'

const T = 'hsl(174,68%,36%)'
const UIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>
const AIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
const LIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
const ChkIco = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>

const STEPS = ['Personal', 'Biometric', 'Complete']
const schema = z.object({
  name: z.string().min(2, 'Required'), email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Min 6 chars'), gender: z.string().min(1, 'Required'),
  area: z.string().min(2, 'Required'), phone: z.string().min(10, 'Required'),
  whatsappNo: z.string().min(10, 'Required'), age: z.coerce.number().min(1).max(120),
  height: z.coerce.number().min(50).max(250), weight: z.coerce.number().min(10).max(300),
  bloodGroup: z.string().min(1, 'Required'), instagramOrLinkedinId: z.string().optional(),
  defencePersonnel: z.boolean(),
})
type FD = z.infer<typeof schema>

function StepBar() {
  return (
    <div className="flex items-center gap-1.5">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={i === 0 ? { background: T, color: '#fff' } : { background: '#f0f2f4', color: '#9ca3af' }}>
            {i + 1}
          </div>
          <span className="text-[12px] font-medium" style={i === 0 ? { color: T } : { color: '#9ca3af' }}>{s}</span>
          {i < STEPS.length - 1 && <div className="w-8 h-px bg-[#e5e7eb]" />}
        </div>
      ))}
    </div>
  )
}

// ── Sidebar panels shown on desktop right col, stacked below form on mobile ──
function PatientSidebar() {
  return (
    <>
      {/* Why join card */}
      <div className="rounded-xl border border-[#e8ecf0] bg-white p-5">
        <p className="text-[14px] font-semibold text-[#111827] mb-3">Why Join DrDietTherapy?</p>
        {[
          ['Personalized Diet Plans', 'Customized nutrition plans based on your health profile.'],
          ['Blood Report Analysis', 'Doctor reviews your reports and adds recommendations.'],
          ['Video Consultations', 'Book 1-on-1 sessions with Dr. at your preferred slot.'],
          ['Progress Tracking', 'Track weight, height and health metrics over time.'],
        ].map(([t, d]) => (
          <div key={t} className="flex items-start gap-2.5 mb-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'hsl(174,60%,94%)' }}>
              <ChkIco />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#111827]">{t}</p>
              <p className="text-[11px] text-[#6b7280] leading-relaxed">{d}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Packages preview */}
      <div className="rounded-xl border border-[#e8ecf0] bg-white p-5">
        <p className="text-[14px] font-semibold text-[#111827] mb-3">Available Packages</p>
        {[['Thyroid Management', '1 / 3 / 6 months'], ['Diabetes Care', '1 / 3 / 6 months'], ['Weight Loss', '1 / 3 / 6 months']].map(([n, d]) => (
          <div key={n} className="flex items-center justify-between py-2 border-b border-[#f0f2f4] last:border-0">
            <p className="text-[12px] font-medium text-[#374151]">{n}</p>
            <span className="text-[11px] text-[#9ca3af]">{d}</span>
          </div>
        ))}
      </div>

      {/* Need help */}
      <div className="rounded-xl border border-[#e8ecf0] bg-white p-5">
        <p className="text-[13px] font-semibold text-[#111827] mb-1">Need Assistance?</p>
        <p className="text-[12px] text-[#6b7280] leading-relaxed mb-3">Our support team is ready to help you complete registration.</p>
        <button className="text-[12px] font-semibold hover:underline" style={{ color: T }}>Contact Support →</button>
      </div>
    </>
  )
}

export default function PatientRegisterPage() {
  const nav = useNavigate()
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FD>({
    resolver: zodResolver(schema), defaultValues: { defencePersonnel: false },
  })
  const onSubmit = async (_d: FD) => { await new Promise(r => setTimeout(r, 600)) }

  return (
    <FormPageShell
      stepBar={<StepBar />}
      heading="Personal Details"
      subheading="Basic identification and contact information."
      sidebar={<PatientSidebar />}
      footer={
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => nav(-1)}
            className="h-11 px-6 border border-[#e5e7eb] text-[13px] text-[#6b7280] rounded-xl hover:bg-[#f9fafb] transition-colors whitespace-nowrap">
            Save as Draft
          </button>
          <button form="pt-form" type="submit" disabled={isSubmitting}
            className="flex-1 h-11 text-white text-[14px] font-semibold rounded-xl transition-colors disabled:opacity-60"
            style={{ background: T }}>
            {isSubmitting ? 'Saving…' : 'Complete Registration'}
          </button>
        </div>
      }
    >
      <form id="pt-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Personal Details */}
        <div>
          <SectionHeader icon={<UIcon />} title="Personal Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField id="name" label="Full Name" placeholder="eg. John Doe" error={errors.name?.message} {...register('name')} />
            <FormField id="email" label="Email" type="email" placeholder="john@example.com" error={errors.email?.message} {...register('email')} />
            <FormField id="password" label="Password" type="password" placeholder="Min 6 characters" error={errors.password?.message} {...register('password')} />
            <Controller name="gender" control={control} render={({ field }) => (
              <SelectField id="gender" label="Gender" options={GENDERS} value={field.value} onChange={field.onChange} placeholder="Select gender" error={errors.gender?.message} />
            )} />
            <div className="sm:col-span-2">
              <FormField id="area" label="Area, Location" placeholder="eg. Downtown, New York" error={errors.area?.message} {...register('area')} />
            </div>
            <FormField id="phone" label="Phone Number" type="tel" placeholder="+91 000-000-0000" error={errors.phone?.message} {...register('phone')} />
            <FormField id="whatsappNo" label="WhatsApp No." type="tel" placeholder="+91 000-000-0000" error={errors.whatsappNo?.message} {...register('whatsappNo')} />
          </div>
        </div>

        {/* Biometric Data */}
        <div>
          <SectionHeader icon={<AIcon />} title="Biometric Data" />
          <p className="text-[12px] text-[#6b7280] -mt-2 mb-4">Health statistics for accurate diet planning.</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'age', label: 'Age', unit: 'Yrs', reg: register('age'), err: errors.age?.message },
              { id: 'height', label: 'Height', unit: 'Cm', reg: register('height'), err: errors.height?.message },
              { id: 'weight', label: 'Weight', unit: 'Kg', reg: register('weight'), err: errors.weight?.message },
            ].map(({ id, label, unit, reg, err }) => (
              <div key={id} className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide">{label}</label>
                <div className="flex gap-1.5">
                  <input type="number" placeholder="0" {...reg}
                    className="flex-1 min-w-0 h-10 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 text-[13px] text-[#111827] outline-none focus:border-[hsl(174,68%,36%)] focus:ring-2 focus:ring-[hsl(174,68%,36%)]/15 transition-all" />
                  <div className="h-10 w-10 flex items-center justify-center bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-[11px] text-[#9ca3af] shrink-0">{unit}</div>
                </div>
                {err && <p className="text-[11px] text-red-500">{err}</p>}
              </div>
            ))}
          </div>
          <div className="mt-4 max-w-[200px]">
            <Controller name="bloodGroup" control={control} render={({ field }) => (
              <SelectField id="bloodGroup" label="Blood Group" options={BLOOD_GROUPS.map(b => ({ value: b, label: b }))} value={field.value} onChange={field.onChange} placeholder="Select" error={errors.bloodGroup?.message} />
            )} />
          </div>
        </div>

        {/* Professional & Affiliations */}
        <div>
          <SectionHeader icon={<LIcon />} title="Professional & Affiliations" />
          <p className="text-[12px] text-[#6b7280] -mt-2 mb-4">Additional information for specialised care.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <FormField id="instagramOrLinkedinId" label="Instagram / LinkedIn ID" placeholder="@username" {...register('instagramOrLinkedinId')} />
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide">Defence Personnel</label>
              <Controller name="defencePersonnel" control={control} render={({ field }) => (
                <button type="button" onClick={() => field.onChange(!field.value)}
                  className="relative w-11 h-6 rounded-full transition-colors"
                  style={{ background: field.value ? T : '#e5e7eb' }}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${field.value ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              )} />
            </div>
          </div>
        </div>
      </form>
    </FormPageShell>
  )
}
