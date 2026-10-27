import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import GreetingMessage from './GreetingMessage.vue'

describe('GreetingMessage', () => {
  it('renders the original welcome message by default', () => {
    const wrapper = mount(GreetingMessage, { props: { name: 'Ada Lovelace' } })
    expect(wrapper.get('[data-testid="welcome-message"]').text()).toContain('Welcome, Ada Lovelace! 👋')
  })

  it('renders a professional message', () => {
    const wrapper = mount(GreetingMessage, { props: { name: 'Ada Lovelace', mode: 'professional' } })
    expect(wrapper.get('[data-testid="welcome-message"]').text()).toContain('Hello, Ada Lovelace. 🤝')
  })

  it('updates on prop change and emits the clear action', async () => {
    const wrapper = mount(GreetingMessage, { props: { name: 'Ada', mode: 'friendly' } })
    await wrapper.setProps({ mode: 'professional' })
    expect(wrapper.get('[data-testid="welcome-message"]').text()).toContain('Hello, Ada. 🤝')
    await wrapper.get('.clear-btn').trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('escapes user-controlled HTML', () => {
    const wrapper = mount(GreetingMessage, { props: { name: '<img src=x onerror=alert(1)>' } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.get('.greeting-text').text()).toContain('<img src=x onerror=alert(1)>')
  })
})
