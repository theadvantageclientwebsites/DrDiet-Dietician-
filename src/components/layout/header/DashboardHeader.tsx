import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { COLORS, FONT_SIZE, FONT_WEIGHT, HEADER_HEIGHT } from '@/config/theme'
import { ROUTES } from '@/config/routes'
import type { UserRole } from '@/types'

const BRAND = 'Clinical Vitality'

/** Map role → notifications route */
const NOTIF_ROUTES: Record<UserRole, string> = {
  patient: ROUTES.PATIENT.NOTIFICATIONS,
  doctor:  ROUTES.DOCTOR.NOTIFICATIONS,
  intern:  ROUTES.INTERN.PROFILE,   // interns have no dedicated notif page yet
  admin:   ROUTES.ADMIN.NOTIFICATIONS,
}

interface Props {
  notificationCount?: number
}

export default function DashboardHeader({ notificationCount = 0 }: Props) {
  const { user } = useAuthStore()
  const navigate  = useNavigate()

  if (!user) return null

  const notifPath = NOTIF_ROUTES[user.role]

  return (
    <header style={{
      width:           '100%',
      height:          `${HEADER_HEIGHT}px`,
      minHeight:       `${HEADER_HEIGHT}px`,
      background:      COLORS.white,
      borderBottom:    `1px solid ${COLORS.divider}`,
      display:         'flex',
      alignItems:      'center',
      padding:         '0 20px',
      gap:             '12px',
      position:        'sticky',
      top:             0,
      zIndex:          30,
    }}>
      {/* ── Brand (visible on mobile only — sidebar hidden) ─────────────── */}
      <div className="header-brand" style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '8px',
        flex:       1,
      }}>
        <div style={{
          width:          '32px',
          height:         '32px',
          borderRadius:   '9px',
          background:     COLORS.brand,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          color:          COLORS.white,
          fontWeight:     FONT_WEIGHT.bold,
          fontSize:       FONT_SIZE.xs,
          flexShrink:     0,
        }}>CV</div>
        <div>
          <p style={{ fontWeight: FONT_WEIGHT.semibold, fontSize: FONT_SIZE.md, color: COLORS.navy, lineHeight: 1.1 }}>{BRAND}</p>
          <p style={{ fontSize: FONT_SIZE.xs, color: COLORS.muted, lineHeight: 1.3 }}>
            Welcome back, {user.name}
          </p>
        </div>
      </div>

      {/* ── Actions ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Notification bell */}
        <button
          aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
          onClick={() => navigate(notifPath)}
          style={{
            position:   'relative',
            width:      '38px',
            height:     '38px',
            borderRadius: '50%',
            border:     'none',
            background: 'transparent',
            cursor:     'pointer',
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color:      COLORS.body,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = COLORS.brandLight)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Bell size={20} strokeWidth={1.8} />
          {notificationCount > 0 && (
            <span style={{
              position:       'absolute',
              top:            '5px',
              right:          '5px',
              width:          '8px',
              height:         '8px',
              borderRadius:   '50%',
              background:     COLORS.errorRed,
              border:         `2px solid ${COLORS.white}`,
            }} />
          )}
        </button>

        {/* Avatar */}
        <button
          aria-label="Profile"
          style={{
            width:        '36px',
            height:       '36px',
            borderRadius: '50%',
            border:       `2px solid ${COLORS.brandLight}`,
            overflow:     'hidden',
            cursor:       'pointer',
            padding:      0,
            background:   COLORS.brandMid,
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            color:        COLORS.white,
            fontWeight:   FONT_WEIGHT.semibold,
            fontSize:     FONT_SIZE.sm,
            flexShrink:   0,
            transition:   'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = COLORS.brand)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = COLORS.brandLight)}
        >
          {user.avatar
            ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : user.name.charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  )
}
