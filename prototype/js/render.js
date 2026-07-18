/* ═══════════════════════════════════════════
   Nexus — Mecanismo de Renderização (Life OS)
   Arquitetura de Experiência (UX) - DOMAIN.md
   ═══════════════════════════════════════════ */

/* Helper para atualizar contador do Inbox na Sidebar */
function updateInboxBadge() {
  const badge = document.getElementById('inbox-badge');
  if (badge) {
    const count = getInbox().length;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
}

/* ─── 1. Daily Briefing ─── */
function renderDailyBriefing() {
  updateInboxBadge();
  const today = new Date();
  const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const dateStr = `${weekdays[today.getDay()]}, ${today.getDate()} de ${months[today.getMonth()]}`;

  /* Alerta de Inbox se houver itens pendentes */
  const inboxCount = getInbox().length;
  const inboxAlertHtml = inboxCount > 0 ? `
    <div class="mini-briefing" onclick="navigateTo('inbox')" style="border-color: var(--accent-muted); background: var(--accent-soft); margin-bottom: var(--space-8);">
      <span class="mini-briefing-badge" style="background: var(--accent); color: var(--surface);">Inbox</span>
      <span class="mini-briefing-text" style="color: var(--text-primary); font-weight: var(--font-weight-medium);">Você possui ${inboxCount} acontecimentos capturados aguardando classificação. Organizar mente agora.</span>
      <div>${ICONS.arrowRight}</div>
    </div>
  ` : '';

  /* Prioridades */
  const prioritiesHtml = dailyBriefing.priorities.map(p => {
    const record = getRecord(p.recordId);
    const ws = record ? getWorkspace(record.workspaceId || getWorkspaceByThread(record.threadId).id) : null;
    const path = p.type === 'knowledge' ? `knowledge/${p.recordId}` : `event/${p.recordId}`;
    return `
      <div class="briefing-card-item" onclick="navigateTo('${path}')">
        <span class="briefing-item-dot"></span>
        <span>${p.text}</span>
        <span class="briefing-item-tag">${ws ? ws.name : 'Geral'}</span>
      </div>
    `;
  }).join('');

  /* Riscos */
  const riscosHtml = dailyBriefing.riscos.map(r => {
    if (r.type === 'thread') {
      const thread = getThread(r.threadId);
      const ws = thread ? getWorkspace(thread.workspaceId) : null;
      return `
        <div class="briefing-card-item" onclick="navigateTo('workspace/${thread.workspaceId}')">
          <span class="briefing-item-dot" style="background: #DC2626"></span>
          <span>${r.text}</span>
          <span class="briefing-item-tag">${ws ? ws.name : 'Alerta'}</span>
        </div>
      `;
    } else {
      const ev = getEvent(r.recordId);
      const ws = ev ? getWorkspaceByThread(ev.threadId) : null;
      return `
        <div class="briefing-card-item" onclick="navigateTo('event/${r.recordId}')">
          <span class="briefing-item-dot" style="background: #DC2626"></span>
          <span>${r.text}</span>
          <span class="briefing-item-tag">${ws ? ws.name : 'Alerta'}</span>
        </div>
      `;
    }
  }).join('');

  /* Decisões pendentes */
  const decisionsHtml = dailyBriefing.decisions.map(d => {
    const path = d.type === 'knowledge' ? `knowledge/${d.recordId}` : `event/${d.recordId}`;
    const item = getRecord(d.recordId);
    const ws = item ? getWorkspace(item.workspaceId || getWorkspaceByThread(item.threadId).id) : null;
    return `
      <div class="briefing-card-item" onclick="navigateTo('${path}')">
        <span class="briefing-item-dot" style="background: var(--type-decision)"></span>
        <span>${d.text}</span>
        <span class="briefing-item-tag">${ws ? ws.name : 'Decisão'}</span>
      </div>
    `;
  }).join('');

  /* Conexões / Insights */
  const connectionsHtml = dailyBriefing.connections.map(c => {
    const ins = insights.find(i => i.id === c.insightId);
    return `
      <div class="briefing-card-item" onclick="navigateTo('${ins ? 'workspace/' + ins.workspaceId : 'briefing'}')">
        <span class="briefing-item-dot" style="background: var(--accent)"></span>
        <span>${c.text}</span>
        <span class="briefing-item-tag">Correlação</span>
      </div>
    `;
  }).join('');

  /* Sugestões */
  const suggestionsHtml = dailyBriefing.suggestions.map(s => {
    const path = s.type === 'knowledge' ? `knowledge/${s.recordId}` : `event/${s.recordId}`;
    return `
      <div class="briefing-card-item" onclick="navigateTo('${path}')">
        <span class="briefing-item-dot"></span>
        <span>${s.text}</span>
        <span class="briefing-item-tag">Sugestão</span>
      </div>
    `;
  }).join('');

  return `
    <div class="page page-briefing">
      ${inboxAlertHtml}

      <div class="briefing-intro">
        <h1>${getGreeting()}, Lucas</h1>
        <p>Este é o diagnóstico consolidado do seu Life OS para hoje, ${dateStr}.</p>
      </div>

      <div class="briefing-grid">
        <div class="briefing-card">
          <div class="briefing-card-header">
            <div class="briefing-card-icon">${ICONS.sparkles}</div>
            <h2 class="briefing-card-title">Prioridades & Riscos Ativos</h2>
          </div>
          <div class="briefing-card-list">
            ${prioritiesHtml}
            ${riscosHtml}
          </div>
        </div>

        <div class="briefing-card">
          <div class="briefing-card-header">
            <div class="briefing-card-icon">${ICONS.alertCircle}</div>
            <h2 class="briefing-card-title">Decisões Aguardando Definição</h2>
          </div>
          <div class="briefing-card-list">
            ${decisionsHtml}
          </div>
        </div>

        <div class="briefing-card">
          <div class="briefing-card-header">
            <div class="briefing-card-icon">${ICONS.link}</div>
            <h2 class="briefing-card-title">Conexões Mapeadas</h2>
          </div>
          <div class="briefing-card-list">
            ${connectionsHtml}
          </div>
        </div>

        <div class="briefing-card">
          <div class="briefing-card-header">
            <div class="briefing-card-icon">${ICONS.info}</div>
            <h2 class="briefing-card-title">Próximos Passos Sugeridos</h2>
          </div>
          <div class="briefing-card-list">
            ${suggestionsHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ─── 2. Radar (Antigo Dashboard) ─── */
function renderRadar() {
  updateInboxBadge();
  const recentRecords = recentIds.map(id => getRecord(id)).filter(Boolean);
  const highlights = highlightIds.map(id => getRecord(id)).filter(Boolean);

  /* Mini Briefing Ribbon de Alerta */
  const totalInbox = getInbox().length;
  const ribbonHtml = `
    <div class="mini-briefing" onclick="navigateTo('inbox')">
      <span class="mini-briefing-badge">Radar de Atenção</span>
      <span class="mini-briefing-text">Você possui ${totalInbox} novos acontecimentos na mente (Inbox) prontos para classificação.</span>
      <div>${ICONS.arrowRight}</div>
    </div>
  `;

  const workspaceCards = workspaces.map(ws => {
    return `
      <div class="workspace-card" data-workspace="${ws.id}" onclick="navigateTo('workspace/${ws.id}')">
        <div class="workspace-card-icon">${ICONS[ws.icon]}</div>
        <div class="workspace-card-name">${ws.name}</div>
        <div class="workspace-card-description" style="font-size: var(--font-size-xs); color: var(--text-secondary); margin-bottom: var(--space-2);">
          <strong>Estágio:</strong> ${ws.context.status}
        </div>
        <div class="workspace-card-count" style="font-size: var(--font-size-xs); color: var(--text-tertiary); line-height: 1.3;">
          <strong>Risco:</strong> ${ws.context.maiorRisco.slice(0, 45)}...
        </div>
      </div>
    `;
  }).join('');

  const recentItems = recentRecords.map(rec => {
    const ws = getWorkspace(rec.workspaceId || getWorkspaceByThread(rec.threadId).id);
    const isKnowledge = rec.id.startsWith('kn-');
    const path = isKnowledge ? `knowledge/${rec.id}` : `event/${rec.id}`;
    const typeConf = TYPE_CONFIG[rec.type];
    return `
      <div class="recent-item" onclick="navigateTo('${path}')">
        <div class="recent-icon">
          ${ICONS.fileText}
        </div>
        <div class="recent-info">
          <div class="recent-title">${rec.title || rec.description.slice(0, 45) + '...'}</div>
          <div class="recent-meta">${typeConf.label} · ${ws.name}</div>
        </div>
        <div class="recent-time">${formatDate(rec.updatedAt || rec.timestamp)}</div>
      </div>
    `;
  }).join('');

  /* Timeline de Acontecimentos Brutos */
  const timelineItems = events.slice(0, 6).map(ev => {
    const ws = getWorkspaceByThread(ev.threadId);
    const typeConf = TYPE_CONFIG[ev.type];
    return `
      <div class="timeline-item">
        <div class="timeline-dot" style="background: ${typeConf.color}"></div>
        <div class="timeline-item-clickable" onclick="navigateTo('event/${ev.id}')">
          <div class="timeline-time">${formatDate(ev.timestamp)}</div>
          <div class="timeline-text"><strong>${typeConf.label}:</strong> ${ev.description}</div>
          <div class="timeline-text-workspace">${ws ? ws.name : ''}</div>
        </div>
      </div>
    `;
  }).join('');

  const highlightItems = highlights.map(rec => {
    const ws = getWorkspace(rec.workspaceId || getWorkspaceByThread(rec.threadId).id);
    const isKnowledge = rec.id.startsWith('kn-');
    const path = isKnowledge ? `knowledge/${rec.id}` : `event/${rec.id}`;
    return `
      <div class="highlight-item" onclick="navigateTo('${path}')">
        <div class="highlight-pin">${ICONS.pin}</div>
        <div class="highlight-info">
          <div class="highlight-title">${rec.title || rec.description.slice(0, 45) + '...'}</div>
          <div class="highlight-meta">${ws.name}</div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="page page-radar">
      ${ribbonHtml}

      <div class="section-header">
        <h1>Radar do Sistema</h1>
      </div>

      <!-- Requested Insights Section (Interativa) -->
      <div class="context-panel" style="margin-bottom: var(--space-8);">
        <h2 style="font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-4);">Requested Insights (Consulta Dinâmica)</h2>
        <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-4);">
          <button class="filter-pill" onclick="triggerRequestedInsight('forgetting', this)">O que estou esquecendo?</button>
          <button class="filter-pill" onclick="triggerRequestedInsight('stalled', this)">O que ficou parado?</button>
          <button class="filter-pill" onclick="triggerRequestedInsight('pricing', this)">Decisões que impactam projetos</button>
        </div>
        <div id="requested-insight-result" style="background: var(--bg); border-radius: var(--radius-md); padding: var(--space-4); display: none; font-size: var(--font-size-sm); line-height: var(--line-height-normal); transition: all 0.2s ease;">
          <!-- Resposta dinâmica injetada aqui -->
        </div>
      </div>

      <div class="section dashboard-full">
        <div class="section-header">
          <h2>Workspaces em Foco</h2>
        </div>
        <div class="workspaces-grid">
          ${workspaceCards}
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="section">
          <div class="section-header">
            <h2>Consolidados Recentes</h2>
          </div>
          <div class="recents-list">
            ${recentItems}
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2>Timeline de Acontecimentos</h2>
          </div>
          <div class="timeline">
            ${timelineItems}
          </div>
        </div>

        <div class="section" style="grid-column: 1 / -1;">
          <div class="section-header">
            <h2>Destaques Ativos</h2>
          </div>
          <div class="highlights-list" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4);">
            ${highlightItems}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* Função para injetar resposta na consulta de Requested Insights */
