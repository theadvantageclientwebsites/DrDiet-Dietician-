import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AuthCardProps {
  children: ReactNode
  className?: string
}

/**
 * Responsive auth card shell:
 * - Mobile  (<640px)  : full screen, no card, content fills the screen
 * - Tablet  (640-1024): centered card, bg shows around it
 * - Desktop (>1024px) : centered card with wider max-width, bg shows around it
 */
export default function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className="min-h-screen w-full bg-[#eef1f4] flex flex-col sm:items-center sm:justify-center sm:p-6 lg:p-10">
      <div
        className={cn(
          // Mobile: full screen white, no rounded/shadow
          'w-full bg-white flex flex-col px-5 py-6 min-h-screen',
          // Tablet+: card with shadow, rounded, limited width, min-height auto
          'sm:min-h-0 sm:rounded-2xl sm:shadow-[0_4px_24px_rgba(0,0,0,0.10)] sm:border sm:border-[#e2e6ea] sm:max-w-sm sm:px-8 sm:py-8',
          // Desktop: slightly wider card
          'lg:max-w-md',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
