import { parseISO, differenceInMinutes } from 'date-fns'
import { JOIN_CALL_MINUTES_BEFORE, JOIN_CALL_MINUTES_AFTER } from '@/config/constants'

export function canJoinVideoCall(opts: {
  dateTime: string
  status?: string
  type?: string
  now?: Date
}): boolean {
  if (opts.status && opts.status !== 'CONFIRMED') return false
  if (opts.type && opts.type !== 'ONLINE') return false

  try {
    const start = parseISO(opts.dateTime)
    const minutesUntil = differenceInMinutes(start, opts.now ?? new Date())
    return minutesUntil <= JOIN_CALL_MINUTES_BEFORE && minutesUntil >= -JOIN_CALL_MINUTES_AFTER
  } catch {
    return false
  }
}
