# Portfolio Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-file GitHub Pages portfolio for `Jaehyuk Song // AI PoC Builder` using the approved Architectural Precision design and local project screenshots.

**Architecture:** Extend the existing `index.html` instead of replacing the project with a framework. Keep all UI, project data, modal behavior, and gallery behavior in the single HTML file, with one small Node static test file for TDD verification. Use real local image paths from the four project folders and one reusable modal populated from a `projects` data array.

**Tech Stack:** Static HTML, Tailwind CDN, inline JavaScript, local PNG assets, Node built-in `node:test` for static checks.

---

## File Structure

- Modify: `index.html`
  - Owns the GitHub Pages page, light-only visual shell, hero, project cards, modal case study, gallery, and inline JavaScript.
- Create: `tests/portfolio-static.test.mjs`
  - Node built-in tests that enforce the approved TDD plan: happy path, three realistic edge cases, and one failure path.
- Create: `.gitignore`
  - Keeps local brainstorming artifacts and macOS metadata out of commits.
- Reference only: `docs/superpowers/specs/2026-05-27-portfolio-page-design.md`
  - Approved design source.
- Reference only: `ai_coding_agent_portfolio_strategy.md`
  - Copy and positioning source.
- Reference only: `DESIGN.md`
  - Visual system source.

## Scope Check

The approved spec covers one cohesive static portfolio page. It does not need to be split into separate plans because the page, cards, modal, and tests all ship together as one working GitHub Pages artifact.

---

### Task 1: Add Static Test Harness And Light-Only Failing Test

**Files:**
- Create: `.gitignore`
- Create: `tests/portfolio-static.test.mjs`
- Modify: none

- [ ] **Step 1: Create repository hygiene ignore rules**

Create `.gitignore` with exactly:

```gitignore
.DS_Store
.superpowers/
User attachment.png
```

- [ ] **Step 2: Write the first failing test**

Create `tests/portfolio-static.test.mjs` with exactly:

```js
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
```

- [ ] **Step 3: Run the test and confirm it fails**

Run:

```bash
node --test tests/portfolio-static.test.mjs
```

Expected: FAIL. The current page still uses the old brand and has `darkMode: "class"`.

- [ ] **Step 4: Do not commit yet**

Reason: The test is intentionally failing. Commit after Task 2 makes it pass.

---

### Task 2: Make The Shell Light-Only And Update Brand/Hero

**Files:**
- Modify: `index.html`
- Test: `tests/portfolio-static.test.mjs`

- [ ] **Step 1: Remove dark-mode configuration and old brand**

In `index.html`, make these exact edits:

```html
<html lang="ko">
```

Remove this line from the Tailwind config:

```js
darkMode: "class",
```

Replace every visible `ARCHITECT // AI` brand occurrence with:

```text
Jaehyuk Song // AI PoC Builder
```

- [ ] **Step 2: Update the hero copy**

Replace the existing hero label, heading, and body copy with this content while preserving the surrounding grid and spacing classes:

```html
<div class="flex items-center gap-base">
  <span class="w-12 h-[1px] bg-secondary"></span>
  <span class="font-label-caps text-label-caps text-secondary uppercase">AI PoC Builder // AI-Assisted Development</span>
</div>
<h1 class="font-display text-[clamp(36px,6vw,64px)] leading-[1.08] text-primary max-w-[860px]">
  현장의 문제를 구조화하고, AI Coding Agent로 검증 가능한 <span class="text-secondary">LLM 프로토타입</span>을 구현합니다.
</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-[680px] mt-base">
  고객센터 업무 자동화에서 시작해 RAG, Multi-Agent SaaS형 프로토타입, Obsidian 기반 AI Wiki까지 실험하고 있습니다. 저는 문제 정의, 데이터 흐름 설계, Agent 구현 지시, 결과 검증을 중심으로 AI-assisted development를 수행합니다.
</p>
```

- [ ] **Step 3: Replace hero calls to action**

Use real section anchors and omit dummy external links:

```html
<div class="flex flex-wrap gap-stack-md mt-stack-lg">
  <a href="#projects" class="px-8 py-4 bg-primary text-on-primary font-label-caps text-label-caps transition-all hover:bg-secondary active:scale-[0.98]">
    프로젝트 보기
  </a>
  <a href="#process" class="px-8 py-4 border border-primary text-primary font-label-caps text-label-caps transition-all hover:bg-primary-container hover:text-on-primary active:scale-[0.98]">
    작업 방식
  </a>
  <a href="#implementation-note" class="flex items-center gap-2 px-8 py-4 text-primary font-label-caps text-label-caps transition-all hover:text-secondary group">
    구현 방식 안내
    <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
  </a>
</div>
```

- [ ] **Step 4: Run the focused test**

Run:

```bash
node --test --test-name-pattern "light-only" tests/portfolio-static.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add .gitignore tests/portfolio-static.test.mjs index.html
git commit -m "test: add light-only portfolio shell coverage"
```

