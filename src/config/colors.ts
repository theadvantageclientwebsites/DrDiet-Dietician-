// ─── Brand color tokens (mirrors CSS variables in index.css) ─────────────────
// Use these when you need JS access to colors (e.g. chart libs, inline styles)
// For className-based styling always prefer Tailwind utilities (text-primary, etc.)

export const colors = {
  primary: 'hsl(174, 72%, 38%)',        // teal — main brand
  primaryLight: 'hsl(174, 72%, 93%)',   // teal tint for backgrounds
  primaryForeground: 'hsl(0, 0%, 100%)',

  background: 'hsl(0, 0%, 100%)',
  card: 'hsl(0, 0%, 100%)',
  foreground: 'hsl(222, 47%, 11%)',
  muted: 'hsl(210, 40%, 96%)',
  mutedForeground: 'hsl(215, 16%, 47%)',
  border: 'hsl(214, 32%, 91%)',
  input: 'hsl(214, 32%, 91%)',

  destructive: 'hsl(0, 84%, 60%)',
  success: 'hsl(142, 71%, 45%)',
  warning: 'hsl(38, 92%, 50%)',
} as const

// Role accent colors used for role cards / badges
export const roleColors = {
  patient: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    icon: 'text-teal-600',
    badge: 'bg-teal-100 text-teal-700',
  },
  intern: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    icon: 'text-cyan-600',
    badge: 'bg-cyan-100 text-cyan-700',
  },
  doctor: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  admin: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    icon: 'text-slate-600',
    badge: 'bg-slate-100 text-slate-700',
  },
} as const