function triggerRequestedInsight(key, element) {
  /* Toggle filter pills */
  element.parentNode.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.remove('active');
  });
  element.classList.add('active');

  const container = document.getElementById('requested-insight-result');
  const dataset = requestedInsightsData[key];
  if (!dataset) return;

  const listHtml = dataset.map(item => {
    let actionStr = '';
    if (item.type === 'inbox') {
      actionStr = `onclick="navigateTo('inbox')" style="cursor:pointer;"`;
    } else if (item.type === 'thread') {
      actionStr = `onclick="navigateTo('workspace/${getThread(item.threadId).workspaceId}')" style="cursor:pointer;"`;
    } else if (item.type === 'knowledge') {
      actionStr = `onclick="navigateTo('knowledge/${item.recordId}')" style="cursor:pointer;"`;
    } else {
      actionStr = `onclick="navigateTo('event/${item.recordId}')" style="cursor:pointer;"`;
    }
    return `
      <div class="record-item" ${actionStr} style="border: none; padding: var(--space-2) var(--space-3); margin-bottom: 2px;">
        <span class="briefing-item-dot" style="background: var(--accent); margin-right: var(--space-2); margin-top: 6px;"></span>
        <div class="record-item-title" style="font-size: var(--font-size-sm); color: var(--text-primary);">${item.text}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="font-weight: var(--font-weight-medium); color: var(--text-secondary); margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-2);">
      ${ICONS.sparkles} Resposta do Nexus:
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      ${listHtml}
    </div>
  `;
  container.style.display = 'block';
  container.style.animation = 'pageEnter 0.2s ease forwards';
}

/* ─── 3. Workspace ─── */
function renderWorkspace(workspaceId) {
  updateInboxBadge();
  const ws = getWorkspace(workspaceId);
  if (!ws) return renderNotFound();

  const threadsList = getThreadsByWorkspace(workspaceId);
  const workspaceInsights = insights.filter(i => i.workspaceId === workspaceId);

  const threadsHtml = threadsList.map(t => {
    const threadEvents = getEventsByThread(t.id);
    const threadKnowledges = getKnowledgeByThread(t.id);

    /* Render last events */
    const eventsPreviewHtml = threadEvents.slice(-3).map(e => {
      const typeConf = TYPE_CONFIG[e.type];
      return `
        <div class="record-item" onclick="navigateTo('event/${e.id}')" style="border: none; padding: var(--space-2) 0;">
          <div class="record-type-dot" style="background: ${typeConf.color}; width: 6px; height: 6px;"></div>
          <div class="record-item-title" style="font-size: var(--font-size-xs); color: var(--text-secondary);">${e.description}</div>
          <span class="record-item-time" style="font-size: 10px; color: var(--text-tertiary);">${formatDate(e.timestamp)}</span>
        </div>
      `;
    }).join('');

    /* Render consolidated knowledges badge */
    const knowledgesPreviewHtml = threadKnowledges.map(k => `
      <span class="badge badge-decision" style="font-size: 11px; cursor: pointer; background: var(--hover); color: var(--text-primary); border: 1px solid var(--border-light);" onclick="navigateTo('knowledge/${k.id}')">
        ${TYPE_CONFIG[k.type].icon} ${k.title}
      </span>
    `).join('');

    /* Lifecycle tags colors mapping */
    const statusLabels = {
      'Created': 'Criada',
      'In Progress': 'Em Andamento',
      'Paused': 'Pausada',
      'Resolved': 'Resolvida',
      'Archived': 'Arquivada'
    };
    
    let badgeColor = 'background: var(--hover); color: var(--text-secondary);';
    if (t.status === 'In Progress') badgeColor = 'background: var(--accent-soft); color: var(--accent);';
    if (t.status === 'Paused') badgeColor = 'background: #FEF3C7; color: #D97706;';
    if (t.status === 'Resolved') badgeColor = 'background: #D1FAE5; color: #065F46;';

    return `
      <div class="briefing-card" style="margin-bottom: var(--space-4); padding: var(--space-5) var(--space-6); gap: var(--space-3);">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: var(--text-primary);">${t.title}</h3>
          <span class="mini-briefing-badge" style="font-size: 10px; padding: 2px 8px; ${badgeColor}">
            ${statusLabels[t.status] || t.status}
          </span>
        </div>

        ${knowledgesPreviewHtml ? `
          <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-1);">
            ${knowledgesPreviewHtml}
          </div>
        ` : ''}

        <div style="border-top: 1px solid var(--border-light); padding-top: var(--space-2); margin-top: var(--space-2);">
          <span style="font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: var(--space-2);">Contexto da Thread</span>
          <div style="display: flex; flex-direction: column; gap: var(--space-1);">
            ${eventsPreviewHtml || '<div class="empty-state" style="padding: var(--space-1); font-size: var(--font-size-xs);">Sem acontecimentos registrados nesta thread</div>'}
          </div>
        </div>
      </div>
    `;
  }).join('');

  /* Render insights specific to this workspace */
  const insightsHtml = workspaceInsights.map(ins => `
    <div class="insight-card">
      <div class="insight-card-icon">${ICONS.sparkles}</div>
      <div class="insight-card-text"><strong>Insight:</strong> ${ins.message}</div>
    </div>
  `).join('');

  return `
    <div class="page page-workspace">
      <div class="breadcrumb">
        <span class="breadcrumb-item" onclick="navigateTo('briefing')">Briefing</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item" onclick="navigateTo('dashboard')">Workspaces</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">${ws.name}</span>
      </div>

      <div class="workspace-header">
        <h1 style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); letter-spacing: -0.03em; margin-bottom: var(--space-1);">${ws.name}</h1>
        <div class="workspace-header-description" style="color: var(--text-tertiary); margin-bottom: var(--space-8);">${ws.description}</div>
      </div>

      <!-- Context Panel -->
      <div class="context-panel">
        <h2 style="font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-4);">Contexto do Workspace</h2>
        <div class="context-grid">
          <div class="context-item">
            <span class="context-item-label">Status Atual</span>
            <span class="context-item-value">${ws.context.status}</span>
          </div>
          <div class="context-item">
            <span class="context-item-label">Última Atualização</span>
            <span class="context-item-value">${formatDate(ws.context.updatedAt)}</span>
          </div>
          <div class="context-item">
            <span class="context-item-label">Maior Risco</span>
            <span class="context-item-value context-item-value-danger">${ws.context.maiorRisco}</span>
          </div>
          <div class="context-item">
            <span class="context-item-label">Decisão mais Recente</span>
            <span class="context-item-value context-item-value-highlight">${ws.context.decisaoMaisRecente}</span>
          </div>
          <div class="context-item" style="grid-column: 1 / -1; border-top: 1px solid var(--border-light); padding-top: var(--space-4);">
            <span class="context-item-label">Perguntas Abertas</span>
            <span class="context-item-value" style="color: var(--text-secondary); font-style: italic;">"${ws.context.perguntasAbertas}"</span>
          </div>
          <div class="context-item" style="grid-column: 1 / -1;">
            <span class="context-item-label">Próximo Passo Sugerido</span>
            <span class="context-item-value" style="font-weight: var(--font-weight-medium);">${ws.context.proximoPassoSugerido}</span>
          </div>
        </div>
      </div>

      ${insightsHtml ? `
        <div class="section" style="margin-bottom: var(--space-8);">
          <div class="section-header">
            <h2>Insights de Workspace</h2>
          </div>
          <div class="insights-container">
            ${insightsHtml}
          </div>
        </div>
      ` : ''}

      <div class="section">
        <div class="section-header">
          <h2>Assuntos Vivos (Threads)</h2>
        </div>
        <div class="threads-list">
          ${threadsHtml}
        </div>
      </div>
    </div>
  `;
}

