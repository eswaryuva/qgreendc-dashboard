# Experiment 4 — Vue 3 + Vite

This standalone Vue application lives separately from the existing `test-gpt-git/` welcome page.

## Locally (optional)

- Node.js 22+
- `npm install`
- `npm test`
- `npm run build`

No local build is required for the experiment: GitHub Actions runs tests, builds this app and commits production assets to `../vue-experiment4/` on the existing test branch.

## Hosting

The generated site is expected at:
https://eswaryuva.github.io/qgreendc-dashboard/vue-experiment4/

The project uses Vite `base: '/qgreendc-dashboard/vue-experiment4/'`.

**GitHub Pages note:** GitHub Actions `GITHUB_TOKEN` commits do not trigger branch-based Pages builds. After the Actions output commit, a separate authorized Chat-to-GitHub commit must trigger the Pages build. The existing Experiment 3 site remains at `/test-gpt-git/`.

Source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
