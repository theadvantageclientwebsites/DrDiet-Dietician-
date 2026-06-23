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
import { C } from '@/config/colors'

const UIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>
const AIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
const LIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
const ChkIco = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.brand} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>

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
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
            style={i === 0 ? { background: C.brand, color: '#fff' } : { background: C.divider, color: C.mutedLight }}>
            {i + 1}
          </div>
          <span className="text-[13px] font-semibold"
            style={i === 0 ? { color: C.brand } : { color: C.mutedLight }}>{s}</span>
          {i < STEPS.length - 1 && <div className="w-8 h-px mx-1" style={{ background: C.divider }} />}
        </div>
      ))}
    </div>
  )
}

function Sidebar() {
  return (
    <>
      <div className="rounded-2xl bg-white p-6" style={{ borderColor: C.brandBorder }}>
        <p className="text-[15px] font-bold mb-4" style={{ color: C.navy }}>Why Join DrDietTherapy?</p>
        {[
          ['Personalized Diet Plans', 'Customized plans based on your health profile.'],
          ['Blood Report Analysis', 'Doctor reviews your reports and responds.'],
          ['Video Consultations', 'Book 1-on-1 sessions at your preferred slot.'],
          ['Progress Tracking', 'Track health metrics and diet progress over time.'],
        ].map(([t, d]) => (
          <div key={t} className="flex items-start gap-3 mb-4 last:mb-0">
            <div className="mt-0.5 shrink-0"><ChkIco /></div>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: C.navy }}>{t}</p>
              <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: C.muted }}>{d}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white p-6">
        <p className="text-[15px] font-bold mb-3" style={{ color: C.navy }}>Available Packages</p>
        {[['Thyroid Management', '1/3/6 months'], ['Diabetes Care', '1/3/6 months'], ['Weight Loss', '1/3/6 months']].map(([n, d]) => (
          <div key={n} className="flex justify-between items-center py-2.5" style={{ borderBottom: `1px solid ${C.divider}` }}>
            <span className="text-[13px] font-medium" style={{ color: C.navy }}>{n}</span>
            <span className="text-[12px]" style={{ color: C.muted }}>{d}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white p-6">
        <p className="text-[14px] font-bold mb-1.5" style={{ color: C.navy }}>Need Assistance?</p>
        <p className="text-[12px] leading-relaxed mb-3" style={{ color: C.muted }}>Support team is available to help.</p>
        <button className="text-[13px] font-semibold hover:underline" style={{ color: C.brand }}>Contact Support →</button>
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
    <FormPageShell stepBar={<StepBar />} heading="Personal Details"
      subheading="Basic identification and contact information." sidebar={<Sidebar />}
      footer={
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => nav(-1)}
            className="h-10 px-5 rounded-lg border text-[13px] font-medium transition-colors hover:bg-[#f7fafb]"
            style={{ borderColor: C.divider, color: C.muted }}>
            Save Draft
          </button>
          <button form="pt-form" type="submit" disabled={isSubmitting}
            className="h-10 px-8 rounded-lg text-white text-[13px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: C.brand }}>
            {isSubmitting ? 'Saving…' : 'Complete Registration'}
          </button>
        </div>
      }>
      <form id="pt-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div>
          <SectionHeader icon={<UIcon />} title="Personal Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField id="name" label="Full Name" placeholder="eg. John Doe" error={errors.name?.message} {...register('name')} />
            <FormField id="email" label="Email Address" type="email" placeholder="john@example.com" error={errors.email?.message} {...register('email')} />
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

        <div>
          <SectionHeader icon={<AIcon />} title="Biometric Data" />
          <p className="text-[13px] mb-4 -mt-2 leading-relaxed" style={{ color: C.muted }}>Health statistics for accurate diet planning.</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { id: 'age', label: 'Age', unit: 'Yrs', reg: register('age'), err: errors.age?.message },
              { id: 'height', label: 'Height', unit: 'Cm', reg: register('height'), err: errors.height?.message },
              { id: 'weight', label: 'Weight', unit: 'Kg', reg: register('weight'), err: errors.weight?.message },
            ].map(({ id, label, unit, reg, err }) => (
              <div key={id} className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold" style={{ color: C.navy }}>{label}</label>
                <div className="flex gap-1.5">
                  <input type="number" placeholder="0" {...reg}
                    className="flex-1 min-w-0 h-[52px] rounded-xl border px-3 text-[14px] outline-none transition-all"
                    style={{ background: C.inputBg, borderColor: C.inputBorder, color: C.navy }} />
                  <div className="h-[52px] w-12 flex items-center justify-center rounded-xl border text-[12px] font-medium shrink-0"
                    style={{ background: C.inputBg, borderColor: C.inputBorder, color: C.mutedLight }}>{unit}</div>
                </div>
                {err && <p className="text-[12px]" style={{ color: C.errorRed }}>{err}</p>}
              </div>
            ))}
          </div>
          <div className="max-w-[200px]">
            <Controller name="bloodGroup" control={control} render={({ field }) => (
              <SelectField id="bloodGroup" label="Blood Group" options={BLOOD_GROUPS.map(b => ({ value: b, label: b }))} value={field.value} onChange={field.onChange} placeholder="Select" error={errors.bloodGroup?.message} />
            )} />
          </div>
        </div>

        <div>
          <SectionHeader icon={<LIcon />} title="Professional & Affiliations" />
          <p className="text-[13px] mb-4 -mt-2 leading-relaxed" style={{ color: C.muted }}>Additional information for specialised care.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <FormField id="instagramOrLinkedinId" label="Instagram / LinkedIn ID" placeholder="@username" {...register('instagramOrLinkedinId')} />
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold" style={{ color: C.navy }}>Defence Personnel</label>
              <Controller name="defencePersonnel" control={control} render={({ field }) => (
                <button type="button" onClick={() => field.onChange(!field.value)}
                  className="relative w-12 h-6 rounded-full transition-colors self-start"
                  style={{ background: field.value ? C.brand : C.divider }}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${field.value ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              )} />
            </div>
          </div>
        </div>
      </form>
    </FormPageShell>
  )
}
