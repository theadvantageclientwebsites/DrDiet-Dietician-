/**
 * AdminBtn — consistent primary / secondary / danger buttons for admin pages
 */
import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'

interface AdminBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?:    'sm' | 'md'
  icon?:    ReactNode
  loading?: boolean
  children: ReactNode
}

const STYLES = {
  primary:   { bg: COLORS.brand,    text: '#fff',          border: 'none',                    hover: '#155f6d' },
  secondary: { bg: COLORS.white,    text: COLORS.body,     border: `1px solid ${COLORS.divider}`, hover: '#f7fafb' },
  danger:    { bg: '#dc2626',       text: '#fff',          border: 'none',                    hover: '#b91c1c' },
  ghost:     { bg: 'transparent',   text: COLORS.brand,    border: 'none',                    hover: COLORS.brandLight },
}

export default function AdminBtn({
  variant = 'primary', size = 'md', icon, loading, children, style, ...rest
}: AdminBtnProps) {
  const s = STYLES[variant]
  const pad = size === 'sm' ? '7px 14px' : '9px 18px'
  const fz  = size === 'sm' ? FONT_SIZE.xs : FONT_SIZE.sm

  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        gap:            '6px',
        padding:        pad,
        borderRadius:   '10px',
        border:         s.border,
        background:     s.bg,
        color:          s.text,
        fontSize:       fz,
        fontWeight:     FONT_WEIGHT.semibold,
        cursor:         (rest.disabled || loading) ? 'not-allowed' : 'pointer',
        opacity:        (rest.disabled || loading) ? 0.55 : 1,
        whiteSpace:     'nowrap',
        transition:     'background 0.15s, opacity 0.15s',
        fontFamily:     'inherit',
        ...style,
      }}
      onMouseEnter={e => {
        if (!rest.disabled && !loading) (e.currentTarget as HTMLButtonElement).style.background = s.hover
      }}
      onMouseLeave={e => {
        if (!rest.disabled && !loading) (e.currentTarget as HTMLButtonElement).style.background = s.bg
      }}
    >
      {loading
        ? <span style={{ width:14, height:14, border:'2px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'btn-spin 0.6s linear infinite' }} />
        : icon}
      <span>{children}</span>
      <style>{`@keyframes btn-spin{to{transform:rotate(360deg)}}`}</style>
    </button>
  )
}
