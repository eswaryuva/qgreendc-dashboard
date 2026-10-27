import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import GreetingModePicker from './GreetingModePicker.vue'

describe('GreetingModePicker', () => {
  it('renders both accessible choices', () => {
    const wrapper = mount(GreetingModePicker, { props: { modelValue: 'friendly' } })
    expect(wrapper.get('fieldset legend').text()).toBe('Greeting style')
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(2)
    expect(wrapper.get('input[value="friendly"]').element.checked).toBe(true)
  })

  it('emits the selected style', async () => {
    const wrapper = mount(GreetingModePicker, { props: { modelValue: 'friendly' } })
    await wrapper.get('input[value="professional"]').setValue()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['professional'])
  })
})
