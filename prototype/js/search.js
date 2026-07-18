/* ═══════════════════════════════════════════
   Nexus — Busca Global (Life OS)
   O portal de acesso rápido.
   ═══════════════════════════════════════════ */

let searchOpen = false;
let selectedIndex = -1;
let currentResults = [];

function initSearch() {
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  const backdrop = document.getElementById('search-backdrop');
  const trigger = document.getElementById('search-trigger');

  /* Keyboard shortcut: Ctrl+K / Cmd+K */
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggleSearch();
    }
    if (e.key === 'Escape' && searchOpen) {
      closeSearch();
    }
  });

  /* Trigger button */
  trigger.addEventListener('click', () => toggleSearch());

  /* Backdrop click */
  backdrop.addEventListener('click', () => closeSearch());

  /* Input handler */
  input.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    handleSearch(query);
  });

  /* Keyboard navigation in results */
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, currentResults.length - 1);
      updateSelectedResult();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, -1);
      updateSelectedResult();
    } else if (e.key === 'Enter' && selectedIndex >= 0 && currentResults[selectedIndex]) {
      e.preventDefault();
      const item = currentResults[selectedIndex];
      closeSearch();
      const path = item.id.startsWith('kn-') ? 'knowledge/' + item.id : 'event/' + item.id;
      navigateTo(path);
    }
  });
}

function toggleSearch() {
  if (searchOpen) {
    closeSearch();
  } else {
    openSearch();
  }
}

function openSearch() {
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');

  searchOpen = true;
  overlay.classList.add('active');
  input.value = '';
  selectedIndex = -1;
  currentResults = [];

  /* Show initial tips */
  renderSearchTips();

  /* Focus with slight delay for animation */
  setTimeout(() => input.focus(), 50);
}

function closeSearch() {
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');

  searchOpen = false;
  overlay.classList.remove('active');
  input.value = '';
  selectedIndex = -1;
  currentResults = [];
}

function handleSearch(query) {
  const resultsEl = document.getElementById('search-results');

  if (!query) {
    renderSearchTips();
    currentResults = [];
    selectedIndex = -1;
    return;
  }

  /* Search through Knowledges and Events */
  const lowerQuery = query.toLowerCase();
  
  const matchKnowledges = knowledges.filter(k => 
    k.title.toLowerCase().includes(lowerQuery) || 
    k.content.toLowerCase().includes(lowerQuery) || 
    TYPE_CONFIG[k.type].label.toLowerCase().includes(lowerQuery)
  );

  const matchEvents = events.filter(e => 
    e.description.toLowerCase().includes(lowerQuery) || 
    TYPE_CONFIG[e.type].label.toLowerCase().includes(lowerQuery)
  );

  const matches = [...matchKnowledges, ...matchEvents];
  currentResults = matches;
  selectedIndex = matches.length > 0 ? 0 : -1;

  if (matches.length === 0) {
    resultsEl.innerHTML = `
      <div class="search-empty">
        <div class="search-empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <div class="search-empty-text">Sem resultados para "${escapeHtml(query)}" no seu Life OS</div>
      </div>
    `;
    return;
  }

  /* Group matches by workspace */
  const grouped = {};
  matches.forEach(item => {
    const thread = getThread(item.threadId);
    const wsId = thread ? thread.workspaceId : 'geral';
    if (!grouped[wsId]) {
      grouped[wsId] = [];
    }
    grouped[wsId].push(item);
  });

  let html = '';
  let globalIndex = 0;

  for (const wsId of Object.keys(grouped)) {
    const ws = getWorkspace(wsId);
    html += `<div class="search-group">`;
    html += `<div class="search-group-label">${ws ? ws.name : 'Geral'}</div>`;

    grouped[wsId].forEach(item => {
      const typeConf = TYPE_CONFIG[item.type];
      const isSelected = globalIndex === selectedIndex;
      const isKnowledge = item.id.startsWith('kn-');
      const titleText = isKnowledge ? item.title : item.description;
      const highlightedTitle = highlightMatch(titleText, query);
      const path = isKnowledge ? 'knowledge/' + item.id : 'event/' + item.id;

      html += `
        <div class="search-result-item${isSelected ? ' selected' : ''}"
             data-index="${globalIndex}"
             onclick="handleSearchResultClick('${path}')"
             onmouseenter="selectedIndex=${globalIndex}; updateSelectedResult();">
          <div class="search-result-type" style="background: ${typeConf.color}"></div>
          <div class="search-result-info">
            <div class="search-result-title">${highlightedTitle}</div>
            <div class="search-result-meta">${typeConf.label} · ${formatDate(item.updatedAt || item.timestamp)}</div>
          </div>
        </div>
      `;
      globalIndex++;
    });

    html += `</div>`;
  }

  resultsEl.innerHTML = html;
}

function renderSearchTips() {
  const resultsEl = document.getElementById('search-results');
  resultsEl.innerHTML = `
    <div class="search-tips">
      <div class="search-tips-title">Mapeamento de Contexto</div>
      <div class="search-tip">
        <kbd>↑↓</kbd>
        <span>Navegar pelas conexões do Life OS</span>
      </div>
      <div class="search-tip">
        <kbd>↵</kbd>
        <span>Abrir acontecimento ou conhecimento</span>
      </div>
      <div class="search-tip">
        <kbd>Esc</kbd>
        <span>Fechar busca</span>
      </div>
    </div>
  `;
}

function updateSelectedResult() {
  document.querySelectorAll('.search-result-item').forEach((el, i) => {
    el.classList.toggle('selected', i === selectedIndex);
  });
}

function handleSearchResultClick(path) {
  closeSearch();
  navigateTo(path);
}

function highlightMatch(text, query) {
  if (!query) return escapeHtml(text);
  const javaScriptEscaped = escapeHtml(text);
  const javaScriptEscapedQuery = escapeHtml(query);
  const regex = new RegExp(`(${javaScriptEscapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return javaScriptEscaped.replace(regex, '<span class="search-result-highlight">$1</span>');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
