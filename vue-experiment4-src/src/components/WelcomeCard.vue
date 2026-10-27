<script setup>
import { onMounted, ref } from 'vue'
import GreetingModePicker from './GreetingModePicker.vue'
import GreetingMessage from './GreetingMessage.vue'

const STORAGE_KEY = 'test-gpt-git.vue-experiment4.name.v1'
const MODE_KEY = 'test-gpt-git.vue-experiment5.mode.v1'
const fullName = ref('')
const greetedName = ref('')
const notice = ref('')
const greetingMode = ref('friendly')

function normalizeName(value) {
  return value.trim().replace(/\s+/g, ' ')
}

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const normalized = normalizeName(saved)
      if (normalized) {
        fullName.value = normalized
        greetedName.value = normalized
      }
    }
    const storedMode = localStorage.getItem(MODE_KEY)
    if (storedMode === 'professional') greetingMode.value = storedMode
  } catch {
    // Browser privacy settings may prevent storage access.
  }
})

function changeMode(newMode) {
  if (newMode !== 'friendly' && newMode !== 'professional') return
  greetingMode.value = newMode
  try {
    localStorage.setItem(MODE_KEY, newMode)
  } catch {
    // Greeting selection still works when localStorage is blocked.
  }
}

function submitName() {
  const normalized = normalizeName(fullName.value)
  if (!normalized) {
    notice.value = 'Please enter your full name.'
    greetedName.value = ''
    return
  }

  fullName.value = normalized
  greetedName.value = normalized
  notice.value = ''
  try {
    localStorage.setItem(STORAGE_KEY, normalized)
  } catch {
    // The greeting still works even when storage is unavailable.
  }
}

function clearName() {
  fullName.value = ''
  greetedName.value = ''
  notice.value = ''
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Clearing the visible form does not depend on storage access.
  }
}
</script>

<template>
  <section class="welcome-card" aria-labelledby="welcome-title">
    <div class="card-head">
      <div class="card-symbol" aria-hidden="true">👋</div>
      <div>
        <p class="card-kicker">INTERACTIVE VUE COMPONENT</p>
        <h2 id="welcome-title">Make it personal</h2>
      </div>
    </div>
    <p class="helper">Enter your name and see Vue react instantly. Your last greeting is remembered only in this browser.</p>

    <form class="name-form" @submit.prevent="submitName">
      <label for="vueFullName">Your full name</label>
      <div class="form-row">
        <input id="vueFullName" v-model="fullName" name="fullName" type="text" autocomplete="name" maxlength="80" placeholder="e.g. Ada Lovelace" required />
        <button type="submit">Say hello <span aria-hidden="true">↗</span></button>
      </div>
    </form>
    <p v-if="notice" class="validation" role="alert">{{ notice }}</p>

    <GreetingModePicker :model-value="greetingMode" @update:model-value="changeMode" />
    <GreetingMessage v-if="greetedName" :name="greetedName" :mode="greetingMode" @clear="clearName" />

    <div class="feature-grid" aria-label="App features">
      <span>✓ Reactive UI</span><span>✓ Local persistence</span><span>✓ Component tested</span>
    </div>
  </section>
</template>
