import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AuthCard from '@/components/shared/AuthCard'
import FormField from '@/components/shared/FormField'
import { ROUTES } from '@/config/routes'

const T = 'hsl(174,68%,36%)'
const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
})
type F = z.infer<typeof schema>

const MailIco = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
const LockIco = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
const EyeIco = ({ on }: { on: boolean }) => on
  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
const GIco = () => <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>

export default function SignInPage() {
  const nav = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) })
  const onSubmit = async (_d: F) => { await new Promise(r => setTimeout(r, 600)) }

  return (
    <AuthCard>
      {/* Logo */}
      <div className="flex flex-col items-center gap-1.5 mb-6">
        <div className="w-11 h-11 rounded-full bg-[hsl(174,60%,94%)] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2.2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span className="text-[13px] font-bold" style={{ color: T }}>DrDietTherapy</span>
        <span className="text-[11px] text-[#9ca3af]">Login</span>
      </div>

      <h2 className="text-[20px] sm:text-[22px] font-bold text-[#111827] mb-1">Welcome Back</h2>
      <p className="text-[13px] text-[#6b7280] mb-6 leading-relaxed">Continue your clinical wellness journey.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField id="email" placeholder="example@email.com" type="email"
          icon={<MailIco />} error={errors.email?.message} {...register('email')} />

        <div className="flex flex-col gap-1.5">
          <FormField id="password" placeholder="Password" type={showPw ? 'text' : 'password'}
            icon={<LockIco />}
            rightElement={
              <button type="button" onClick={() => setShowPw(p => !p)} className="text-[#9ca3af] hover:text-[#6b7280] transition-colors">
                <EyeIco on={showPw} />
              </button>
            }
            error={errors.password?.message} {...register('password')} />
          <div className="flex justify-end">
            <button type="button" onClick={() => nav(ROUTES.FORGOT_PASSWORD)}
              className="text-[12px] font-medium hover:underline" style={{ color: T }}>
              Forgot Password?
            </button>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}
          className="w-full h-11 text-white text-[14px] font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5 mt-1"
          style={{ background: T }}>
          {isSubmitting ? 'Signing in…' : 'Sign in →'}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#f0f2f4]" />
          <span className="text-[11px] text-[#d1d5db]">or</span>
          <div className="flex-1 h-px bg-[#f0f2f4]" />
        </div>

        <button type="button"
          className="w-full h-11 border border-[#e5e7eb] bg-white text-[13px] text-[#374151] font-medium rounded-xl hover:bg-[#f9fafb] transition-colors flex items-center justify-center gap-2.5">
          <GIco /> Continue with Google
        </button>
      </form>

      <p className="text-center text-[12px] text-[#9ca3af] mt-6">
        Don't have an account?{' '}
        <button onClick={() => nav(ROUTES.SIGN_UP)} className="font-semibold hover:underline" style={{ color: T }}>
          Create an Account
        </button>
      </p>
    </AuthCard>
  )
}
