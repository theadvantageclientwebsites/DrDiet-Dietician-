
// ─── Brand Palette ─────────────────────────────────────────────────────────
export const COLORS = {
  brand:       '#1a6b7a',   // primary teal
  brandMid:    '#2d96a4',   // hover / mid teal
  brandLight:  '#d0ecf2',   // icon circle bg
  brandBorder: '#c2e4ec',   // card border teal tint
  pageBg:      '#f0f4f6',   // app background
  sidebarBg:   '#0f3d4a',   // dark sidebar bg (from screenshot)
  sidebarActive:'#1a6b7a',  // active item fill in sidebar
  navy:        '#1a3c4d',   // headings
  body:        '#374955',   // body text
  muted:       '#6b8896',   // labels / hints
  inputBg:     '#f7fafb',
  inputBorder: '#d0dde2',
  divider:     '#e6edf0',
  white:       '#ffffff',
  errorRed:    '#d93025',
  amber:       '#f59e0b',   // warning / badge
  green:       '#16a34a',   // success dot
} as const

// ─── Font Family ───────────────────────────────────────────────────────────
export const FONT = {
  sans: "'Inter', ui-sans-serif, system-ui, sans-serif",
} as const

// ─── Font Sizes (rem) ──────────────────────────────────────────────────────
export const FONT_SIZE = {
  xs:   '0.75rem',   // 12px
  sm:   '0.8125rem', // 13px
  base: '0.875rem',  // 14px
  md:   '1rem',      // 16px
  lg:   '1.14rem',  // 18px
  xl:   '1.25rem',   // 20px
  '2xl':'1.5rem',    // 24px
} as const

// ─── Font Weights ──────────────────────────────────────────────────────────
export const FONT_WEIGHT = {
  normal:   400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const

// ─── Shadows ──────────────────────────────────────────────────────────────
export const SHADOW = {
  card:   '0 1px 4px rgba(0,0,0,0.08)',
  panel:  '0 2px 12px rgba(0,0,0,0.10)',
  popup:  '0 8px 32px rgba(0,0,0,0.14)',
} as const

// ─── Breakpoints (px) ─────────────────────────────────────────────────────
export const BREAKPOINTS = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
} as const

// ─── Sidebar dims ─────────────────────────────────────────────────────────
export const SIDEBAR_WIDTH     = 220   // px — expanded
export const BOTTOM_TAB_HEIGHT = 64    // px — mobile bottom bar
export const HEADER_HEIGHT     = 64    // px — top header
