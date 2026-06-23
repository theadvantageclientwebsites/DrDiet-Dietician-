import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  id: string
  icon?: ReactNode
  rightElement?: ReactNode
}

export default function FormField({
  label, error, id, icon, rightElement, className, ...props
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-[#9ca3af] pointer-events-none flex items-center">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={cn(
            'w-full h-10 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 text-[13px] text-[#111827]',
            'placeholder:text-[#c4c9d4] outline-none',
            'focus:border-[hsl(174,68%,36%)] focus:bg-white focus:ring-2 focus:ring-[hsl(174,68%,36%)]/15',
            'transition-all duration-150',
            icon && 'pl-9',
            rightElement && 'pr-9',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-200',
            className,
          )}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3 text-[#9ca3af] flex items-center">
            {rightElement}
          </span>
        )}
      </div>
      {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}
