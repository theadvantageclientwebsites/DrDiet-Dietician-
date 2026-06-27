import type { ReactNode } from 'react'

interface PageShellProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}

export default function PageShell({ title, subtitle, action, children }: PageShellProps) {
  return (
    <div className="w-full min-h-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[20px] sm:text-[22px] font-bold text-[#1a3c4d] leading-tight">{title}</h1>
            {subtitle && <p className="text-[13px] text-[#6b8896] mt-1">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
        {children}
      </div>
    </div>
  )
}
