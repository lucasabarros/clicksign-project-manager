import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { normalizeForSearch } from '~/utils/text'

export interface HighlightSegment {
  text: string
  matched: boolean
}

export function useHighlightMatch(text: MaybeRefOrGetter<string>, query: MaybeRefOrGetter<string>) {
  return computed<HighlightSegment[]>(() => {
    const value = toValue(text)
    const normalizedQuery = normalizeForSearch(toValue(query))

    if (!normalizedQuery) {
      return [{ text: value, matched: false }]
    }

    const normalizedValue = normalizeForSearch(value)
    const index = normalizedValue.indexOf(normalizedQuery)

    if (index === -1) {
      return [{ text: value, matched: false }]
    }

    const matchEnd = index + normalizedQuery.length
    const segments: HighlightSegment[] = []

    if (index > 0) segments.push({ text: value.slice(0, index), matched: false })
    segments.push({ text: value.slice(index, matchEnd), matched: true })
    if (matchEnd < value.length) segments.push({ text: value.slice(matchEnd), matched: false })

    return segments
  })
}
