import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

const T = 'hsl(174,68%,36%)'
const CHECK = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
const PatIco = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>
const IntIco = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>

const roles = [
  { ico: <PatIco />, title: 'Join as a Patient', desc: 'Manage chronic conditions, monitor diet, and receive professional medical guidance tailored to your health goals.', feats: ['Personalized Diet Plans', 'Blood Report Access'], route: ROUTES.SIGN_UP_PATIENT },
  { ico: <IntIco />, title: 'Join as an Intern', desc: 'Accelerate your medical career with structured learning, clinical case studies, and professional certification programmes.', feats: ['Clinical Case Access', 'Professional Certifications'], route: ROUTES.SIGN_UP_INTERN },
]

export default function HomePage() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-[#eef1f4] flex flex-col">
      {/* Sticky Navbar — responsive */}
      <nav className="w-full bg-white border-b border-[#e8ecf0] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-3.5 flex items-center justify-between">
          <span className="text-[15px] sm:text-[16px] font-bold" style={{ color: T }}>DrDietTherapy</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => nav(ROUTES.SIGN_IN)}
              className="text-[12px] sm:text-[13px] font-medium text-[#374151] px-3 sm:px-4 py-2 rounded-lg hover:bg-[#f3f4f6] transition-colors">
              Sign In
            </button>
            <button onClick={() => nav(ROUTES.SIGN_UP)}
              className="text-[12px] sm:text-[13px] font-semibold text-white px-3 sm:px-5 py-2 rounded-lg transition-colors"
              style={{ background: T }}>
              Join Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero — centered, scales up on desktop */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-center">
        <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold text-[#111827] leading-tight max-w-xl">
          DrDietTherapy
        </h1>
        <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#6b7280] mt-3 max-w-md leading-relaxed">
          Welcome to your personalized healthcare and education journey.
        </p>

        {/* Role cards — 1 col mobile, 2 col tablet/desktop */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl lg:max-w-2xl">
          {roles.map(({ ico, title, desc, feats, route }) => (
            <div key={title}
              onClick={() => nav(route)}
              className="bg-white rounded-2xl border border-[#e8ecf0] p-5 sm:p-6 flex flex-col gap-3 text-left cursor-pointer hover:border-[hsl(174,68%,36%)] hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-full bg-[hsl(174,60%,94%)] flex items-center justify-center">{ico}</div>
              <p className="text-[14px] sm:text-[15px] font-semibold text-[#111827]">{title}</p>
              <p className="text-[12px] sm:text-[13px] text-[#6b7280] leading-relaxed">{desc}</p>
              <div className="flex flex-col gap-1.5">
                {feats.map(f => (
                  <span key={f} className="flex items-center gap-1.5 text-[12px] sm:text-[13px]" style={{ color: T }}>
                    <CHECK />{f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => nav(ROUTES.SIGN_UP)}
          className="mt-8 w-full max-w-xs sm:max-w-sm h-11 sm:h-12 text-white text-[14px] font-semibold rounded-xl transition-colors"
          style={{ background: T }}>
          Continue to Registration
        </button>
        <p className="mt-3 text-[12px] text-[#9ca3af]">
          Already have an account?{' '}
          <button onClick={() => nav(ROUTES.SIGN_IN)} className="font-semibold hover:underline" style={{ color: T }}>Sign In</button>
        </p>
      </main>

      <footer className="py-5 text-center text-[11px] text-[#c4c9d4] border-t border-[#e8ecf0] bg-white">
        © {new Date().getFullYear()} DrDietTherapy. All rights reserved.
      </footer>
    </div>
  )
}
