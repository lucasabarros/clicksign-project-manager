import { describe, expect, it } from 'vitest'
import {
  compareDateStrings,
  isValidCalendarDate,
  isValidIsoDateTime,
  parseLocalDate,
} from '~/utils/date'

describe('isValidCalendarDate', () => {
  it('accepts a real calendar date', () => {
    expect(isValidCalendarDate('2024-12-01')).toBe(true)
  })

  it('rejects a non-existent calendar date instead of letting it roll over', () => {
    expect(isValidCalendarDate('2024-02-30')).toBe(false)
  })

  it('rejects malformed input', () => {
    expect(isValidCalendarDate('not-a-date')).toBe(false)
    expect(isValidCalendarDate('')).toBe(false)
    expect(isValidCalendarDate('2024-13-01')).toBe(false)
  })
})

describe('parseLocalDate', () => {
  it('parses using local time, not UTC midnight', () => {
    const date = parseLocalDate('2024-01-15')
    expect(date).not.toBeNull()
    expect(date?.getFullYear()).toBe(2024)
    expect(date?.getMonth()).toBe(0)
    expect(date?.getDate()).toBe(15)
    expect(date?.getHours()).toBe(0)
  })

  it('returns null for an invalid date', () => {
    expect(parseLocalDate('2024-02-30')).toBeNull()
  })
})

describe('isValidIsoDateTime', () => {
  it('accepts a real ISO datetime', () => {
    expect(isValidIsoDateTime(new Date().toISOString())).toBe(true)
  })

  it('rejects garbage input', () => {
    expect(isValidIsoDateTime('not-a-datetime')).toBe(false)
    expect(isValidIsoDateTime('')).toBe(false)
  })
})

describe('compareDateStrings', () => {
  it('orders ascending by calendar day', () => {
    expect(compareDateStrings('2024-01-01', '2024-02-01')).toBeLessThan(0)
    expect(compareDateStrings('2024-02-01', '2024-01-01')).toBeGreaterThan(0)
    expect(compareDateStrings('2024-01-01', '2024-01-01')).toBe(0)
  })
})
