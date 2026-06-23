import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { C } from '@/config/colors'

const PatIco = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.brand} strokeWidth="1.7"><circle cx="10" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h5"/><circle cx="18" cy="18" r="3"/><line x1="20.5" y1="20.5" x2="23" y2="23"/></svg>
const IntIco = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.brand} strokeWidth="1.7"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
const CircleChk = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.brand} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>

const roles = [
  { ico: <PatIco />, title: 'Join as a Patient', desc: 'Manage your chronic conditions, monitor your diet, and receive professional medical guidance tailored to your health goals.', feats: ['Personalized Diet Plans', 'Direct Doctor Access'], route: ROUTES.SIGN_UP_PATIENT },
  { ico: <IntIco />, title: 'Join as an Intern', desc: 'Accelerate your medical career with structured learning, clinical case studies, and professional certification programmes.', feats: ['Professional Certifications', 'Clinical Case Access'], route: ROUTES.SIGN_UP_INTERN },
]

export default function HomePage() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.pageBg }}>
      <nav className="w-full bg-white sticky top-0 z-20" style={{ borderBottom: `1px solid ${C.divider}` }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between">
          <span className="text-[16px] font-bold" style={{ color: C.brand }}>DrDietTherapy</span>
          <div className="flex items-center gap-3">
            <button onClick={() => nav(ROUTES.SIGN_IN)} className="text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-[#f4f8f9]" style={{ color: C.navy }}>Sign In</button>
            <button onClick={() => nav(ROUTES.SIGN_UP)} className="text-[13px] font-bold px-5 py-2 rounded-lg text-white transition-all hover:opacity-90" style={{ background: C.brand }}>Join Now</button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-14 sm:py-20 text-center">
        <h1 className="text-[30px] sm:text-[40px] lg:text-[48px] font-bold leading-tight" style={{ color: C.navy }}>DrDietTherapy</h1>
        <p className="text-[14px] sm:text-[16px] mt-3 max-w-md leading-relaxed" style={{ color: C.muted }}>
          Welcome to your personalized healthcare and education journey.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
          {roles.map(({ ico, title, desc, feats, route }) => (
            <div key={title} onClick={() => nav(route)}
              className="bg-white rounded-2xl border-2 p-6 sm:p-7 flex flex-col gap-4 text-left cursor-pointer transition-all hover:shadow-lg"
              style={{ borderColor: C.brandBorder }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: C.brandLight }}>{ico}</div>
              <p className="text-[16px] font-bold" style={{ color: C.navy }}>{title}</p>
              <p className="text-[13px] leading-[1.7]" style={{ color: C.navyMid }}>{desc}</p>
              <div className="flex flex-col gap-2.5">
                {feats.map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <CircleChk />
                    <span className="text-[13px] font-semibold" style={{ color: C.brand }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => nav(ROUTES.SIGN_UP)} className="mt-8 w-full max-w-sm h-[52px] rounded-xl text-white text-[15px] font-bold transition-all hover:opacity-90" style={{ background: C.brand }}>
          Continue to Registration
        </button>
        <p className="mt-3 text-[13px]" style={{ color: C.mutedLight }}>
          Already have an account?{' '}
          <button onClick={() => nav(ROUTES.SIGN_IN)} className="font-bold hover:underline" style={{ color: C.brand }}>Sign In</button>
        </p>
      </main>

      <footer className="py-5 text-center text-[12px] bg-white" style={{ borderTop: `1px solid ${C.divider}`, color: C.mutedLight }}>
        © {new Date().getFullYear()} DrDietTherapy. All rights reserved.
      </footer>
    </div>
  )
}
