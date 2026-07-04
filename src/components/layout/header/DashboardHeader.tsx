import { useNavigate } from 'react-router-dom'
import { Bell, User, LogOut, Settings } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { COLORS, FONT_SIZE, FONT_WEIGHT, HEADER_HEIGHT } from '@/config/theme'
import { ROUTES } from '@/config/routes'
import type { UserRole } from '@/types'

const BRAND = 'DrDiet Therapy'

/** Map role → notifications route */
const NOTIF_ROUTES: Record<UserRole, string> = {
  PATIENT: ROUTES.PATIENT.NOTIFICATIONS,
  DOCTOR:  ROUTES.DOCTOR.NOTIFICATIONS,
  INTERN:  ROUTES.INTERN.PROFILE,
  ADMIN:   ROUTES.ADMIN.NOTIFICATIONS,
}

/** Map role → profile route (best match per role) */
const PROFILE_ROUTES: Partial<Record<UserRole, string>> = {
  PATIENT: ROUTES.PATIENT.PROFILE,
  INTERN:  ROUTES.INTERN.PROFILE,
}

interface Props {
  notificationCount?: number
}

export default function DashboardHeader({ notificationCount = 0 }: Props) {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const avatarRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        avatarRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  if (!user) return null

  const notifPath    = NOTIF_ROUTES[user.role]
  const profilePath  = PROFILE_ROUTES[user.role]
  const initials     = user.fullName.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')

  const handleLogout = () => {
    setOpen(false)
    clearAuth()
    navigate(ROUTES.SIGN_IN, { replace: true })
  }

  return (
    <header style={{
      width:        '100%',
      height:       `${HEADER_HEIGHT}px`,
      minHeight:    `${HEADER_HEIGHT}px`,
      background:   COLORS.white,
      borderBottom: `1px solid ${COLORS.divider}`,
      display:      'flex',
      alignItems:   'center',
      padding:      '0 20px',
      gap:          '12px',
      position:     'sticky',
      top:          0,
      zIndex:       30,
    }}>
      {/* ── Brand ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '9px',
          background: COLORS.brand, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: COLORS.white,
          fontWeight: FONT_WEIGHT.bold, fontSize: FONT_SIZE.xs, flexShrink: 0,
        }}>DD</div>
        <div>
          <p style={{ fontWeight: FONT_WEIGHT.semibold, fontSize: FONT_SIZE.md, color: COLORS.navy, lineHeight: 1.1 }}>{BRAND}</p>
          <p style={{ fontSize: FONT_SIZE.xs, color: COLORS.muted, lineHeight: 1.3 }}>
            Welcome back, {user.fullName}
          </p>
        </div>
      </div>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>

        {/* Bell */}
        <button
          aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
          onClick={() => navigate(notifPath)}
          style={{
            position: 'relative', width: '38px', height: '38px',
            borderRadius: '50%', border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: COLORS.body, transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = COLORS.brandLight)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Bell size={20} strokeWidth={1.8} />
          {notificationCount > 0 && (
            <span style={{
              position: 'absolute', top: '5px', right: '5px',
              width: '8px', height: '8px', borderRadius: '50%',
              background: COLORS.errorRed, border: `2px solid ${COLORS.white}`,
            }} />
          )}
        </button>

        {/* Avatar button */}
        <button
          ref={avatarRef}
          aria-label="Profile menu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            border: `2px solid ${open ? COLORS.brand : COLORS.brandLight}`,
            overflow: 'hidden', cursor: 'pointer', padding: 0,
            background: COLORS.brandMid, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: COLORS.white,
            fontWeight: FONT_WEIGHT.semibold, fontSize: FONT_SIZE.sm,
            flexShrink: 0, transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = COLORS.brand)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = open ? COLORS.brand : COLORS.brandLight)}
        >
          {user.avatar
            ? <img src={user.avatar} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initials}
        </button>

        {/* ── Dropdown popover ──────────────────────────────────────────── */}
        {open && (
          <div
            ref={dropdownRef}
            style={{
              position:     'absolute',
              top:          'calc(100% + 10px)',
              right:        0,
              zIndex:       200,
              background:   '#fff',
              borderRadius: '16px',
              boxShadow:    '0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)',
              border:       `1px solid ${COLORS.divider}`,
              minWidth:     '220px',
              overflow:     'hidden',
            }}
          >
            {/* User info header */}
            <div style={{
              padding:      '14px 16px 12px',
              borderBottom: `1px solid ${COLORS.divider}`,
              display:      'flex',
              alignItems:   'center',
              gap:          '10px',
            }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: COLORS.brand, display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff',
                fontWeight: FONT_WEIGHT.bold, fontSize: FONT_SIZE.sm,
                flexShrink: 0,
              }}>
                {user.avatar
                  ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  : initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, fontSize: FONT_SIZE.sm, color: COLORS.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.fullName}
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: COLORS.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </p>
                <span style={{
                  display: 'inline-block', marginTop: '3px',
                  fontSize: '10px', fontWeight: FONT_WEIGHT.semibold,
                  background: COLORS.brandLight, color: COLORS.brand,
                  borderRadius: '5px', padding: '1px 7px',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  {user.role}
                </span>
              </div>
            </div>

            {/* Menu items */}
            <div style={{ padding: '6px' }}>
              {profilePath && (
                <DropdownItem
                  icon={<User size={15} strokeWidth={1.8} />}
                  label="My Profile"
                  onClick={() => { setOpen(false); navigate(profilePath) }}
                />
              )}
              <DropdownItem
                icon={<Settings size={15} strokeWidth={1.8} />}
                label="Settings"
                onClick={() => setOpen(false)}
              />
              <div style={{ height: '1px', background: COLORS.divider, margin: '4px 0' }} />
              <DropdownItem
                icon={<LogOut size={15} strokeWidth={1.8} />}
                label="Sign Out"
                danger
                onClick={handleLogout}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

interface DropdownItemProps {
  icon:    React.ReactNode
  label:   string
  onClick: () => void
  danger?: boolean
}

function DropdownItem({ icon, label, onClick, danger = false }: DropdownItemProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:          '100%',
        display:        'flex',
        alignItems:     'center',
        gap:            '10px',
        padding:        '8px 10px',
        borderRadius:   '9px',
        border:         'none',
        background:     hovered ? (danger ? '#fff1f1' : COLORS.brandLight) : 'transparent',
        color:          danger ? '#dc2626' : COLORS.body,
        fontSize:       FONT_SIZE.sm,
        fontWeight:     FONT_WEIGHT.medium,
        cursor:         'pointer',
        textAlign:      'left',
        transition:     'background 0.12s',
        fontFamily:     'inherit',
      }}
    >
      {icon}
      {label}
    </button>
  )
}
