import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormField from '@/components/shared/FormField'
import SelectField from '@/components/shared/SelectField'
import SectionHeader from '@/components/shared/SectionHeader'
import FormPageShell from '@/components/shared/FormPageShell'
import { ROUTES } from '@/config/routes'

const T = 'hsl(174,68%,36%)'
const UIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>
const GIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
const ChkIco = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>

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

// ── Sidebar: shown right on desktop, below form on mobile ──
function InternSidebar() {
  return (
    <>
      {/* Eligibility Check */}
      <div className="rounded-xl border border-[#e8ecf0] bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'hsl(174,60%,94%)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <p className="text-[13px] font-semibold text-[#111827]">Eligibility Check</p>
        </div>
        <div className="flex flex-col gap-2.5">
          {ELG.map(pt => (
            <div key={pt} className="flex items-start gap-2 text-[12px] text-[#6b7280] leading-relaxed">
              <span className="shrink-0 mt-0.5"><ChkIco /></span>{pt}
            </div>
          ))}
          <p className="text-[11px] text-[#9ca3af] mt-1 italic">Eligibility is confirmed by reviewing your academic profile.</p>
        </div>
      </div>

      {/* Professional Learning Banner */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(174,68%,28%) 0%, hsl(190,58%,40%) 100%)' }}>
        <div className="p-5 text-white">
          <p className="text-[14px] font-semibold mb-1.5">Professional Learning Environment</p>
          <p className="text-[12px] opacity-80 leading-relaxed">Access courses, live classes and receive certificates on completion.</p>
        </div>
      </div>

      {/* Need Assistance */}
      <div className="rounded-xl border border-[#e8ecf0] bg-white p-5">
        <p className="text-[13px] font-semibold text-[#111827] mb-1.5">Need Assistance?</p>
        <p className="text-[12px] text-[#6b7280] leading-relaxed mb-3">Our support team is available to help you complete your application.</p>
        <button className="text-[13px] font-semibold hover:underline" style={{ color: T }}>Contact Support →</button>
      </div>
    </>
  )
}

export default function InternRegisterPage() {
  const nav = useNavigate()
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FD>({ resolver: zodResolver(schema) })
  const onSubmit = async (_d: FD) => { await new Promise(r => setTimeout(r, 600)) }

  return (
    <FormPageShell
      heading="Internship Registration"
      subheading="Start your clinical journey with us. Fill in your academic details to apply for our dietetics training programme."
      sidebar={<InternSidebar />}
      footer={
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => nav(-1)}
            className="h-11 px-6 border border-[#e5e7eb] text-[13px] text-[#6b7280] rounded-xl hover:bg-[#f9fafb] transition-colors whitespace-nowrap">
            Save Draft
          </button>
          <button form="int-form" type="submit" disabled={isSubmitting}
            className="flex-1 h-11 text-white text-[14px] font-semibold rounded-xl transition-colors disabled:opacity-60"
            style={{ background: T }}>
            {isSubmitting ? 'Submitting…' : 'Complete Registration'}
          </button>
        </div>
      }
    >
      <form id="int-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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

        {/* On mobile/tablet only — show eligibility inline (hidden on desktop since it's in sidebar) */}
        <div className="lg:hidden">
          <InternSidebar />
        </div>
      </form>
    </FormPageShell>
  )
}
