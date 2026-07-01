/**
 * AdminFormModal — CRUD form dialog
 * Desktop: centered overlay with max-width
 * Mobile: full-screen slide-up sheet
 */
import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'

interface AdminFormModalProps {
  open:       boolean
  onClose:    () => void
  title:      string
  subtitle?:  string
  children:   ReactNode
  footer?:    ReactNode
  size?:      'sm' | 'md' | 'lg'
  loading?:   boolean
}

const MAX_WIDTHS = { sm: '420px', md: '540px', lg: '740px' }

export default function AdminFormModal({
  open, onClose, title, subtitle, children, footer, size = 'md', loading = false,
}: AdminFormModalProps) {
  return (
    <>
      <style>{`
        @keyframes afm-backdrop { from{opacity:0} to{opacity:1} }
        @keyframes afm-enter    { from{opacity:0;transform:translate(-50%,-48%) scale(0.96)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes afm-slide-up { from{transform:translateY(100%)} to{transform:translateY(0)} }

        .afm-overlay {
          position:fixed;inset:0;z-index:9998;
          background:rgba(8,24,32,0.55);
          backdrop-filter:blur(3px);
          -webkit-backdrop-filter:blur(3px);
          animation:afm-backdrop 0.2s ease;
        }
        .afm-content {
          position:fixed;
          z-index:9999;
          display:flex;
          flex-direction:column;
          background:#fff;
          outline:none;
          overflow:hidden;
          /* Mobile: full-screen bottom sheet */
          bottom:0; left:0; right:0;
          max-height:92dvh;
          border-radius:20px 20px 0 0;
          animation:afm-slide-up 0.28s cubic-bezier(0.32,0.72,0,1);
        }
        @media (min-width:640px) {
          .afm-content {
            top:50%; left:50%;
            bottom:auto; right:auto;
            transform:translate(-50%,-50%);
            width:calc(100vw - 40px);
            max-height:90dvh;
            border-radius:20px;
            animation:afm-enter 0.22s cubic-bezier(0.34,1.56,0.64,1);
          }
        }
        .afm-header {
          display:flex; align-items:flex-start; justify-content:space-between;
          gap:12px; padding:20px 20px 16px; flex-shrink:0;
          border-bottom:1px solid ${COLORS.divider};
        }
        .afm-body {
          flex:1; overflow-y:auto; overflow-x:hidden;
          padding:20px;
        }
        .afm-footer {
          flex-shrink:0; padding:14px 20px;
          border-top:1px solid ${COLORS.divider};
          display:flex; align-items:center; justify-content:flex-end; gap:10px;
          flex-wrap:wrap;
        }
      `}</style>

      <Dialog.Root open={open} onOpenChange={o => { if (!o && !loading) onClose() }}>
        <Dialog.Portal>
          <Dialog.Overlay className="afm-overlay" />
          <Dialog.Content
            aria-describedby="afm-desc"
            className="afm-content"
            style={{ maxWidth: MAX_WIDTHS[size] }}
          >
            {/* Header */}
            <div className="afm-header">
              <div>
                <Dialog.Title style={{ fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy, margin: 0 }}>
                  {title}
                </Dialog.Title>
                {subtitle && (
                  <Dialog.Description id="afm-desc" style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, margin: '4px 0 0' }}>
                    {subtitle}
                  </Dialog.Description>
                )}
                {!subtitle && <Dialog.Description id="afm-desc" style={{ display: 'none' }}>{title}</Dialog.Description>}
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                style={{
                  width:'32px', height:'32px', borderRadius:'8px', border:'none',
                  background:'transparent', cursor: loading ? 'not-allowed' : 'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: COLORS.muted, flexShrink:0,
                }}
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Body */}
            <div className="afm-body">{children}</div>

            {/* Footer */}
            {footer && <div className="afm-footer">{footer}</div>}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
