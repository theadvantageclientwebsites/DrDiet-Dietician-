import { useState } from 'react'
import { Bell, CalendarDays, UtensilsCrossed, MessageSquare, CreditCard, Settings } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'
import EmptyState from '@/components/patient/shared/EmptyState'

type NType = 'appointment' | 'diet_plan' | 'chat' | 'payment' | 'system'

interface Notif {
  id: string
  type: NType
  title: string
  message: string
  createdAt: string
  isRead: boolean
}

const TYPE_META: Record<NType, { icon: React.ReactNode; dot: string; bg: string }> = {
  appointment: { icon: <CalendarDays size={16} />,     dot: '#1a6b7a', bg: '#d0ecf2' },
  diet_plan:   { icon: <UtensilsCrossed size={16} />,  dot: '#16a34a', bg: '#dcfce7' },
  chat:        { icon: <MessageSquare size={16} />,    dot: '#2d96a4', bg: '#cce6ec' },
  payment:     { icon: <CreditCard size={16} />,       dot: '#f59e0b', bg: '#fef3c7' },
  system:      { icon: <Settings size={16} />,         dot: '#6b8896', bg: '#e6edf0' },
}

const DUMMY: Notif[] = [
  { id: '1', type: 'appointment', title: 'Appointment Confirmed',    message: 'Your consultation on July 10 at 10:00 AM is confirmed.',               createdAt: '2025-07-07T10:00:00Z', isRead: false },
  { id: '2', type: 'diet_plan',   title: 'New Diet Plan Available',  message: 'Dr. Priya has uploaded your July nutrition plan. Check it out.',        createdAt: '2025-07-05T14:30:00Z', isRead: false },
  { id: '3', type: 'chat',        title: 'New Message',              message: 'Dr. James Wilson sent you a message regarding your last report.',        createdAt: '2025-07-04T09:15:00Z', isRead: true  },
  { id: '4', type: 'payment',     title: 'Payment Successful',       message: 'Payment of ₹999 for your consultation was received.',                   createdAt: '2025-07-01T11:00:00Z', isRead: true  },
  { id: '5', type: 'appointment', title: 'Appointment Reminder',     message: 'Reminder: You have a session tomorrow at 4:00 PM.',                    createdAt: '2025-06-30T18:00:00Z', isRead: true  },
  { id: '6', type: 'system',      title: 'Profile Updated',          message: 'Your profile information was updated successfully.',                    createdAt: '2025-06-28T07:00:00Z', isRead: true  },
]

function relTime(dt: string): string {
  const d = Math.floor((Date.now() - new Date(dt).getTime()) / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  if (d < 7)  return `${d}d ago`
  return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(DUMMY)
  const [filter, setFilter] = useState<NType | 'all'>('all')

  const visible  = filter === 'all' ? notifs : notifs.filter(n => n.type === filter)
  const unread   = notifs.filter(n => !n.isRead).length

  const markAll  = () => setNotifs(n => n.map(x => ({ ...x, isRead: true })))
  const markOne  = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, isRead: true } : x))

  return (
    <PageShell
      title="Notifications"
      subtitle={unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up'}
      action={unread > 0 ? <PrimaryButton size="sm" variant="outline" onClick={markAll}>Mark all read</PrimaryButton> : undefined}
    >
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'appointment', 'diet_plan', 'chat', 'payment', 'system'] as const).map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold capitalize border transition-all ${
              filter === t
                ? 'bg-[#1a6b7a] text-white border-[#1a6b7a]'
                : 'bg-white text-[#6b8896] border-[#e6edf0] hover:border-[#a8d8e2]'
            }`}
          >
            {t === 'diet_plan' ? 'Diet Plan' : t}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<Bell size={24} />}
          title="No notifications"
          description="You're all caught up! Check back later."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map(n => {
            const meta = TYPE_META[n.type]
            return (
              <div
                key={n.id}
                onClick={() => markOne(n.id)}
                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-[0_2px_12px_rgba(26,107,122,0.07)] ${
                  n.isRead ? 'bg-white border-[#e6edf0]' : 'bg-[#f5fcfd] border-[#c8e8ef]'
                }`}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[#1a6b7a]" style={{ background: meta.bg }}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] leading-snug mb-0.5 ${n.isRead ? 'font-medium text-[#374955]' : 'font-bold text-[#1a3c4d]'}`}>
                    {n.title}
                  </p>
                  <p className="text-[12px] text-[#6b8896] leading-relaxed">{n.message}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[11px] text-[#9ab0bb] whitespace-nowrap">{relTime(n.createdAt)}</span>
                  {!n.isRead && <span className="w-2 h-2 rounded-full" style={{ background: meta.dot }} />}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
