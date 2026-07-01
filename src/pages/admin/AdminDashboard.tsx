/**
 * AdminDashboard — Practice Overview
 * Sections: stat cards, revenue chart, recent activities, upcoming appointments
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, GraduationCap,
  Video, UserPlus, Package, MoreHorizontal, AlertTriangle,
  RefreshCw, Stethoscope, Clock,
} from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'
import StatCard       from '@/components/admin/StatCard'
import StatusBadge    from '@/components/admin/StatusBadge'
import AdminBtn       from '@/components/admin/AdminBtn'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'
import { ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/authStore'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'

// ─── Stat-card skeleton ───────────────────────────────────────────────────────
function StatCardSkeleton({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{
      background:   dark
        ? 'linear-gradient(135deg, #1e4d5a 0%, #1a5566 100%)'
        : COLORS.white,
      borderRadius: '16px',
      padding:      '20px',
      boxShadow:    '0 1px 4px rgba(0,0,0,0.08)',
      border:       dark ? 'none' : `1px solid ${COLORS.divider}`,
      display:      'flex',
      alignItems:   'flex-start',
      gap:          '14px',
      minHeight:    '92px',
      overflow:     'hidden',
      position:     'relative',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="skeleton-pulse" style={{
          height: '12px', width: '60%', borderRadius: '6px',
          background: dark ? 'rgba(255,255,255,0.15)' : COLORS.divider,
        }} />
        <div className="skeleton-pulse" style={{
          height: '28px', width: '40%', borderRadius: '6px',
          background: dark ? 'rgba(255,255,255,0.2)' : '#e6edf0',
        }} />
        <div className="skeleton-pulse" style={{
          height: '10px', width: '50%', borderRadius: '6px',
          background: dark ? 'rgba(255,255,255,0.1)' : COLORS.divider,
        }} />
      </div>
    </div>
  )
}

// ─── Error banner ─────────────────────────────────────────────────────────────
function SummaryErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      gap:          '10px',
      padding:      '12px 16px',
      borderRadius: '12px',
      background:   '#fff7ed',
      border:       '1px solid #fed7aa',
      marginBottom: '20px',
      flexWrap:     'wrap',
    }}>
      <AlertTriangle size={16} color="#ea580c" />
      <span style={{ flex: 1, fontSize: FONT_SIZE.sm, color: '#c2410c', minWidth: '200px' }}>
        Could not load dashboard summary. Showing last known values.
      </span>
      <button
        onClick={onRetry}
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            '5px',
          padding:        '5px 12px',
          borderRadius:   '7px',
          background:     '#ea580c',
          color:          '#fff',
          border:         'none',
          cursor:         'pointer',
          fontSize:       '12px',
          fontWeight:     FONT_WEIGHT.semibold,
          whiteSpace:     'nowrap',
        }}
      >
        <RefreshCw size={12} />
        Retry
      </button>
    </div>
  )
}


const CHART_DATA = [
  { month: 'May', consultations: 12000, packages: 7000 },
  { month: 'Jun', consultations: 18000, packages: 9000 },
  { month: 'Jul', consultations: 15000, packages: 11000 },
  { month: 'Aug', consultations: 22000, packages: 13000 },
  { month: 'Sep', consultations: 19000, packages: 15000 },
  { month: 'Oct', consultations: 26000, packages: 18000 },
]

const ACTIVITIES = [
  { id: '1', initials: 'SM', name: 'Sarah Miller',  action: 'Weight Loss Plan Update',    status: 'completed', time: '2h ago' },
  { id: '2', initials: 'JD', name: 'John Doe',      action: 'Initial Consultation',       status: 'active',    time: '5h ago' },
  { id: '3', initials: 'EK', name: 'Elena Kostic',  action: 'Premium Package Enrollment', status: 'completed', time: 'Yesterday' },
  { id: '4', initials: 'AR', name: 'Arun Reddy',    action: 'Blood Report Submitted',     status: 'pending',   time: 'Yesterday' },
]

const APPOINTMENTS = [
  { id: '1', name: 'Michael Vance', type: 'Diabetes Management Follow-up', date: 'OCT 24', time: '09:30 AM', status: 'confirmed' },
  { id: '2', name: 'Anita Chen',    type: 'Sports Nutrition Planning',      date: 'OCT 25', time: '11:00 AM', status: 'pending'   },
  { id: '3', name: 'Ravi Sharma',   type: 'Thyroid Package Session',        date: 'OCT 26', time: '02:00 PM', status: 'confirmed' },
]

const APPT_BORDER: Record<string, string> = {
  confirmed: COLORS.brand,
  pending:   '#f59e0b',
  cancelled: '#dc2626',
}

// ─── Simple SVG line+area chart ───────────────────────────────────────────────
function RevenueChart({ period }: { period: string }) {
  const max = 30000
  const W = 520, H = 180, PL = 48, PR = 16, PT = 10, PB = 32
  const cW = W - PL - PR
  const cH = H - PT - PB
  const n  = CHART_DATA.length

  const xOf = (i: number) => PL + (i / (n - 1)) * cW
  const yOf = (v: number) => PT + cH - (v / max) * cH

  const buildPath = (key: 'consultations' | 'packages') =>
    CHART_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'}${xOf(i)},${yOf(d[key])}`).join(' ')

  const buildArea = (key: 'consultations' | 'packages') =>
    `${buildPath(key)} L${xOf(n - 1)},${PT + cH} L${xOf(0)},${PT + cH} Z`

  const yTicks = [0, 10000, 20000, 30000]
  const shown = period !== 'This Week'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.brand} stopOpacity="0.18" />
          <stop offset="100%" stopColor={COLORS.brand} stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map(v => (
        <g key={v}>
          <line x1={PL} y1={yOf(v)} x2={W - PR} y2={yOf(v)} stroke={COLORS.divider} strokeWidth="1" />
          <text x={PL - 6} y={yOf(v) + 4} textAnchor="end" fontSize="10" fill={COLORS.muted}>
            {v === 0 ? '$0k' : `$${v / 1000}k`}
          </text>
        </g>
      ))}

      {/* X labels */}
      {CHART_DATA.map((d, i) => (
        <text key={d.month} x={xOf(i)} y={H - 6} textAnchor="middle" fontSize="10" fill={COLORS.muted}>
          {d.month}
        </text>
      ))}

      {shown && (
        <>
          {/* Area fills */}
          <path d={buildArea('packages')}      fill="url(#ga)" />
          <path d={buildArea('consultations')} fill="url(#gc)" />

          {/* Lines */}
          <path d={buildPath('packages')}      fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d={buildPath('consultations')} fill="none" stroke={COLORS.brand} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots */}
          {CHART_DATA.map((d, i) => (
            <g key={i}>
              <circle cx={xOf(i)} cy={yOf(d.consultations)} r="4" fill={COLORS.brand} />
              <circle cx={xOf(i)} cy={yOf(d.packages)} r="3.5" fill="#f59e0b" />
            </g>
          ))}
        </>
      )}
    </svg>
  )
}

