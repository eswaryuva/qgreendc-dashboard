(() => {
  'use strict';

  // Stored only in this browser. No server, cookies, or external API.
  const STORAGE_KEY = 'test-gpt-git.welcome.fullName.v1';
  const form = document.getElementById('welcomeForm');
  const input = document.getElementById('fullName');
  const message = document.getElementById('welcomeMessage');
  const testButton = document.getElementById('testButton');
  const result = document.getElementById('result');

  const normalizeName = (value) => value.trim().replace(/\s+/g, ' ');
  const welcome = (name) => {
    // textContent avoids interpreting user input as HTML.
    message.textContent = `Welcome, ${name}! 👋🎉`;
  };

  // Restore the submitted name after reload, when browser storage is available.
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const name = normalizeName(saved);
      if (name) {
        input.value = name;
        welcome(name);
      }
    }
  } catch {
    // Private browsing / disabled storage must not break the welcome form.
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = normalizeName(input.value);
    if (!name) {
      message.textContent = 'Please enter your full name.';
      input.focus();
      return;
    }

    input.value = name;
    welcome(name);
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch {
      // The greeting still works even if persistence is unavailable.
    }
  });

  // Keep the original integration test usable.
  testButton.addEventListener('click', () => {
    result.textContent = 'Success! JavaScript works and the sample page is interactive.';
  });
})();
