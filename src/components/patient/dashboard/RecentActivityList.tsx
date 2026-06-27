const DUMMY_ACTIVITIES = [
  { id: '1', dot: '#1a6b7a', title: 'New Lab Result',       message: 'Your annual blood work results are now available.',  time: '2h ago',  read: false },
  { id: '2', dot: '#f59e0b', title: 'Medication Reminder',  message: 'Time for your daily Vit-D supplement.',               time: '5h ago',  read: false },
  { id: '3', dot: '#16a34a', title: 'Diet Plan Updated',    message: 'Dr. James has updated your weekly meal plan.',        time: '1d ago',  read: true  },
  { id: '4', dot: '#2d96a4', title: 'New Message',          message: 'You have a new message from your dietician.',         time: '2d ago',  read: true  },
]

export default function RecentActivityList() {
  return (
    <div className="flex flex-col gap-3">
      {DUMMY_ACTIVITIES.map(item => (
        <div
          key={item.id}
          className={`bg-white rounded-2xl border px-5 py-4 flex items-start gap-4 transition-all hover:border-[#a8d8e2] hover:bg-[#f5fcfd] hover:shadow-[0_2px_12px_rgba(26,107,122,0.07)] cursor-pointer ${item.read ? 'border-[#e6edf0]' : 'border-[#c8e8ef]'}`}
        >
          <span className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.dot }} />

          <div className="flex-1 min-w-0">
            <p className={`text-[13px] leading-snug mb-0.5 ${item.read ? 'font-medium text-[#374955]' : 'font-bold text-[#1a3c4d]'}`}>
              {item.title}
            </p>
            <p className="text-[12px] text-[#6b8896] leading-relaxed line-clamp-2">
              {item.message}
            </p>
          </div>

          <span className="text-[11px] text-[#9ab0bb] shrink-0 mt-0.5 whitespace-nowrap">
            {item.time}
          </span>
        </div>
      ))}
    </div>
  )
}
