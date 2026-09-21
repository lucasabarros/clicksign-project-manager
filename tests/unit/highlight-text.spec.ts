import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HighlightText from '~/components/search/HighlightText.vue'

describe('HighlightText', () => {
  it('wraps the matched substring in <mark>, case/locale-insensitively', () => {
    const wrapper = mount(HighlightText, {
      props: { text: 'Projeto 01', query: 'projet' },
    })

    const mark = wrapper.find('mark')
    expect(mark.exists()).toBe(true)
    expect(mark.text()).toBe('Projet')
    expect(wrapper.text()).toBe('Projeto 01')
  })

  it('renders no <mark> when the query does not match', () => {
    const wrapper = mount(HighlightText, {
      props: { text: 'Projeto 01', query: 'xyz' },
    })

    expect(wrapper.find('mark').exists()).toBe(false)
    expect(wrapper.text()).toBe('Projeto 01')
  })

  it('renders no <mark> for an empty query', () => {
    const wrapper = mount(HighlightText, {
      props: { text: 'Projeto 01', query: '' },
    })

    expect(wrapper.find('mark').exists()).toBe(false)
  })

  it('never uses v-html — special characters in the name render as plain text', () => {
    const wrapper = mount(HighlightText, {
      props: { text: '<img src=x onerror=alert(1)>', query: 'img' },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.html()).toContain('&lt;')
    expect(wrapper.html()).not.toContain('<img ')
    expect(wrapper.text()).toBe('<img src=x onerror=alert(1)>')
  })
})
