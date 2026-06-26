import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormField from '@/components/shared/FormField'
import SelectField from '@/components/shared/SelectField'
import SectionHeader from '@/components/shared/SectionHeader'
import FormPageShell from '@/components/shared/FormPageShell'
import { C } from '@/config/colors'

const UIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>
const GIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
const ChkIco = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.brand} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>

const COURSES = ['B.Sc Nutrition', 'M.Sc Dietetics', 'PG Diploma in Dietetics', 'B.Sc Food Science', 'Other'].map(c => ({ value: c, label: c }))
const ELG = [
  'Must be currently enrolled in a recognised University or Medical College.',
  'Minimum GPA of 3.0 or equivalent in current clinical subjects.',
  'Submission of recommendation letter from HOD/Dean.',
]

const schema = z.object({
  name: z.string().min(2, 'Required'), email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Required'), password: z.string().min(6, 'Min 6 chars'),
  university: z.string().min(2, 'Required'), course: z.string().min(1, 'Required'),
  semester: z.coerce.number().min(1).max(12), year: z.coerce.number().min(2000).max(2030),
})
type FD = z.infer<typeof schema>

function Sidebar() {
  return (
    <>
      {/* Eligibility */}
      <div className="rounded-2xl bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: C.brandLight }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.brand} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <p className="text-[15px] font-bold" style={{ color: C.navy }}>Eligibility Check</p>
        </div>
        <div className="flex flex-col gap-3">
          {ELG.map(pt => (
            <div key={pt} className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0"><ChkIco /></div>
              <p className="text-[13px] leading-relaxed" style={{ color: C.navyMid }}>{pt}</p>
            </div>
          ))}
          <p className="text-[12px] italic mt-1" style={{ color: C.mutedLight }}>
            Eligibility is confirmed by reviewing your academic profile.
          </p>
        </div>
      </div>

      {/* Learning Banner */}
      <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandMid} 100%)` }}>
        <div className="p-6">
          <p className="text-[15px] font-bold text-white mb-2">Professional Learning Environment</p>
          <p className="text-[13px] text-white/80 leading-relaxed">
            Access courses, live classes and receive certificates on completion.
          </p>
        </div>
      </div>

      {/* Need Assistance */}
      <div className="rounded-2xl bg-white p-6">
        <p className="text-[15px] font-bold mb-1.5" style={{ color: C.navy }}>Need Assistance?</p>
        <p className="text-[13px] leading-relaxed mb-3" style={{ color: C.muted }}>
          Our support team is available to help you complete your application.
        </p>
        <button className="text-[13px] font-bold hover:underline" style={{ color: C.brand }}>
          Contact Support →
        </button>
      </div>
    </>
  )
}

export default function InternRegisterPage() {
  const nav = useNavigate()
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FD>({ resolver: zodResolver(schema) as never })
  const onSubmit = async (_d: FD) => { await new Promise(r => setTimeout(r, 600)) }

  return (
    <FormPageShell
      heading="Internship Registration"
      subheading="Start your clinical journey with us. Fill in your academic details to apply for our dietetics training programme."
      sidebar={<Sidebar />}
      footer={
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => nav(-1)}
            className="h-10 px-5 rounded-lg border text-[13px] font-medium transition-colors hover:bg-[#f7fafb]"
            style={{ borderColor: C.divider, color: C.muted }}>
            Save Draft
          </button>
          <button form="int-form" type="submit" disabled={isSubmitting}
            className="h-10 px-8 rounded-lg text-white text-[13px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: C.brand }}>
            {isSubmitting ? 'Submitting…' : 'Complete Registration'}
          </button>
        </div>
      }>
      <form id="int-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {/* Personal Details */}
        <div>
          <SectionHeader icon={<UIcon />} title="Personal Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField id="name" label="Full Name" placeholder="eg. John Doe" error={errors.name?.message} {...register('name')} />
            <FormField id="email" label="Email Address" type="email" placeholder="john@example.com" error={errors.email?.message} {...register('email')} />
            <FormField id="phone" label="Phone Number" type="tel" placeholder="+91 000-000-0000" error={errors.phone?.message} {...register('phone')} />
            <FormField id="password" label="Password" type="password" placeholder="Min 6 characters" error={errors.password?.message} {...register('password')} />
          </div>
        </div>

        {/* Academic Background */}
        <div>
          <SectionHeader icon={<GIcon />} title="Academic Background" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField id="university" label="University / Institute Name" placeholder="Enter your current institution" error={errors.university?.message} {...register('university')} />
            </div>
            <Controller name="course" control={control} render={({ field }) => (
              <SelectField id="course" label="Course Details" options={COURSES} value={field.value} onChange={field.onChange} placeholder="Select Specialisation" error={errors.course?.message} />
            )} />
            <div className="grid grid-cols-2 gap-3">
              <FormField id="semester" label="Semester" type="number" placeholder="1" error={errors.semester?.message} {...register('semester')} />
              <FormField id="year" label="Year" type="number" placeholder="2024" error={errors.year?.message} {...register('year')} />
            </div>
          </div>
        </div>

      </form>
    </FormPageShell>
  )
}