---

### Task 3: Add Project Data And Static Project Cards

**Files:**
- Modify: `tests/portfolio-static.test.mjs`
- Modify: `index.html`

- [ ] **Step 1: Extend the test file with project data checks**

Append this code to `tests/portfolio-static.test.mjs`:

```js
function getProjects() {
  const match = html.match(/const projects = (\[[\s\S]*?\n\s*\]);/);
  assert.ok(match, 'index.html should define const projects = [...] for modal case studies');
  return vm.runInNewContext(match[1]);
}

function assetExists(src) {
  return existsSync(new URL(`../${src}`, import.meta.url));
}

test('Happy Path: project data and cards cover all case studies', () => {
  const projects = getProjects();
  const expectedIds = ['dashboard', 'card-rag', 'crewai', 'obsidian'];

  assert.deepEqual(projects.map((project) => project.id), expectedIds);

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
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
node --test --test-name-pattern "project data" tests/portfolio-static.test.mjs
```

Expected: FAIL with `index.html should define const projects = [...] for modal case studies`.

- [ ] **Step 3: Add the project data block**

In `index.html`, add this script data block before the modal behavior functions in the final `<script>` tag:

```js
const projects = [
  {
    id: 'dashboard',
    title: '고객센터 KPI 모니터링·업무 자동화 웹 앱',
    category: 'OPERATIONS / DASHBOARD',
    summary: '상담원 개인 PC에서 팀 전체 KPI와 인입 현황을 실시간으로 확인할 수 있도록 만든 내부 업무 개선 웹 앱입니다.',
    problem: '기존에는 고객 인입 현황을 사무실 천장에 설치된 TV 한 대로만 확인해야 했습니다. 상담원이 화면을 의식적으로 보지 않으면 대기 상황을 체감하기 어려웠고, 일부 인원에게 업무 부담이 집중되는 문제가 반복되었습니다.',
    role: '문제 정의, 화면 흐름 설계, 데이터 흐름 설계, AI Coding Agent 기반 웹 프로토타입 구현, 배포, 사용자 피드백 반영을 담당했습니다.',
    implementation: [
      '상담원 개인 PC에서 확인 가능한 실시간 KPI 대시보드',
      '이메일 자동화 도구를 통한 응대 형식 표준화',
      '생산성, 평균 통화 시간, 휴식 사용 지표 기반의 팀 운영 보조'
    ],
    outcome: '대시보드 데이터는 저성과자 교육과 팀 운영 판단에 활용되었고, 담당 팀은 월별 KPI에서 생산·영업·품질 지표 기준 5개 팀 중 1위를 달성했습니다.',
    limits: '초기에는 빠른 구현에 집중해 문서화와 테스트가 부족했습니다. 이후 프로젝트에서는 기능 추가 전에 구조와 데이터 흐름을 먼저 정리하는 방식으로 개선하고 있습니다.',
    images: [
      { src: 'DashBoard_Project/스크린샷 2026-05-27 오후 12.30.45.png', alt: '고객센터 KPI 대시보드 메인 화면' },
      { src: 'DashBoard_Project/스크린샷 2026-05-27 오후 12.30.49.png', alt: '고객센터 상담원 상태와 KPI 표 화면' },
      { src: 'DashBoard_Project/스크린샷 2026-05-27 오후 12.31.02.png', alt: '고객센터 팀별 운영 지표 화면' },
      { src: 'DashBoard_Project/스크린샷 2026-05-27 오후 12.31.19.png', alt: '고객센터 대시보드 상세 상태 화면' },
      { src: 'DashBoard_Project/스크린샷 2026-05-27 오후 12.31.23.png', alt: '고객센터 대시보드 확장 지표 화면' },
      { src: 'DashBoard_Project/KakaoTalk_Photo_2026-05-21-17-25-21.png', alt: '모바일 비율로 캡처된 고객센터 KPI 화면' }
    ]
  },
  {
    id: 'card-rag',
    title: '하이브리드 RAG 카드 추천 시스템',
    category: 'RAG / RECOMMENDATION',
    summary: '카드 혜택 데이터를 검색하고 사용자 조건에 맞는 추천 근거를 생성하는 RAG 기반 추천 프로토타입입니다.',
    problem: '카드 혜택 데이터는 표현 방식이 제각각이라 단순 검색만으로는 사용자의 조건에 맞는 혜택을 안정적으로 찾기 어려웠습니다.',
    role: 'RAG 구조 설계, 검색 전략 고도화, LangChain 체인 구성, 평가 모드 설계를 담당했습니다. 코드는 AI Coding Agent의 도움을 받아 구현했고, 검색 흐름과 평가 기준을 설계했습니다.',
    implementation: [
      '혜택 단위 chunking과 메타데이터 기반 검색',
      '키워드 검색과 벡터 검색을 결합한 하이브리드 검색',
      'Rerank, Hard Filter, Multi Query, RRF 기반 성능 비교'
    ],
    outcome: '기본 검색 모델보다 커스텀 RAG 구조가 더 높은 승률을 보이는 결과를 확인했습니다. 검색 로직을 개선하면 모델 성능 차이를 일부 상쇄할 수 있다는 점을 실험으로 검증했습니다.',
    limits: '성능 비교 결과는 내부 평가 기준에 기반합니다. 포트폴리오에서는 평가 방식과 샘플 질문을 함께 보여주는 방식으로 신뢰도를 보강합니다.',
    images: [
      { src: 'Card_Chat/스크린샷 2026-05-27 오후 5.00.00.png', alt: '하이브리드 RAG 카드 추천 인사이트 화면' },
      { src: 'Card_Chat/스크린샷 2026-05-27 오후 5.00.06.png', alt: '카드 추천 챗 인터페이스 화면' },
      { src: 'Card_Chat/스크린샷 2026-05-27 오후 5.00.11.png', alt: '카드 혜택 추천 결과 화면' }
    ]
  },
  {
    id: 'crewai',
    title: 'CrewAI 기반 Multi-Agent SaaS Wrapper',
    category: 'MULTI-AGENT / BUILDER',
    summary: '사용자가 Agent Workflow를 구성하고 실행할 수 있도록 만든 SaaS형 Multi-Agent 오케스트레이션 프로토타입입니다.',
    problem: 'CrewAI 같은 Agent 프레임워크는 강력하지만 일반 사용자가 직접 Agent, Task, Flow를 구성하고 실행하기에는 추상도가 높고 사용 흐름이 복잡했습니다.',
    role: 'LLM 서비스 기획, Workflow 구성 요소 설계, Builder UX 흐름 설계, AI Coding Agent 기반 주요 프론트엔드 기능 및 백엔드 도메인 로직 구현을 담당했습니다.',
    implementation: [
      'Agent, Task 등 Workflow 구성 요소 CRUD',
      'React Flow 기반 Crew/Flow Builder',
      '편집 상태와 실행 상태를 분리한 Published Runtime Snapshot 구조'
    ],
    outcome: '사용자가 직접 Agent Workflow를 구성하고 실행할 수 있는 SaaS형 오케스트레이션 플랫폼 구조를 프로토타입으로 구현했습니다.',
    limits: '상용 SaaS가 아니라 프로토타입 수준입니다. 복잡한 Agent Workflow를 사용자 친화적인 Builder 구조로 바꾸려 한 시도에 초점을 둡니다.',
    images: [
      { src: 'CrewAI_Project/스크린샷 2026-05-27 오전 10.43.19.png', alt: 'CrewAI Agent Profile 관리 화면' },
      { src: 'CrewAI_Project/스크린샷 2026-05-27 오전 10.47.46.png', alt: 'CrewAI Builder 상세 구성 화면' },
      { src: 'CrewAI_Project/스크린샷 2026-05-27 오전 10.48.00.png', alt: 'CrewAI Generated Tasks 화면' },
      { src: 'CrewAI_Project/스크린샷 2026-05-27 오전 10.48.08.png', alt: 'CrewAI Crew Domains 화면' },
      { src: 'CrewAI_Project/스크린샷 2026-05-27 오전 10.48.21.png', alt: 'CrewAI Flow Graphs 화면' },
      { src: 'CrewAI_Project/스크린샷 2026-05-27 오전 10.48.31.png', alt: 'CrewAI Tool Nodes 화면' },
      { src: 'CrewAI_Project/스크린샷 2026-05-27 오전 10.48.50.png', alt: 'CrewAI Credentials 화면' },
      { src: 'CrewAI_Project/스크린샷 2026-05-27 오전 10.49.13.png', alt: 'CrewAI Knowledge 화면' },
      { src: 'CrewAI_Project/스크린샷 2026-05-27 오전 10.49.18.png', alt: 'CrewAI 실행 설정 화면' },
      { src: 'CrewAI_Project/스크린샷 2026-05-27 오전 10.50.15.png', alt: 'CrewAI 실행 결과 화면' }
    ]
  },
  {
    id: 'obsidian',
    title: 'Obsidian AI Wiki / Orchestration',
    category: 'AGENTIC DOCS / IN PROGRESS',
    summary: 'AI Coding Agent가 참고할 문서, 실행 흐름, 결과물을 관리하기 위한 Obsidian 기반 Agentic Engineering 실험입니다.',
    problem: 'AI Coding Agent를 활용한 개발에서는 기능이 커질수록 오래된 맥락, 불필요한 파일 참조, 문서화 부족으로 잘못된 구현이 반복될 수 있습니다.',
    role: '문제 정의, 문서 구조 설계, Agent 실행 흐름 설계, 입출력 계약 설계, Codex CLI 기반 실행 구조 실험을 진행하고 있습니다.',
    implementation: [
      'Wiki 기반 프로젝트 문서화 구조',
      'Agent가 참고할 문서 범위와 실행 흐름 정의',
      'Runtime, Middleware, 입출력 계약 설계'
    ],
    outcome: '현재 진행 중인 실험이며, 목표는 AI Coding Agent를 더 안정적으로 활용하기 위한 개발 문서화·실행 관리 구조를 만드는 것입니다.',
    limits: '완성 프로젝트가 아니라 진행 중인 연구·실험 프로젝트입니다. 결과물보다 문제의식, 구조화 방식, 문서화 철학을 보여주는 용도로 활용합니다.',
    images: [
      { src: 'Obsidian_Orchestration/스크린샷 2026-05-27 오후 8.57.23.png', alt: 'Obsidian 문서 인덱스와 SRC Chat 준비 화면' },
      { src: 'Obsidian_Orchestration/스크린샷 2026-05-27 오후 8.58.57.png', alt: 'Obsidian 기반 SRC Chat 브레인스토밍 화면' },
      { src: 'Obsidian_Orchestration/스크린샷 2026-05-27 오후 9.00.55.png', alt: 'Obsidian SRC Session 테이블 선택 화면' }
    ]
  }
];
```

