/**
 * Theme Preview Page — /theme-preview
 *
 * 4 themes researched from Tabler, AdminLTE 4, Linear, and healthcare palette guides (2025/26):
 *  1. Arctic Pro    — Tabler-style: pure white content, navy/slate sidebar, blue accent
 *  2. Midnight OS   — Linear/Vercel-style: full dark, charcoal surfaces, indigo accent
 *  3. Matcha Health — Nutrition-forward: deep forest sidebar, soft green content, teal accent
 *  4. Warm Canvas   — Muz.li 2026: soft beige/sand content, dark espresso sidebar, amber accent
 */

import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Theme {
  id: string
  name: string
  subtitle: string
  inspiration: string
  // sidebar tokens
  sb_bg: string
  sb_logoRing: string
  sb_logoText: string
  sb_userPill: string
  sb_avatar: string
  sb_navText: string
  sb_navActive: string
  sb_navActiveText: string
  sb_navActiveShadow: string
  sb_navHover: string
  sb_dot: string
  sb_dotGlow: string
  sb_footer: string
  // header tokens
  h_bg: string
  h_border: string
  h_title: string
  h_notifBg: string
  h_notifIcon: string
  // page body tokens
  p_bg: string
  p_title: string
  p_sub: string
  // CTA button
  btn: string
  btnShadow: string
  // stat card
  sc_bg: string
  sc_border: string
  sc_iconBg: string
  sc_iconColor: string
  sc_label: string
  sc_value: string
  // table
  t_bg: string
  t_border: string
  t_toolbarBg: string
  t_searchBg: string
  t_searchBorder: string
  t_searchText: string
  t_searchPlaceholder: string
  t_pillBg: string
  t_pillBorder: string
  t_pillText: string
  t_headBg: string
  t_headText: string
  t_rowBorder: string
  t_rowHover: string
  t_name: string
  t_email: string
  t_badgeGreenBg: string
  t_badgeGreenText: string
  t_badgeSecBg: string
  t_badgeSecText: string
}

// ─── Theme 1: Arctic Pro ─────────────────────────────────────────────────────
// Inspired by Tabler.io — the #1 open-source admin UI (41k GitHub stars).
// Dark slate sidebar #1a2332, pure white content, crisp blue #2D7DD2 accent.
// Trusted in healthcare SaaS for its clean visual hierarchy and readability.
const arcticPro: Theme = {
  id: 'arctic',
  name: 'Arctic Pro',
  subtitle: 'Dark Slate · White Canvas · Ocean Blue',
  inspiration: 'Inspired by Tabler.io — most starred open-source admin UI',

  sb_bg: 'linear-gradient(180deg, #1a2332 0%, #0f1622 100%)',
  sb_logoRing: 'linear-gradient(135deg, #2D7DD2, #1a5fa8)',
  sb_logoText: '#e2e8f0',
  sb_userPill: 'rgba(45,125,210,0.14)',
  sb_avatar: 'linear-gradient(135deg, #2D7DD2, #1a5fa8)',
  sb_navText: '#94a3b8',
  sb_navActive: 'linear-gradient(90deg, #1a5fa8, #2D7DD2)',
  sb_navActiveText: '#ffffff',
  sb_navActiveShadow: '0 4px 18px rgba(45,125,210,0.45)',
  sb_navHover: 'rgba(45,125,210,0.1)',
  sb_dot: '#2D7DD2',
  sb_dotGlow: '0 0 8px rgba(45,125,210,0.7)',
  sb_footer: '#475569',

  h_bg: '#ffffff',
  h_border: '#e2e8f0',
  h_title: '#0f172a',
  h_notifBg: '#eff6ff',
  h_notifIcon: '#2D7DD2',

  p_bg: '#f8fafc',
  p_title: '#0f172a',
  p_sub: '#64748b',

  btn: 'linear-gradient(135deg, #2D7DD2, #1a5fa8)',
  btnShadow: '0 4px 18px rgba(45,125,210,0.4)',

  sc_bg: '#ffffff',
  sc_border: '#e2e8f0',
  sc_iconBg: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
  sc_iconColor: '#2D7DD2',
  sc_label: '#64748b',
  sc_value: '#0f172a',

  t_bg: '#ffffff',
  t_border: '#e2e8f0',
  t_toolbarBg: '#ffffff',
  t_searchBg: '#f8fafc',
  t_searchBorder: '#e2e8f0',
  t_searchText: '#0f172a',
  t_searchPlaceholder: '#94a3b8',
  t_pillBg: '#eff6ff',
  t_pillBorder: '#bfdbfe',
  t_pillText: '#1d4ed8',
  t_headBg: '#f8fafc',
  t_headText: '#64748b',
  t_rowBorder: '#f1f5f9',
  t_rowHover: '#f8fafc',
  t_name: '#0f172a',
  t_email: '#64748b',
  t_badgeGreenBg: '#dcfce7',
  t_badgeGreenText: '#15803d',
  t_badgeSecBg: '#dbeafe',
  t_badgeSecText: '#1d4ed8',
}

