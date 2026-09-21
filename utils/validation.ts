import { compareDateStrings, isValidCalendarDate } from './date'
import type { ProjectFormInput } from '~/types/project'

export interface ProjectFormErrors {
  name?: string
  client?: string
  startDate?: string
  endDate?: string
}

export const PROJECT_FORM_FIELD_ORDER: ReadonlyArray<keyof ProjectFormErrors> = [
  'name',
  'client',
  'startDate',
  'endDate',
]

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export function validateProjectForm(input: ProjectFormInput): ProjectFormErrors {
  const errors: ProjectFormErrors = {}

  if (wordCount(input.name) < 2) {
    errors.name = 'Por favor, digite ao menos duas palavras'
  }

  if (wordCount(input.client) < 1) {
    errors.client = 'Por favor, digite ao menos uma palavra'
  }

  const startIsValid = isValidCalendarDate(input.startDate)
  if (!startIsValid) {
    errors.startDate = 'Selecione uma data válida'
  }

  const endIsValid = isValidCalendarDate(input.endDate)
  if (!endIsValid) {
    errors.endDate = 'Selecione uma data válida'
  } else if (startIsValid && compareDateStrings(input.endDate, input.startDate) < 0) {
    errors.endDate = 'Selecione uma data válida'
  }

  return errors
}

export function isProjectFormValid(errors: ProjectFormErrors): boolean {
  return Object.keys(errors).length === 0
}

export function firstInvalidField(errors: ProjectFormErrors): keyof ProjectFormErrors | null {
  return PROJECT_FORM_FIELD_ORDER.find((field) => errors[field]) ?? null
}
