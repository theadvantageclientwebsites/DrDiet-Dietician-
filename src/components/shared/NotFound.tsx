import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-foreground">Page not found</p>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}
