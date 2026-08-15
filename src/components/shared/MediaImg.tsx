import { useEffect, useState } from 'react'
import { resolveMediaUrl } from '@/lib/mediaUrl'

/**
 * Helmet on the API sets Cross-Origin-Resource-Policy: same-origin, which
 * blocks <img> from other origins (localhost / Vercel) even when the URL is valid.
 * Fetch uses CORS (ACAO: *) so we can show the file via a blob URL.
 */
export default function MediaImg({
  src,
  alt,
  className,
  style,
}: {
  src: string | null | undefined
  alt: string
  className?: string
  style?: React.CSSProperties
}) {
  const resolved = resolveMediaUrl(src)
  const [blobSrc, setBlobSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!resolved) {
      setBlobSrc(null)
      return
    }

    let objectUrl: string | undefined
    let cancelled = false

    fetch(resolved, { mode: 'cors', credentials: 'omit' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.blob()
      })
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setBlobSrc(objectUrl)
      })
      .catch(() => {
        if (!cancelled) setBlobSrc(resolved)
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [resolved])

  if (!resolved) return null

  return (
    <img
      src={blobSrc ?? resolved}
      alt={alt}
      className={className}
      style={style}
      referrerPolicy="no-referrer"
    />
  )
}
