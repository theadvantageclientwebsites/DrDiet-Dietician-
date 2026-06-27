/**
 * QuickActionCard — three variants: "featured", "icon", "row"
 * All presentation, no logic. Fully accessible + keyboard navigable.
 */

import * as Icons from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import type { QuickAction } from '@/hooks/usePatientDashboard'

type IconName = keyof typeof Icons

function ActionIcon({ name, size = 20, color = '#1a6b7a' }: { name: string; size?: number; color?: string }) {
  const Comp = Icons[name as IconName] as React.ElementType | undefined
  if (!Comp) return null
  return <Comp size={size} strokeWidth={1.8} color={color} />
}

interface Props {
  action:  QuickAction
  onClick: (route: string) => void
}

// ─── Featured ─────────────────────────────────────────────────────────────────
function FeaturedCard({ action, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(action.route)}
      className="
        w-full flex flex-col items-start gap-3 p-5 rounded-2xl text-left
        bg-[#e8f7f9] border border-[#a8d8e2]
        hover:bg-[#d7f0f5] hover:border-[#2d96a4] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(26,107,122,0.13)]
        focus-visible:outline-2 focus-visible:outline-[#1a6b7a]
        transition-all cursor-pointer
      "
      aria-label={action.label}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-[#1a6b7a] flex items-center justify-center shrink-0">
        <ActionIcon name={action.icon} size={22} color="#ffffff" />
      </div>

      {/* Text */}
      <div>
        <p className="text-[15px] font-bold text-[#1a3c4d] leading-snug mb-1">
          {action.label}
        </p>
        {action.description && (
          <p className="text-[12px] text-[#6b8896] leading-relaxed">
            {action.description}
          </p>
        )}
      </div>
    </button>
  )
}

// ─── Icon ─────────────────────────────────────────────────────────────────────
function IconCard({ action, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(action.route)}
      className="
        w-full flex flex-col items-center justify-center gap-2.5 px-3 py-5 rounded-2xl
        bg-white border border-[#e6edf0]
        hover:border-[#a8d8e2] hover:bg-[#f5fcfd] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(26,107,122,0.09)]
        focus-visible:outline-2 focus-visible:outline-[#1a6b7a]
        transition-all cursor-pointer text-center
      "
      aria-label={action.label}
    >
      {/* Icon circle */}
      <div className="w-11 h-11 rounded-xl bg-[#d0ecf2] flex items-center justify-center">
        <ActionIcon name={action.icon} size={20} />
      </div>

      {/* Label */}
      <div>
        <p className="text-[13px] font-semibold text-[#1a3c4d] leading-snug">
          {action.label}
        </p>
        {action.description && (
          <p className="text-[11px] text-[#6b8896] mt-0.5 leading-snug">
            {action.description}
          </p>
        )}
      </div>
    </button>
  )
}

// ─── Row ──────────────────────────────────────────────────────────────────────
function RowCard({ action, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(action.route)}
      className="
        w-full flex items-center gap-3.5 px-4 py-4 rounded-2xl text-left
        bg-white border border-[#e6edf0]
        hover:border-[#a8d8e2] hover:bg-[#f5fcfd] hover:translate-x-0.5 hover:shadow-[0_2px_12px_rgba(26,107,122,0.08)]
        focus-visible:outline-2 focus-visible:outline-[#1a6b7a]
        transition-all cursor-pointer
      "
      aria-label={`${action.label}${action.meta ? `, ${action.meta}` : ''}`}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-[#d0ecf2] flex items-center justify-center shrink-0">
        <ActionIcon name={action.icon} size={18} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#1a3c4d] leading-snug">
          {action.label}
        </p>
        <p className={`text-[11px] mt-0.5 ${action.meta ? 'text-[#1a6b7a] font-medium' : 'text-[#6b8896]'}`}>
          {action.meta ?? action.description}
        </p>
      </div>

      {/* Arrow */}
      <ArrowRight size={15} color="#6b8896" strokeWidth={2} className="shrink-0" />
    </button>
  )
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────
export default function QuickActionCard({ action, onClick }: Props) {
  switch (action.variant) {
    case 'featured': return <FeaturedCard action={action} onClick={onClick} />
    case 'icon':     return <IconCard     action={action} onClick={onClick} />
    case 'row':      return <RowCard      action={action} onClick={onClick} />
    default:         return <IconCard     action={action} onClick={onClick} />
  }
}
