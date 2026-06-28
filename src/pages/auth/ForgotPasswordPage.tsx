import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import AuthCard from '@/components/shared/AuthCard'
import FormField from '@/components/shared/FormField'
import { ROUTES } from '@/config/routes'
import { authService } from '@/services/api/auth.service'

const schema = z.object({ email: z.string().email('Enter a valid email') })
type FormData = z.infer<typeof schema>

const BackIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
const MailIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>

export default function ForgotPasswordPage() {
  const nav = useNavigate()
  const { mutate: sendReset, isPending, isSuccess } = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  })
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const onSubmit = ({ email }: FormData) => sendReset(email)

  return (
    <AuthCard>
      <button onClick={() => nav(ROUTES.SIGN_IN)}
        className="flex items-center gap-1 text-[11px] text-[#6b7280] hover:text-[#374151] transition-colors mb-4 -ml-1">
        <BackIcon /> Back to Sign In
      </button>

      <div className="flex flex-col items-center text-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full bg-[hsl(174,60%,94%)] flex items-center justify-center text-[hsl(174,68%,36%)]">
          <MailIcon />
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-[#111827]">Reset Password</h2>
          <p className="text-[11px] text-[#6b7280] mt-1 leading-relaxed max-w-[240px]">
            Enter your registered email and we'll send you a reset link.
          </p>
        </div>
      </div>

      {isSuccess ? (
        <div className="rounded-xl bg-[hsl(174,60%,94%)] border border-[hsl(174,68%,80%)] p-4 text-center">
          <p className="text-[13px] font-semibold text-[hsl(174,68%,36%)]">Check your inbox ✓</p>
          <p className="text-[11px] text-[#6b7280] mt-1">Reset link sent to your email address.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField id="email" label="Email Address" type="email" placeholder="you@email.com"
            icon={<MailIcon />} error={errors.email?.message} {...register('email')} />
          <button type="submit" disabled={isPending}
            className="w-full h-10 bg-[hsl(174,68%,36%)] text-white text-[13px] font-semibold rounded-lg hover:bg-[hsl(174,68%,30%)] disabled:opacity-60 transition-colors">
            {isPending ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </AuthCard>
  )
}
