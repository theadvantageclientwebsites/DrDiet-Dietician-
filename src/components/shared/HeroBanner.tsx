/**
 * HeroBanner
 * A reusable dark-teal hero / welcome banner card.
 * Props let any screen customise the badge, headline, body, and stat pills.
 */
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'

export interface StatPill {
  label: string
  value: string
}

interface HeroBannerProps {
  badge?    : string
  headline  : string
  body      : string
  pills?    : StatPill[]
}

export default function HeroBanner({
  badge    = 'CLINICAL PORTAL',
  headline,
  body,
  pills    = [],
}: HeroBannerProps) {
  return (
    <div style={{
      position:     'relative',
      borderRadius: '22px',
      overflow:     'hidden',
      background:   'linear-gradient(135deg, #0c323cff 0%, #0f4751ff 55%, #1e8a7a 100%)',
      padding:      'clamp(24px, 4vw, 36px) clamp(24px, 4vw, 40px)',
      minHeight:    '148px',
      display:      'flex',
      flexDirection:'column',
      justifyContent: 'space-between',
      gap:          '16px',
    }}>

      {/* Decorative wave blobs — pure CSS, no images */}
      <span aria-hidden style={{
        position:     'absolute',
        right:        '-30px',
        top:          '-30px',
        width:        '280px',
        height:       '280px',
        borderRadius: '50%',
        background:   'rgba(255,255,255,0.045)',
        pointerEvents:'none',
      }} />
      <span aria-hidden style={{
        position:     'absolute',
        right:        '60px',
        bottom:       '-60px',
        width:        '200px',
        height:       '200px',
        borderRadius: '50%',
        background:   'rgba(255,255,255,0.035)',
        pointerEvents:'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        {badge && (
          <span style={{
            display:       'inline-block',
            marginBottom:  '14px',
            padding:       '4px 12px',
            borderRadius:  '999px',
            background:    'rgba(255, 255, 255, 0.27)',
            border:        '1px solid rgba(255,255,255,0.18)',
            color:         'rgba(255,255,255,0.80)',
            fontSize:      FONT_SIZE.xs,
            fontWeight:    FONT_WEIGHT.semibold,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
          }}>
            {badge}
          </span>
        )}

        {/* Headline */}
        <h2 style={{
          color:      COLORS.white,
          fontSize:   'clamp(1.2rem, 3vw, 2rem)',
          fontWeight: FONT_WEIGHT.bold,
          lineHeight: 1.25,
          marginBottom: '10px',
          maxWidth:   '560px',
        }}>
          {headline}
        </h2>

        {/* Body */}
        <p style={{
          color:     'rgba(255,255,255,0.68)',
          fontSize:  FONT_SIZE.sm,
          lineHeight: 1.6,
          maxWidth:  '480px',
        }}>
          {body}
        </p>
      </div>

      {/* Stat pills row */}
      {pills.length > 0 && (
        <div style={{
          position:  'relative',
          zIndex:    1,
          display:   'flex',
          flexWrap:  'wrap',
          gap:       '8px',
        }}>
          {pills.map(p => (
            <span key={p.label + p.value} style={{
              padding:      '5px 14px',
              borderRadius: '6px',
              background:   'rgba(255,255,255,0.13)',
              color:        COLORS.white,
              fontSize:     FONT_SIZE.xs,
              fontWeight:   FONT_WEIGHT.semibold,
              whiteSpace:   'nowrap',
            }}>
              {p.label}: <strong style={{ fontWeight: FONT_WEIGHT.semibold }}>{p.value}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