- [ ] **Step 4: Replace the selected projects section**

Replace the current `SECTION 01 // SELECTED PoC` section with:

```html
<section id="projects" class="max-w-[1200px] mx-auto px-margin-mobile md:px-gutter py-section-gap">
  <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-stack-md mb-stack-lg border-b border-outline-variant/40 pb-4">
    <div>
      <span class="font-label-caps text-label-caps text-secondary uppercase">SECTION 01 // SELECTED PoC</span>
      <h2 class="font-headline-md text-headline-md text-primary mt-2">현업 문제에서 출발한 AI Prototype Case Studies</h2>
    </div>
    <p class="font-body-md text-body-md text-on-surface-variant max-w-[420px]">
      문제 정의, 데이터 흐름 설계, 구현 지시, 결과 검증까지 담당한 프로젝트입니다.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
    <button type="button" data-project-card data-project-id="dashboard" class="project-card group text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-4">
      <span data-image-frame class="block aspect-[4/3] bg-surface-container overflow-hidden mb-stack-sm border border-outline-variant/40">
        <img src="DashBoard_Project/스크린샷 2026-05-27 오후 12.30.45.png" alt="고객센터 KPI 대시보드 메인 화면" onerror="handleImageError(this)" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105">
      </span>
      <span class="font-label-caps text-label-caps text-secondary uppercase">OPERATIONS / DASHBOARD</span>
      <span class="block font-headline-sm text-headline-sm text-primary mt-1">고객센터 KPI 모니터링</span>
      <span class="block font-caption text-caption text-on-surface-variant mt-2">실제 업무 문제에서 출발한 실시간 운영 대시보드입니다.</span>
    </button>

    <button type="button" data-project-card data-project-id="card-rag" class="project-card group text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-4">
      <span data-image-frame class="block aspect-[4/3] bg-surface-container overflow-hidden mb-stack-sm border border-outline-variant/40">
        <img src="Card_Chat/스크린샷 2026-05-27 오후 5.00.00.png" alt="하이브리드 RAG 카드 추천 인사이트 화면" onerror="handleImageError(this)" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105">
      </span>
      <span class="font-label-caps text-label-caps text-secondary uppercase">RAG / RECOMMENDATION</span>
      <span class="block font-headline-sm text-headline-sm text-primary mt-1">하이브리드 RAG 카드 추천</span>
      <span class="block font-caption text-caption text-on-surface-variant mt-2">검색 구조와 평가 모드를 설계한 카드 혜택 추천 PoC입니다.</span>
    </button>

    <button type="button" data-project-card data-project-id="crewai" class="project-card group text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-4">
      <span data-image-frame class="block aspect-[4/3] bg-surface-container overflow-hidden mb-stack-sm border border-outline-variant/40">
        <img src="CrewAI_Project/스크린샷 2026-05-27 오전 10.43.19.png" alt="CrewAI Agent Profile 관리 화면" onerror="handleImageError(this)" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105">
      </span>
      <span class="font-label-caps text-label-caps text-secondary uppercase">MULTI-AGENT / BUILDER</span>
      <span class="block font-headline-sm text-headline-sm text-primary mt-1">CrewAI SaaS형 Builder</span>
      <span class="block font-caption text-caption text-on-surface-variant mt-2">Agent Workflow를 사용자가 구성하는 오케스트레이션 프로토타입입니다.</span>
    </button>

    <button type="button" data-project-card data-project-id="obsidian" class="project-card group text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-4">
      <span data-image-frame class="block aspect-[4/3] bg-surface-container overflow-hidden mb-stack-sm border border-outline-variant/40">
        <img src="Obsidian_Orchestration/스크린샷 2026-05-27 오후 8.57.23.png" alt="Obsidian 문서 인덱스와 SRC Chat 준비 화면" onerror="handleImageError(this)" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105">
      </span>
      <span class="font-label-caps text-label-caps text-secondary uppercase">AGENTIC DOCS / IN PROGRESS</span>
      <span class="block font-headline-sm text-headline-sm text-primary mt-1">Obsidian AI Wiki</span>
      <span class="block font-caption text-caption text-on-surface-variant mt-2">Agent 컨텍스트와 실행 계약을 문서로 관리하는 진행 중 실험입니다.</span>
    </button>
  </div>
</section>
```

