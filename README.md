# ChatGPT ↔ GitHub experiments

Testing an end-to-end development workflow using regular ChatGPT Chat and the GitHub integration, without Codex or Work.

## Experiment 3 — HTML, CSS and JavaScript

- Source: [test-gpt-git/](./test-gpt-git/)
- Website: https://eswaryuva.github.io/qgreendc-dashboard/test-gpt-git/
- Automated checks: `.github/workflows/welcome-tests.yml`

## Experiment 4 — Vue 3, Vite and Vitest

- Source: [vue-experiment4-src/](./vue-experiment4-src/)
- Built website: [vue-experiment4/](./vue-experiment4/)
- Website: https://eswaryuva.github.io/qgreendc-dashboard/vue-experiment4/
- Automated build, six component tests and output publishing: `.github/workflows/vue-experiment4.yml`
- CI built output is committed to this test branch under `vue-experiment4/`.

The original HTML experiment retains its URL and files. Only the working test branch is changed; `main` is left untouched.

### GitHub Pages branch publishing note

GitHub Actions commits made using `GITHUB_TOKEN` do not trigger GitHub Pages branch builds. This README update, committed via the authorized Chat ↔ GitHub connection, triggers a fresh Pages build that includes both experiment folders.
