/*
Test Plan:
1. Happy Path:
   - Each project card maps to a project data entry and opens a modal data source with a screenshot gallery.

2. Edge Cases:
   - Light-only theme constraints prevent dark-mode rendering.
   - Modal close paths are wired for close button, Escape key, and overlay click.
   - Responsive classes keep the hero, card grid, modal, and gallery usable on mobile and desktop.

3. Failure Path:
   - Image fallback handling preserves layout and meaningful alt text when an image fails to load.
*/

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('Edge Case: light-only theme constraints are enforced', () => {
  assert.match(html, /<html lang="ko">/);
  assert.match(html, /Jaehyuk Song \/\/ AI PoC Builder/);
  assert.match(html, /background-color:\s*#f7fafc;/);
  assert.doesNotMatch(html, /darkMode\s*:/);
  assert.doesNotMatch(html, /\bdark:/);
  assert.doesNotMatch(html, /classList\.(add|toggle)\(['"]dark/);
  assert.doesNotMatch(html, /<html[^>]*class=["'][^"']*dark/);
});
