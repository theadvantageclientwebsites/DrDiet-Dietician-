import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { C } from '@/config/colors'

const PatIco = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.brand} strokeWidth="1.7">
    <circle cx="10" cy="7" r="4"/>
    <path d="M2 21v-2a4 4 0 014-4h5"/>
    <circle cx="18" cy="18" r="3"/>
    <line x1="20.5" y1="20.5" x2="23" y2="23"/>
  </svg>
)
const IntIco = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.brand} strokeWidth="1.7">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
)
const CircleChk = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.brand} strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
)

const roles = [
  { ico: <PatIco />, title: 'Join as a Patient', desc: 'Manage your chronic conditions, monitor your diet, and receive professional medical guidance tailored to your health goals.', feats: ['Personalized Diet Plans', 'Direct Doctor Access'], route: ROUTES.SIGN_UP_PATIENT },
  { ico: <IntIco />, title: 'Join as an Intern', desc: 'Accelerate your medical career with structured learning, clinical case studies, and professional certification programmes.', feats: ['Professional Certifications', 'Clinical Case Access'], route: ROUTES.SIGN_UP_INTERN },
]

export default function SignUpPage() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen flex flex-col sm:items-center sm:justify-center sm:py-8 sm:px-4"
      style={{ background: C.pageBg }}>
      <div className="w-full bg-white flex flex-col px-5 py-7 min-h-screen sm:min-h-0 sm:rounded-xl sm:border sm:shadow-sm sm:max-w-[440px] lg:max-w-[720px] sm:px-8 sm:py-8"
        style={{ borderColor: C.divider }}>

        {/* Header */}
        <p className="text-[12px] font-semibold mb-4" style={{ color: C.brand }}>DrDietTherapy</p>
        <h2 className="text-[18px] font-bold mb-1" style={{ color: C.navy }}>Choose Your Role</h2>
        <p className="text-[13px] mb-6" style={{ color: C.muted }}>Welcome to your personalized healthcare and education journey.</p>

        {/* Role cards */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          {roles.map(({ ico, title, desc, feats, route }) => (
            <button key={title} onClick={() => nav(route)}
              className="w-full lg:flex-1 text-left rounded-xl border p-5 transition-all hover:border-[#a8d4de] hover:shadow-sm active:scale-[0.995]"
              style={{ background: C.white, borderColor: C.divider }}>
              {/* Icon — light blue circle */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: C.brandLight }}>
                {ico}
              </div>
              <p className="text-[14px] font-bold mb-2" style={{ color: C.navy }}>{title}</p>
              <p className="text-[12px] leading-relaxed mb-4" style={{ color: C.body }}>{desc}</p>
              <div className="flex flex-col gap-2">
                {feats.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <CircleChk />
                    <span className="text-[12px] font-semibold" style={{ color: C.brand }}>{f}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        <button onClick={() => nav(ROUTES.SIGN_UP_PATIENT)}
          className="w-full h-10 rounded-lg text-white text-[13px] font-semibold transition-opacity hover:opacity-90"
          style={{ background: C.brand }}>
          Continue to Registration
        </button>

        <p className="text-center text-[12px] mt-4" style={{ color: C.muted }}>
          Already have an account?{' '}
          <button onClick={() => nav(ROUTES.SIGN_IN)} className="font-semibold hover:underline" style={{ color: C.brand }}>Sign In</button>
        </p>
        <p className="text-center text-[11px] mt-4" style={{ color: C.divider }}>
          © {new Date().getFullYear()} DrDietTherapy. All rights reserved.
        </p>
      </div>
    </div>
  )
}