// ─── Theme 2: Midnight OS ─────────────────────────────────────────────────────
// Inspired by Linear.app & Vercel's Geist dark — the gold standard of
// dark-mode SaaS. Deep charcoal #111827 surfaces, indigo #6366f1 accent.
// AdminLTE research: full dark reduces eye strain for long admin sessions.
const midnightOS: Theme = {
  id: 'midnight',
  name: 'Midnight OS',
  subtitle: 'Full Dark · Charcoal · Indigo Glow',
  inspiration: 'Inspired by Linear.app & Vercel Geist dark design system',

  sb_bg: 'linear-gradient(180deg, #0a0a0f 0%, #111827 100%)',
  sb_logoRing: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  sb_logoText: '#e0e7ff',
  sb_userPill: 'rgba(99,102,241,0.12)',
  sb_avatar: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  sb_navText: '#6b7280',
  sb_navActive: 'linear-gradient(90deg, #4f46e5, #6366f1)',
  sb_navActiveText: '#ffffff',
  sb_navActiveShadow: '0 4px 20px rgba(99,102,241,0.5)',
  sb_navHover: 'rgba(99,102,241,0.1)',
  sb_dot: '#818cf8',
  sb_dotGlow: '0 0 10px rgba(129,140,248,0.8)',
  sb_footer: '#374151',

  h_bg: '#1f2937',
  h_border: '#374151',
  h_title: '#f9fafb',
  h_notifBg: 'rgba(99,102,241,0.15)',
  h_notifIcon: '#818cf8',

  p_bg: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)',
  p_title: '#f9fafb',
  p_sub: '#9ca3af',

  btn: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  btnShadow: '0 4px 20px rgba(99,102,241,0.5)',

  sc_bg: '#1f2937',
  sc_border: '#374151',
  sc_iconBg: 'rgba(99,102,241,0.2)',
  sc_iconColor: '#a5b4fc',
  sc_label: '#9ca3af',
  sc_value: '#f9fafb',

  t_bg: '#1f2937',
  t_border: '#374151',
  t_toolbarBg: '#1f2937',
  t_searchBg: '#111827',
  t_searchBorder: '#374151',
  t_searchText: '#f9fafb',
  t_searchPlaceholder: '#4b5563',
  t_pillBg: 'rgba(99,102,241,0.15)',
  t_pillBorder: '#4338ca',
  t_pillText: '#a5b4fc',
  t_headBg: '#111827',
  t_headText: '#6b7280',
  t_rowBorder: '#374151',
  t_rowHover: 'rgba(99,102,241,0.06)',
  t_name: '#f9fafb',
  t_email: '#9ca3af',
  t_badgeGreenBg: 'rgba(52,211,153,0.15)',
  t_badgeGreenText: '#34d399',
  t_badgeSecBg: 'rgba(129,140,248,0.2)',
  t_badgeSecText: '#a5b4fc',
}

