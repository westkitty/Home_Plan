'use strict';
/* Local-only scene appearance preference. Never alters apartment geometry or exported layouts. */
(() => {
  const DEFAULT = '#103B4A';
  const STORAGE_KEY = 'homeplan-scene-background-v1';
  const valid = value => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
  const normalize = value => valid(value) ? value.toUpperCase() : null;
  const picker = document.getElementById('sceneBackgroundColor');
  const valueLabel = document.getElementById('sceneBackgroundValue');
  const resetButton = document.getElementById('sceneBackgroundReset');
  let color = DEFAULT;
  let drawScheduled = false;
  try {
    let stored = normalize(localStorage.getItem(STORAGE_KEY));
    if (stored === '#C9E9FF') {
      stored = DEFAULT;
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    }
    color = stored || DEFAULT;
  } catch (_) { /* private storage can be disabled */ }
  function reflect() {
    document.documentElement.style.setProperty('--scene-background', color);
    if (picker && picker.value.toUpperCase() !== color) picker.value = color;
    if (valueLabel) valueLabel.textContent = color;
    if (resetButton) resetButton.disabled = color === DEFAULT;
  }
  function requestDraw() {
    if (drawScheduled) return;
    drawScheduled = true;
    requestAnimationFrame(() => {
      drawScheduled = false;
      window.homePlanStudioBridge?.draw?.();
    });
  }
  function setColor(next, save = true) {
    const normalized = normalize(next);
    if (!normalized) return false;
    if (normalized === color) return true;
    color = normalized;
    if (save) { try { localStorage.setItem(STORAGE_KEY, color); } catch (_) { /* still works for this session */ } }
    reflect();
    requestDraw();
    return true;
  }
  function reset() {
    color = DEFAULT;
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* still resets this session */ }
    reflect();
    requestDraw();
  }
  picker?.addEventListener('input', e => setColor(e.target.value));
  picker?.addEventListener('change', e => setColor(e.target.value));
  resetButton?.addEventListener('click', reset);
  window.addEventListener('storage', e => {
    if (e.key !== STORAGE_KEY) return;
    setColor(normalize(e.newValue) || DEFAULT, false);
  });
  reflect();
  window.HomePlanAppearance = { DEFAULT, STORAGE_KEY, getColor: () => color, setColor, reset };
})();
