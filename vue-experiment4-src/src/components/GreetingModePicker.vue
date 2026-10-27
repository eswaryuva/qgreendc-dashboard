<script setup>
defineProps({
  modelValue: { type: String, required: true }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <fieldset class="mode-picker">
    <legend>Greeting style</legend>
    <div class="mode-options">
      <label class="mode-choice">
        <input type="radio" name="greetingMode" value="friendly" :checked="modelValue === 'friendly'" @change="$emit('update:modelValue', 'friendly')" />
        <span>😊 Friendly</span>
      </label>
      <label class="mode-choice">
        <input type="radio" name="greetingMode" value="professional" :checked="modelValue === 'professional'" @change="$emit('update:modelValue', 'professional')" />
        <span>🤝 Professional</span>
      </label>
    </div>
  </fieldset>
</template>
