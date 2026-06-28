import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { cn } from '@/lib/utils'

// ─── Variants ─────────────────────────────────────────────────────────────────
type ToastVariant = 'default' | 'success' | 'error' | 'warning'

const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-white border-[#e5e7eb] text-[#111827]',
  success: 'bg-white border-[hsl(174,68%,60%)] text-[#111827]',
  error:   'bg-white border-red-400 text-[#111827]',
  warning: 'bg-white border-amber-400 text-[#111827]',
}

const variantIconColor: Record<ToastVariant, string> = {
  default: '#6b7280',
  success: 'hsl(174,68%,36%)',
  error:   '#ef4444',
  warning: '#f59e0b',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const CheckIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
  </svg>
)
const ErrorIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)
const WarnIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const color = variantIconColor[variant]
  if (variant === 'success') return <CheckIcon color={color} />
  if (variant === 'error')   return <ErrorIcon color={color} />
  if (variant === 'warning') return <WarnIcon color={color} />
  return null
}

// ─── Internal toast state ─────────────────────────────────────────────────────
export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

type ToastContextValue = {
  toast: (item: Omit<ToastItem, 'id'>) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const toast = React.useCallback((item: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, ...item }])
  }, [])

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right" duration={4000}>
        {children}

        {toasts.map((t) => {
          const variant: ToastVariant = t.variant ?? 'default'
          return (
            <ToastPrimitive.Root
              key={t.id}
              onOpenChange={(open) => { if (!open) dismiss(t.id) }}
              className={cn(
                'group pointer-events-auto relative flex items-start gap-3 w-full max-w-[360px] rounded-xl border shadow-lg px-4 py-3.5',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[swipe=end]:animate-out data-[state=closed]:fade-out-80',
                'data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-right-full',
                variantStyles[variant],
              )}
            >
              {/* Icon */}
              <div className="mt-0.5 shrink-0">
                <ToastIcon variant={variant} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <ToastPrimitive.Title className="text-[13px] font-semibold leading-snug">
                  {t.title}
                </ToastPrimitive.Title>
                {t.description && (
                  <ToastPrimitive.Description className="text-[12px] text-[#6b7280] mt-0.5 leading-relaxed">
                    {t.description}
                  </ToastPrimitive.Description>
                )}
              </div>

              {/* Close */}
              <ToastPrimitive.Close
                className="shrink-0 rounded p-0.5 text-[#9ca3af] hover:text-[#374151] transition-colors mt-0.5"
                aria-label="Close"
              >
                <CloseIcon />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          )
        })}

        <ToastPrimitive.Viewport
          className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)] outline-none"
        />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
