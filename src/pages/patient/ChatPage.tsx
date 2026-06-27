import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip } from 'lucide-react'

type Sender = 'patient' | 'doctor'

interface Message {
  id: string
  sender: Sender
  content: string
  timestamp: string
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', sender: 'doctor',  content: 'Hello! How are you feeling today? Any updates on the thyroid medication?', timestamp: '10:02 AM' },
  { id: '2', sender: 'patient', content: 'Hi Doctor! Feeling a bit better. The fatigue has reduced. I have been following the diet plan you shared.',  timestamp: '10:05 AM' },
  { id: '3', sender: 'doctor',  content: 'Great to hear! Keep up the consistency. Make sure you are having the Brazil nuts daily and avoiding raw broccoli.',  timestamp: '10:07 AM' },
  { id: '4', sender: 'patient', content: 'Yes, I have noted that. Should I also avoid coffee?', timestamp: '10:09 AM' },
  { id: '5', sender: 'doctor',  content: 'Limit to 1 cup a day, preferably after breakfast. Avoid it on an empty stomach.', timestamp: '10:10 AM' },
]

function formatNow() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput]       = useState('')
  const bottomRef               = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'patient', content: text, timestamp: formatNow() }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'doctor', content: 'Thanks for sharing. I will review and get back to you shortly.', timestamp: formatNow() }])
    }, 1500)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="w-full h-[calc(100dvh-64px)] flex flex-col">
      <div className="px-4 sm:px-6 lg:px-10 py-4 border-b border-[#e6edf0] bg-white flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#d0ecf2] flex items-center justify-center text-[#1a6b7a] font-bold text-sm shrink-0">
          JW
        </div>
        <div>
          <p className="text-[14px] font-bold text-[#1a3c4d]">Dr. James Wilson</p>
          <p className="text-[11px] text-[#16a34a] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] inline-block" /> Online
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col gap-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] sm:max-w-[60%] rounded-2xl px-4 py-2.5 ${
              msg.sender === 'patient'
                ? 'bg-[#1a6b7a] text-white rounded-br-sm'
                : 'bg-white border border-[#e6edf0] text-[#1a3c4d] rounded-bl-sm'
            }`}>
              <p className="text-[13px] leading-relaxed">{msg.content}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'patient' ? 'text-white/60' : 'text-[#9ab0bb]'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 sm:px-6 lg:px-10 py-3 border-t border-[#e6edf0] bg-white shrink-0">
        <div className="flex items-end gap-2 bg-[#f7fafb] border border-[#d0dde2] rounded-2xl px-3 py-2 focus-within:border-[#1a6b7a] transition-colors">
          <button className="text-[#9ab0bb] hover:text-[#1a6b7a] transition-colors shrink-0 mb-0.5">
            <Paperclip size={18} />
          </button>
          <textarea
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-[13px] text-[#1a3c4d] outline-none resize-none placeholder:text-[#9ab0bb] leading-relaxed max-h-28"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-xl bg-[#1a6b7a] text-white flex items-center justify-center shrink-0 hover:bg-[#155f6d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-[11px] text-[#9ab0bb] mt-1.5 px-1">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
