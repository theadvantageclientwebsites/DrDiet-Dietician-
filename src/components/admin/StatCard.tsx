/**
 * StatCard — KPI metric card with icon, value, trend, and optional link
 */
import type { ReactNode } from 'react'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  icon:        ReactNode
  label:       string
  value:       string | number
  trend?:      { value: number; label: string; up: boolean }
  accentColor?: string
  linkLabel?:  string
  onLink?:     () => void
  dark?:       boolean   // dark teal variant (like the "Total Active Patients" card)
}

export default function StatCard({
  icon, label, value, trend, accentColor, linkLabel, onLink, dark = false,
}: StatCardProps) {
  const accent = accentColor ?? COLORS.brand

  if (dark) {
    return (
      <div style={{
        background:   `linear-gradient(135deg, ${COLORS.sidebarBg} 0%, #1a5566 100%)`,
        borderRadius: '16px',
        padding:      '20px',
        boxShadow:    SHADOW.card,
        display:      'flex',
        flexDirection:'column',
        gap:          '8px',
        position:     'relative',
        overflow:     'hidden',
      }}>
        {/* bg watermark icon */}
        <div style={{
          position: 'absolute', right: '-8px', bottom: '-10px',
          opacity: 0.08, color: '#fff',
          display: 'flex',
        }}>
          <span style={{ fontSize: '80px', lineHeight: 1 }}>{icon}</span>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: FONT_SIZE.sm, margin: 0 }}>{label}</p>
        <p style={{ color: '#fff', fontSize: '2rem', fontWeight: FONT_WEIGHT.bold, lineHeight: 1, margin: 0 }}>{value}</p>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {trend.up
              ? <TrendingUp size={13} color="#86efac" strokeWidth={2} />
              : <TrendingDown size={13} color="#fca5a5" strokeWidth={2} />}
            <span style={{ fontSize: FONT_SIZE.xs, color: trend.up ? '#86efac' : '#fca5a5' }}>
              {trend.value}% {trend.label}
            </span>
          </div>
        )}
        {linkLabel && onLink && (
          <button onClick={onLink} style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            color: 'rgba(255,255,255,0.6)', fontSize: FONT_SIZE.xs, textAlign: 'left',
            textDecoration: 'underline',
          }}>
            {linkLabel}
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{
      background:   COLORS.white,
      borderRadius: '16px',
      padding:      '20px',
      boxShadow:    SHADOW.card,
      border:       `1px solid ${COLORS.divider}`,
      display:      'flex',
      alignItems:   'flex-start',
      gap:          '14px',
    }}>
      {/* Icon circle */}
      <div style={{
        width:          '44px',
        height:         '44px',
        minWidth:       '44px',
        borderRadius:   '12px',
        background:     COLORS.brandLight,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        color:          accent,
      }}>
        {icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: FONT_SIZE.xs, color: COLORS.muted, margin: '0 0 4px', lineHeight: 1.3 }}>{label}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: FONT_WEIGHT.bold, color: COLORS.navy, margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            {trend.up
              ? <TrendingUp size={12} color="#16a34a" strokeWidth={2} />
              : <TrendingDown size={12} color="#dc2626" strokeWidth={2} />}
            <span style={{ fontSize: '11px', color: trend.up ? '#16a34a' : '#dc2626' }}>
              {trend.value}% {trend.label}
            </span>
          </div>
        )}
        {linkLabel && onLink && (
          <button onClick={onLink} style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            color: COLORS.brand, fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold,
          }}>
            {linkLabel} →
          </button>
        )}
      </div>
    </div>
  )
}
