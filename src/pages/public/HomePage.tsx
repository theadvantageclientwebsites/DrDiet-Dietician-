import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { APP_NAME, APP_TAGLINE } from '@/config/constants'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-primary">{APP_NAME}</span>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(ROUTES.SIGN_IN)}
            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate(ROUTES.SIGN_UP)}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6 gap-6">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          {APP_NAME}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
          {APP_TAGLINE}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(ROUTES.SIGN_UP)}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate(ROUTES.SIGN_IN)}
            className="px-8 py-3 border border-border rounded-lg text-lg hover:bg-accent transition-colors"
          >
            Sign In
          </button>
        </div>
      </section>
    </div>
  )
}
