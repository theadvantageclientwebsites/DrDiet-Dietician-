import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#d0ecf2] flex items-center justify-center text-[#1a6b7a]">
        {icon}
      </div>
      <div>
        <p className="text-[15px] font-semibold text-[#1a3c4d] mb-1">{title}</p>
        <p className="text-[13px] text-[#6b8896] max-w-xs">{description}</p>
      </div>
      {action}
    </div>
  )
}
