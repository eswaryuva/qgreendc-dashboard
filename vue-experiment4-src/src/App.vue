<script setup>
import WelcomeCard from './components/WelcomeCard.vue'
</script>

<template>
  <main class="page">
    <nav class="topbar" aria-label="Experiment navigation">
      <div class="brand"><span class="brand-icon">◆</span> ChatGPT × GitHub</div>
      <span class="status"><span class="status-dot"></span> Experiment 04 · Vue 3</span>
    </nav>

    <section class="hero">
      <p class="eyebrow">CHAT → GITHUB → ACTIONS → PAGES</p>
      <h1>A real Vue app.<br /><span>Built from Chat.</span></h1>
      <p class="intro">This Vue 3 + Vite application is developed through regular ChatGPT and GitHub, with automated component tests and a production build running in GitHub Actions.</p>
    </section>

    <WelcomeCard />

    <footer class="footer">
      <span>Vue 3 · Vite · Vitest · GitHub Pages</span>
      <a href="../test-gpt-git/">View Experiment 3 ↗</a>
    </footer>
  </main>
</template>
