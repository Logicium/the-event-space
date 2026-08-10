/** Lightweight date helpers shared by Marquee event components.
 *  All dates are interpreted in the visitor's local timezone — venues schedule
 *  events in their own time, so this avoids surprise day-shifts in the calendar. */

export interface EventDateParts {
  /** Three-letter month label, e.g. "JUN". */
  month: string
  /** Day of month as a string without leading zero, e.g. "7". */
  day: string
  /** Three-letter weekday label, e.g. "SUN". */
  weekday: string
  /** Long display string, e.g. "Sun, Jun 7, 2026". */
  long: string
}

function parseLocal(iso: string): Date | null {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function formatEventDate(iso: string): EventDateParts {
  const date = parseLocal(iso)
  if (!date) return { month: '', day: '', weekday: '', long: iso }
  return {
    month: date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase(),
    day: String(date.getDate()),
    weekday: date.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase(),
    long: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
  }
}

/** Returns true when the event date is strictly before today (local time). */
export function isPast(iso: string): boolean {
  const date = parseLocal(iso)
  if (!date) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date.getTime() < today.getTime()
}