- [ ] **Step 5: Run the focused test**

Run:

```bash
node --test --test-name-pattern "project data" tests/portfolio-static.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add tests/portfolio-static.test.mjs index.html
git commit -m "feat: add project cards and portfolio data"
```

---

### Task 4: Add Modal Markup And Close Behavior

**Files:**
- Modify: `tests/portfolio-static.test.mjs`
- Modify: `index.html`

- [ ] **Step 1: Add modal behavior tests**

Append this code to `tests/portfolio-static.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
node --test --test-name-pattern "modal close" tests/portfolio-static.test.mjs
```

Expected: FAIL because the modal markup and close behavior do not exist yet.

- [ ] **Step 3: Add reusable modal markup**

Add this modal block immediately before the footer:

```html
<div id="project-modal" class="fixed inset-0 z-[100] hidden bg-primary/50 px-4 py-6 md:p-8" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="modal-title">
  <div class="max-w-[1120px] mx-auto bg-surface-container-lowest border border-outline-variant max-h-[calc(100vh-48px)] overflow-y-auto">
    <div class="sticky top-0 z-10 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/40 px-6 md:px-10 py-5 flex items-center justify-between gap-stack-md">
      <div>
        <p id="modal-category" class="font-label-caps text-label-caps text-secondary uppercase"></p>
        <h2 id="modal-title" class="font-headline-md text-headline-md text-primary mt-1"></h2>
      </div>
      <button type="button" data-modal-close class="w-10 h-10 border border-outline-variant text-primary hover:bg-surface-container-high transition-colors flex items-center justify-center" aria-label="프로젝트 상세 닫기">
        <span class="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter px-6 md:px-10 py-8 md:py-10">
      <div class="lg:col-span-5 flex flex-col gap-stack-md">
        <p id="modal-summary" class="font-body-lg text-body-lg text-on-surface-variant"></p>

        <div>
          <h3 class="font-label-caps text-label-caps text-secondary uppercase mb-2">Problem</h3>
          <p id="modal-problem" class="font-body-md text-body-md text-on-surface-variant"></p>
        </div>

        <div>
          <h3 class="font-label-caps text-label-caps text-secondary uppercase mb-2">My Role</h3>
          <p id="modal-role" class="font-body-md text-body-md text-on-surface-variant"></p>
        </div>

        <div>
          <h3 class="font-label-caps text-label-caps text-secondary uppercase mb-2">Core Implementation</h3>
          <ul id="modal-implementation" class="space-y-2 font-body-md text-body-md text-on-surface-variant"></ul>
        </div>

        <div>
          <h3 class="font-label-caps text-label-caps text-secondary uppercase mb-2">Result / Learning</h3>
          <p id="modal-outcome" class="font-body-md text-body-md text-on-surface-variant"></p>
        </div>

        <div>
          <h3 class="font-label-caps text-label-caps text-secondary uppercase mb-2">Limits & Improvements</h3>
          <p id="modal-limits" class="font-body-md text-body-md text-on-surface-variant"></p>
        </div>
      </div>

      <div class="lg:col-span-7">
        <div data-image-frame class="bg-surface-container border border-outline-variant/50 aspect-[16/10] overflow-hidden">
          <img id="modal-gallery-preview" src="" alt="" onerror="handleImageError(this)" class="w-full h-full object-contain bg-surface-container-low">
        </div>
        <div id="modal-gallery-thumbnails" class="grid grid-cols-3 md:grid-cols-4 gap-3 mt-stack-md"></div>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Add modal open/close JavaScript**

Replace the existing final `<script>` contents with a script that keeps the progress bar behavior only if the hero still contains `progress-bar`, then adds this behavior below the `projects` array:

```js
const projectById = new Map(projects.map((project) => [project.id, project]));
const projectModal = document.getElementById('project-modal');
const modalCloseButton = projectModal.querySelector('[data-modal-close]');
const modalTitle = document.getElementById('modal-title');
const modalCategory = document.getElementById('modal-category');
const modalSummary = document.getElementById('modal-summary');
const modalProblem = document.getElementById('modal-problem');
const modalRole = document.getElementById('modal-role');
const modalImplementation = document.getElementById('modal-implementation');
const modalOutcome = document.getElementById('modal-outcome');
const modalLimits = document.getElementById('modal-limits');
const modalGalleryPreview = document.getElementById('modal-gallery-preview');
const modalGalleryThumbnails = document.getElementById('modal-gallery-thumbnails');
let activeProject = null;
let lastFocusedCard = null;

