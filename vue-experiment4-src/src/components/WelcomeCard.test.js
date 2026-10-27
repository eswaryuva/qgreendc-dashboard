import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import WelcomeCard from './WelcomeCard.vue'

const KEY = 'test-gpt-git.vue-experiment4.name.v1'
const MODE_KEY = 'test-gpt-git.vue-experiment5.mode.v1'

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe('WelcomeCard regression and integration', () => {
  it('renders a full-name input and submit button', () => {
    const wrapper = mount(WelcomeCard)
    expect(wrapper.get('input[name="fullName"]').exists()).toBe(true)
    expect(wrapper.get('button[type="submit"]').text()).toContain('Say hello')
  })

  it('greets with an emoji and stores the normalized name (old default)', async () => {
    const wrapper = mount(WelcomeCard)
    await wrapper.get('input[name="fullName"]').setValue('  Ada   Lovelace  ')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('[data-testid="welcome-message"]').text()).toContain('Welcome, Ada Lovelace! 👋')
    expect(localStorage.getItem(KEY)).toBe('Ada Lovelace')
  })

  it('restores the saved name and greeting when remounted', async () => {
    localStorage.setItem(KEY, 'Grace Hopper')
    const wrapper = mount(WelcomeCard)
    await nextTick()
    expect(wrapper.get('input[name="fullName"]').element.value).toBe('Grace Hopper')
    expect(wrapper.get('[data-testid="welcome-message"]').text()).toContain('Welcome, Grace Hopper!')
  })

  it('clears the saved name when reset is clicked', async () => {
    localStorage.setItem(KEY, 'Alan Turing')
    const wrapper = mount(WelcomeCard)
    await nextTick()
    await wrapper.get('.clear-btn').trigger('click')
    expect(localStorage.getItem(KEY)).toBe(null)
    expect(wrapper.find('[data-testid="welcome-message"]').exists()).toBe(false)
    expect(wrapper.get('input[name="fullName"]').element.value).toBe('')
  })

  it('escapes HTML-like input instead of injecting markup', async () => {
    const wrapper = mount(WelcomeCard)
    await wrapper.get('input[name="fullName"]').setValue('<img src=x onerror=alert(1)>')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.get('[data-testid="welcome-message"]').text()).toContain('<img src=x onerror=alert(1)>')
  })

  it('works when browser storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw Error('blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('blocked') })
    const wrapper = mount(WelcomeCard)
    await wrapper.get('input[name="fullName"]').setValue('Test User')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('[data-testid="welcome-message"]').text()).toContain('Welcome, Test User!')
  })

  it('switches between two greeting components reactively', async () => {
    const wrapper = mount(WelcomeCard)
    await wrapper.get('input[name="fullName"]').setValue('Ada Lovelace')
    await wrapper.get('form').trigger('submit')
    await wrapper.get('input[value="professional"]').setValue()
    expect(wrapper.get('[data-testid="welcome-message"]').text()).toContain('Hello, Ada Lovelace. 🤝')
    expect(localStorage.getItem(MODE_KEY)).toBe('professional')
    await wrapper.get('input[value="friendly"]').setValue()
    expect(wrapper.get('[data-testid="welcome-message"]').text()).toContain('Welcome, Ada Lovelace! 👋')
  })

  it('restores name and chosen greeting style', async () => {
    localStorage.setItem(KEY, 'Marie Curie')
    localStorage.setItem(MODE_KEY, 'professional')
    const wrapper = mount(WelcomeCard)
    await nextTick()
    expect(wrapper.get('input[value="professional"]').element.checked).toBe(true)
    expect(wrapper.get('[data-testid="welcome-message"]').text()).toContain('Hello, Marie Curie. 🤝')
  })

  it('rejects invalid saved greeting styles', async () => {
    localStorage.setItem(KEY, 'Demo User')
    localStorage.setItem(MODE_KEY, 'malformed')
    const wrapper = mount(WelcomeCard)
    await nextTick()
    expect(wrapper.get('input[value="friendly"]').element.checked).toBe(true)
    expect(wrapper.get('[data-testid="welcome-message"]').text()).toContain('Welcome, Demo User! 👋')
  })

  it('preserves greeting style when name is cleared', async () => {
    localStorage.setItem(KEY, 'Demo User')
    localStorage.setItem(MODE_KEY, 'professional')
    const wrapper = mount(WelcomeCard)
    await nextTick()
    await wrapper.get('.clear-btn').trigger('click')
    expect(localStorage.getItem(MODE_KEY)).toBe('professional')
    expect(wrapper.get('input[value="professional"]').element.checked).toBe(true)
  })
})
