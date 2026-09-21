import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProjectOptionsMenu from '~/components/project/ProjectOptionsMenu.vue'

describe('ProjectOptionsMenu', () => {
  function isShown(wrapper: ReturnType<typeof mount>) {
    return (wrapper.find('[role="menu"]').element as HTMLElement).style.display !== 'none'
  }

  it('opens the menu on trigger click', async () => {
    const wrapper = mount(ProjectOptionsMenu)

    expect(isShown(wrapper)).toBe(false)

    await wrapper.find('button').trigger('click')

    expect(isShown(wrapper)).toBe(true)
  })

  it('opens with ArrowDown from the closed trigger and navigates with arrow keys', async () => {
    const wrapper = mount(ProjectOptionsMenu)
    const trigger = wrapper.find('button')

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    expect(isShown(wrapper)).toBe(true)

    const items = wrapper.findAll('[role="menuitem"]')
    expect(items[0]?.classes()).toContain('project-options-menu__item--active')

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    expect(items[1]?.classes()).toContain('project-options-menu__item--active')
  })

  it('activates the highlighted item with Enter and closes the menu', async () => {
    const wrapper = mount(ProjectOptionsMenu)
    const trigger = wrapper.find('button')

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(isShown(wrapper)).toBe(false)
  })

  it('selects "Remover" after moving down once', async () => {
    const wrapper = mount(ProjectOptionsMenu)
    const trigger = wrapper.find('button')

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('delete')).toHaveLength(1)
  })

  it('closes on Escape without emitting a selection', async () => {
    const wrapper = mount(ProjectOptionsMenu)
    const trigger = wrapper.find('button')

    await trigger.trigger('click')
    await trigger.trigger('keydown', { key: 'Escape' })

    expect(isShown(wrapper)).toBe(false)
    expect(wrapper.emitted('edit')).toBeUndefined()
    expect(wrapper.emitted('delete')).toBeUndefined()
  })
})
