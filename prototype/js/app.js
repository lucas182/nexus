/* ═══════════════════════════════════════════
   Nexus — Application Core (Life OS)
   Roteador SPA + Inicialização
   ═══════════════════════════════════════════ */

let currentPage = '';

/* ─── Initialize ─── */
document.addEventListener('DOMContentLoaded', () => {
  renderSidebarWorkspaces();
  initSearch();
  initQuickCapture();
  handleRoute();

  /* Listen for hash changes */
  window.addEventListener('hashchange', handleRoute);
});

/* ─── Sidebar Workspaces ─── */
function renderSidebarWorkspaces() {
  const container = document.getElementById('sidebar-workspaces');
  container.innerHTML = workspaces.map(ws => `
    <a class="nav-item nav-workspace" data-workspace="${ws.id}" onclick="navigateTo('workspace/${ws.id}')">
      <span class="workspace-dot"></span>
      <span>${ws.name}</span>
    </a>
  `).join('');
}

/* ─── SPA Router ─── */
function handleRoute() {
  const hash = window.location.hash.slice(1) || 'briefing';
  const pageContent = document.getElementById('page-content');
  const mainContent = document.getElementById('main-content');

  let html = '';
  let activeNav = '';

  /* Route matches */
  if (hash === '/' || hash === '' || hash === 'briefing') {
    html = renderDailyBriefing();
    activeNav = 'briefing';
    currentPage = 'briefing';
  } else if (hash === 'radar') {
    html = renderRadar();
    activeNav = 'radar';
    currentPage = 'radar';
  } else if (hash === 'inbox') {
    html = renderInbox();
    activeNav = 'inbox';
    currentPage = 'inbox';
  } else if (hash.startsWith('workspace/')) {
    const wsId = hash.split('/')[1];
    html = renderWorkspace(wsId);
    activeNav = 'workspace-' + wsId;
    currentPage = 'workspace';
  } else if (hash.startsWith('knowledge/')) {
    const knId = hash.split('/')[1];
    html = renderKnowledge(knId);

    /* Highlight matching workspace on sidebar if known */
    const kn = getKnowledge(knId);
    if (kn) {
      const thread = getThread(kn.threadId);
      if (thread) activeNav = 'workspace-' + thread.workspaceId;
    }
    currentPage = 'knowledge';
  } else if (hash.startsWith('event/')) {
    const evId = hash.split('/')[1];
    html = renderEvent(evId);

    /* Highlight matching workspace on sidebar if known */
    const ev = getEvent(evId);
    if (ev) {
      const thread = getThread(ev.threadId);
      if (thread) activeNav = 'workspace-' + thread.workspaceId;
    }
    currentPage = 'event';
  } else {
    html = renderNotFound();
    currentPage = '';
  }

  pageContent.innerHTML = html;
  updateSidebarActive(activeNav);
  updateInboxBadge();

  /* Scroll main content area to top on page change */
  mainContent.scrollTop = 0;
}

/* ─── Navigation Helper ─── */
function navigateTo(path) {
  window.location.hash = path;
}

/* ─── Sidebar Active State management ─── */
function updateSidebarActive(activeKey) {
  /* Remove active class from all sidebar nav items */
  document.querySelectorAll('.sidebar .nav-item').forEach(item => {
    item.classList.remove('active');
  });

  /* Apply class to currently active nav item */
  if (activeKey === 'briefing') {
    const briefingNav = document.getElementById('nav-briefing');
    if (briefingNav) briefingNav.classList.add('active');
  } else if (activeKey === 'inbox') {
    const inboxNav = document.getElementById('nav-inbox');
    if (inboxNav) inboxNav.classList.add('active');
  } else if (activeKey === 'radar') {
    const radarNav = document.getElementById('nav-radar');
    if (radarNav) radarNav.classList.add('active');
  } else if (activeKey.startsWith('workspace-')) {
    const wsId = activeKey.replace('workspace-', '');
    const wsItem = document.querySelector(`.nav-workspace[data-workspace="${wsId}"]`);
    if (wsItem) wsItem.classList.add('active');
  }
}

/* ─── Quick Capture Modal logic ─── */
function initQuickCapture() {
  const trigger = document.getElementById('quick-capture-btn');
  const overlay = document.getElementById('quick-capture-overlay');
  const backdrop = document.getElementById('quick-capture-backdrop');
  const input = document.getElementById('quick-capture-input');
  const saveBtn = document.getElementById('quick-capture-save');

  const openCapture = () => {
    overlay.classList.add('active');
    input.value = '';
    setTimeout(() => input.focus(), 50);
  };

  const closeCapture = () => {
    overlay.classList.remove('active');
    input.value = '';
  };

  const processCapture = () => {
    const text = input.value.trim();
    if (text) {
      addToInbox(text);
      updateInboxBadge();
      
      /* Se estiver na tela de Inbox ou Briefing/Radar, re-renderizar para atualizar visualmente */
      if (currentPage === 'inbox' || currentPage === 'briefing' || currentPage === 'radar') {
        handleRoute();
      }
    }
    closeCapture();
  };

  /* Event Listeners */
  trigger.addEventListener('click', openCapture);
  backdrop.addEventListener('click', closeCapture);
  saveBtn.addEventListener('click', processCapture);

  /* Keyboard hooks */
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      processCapture();
    }
    if (e.key === 'Escape') {
      closeCapture();
    }
  });

  /* Global keyboard shortcut logic */
  document.addEventListener('keydown', (e) => {
    /* Shortcut key '+' (or Shift + '=' which outputs '+') when not typing in an input/textarea */
    if (e.key === '+' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openCapture();
    }
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeCapture();
    }
  });
}