// ─── Avatar circle ────────────────────────────────────────────────────────────
function AvatarCircle({ initials }: { initials: string }) {
  return (
    <div style={{
      width:'34px', height:'34px', minWidth:'34px', borderRadius:'50%',
      background: COLORS.brandLight, color: COLORS.brand,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:'12px', fontWeight: FONT_WEIGHT.semibold,
    }}>
      {initials}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const nav            = useNavigate()
  const { user }       = useAuthStore()
  const [period, setPeriod] = useState('Last 6 Months')

  // ── Live summary data ────────────────────────────────────────────────────
  const { summary, isLoading: summaryLoading, isError: summaryError, refetch } = useAdminDashboard()

  return (
    <>
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }

        .ad-stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (min-width: 1024px) {
          .ad-stat-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .ad-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        @media (min-width: 1024px) {
          .ad-main-grid { grid-template-columns: 1fr 340px; }
        }

        .ad-chart-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          border: 1px solid #e6edf0;
          overflow: hidden;
        }
        .ad-chart-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 16px;
        }
        .ad-period-select {
          padding: 6px 28px 6px 12px;
          border-radius: 8px;
          border: 1px solid #e6edf0;
          background: #f7fafb;
          font-size: 13px;
          color: #374955;
          cursor: pointer;
          outline: none;
          appearance: none;
          font-family: inherit;
        }

        .ad-appt-list { display: flex; flex-direction: column; gap: 10px; }
        .ad-appt-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid #e6edf0;
        }
        .ad-date-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 40px;
        }

        /* Activity table → cards on mobile */
        .ad-act-table { width: 100%; border-collapse: collapse; }
        .ad-act-table th {
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: #9ab0bb;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 8px 12px;
          border-bottom: 1px solid #e6edf0;
        }
        .ad-act-table td {
          padding: 10px 12px;
          font-size: 13px;
          color: #374955;
          border-bottom: 1px solid #f7fafb;
          vertical-align: middle;
        }
        .ad-act-table tr:last-child td { border-bottom: none; }
        .ad-act-table tr:hover td { background: #f7fafb; }

        /* Mobile: hide table, show cards */
        .ad-act-desktop { display: none; }
        .ad-act-mobile  { display: flex; flex-direction: column; gap: 8px; }
        @media (min-width: 640px) {
          .ad-act-desktop { display: block; }
          .ad-act-mobile  { display: none; }
        }
      `}</style>

      <AdminPageShell
        title="Practice Overview"
        subtitle={`Welcome back${user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}. Here's what's happening with your clinic today.`}
        actions={
          <>
            <AdminBtn icon={<UserPlus size={15} />} onClick={() => nav(ROUTES.ADMIN.PATIENTS)}>
              Add Patient
            </AdminBtn>
            <AdminBtn variant="secondary" icon={<Package size={15} />} onClick={() => nav(ROUTES.ADMIN.PACKAGES)}>
              Create Package
            </AdminBtn>
          </>
        }
      >
        {/* ── Error banner (only shown on fetch failure) ───────────── */}
        {summaryError && <SummaryErrorBanner onRetry={refetch} />}

        {/* ── Stat cards ──────────────────────────────────────────────── */}
        <div className="ad-stat-grid">
          {summaryLoading ? (
            <>
              <StatCardSkeleton dark />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                dark
                icon={<Users size={22} strokeWidth={1.8} />}
                label="Total Patients"
                value={(summary.totalPatients ?? 0).toLocaleString()}
                linkLabel="View All"
                onLink={() => nav(ROUTES.ADMIN.PATIENTS)}
              />
              <StatCard
                icon={<Stethoscope size={20} strokeWidth={1.8} />}
                label="Total Doctors"
                value={(summary.totalDoctors ?? 0).toLocaleString()}
                linkLabel="Manage Doctors"
                onLink={() => nav(ROUTES.ADMIN.PATIENTS)}
              />
              <StatCard
                icon={<Clock size={20} strokeWidth={1.8} />}
                label="Pending Doctor Approvals"
                value={(summary.pendingDoctors ?? 0).toLocaleString()}
                accentColor={summary.pendingDoctors > 0 ? '#f59e0b' : undefined}
                linkLabel={summary.pendingDoctors > 0 ? 'Review Now' : undefined}
                onLink={summary.pendingDoctors > 0 ? () => nav(ROUTES.ADMIN.PATIENTS) : undefined}
              />
              <StatCard
                icon={<GraduationCap size={20} strokeWidth={1.8} />}
                label="Total Interns"
                value={(summary.totalInterns ?? 0).toLocaleString()}
                linkLabel="View All"
                onLink={() => nav(ROUTES.ADMIN.INTERNS)}
              />
            </>
          )}
        </div>

        {/* ── Revenue chart + Upcoming Appointments ───────────────────── */}
        <div className="ad-main-grid">
          {/* Chart */}
          <div className="ad-chart-card">
            <div className="ad-chart-header">
              <div>
                <p style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, margin: 0 }}>Revenue Growth</p>
                <p style={{ fontSize: '11px', color: COLORS.muted, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Consultations vs Packages</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width:'10px', height:'10px', borderRadius:'50%', background: COLORS.brand, display:'inline-block' }} />
                  <span style={{ fontSize:'11px', color: COLORS.muted }}>Consultations</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#f59e0b', display:'inline-block' }} />
                  <span style={{ fontSize:'11px', color: COLORS.muted }}>Packages</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <select
                    className="ad-period-select"
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                  >
                    <option>This Week</option>
                    <option>Last 6 Months</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ height: '180px' }}>
              <RevenueChart period={period} />
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="ad-chart-card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
              <p style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, margin: 0 }}>Upcoming Appointments</p>
              <button style={{ background:'none', border:'none', cursor:'pointer', color: COLORS.muted, display:'flex' }}>
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="ad-appt-list">
              {APPOINTMENTS.map(a => (
                <div key={a.id} className="ad-appt-card" style={{ borderLeft: `3px solid ${APPT_BORDER[a.status] ?? COLORS.divider}` }}>
                  <div className="ad-date-badge">
                    <span style={{ fontSize:'10px', color: APPT_BORDER[a.status], fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>
                      {a.date.split(' ')[0]}
                    </span>
                    <span style={{ fontSize:'18px', fontWeight:700, color: COLORS.navy, lineHeight:1 }}>
                      {a.date.split(' ')[1]}
                    </span>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'6px' }}>
                      <p style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, margin:0, lineHeight:1.3 }}>{a.name}</p>
                      <span style={{ fontSize:'11px', color: COLORS.muted, whiteSpace:'nowrap', flexShrink:0 }}>{a.time}</span>
                    </div>
                    <p style={{ fontSize:'12px', color: COLORS.muted, margin:'3px 0 8px', lineHeight:1.3 }}>{a.type}</p>
                    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                      {a.status === 'confirmed' && (
                        <button style={{
                          padding:'4px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:600,
                          background: COLORS.brand, color:'#fff', border:'none', cursor:'pointer',
                          display:'flex', alignItems:'center', gap:'4px',
                        }}>
                          <Video size={11} /> Start Call
                        </button>
                      )}
                      <button style={{
                        padding:'4px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:600,
                        background: COLORS.brandLight, color: COLORS.brand, border:'none', cursor:'pointer',
                      }}>
                        {a.status === 'pending' ? 'Reschedule' : 'Details'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Activities ────────────────────────────────────────── */}
        <div className="ad-chart-card">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
            <p style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, margin: 0 }}>Recent Activities</p>
            <button
              onClick={() => nav(ROUTES.ADMIN.PATIENTS)}
              style={{ background:'none', border:'none', cursor:'pointer', color: COLORS.brand, fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold }}
            >
              View All
            </button>
          </div>

          {/* Desktop table */}
          <div className="ad-act-desktop">
            <table className="ad-act-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Action</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVITIES.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <AvatarCircle initials={a.initials} />
                        <span style={{ fontWeight: FONT_WEIGHT.medium, color: COLORS.navy }}>{a.name}</span>
                      </div>
                    </td>
                    <td>{a.action}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td style={{ color: COLORS.muted }}>{a.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="ad-act-mobile">
            {ACTIVITIES.map(a => (
              <div key={a.id} style={{
                display:'flex', alignItems:'center', gap:'10px',
                padding:'10px 12px', borderRadius:'10px', background: '#f7fafb',
              }}>
                <AvatarCircle initials={a.initials} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
                    <span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>{a.name}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2px' }}>
                    <span style={{ fontSize:'12px', color: COLORS.muted }}>{a.action}</span>
                    <span style={{ fontSize:'11px', color: COLORS.muted, flexShrink:0 }}>{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminPageShell>
    </>
  )
}
