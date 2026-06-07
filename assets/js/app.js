const fallbackData = {
  site: {
    title: 'Paper Reading Atlas',
    description: '论文精读地图示例数据。后续可以由自动化流程替换或追加。'
  },
  papers: [
    {
      id: 'react-2022',
      slug: 'react',
      title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
      title_zh: 'ReAct：在语言模型中协同推理与行动',
      authors: ['Shunyu Yao', 'Jeffrey Zhao', 'Dian Yu'],
      year: 2022,
      venue: 'arXiv / ICLR',
      arxiv: '2210.03629',
      html: 'papers/sample-react/index.html',
      pdf: 'https://arxiv.org/pdf/2210.03629',
      category: 'Agents & Tool Use',
      tags: ['Agent', 'Reasoning', 'Tool Use', 'Prompting', 'HotPotQA'],
      status: '已精读',
      difficulty: '中等',
      read_time: '35 min',
      created_at: '2026-06-07',
      updated_at: '2026-06-07',
      summary: '一个示例条目：展示如何把论文阅读页挂到主页索引中。实际使用时，可由自动化流程替换为真实生成的 HTML 阅读页。',
      insights: ['把 thought 和 action 交替组织', '适合作为 agent 论文阅读模板示例']
    }
  ]
};

const VIEWS = new Set(['overview', 'library', 'categories', 'tags', 'index', 'workflow']);

const state = {
  data: fallbackData,
  papers: [],
  query: '',
  category: '',
  tag: '',
  status: '',
  sort: 'updated-desc',
  view: 'overview',
  page: 1,
  pageSize: 6
};

const els = {};

