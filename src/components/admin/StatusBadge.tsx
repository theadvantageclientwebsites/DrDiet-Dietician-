/**
 * StatusBadge — pill-shaped colored status indicator
 */

export type BadgeStatus =
  | 'active' | 'inactive'
  | 'pending' | 'completed' | 'cancelled' | 'confirmed' | 'rescheduled'
  | 'approved' | 'rejected'
  | 'published' | 'draft'

const STATUS_MAP: Record<BadgeStatus, { bg: string; text: string; label: string }> = {
  active:      { bg: '#dcfce7', text: '#16a34a', label: 'Active' },
  approved:    { bg: '#dcfce7', text: '#16a34a', label: 'Approved' },
  completed:   { bg: '#dcfce7', text: '#16a34a', label: 'Completed' },
  confirmed:   { bg: '#dcfce7', text: '#16a34a', label: 'Confirmed' },
  published:   { bg: '#dcfce7', text: '#16a34a', label: 'Published' },
  pending:     { bg: '#fef3c7', text: '#d97706', label: 'Pending' },
  rescheduled: { bg: '#fef3c7', text: '#d97706', label: 'Rescheduled' },
  draft:       { bg: '#fef3c7', text: '#d97706', label: 'Draft' },
  inactive:    { bg: '#fee2e2', text: '#dc2626', label: 'Inactive' },
  cancelled:   { bg: '#fee2e2', text: '#dc2626', label: 'Cancelled' },
  rejected:    { bg: '#fee2e2', text: '#dc2626', label: 'Rejected' },
}

interface StatusBadgeProps {
  status: BadgeStatus | string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const key = (status ?? '').toLowerCase() as BadgeStatus
  const cfg = STATUS_MAP[key] ?? { bg: '#f0f4f6', text: '#6b8896', label: status }

  return (
    <span style={{
      display:      'inline-block',
      borderRadius: '999px',
      padding:      '3px 10px',
      fontSize:     '11px',
      fontWeight:   600,
      lineHeight:   1.6,
      background:   cfg.bg,
      color:        cfg.text,
      whiteSpace:   'nowrap',
    }}>
      {cfg.label}
    </span>
  )
}