function setText(element, value) {
  element.textContent = value;
}

function setGalleryImage(image) {
  modalGalleryPreview.src = image.src;
  modalGalleryPreview.alt = image.alt;
}

function renderProject(project) {
  activeProject = project;
  setText(modalTitle, project.title);
  setText(modalCategory, project.category);
  setText(modalSummary, project.summary);
  setText(modalProblem, project.problem);
  setText(modalRole, project.role);
  setText(modalOutcome, project.outcome);
  setText(modalLimits, project.limits);

  modalImplementation.innerHTML = project.implementation
    .map((item) => `<li class="flex gap-3"><span class="text-secondary">/</span><span>${item}</span></li>`)
    .join('');

  setGalleryImage(project.images[0]);
  modalGalleryThumbnails.innerHTML = project.images
    .map((image, index) => `
      <button type="button" class="border border-outline-variant/50 bg-surface-container-low hover:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary" data-image-index="${index}" aria-label="${image.alt}">
        <span data-image-frame class="block aspect-[4/3] overflow-hidden">
          <img src="${image.src}" alt="${image.alt}" onerror="handleImageError(this)" class="w-full h-full object-cover">
        </span>
      </button>
    `)
    .join('');
}

function openProjectModal(projectId, trigger) {
  const project = projectById.get(projectId);
  if (!project) return;
  lastFocusedCard = trigger;
  renderProject(project);
  projectModal.classList.remove('hidden');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('overflow-hidden');
  modalCloseButton.focus();
}

