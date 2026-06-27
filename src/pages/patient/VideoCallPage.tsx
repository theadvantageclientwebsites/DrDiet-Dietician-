import { useParams, useNavigate } from 'react-router-dom'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor } from 'lucide-react'
import { useState } from 'react'

export default function VideoCallPage() {
  const { roomId }  = useParams()
  const navigate    = useNavigate()
  const [mic, setMic]     = useState(true)
  const [cam, setCam]     = useState(true)
  const [screen, setScr]  = useState(false)

  const endCall = () => navigate(-1)

  return (
    <div className="w-full h-[calc(100dvh-64px)] flex flex-col bg-[#0c1a1f]">
      <div className="flex-1 relative flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-white/60">
            <div className="w-24 h-24 rounded-full bg-[#1a3c4d] flex items-center justify-center text-3xl font-bold text-white">
              JW
            </div>
            <p className="text-[15px] font-semibold text-white">Dr. James Wilson</p>
            <p className="text-[13px]">{roomId ? 'Connecting…' : 'Waiting for doctor…'}</p>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 w-28 sm:w-36 aspect-video bg-[#1a3c4d] rounded-xl border border-white/10 flex items-center justify-center text-white/50 text-[12px]">
          {cam ? 'Your Camera' : <VideoOff size={18} />}
        </div>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 text-white text-[12px] px-3 py-1.5 rounded-full backdrop-blur-sm">
          Room: {roomId ?? 'preview'}
        </div>
      </div>

      <div className="h-20 bg-[#0c1a1f] border-t border-white/10 flex items-center justify-center gap-4 shrink-0">
        <button
          onClick={() => setMic(m => !m)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${mic ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white'}`}
        >
          {mic ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={() => setCam(c => !c)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${cam ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white'}`}
        >
          {cam ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        <button
          onClick={() => setScr(s => !s)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${screen ? 'bg-[#1a6b7a] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          <Monitor size={20} />
        </button>

        <button
          onClick={endCall}
          className="w-14 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  )
}
