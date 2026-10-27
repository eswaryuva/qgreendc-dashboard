import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const STORAGE_KEY = 'test-gpt-git.welcome.fullName.v1';

function launch({ savedName, blockedStorage = false } = {}) {
  const store = new Map();
  if (savedName !== undefined) store.set(STORAGE_KEY, savedName);

  const ids = ['welcomeForm', 'fullName', 'welcomeMessage', 'testButton', 'result'];
  const elements = Object.fromEntries(ids.map((id) => [id, {
    value: '', textContent: '', focused: false, listeners: {},
    focus() { this.focused = true; },
    addEventListener(type, callback) { this.listeners[type] = callback; },
  }]));

  const localStorage = {
    getItem(key) {
      if (blockedStorage) throw new Error('Storage unavailable');
      return store.get(key) ?? null;
    },
    setItem(key, value) {
      if (blockedStorage) throw new Error('Storage unavailable');
      store.set(key, value);
    },
  };

  const document = { getElementById(id) { return elements[id]; } };
  runInNewContext(script, { document, localStorage });

  return {
    elements, store,
    submit() {
      let prevented = false;
      elements.welcomeForm.listeners.submit({ preventDefault() { prevented = true; } });
      return prevented;
    },
    clickTest() { elements.testButton.listeners.click(); },
  };
}

test('HTML uses separated stylesheet and JS and keeps the original elements', () => {
  assert.match(html, /href="\.\/styles\.css"/);
  assert.match(html, /src="\.\/app\.js"/);
  for (const id of ['welcomeForm', 'fullName', 'welcomeMessage', 'testButton', 'result']) {
    assert.ok(html.includes(`id="${id}"`), `Missing ${id}`);
  }
  assert.match(css, /#welcomeMessage/);
  assert.doesNotMatch(html, /<style\b|<script>(?!\s*<)/i);
});

test('submitting a name displays personalized greeting and saves it', () => {
  const app = launch();
  app.elements.fullName.value = '  Ada   Lovelace  ';
  assert.equal(app.submit(), true);
  assert.equal(app.elements.welcomeMessage.textContent, 'Welcome, Ada Lovelace! 👋🎉');
  assert.equal(app.store.get(STORAGE_KEY), 'Ada Lovelace');
  assert.equal(app.elements.fullName.value, 'Ada Lovelace');
});

test('saved name is restored and welcomed on reload', () => {
  const app = launch({ savedName: 'Grace Hopper' });
  assert.equal(app.elements.fullName.value, 'Grace Hopper');
  assert.equal(app.elements.welcomeMessage.textContent, 'Welcome, Grace Hopper! 👋🎉');
});

test('empty or whitespace-only name is rejected without persisting', () => {
  const app = launch();
  app.elements.fullName.value = '   ';
  app.submit();
  assert.equal(app.elements.welcomeMessage.textContent, 'Please enter your full name.');
  assert.equal(app.elements.fullName.focused, true);
  assert.equal(app.store.size, 0);
});

test('storage being blocked does not break submission', () => {
  const app = launch({ blockedStorage: true });
  app.elements.fullName.value = 'Test User';
  app.submit();
  assert.equal(app.elements.welcomeMessage.textContent, 'Welcome, Test User! 👋🎉');
});

test('names containing markup are displayed as plain text', () => {
  const app = launch();
  app.elements.fullName.value = '<img src=x onerror=alert(1)>';
  app.submit();
  assert.equal(app.elements.welcomeMessage.textContent, 'Welcome, <img src=x onerror=alert(1)>! 👋🎉');
  assert.match(script, /message\.textContent =/);
});

test('original JavaScript interaction remains functional', () => {
  const app = launch();
  app.clickTest();
  assert.match(app.elements.result.textContent, /Success! JavaScript works/);
});
