const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export const MIN_PROJECT_DATE = '1900-01-01'
export const MAX_PROJECT_DATE = '2100-12-31'

interface DateComponents {
  year: number
  month: number
  day: number
}

function extractDateComponents(value: string): DateComponents | null {
  const match = DATE_ONLY_PATTERN.exec(value)
  if (!match) return null
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
}

export function isValidCalendarDate(value: string): boolean {
  const components = extractDateComponents(value)
  if (!components) return false

  const { year, month, day } = components
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export function parseLocalDate(value: string): Date | null {
  if (!isValidCalendarDate(value)) return null
  const { year, month, day } = extractDateComponents(value) as DateComponents
  return new Date(year, month - 1, day)
}

export function isValidIsoDateTime(value: string): boolean {
  if (typeof value !== 'string' || value.trim() === '') return false
  return !Number.isNaN(Date.parse(value))
}

export function formatDatePtBr(value: string): string {
  const date = parseLocalDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function compareDateStrings(a: string, b: string): number {
  const dateA = parseLocalDate(a)
  const dateB = parseLocalDate(b)
  if (!dateA || !dateB) return 0
  return dateA.getTime() - dateB.getTime()
}
