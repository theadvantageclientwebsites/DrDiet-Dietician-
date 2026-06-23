import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

const T = 'hsl(174,68%,36%)'
const CHECK = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
const PatIco = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>
const IntIco = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>

const roles = [
  { ico: <PatIco />, title: 'Join as a Patient', desc: 'Manage your chronic conditions, practice your diet, and receive professional medical guidance tailored to your health goals.', feats: ['Personalized Diet Plans', 'Blood Report Access'], route: ROUTES.SIGN_UP_PATIENT },
  { ico: <IntIco />, title: 'Join as an Intern', desc: 'Accelerate your medical career with structured learning, clinical case studies, and professional certification programmes.', feats: ['Professional Certifications', 'Clinical Case Access'], route: ROUTES.SIGN_UP_INTERN },
]

export default function SignUpPage() {
  const nav = useNavigate()
  return (
    /* Full page responsive wrapper */
    <div className="min-h-screen bg-[#eef1f4] flex flex-col sm:items-center sm:justify-center sm:p-6 lg:p-10">
      <div className="w-full bg-white flex flex-col min-h-screen sm:min-h-0 sm:rounded-2xl sm:shadow-[0_4px_24px_rgba(0,0,0,0.10)] sm:border sm:border-[#e2e6ea] sm:max-w-sm lg:max-w-2xl px-5 py-7 sm:px-8 sm:py-8">

        {/* Header */}
        <div className="mb-5">
          <p className="text-[13px] font-bold mb-1" style={{ color: T }}>DrDietTherapy</p>
          <p className="text-[13px] text-[#6b7280] leading-relaxed">Welcome to your personalized healthcare and education journey.</p>
        </div>

        {/* Role cards — stacked on mobile/tablet, side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          {roles.map(({ ico, title, desc, feats, route }) => (
            <button key={title} onClick={() => nav(route)}
              className="w-full text-left border-2 border-[#e8ecf0] rounded-xl p-4 hover:border-[hsl(174,68%,36%)] hover:shadow-sm active:scale-[0.995] transition-all lg:flex-1">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[hsl(174,60%,94%)] flex items-center justify-center shrink-0 mt-0.5">{ico}</div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-[#111827] mb-1">{title}</p>
                  <p className="text-[12px] text-[#6b7280] leading-relaxed mb-2.5">{desc}</p>
                  <div className="flex flex-col gap-1">
                    {feats.map(f => (
                      <span key={f} className="flex items-center gap-1.5 text-[12px]" style={{ color: T }}>
                        <CHECK />{f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button onClick={() => nav(ROUTES.SIGN_UP_PATIENT)}
          className="w-full h-11 text-white text-[14px] font-semibold rounded-xl transition-colors"
          style={{ background: T }}>
          Continue to Registration
        </button>

        <p className="text-center text-[12px] text-[#9ca3af] mt-4">
          Already have an account?{' '}
          <button onClick={() => nav(ROUTES.SIGN_IN)} className="font-semibold hover:underline" style={{ color: T }}>
            Sign In
          </button>
        </p>
        <p className="text-center text-[10px] text-[#d1d5db] mt-4">
          © {new Date().getFullYear()} DrDietTherapy. All rights reserved.
        </p>
      </div>
    </div>
  )
}
