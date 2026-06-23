import { C } from '@/config/colors'

interface Option { value: string; label: string }
interface Props { label?: string; id: string; options: Option[]; value?: string; onChange?: (v: string) => void; placeholder?: string; error?: string }

export default function SelectField({ label, id, options, value, onChange, placeholder = 'Select', error }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-[13px] font-medium mb-0.5" style={{ color: C.body }}>{label}</label>}
      <div className="relative">
        <select id={id} value={value ?? ''} onChange={e => onChange?.(e.target.value)}
          className="w-full h-10 rounded-lg border px-3 pr-8 text-[13px] outline-none appearance-none cursor-pointer transition-colors"
          style={{ background: C.inputBg, borderColor: error ? C.errorRed : C.inputBorder, color: value ? C.navy : C.muted }}>
          <option value="" disabled>{placeholder}</option>
          {options.map(o => <option key={o.value} value={o.value} style={{ color: C.navy }}>{o.label}</option>)}
        </select>
        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      {error && <p className="text-[11px] mt-0.5" style={{ color: C.errorRed }}>{error}</p>}
    </div>
  )
}
