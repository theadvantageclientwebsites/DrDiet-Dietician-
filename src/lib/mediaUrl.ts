import { API_BASE_URL } from '@/config/constants'

const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

function uploadsPath(url: string): string | null {
  try {
    if (url.startsWith('/uploads/')) return url
    if (url.startsWith('http')) {
      const path = new URL(url).pathname
      return path.startsWith('/uploads/') ? path : null
    }
    if (url.startsWith('uploads/')) return `/${url}`
  } catch { /* ignore */ }
  return null
}

export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null

  const path = uploadsPath(url)
  if (path) {
    // Dev: same-origin /uploads so Vite can proxy (avoids CORP blocking <img>).
    if (import.meta.env.DEV) return path
    return `${SERVER_ORIGIN}${path}`
  }

  if (url.startsWith('http')) return url
  return `${SERVER_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`
}

export function openMediaUrl(url: string | null | undefined) {
  const resolved = resolveMediaUrl(url)
  if (!resolved) return
  const href = resolved.startsWith('http') ? resolved : `${SERVER_ORIGIN}${resolved}`
  window.open(href, '_blank', 'noopener,noreferrer')
}
