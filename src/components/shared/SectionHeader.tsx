import type { ReactNode } from 'react'

interface SectionHeaderProps {
  icon: ReactNode
  title: string
}

export default function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-[hsl(174,60%,94%)] flex items-center justify-center text-[hsl(174,68%,36%)] shrink-0">
        {icon}
      </div>
      <span className="text-[13px] font-semibold text-[#111827]">{title}</span>
    </div>
  )
}
