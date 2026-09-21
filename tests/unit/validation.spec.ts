import { describe, expect, it } from 'vitest'
import { firstInvalidField, isProjectFormValid, validateProjectForm } from '~/utils/validation'
import type { ProjectFormInput } from '~/types/project'

function buildInput(overrides: Partial<ProjectFormInput> = {}): ProjectFormInput {
  return {
    name: 'Projeto Teste',
    client: 'Clicksign',
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    coverImage: null,
    ...overrides,
  }
}

describe('validateProjectForm', () => {
  it('accepts a fully valid input', () => {
    const errors = validateProjectForm(buildInput())
    expect(isProjectFormValid(errors)).toBe(true)
  })

  it('requires at least two words in the project name', () => {
    const errors = validateProjectForm(buildInput({ name: 'Projeto' }))
    expect(errors.name).toBe('Por favor, digite ao menos duas palavras')
  })

  it('requires at least one word for the client', () => {
    const errors = validateProjectForm(buildInput({ client: '   ' }))
    expect(errors.client).toBe('Por favor, digite ao menos uma palavra')
  })

  it('rejects an invalid start date', () => {
    const errors = validateProjectForm(buildInput({ startDate: '2024-02-30' }))
    expect(errors.startDate).toBe('Selecione uma data válida')
  })

  it('rejects an end date before the start date', () => {
    const errors = validateProjectForm(
      buildInput({ startDate: '2024-06-01', endDate: '2024-01-01' }),
    )
    expect(errors.endDate).toBe('Selecione uma data válida')
  })

  it('accepts an end date equal to the start date', () => {
    const errors = validateProjectForm(buildInput({ startDate: '2024-06-01', endDate: '2024-06-01' }))
    expect(errors.endDate).toBeUndefined()
  })
})

describe('firstInvalidField', () => {
  it('returns fields in visual order: name, client, startDate, endDate', () => {
    const errors = validateProjectForm(buildInput({ name: 'x', client: '', startDate: 'bad' }))
    expect(firstInvalidField(errors)).toBe('name')
  })

  it('returns null when there are no errors', () => {
    expect(firstInvalidField({})).toBeNull()
  })
})
