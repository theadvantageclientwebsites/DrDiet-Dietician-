import { NavLink } from 'react-router-dom'
import * as Icons from 'lucide-react'
import type { NavItem } from '@/config/navigation'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'

interface Props {
  item: NavItem
}

type IconName = keyof typeof Icons

export default function SidebarNavItem({ item }: Props) {
  const IconComp = Icons[item.icon as IconName] as React.ElementType | undefined

  return (
    <NavLink
      to={item.path}
      end={item.path.endsWith('/dashboard')}
      style={({ isActive }) => ({
        display:        'flex',
        alignItems:     'center',
        gap:            '10px',
        padding:        '10px 14px',
        borderRadius:   '10px',
        margin:         '1px 0',
        textDecoration: 'none',
        fontSize:       FONT_SIZE.base,
        fontWeight:     isActive ? FONT_WEIGHT.semibold : FONT_WEIGHT.normal,
        color:          isActive ? COLORS.white : 'rgba(255,255,255,0.65)',
        background:     isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
        transition:     'all 0.15s ease',
        position:       'relative',
      })}
      className="sidebar-nav-item"
    >
      {IconComp && (
        <IconComp
          size={18}
          strokeWidth={1.8}
          style={{ flexShrink: 0 }}
        />
      )}
      <span style={{ flex: 1, lineHeight: 1.2 }}>{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span style={{
          background:   COLORS.errorRed,
          color:        COLORS.white,
          borderRadius: '999px',
          fontSize:     FONT_SIZE.xs,
          fontWeight:   FONT_WEIGHT.bold,
          minWidth:     '18px',
          height:       '18px',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          padding:      '0 5px',
        }}>
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}
    </NavLink>
  )
}
