import { Outlet } from 'react-router-dom'
import type { UserRole } from '@/types'

interface DashboardLayoutProps {
  role: UserRole
}

// Placeholder — real sidebar/header will be built per role
export default function DashboardLayout({ role }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar placeholder */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-card border-r border-border">
        <div className="p-6 border-b border-border">
          <h1 className="text-lg font-semibold text-primary">DrDietTherapy</h1>
          <p className="text-xs text-muted-foreground capitalize">{role} Portal</p>
        </div>
        {/* Nav items will be rendered by role-specific sidebar components */}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar placeholder */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div />
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
