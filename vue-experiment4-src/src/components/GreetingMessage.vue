<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  mode: { type: String, default: 'friendly' }
})
defineEmits(['clear'])
const message = computed(() => props.mode === 'professional'
  ? `Hello, ${props.name}. 🤝`
  : `Welcome, ${props.name}! 👋`)
</script>

<template>
  <div class="greeting" data-testid="welcome-message" role="status" aria-live="polite">
    <div><span class="greeting-emoji" aria-hidden="true">🎉</span><strong class="greeting-text">{{ message }}</strong></div>
    <button type="button" class="clear-btn" @click="$emit('clear')">Clear saved name</button>
  </div>
</template>
