import type { ReactNode } from 'react'
import { C } from '@/config/colors'

export default function SectionHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: C.brandLight }}>
        <span style={{ color: C.brand }}>{icon}</span>
      </div>
      <span className="text-[13px] font-semibold" style={{ color: C.navy }}>{title}</span>
    </div>
  )
}