// ─── Theme 3: Matcha Health ───────────────────────────────────────────────────
// Purpose-built for dietician/nutrition platforms. Deep forest #064e3b sidebar
// signals health authority. Soft #f0fdf4 content is clinical but warm.
// Teal-green #10b981 accent — the exact color psychology used in leading
// health apps (source: redrocket.software healthcare color research 2025).
const matchaHealth: Theme = {
  id: 'matcha',
  name: 'Matcha Health',
  subtitle: 'Deep Forest · Mint Canvas · Emerald Accent',
  inspiration: 'Purpose-built for nutrition & dietician platforms',

  sb_bg: 'linear-gradient(180deg, #052e16 0%, #064e3b 100%)',
  sb_logoRing: 'linear-gradient(135deg, #10b981, #059669)',
  sb_logoText: '#bbf7d0',
  sb_userPill: 'rgba(16,185,129,0.14)',
  sb_avatar: 'linear-gradient(135deg, #10b981, #059669)',
  sb_navText: '#6ee7b7',
  sb_navActive: 'linear-gradient(90deg, #059669, #10b981)',
  sb_navActiveText: '#ffffff',
  sb_navActiveShadow: '0 4px 18px rgba(16,185,129,0.45)',
  sb_navHover: 'rgba(16,185,129,0.12)',
  sb_dot: '#34d399',
  sb_dotGlow: '0 0 8px rgba(52,211,153,0.7)',
  sb_footer: '#065f46',

  h_bg: '#ffffff',
  h_border: '#a7f3d0',
  h_title: '#052e16',
  h_notifBg: '#d1fae5',
  h_notifIcon: '#059669',

  p_bg: 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)',
  p_title: '#052e16',
  p_sub: '#065f46',

  btn: 'linear-gradient(135deg, #10b981, #059669)',
  btnShadow: '0 4px 18px rgba(16,185,129,0.4)',

  sc_bg: '#ffffff',
  sc_border: '#a7f3d0',
  sc_iconBg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
  sc_iconColor: '#059669',
  sc_label: '#065f46',
  sc_value: '#052e16',

  t_bg: '#ffffff',
  t_border: '#a7f3d0',
  t_toolbarBg: '#ffffff',
  t_searchBg: '#f0fdf4',
  t_searchBorder: '#6ee7b7',
  t_searchText: '#052e16',
  t_searchPlaceholder: '#6ee7b7',
  t_pillBg: '#d1fae5',
  t_pillBorder: '#6ee7b7',
  t_pillText: '#065f46',
  t_headBg: '#f0fdf4',
  t_headText: '#065f46',
  t_rowBorder: '#d1fae5',
  t_rowHover: '#f0fdf4',
  t_name: '#052e16',
  t_email: '#065f46',
  t_badgeGreenBg: '#bbf7d0',
  t_badgeGreenText: '#15803d',
  t_badgeSecBg: '#d1fae5',
  t_badgeSecText: '#059669',
}

