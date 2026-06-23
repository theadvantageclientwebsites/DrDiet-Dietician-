import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option { value: string; label: string }

interface SelectFieldProps {
  label?: string
  id: string
  options: Option[]
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
  error?: string
  className?: string
}

export default function SelectField({
  label, id, options, value, onChange, placeholder = 'Select', error, className,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            'w-full h-10 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 pr-8 text-[13px] text-[#111827]',
            'outline-none appearance-none cursor-pointer',
            'focus:border-[hsl(174,68%,36%)] focus:bg-white focus:ring-2 focus:ring-[hsl(174,68%,36%)]/15',
            'transition-all duration-150',
            !value && 'text-[#c4c9d4]',
            error && 'border-red-400',
            className,
          )}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9ca3af] pointer-events-none" />
      </div>
      {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}
