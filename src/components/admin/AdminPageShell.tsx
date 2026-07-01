/**
 * AdminPageShell — consistent page wrapper for all admin pages
 * Handles responsive padding, page title row, and action slot
 */
import type { ReactNode } from 'react'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'

interface AdminPageShellProps {
  title:     string
  subtitle?: string
  actions?:  ReactNode
  children:  ReactNode
}

export default function AdminPageShell({ title, subtitle, actions, children }: AdminPageShellProps) {
  return (
    <>
      <style>{`
        .ap-shell {
          width: 100%;
          min-height: 100%;
          padding: 16px;
          box-sizing: border-box;
        }
        @media (min-width: 768px)  { .ap-shell { padding: 20px; } }
        @media (min-width: 1024px) { .ap-shell { padding: 24px 28px; } }

        .ap-titlerow {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .ap-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
      `}</style>

      <div className="ap-shell">
        <div className="ap-titlerow">
          <div>
            <h1 style={{
              fontSize:   FONT_SIZE.xl,
              fontWeight: FONT_WEIGHT.bold,
              color:      COLORS.navy,
              lineHeight: 1.2,
              margin:     0,
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{
                fontSize:  FONT_SIZE.sm,
                color:     COLORS.muted,
                marginTop: '4px',
                lineHeight: 1.5,
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="ap-actions">{actions}</div>}
        </div>

        {children}
      </div>
    </>
  )
}