// ─── Theme 4: Warm Canvas ─────────────────────────────────────────────────────
// Ranked #1 emerging trend by Muz.li 2026: "soft beige + bold accent".
// AdminLTE research confirms warm neutrals cut dashboard fatigue in
// patient-facing health tools. Deep espresso #1c1008 sidebar + amber #f59e0b
// accent creates warmth without sacrificing professionalism.
const warmCanvas: Theme = {
  id: 'warm',
  name: 'Warm Canvas',
  subtitle: 'Espresso Dark · Sand Beige · Amber Glow',
  inspiration: 'Muz.li 2026 #1 trend: soft beige interface with bold accent',

  sb_bg: 'linear-gradient(180deg, #1c1008 0%, #292018 100%)',
  sb_logoRing: 'linear-gradient(135deg, #f59e0b, #d97706)',
  sb_logoText: '#fef3c7',
  sb_userPill: 'rgba(245,158,11,0.14)',
  sb_avatar: 'linear-gradient(135deg, #f59e0b, #d97706)',
  sb_navText: '#a8956a',
  sb_navActive: 'linear-gradient(90deg, #d97706, #f59e0b)',
  sb_navActiveText: '#ffffff',
  sb_navActiveShadow: '0 4px 18px rgba(217,119,6,0.45)',
  sb_navHover: 'rgba(245,158,11,0.1)',
  sb_dot: '#fbbf24',
  sb_dotGlow: '0 0 8px rgba(251,191,36,0.7)',
  sb_footer: '#4a3d25',

  h_bg: '#fffdf7',
  h_border: '#e9d8b4',
  h_title: '#1c1008',
  h_notifBg: '#fef3c7',
  h_notifIcon: '#d97706',

  p_bg: 'linear-gradient(180deg, #fdf8ef 0%, #fffdf7 100%)',
  p_title: '#1c1008',
  p_sub: '#78614a',

  btn: 'linear-gradient(135deg, #f59e0b, #d97706)',
  btnShadow: '0 4px 18px rgba(217,119,6,0.4)',

  sc_bg: '#fffdf7',
  sc_border: '#e9d8b4',
  sc_iconBg: 'linear-gradient(135deg, #fef3c7, #fde68a)',
  sc_iconColor: '#d97706',
  sc_label: '#78614a',
  sc_value: '#1c1008',

  t_bg: '#fffdf7',
  t_border: '#e9d8b4',
  t_toolbarBg: '#fffdf7',
  t_searchBg: '#fdf8ef',
  t_searchBorder: '#e9d8b4',
  t_searchText: '#1c1008',
  t_searchPlaceholder: '#b49a72',
  t_pillBg: '#fef3c7',
  t_pillBorder: '#fcd34d',
  t_pillText: '#92400e',
  t_headBg: '#fdf8ef',
  t_headText: '#78614a',
  t_rowBorder: '#f0e4c6',
  t_rowHover: '#fdf8ef',
  t_name: '#1c1008',
  t_email: '#78614a',
  t_badgeGreenBg: '#dcfce7',
  t_badgeGreenText: '#15803d',
  t_badgeSecBg: '#fef3c7',
  t_badgeSecText: '#d97706',
}

// ─── Theme 5: Ivory Clinic ───────────────────────────────────────────────────
// Cream-forward theme built around a warm ivory #faf6f0 canvas and a rich
// mocha #2c1f14 sidebar. Dusty rose #c17b5c accent brings warmth without
// being clinical. Feels like a premium wellness spa — soft, trustworthy,
// and approachable. Great for patient-facing dietician portals.
const ivoryClinic: Theme = {
  id: 'ivory',
  name: 'Ivory Clinic',
  subtitle: 'Mocha Dark · Cream Canvas · Dusty Rose',
  inspiration: 'Premium wellness spa aesthetic — soft cream with warm mocha depth',

  sb_bg: 'linear-gradient(180deg, #1a100a 0%, #2c1f14 100%)',
  sb_logoRing: 'linear-gradient(135deg, #c17b5c, #a0522d)',
  sb_logoText: '#f5e6d8',
  sb_userPill: 'rgba(193,123,92,0.15)',
  sb_avatar: 'linear-gradient(135deg, #c17b5c, #a0522d)',
  sb_navText: '#a08070',
  sb_navActive: 'linear-gradient(90deg, #a0522d, #c17b5c)',
  sb_navActiveText: '#ffffff',
  sb_navActiveShadow: '0 4px 18px rgba(160,82,45,0.45)',
  sb_navHover: 'rgba(193,123,92,0.12)',
  sb_dot: '#c17b5c',
  sb_dotGlow: '0 0 8px rgba(193,123,92,0.65)',
  sb_footer: '#4a3020',

  h_bg: '#faf6f0',
  h_border: '#e8d8c8',
  h_title: '#1a100a',
  h_notifBg: '#f5e6d8',
  h_notifIcon: '#a0522d',

  p_bg: 'linear-gradient(180deg, #fdf9f4 0%, #faf6f0 100%)',
  p_title: '#1a100a',
  p_sub: '#7a5c48',

  btn: 'linear-gradient(135deg, #c17b5c, #a0522d)',
  btnShadow: '0 4px 18px rgba(160,82,45,0.38)',

  sc_bg: '#fdf9f4',
  sc_border: '#e8d8c8',
  sc_iconBg: 'linear-gradient(135deg, #f5e6d8, #ebd0bb)',
  sc_iconColor: '#a0522d',
  sc_label: '#7a5c48',
  sc_value: '#1a100a',

  t_bg: '#fdf9f4',
  t_border: '#e8d8c8',
  t_toolbarBg: '#fdf9f4',
  t_searchBg: '#faf6f0',
  t_searchBorder: '#ddc8b4',
  t_searchText: '#1a100a',
  t_searchPlaceholder: '#b89880',
  t_pillBg: '#f5e6d8',
  t_pillBorder: '#ddc8b4',
  t_pillText: '#7a4030',
  t_headBg: '#faf6f0',
  t_headText: '#7a5c48',
  t_rowBorder: '#eeddd0',
  t_rowHover: '#fdf6ef',
  t_name: '#1a100a',
  t_email: '#7a5c48',
  t_badgeGreenBg: '#e6f4ea',
  t_badgeGreenText: '#2e7d32',
  t_badgeSecBg: '#f5e6d8',
  t_badgeSecText: '#a0522d',
}

