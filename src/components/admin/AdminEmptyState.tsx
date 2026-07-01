/**
 * AdminEmptyState — empty state with icon, title, description, and optional CTA
 */
import type { ReactNode } from 'react'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'

interface AdminEmptyStateProps {
  icon:        ReactNode
  title:       string
  description: string
  action?:     ReactNode
}

export default function AdminEmptyState({ icon, title, description, action }: AdminEmptyStateProps) {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '48px 24px',
      gap:            '12px',
      textAlign:      'center',
    }}>
      <div style={{
        width:'52px', height:'52px', borderRadius:'14px',
        background: COLORS.brandLight,
        display:'flex', alignItems:'center', justifyContent:'center',
        color: COLORS.brand,
      }}>
        {icon}
      </div>
      <p style={{ fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, margin: 0 }}>{title}</p>
      <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, margin: 0, maxWidth: '280px', lineHeight: 1.6 }}>{description}</p>
      {action && <div style={{ marginTop: '4px' }}>{action}</div>}
    </div>
  )
}
