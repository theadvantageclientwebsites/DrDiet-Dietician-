/**
 * DashboardLayout
 * ─────────────────────────────────────────────────────────────────
 * Desktop (≥1024 px) : sticky Sidebar + scrollable main content
 * Mobile / Tablet    : full-width content + fixed BottomTabBar
 *
 * Uses CSS custom properties + a single <style> block so there are
 * zero Tailwind utilities needed — fully portable.
 */
import { Outlet } from 'react-router-dom'
import type { UserRole } from '@/types'
import Sidebar        from './sidebar/Sidebar'
import BottomTabBar   from './bottomtab/BottomTabBar'
import DashboardHeader from './header/DashboardHeader'
import {
  COLORS, BOTTOM_TAB_HEIGHT,
} from '@/config/theme'

interface DashboardLayoutProps {
  role: UserRole
  notificationCount?: number
}

export default function DashboardLayout({
  role: _role,
  notificationCount = 0,
}: DashboardLayoutProps) {
  return (
    <>
      {/* ── Responsive CSS ─────────────────────────────────────────────── */}
      <style>{`
        .dl-root {
          display: flex;
          min-height: 100dvh;
          background: ${COLORS.pageBg};
        }

        /* Sidebar: show on desktop, hide on mobile/tablet */
        .dl-sidebar {
          display: none;
        }

        /* Bottom tab: show on mobile/tablet, hide on desktop */
        .dl-bottom-tab {
          display: flex;
        }

        /* Content area */
        .dl-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          /* push content above fixed bottom tab on mobile */
          padding-bottom: ${BOTTOM_TAB_HEIGHT}px;
        }

        /* Scrollable page body */
        .dl-page {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }

        /* Header: always visible, full width */
        .dl-header {
          display: flex;
          width: 100%;
        }

        /* ── Desktop breakpoint ─────────────────────────────────────── */
        @media (min-width: 1024px) {
          .dl-sidebar     { display: flex; }
          .dl-bottom-tab  { display: none !important; }
          .dl-content     { padding-bottom: 0; }

          /* On desktop the brand block in header is redundant (sidebar has it) */
          .header-brand   { display: none; }
        }

        /* ── Sidebar nav item hover ─────────────────────────────────── */
        .sidebar-nav-item:hover {
          background: rgba(255,255,255,0.09) !important;
          color: ${COLORS.white} !important;
        }
      `}</style>

      <div className="dl-root">
        {/* Desktop sidebar */}
        <div className="dl-sidebar">
          <Sidebar />
        </div>

        {/* Main area */}
        <div className="dl-content">
          {/* Sticky header */}
          <div className="dl-header">
            <DashboardHeader notificationCount={notificationCount} />
          </div>

          {/* Page content */}
          <main className="dl-page">
            <Outlet />
          </main>
        </div>

        {/* Mobile bottom tab */}
        <div className="dl-bottom-tab">
          <BottomTabBar />
        </div>
      </div>
    </>
  )
}
