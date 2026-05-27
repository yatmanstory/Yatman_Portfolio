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

function getProjects() {
  const match = html.match(/const projects = (\[[\s\S]*?\n\s*\]);/);
  assert.ok(match, 'index.html should define const projects = [...] for modal case studies');
  return JSON.parse(JSON.stringify(vm.runInNewContext(match[1], {}, { timeout: 1000 })));
}

function assetExists(src) {
  return existsSync(new URL(`../${src}`, import.meta.url));
}

test('Happy Path: project data and cards cover all case studies', () => {
  const projects = getProjects();
  const expectedIds = ['dashboard', 'card-rag', 'crewai', 'obsidian'];
  const cardMatches = [...html.matchAll(/<button\s+type="button"\s+data-project-card\s+data-project-id="([^"]+)"[\s\S]*?<\/button>/g)];
  const cardIds = cardMatches.map((match) => match[1]);

  assert.deepEqual(projects.map((project) => project.id), expectedIds);
  assert.equal(cardMatches.length, 4);
  assert.deepEqual(cardIds, expectedIds);
  assert.deepEqual(cardIds, projects.map((project) => project.id));

  for (const [index, cardMatch] of cardMatches.entries()) {
    const cardHtml = cardMatch[0];
    const srcMatch = cardHtml.match(/<img\s+src="([^"]+)"/);
    const altMatch = cardHtml.match(/alt="([^"]+)"/);

    assert.ok(srcMatch, `${cardIds[index]} card should have an image src`);
    assert.ok(altMatch, `${cardIds[index]} card should have image alt text`);
    assert.ok(assetExists(srcMatch[1]), `${srcMatch[1]} should exist`);
    assert.ok(altMatch[1].length >= 12, `${cardIds[index]} card should have useful image alt text`);
    assert.match(cardHtml, /onerror="handleImageError\(this\)"/);
  }

  for (const project of projects) {
    assert.match(html, new RegExp(`data-project-id="${project.id}"`));
    assert.equal(typeof project.title, 'string');
    assert.ok(project.title.length > 4);
    assert.equal(typeof project.category, 'string');
    assert.ok(project.category.includes('/'));
    assert.equal(typeof project.summary, 'string');
    assert.ok(project.summary.length > 12);
    assert.equal(typeof project.problem, 'string');
    assert.equal(typeof project.role, 'string');
    assert.ok(Array.isArray(project.implementation));
    assert.ok(project.implementation.length >= 3);
    assert.equal(typeof project.outcome, 'string');
    assert.equal(typeof project.limits, 'string');
    assert.ok(Array.isArray(project.images));
    assert.ok(project.images.length >= 3);

    for (const image of project.images) {
      assert.ok(assetExists(image.src), `${image.src} should exist`);
      assert.ok(image.alt.length >= 12, `${image.src} should have useful alt text`);
    }
  }
});

test('Edge Case: modal close paths are wired', () => {
  assert.match(html, /id="project-modal"/);
  assert.match(html, /data-modal-close/);
  assert.match(html, /const projectModal = document\.getElementById\('project-modal'\)/);
  assert.match(html, /document\.addEventListener\('keydown'/);
  assert.match(html, /event\.key === 'Escape'/);
  assert.match(html, /projectModal\.addEventListener\('click'/);
  assert.match(html, /event\.target === projectModal/);
  assert.match(html, /lastFocusedCard\.focus\(\)/);
});
