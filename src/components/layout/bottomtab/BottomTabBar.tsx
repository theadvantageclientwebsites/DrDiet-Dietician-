import { NavLink } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { BOTTOM_TAB_ITEMS, type NavItem } from '@/config/navigation'
import { COLORS, FONT_SIZE, FONT_WEIGHT, BOTTOM_TAB_HEIGHT } from '@/config/theme'

type IconName = keyof typeof Icons

interface TabItemProps {
  item: NavItem
}

function TabItem({ item }: TabItemProps) {
  const IconComp = Icons[item.icon as IconName] as React.ElementType | undefined

  return (
    <NavLink
      to={item.path}
      end={item.path.endsWith('/dashboard')}
      style={({ isActive }) => ({
        flex:           1,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '3px',
        textDecoration: 'none',
        padding:        '6px 4px',
        position:       'relative',
        color:          isActive ? COLORS.brand : COLORS.muted,
        transition:     'color 0.15s ease',
      })}
    >
      {({ isActive }) => (
        <>
          {/* Active pill bg */}
          {isActive && (
            <span style={{
              position:     'absolute',
              top:          '6px',
              width:        '44px',
              height:       '36px',
              borderRadius: '12px',
              background:   COLORS.brandLight,
              zIndex:       0,
            }} />
          )}
          <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {IconComp && <IconComp size={20} strokeWidth={isActive ? 2.2 : 1.7} />}
            {item.badge != null && item.badge > 0 && (
              <span style={{
                position:       'absolute',
                top:            '-4px',
                right:          '-6px',
                background:     COLORS.errorRed,
                color:          COLORS.white,
                borderRadius:   '999px',
                fontSize:       '10px',
                fontWeight:     FONT_WEIGHT.bold,
                minWidth:       '16px',
                height:         '16px',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                padding:        '0 4px',
                lineHeight:     1,
              }}>
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </span>
          <span style={{
            position:   'relative',
            zIndex:     1,
            fontSize:   FONT_SIZE.xs,
            fontWeight: isActive ? FONT_WEIGHT.semibold : FONT_WEIGHT.normal,
            lineHeight: 1,
          }}>
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  )
}

export default function BottomTabBar() {
  const { user } = useAuthStore()
  if (!user) return null

  const tabs = BOTTOM_TAB_ITEMS[user.role] ?? []

  return (
    <nav
      role="navigation"
      aria-label="Bottom navigation"
      style={{
        position:        'fixed',
        bottom:          0,
        left:            0,
        right:           0,
        height:          `${BOTTOM_TAB_HEIGHT}px`,
        background:      COLORS.white,
        borderTop:       `1px solid ${COLORS.divider}`,
        display:         'flex',
        alignItems:      'stretch',
        zIndex:          50,
        paddingBottom:   'env(safe-area-inset-bottom)',
        boxShadow:       '0 -2px 12px rgba(0,0,0,0.07)',
      }}
    >
      {tabs.map(item => (
        <TabItem key={item.path} item={item} />
      ))}
    </nav>
  )
}