function closeProjectModal() {
  projectModal.classList.add('hidden');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('overflow-hidden');
  if (lastFocusedCard) {
    lastFocusedCard.focus();
  }
}

document.querySelectorAll('[data-project-card]').forEach((card) => {
  card.addEventListener('click', () => {
    openProjectModal(card.dataset.projectId, card);
  });
});

modalCloseButton.addEventListener('click', closeProjectModal);

projectModal.addEventListener('click', (event) => {
  if (event.target === projectModal) {
    closeProjectModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && projectModal.getAttribute('aria-hidden') === 'false') {
    closeProjectModal();
  }
});

modalGalleryThumbnails.addEventListener('click', (event) => {
  const thumbnail = event.target.closest('[data-image-index]');
  if (!thumbnail || !activeProject) return;
  setGalleryImage(activeProject.images[Number(thumbnail.dataset.imageIndex)]);
});
```

- [ ] **Step 5: Run the focused test**

Run:

```bash
node --test --test-name-pattern "modal close" tests/portfolio-static.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add tests/portfolio-static.test.mjs index.html
git commit -m "feat: add project detail modal"
```

---

### Task 5: Add Responsive And Image-Failure Coverage

**Files:**
- Modify: `tests/portfolio-static.test.mjs`
- Modify: `index.html`

- [ ] **Step 1: Add responsive and image fallback tests**

Append this code to `tests/portfolio-static.test.mjs`:

```js
test('Edge Case: responsive structure is encoded for mobile and desktop', () => {
  assert.match(html, /text-\[clamp\(36px,6vw,64px\)\]/);
  assert.match(html, /grid-cols-1 md:grid-cols-2 xl:grid-cols-4/);
  assert.match(html, /grid-cols-1 lg:grid-cols-12/);
  assert.match(html, /max-h-\[calc\(100vh-48px\)\] overflow-y-auto/);
  assert.match(html, /px-margin-mobile md:px-gutter/);
});

test('Failure Path: image fallback handling preserves layout', () => {
  const projects = getProjects();
  assert.match(html, /function handleImageError\(image\)/);
  assert.match(html, /frame\.setAttribute\('data-image-fallback', 'true'\)/);
  assert.match(html, /onerror="handleImageError\(this\)"/);

  for (const project of projects) {
    for (const image of project.images) {
      assert.ok(image.alt.length >= 12, `${image.src} should keep useful fallback text`);
    }
  }
});
```

- [ ] **Step 2: Run the new tests and confirm the failure path fails**

Run:

```bash
node --test --test-name-pattern "image fallback|responsive" tests/portfolio-static.test.mjs
```

Expected: FAIL for the image fallback function until `handleImageError` is added. The responsive test should pass if Task 2 through Task 4 used the planned classes.

- [ ] **Step 3: Add the image fallback function**

Add this function inside the final `<script>` block:

```js
function handleImageError(image) {
  const frame = image.closest('[data-image-frame]');
  if (frame) {
    frame.setAttribute('data-image-fallback', 'true');
  }
  image.classList.add('opacity-0');
  image.alt = image.alt || '프로젝트 이미지를 불러오지 못했습니다.';
}
```

- [ ] **Step 4: Add fallback CSS**

Add this CSS inside the existing `<style>` block:

```css
[data-image-frame][data-image-fallback='true'] {
  position: relative;
  background:
    linear-gradient(135deg, rgba(25, 96, 163, 0.08), rgba(3, 8, 19, 0.04)),
    #f1f4f6;
}

