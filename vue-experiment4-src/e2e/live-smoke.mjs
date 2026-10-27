import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const base = 'https://eswaryuva.github.io/qgreendc-dashboard'
const nameKey = 'test-gpt-git.vue-experiment4.name.v1'
const modeKey = 'test-gpt-git.vue-experiment5.mode.v1'
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
const page = await context.newPage()

try {
  console.log('LIVE CHECK 1: Existing Vue page with default friendly greeting')
  const response = await page.goto(`${base}/vue-experiment4/`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  assert.equal(response?.status(), 200, 'Vue site did not return HTTP 200')
  await page.getByRole('heading', { name: /A real Vue app/ }).waitFor()
  await page.getByRole('radio', { name: /Friendly/ }).waitFor()
  assert.equal(await page.getByRole('radio', { name: /Friendly/ }).isChecked(), true)

  await page.getByRole('textbox', { name: 'Your full name' }).fill('Ada Lovelace')
  await page.getByRole('button', { name: /Say hello/ }).click()
  assert.match(await page.getByTestId('welcome-message').innerText(), /Welcome, Ada Lovelace! 👋/)
  assert.equal(await page.evaluate(key => localStorage.getItem(key), nameKey), 'Ada Lovelace')
  console.log('PASS: Original friendly greeting and name storage')

  console.log('LIVE CHECK 2: Switch to new professional greeting')
  await page.getByRole('radio', { name: /Professional/ }).check()
  assert.match(await page.getByTestId('welcome-message').innerText(), /Hello, Ada Lovelace\. 🤝/)
  assert.equal(await page.evaluate(key => localStorage.getItem(key), modeKey), 'professional')
  console.log('PASS: Professional greeting and mode storage')

  console.log('LIVE CHECK 3: Name and mode restore on reload')
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByTestId('welcome-message').waitFor()
  assert.equal(await page.getByRole('radio', { name: /Professional/ }).isChecked(), true)
  assert.equal(await page.getByRole('textbox', { name: 'Your full name' }).inputValue(), 'Ada Lovelace')
  assert.match(await page.getByTestId('welcome-message').innerText(), /Hello, Ada Lovelace\. 🤝/)
  console.log('PASS: Persistence after page reload')

  console.log('LIVE CHECK 4: Switch back to friendly and clear stored name')
  await page.getByRole('radio', { name: /Friendly/ }).check()
  assert.match(await page.getByTestId('welcome-message').innerText(), /Welcome, Ada Lovelace! 👋/)
  await page.getByRole('button', { name: /Clear saved name/ }).click()
  assert.equal(await page.getByTestId('welcome-message').count(), 0)
  assert.equal(await page.evaluate(key => localStorage.getItem(key), nameKey), null)
  console.log('PASS: Style switch, clear and storage reset')

  console.log('LIVE CHECK 5: Original Experiment 3 HTML remains functional')
  const oldResponse = await page.goto(`${base}/test-gpt-git/`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  assert.equal(oldResponse?.status(), 200, 'HTML demo did not return HTTP 200')
  await page.getByRole('textbox', { name: 'Your full name' }).fill('Grace Hopper')
  await page.getByRole('button', { name: 'Submit' }).click()
  assert.match(await page.locator('#welcomeMessage').innerText(), /Welcome, Grace Hopper! 👋🎉/)
  await page.getByRole('button', { name: /Run original interaction test/ }).click()
  assert.match(await page.locator('#result').innerText(), /Success! JavaScript works/)
  console.log('PASS: Original HTML welcome page and interaction test')

  console.log('FINAL: All five deployed-site browser checks passed')
} finally {
  await browser.close()
}
