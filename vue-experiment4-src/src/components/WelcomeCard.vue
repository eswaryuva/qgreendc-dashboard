<script setup>
import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'test-gpt-git.vue-experiment4.name.v1'
const fullName = ref('')
const greetedName = ref('')
const notice = ref('')

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
  } catch {
    // Storage can be unavailable in privacy modes. The form still works.
  }
})

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
    // Do not block greeting if browser storage is unavailable.
  }
}

function clearName() {
  fullName.value = ''
  greetedName.value = ''
  notice.value = ''
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Reset the visible form regardless of browser storage permissions.
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

    <div v-if="greetedName" class="greeting" data-testid="welcome-message" role="status" aria-live="polite">
      <div><span class="greeting-emoji" aria-hidden="true">🎉</span><strong>Welcome, {{ greetedName }}! 👋</strong></div>
      <button type="button" class="clear-btn" @click="clearName">Clear saved name</button>
    </div>

    <div class="feature-grid" aria-label="App features">
      <span>✓ Reactive UI</span><span>✓ Local persistence</span><span>✓ Component tested</span>
    </div>
  </section>
</template>