function $(id) {
  return document.getElementById(id);
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalize(value = '') {
  return String(value).toLowerCase().trim();
}

function unique(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function countBy(items) {
  return items.reduce((acc, item) => {
    if (!item) return acc;
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

function statusClass(status = '') {
  if (status.includes('精读') || status.includes('复现完成') || status.includes('已复现')) return 'status-done';
  if (status.includes('复现') || status.includes('进行')) return 'status-progress';
  return 'status-todo';
}

function paperSearchText(paper) {
  return normalize([
    paper.title,
    paper.title_zh,
    Array.isArray(paper.authors) ? paper.authors.join(' ') : paper.authors,
    paper.venue,
    paper.arxiv,
    paper.category,
    Array.isArray(paper.tags) ? paper.tags.join(' ') : paper.tags,
    paper.summary,
    Array.isArray(paper.insights) ? paper.insights.join(' ') : paper.insights
  ].join(' '));
}

function sortPapers(papers) {
  const sorted = [...papers];
  const byDate = (key) => (a, b) => String(b[key] || '').localeCompare(String(a[key] || ''));
  const byNumber = (key) => (a, b) => Number(b[key] || 0) - Number(a[key] || 0);
  const byTitle = (a, b) => String(a.title || '').localeCompare(String(b.title || ''));

  if (state.sort === 'created-desc') sorted.sort(byDate('created_at'));
  else if (state.sort === 'year-desc') sorted.sort(byNumber('year'));
  else if (state.sort === 'title-asc') sorted.sort(byTitle);
  else sorted.sort(byDate('updated_at'));
  return sorted;
}

function getFilteredPapers() {
  const q = normalize(state.query);
  return sortPapers(state.papers.filter((paper) => {
    if (state.category && paper.category !== state.category) return false;
    if (state.tag && !(paper.tags || []).includes(state.tag)) return false;
    if (state.status && paper.status !== state.status) return false;
    if (q && !paperSearchText(paper).includes(q)) return false;
    return true;
  }));
}

function getPageCount(total) {
  return Math.max(1, Math.ceil(total / state.pageSize));
}

function syncControls() {
  if (!els.searchInput) return;
  els.searchInput.value = state.query;
  els.categoryFilter.value = state.category;
  els.tagFilter.value = state.tag;
  els.statusFilter.value = state.status;
  els.sortSelect.value = state.sort;
  els.pageSizeSelect.value = String(state.pageSize);
}

function updateUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set('q', state.query);
  if (state.category) params.set('category', state.category);
  if (state.tag) params.set('tag', state.tag);
  if (state.status) params.set('status', state.status);
  if (state.sort !== 'updated-desc') params.set('sort', state.sort);
  if (state.page > 1) params.set('page', String(state.page));
  if (state.pageSize !== 6) params.set('pageSize', String(state.pageSize));

  const query = params.toString() ? `?${params.toString()}` : '';
  const hash = state.view === 'overview' ? '' : `#${state.view}`;
  window.history.replaceState({}, '', `${window.location.pathname}${query}${hash}`);
}

function loadUrlState() {
  const params = new URLSearchParams(window.location.search);
  const hashView = window.location.hash.replace('#', '');
  state.query = params.get('q') || '';
  state.category = params.get('category') || '';
  state.tag = params.get('tag') || '';
  state.status = params.get('status') || '';
  state.sort = params.get('sort') || 'updated-desc';
  state.page = Math.max(1, Number(params.get('page') || '1') || 1);
  state.pageSize = Math.max(1, Number(params.get('pageSize') || '6') || 6);
  if (VIEWS.has(hashView)) state.view = hashView;
  else if (state.query || state.category || state.tag || state.status) state.view = 'library';
  else state.view = 'overview';
}

function updateViewVisibility() {
  document.querySelectorAll('[data-view-panel]').forEach((panel) => {
    const active = panel.dataset.viewPanel === state.view;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });

  document.querySelectorAll('[data-view]').forEach((button) => {
    const active = button.dataset.view === state.view;
    button.classList.toggle('active', active);
  });
}

function setView(view, options = {}) {
  if (!VIEWS.has(view)) view = 'overview';
  state.view = view;
  updateViewVisibility();
  updateUrl();
  if (options.scroll !== false) {
    document.querySelector('.module-switcher')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function setFilter(next, options = {}) {
  Object.assign(state, next);
  if (!options.keepPage) state.page = 1;
  if (options.view) state.view = options.view;
  syncControls();
  updateUrl();
  render();
}

function clearFilters() {
  setFilter({ query: '', category: '', tag: '', status: '', sort: 'updated-desc' }, { view: 'library' });
}

function renderSelectOptions() {
  const categories = unique(state.papers.map((p) => p.category)).sort();
  const tags = unique(state.papers.flatMap((p) => p.tags || [])).sort();
  const statuses = unique(state.papers.map((p) => p.status)).sort();

  els.categoryFilter.innerHTML = '<option value="">全部分类</option>' + categories.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  els.tagFilter.innerHTML = '<option value="">全部标签</option>' + tags.map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
  els.statusFilter.innerHTML = '<option value="">全部状态</option>' + statuses.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
}

function renderStats() {
  const categories = unique(state.papers.map((p) => p.category));
  const tags = unique(state.papers.flatMap((p) => p.tags || []));
  els.statPapers.textContent = state.papers.length;
  els.statCategories.textContent = categories.length;
  els.statTags.textContent = tags.length;
}

function renderTimeline() {
  const recent = sortPapers(state.papers).slice(0, 4);
  els.miniTimeline.innerHTML = recent.map((paper) => `
    <a class="timeline-item" href="${escapeHtml(paper.html || '#')}">
      <i class="timeline-dot" aria-hidden="true"></i>
      <span>
        <strong>${escapeHtml(paper.title)}</strong>
        <span>${escapeHtml(paper.updated_at || '')} · ${escapeHtml(paper.category || '')}</span>
      </span>
    </a>
  `).join('');
}

function renderPaperCard(paper) {
  const tags = (paper.tags || []).slice(0, 5).map((tag) => `<span class="tag-pill">#${escapeHtml(tag)}</span>`).join('');
  const authors = Array.isArray(paper.authors) ? paper.authors.slice(0, 3).join(', ') : (paper.authors || '');
  return `
    <a class="paper-card" href="${escapeHtml(paper.html || '#')}">
      <div class="card-topline">
        <span class="category-pill">${escapeHtml(paper.category || 'Uncategorized')}</span>
        <span class="status-pill ${statusClass(paper.status)}">${escapeHtml(paper.status || '未标记')}</span>
      </div>
      <h3>${escapeHtml(paper.title)}</h3>
      <p class="zh-title">${escapeHtml(paper.title_zh || '')}</p>
      <p class="summary">${escapeHtml(paper.summary || '')}</p>
      <div class="card-meta">
        <span class="meta-pill">${escapeHtml(String(paper.year || '—'))}</span>
        <span class="meta-pill">${escapeHtml(paper.venue || 'venue 未填')}</span>
        <span class="meta-pill">arXiv: ${escapeHtml(paper.arxiv || '—')}</span>
      </div>
      <div class="pill-row">${tags}</div>
      <div class="card-footer">
        <span>${escapeHtml(authors)}</span>
        <span>${escapeHtml(paper.read_time || '—')}</span>
      </div>
    </a>
  `;
}

function renderPaperGrid(papers) {
  const pageCount = getPageCount(papers.length);
  if (state.page > pageCount) state.page = pageCount;
  const start = (state.page - 1) * state.pageSize;
  const pageItems = papers.slice(start, start + state.pageSize);
  const end = Math.min(start + pageItems.length, papers.length);

  els.resultCount.textContent = papers.length ? `${start + 1}-${end} / ${papers.length} 篇 · 第 ${state.page}/${pageCount} 页` : '0 篇';
  els.emptyState.hidden = papers.length > 0;
  els.paperGrid.hidden = papers.length === 0;
  els.paperGrid.innerHTML = pageItems.map(renderPaperCard).join('');
  renderPagination(papers.length, pageCount);
}

function renderPagination(total, pageCount) {
  if (total === 0 || pageCount <= 1) {
    els.pagination.innerHTML = total > 0 ? '<span class="page-summary">共 1 页</span>' : '';
    return;
  }

  const windowSize = 5;
  let first = Math.max(1, state.page - Math.floor(windowSize / 2));
  let last = Math.min(pageCount, first + windowSize - 1);
  first = Math.max(1, last - windowSize + 1);
  const pages = [];
  for (let page = first; page <= last; page += 1) {
    pages.push(`<button class="page-button ${page === state.page ? 'active' : ''}" type="button" data-page="${page}">${page}</button>`);
  }

  els.pagination.innerHTML = `
    <button class="page-button" type="button" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''}>上一页</button>
    ${first > 1 ? '<span class="page-ellipsis">…</span>' : ''}
    ${pages.join('')}
    ${last < pageCount ? '<span class="page-ellipsis">…</span>' : ''}
    <button class="page-button" type="button" data-page="${state.page + 1}" ${state.page === pageCount ? 'disabled' : ''}>下一页</button>
  `;

  els.pagination.querySelectorAll('button[data-page]').forEach((button) => {
    button.addEventListener('click', () => {
      const page = Number(button.dataset.page);
      if (!Number.isFinite(page) || page < 1 || page > pageCount) return;
      state.page = page;
      updateUrl();
      renderPaperGrid(getFilteredPapers());
      els.paperGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

function renderCategoryList() {
  const counts = countBy(state.papers.map((p) => p.category || 'Uncategorized'));
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  els.categoryList.innerHTML = [
    `<button class="stack-item ${state.category ? '' : 'active'}" type="button" data-category-open=""><span>全部分类</span><span>${state.papers.length}</span></button>`,
    ...entries.map(([category, count]) => `
      <button class="stack-item ${state.category === category ? 'active' : ''}" type="button" data-category-open="${escapeHtml(category)}">
        <span>${escapeHtml(category)}</span><span>${count}</span>
      </button>
    `)
  ].join('');

  els.categoryList.querySelectorAll('[data-category-open]').forEach((button) => {
    button.addEventListener('click', () => setFilter({ category: button.dataset.categoryOpen || '' }, { view: 'library' }));
  });
}

function renderTagButtons(container, limit = 999) {
  const counts = countBy(state.papers.flatMap((p) => p.tags || []));
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit);
  container.innerHTML = [
    container === els.tagCloud ? `<button class="${state.tag ? '' : 'active'}" type="button" data-tag-open="">全部</button>` : '',
    ...entries.map(([tag, count]) => `
      <button class="${state.tag === tag ? 'active' : ''}" type="button" data-tag-open="${escapeHtml(tag)}">
        ${escapeHtml(tag)} · ${count}
      </button>
    `)
  ].join('');

  container.querySelectorAll('[data-tag-open]').forEach((button) => {
    button.addEventListener('click', () => setFilter({ tag: button.dataset.tagOpen || '' }, { view: 'library' }));
  });
}

function renderTagCloud() {
  renderTagButtons(els.tagCloud, 48);
}

function renderOverview() {
  const recent = sortPapers(state.papers).slice(0, 5);
  els.latestList.innerHTML = recent.map((paper) => `
    <a class="compact-paper" href="${escapeHtml(paper.html || '#')}">
      <span>
        <h3>${escapeHtml(paper.title)}</h3>
        <p>${escapeHtml(paper.title_zh || paper.summary || '')}</p>
        <small>${escapeHtml(paper.updated_at || '')} · ${escapeHtml(paper.category || '')} · ${escapeHtml(paper.status || '')}</small>
      </span>
      <span class="meta-pill">${escapeHtml(String(paper.year || '—'))}</span>
    </a>
  `).join('');

  const grouped = state.papers.reduce((acc, paper) => {
    const key = paper.category || 'Uncategorized';
    acc[key] ||= [];
    acc[key].push(paper);
    return acc;
  }, {});

  els.trackCards.innerHTML = Object.entries(grouped)
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([category, papers]) => `
      <button class="track-card" type="button" data-category-open="${escapeHtml(category)}">
        <strong>${escapeHtml(category)}</strong>
        <span>${papers.length} 篇</span>
      </button>
    `).join('');

  els.trackCards.querySelectorAll('[data-category-open]').forEach((button) => {
    button.addEventListener('click', () => setFilter({ category: button.dataset.categoryOpen || '' }, { view: 'library' }));
  });

  renderTagButtons(els.topTags, 18);
}

function renderCategorySections() {
  const grouped = state.papers.reduce((acc, paper) => {
    const key = paper.category || 'Uncategorized';
    acc[key] ||= [];
    acc[key].push(paper);
    return acc;
  }, {});

  const entries = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  els.categoryCount.textContent = `${entries.length} 个分类`;
  els.categorySections.innerHTML = entries.map(([category, papers]) => {
    const rows = sortPapers(papers).map((paper) => `
      <li>
        <a href="${escapeHtml(paper.html || '#')}">
          <strong>${escapeHtml(paper.title)}</strong>
          <span>${escapeHtml(String(paper.year || '—'))}</span>
        </a>
      </li>
    `).join('');
    return `
      <article class="category-section">
        <header>
          <h3>${escapeHtml(category)}</h3>
          <button class="text-button muted" type="button" data-category-open="${escapeHtml(category)}">筛选此分类 · ${papers.length}</button>
        </header>
        <ul>${rows}</ul>
      </article>
    `;
  }).join('');

  els.categorySections.querySelectorAll('[data-category-open]').forEach((button) => {
    button.addEventListener('click', () => setFilter({ category: button.dataset.categoryOpen || '' }, { view: 'library' }));
  });
}

function renderTagExplorer() {
  const grouped = state.papers.reduce((acc, paper) => {
    (paper.tags || []).forEach((tag) => {
      acc[tag] ||= [];
      acc[tag].push(paper);
    });
    return acc;
  }, {});

  const entries = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  els.tagCount.textContent = `${entries.length} 个标签`;
  els.tagExplorer.innerHTML = entries.map(([tag, papers]) => {
    const rows = sortPapers(papers).slice(0, 8).map((paper) => `
      <li>
        <a href="${escapeHtml(paper.html || '#')}">
          <strong>${escapeHtml(paper.title)}</strong>
          <span>${escapeHtml(paper.category || '')}</span>
        </a>
      </li>
    `).join('');
    return `
      <article class="index-group tag-index-group">
        <header>
          <h3>#${escapeHtml(tag)}</h3>
          <button class="text-button muted" type="button" data-tag-open="${escapeHtml(tag)}">筛选此标签 · ${papers.length}</button>
        </header>
        <ul>${rows}</ul>
      </article>
    `;
  }).join('');

  els.tagExplorer.querySelectorAll('[data-tag-open]').forEach((button) => {
    button.addEventListener('click', () => setFilter({ tag: button.dataset.tagOpen || '' }, { view: 'library' }));
  });
}

function indexKey(title = '') {
  const first = normalize(title).charAt(0).toUpperCase();
  return /^[A-Z]$/.test(first) ? first : '#';
}

function renderNameIndex() {
  const grouped = state.papers.reduce((acc, paper) => {
    const key = indexKey(paper.title);
    acc[key] ||= [];
    acc[key].push(paper);
    return acc;
  }, {});

  const keys = Object.keys(grouped).sort((a, b) => a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b));
  els.nameIndex.innerHTML = keys.map((key) => {
    const rows = grouped[key].sort((a, b) => String(a.title).localeCompare(String(b.title))).map((paper) => `
      <li>
        <a href="${escapeHtml(paper.html || '#')}">
          <strong>${escapeHtml(paper.title)}</strong>
          <span>${escapeHtml(paper.category || '')}</span>
        </a>
      </li>
    `).join('');
    return `
      <article class="index-group">
        <h3>${escapeHtml(key)}</h3>
        <ul>${rows}</ul>
      </article>
    `;
  }).join('');
}

function render() {
  const filtered = getFilteredPapers();
  renderStats();
  renderTimeline();
  renderOverview();
  renderPaperGrid(filtered);
  renderCategoryList();
  renderTagCloud();
  renderCategorySections();
  renderTagExplorer();
  renderNameIndex();
  updateViewVisibility();
}

function bindEvents() {
  els.searchInput.addEventListener('input', (event) => setFilter({ query: event.target.value }, { view: 'library' }));
  els.categoryFilter.addEventListener('change', (event) => setFilter({ category: event.target.value }, { view: 'library' }));
  els.tagFilter.addEventListener('change', (event) => setFilter({ tag: event.target.value }, { view: 'library' }));
  els.statusFilter.addEventListener('change', (event) => setFilter({ status: event.target.value }, { view: 'library' }));
  els.sortSelect.addEventListener('change', (event) => setFilter({ sort: event.target.value }, { view: 'library' }));
  els.pageSizeSelect.addEventListener('change', (event) => {
    state.pageSize = Math.max(1, Number(event.target.value) || 6);
    state.page = 1;
    syncControls();
    updateUrl();
    renderPaperGrid(getFilteredPapers());
  });
  els.clearFilters.addEventListener('click', clearFilters);

  els.focusSearch.addEventListener('click', () => {
    setView('library');
    window.setTimeout(() => els.searchInput.focus(), 120);
  });

  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.view));
  });

  document.querySelectorAll('[data-open-view]').forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.openView));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== els.searchInput) {
      event.preventDefault();
      setView('library');
      window.setTimeout(() => els.searchInput.focus(), 120);
    }
    if (state.view === 'library' && document.activeElement?.tagName !== 'INPUT') {
      const maxPage = getPageCount(getFilteredPapers().length);
      if (event.key === 'ArrowLeft') {
        state.page = Math.max(1, state.page - 1);
        updateUrl();
        renderPaperGrid(getFilteredPapers());
      }
      if (event.key === 'ArrowRight') {
        state.page = Math.min(maxPage, state.page + 1);
        updateUrl();
        renderPaperGrid(getFilteredPapers());
      }
    }
  });

  els.themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('paper-atlas-theme', next);
  });

  window.addEventListener('hashchange', () => {
    const hashView = window.location.hash.replace('#', '');
    if (VIEWS.has(hashView)) setView(hashView, { scroll: false });
  });
}

async function loadData() {
  try {
    const response = await fetch('data/papers.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.data = await response.json();
  } catch (error) {
    console.warn('Using fallback paper data because data/papers.json was not loaded:', error);
    state.data = fallbackData;
  }
  state.papers = Array.isArray(state.data.papers) ? state.data.papers : [];
}

async function init() {
  [
    'searchInput', 'categoryFilter', 'tagFilter', 'statusFilter', 'sortSelect', 'pageSizeSelect',
    'paperGrid', 'emptyState', 'tagCloud', 'topTags', 'tagExplorer', 'categoryList', 'categorySections',
    'nameIndex', 'resultCount', 'categoryCount', 'tagCount', 'statPapers', 'statCategories', 'statTags',
    'miniTimeline', 'latestList', 'trackCards', 'pagination', 'focusSearch', 'themeToggle', 'clearFilters'
  ].forEach((id) => {
    els[id] = $(id);
  });

  const savedTheme = localStorage.getItem('paper-atlas-theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  await loadData();
  loadUrlState();
  renderSelectOptions();
  syncControls();
  bindEvents();
  render();
}

init();