[data-image-frame][data-image-fallback='true']::after {
  content: 'IMAGE UNAVAILABLE';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #45474c;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
}
```

- [ ] **Step 5: Run the focused tests**

Run:

```bash
node --test --test-name-pattern "image fallback|responsive" tests/portfolio-static.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Run the full static test suite**

Run:

```bash
node --test tests/portfolio-static.test.mjs
```

Expected: PASS for all tests.

- [ ] **Step 7: Commit**

```bash
git add tests/portfolio-static.test.mjs index.html
git commit -m "test: cover responsive layout and image fallback"
```

---

### Task 6: Add Process, Stack, Footer, And Navigation Anchors

**Files:**
- Modify: `index.html`
- Test: `tests/portfolio-static.test.mjs`

- [ ] **Step 1: Replace the old navigation links**

Use these header links:

```html
<nav class="hidden md:flex items-center gap-stack-lg">
  <a class="font-body-md text-body-md text-secondary border-b-2 border-secondary pb-1 cursor-pointer transition-all" href="#projects">PROJECTS</a>
  <a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200 cursor-pointer" href="#process">PROCESS</a>
  <a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200 cursor-pointer" href="#stack">STACK</a>
  <a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200 cursor-pointer" href="#implementation-note">NOTE</a>
</nav>
<a href="#projects" class="font-label-caps text-label-caps bg-primary text-on-primary px-stack-md py-3 hover:bg-secondary transition-colors duration-200 active:opacity-70 uppercase tracking-widest">
  VIEW WORK
</a>
```

- [ ] **Step 2: Add the process section after projects**

```html
<section id="process" class="bg-surface-container-low border-y border-outline-variant/30">
  <div class="max-w-[1200px] mx-auto px-margin-mobile md:px-gutter py-section-gap">
    <span class="font-label-caps text-label-caps text-secondary uppercase">SECTION 02 // WORKING METHOD</span>
    <h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mt-3 max-w-[760px]">
      코드를 숨기지 않고, 문제 정의와 검증 과정을 전면에 둡니다.
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-stack-lg">
      <div class="border border-outline-variant/40 bg-surface-container-lowest p-6">
        <p class="font-label-caps text-label-caps text-secondary uppercase">01 // Define</p>
        <h3 class="font-headline-sm text-headline-sm text-primary mt-3">문제와 흐름 정리</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mt-3">현장의 병목, 사용자 흐름, 데이터 흐름을 먼저 정리하고 구현 지시로 바꿉니다.</p>
      </div>
      <div class="border border-outline-variant/40 bg-surface-container-lowest p-6">
        <p class="font-label-caps text-label-caps text-secondary uppercase">02 // Build</p>
        <h3 class="font-headline-sm text-headline-sm text-primary mt-3">Agent 기반 구현</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mt-3">AI Coding Agent에게 요구사항과 제약을 전달하고 작동 가능한 프로토타입으로 만듭니다.</p>
      </div>
      <div class="border border-outline-variant/40 bg-surface-container-lowest p-6">
        <p class="font-label-caps text-label-caps text-secondary uppercase">03 // Verify</p>
        <h3 class="font-headline-sm text-headline-sm text-primary mt-3">검증과 개선</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mt-3">오류를 재현하고 수정 방향을 정리하며 한계와 개선 지점을 문서화합니다.</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add stack and implementation note sections before the footer**

```html
<section id="stack" class="max-w-[1200px] mx-auto px-margin-mobile md:px-gutter py-section-gap">
  <div class="border-b border-outline-variant/40 pb-4 mb-stack-lg">
    <span class="font-label-caps text-label-caps text-secondary uppercase">SECTION 03 // STACK</span>
    <h2 class="font-headline-md text-headline-md text-primary mt-2">Tools and Patterns</h2>
  </div>
  <div class="flex flex-wrap gap-2">
    <span class="bg-surface-container-low px-3 py-1 font-label-caps text-[10px] text-on-surface-variant border border-outline-variant/30">PYTHON</span>
    <span class="bg-surface-container-low px-3 py-1 font-label-caps text-[10px] text-on-surface-variant border border-outline-variant/30">LANGCHAIN</span>
    <span class="bg-surface-container-low px-3 py-1 font-label-caps text-[10px] text-on-surface-variant border border-outline-variant/30">RAG</span>
    <span class="bg-surface-container-low px-3 py-1 font-label-caps text-[10px] text-on-surface-variant border border-outline-variant/30">CREWAI</span>
    <span class="bg-surface-container-low px-3 py-1 font-label-caps text-[10px] text-on-surface-variant border border-outline-variant/30">MULTI-AGENT</span>
    <span class="bg-surface-container-low px-3 py-1 font-label-caps text-[10px] text-on-surface-variant border border-outline-variant/30">OBSIDIAN</span>
    <span class="bg-surface-container-low px-3 py-1 font-label-caps text-[10px] text-on-surface-variant border border-outline-variant/30">AI CODING AGENT</span>
  </div>
