import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

export default function SignUpPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
          <p className="text-muted-foreground text-sm mt-1">Who are you joining as?</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate(ROUTES.SIGN_UP_PATIENT)}
            className="flex flex-col items-center gap-3 p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
          >
            <span className="text-3xl">🏥</span>
            <span className="font-semibold text-foreground">Patient</span>
            <span className="text-xs text-muted-foreground text-center">
              Book appointments &amp; get diet plans
            </span>
          </button>

          <button
            onClick={() => navigate(ROUTES.SIGN_UP_INTERN)}
            className="flex flex-col items-center gap-3 p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
          >
            <span className="text-3xl">🎓</span>
            <span className="font-semibold text-foreground">Intern</span>
            <span className="text-xs text-muted-foreground text-center">
              Learn &amp; get certified in nutrition
            </span>
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            onClick={() => navigate(ROUTES.SIGN_IN)}
            className="text-primary font-medium hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}
