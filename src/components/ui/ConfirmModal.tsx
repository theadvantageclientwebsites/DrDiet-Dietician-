/**
 * ConfirmModal — reusable confirmation dialog
 * Variants: danger | warning | success | info
 */

import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'

export type ModalVariant = 'danger' | 'warning' | 'success' | 'info'

// ─── Icons (functions, not inline JSX in object literals) ────────────────────
function IconDanger() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}

function IconWarning() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

function IconSuccess() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  )
}

function IconInfo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: 'cm-spin 0.65s linear infinite', flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
      <path d="M12 2a10 10 0 0 1 10 10"/>
    </svg>
  )
}

// ─── Variant palette ──────────────────────────────────────────────────────────
interface VariantConfig {
  ring:     string
  iconBg:   string
  iconColor:string
  btnBg:    string
  btnHover: string
  Icon:     () => React.ReactElement
}

const VARIANTS: Record<ModalVariant, VariantConfig> = {
  danger: {
    ring:      '#fca5a5',
    iconBg:    '#fef2f2',
    iconColor: '#dc2626',
    btnBg:     '#dc2626',
    btnHover:  '#b91c1c',
    Icon:      IconDanger,
  },
  warning: {
    ring:      '#fcd34d',
    iconBg:    '#fffbeb',
    iconColor: '#d97706',
    btnBg:     '#d97706',
    btnHover:  '#b45309',
    Icon:      IconWarning,
  },
  success: {
    ring:      '#86efac',
    iconBg:    '#f0fdf4',
    iconColor: '#16a34a',
    btnBg:     '#16a34a',
    btnHover:  '#15803d',
    Icon:      IconSuccess,
  },
  info: {
    ring:      '#7dd3fc',
    iconBg:    '#eff6ff',
    iconColor: '#2563eb',
    btnBg:     COLORS.brand,
    btnHover:  '#155f6d',
    Icon:      IconInfo,
  },
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface ConfirmModalProps {
  open:          boolean
  onClose:       () => void
  onConfirm:     () => void
  variant?:      ModalVariant
  title:         string
  description:   string
  confirmLabel?: string
  cancelLabel?:  string
  /** Pass mutation isPending — modal stays open and shows spinner while true */
  loading?:      boolean
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  variant      = 'info',
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  loading      = false,
}: ConfirmModalProps) {
  const v = VARIANTS[variant]
  const { Icon } = v

  return (
    <>
      <style>{`
        @keyframes cm-backdrop { from { opacity:0 } to { opacity:1 } }
        @keyframes cm-enter    {
          from { opacity:0; transform:translate(-50%,-48%) scale(0.96) }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1) }
        }
        @keyframes cm-spin { to { transform:rotate(360deg) } }
      `}</style>

      <Dialog.Root
        open={open}
        onOpenChange={(o) => { if (!o && !loading) onClose() }}
      >
        <Dialog.Portal>

          {/* Backdrop */}
          <Dialog.Overlay style={{
            position:           'fixed',
            inset:              0,
            zIndex:             9998,
            background:         'rgba(8,24,32,0.6)',
            backdropFilter:     'blur(4px)',
            WebkitBackdropFilter:'blur(4px)',
            animation:          'cm-backdrop 0.2s ease',
          }} />

          {/* Panel */}
          <Dialog.Content
            aria-describedby="cm-desc"
            style={{
              position:     'fixed',
              top:          '50%',
              left:         '50%',
              transform:    'translate(-50%, -50%)',
              zIndex:       9999,
              width:        'calc(100vw - 32px)',
              maxWidth:     '400px',
              background:   '#ffffff',
              borderRadius: '20px',
              boxShadow:    '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
              outline:      'none',
              overflow:     'hidden',
              animation:    'cm-enter 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* Colored top stripe */}
            <div style={{ height: '4px', background: v.btnBg, width: '100%' }} />

            {/* Body */}
            <div style={{ padding: '28px 28px 24px' }}>

              {/* Icon + text row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>

                {/* Icon bubble */}
                <div style={{
                  width:          '48px',
                  height:         '48px',
                  minWidth:       '48px',
                  borderRadius:   '50%',
                  background:     v.iconBg,
                  border:         `1.5px solid ${v.ring}`,
                  color:          v.iconColor,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  marginTop:      '1px',
                }}>
                  <Icon />
                </div>

                {/* Title + description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Dialog.Title style={{
                    fontSize:     FONT_SIZE.md,
                    fontWeight:   FONT_WEIGHT.bold,
                    color:        COLORS.navy,
                    lineHeight:   1.3,
                    marginBottom: '6px',
                  }}>
                    {title}
                  </Dialog.Title>
                  <Dialog.Description
                    id="cm-desc"
                    style={{
                      fontSize:   FONT_SIZE.sm,
                      color:      COLORS.muted,
                      lineHeight: 1.6,
                      margin:     0,
                    }}
                  >
                    {description}
                  </Dialog.Description>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: COLORS.divider, margin: '20px 0' }} />

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>

                {/* Cancel */}
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  style={{
                    height:      '40px',
                    padding:     '0 20px',
                    borderRadius:'10px',
                    border:      `1.5px solid ${COLORS.divider}`,
                    background:  'transparent',
                    color:       loading ? COLORS.muted : COLORS.body,
                    fontSize:    FONT_SIZE.sm,
                    fontWeight:  FONT_WEIGHT.medium,
                    cursor:      loading ? 'not-allowed' : 'pointer',
                    opacity:     loading ? 0.45 : 1,
                    transition:  'all 0.15s',
                    fontFamily:  'inherit',
                    whiteSpace:  'nowrap',
                  }}
                >
                  {cancelLabel}
                </button>

                {/* Confirm */}
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  style={{
                    height:         '40px',
                    padding:        '0 22px',
                    borderRadius:   '10px',
                    border:         'none',
                    background:     v.btnBg,
                    color:          '#fff',
                    fontSize:       FONT_SIZE.sm,
                    fontWeight:     FONT_WEIGHT.semibold,
                    cursor:         loading ? 'not-allowed' : 'pointer',
                    display:        'flex',
                    alignItems:     'center',
                    gap:            '8px',
                    transition:     'background 0.15s',
                    fontFamily:     'inherit',
                    whiteSpace:     'nowrap',
                    minWidth:       '130px',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = v.btnHover }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = v.btnBg }}
                >
                  {loading ? (
                    <>
                      <Spinner />
                      <span>Please wait…</span>
                    </>
                  ) : confirmLabel}
                </button>

              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
