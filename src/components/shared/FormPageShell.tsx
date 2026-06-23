import type { ReactNode } from 'react'

interface FormPageShellProps {
  children: ReactNode         // left col: the form
  sidebar?: ReactNode         // right col: info panels (desktop only)
  footer: ReactNode
  stepBar?: ReactNode
  heading: string
  subheading: string
}

/**
 * Responsive layout:
 * Mobile / Tablet (<1024px) : single column, full-width, sticky footer
 * Desktop (>=1024px)        : two-column — form left, info sidebar right, NO scroll card
 */
export default function FormPageShell({
  children, sidebar, footer, stepBar, heading, subheading,
}: FormPageShellProps) {
  return (
    <div className="min-h-screen bg-[#eef1f4]">

      {/* ── Desktop layout (lg+): two-column, no card, full page ── */}
      <div className="hidden lg:flex min-h-screen">
        {/* LEFT — form column */}
        <div className="flex-1 flex flex-col bg-white border-r border-[#e8ecf0]">
          {stepBar && (
            <div className="px-10 py-4 border-b border-[#f0f2f4]">{stepBar}</div>
          )}
          <div className="flex-1 overflow-y-auto px-10 py-8">
            <h2 className="text-[22px] font-bold text-[#111827] mb-1">{heading}</h2>
            <p className="text-[13px] text-[#6b7280] mb-8 leading-relaxed">{subheading}</p>
            {children}
          </div>
          {/* Footer pinned to bottom of left col */}
          <div className="px-10 py-5 border-t border-[#f0f2f4] bg-white">{footer}</div>
        </div>

        {/* RIGHT — sidebar info column */}
        {sidebar && (
          <div className="w-[380px] xl:w-[420px] bg-[#f7f9fa] flex flex-col overflow-y-auto px-8 py-10 gap-6">
            {sidebar}
          </div>
        )}
      </div>

      {/* ── Mobile / Tablet layout (<lg): single column card ── */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <div className="flex-1 bg-white">
          {stepBar && (
            <div className="px-5 py-3.5 border-b border-[#f0f2f4]">{stepBar}</div>
          )}
          <div className="px-5 pt-5 pb-4">
            <h2 className="text-[18px] font-bold text-[#111827] mb-0.5">{heading}</h2>
            <p className="text-[12px] text-[#6b7280] leading-relaxed">{subheading}</p>
          </div>
          <div className="px-5 pb-6">{children}</div>
          {/* Sidebar content shown below form on mobile */}
          {sidebar && <div className="px-5 pb-6 flex flex-col gap-4">{sidebar}</div>}
        </div>
        {/* Sticky bottom footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#f0f2f4] px-5 py-4">{footer}</div>
      </div>

    </div>
  )
}
