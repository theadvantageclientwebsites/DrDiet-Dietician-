import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { C } from '@/config/colors'

export default function AuthCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen w-full flex flex-col sm:items-center sm:justify-center sm:px-4 sm:py-8"
      style={{ background: C.pageBg }}>
      <div className={cn(
        'w-full bg-white flex flex-col px-5 py-7 min-h-screen',
        'sm:min-h-0 sm:rounded-xl sm:border sm:shadow-sm sm:max-w-[400px] sm:px-8 sm:py-8',
        className,
      )}
        style={{ borderColor: C.divider }}>
        {children}
      </div>
    </div>
  )
}