</section>

<section id="implementation-note" class="max-w-[1200px] mx-auto px-margin-mobile md:px-gutter pb-section-gap">
  <div class="border border-outline-variant/40 bg-surface-container-lowest p-6 md:p-8">
    <p class="font-label-caps text-label-caps text-secondary uppercase">Implementation Note</p>
    <p class="font-body-lg text-body-lg text-primary mt-3 max-w-[820px]">
      본 포트폴리오의 프로젝트들은 AI Coding Agent의 도움을 받아 구현했습니다. 저는 문제 정의, 제품 흐름 설계, 데이터 흐름 설계, 구현 지시, 테스트, 오류 재현, 수정 방향 정리, 문서화를 담당했습니다.
    </p>
  </div>
</section>
```

- [ ] **Step 4: Replace the footer links with real internal anchors**

```html
<footer class="w-full py-stack-lg border-t border-outline-variant/20 bg-background">
  <div class="max-w-[1200px] mx-auto px-margin-mobile md:px-gutter flex flex-col md:flex-row justify-between items-center gap-base">
    <div class="font-headline-sm text-headline-sm font-bold text-primary">
      Jaehyuk Song // AI PoC Builder
    </div>
    <div class="font-label-caps text-label-caps text-on-surface-variant flex gap-stack-md order-3 md:order-2">
      <a class="hover:text-secondary underline-offset-4 hover:underline transition-colors" href="#projects">PROJECTS</a>
      <a class="hover:text-secondary underline-offset-4 hover:underline transition-colors" href="#process">PROCESS</a>
      <a class="hover:text-secondary underline-offset-4 hover:underline transition-colors" href="#implementation-note">NOTE</a>
    </div>
    <div class="font-label-caps text-label-caps text-on-surface-variant/60 order-2 md:order-3">
      © 2026 AI POC BUILDER. STATIC PORTFOLIO.
    </div>
  </div>
</footer>
```

- [ ] **Step 5: Run full static tests**

Run:

```bash
node --test tests/portfolio-static.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add process stack and page navigation"
```

---

### Task 7: Browser Verification And Final Commit

**Files:**
- Modify: `index.html` only if verification reveals a concrete issue.
- Test: `tests/portfolio-static.test.mjs`

- [ ] **Step 1: Run static tests**

Run:

```bash
node --test tests/portfolio-static.test.mjs
```

Expected: PASS.

- [ ] **Step 2: Open local page**

Use a static local server from the repository root:

```bash
python3 -m http.server 4173
```

Expected: server starts and serves `http://localhost:4173/`.

- [ ] **Step 3: Verify desktop viewport**

Open `http://localhost:4173/` in the browser at a desktop width.

Check:

- Background is light, not black.
- Brand reads `Jaehyuk Song // AI PoC Builder`.
- Hero heading fits without overlap.
- Four project cards appear in one row on wide desktop.
- Each project card opens the correct modal.
- Large preview and thumbnails render in each modal.
- Close button, Escape key, and overlay click close the modal.

- [ ] **Step 4: Verify mobile viewport**

Resize to a mobile width.

Check:

- Hero heading wraps cleanly.
- Cards stack in one column.
- Modal content scrolls inside the viewport.
- Images preserve aspect ratio and do not create horizontal scrolling.

- [ ] **Step 5: Stop the server**

Stop the `python3 -m http.server 4173` process with `Ctrl-C`.

- [ ] **Step 6: Inspect git status**

Run:

```bash
git status --short
```

Expected: only intended files are staged or modified. Do not stage `.superpowers/`, `.DS_Store`, or browser attachment artifacts.

- [ ] **Step 7: Commit verification fixes if any were required**

If Task 7 required changes:

```bash
git add index.html tests/portfolio-static.test.mjs
git commit -m "fix: polish portfolio browser verification issues"
```

If no changes were required, do not create an empty commit.

---

## Self-Review Checklist

- Spec coverage:
  - Single-file GitHub Pages implementation: Tasks 2 through 7.
  - Existing `index.html` extension: Tasks 2 through 6.
  - Light-only constraint: Tasks 1 and 2.
  - Brand update: Task 2.
  - Four local-image project cards: Task 3.
  - Reusable modal with gallery: Task 4.
  - Image fallback path: Task 5.
  - Process, stack, and implementation note sections: Task 6.
  - Desktop/mobile verification: Task 7.
- Placeholder scan:
  - No unresolved implementation markers are included.
  - No fake external links are planned.
- Type consistency:
  - Project IDs are `dashboard`, `card-rag`, `crewai`, and `obsidian` across tests, cards, and modal data.
  - Modal element IDs used in tests match the implementation snippets.
  - Image fallback function name is `handleImageError` across tests, markup, and script.
