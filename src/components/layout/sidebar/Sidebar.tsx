import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/hooks/useAuth'
import { NAV_ITEMS } from '@/config/navigation'
import {
  COLORS, FONT_SIZE, FONT_WEIGHT, SIDEBAR_WIDTH,
} from '@/config/theme'
import SidebarNavItem from './SidebarNavItem'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { LogOut } from 'lucide-react'

const BRAND   = 'Clinical Vitality'
const TAGLINE = 'Care & Longevity'

export default function Sidebar() {
  const { user } = useAuthStore()
  const logout   = useLogout()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  if (!user) return null
  const navItems = NAV_ITEMS[user.role] ?? []

  const handleLogoutConfirm = () => {
    // Don't close modal here — keep it open so the spinner shows during the API call.
    // The modal will be dismissed naturally when window.location.replace fires in onSettled.
    logout.mutate()
  }

  return (
    <aside style={{
      width:         `${SIDEBAR_WIDTH}px`,
      minWidth:      `${SIDEBAR_WIDTH}px`,
      height:        '100dvh',
      position:      'sticky',
      top:           0,
      display:       'flex',
      flexDirection: 'column',
      background:    COLORS.sidebarBg,
      overflowY:     'auto',
      overflowX:     'hidden',
      zIndex:        40,
    }}>
      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '10px',
        padding:    '22px 18px 18px',
      }}>
        <div style={{
          width:          '36px',
          height:         '36px',
          borderRadius:   '10px',
          background:     COLORS.brandMid,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
          color:          COLORS.white,
          fontWeight:     FONT_WEIGHT.bold,
          fontSize:       FONT_SIZE.sm,
          letterSpacing:  '0.5px',
        }}>CV</div>
        <div>
          <p style={{ color: COLORS.white,  fontWeight: FONT_WEIGHT.semibold, fontSize: FONT_SIZE.md,  lineHeight: 1.2 }}>{BRAND}</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: FONT_SIZE.xs, lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{TAGLINE}</p>
        </div>
      </div>

      {/* ── User Greeting ──────────────────────────────────────────────── */}
      <div style={{
        margin:       '0 12px 12px',
        padding:      '12px',
        borderRadius: '12px',
        background:   'rgba(255,255,255,0.07)',
        display:      'flex',
        alignItems:   'center',
        gap:          '10px',
      }}>
        <div style={{
          width:          '38px',
          height:         '38px',
          borderRadius:   '50%',
          background:     COLORS.brandMid,
          flexShrink:     0,
          overflow:       'hidden',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          color:          COLORS.white,
          fontWeight:     FONT_WEIGHT.semibold,
          fontSize:       FONT_SIZE.sm,
        }}>
          {user.avatar
            ? <img src={user.avatar} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : user.fullName.charAt(0).toUpperCase()}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: FONT_SIZE.xs, lineHeight: 1.3 }}>Welcome back,</p>
          <p style={{ color: COLORS.white, fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.fullName}</p>
        </div>
      </div>

      {/* ── Nav Items ─────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: '0 10px' }}>
        {navItems.map(item => (
          <SidebarNavItem key={item.path} item={item} />
        ))}
      </nav>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div style={{ padding: '12px 14px 20px' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '10px', paddingLeft: '4px' }}>
          Secure Clinical Access · HIPAA
        </p>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          disabled={logout.isPending}
          style={{
            display:        'flex',
            alignItems:     'center',
            gap:            '8px',
            width:          '100%',
            padding:        '9px 12px',
            borderRadius:   '9px',
            border:         'none',
            background:     'rgba(255,255,255,0.06)',
            color:          'rgba(255,255,255,0.55)',
            fontSize:       FONT_SIZE.sm,
            cursor:         'pointer',
            transition:     'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(217,48,37,0.18)'; (e.currentTarget as HTMLButtonElement).style.color = '#ff6b6b' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)' }}
        >
          <LogOut size={15} strokeWidth={1.8} />
          <span>{logout.isPending ? 'Signing out…' : 'Sign Out Session'}</span>
        </button>
      </div>

      {/* ── Logout confirmation modal ─────────────────────────────────── */}
      <ConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        variant="danger"
        title="Sign out of your account?"
        description="You'll need to sign in again to access your dashboard. Any unsaved changes will be lost."
        confirmLabel="Yes, Sign Out"
        cancelLabel="Stay Signed In"
        loading={logout.isPending}
      />
    </aside>
  )
}
