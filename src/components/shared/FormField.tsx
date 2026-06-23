import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { C } from '@/config/colors'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelRight?: ReactNode
  error?: string
  id: string
  icon?: ReactNode
  rightElement?: ReactNode
}

export default function FormField({ label, labelRight, error, id, icon, rightElement, className, ...props }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {(label || labelRight) && (
        <div className="flex items-center justify-between mb-0.5">
          {label && <label htmlFor={id} className="text-[13px] font-medium" style={{ color: C.body }}>{label}</label>}
          {labelRight}
        </div>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 pointer-events-none flex items-center" style={{ color: C.muted }}>{icon}</span>
        )}
        <input
          id={id}
          className={cn(
            'w-full h-10 rounded-lg border text-[13px] outline-none transition-colors',
            'placeholder:font-normal',
            icon ? 'pl-9 pr-3' : 'px-3',
            rightElement && '!pr-9',
            className,
          )}
          style={{ background: C.inputBg, borderColor: error ? C.errorRed : C.inputBorder, color: C.navy }}
          onFocus={e => { e.currentTarget.style.borderColor = C.brand; e.currentTarget.style.background = C.white }}
          onBlur={e => { e.currentTarget.style.borderColor = error ? C.errorRed : C.inputBorder; e.currentTarget.style.background = C.inputBg }}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3 flex items-center" style={{ color: C.muted }}>{rightElement}</span>
        )}
      </div>
      {error && <p className="text-[11px] mt-0.5" style={{ color: C.errorRed }}>{error}</p>}
    </div>
  )
}