/* ─── 4. Inbox (Processamento / Classificação de Entrada) ─── */
function renderInbox() {
  updateInboxBadge();
  const inboxItems = getInbox();

  const itemsHtml = inboxItems.map(item => {
    const ws = getWorkspace(item.suggestedWorkspaceId);
    const thread = getThread(item.suggestedThreadId);

    /* Render suggestion prompt */
    const suggestionBoxHtml = ws && thread ? `
      <div style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-3) var(--space-4); margin-top: var(--space-3); display: flex; align-items: center; justify-content: space-between; font-size: var(--font-size-xs);">
        <span style="color: var(--text-secondary);">
          ${ICONS.sparkles} Sugestão: mover para <strong>${ws.name}</strong> na Thread <strong>${thread.title}</strong>
        </span>
        <div style="display: flex; gap: var(--space-2);">
          <button class="badge badge-decision" style="background: var(--accent-soft); color: var(--accent); border: 1px solid var(--accent-muted); cursor: pointer;" onclick="quickClassify('${item.id}', '${ws.id}', '${thread.id}', this)">Confirmar</button>
        </div>
      </div>
    ` : '';

    /* Build manual select options */
    const workspaceOptionsHtml = workspaces.map(w => `<option value="${w.id}" ${item.suggestedWorkspaceId === w.id ? 'selected' : ''}>${w.name}</option>`).join('');
    const threadOptionsHtml = threads.filter(t => t.workspaceId === item.suggestedWorkspaceId).map(t => `<option value="${t.id}" ${item.suggestedThreadId === t.id ? 'selected' : ''}>${t.title}</option>`).join('');

    return `
      <div class="briefing-card" id="inbox-card-${item.id}" style="margin-bottom: var(--space-4); transition: transform 0.25s ease, opacity 0.25s ease;">
        <div style="font-size: var(--font-size-sm); color: var(--text-primary); line-height: var(--line-height-normal); word-break: break-word;">
          ${item.description}
        </div>
        
        ${suggestionBoxHtml}

        <div style="border-top: 1px solid var(--border-light); padding-top: var(--space-3); margin-top: var(--space-3); display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center; justify-content: space-between;">
          <div style="display: flex; gap: var(--space-2); align-items: center;">
            <select id="sel-ws-${item.id}" style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: var(--font-size-xs); padding: 4px var(--space-2); color: var(--text-secondary);" onchange="updateThreadDropdown('${item.id}')">
              ${workspaceOptionsHtml}
            </select>
            <select id="sel-th-${item.id}" style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: var(--font-size-xs); padding: 4px var(--space-2); color: var(--text-secondary); max-width: 200px;">
              ${threadOptionsHtml}
            </select>
          </div>
          
          <button class="badge badge-note" style="cursor: pointer; font-weight: var(--font-weight-medium); padding: 5px 12px; background: var(--surface); border: 1px solid var(--border);" onclick="manualClassify('${item.id}')">Classificar</button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="page page-inbox">
      <div class="breadcrumb">
        <span class="breadcrumb-item" onclick="navigateTo('briefing')">Briefing</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Inbox</span>
      </div>

      <div class="workspace-header">
        <h1 style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); letter-spacing: -0.03em; margin-bottom: var(--space-1);">Inbox (${inboxItems.length})</h1>
        <div class="workspace-header-description" style="color: var(--text-tertiary); max-width: 480px;">Capturas rápidas aguardando destilação e alocação em contexto.</div>
      </div>

      <div class="records-list" style="border-top: none; margin-top: var(--space-6);">
        ${itemsHtml || `
          <div class="empty-state" style="padding: var(--space-12) 0;">
            <div style="font-size: 32px; margin-bottom: var(--space-3); opacity: 0.3;">✓</div>
            <div style="font-weight: var(--font-weight-medium); color: var(--text-secondary);">Inbox limpo e mente organizada.</div>
            <div style="font-size: var(--font-size-xs); color: var(--text-tertiary); margin-top: 4px;">Tudo está no seu devido contexto.</div>
          </div>
        `}
      </div>
    </div>
  `;
}

/* Atualizar dropdown de threads dinamicamente no Inbox quando o usuário muda o workspace */
function updateThreadDropdown(itemId) {
  const wsSelect = document.getElementById(`sel-ws-${itemId}`);
  const thSelect = document.getElementById(`sel-th-${itemId}`);
  if (!wsSelect || !thSelect) return;

  const wsId = wsSelect.value;
  const filteredThreads = threads.filter(t => t.workspaceId === wsId);
  
  thSelect.innerHTML = filteredThreads.map(t => `<option value="${t.id}">${t.title}</option>`).join('');
}

/* Classificar inbox de forma rápida usando sugestão */
function quickClassify(itemId, wsId, thId, buttonEl) {
  buttonEl.disabled = true;
  buttonEl.textContent = 'Processando...';

  const card = document.getElementById(`inbox-card-${itemId}`);
  if (card) {
    card.style.transform = 'scale(0.96)';
    card.style.opacity = '0';
    setTimeout(() => {
      classifyInboxItem(itemId, wsId, thId);
      navigateTo('inbox');
    }, 250);
  }
}

/* Classificar inbox de forma manual */
function manualClassify(itemId) {
  const wsSelect = document.getElementById(`sel-ws-${itemId}`);
  const thSelect = document.getElementById(`sel-th-${itemId}`);
  if (!wsSelect || !thSelect) return;

  const wsId = wsSelect.value;
  const thId = thSelect.value;

  const card = document.getElementById(`inbox-card-${itemId}`);
  if (card) {
    card.style.transform = 'scale(0.96)';
    card.style.opacity = '0';
    setTimeout(() => {
      classifyInboxItem(itemId, wsId, thId);
      navigateTo('inbox');
    }, 250);
  }
}

/* ─── 5. Knowledge Detail ─── */
function renderKnowledge(knowledgeId) {
  const kn = getKnowledge(knowledgeId);
  if (!kn) return renderNotFound();

  const thread = getThread(kn.threadId);
  const ws = getWorkspace(thread.workspaceId);
  const typeConf = TYPE_CONFIG[kn.type];

  const sourceEventsHtml = kn.sourceEvents.map(evId => {
    const ev = getEvent(evId);
    if (!ev) return '';
    const evType = TYPE_CONFIG[ev.type];
    return `
      <div class="relationship-item" onclick="navigateTo('event/${ev.id}')">
        <div class="relationship-dot" style="background: ${evType.color}"></div>
        <div class="relationship-info">
          <div class="relationship-title">${ev.description}</div>
          <div class="relationship-meta">${evType.label} · ${formatDate(ev.timestamp)}</div>
        </div>
        <div class="relationship-arrow">${ICONS.arrowRight}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="page page-record">
      <div class="breadcrumb">
        <span class="breadcrumb-item" onclick="navigateTo('briefing')">Briefing</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item" onclick="navigateTo('workspace/${ws.id}')">${ws.name}</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">${kn.title}</span>
      </div>

      <div class="record-header">
        <div class="record-badge-wrapper">
          <span class="badge badge-decision">${typeConf.icon} ${typeConf.label}</span>
        </div>
        <h1 class="record-title-large" style="letter-spacing: -0.03em;">${kn.title}</h1>
        <div class="record-dates">
          <span>Consolidado a partir de ${kn.sourceEvents.length} acontecimentos</span>
          <span>·</span>
          <span>Versão ${kn.version}</span>
          <span>·</span>
          <span>Atualizado em ${formatDate(kn.updatedAt)}</span>
        </div>
      </div>

      <div class="record-body">
        <p class="record-description" style="line-height: var(--line-height-relaxed); color: var(--text-secondary); max-width: 580px;">${kn.content}</p>
      </div>

      <div class="record-section">
        <div class="record-section-title">
          ${ICONS.link}
          Acontecimentos de Origem (Eventos)
        </div>
        <div class="source-events-list">
          ${sourceEventsHtml}
        </div>
      </div>
      
      <div class="record-section">
        <div class="record-section-title">
          ${ICONS.hash}
          Thread de Assunto
        </div>
        <div class="briefing-card" onclick="navigateTo('workspace/${ws.id}')" style="padding: var(--space-4) var(--space-5); cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="font-size: var(--font-size-sm); color: var(--text-primary);">${thread.title}</strong>
            <span style="font-size: var(--font-size-xs); color: var(--text-tertiary);">${ws.name}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ─── 6. Event Detail ─── */
function renderEvent(eventId) {
  const ev = getEvent(eventId);
  if (!ev) return renderNotFound();

  const thread = getThread(ev.threadId);
  const ws = getWorkspace(thread.workspaceId);
  const typeConf = TYPE_CONFIG[ev.type];

  const consequencesHtml = ev.consequences && ev.consequences.length > 0 ? ev.consequences.map(cId => {
    const cEv = getEvent(cId);
    if (!cEv) return '';
    const cType = TYPE_CONFIG[cEv.type];
    return `
      <div class="relationship-item" onclick="navigateTo('event/${cEv.id}')">
        <div class="relationship-dot" style="background: ${cType.color}"></div>
        <div class="relationship-info">
          <div class="relationship-title">${cEv.description}</div>
          <div class="relationship-meta">${cType.label} · ${formatDate(cEv.timestamp)}</div>
        </div>
        <div class="relationship-arrow">${ICONS.arrowRight}</div>
      </div>
    `;
  }).join('') : '<div class="empty-state">Nenhum evento derivado deste acontecimento</div>';

  let metadataHtml = '';
  if (ev.metadata && Object.keys(ev.metadata).length > 0) {
    const items = Object.entries(ev.metadata).map(([key, val]) => `
      <div style="display: flex; justify-content: space-between; font-size: var(--font-size-sm); padding: var(--space-2) 0; border-bottom: 1px solid var(--border-light);">
        <span style="color: var(--text-tertiary); text-transform: capitalize;">${key}</span>
        <span style="color: var(--text-primary); font-weight: var(--font-weight-medium);">${Array.isArray(val) ? val.join(', ') : val}</span>
      </div>
    `).join('');
    metadataHtml = `
      <div class="record-section">
        <div class="record-section-title">
          ${ICONS.info}
          Metadados do Acontecimento
        </div>
        <div style="background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: var(--space-2) var(--space-5);">
          ${items}
        </div>
      </div>
    `;
  }

  return `
    <div class="page page-record">
      <div class="breadcrumb">
        <span class="breadcrumb-item" onclick="navigateTo('briefing')">Briefing</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item" onclick="navigateTo('workspace/${ws.id}')">${ws.name}</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Acontecimento</span>
      </div>

      <div class="record-header">
        <div class="record-badge-wrapper">
          <span class="badge badge-note" style="background: var(--accent-soft); color: var(--accent);">${typeConf.icon} ${typeConf.label}</span>
        </div>
        <h1 class="record-title-large" style="letter-spacing: -0.03em; font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold); line-height: 1.4;">${ev.description}</h1>
        <div class="record-dates">
          <span>Ocorrido em ${formatDate(ev.timestamp)}</span>
          <span>·</span>
          <span>Impacto: <strong style="color: ${ev.impact === 'High' ? '#DC2626' : 'var(--text-secondary)'}">${ev.impact}</strong></span>
        </div>
      </div>

      ${metadataHtml}

      <div class="record-section">
        <div class="record-section-title">
          ${ICONS.link}
          Consequências e Desdobramentos (Causalidade)
        </div>
        <div class="consequences-list">
          ${consequencesHtml}
        </div>
      </div>

      <div class="record-section">
        <div class="record-section-title">
          ${ICONS.hash}
          Thread de Assunto Relacionada
        </div>
        <div class="briefing-card" onclick="navigateTo('workspace/${ws.id}')" style="padding: var(--space-4) var(--space-5); cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="font-size: var(--font-size-sm); color: var(--text-primary);">${thread.title}</strong>
            <span style="font-size: var(--font-size-xs); color: var(--text-tertiary);">${ws.name}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ─── 7. Not Found ─── */
function renderNotFound() {
  return `
    <div class="page">
      <div class="empty-state">
        <p>Acontecimento ou Conhecimento não encontrado no seu Life OS</p>
        <br>
        <a style="color: var(--accent); cursor: pointer;" onclick="navigateTo('briefing')">Voltar ao Daily Briefing</a>
      </div>
    </div>
  `;
}
