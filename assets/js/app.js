const state = {
  papers: [],
  filtered: [],
  query: '',
  category: 'all',
  tags: new Set(),
  status: 'all',
  sort: 'updated-desc',
  view: localStorage.getItem('paperAtlas:view') || 'cards',
};

const fallbackPapers = [
  {
    id: 'sample-react',
    slug: '_sample-paper',
    title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
    titleZh: '将推理轨迹与外部行动结合的语言模型智能体范式',
    authors: ['Shunyu Yao', 'Jeffrey Zhao', 'Dian Yu', 'Nan Du', 'Izhak Shafran', 'Karthik Narasimhan', 'Yuan Cao'],
    year: 2023,
    venue: 'ICLR / arXiv',
    category: 'Agent / Tool Use',
    tags: ['agent', 'reasoning', 'tool-use', 'HotPotQA', 'ALFWorld'],
    status: '精读',
    priority: 5,
    readingDate: '2026-06-07',
    updatedAt: '2026-06-07',
    summary: '示例条目：用于展示站点卡片、标签、索引和论文页面链接效果。真实使用时可以删除或替换为自动生成的论文记录。',
    takeaways: ['论文页面可以放在 papers/<slug>/index.html。', '主页只需要读取 data/papers.json 即可自动更新。'],
    arxivId: '2210.03629',
    paperUrl: 'https://arxiv.org/abs/2210.03629',
    pdfUrl: 'https://arxiv.org/pdf/2210.03629',
    pageUrl: 'papers/_sample-paper/index.html',
    codeUrl: '',
    repro: { available: true, level: 'medium', notes: '示例：包含方法、实验和复现提示。' },
  },
  {
    id: 'sample-tree-of-thoughts',
    slug: 'tree-of-thoughts',
    title: 'Tree of Thoughts: Deliberate Problem Solving with Large Language Models',
    titleZh: '使用树状搜索组织大语言模型的中间思考路径',
    authors: ['Shunyu Yao', 'Dian Yu', 'Jeffrey Zhao', 'Izhak Shafran', 'Thomas L. Griffiths', 'Yuan Cao', 'Karthik Narasimhan'],
    year: 2023,
    venue: 'NeurIPS / arXiv',
    category: 'Reasoning',
    tags: ['reasoning', 'search', 'planning', 'prompting'],
    status: '待读',
    priority: 4,
    readingDate: '2026-06-06',
    updatedAt: '2026-06-06',
    summary: '示例条目：可以用来测试同一标签在不同分类中的聚合效果。后续由 Codex Skill 替换为真实精读页面。',
    takeaways: ['适合和 CoT、self-consistency、MCTS-style prompting 放在同一组比较。'],
    arxivId: '2305.10601',
    paperUrl: 'https://arxiv.org/abs/2305.10601',
    pdfUrl: 'https://arxiv.org/pdf/2305.10601',
    pageUrl: 'papers/tree-of-thoughts/index.html',
    codeUrl: '',
    repro: { available: false, level: 'low', notes: '示例条目，未生成复现页。' },
  },
  {
    id: 'sample-rlvr',
    slug: 'rlvr-questioner-solver-placeholder',
    title: 'Self-Evolving Reasoning Models with Questioner-Solver RLVR',
    titleZh: '示例：面向自进化数学推理的 Questioner-Solver 训练框架',
    authors: ['Demo Author'],
    year: 2026,
    venue: 'Project Note',
    category: 'RLVR / Self-Evolution',
    tags: ['rlvr', 'self-evolution', 'math-reasoning', 'replay', 'diversity'],
    status: '复现中',
    priority: 5,
    readingDate: '2026-06-07',
    updatedAt: '2026-06-07',
    summary: '示例项目笔记：用于展示项目类页面也能和论文类页面统一管理。真实论文条目可以包含 arXiv、PDF、代码和复现状态。',
    takeaways: ['分类不仅限于论文，也可以管理 project note、survey、benchmark note。'],
    arxivId: '',
    paperUrl: '',
    pdfUrl: '',
    pageUrl: '',
    codeUrl: '',
    repro: { available: true, level: 'high', notes: '示例：适合记录实验矩阵和消融。' },
  },
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function safeText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function formatDate(value) {
  if (!value) return '未记录';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function getPageUrl(paper) {
  if (paper.pageUrl) return paper.pageUrl;
  if (paper.slug) return `papers/${paper.slug}/index.html`;
  return '';
}

function getAllCategories() {
  return unique(state.papers.map((paper) => paper.category)).sort((a, b) => a.localeCompare(b));
}

function getAllTags() {
  const counts = new Map();
  state.papers.forEach((paper) => {
    (paper.tags || []).forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
  });
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function normalizePaper(raw) {
  const slug = raw.slug || safeText(raw.id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    id: raw.id || slug,
    slug,
    title: raw.title || 'Untitled Paper',
    titleZh: raw.titleZh || '',
    authors: Array.isArray(raw.authors) ? raw.authors : [],
    year: Number(raw.year) || 0,
    venue: raw.venue || 'Unknown',
    category: raw.category || 'Uncategorized',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    status: raw.status || '待读',
    priority: Math.max(0, Math.min(5, Number(raw.priority) || 0)),
    readingDate: raw.readingDate || '',
    updatedAt: raw.updatedAt || raw.readingDate || '',
    summary: raw.summary || '',
    takeaways: Array.isArray(raw.takeaways) ? raw.takeaways : [],
    arxivId: raw.arxivId || '',
    paperUrl: raw.paperUrl || '',
    pdfUrl: raw.pdfUrl || '',
    pageUrl: raw.pageUrl || (slug ? `papers/${slug}/index.html` : ''),
    codeUrl: raw.codeUrl || '',
    repro: raw.repro || { available: false, level: 'unknown', notes: '' },
  };
}

async function loadPapers() {
  try {
    const response = await fetch('data/papers.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const papers = Array.isArray(data) ? data : data.papers;
    if (!Array.isArray(papers)) throw new Error('Invalid papers.json: expected array or { papers: [] }');
    state.papers = papers.map(normalizePaper);
  } catch (error) {
    console.warn('[Paper Atlas] Falling back to demo papers:', error);
    state.papers = fallbackPapers.map(normalizePaper);
  }
}

function renderStats() {
  const categories = getAllCategories();
  const tags = getAllTags();
  const now = new Date();
  const monthCount = state.papers.filter((paper) => {
    const d = new Date(paper.updatedAt || paper.readingDate);
    return !Number.isNaN(d.getTime()) && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  const reproCount = state.papers.filter((paper) => paper.repro && paper.repro.available).length;

  $('#statTotal').textContent = state.papers.length;
  $('#statCategories').textContent = categories.length;
  $('#statTags').textContent = tags.length;
  $('#statMonth').textContent = monthCount;
  $('#statRepro').textContent = reproCount;
}

function renderFilters() {
  const categoryContainer = $('#categoryFilters');
  const tagContainer = $('#tagFilters');
  const categories = getAllCategories();
  const tags = getAllTags().slice(0, 32);

  categoryContainer.innerHTML = '';
  const allButton = document.createElement('button');
  allButton.className = `chip ${state.category === 'all' ? 'active' : ''}`;
  allButton.type = 'button';
  allButton.dataset.category = 'all';
  allButton.innerHTML = `全部 <small>${state.papers.length}</small>`;
  categoryContainer.appendChild(allButton);

  categories.forEach((category) => {
    const count = state.papers.filter((paper) => paper.category === category).length;
    const button = document.createElement('button');
    button.className = `chip ${state.category === category ? 'active' : ''}`;
    button.type = 'button';
    button.dataset.category = category;
    button.innerHTML = `${escapeHtml(category)} <small>${count}</small>`;
    categoryContainer.appendChild(button);
  });

  tagContainer.innerHTML = '';
  tags.forEach(([tag, count]) => {
    const button = document.createElement('button');
    button.className = `tag-pill ${state.tags.has(tag) ? 'active' : ''}`;
    button.type = 'button';
    button.dataset.tag = tag;
    button.innerHTML = `#${escapeHtml(tag)} <small>${count}</small>`;
    tagContainer.appendChild(button);
  });
}

function escapeHtml(value) {
  return safeText(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function matchesQuery(paper, query) {
  if (!query) return true;
  const haystack = [
    paper.title,
    paper.titleZh,
    paper.venue,
    paper.category,
    paper.summary,
    paper.arxivId,
    ...(paper.authors || []),
    ...(paper.tags || []),
    ...(paper.takeaways || []),
  ].join(' ').toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function filterAndSort() {
  state.filtered = state.papers.filter((paper) => {
    if (state.category !== 'all' && paper.category !== state.category) return false;
    if (state.status !== 'all' && paper.status !== state.status) return false;
    for (const tag of state.tags) {
      if (!(paper.tags || []).includes(tag)) return false;
    }
    return matchesQuery(paper, state.query);
  });

  state.filtered.sort((a, b) => {
    switch (state.sort) {
      case 'read-desc':
        return dateValue(b.readingDate) - dateValue(a.readingDate);
      case 'year-desc':
        return (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title);
      case 'priority-desc':
        return (b.priority || 0) - (a.priority || 0) || dateValue(b.updatedAt) - dateValue(a.updatedAt);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'updated-desc':
      default:
        return dateValue(b.updatedAt) - dateValue(a.updatedAt) || (b.year || 0) - (a.year || 0);
    }
  });
}

function dateValue(value) {
  const date = new Date(value || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function renderPapers() {
  const grid = $('#paperGrid');
  const empty = $('#emptyState');
  const summary = $('#resultSummary');

  summary.textContent = `当前显示 ${state.filtered.length} / ${state.papers.length} 篇论文${state.query ? `，搜索：“${state.query}”` : ''}`;
  grid.innerHTML = '';
  grid.classList.toggle('compact-grid', state.view === 'compact');

  if (!state.filtered.length) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  state.filtered.forEach((paper) => grid.appendChild(createPaperCard(paper)));
}

function createPaperCard(paper) {
  const card = document.createElement('article');
  card.className = `paper-card ${state.view === 'compact' ? 'compact' : ''}`;

  const pageUrl = getPageUrl(paper);
  const titleLink = pageUrl ? `<a href="${escapeHtml(pageUrl)}">${escapeHtml(paper.title)}</a>` : escapeHtml(paper.title);
  const authors = paper.authors.length ? paper.authors.join(', ') : '作者未记录';
  const tags = (paper.tags || []).map((tag) => `<span>#${escapeHtml(tag)}</span>`).join('');
  const takeaways = (paper.takeaways || []).slice(0, 3).map((item) => `<li>${escapeHtml(item)}</li>`).join('');

  card.innerHTML = `
    <div>
      <div class="paper-meta-row">
        <span class="badge status-${escapeHtml(paper.status)}">${escapeHtml(paper.status)}</span>
        <span class="badge">${escapeHtml(paper.category)}</span>
        <span class="badge">${paper.year || '年份未记'}</span>
        <span class="badge">${escapeHtml(paper.venue)}</span>
      </div>
      <h3 class="paper-title">${titleLink}</h3>
      ${paper.titleZh ? `<p class="paper-title-zh">${escapeHtml(paper.titleZh)}</p>` : ''}
      <p class="paper-authors">${escapeHtml(authors)}</p>
      ${paper.summary ? `<p class="paper-summary">${escapeHtml(paper.summary)}</p>` : ''}
      ${takeaways ? `<ul class="takeaway-list">${takeaways}</ul>` : ''}
      ${tags ? `<div class="paper-tags">${tags}</div>` : ''}
    </div>
    <div class="card-footer">
      <div class="link-row">
        ${pageUrl ? `<a class="mini-link" href="${escapeHtml(pageUrl)}">阅读网页</a>` : ''}
        ${paper.paperUrl ? `<a class="mini-link" href="${escapeHtml(paper.paperUrl)}" target="_blank" rel="noopener">arXiv</a>` : ''}
        ${paper.pdfUrl ? `<a class="mini-link" href="${escapeHtml(paper.pdfUrl)}" target="_blank" rel="noopener">PDF</a>` : ''}
        ${paper.codeUrl ? `<a class="mini-link" href="${escapeHtml(paper.codeUrl)}" target="_blank" rel="noopener">Code</a>` : ''}
      </div>
      <span class="priority-meter" title="优先级 ${paper.priority}/5">${renderPriority(paper.priority)}</span>
    </div>
  `;

  return card;
}

function renderPriority(priority) {
  const value = Math.max(0, Math.min(5, Number(priority) || 0));
  return Array.from({ length: 5 }, (_, index) => `<i class="${index < value ? 'filled' : ''}"></i>`).join('');
}

function renderTaxonomy() {
  const container = $('#taxonomyGrid');
  const categories = getAllCategories();
  container.innerHTML = '';

  categories.forEach((category, index) => {
    const papers = state.papers
      .filter((paper) => paper.category === category)
      .sort((a, b) => dateValue(b.updatedAt) - dateValue(a.updatedAt));
    const topTags = unique(papers.flatMap((paper) => paper.tags || [])).slice(0, 8);
    const card = document.createElement('article');
    card.className = 'taxonomy-card';
    card.innerHTML = `
      <h3><span>${index + 1}</span>${escapeHtml(category)} <small>${papers.length}</small></h3>
      <p>${topTags.length ? topTags.map((tag) => `#${escapeHtml(tag)}`).join(' · ') : '暂无标签'}</p>
      <div class="paper-mini-list">
        ${papers.slice(0, 5).map((paper) => {
          const url = getPageUrl(paper);
          const title = escapeHtml(paper.title);
          return url ? `<a href="${escapeHtml(url)}">${title}</a>` : `<a>${title}</a>`;
        }).join('')}
      </div>
    `;
    container.appendChild(card);
  });
}

function renderIndex() {
  const container = $('#paperIndex');
  const years = unique(state.papers.map((paper) => String(paper.year || '未记录'))).sort((a, b) => Number(b) - Number(a));
  container.innerHTML = '';

  years.forEach((year) => {
    const papers = state.papers
      .filter((paper) => String(paper.year || '未记录') === year)
      .sort((a, b) => a.title.localeCompare(b.title));
    const block = document.createElement('section');
    block.className = 'year-block';
    block.innerHTML = `
      <h3>${escapeHtml(year)}</h3>
      <ul class="index-list">
        ${papers.map((paper) => {
          const url = getPageUrl(paper);
          const title = escapeHtml(paper.title);
          const meta = `${escapeHtml(paper.category)} · ${formatDate(paper.updatedAt)}`;
          return `<li><div>${url ? `<a href="${escapeHtml(url)}">${title}</a>` : `<strong>${title}</strong>`}<br><small>${meta}</small></div><small>${escapeHtml(paper.status)}</small></li>`;
        }).join('')}
      </ul>
    `;
    container.appendChild(block);
  });
}

function syncControls() {
  $('#sortSelect').value = state.sort;
  $('#searchInput').value = state.query;
  $$('#statusFilters button').forEach((button) => {
    button.classList.toggle('active', button.dataset.status === state.status);
  });
  $$('.view-switch button').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === state.view);
  });
}

function renderAll() {
  filterAndSort();
  renderStats();
  renderFilters();
  renderPapers();
  renderTaxonomy();
  renderIndex();
  syncControls();
}

function bindEvents() {
  $('#searchInput').addEventListener('input', (event) => {
    state.query = event.target.value.trim();
    renderAll();
  });

  $('#sortSelect').addEventListener('change', (event) => {
    state.sort = event.target.value;
    renderAll();
  });

  $('#categoryFilters').addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    renderAll();
  });

  $('#tagFilters').addEventListener('click', (event) => {
    const button = event.target.closest('[data-tag]');
    if (!button) return;
    const tag = button.dataset.tag;
    if (state.tags.has(tag)) state.tags.delete(tag);
    else state.tags.add(tag);
    renderAll();
  });

  $('#statusFilters').addEventListener('click', (event) => {
    const button = event.target.closest('[data-status]');
    if (!button) return;
    state.status = button.dataset.status;
    renderAll();
  });

  $('.view-switch').addEventListener('click', (event) => {
    const button = event.target.closest('[data-view]');
    if (!button) return;
    state.view = button.dataset.view;
    localStorage.setItem('paperAtlas:view', state.view);
    renderAll();
  });

  $('#resetFilters').addEventListener('click', () => {
    state.query = '';
    state.category = 'all';
    state.tags.clear();
    state.status = 'all';
    state.sort = 'updated-desc';
    renderAll();
  });

  $('#copySchemaButton').addEventListener('click', async () => {
    const text = $('#paperJsonTemplate').innerHTML.trim();
    try {
      await navigator.clipboard.writeText(text);
      $('#copySchemaButton').textContent = '已复制模板';
      setTimeout(() => { $('#copySchemaButton').textContent = '复制论文 JSON 模板'; }, 1600);
    } catch {
      alert(text);
    }
  });

  $('#themeToggle').addEventListener('click', () => {
    const current = document.documentElement.dataset.theme || 'auto';
    const next = current === 'dark' ? 'light' : current === 'light' ? 'auto' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('paperAtlas:theme', next);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      $('#searchInput').focus();
    }
  });
}

async function init() {
  const savedTheme = localStorage.getItem('paperAtlas:theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  await loadPapers();
  bindEvents();
  renderAll();
}

init();
