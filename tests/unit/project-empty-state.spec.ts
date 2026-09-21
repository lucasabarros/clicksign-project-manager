import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProjectEmptyState from '~/components/project/ProjectEmptyState.vue'

describe('ProjectEmptyState', () => {
  it('shows the "Novo projeto" CTA only for the empty variant', () => {
    const wrapper = mount(ProjectEmptyState, { props: { variant: 'empty' } })

    expect(wrapper.text()).toContain('Nenhum projeto')
    expect(wrapper.text()).toContain('Clique no botão abaixo para criar o primeiro e gerenciá-lo.')
    expect(wrapper.findComponent({ name: 'BaseButton' }).exists() || wrapper.find('button').exists()).toBe(true)
  })

  it('shows the search-specific message without a CTA', () => {
    const wrapper = mount(ProjectEmptyState, { props: { variant: 'search' } })

    expect(wrapper.text()).toContain('Nenhum projeto encontrado')
    expect(wrapper.text()).toContain('Tente buscar por outro termo.')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('shows the favorites-specific message without a CTA', () => {
    const wrapper = mount(ProjectEmptyState, { props: { variant: 'favorites' } })

    expect(wrapper.text()).toContain('Nenhum projeto favorito')
    expect(wrapper.text()).toContain('Você ainda não favoritou nenhum projeto.')
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
