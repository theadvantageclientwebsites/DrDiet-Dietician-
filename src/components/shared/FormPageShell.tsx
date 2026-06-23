import type { ReactNode } from 'react'
import { C } from '@/config/colors'

interface Props {
  children: ReactNode
  sidebar?: ReactNode
  footer: ReactNode
  stepBar?: ReactNode
  heading: string
  subheading: string
}

export default function FormPageShell({ children, sidebar, footer, stepBar, heading, subheading }: Props) {
  return (
    <div className="min-h-screen" style={{ background: C.pageBg }}>

      {/* ── DESKTOP (lg+): two-column full-height layout ── */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left — form */}
        <div className="flex-1 flex flex-col bg-white" style={{ borderRight: `1px solid ${C.divider}` }}>
          {stepBar && (
            <div className="px-12 py-4" style={{ borderBottom: `1px solid ${C.divider}` }}>
              {stepBar}
            </div>
          )}
          <div className="flex-1 overflow-y-auto px-12 py-8">
            <h2 className="text-[20px] font-bold mb-1" style={{ color: C.navy }}>{heading}</h2>
            <p className="text-[13px] mb-7" style={{ color: C.muted }}>{subheading}</p>
            {children}
          </div>
          <div className="px-12 py-4 bg-white" style={{ borderTop: `1px solid ${C.divider}` }}>
            {footer}
          </div>
        </div>

        {/* Right — sidebar */}
        {sidebar && (
          <div className="w-[340px] xl:w-[380px] flex flex-col overflow-y-auto px-7 py-8 gap-4"
            style={{ background: C.pageBg }}>
            {sidebar}
          </div>
        )}
      </div>

      {/* ── MOBILE / TABLET (<lg) ── */}
      <div className="lg:hidden flex flex-col min-h-screen bg-white">
        {stepBar && (
          <div className="px-5 py-3" style={{ borderBottom: `1px solid ${C.divider}` }}>
            {stepBar}
          </div>
        )}
        <div className="px-5 pt-6 pb-2">
          <h2 className="text-[18px] font-bold mb-0.5" style={{ color: C.navy }}>{heading}</h2>
          <p className="text-[12px]" style={{ color: C.muted }}>{subheading}</p>
        </div>
        <div className="flex-1 px-5 pt-5 pb-4">{children}</div>
        {sidebar && (
          <div className="px-5 pb-5 flex flex-col gap-3" style={{ background: C.pageBg }}>
            {sidebar}
          </div>
        )}
        <div className="sticky bottom-0 bg-white px-5 py-3" style={{ borderTop: `1px solid ${C.divider}` }}>
          {footer}
        </div>
      </div>
    </div>
  )
}
