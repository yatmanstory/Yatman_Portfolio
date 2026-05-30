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
import { existsSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('Edge Case: light-only theme constraints are enforced', () => {
  assert.match(html, /<html lang="ko">/);
  assert.match(html, /Jaehyuk Song \/\/ AI PoC Builder/);
  assert.match(html, /I shape <span class="text-secondary">ideas<\/span> into systems that <span class="text-secondary">work<\/span>\./);
  assert.match(html, /저는 아이디어를 구조화하고, 구현을 이끌며, 작동하는 결과로 증명합니다\./);
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

function readWebpDimensions(src) {
  const buffer = readFileSync(new URL(`../${src}`, import.meta.url));
  assert.equal(buffer.toString('ascii', 0, 4), 'RIFF', `${src} should be a RIFF WebP file`);
  assert.equal(buffer.toString('ascii', 8, 12), 'WEBP', `${src} should be a WebP file`);
  const chunkType = buffer.toString('ascii', 12, 16);

  if (chunkType === 'VP8X') {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }

  if (chunkType === 'VP8 ') {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  assert.fail(`${src} should expose VP8X or VP8 image dimensions`);
}

function parseAttributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/\s([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]),
  );
}

function getSectionById(id) {
  return [...html.matchAll(/<section\b[^>]*>/g)]
    .map((match) => match[0])
    .find((tag) => parseAttributes(tag).id === id);
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
    assert.match(cardHtml, /View Case Study/);
    assert.match(cardHtml, /arrow_forward/);
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
  assert.match(html, /function getModalFocusableElements\(\)/);
  assert.match(html, /function trapModalFocus\(event\)/);
  assert.match(html, /event\.key !== 'Tab'/);
  assert.match(html, /event\.shiftKey/);
  assert.match(html, /trapModalFocus\(event\)/);
  assert.doesNotMatch(html, /Limits & Improvements/);
  assert.doesNotMatch(html, /modal-limits/);
  assert.doesNotMatch(html, /modal-summary/);
});

test('Static Contract: approved dashboard and CardChat case copy is concise', () => {
  const projects = getProjects();
  const dashboard = projects.find((project) => project.id === 'dashboard');
  const cardChat = projects.find((project) => project.id === 'card-rag');

  assert.ok(dashboard, 'dashboard project should exist');
  assert.equal(
    dashboard.summary,
    '상담원이 개인 PC에서 팀 KPI와 인입 현황을 바로 확인할 수 있도록 만든 내부 운영 대시보드입니다.',
  );
  assert.equal(
    dashboard.problem,
    'TV 화면에만 의존하던 인입 현황을 개인 업무 화면으로 옮겨, 대기 상황과 업무 집중도를 더 빠르게 파악할 수 있게 했습니다.',
  );
  assert.equal(
    dashboard.role,
    '문제 정의, 화면 흐름 설계, 데이터 구조 정리, AI Coding Agent 기반 구현 지시와 배포를 담당했습니다.',
  );
  assert.deepEqual(dashboard.implementation, [
    '실시간 KPI와 상담 인입 현황 시각화',
    '상담원별 생산성·통화 시간·휴식 지표 정리',
    '이메일 응대 자동화로 반복 업무 형식 표준화',
  ]);
  assert.equal(
    dashboard.outcome,
    '운영 데이터가 팀 관리와 교육 기준으로 활용되었고, 담당 팀은 월별 KPI 기준 5개 팀 중 1위를 달성했습니다.',
  );

  assert.ok(cardChat, 'card-rag project should exist');
  assert.equal(
    cardChat.summary,
    '카드 혜택 추천 품질을 높이기 위해 검색 전략을 조합하고, 모델 기반 평가로 반복 검증한 RAG 실험 프로젝트입니다.',
  );
  assert.deepEqual(cardChat.implementation, [
    'BM25와 Dense Retriever를 결합한 하이브리드 검색 구조 설계',
    'Cohere Rerank로 검색 문서를 관련도 높은 순서로 재정렬',
    'HardFilter, Multi Query, RRF 가중치 기반 커스텀 검색 전략 비교',
    '10개 페르소나와 반복 질의를 사용한 모델 기반 평가 구성',
  ]);
  assert.match(cardChat.outcome, /150회 단위의 모델 기반 평가/);
  assert.match(cardChat.outcome, /검색 파이프라인 개선이 LLM 교체보다 추천 품질에 더 큰 영향을 줄 수 있음/);
});

test('Static Contract: approved CrewAI case copy and login image are applied', () => {
  const projects = getProjects();
  const crewai = projects.find((project) => project.id === 'crewai');
  const crewaiCard = html.match(/<button\s+type="button"\s+data-project-card\s+data-project-id="crewai"[\s\S]*?<\/button>/);

  assert.ok(crewai, 'crewai project should exist');
  assert.ok(crewaiCard, 'crewai card should exist');
  assert.match(crewaiCard[0], /<img src="assets\/images\/crewai-crop-10\.webp"/);
  assert.match(crewaiCard[0], /alt="CrewAI 로그인 홈 화면"/);
  assert.equal(crewai.images[0].src, 'assets/images/crewai-crop-10.webp');
  assert.equal(crewai.images[0].alt, 'CrewAI 로그인 홈 화면');
  assert.equal(crewai.title, 'CrewAI 기반 Multi-Agent Workflow Builder');
  assert.equal(
    crewai.problem,
    'CrewAI는 강력한 프레임워크지만, Agent·Task·Flow를 직접 정의하고 실행하려면 구조를 이해해야 해서 일반 사용자가 다루기 어렵습니다.',
  );
  assert.equal(
    crewai.role,
    'Workflow 구성 방식 설계, Builder UX 흐름 정리, Agent·Task·Flow 관리 화면과 실행 흐름 구현 지시를 담당했습니다.',
  );
  assert.deepEqual(crewai.implementation, [
    'Agent, Task, Crew, Flow 구성 요소 관리',
    'Builder 화면에서 Workflow를 조립하는 구조 설계',
    '실행 전 설정과 실행 결과를 분리한 운영 흐름 구성',
    'Tool, Credential, Knowledge 등 실행 자원 관리 화면 설계',
  ]);
  assert.equal(
    crewai.outcome,
    '프레임워크 중심의 Multi-Agent 구성을 사용자가 조작 가능한 SaaS형 Builder 흐름으로 풀어냈습니다. Agent 실행보다 중요한 것은 구성 요소, 실행 조건, 결과 상태를 명확히 분리하는 구조라는 점을 확인했습니다.',
  );
});

test('Static Contract: approved Obsidian summary is applied', () => {
  const obsidian = getProjects().find((project) => project.id === 'obsidian');
  const obsidianCard = html.match(/<button\s+type="button"\s+data-project-card\s+data-project-id="obsidian"[\s\S]*?<\/button>/);

  assert.ok(obsidian, 'obsidian project should exist');
  assert.ok(obsidianCard, 'obsidian card should exist');
  assert.match(obsidianCard[0], /<img src="assets\/images\/obsidian-hero\.webp"/);
  assert.match(obsidianCard[0], /alt="Go 기반 멀티 에이전트 AI 오케스트레이션 시스템 구조도"/);
  assert.equal(obsidian.images[0].src, 'assets/images/obsidian-hero.webp');
  assert.equal(obsidian.images[0].alt, 'Go 기반 멀티 에이전트 AI 오케스트레이션 시스템 구조도');
  assert.deepEqual(obsidian.images.map((image) => image.src), [
    'assets/images/obsidian-hero.webp',
    'assets/images/obsidian-01.webp',
    'assets/images/obsidian-02.webp',
    'assets/images/obsidian-chat-ui.webp',
    'assets/images/obsidian-05.webp',
    'assets/images/obsidian-chat-ui-detail.webp',
    'assets/images/obsidian-06.webp',
  ]);
  assert.equal(
    obsidian.summary,
    '흩어진 맥락을 정리하고, Agent가 참고할 수 있는 작업 지식 시스템을 설계하고 있습니다.',
  );
});

test('Static Contract: CrewAI screenshots are cropped consistently', () => {
  const crewai = getProjects().find((project) => project.id === 'crewai');
  const crewaiImages = [...new Set(crewai.images.map((image) => image.src))];

  assert.equal(crewaiImages.length, 10);

  for (const imagePath of crewaiImages) {
    assert.match(imagePath, /^assets\/images\/crewai-crop-\d{2}\.webp$/);
    assert.deepEqual(readWebpDimensions(imagePath), { width: 3838, height: 1760 });
  }

  assert.doesNotMatch(html, /assets\/images\/crewai-\d{2}\.webp/);
});

test('Edge Case: responsive structure is encoded for mobile and desktop', () => {
  assert.match(html, /text-\[36px\] md:text-\[56px\] lg:text-\[64px\]/);
  assert.match(html, /grid-cols-1 md:grid-cols-2 xl:grid-cols-4/);
  assert.match(html, /grid-cols-1 lg:grid-cols-12/);
  assert.match(html, /max-h-\[calc\(100vh-48px\)\] overflow-y-auto/);
  assert.match(html, /px-margin-mobile md:px-gutter/);
  assert.match(html, /min-h-20 py-3/);
  assert.match(html, /max-w-\[52vw\] md:max-w-none/);
  assert.doesNotMatch(html, /letterSpacing":\s*"-/);
  assert.doesNotMatch(html, /tracking-tighter|tracking-tight|tracking-widest/);
});

test('Static Contract: internal navigation anchors are complete and offset for sticky header', () => {
  const requiredSectionIds = ['projects', 'process', 'stack', 'implementation-note'];
  const idMatches = [...html.matchAll(/\sid="([^"]+)"/g)];
  const ids = idMatches.map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  const internalHrefMatches = [...html.matchAll(/\shref="#([^"]*)"/g)];
  const internalTargets = internalHrefMatches.map((match) => match[1]);

  assert.doesNotMatch(html, /\shref="#"/, 'HTML should not include placeholder href="#" links');
  assert.deepEqual(duplicateIds, [], 'HTML should not include duplicate id attributes');

  for (const target of internalTargets) {
    assert.ok(ids.includes(target), `Internal link href="#${target}" should resolve to an existing id`);
  }

  for (const sectionId of requiredSectionIds) {
    const section = getSectionById(sectionId);
    assert.ok(ids.includes(sectionId), `Required section id="${sectionId}" should exist`);
    assert.ok(section, `Required section id="${sectionId}" should be a section target`);
    assert.match(parseAttributes(section).class ?? '', /\bscroll-mt-24\b/, `${sectionId} should offset sticky-header anchor scrolling`);
  }

  assert.match(html, /© 2026 AI POC BUILDER\. STATIC PORTFOLIO\./);
});

test('Static Contract: image references use optimized WebP assets', () => {
  const projects = getProjects();
  const imageRefs = [
    ...[...html.matchAll(/<img\b[^>]*\ssrc="([^"]+)"/g)].map((match) => match[1]),
    ...projects.flatMap((project) => project.images.map((image) => image.src)),
  ].filter((src) => src && !src.startsWith('${'));

  assert.ok(imageRefs.length >= 20, 'Portfolio should include all project gallery image references');
  assert.doesNotMatch(html, /\.(png|jpe?g)/i, 'Portfolio HTML should not reference heavy raster originals');

  for (const imagePath of new Set(imageRefs)) {
    assert.match(imagePath, /^assets\/images\/[a-z0-9-]+\.webp$/, `${imagePath} should use an optimized asset path`);
    assert.ok(assetExists(imagePath), `${imagePath} should exist`);
    assert.ok(statSync(new URL(`../${imagePath}`, import.meta.url)).size < 900 * 1024, `${imagePath} should stay under 900KB`);
  }
});

test('Static Contract: CardChat gallery uses numbered images in filename order', () => {
  const cardProject = getProjects().find((project) => project.id === 'card-rag');
  const expectedSlideImages = ['01', '02', '03', '04', '05', '06']
    .map((number) => `assets/images/cardchat-${number}.webp`);
  const expectedImages = ['assets/images/cardchat-app-demo.webp', ...expectedSlideImages];
  const cardMatch = html.match(/<button\s+type="button"\s+data-project-card\s+data-project-id="card-rag"[\s\S]*?<\/button>/);

  assert.ok(cardProject, 'card-rag project should exist');
  assert.ok(cardMatch, 'card-rag project card should exist');
  assert.deepEqual(cardProject.images.map((image) => image.src), expectedImages);
  assert.match(cardMatch[0], /<img\s+src="assets\/images\/cardchat-app-demo\.webp"/);
  assert.match(cardProject.images[0].alt, /실제 앱/);

  for (const imagePath of expectedImages) {
    assert.ok(assetExists(imagePath), `${imagePath} should exist`);
  }
});

test('Static Contract: modal preview opens the selected original image', () => {
  assert.match(html, /id="modal-gallery-original-link"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener"/);
  assert.match(html, /id="modal-gallery-original-label"[\s\S]*?원본 보기/);
  assert.match(html, /const modalGalleryOriginalLink = document\.getElementById\('modal-gallery-original-link'\)/);
  assert.match(html, /modalGalleryOriginalLink\.href = image\.src/);
  assert.match(html, /modalGalleryOriginalLink\.setAttribute\('aria-label', `\$\{image\.alt\} 원본 이미지 새 탭으로 보기`\)/);
});

test('Failure Path: image fallback handling preserves layout', () => {
  const projects = getProjects();
  assert.match(html, /function handleImageError\(image\)/);
  assert.match(html, /frame\.setAttribute\('data-image-fallback', 'true'\)/);
  assert.match(html, /onerror="handleImageError\(this\)"/);
  assert.match(html, /modalGalleryPreview\.classList\.remove\('opacity-0'\)/);
  assert.match(html, /previewFrame\.removeAttribute\('data-image-fallback'\)/);
  assert.doesNotMatch(html, /googleusercontent\.com/);
  assert.doesNotMatch(html, /<img\b[^>]*\ssrc="https?:\/\//);

  for (const project of projects) {
    for (const image of project.images) {
      assert.ok(image.alt.length >= 12, `${image.src} should keep useful fallback text`);
    }
  }
});