const THEMES: Theme[] = [arcticPro, midnightOS, matchaHealth, warmCanvas, ivoryClinic]

// ─── Mock data ────────────────────────────────────────────────────────────────
const NAV = ['Dashboard', 'Patients', 'Interns', 'Appointments', 'Revenue', 'Settings']
const STATS = [
  { icon: '👥', label: 'Total Patients', value: '1,284' },
  { icon: '🩺', label: 'Active Interns',  value: '48'    },
  { icon: '📅', label: "Today's Appts",   value: '23'    },
  { icon: '₹',  label: 'Revenue',         value: '2.4L'  },
]
const ROWS = [
  { name: 'Priya Sharma', email: 'priya@drdiet.in', dept: 'Nutrition',  active: true,  approved: true  },
  { name: 'Arjun Mehta',  email: 'arjun@drdiet.in', dept: 'Diet Plan',  active: true,  approved: true  },
  { name: 'Sneha Patel',  email: 'sneha@drdiet.in', dept: 'Wellness',   active: true,  approved: false },
]

// ─── Dashboard Mockup ─────────────────────────────────────────────────────────
function DashMock({ t, activeNav = 'Patients' }: { t: Theme; activeNav?: string }) {
  return (
    <div
      className="flex overflow-hidden"
      style={{
        width: 900, height: 510, borderRadius: 16,
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <div className="flex flex-col flex-shrink-0" style={{ width: 188, background: t.sb_bg }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 pt-5 pb-4">
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0 font-black text-xs text-white"
            style={{ width: 36, height: 36, background: t.sb_logoRing, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
          >
            Dr
          </div>
          <div>
            <div className="text-sm font-bold leading-tight" style={{ color: t.sb_logoText }}>DrDiet</div>
            <div className="text-[10px] leading-tight opacity-50" style={{ color: t.sb_logoText }}>Dietician Panel</div>
          </div>
        </div>

        {/* User pill */}
        <div className="mx-3 mb-3 flex items-center gap-2 px-2.5 py-2 rounded-lg" style={{ background: t.sb_userPill }}>
          <div
            className="flex items-center justify-center rounded-full text-[11px] font-bold text-white flex-shrink-0"
            style={{ width: 28, height: 28, background: t.sb_avatar }}
          >
            AD
          </div>
          <div className="text-[10px] leading-snug" style={{ color: t.sb_navText }}>
            <div className="font-semibold" style={{ color: t.sb_logoText }}>Admin User</div>
            <div className="opacity-70">admin@drdiet.in</div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 py-1 overflow-hidden">
          {NAV.map(item => {
            const isActive = item === activeNav
            return (
              <div
                key={item}
                className="flex items-center gap-2.5 py-[9px] text-[12.5px] cursor-pointer"
                style={isActive ? {
                  paddingLeft: 16, paddingRight: 10,
                  background: t.sb_navActive, color: t.sb_navActiveText,
                  borderRadius: '0 10px 10px 0', marginRight: 10,
                  boxShadow: t.sb_navActiveShadow, fontWeight: 600,
                } : {
                  paddingLeft: 16,
                  color: t.sb_navText,
                }}
              >
                <span
                  className="rounded-full flex-shrink-0"
                  style={{
                    display: 'inline-block', width: 6, height: 6,
                    background: isActive ? t.sb_navActiveText : t.sb_dot,
                    boxShadow: isActive ? undefined : t.sb_dotGlow,
                    opacity: isActive ? 0.8 : 0.6,
                  }}
                />
                {item}
              </div>
            )
          })}
        </div>

        <div className="px-4 pb-4 text-[10px]" style={{ color: t.sb_footer }}>v2.5.0 · DrDiet</div>
      </div>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden" style={{ background: t.p_bg }}>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 flex-shrink-0"
          style={{ height: 52, background: t.h_bg, borderBottom: `1px solid ${t.h_border}` }}
        >
          <span className="text-[15px] font-bold" style={{ color: t.h_title }}>Patient Management</span>
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-lg text-sm"
              style={{ width: 32, height: 32, background: t.h_notifBg, color: t.h_notifIcon }}
            >🔔</div>
            <div
              className="flex items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ width: 32, height: 32, background: t.sb_avatar }}
            >AD</div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden p-5 flex flex-col gap-4">

          {/* Page top */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[17px] font-bold" style={{ color: t.p_title }}>All Patients</div>
              <div className="text-[11px] mt-0.5" style={{ color: t.p_sub }}>Manage and monitor all registered patients</div>
            </div>
            <button
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold text-white border-0 cursor-pointer"
              style={{ background: t.btn, boxShadow: t.btnShadow }}
            >
              + Add Patient
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-2.5">
            {STATS.map(s => (
              <div key={s.label} className="rounded-xl p-3.5" style={{ background: t.sc_bg, border: `1px solid ${t.sc_border}` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="flex items-center justify-center rounded-lg text-sm flex-shrink-0"
                    style={{ width: 30, height: 30, background: t.sc_iconBg, color: t.sc_iconColor }}
                  >{s.icon}</div>
                  <span className="text-[10px] font-medium leading-tight" style={{ color: t.sc_label }}>{s.label}</span>
                </div>
                <div className="text-xl font-bold" style={{ color: t.sc_value }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-xl overflow-hidden flex-1" style={{ background: t.t_bg, border: `1px solid ${t.t_border}` }}>
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: t.t_toolbarBg, borderBottom: `1px solid ${t.t_border}` }}>
              <input
                readOnly
                placeholder="Search patients…"
                className="flex-1 h-[28px] rounded-md px-2.5 text-[11px] outline-none border"
                style={{ background: t.t_searchBg, borderColor: t.t_searchBorder, color: t.t_searchText }}
              />
              {['All', 'Active', 'Pending'].map(p => (
                <span key={p} className="px-2.5 py-0.5 rounded text-[11px] border cursor-pointer" style={{ background: t.t_pillBg, borderColor: t.t_pillBorder, color: t.t_pillText }}>{p}</span>
              ))}
            </div>
            {/* Head */}
            <div className="flex px-3 py-2 text-[10px] font-semibold uppercase tracking-wider" style={{ background: t.t_headBg, color: t.t_headText }}>
              <div className="flex-[2]">Patient</div>
              <div className="flex-[1.5]">Department</div>
              <div className="flex-1">Status</div>
              <div className="flex-1">Verified</div>
            </div>
            {/* Rows */}
            {ROWS.map(row => (
              <div
                key={row.name}
                className="flex items-center px-3 py-2.5 text-[11px]"
                style={{ borderTop: `1px solid ${t.t_rowBorder}` }}
              >
                <div className="flex-[2]">
                  <div className="font-semibold text-xs" style={{ color: t.t_name }}>{row.name}</div>
                  <div style={{ color: t.t_email }}>{row.email}</div>
                </div>
                <div className="flex-[1.5]" style={{ color: t.t_email }}>{row.dept}</div>
                <div className="flex-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: t.t_badgeGreenBg, color: t.t_badgeGreenText }}>
                    {row.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: row.approved ? t.t_badgeSecBg : t.t_headBg, color: row.approved ? t.t_badgeSecText : t.t_headText }}>
                    {row.approved ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Color swatch strip ───────────────────────────────────────────────────────
const SWATCH_COLORS: Record<string, string[]> = {
  arctic:   ['#1a2332', '#0f1622', '#2D7DD2', '#f8fafc', '#0f172a', '#dcfce7'],
  midnight: ['#0a0a0f', '#111827', '#6366f1', '#1f2937', '#f9fafb', '#374151'],
  matcha:   ['#052e16', '#064e3b', '#10b981', '#f0fdf4', '#052e16', '#bbf7d0'],
  warm:     ['#1c1008', '#292018', '#f59e0b', '#fdf8ef', '#1c1008', '#fef3c7'],
  ivory:    ['#1a100a', '#2c1f14', '#c17b5c', '#fdf9f4', '#faf6f0', '#f5e6d8'],
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ThemePreviewPage() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#0c0c0e] px-5 py-12">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="text-center mb-14">
        <h1 className="text-white text-[32px] font-extrabold tracking-tight mb-2">DrDiet Theme Preview</h1>
        <p className="text-white/40 text-sm max-w-lg mx-auto">
          4 themes distilled from Tabler, Linear, Vercel and healthcare color research.
          Click any theme to select it.
        </p>
      </div>

      {/* ── Theme cards ──────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-20">
        {THEMES.map((theme, i) => {
          const isSelected = selected === theme.id
          return (
            <div key={theme.id} className="w-full" style={{ maxWidth: 940 }}>

              {/* Theme header row */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-4">
                  <span className="text-white/20 text-sm font-mono">0{i + 1}</span>
                  <div>
                    <h2 className="text-white text-xl font-bold leading-tight">{theme.name}</h2>
                    <p className="text-white/40 text-xs mt-0.5">{theme.subtitle}</p>
                  </div>
                  {/* Color swatches */}
                  <div className="flex items-center gap-1 ml-2">
                    {SWATCH_COLORS[theme.id].map((c, ci) => (
                      <div key={ci} className="rounded-full border border-white/10" style={{ width: 16, height: 16, background: c }} title={c} />
                    ))}
                  </div>
                </div>
                <span className="text-white/30 text-[11px] italic max-w-[240px] text-right leading-relaxed">
                  {theme.inspiration}
                </span>
              </div>

              {/* Preview — click to select */}
              <div
                onClick={() => setSelected(isSelected ? null : theme.id)}
                className="cursor-pointer transition-all duration-200 relative"
                style={{
                  borderRadius: 20, padding: 3,
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.04))'
                    : 'rgba(255,255,255,0.03)',
                  border: isSelected ? '1.5px solid rgba(255,255,255,0.2)' : '1.5px solid rgba(255,255,255,0.06)',
                  boxShadow: isSelected ? '0 0 0 4px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.3)',
                }}
              >
                <DashMock t={theme} activeNav="Patients" />

                {/* Selected checkmark badge */}
                {isSelected && (
                  <div
                    className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                    style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    ✓ Selected
                  </div>
                )}
              </div>

              {/* Under-card label */}
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-white/20 text-[11px]">
                  {isSelected ? '✓ Marked as your pick — tell me to apply it' : 'Click to select'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Sticky bottom banner ─────────────────────────────── */}
      {selected && (() => {
        const t = THEMES.find(x => x.id === selected)!
        return (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div
              className="flex items-center gap-4 px-6 py-3 rounded-2xl border pointer-events-auto"
              style={{ background: 'rgba(12,12,14,0.92)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
            >
              <div className="flex gap-1">
                {SWATCH_COLORS[t.id].slice(0, 4).map((c, i) => (
                  <div key={i} className="rounded-full" style={{ width: 12, height: 12, background: c }} />
                ))}
              </div>
              <span className="text-white/60 text-sm">Selected:</span>
              <span className="text-white font-bold text-sm">{t.name}</span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/40 text-xs">{t.subtitle}</span>
              <button
                onClick={() => setSelected(null)}
                className="ml-1 text-white/30 hover:text-white/70 transition-colors text-xs bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )
      })()}

      {/* Bottom padding for sticky bar */}
      <div className="h-20" />
    </div>
  )
}
