import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export default function PrimaryButton({
  children,
  variant = 'solid',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: PrimaryButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all focus-visible:outline-2 focus-visible:outline-[#1a6b7a] disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    solid:   'bg-[#1a6b7a] text-white hover:bg-[#155f6d] active:scale-[0.98]',
    outline: 'border-2 border-[#1a6b7a] text-[#1a6b7a] hover:bg-[#e8f7f9] active:scale-[0.98]',
    ghost:   'text-[#1a6b7a] hover:bg-[#e8f7f9] active:scale-[0.98]',
  }

  const sizes = {
    sm: 'h-8 px-3 text-[12px]',
    md: 'h-10 px-5 text-[13px]',
    lg: 'h-11 px-6 text-[14px]',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      {children}
    </button>
  )
}
