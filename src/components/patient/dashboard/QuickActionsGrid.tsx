/**
 * QuickActionsGrid
 * ─────────────────────────────────────────────────────────────────────────────
 * Assembles quick-action cards into the design layout:
 *
 * Mobile:
 *   [   Featured (full)   ]
 *   [ Packages ] [ Services ]
 *   [   Diet Plans (row)  ]
 *   [ Support ] [ Ebook   ]
 *   [  Blood Reports (row)]
 *
 * Tablet+ (sm breakpoint):
 *   [ Featured ] [ Packages ] [ Services ]
 *   [   Diet Plans (row, full)            ]
 *   [ Support  ] [  Ebook   ]
 *   [  Blood Reports (row, full)          ]
 */

import QuickActionCard from './QuickActionCard'
import type { QuickAction } from '@/hooks/usePatientDashboard'

interface QuickActionsGridProps {
  actions:  QuickAction[]
  onAction: (route: string) => void
}

export default function QuickActionsGrid({ actions, onAction }: QuickActionsGridProps) {
  const featured = actions.filter(a => a.variant === 'featured')
  const icons    = actions.filter(a => a.variant === 'icon')
  const rows     = actions.filter(a => a.variant === 'row')

  return (
    <div className="flex flex-col gap-3" role="list" aria-label="Quick actions">

      {/* ── Top section: featured + icons ──────────────────────────────── */}
      {/* Mobile: featured full width, then 2 icons beside each other     */}
      {/* sm+: all three in a 3-col grid                                  */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Featured spans full row on mobile, 1 col on sm+ */}
        <div className="col-span-2 sm:col-span-1" role="listitem">
          {featured.map(a => (
            <QuickActionCard key={a.id} action={a} onClick={onAction} />
          ))}
        </div>

        {/* First pair of icon cards */}
        {icons.slice(0, 2).map(a => (
          <div key={a.id} role="listitem">
            <QuickActionCard action={a} onClick={onAction} />
          </div>
        ))}
      </div>

      {/* ── Row card 1 (Diet Plans) ─────────────────────────────────────── */}
      {rows.slice(0, 1).map(a => (
        <div key={a.id} role="listitem">
          <QuickActionCard action={a} onClick={onAction} />
        </div>
      ))}

      {/* ── Second icon pair (Support Chat + Ebook Store) ──────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {icons.slice(2, 4).map(a => (
          <div key={a.id} role="listitem">
            <QuickActionCard action={a} onClick={onAction} />
          </div>
        ))}
      </div>

      {/* ── Row card 2+ (Blood Reports, etc.) ─────────────────────────── */}
      {rows.slice(1).map(a => (
        <div key={a.id} role="listitem">
          <QuickActionCard action={a} onClick={onAction} />
        </div>
      ))}
    </div>
  )
}
