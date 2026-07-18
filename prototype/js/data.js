/* ═══════════════════════════════════════════
   Nexus — Base de Dados de Domínio (Life OS)
   Especificação de acordo com DOMAIN.md (UX)
   ═══════════════════════════════════════════ */

const ICONS = {
  briefing: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,
  inbox: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>`,
  radar: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0110 10"/><path d="M12 12L22 12"/></svg>`,
  home: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
  zap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  book: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  link: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
  pin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V6h1a2 2 0 000-4H8a2 2 0 000 4h1v4.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24V17z"/></svg>`,
  arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  x: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  fileText: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  hash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`,
  alertCircle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  sparkles: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"/></svg>`,
  info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
};

const TYPE_CONFIG = {
  /* Event types */
  decision: { label: 'Decisão', color: 'var(--type-decision)', icon: '◆' },
  idea:     { label: 'Ideia',   color: 'var(--type-idea)',     icon: '✦' },
  problem:  { label: 'Problema',color: 'var(--type-problem)',  icon: '▲' },
  note:     { label: 'Nota',    color: 'var(--type-note)',     icon: '●' },
  learning: { label: 'Aprendizado', color: '#10B981',          icon: '■' },
  meeting:  { label: 'Reunião',    color: '#8B5CF6',          icon: '▼' },
  activity: { label: 'Atividade',  color: '#06B6D4',          icon: '○' },

  /* Knowledge types */
  consolidatedDecision: { label: 'Decisão Consolidada', color: 'var(--type-decision)', icon: '◆' },
  architectureDefinition: { label: 'Arquitetura Definida', color: '#8B5CF6', icon: '✦' },
  process: { label: 'Processo', color: '#06B6D4', icon: '■' },
  pattern: { label: 'Padrão Identificado', color: '#EC4899', icon: '★' },
  validatedHypothesis: { label: 'Hipótese Validada', color: '#10B981', icon: '✓' }
};

/* ─── Inbox (Itens Brutos Não Classificados) ─── */
let inbox = [
  {
    id: 'ib-01',
    description: 'Cotar preços de painéis de compensado naval de 18mm para montar a estrutura dos vasos suspensos.',
    suggestedWorkspaceId: 'casa',
    suggestedThreadId: 'th-casa-2',
    createdAt: '2026-07-17T11:00:00'
  },
  {
    id: 'ib-02',
    description: 'Ideia: Oferecer integração com agendas do Google e Apple no onboarding para preencher dias de treino automaticamente.',
    suggestedWorkspaceId: 'triade',
    suggestedThreadId: 'th-triade-1',
    createdAt: '2026-07-18T00:15:00'
  },
  {
    id: 'ib-03',
    description: 'Anotação rápida de Compiladores: O analisador sintático preditivo LL(1) não aceita gramáticas com recursão à esquerda.',
    suggestedWorkspaceId: 'escola',
    suggestedThreadId: 'th-escola-1',
    createdAt: '2026-07-18T00:58:00'
  }
];

const workspaces = [
  {
    id: 'casa',
    name: 'Casa',
    icon: 'home',
    description: 'Organização da vida pessoal, moradia e bem-estar.',
    context: {
      status: 'Organização e Transição da Reforma',
      updatedAt: '2026-07-17T18:00:00',
      maiorRisco: 'Infiltração na sacada bloqueando a pintura e horta',
      decisaoMaisRecente: 'Mudança para o apartamento novo (Rua das Flores)',
      perguntasAbertas: 'Como otimizar a iluminação indireta sem reforma estrutural?',
      proximoPassoSugerido: 'Aprovar orçamento da lista de móveis adicionais'
    }
  },
  {
    id: 'triade',
    name: 'Tríade.fit',
    icon: 'zap',
    description: 'Estratégia, validação de mercado e desenvolvimento de produto.',
    context: {
      status: 'Ajuste de Funil de Conversão e MVP',
      updatedAt: '2026-07-17T22:30:00',
      maiorRisco: 'Alta taxa de abandono (churn 38%) no onboarding inicial',
      decisaoMaisRecente: 'Modelo de precificação Pro (R$ 29,90/mês freemium)',
      perguntasAbertas: 'A redução das etapas de onboarding de 8 para 4 vai conter o churn?',
      proximoPassoSugerido: 'Testar novo fluxo com usuários beta'
    }
  },
  {
    id: 'escola',
    name: 'Escola',
    icon: 'book',
    description: 'Atividades acadêmicas, pesquisas e projetos de graduação.',
    context: {
      status: 'Revisão bibliográfica do TCC',
      updatedAt: '2026-07-17T10:00:00',
      maiorRisco: 'Dificuldade de conciliação de horários de aulas chaves',
      decisaoMaisRecente: 'Tema escolhido: LLM na educação personalizada',
      perguntasAbertas: 'Quais artigos sobre fine-tuning e RAG educacional priorizar?',
      proximoPassoSugerido: 'Apresentar prévia da bibliografia ao Prof. Ricardo'
    }
  }
];

const threads = [
  /* Casa */
  { id: 'th-casa-1', workspaceId: 'casa', title: 'Mudança de Apartamento e Reforma', status: 'In Progress', createdAt: '2026-07-01' },
  { id: 'th-casa-2', workspaceId: 'casa', title: 'Horta Vertical e Paisagismo', status: 'Paused', createdAt: '2026-07-05' },
  { id: 'th-casa-3', workspaceId: 'casa', title: 'Gestão Financeira e Saúde', status: 'Resolved', createdAt: '2026-07-02' },

  /* Tríade.fit */
  { id: 'th-triade-1', workspaceId: 'triade', title: 'Onboarding e Funil de Conversão', status: 'In Progress', createdAt: '2026-07-06' },
  { id: 'th-triade-2', workspaceId: 'triade', title: 'Stack Tecnológica e Arquitetura', status: 'Resolved', createdAt: '2026-06-25' },

  /* Escola */
  { id: 'th-escola-1', workspaceId: 'escola', title: 'Desenvolvimento do TCC', status: 'In Progress', createdAt: '2026-07-01' },
  { id: 'th-escola-2', workspaceId: 'escola', title: 'Grade Horária e Matrículas', status: 'In Progress', createdAt: '2026-07-12' }
];

const events = [
  /* ─── Thread: Mudança de Apartamento e Reforma (Casa) ─── */
  {
    id: 'ev-01',
    threadId: 'th-casa-1',
    timestamp: '2026-07-10T14:00:00',
    type: 'decision',
    description: 'Definido o apartamento da Rua das Flores após análise de 3 opções no bairro.',
    impact: 'High',
    consequences: ['ev-02'],
    metadata: { local: 'Rua das Flores, 142' }
  },
  {
    id: 'ev-02',
    threadId: 'th-casa-1',
    timestamp: '2026-07-12T10:30:00',
    type: 'note',
    description: 'Criada lista de móveis essenciais para o novo escritório (Mesa 160cm, Cadeira ergonômica, Monitor 27").',
    impact: 'Medium',
    consequences: [],
    metadata: {}
  },
  {
    id: 'ev-03',
    threadId: 'th-casa-1',
    timestamp: '2026-07-14T09:00:00',
    type: 'idea',
    description: 'Brainstorm sobre home office: Iluminação indireta regulável para reduzir fadiga visual.',
    impact: 'Low',
    consequences: [],
    metadata: {}
  },
  {
    id: 'ev-04',
    threadId: 'th-casa-1',
    timestamp: '2026-07-16T15:00:00',
    type: 'activity',
    description: 'Assinatura do contrato de aluguel e agendamento da mudança para agosto.',
    impact: 'High',
    consequences: [],
    metadata: {}
  },

  /* ─── Thread: Horta Vertical (Casa) ─── */
  {
    id: 'ev-05',
    threadId: 'th-casa-2',
    timestamp: '2026-07-05T17:00:00',
    type: 'idea',
    description: 'Instalar painel de madeira com vasos auto-irrigáveis por gotejamento automático.',
    impact: 'Medium',
    consequences: [],
    metadata: {}
  },
  {
    id: 'ev-06',
    threadId: 'th-casa-2',
    timestamp: '2026-07-08T11:00:00',
    type: 'problem',
    description: 'Identificada mancha escura de umidade (infiltração) no teto da varanda.',
    impact: 'High',
    consequences: ['ev-07'],
    metadata: {}
  },
  {
    id: 'ev-07',
    threadId: 'th-casa-2',
    timestamp: '2026-07-11T16:00:00',
    type: 'activity',
    description: 'Acionado o síndico para vistoria da infiltração da varanda.',
    impact: 'Medium',
    consequences: ['ev-08'],
    metadata: {}
  },
  {
    id: 'ev-08',
    threadId: 'th-casa-2',
    timestamp: '2026-07-16T09:00:00',
    type: 'activity',
    description: 'Engenheiro da construtora agendou vistoria técnica para dia 22 de Julho.',
    impact: 'Medium',
    consequences: [],
    metadata: {}
  },

  /* ─── Thread: Gestão Financeira e Saúde (Casa) ─── */
  {
    id: 'ev-09',
    threadId: 'th-casa-3',
    timestamp: '2026-07-02T10:00:00',
    type: 'activity',
    description: 'Recebidas cotações de seguros de saúde individuais pela corretora.',
    impact: 'Low',
    consequences: ['ev-10'],
    metadata: {}
  },
  {
    id: 'ev-10',
    threadId: 'th-casa-3',
    timestamp: '2026-07-09T14:30:00',
    type: 'decision',
    description: 'Aprovada troca do plano para o Unimed Flex: melhor cobertura de exames com mesma mensalidade.',
    impact: 'High',
    consequences: [],
    metadata: {}
  },

  /* ─── Thread: Onboarding e Funil de Conversão (Tríade.fit) ─── */
  {
    id: 'ev-11',
    threadId: 'th-triade-1',
    timestamp: '2026-07-06T08:00:00',
    type: 'problem',
    description: 'Relatório mensal aponta Churn de 38% dos novos usuários nos primeiros 30 dias.',
    impact: 'High',
    consequences: ['ev-12', 'ev-13'],
    metadata: { churnRate: '38%' }
  },
  {
    id: 'ev-12',
    threadId: 'th-triade-1',
    timestamp: '2026-07-08T10:00:00',
    type: 'decision',
    description: 'Adotada precificação freemium de R$ 29,90/mês para alinhar expectativas de valor.',
    impact: 'High',
    consequences: [],
    metadata: { valor: 29.90 }
  },
  {
    id: 'ev-13',
    threadId: 'th-triade-1',
    timestamp: '2026-07-10T15:00:00',
    type: 'meeting',
    description: 'Alinhamento de design: levantado que o onboarding atual tem 8 telas excessivas.',
    impact: 'Medium',
    consequences: ['ev-14'],
    metadata: { participantes: ['Lucas', 'Design Team'] }
  },
  {
    id: 'ev-14',
    threadId: 'th-triade-1',
    timestamp: '2026-07-13T11:00:00',
    type: 'decision',
    description: 'Decidido cortar funil de onboarding de 8 para 4 telas na próxima sprint.',
    impact: 'High',
    consequences: [],
    metadata: {}
  },
  {
    id: 'ev-15',
    threadId: 'th-triade-1',
    timestamp: '2026-07-17T22:30:00',
    type: 'idea',
    description: 'Criação de um referral program: Usuário indica amigo e ambos ganham bônus de trial Pro.',
    impact: 'Medium',
    consequences: [],
    metadata: {}
  },

  /* ─── Thread: Stack Tecnológica (Tríade.fit) ─── */
  {
    id: 'ev-16',
    threadId: 'th-triade-2',
    timestamp: '2026-06-25T11:00:00',
    type: 'note',
    description: 'Mapeamento de backend: Supabase, Firebase e Rails em análise.',
    impact: 'Low',
    consequences: ['ev-17'],
    metadata: {}
  },
  {
    id: 'ev-17',
    threadId: 'th-triade-2',
    timestamp: '2026-07-01T15:00:00',
    type: 'activity',
    description: 'Homologação de Prova de Conceito (POC) do app usando Supabase concluída.',
    impact: 'Medium',
    consequences: ['ev-18'],
    metadata: {}
  },
  {
    id: 'ev-18',
    threadId: 'th-triade-2',
    timestamp: '2026-07-08T09:30:00',
    type: 'decision',
    description: 'Stack fechada: React Native (Expo) + Supabase + Vercel + Mixpanel.',
    impact: 'High',
    consequences: [],
    metadata: {}
  },

  /* ─── Thread: Desenvolvimento do TCC (Escola) ─── */
  {
    id: 'ev-19',
    threadId: 'th-escola-1',
    timestamp: '2026-07-01T09:00:00',
    type: 'idea',
    description: 'Estudo de LLMs e inteligência artificial aplicados no feedback educacional escolar.',
    impact: 'Medium',
    consequences: ['ev-20'],
    metadata: {}
  },
  {
    id: 'ev-20',
    threadId: 'th-escola-1',
    timestamp: '2026-07-07T14:00:00',
    type: 'meeting',
    description: 'Orientação com Prof. Ricardo: validou tema e orientou focar em modelos menores customizados.',
    impact: 'Medium',
    consequences: ['ev-21', 'ev-22'],
    metadata: { orientador: 'Prof. Ricardo' }
  },
  {
    id: 'ev-21',
    threadId: 'th-escola-1',
    timestamp: '2026-07-14T10:00:00',
    type: 'decision',
    description: 'Tema do TCC homologado: "Modelos de Linguagem na Educação Personalizada".',
    impact: 'High',
    consequences: [],
    metadata: {}
  },
  {
    id: 'ev-22',
    threadId: 'th-escola-1',
    timestamp: '2026-07-16T18:00:00',
    type: 'note',
    description: 'Iniciada leitura e fichamento dos papers: Vaswani (2017) e Brown (2020).',
    impact: 'Low',
    consequences: [],
    metadata: {}
  },

  /* ─── Thread: Grade Horária e Matrículas (Escola) ─── */
  {
    id: 'ev-23',
    threadId: 'th-escola-2',
    timestamp: '2026-07-12T19:00:00',
    type: 'problem',
    description: 'Sobreposição de horários: disciplinas de Compiladores e Banco de Dados 2 ocorrem na terça-feira 19h.',
    impact: 'High',
    consequences: [],
    metadata: {}
  }
];

const knowledges = [
  {
    id: 'kn-01',
    threadId: 'th-casa-1',
    type: 'consolidatedDecision',
    title: 'Acordo e Planejamento da Mudança',
    content: 'Ficou acordada a mudança para o apartamento da Rua das Flores, com contrato assinado e início previsto para agosto de 2026. A lista de móveis para escritório foi catalogada para aquisição.',
    sourceEvents: ['ev-01', 'ev-02', 'ev-04'],
    version: 1,
    updatedAt: '2026-07-16T15:00:00'
  },
  {
    id: 'kn-02',
    threadId: 'th-triade-1',
    type: 'consolidatedDecision',
    title: 'Monetização Freemium do Tríade.fit',
    content: 'O plano Pro será precificado a R$ 29,90/mês. As funcionalidades gratuitas limitarão o usuário a 3 treinos por semana e métricas básicas, incentivando a conversão.',
    sourceEvents: ['ev-12'],
    version: 1,
    updatedAt: '2026-07-08T10:00:00'
  },
  {
    id: 'kn-03',
    threadId: 'th-triade-1',
    type: 'validatedHypothesis',
    title: 'Otimização de Funil e Redução do Onboarding',
    content: 'A hipótese de que o onboarding excessivo (8 telas) estava matando a conversão foi aceita. Decidiu-se pela simplificação do fluxo para 4 telas para mitigar o churn inicial.',
    sourceEvents: ['ev-11', 'ev-13', 'ev-14'],
    version: 2,
    updatedAt: '2026-07-13T11:00:00'
  },
  {
    id: 'kn-04',
    threadId: 'th-triade-2',
    type: 'architectureDefinition',
    title: 'Arquitetura e Stack Tecnológica de Referência',
    content: 'Definido o padrão tecnológico de desenvolvimento do ecossistema: React Native (Expo CLI) no front-end, Supabase como DB/Auth/Serverless no backend, e Mixpanel para rastreamento de funis.',
    sourceEvents: ['ev-17', 'ev-18'],
    version: 1,
    updatedAt: '2026-07-08T09:30:00'
  },
  {
    id: 'kn-05',
    threadId: 'th-escola-1',
    type: 'consolidatedDecision',
    title: 'Linha de Pesquisa Homologada para o TCC',
    content: 'Aprovado o tema final de inteligência artificial aplicada em educação personalizada sob tutoria do Prof. Ricardo. A base científica inicial foi levantada e a proposta escrita está em andamento.',
    sourceEvents: ['ev-19', 'ev-20', 'ev-21'],
    version: 1,
    updatedAt: '2026-07-14T10:00:00'
  }
];

/* ─── Passive Insights ─── */
const insights = [
  {
    id: 'in-01',
    workspaceId: 'casa',
    type: 'regression',
    message: 'A infiltração identificada na sacada impede a montagem e instalação da Horta Vertical.',
    relatedEntities: ['ev-06', 'th-casa-2'],
    createdAt: '2026-07-18T00:00:00'
  },
  {
    id: 'in-02',
    workspaceId: 'triade',
    type: 'contradiction',
    message: 'A decisão de precificar o app em R$ 29,90 Pro foi homologada antes da validação do novo onboarding de 4 telas.',
    relatedEntities: ['ev-12', 'ev-14'],
    createdAt: '2026-07-18T00:00:00'
  },
  {
    id: 'in-03',
    workspaceId: 'escola',
    type: 'stalledThread',
    message: 'A Thread "Desenvolvimento do TCC" está sem novos eventos cadastrados há 6 dias.',
    relatedEntities: ['th-escola-1'],
    createdAt: '2026-07-18T00:00:00'
  },
  {
    id: 'in-04',
    workspaceId: 'escola',
    type: 'actionSuggestion',
    message: 'O conflito de horários das aulas requer resolução com a coordenação antes do fim das matrículas.',
    relatedEntities: ['ev-23', 'th-escola-2'],
    createdAt: '2026-07-18T00:00:00'
  }
];

/* ─── Daily Briefing (diagnóstico estático no Radar) ─── */
const dailyBriefing = {
  priorities: [
    { text: 'Resolver o conflito de horários de Compiladores e BD2.', recordId: 'ev-23', type: 'event' },
    { text: 'Validar a redução de telas do onboarding de 8 para 4 no Tríade.fit.', recordId: 'kn-03', type: 'knowledge' }
  ],
  riscos: [
    { text: 'O TCC está em andamento mas paralisado há 6 dias.', threadId: 'th-escola-1', type: 'thread' },
    { text: 'A infiltração na sacada está bloqueando a Thread Horta Vertical (Pausada).', recordId: 'ev-06', type: 'event' }
  ],
  decisions: [
    { text: 'Aprovar o orçamento final da lista de móveis para o escritório no apartamento novo.', recordId: 'ev-02', type: 'event' },
    { text: 'Definir plano de contingência para Churn no app Pro.', recordId: 'kn-02', type: 'knowledge' }
  ],
  connections: [
    { text: 'A mancha de infiltração na sacada bloqueia o progresso da horta vertical.', insightId: 'in-01' },
    { text: 'Precificação do app Pro pode colidir com a experiência do onboarding encurtado.', insightId: 'in-02' }
  ],
  suggestions: [
    { text: 'Revisar fichamento do paper de Attention (TCC).', recordId: 'ev-22', type: 'event' },
    { text: 'Acompanhar agendamento do engenheiro da construtora.', recordId: 'ev-08', type: 'event' }
  ]
};

/* ─── Dynamic Requested Insights Simulation Data ─── */
const requestedInsightsData = {
  forgetting: [
    { text: 'Cotar painéis de compensado naval para a horta vertical (Salvo no Inbox).', sourceId: 'ib-01', type: 'inbox' },
    { text: 'Ajustar agenda de treinos do Tríade.fit (Salvo no Inbox).', sourceId: 'ib-02', type: 'inbox' }
  ],
  stalled: [
    { text: 'Thread "Desenvolvimento do TCC" (Escola) — Sem atividades há 6 dias.', threadId: 'th-escola-1', type: 'thread' },
    { text: 'Thread "Horta Vertical e Paisagismo" (Casa) — Pausada devido à infiltração.', threadId: 'th-casa-2', type: 'thread' }
  ],
  pricing: [
    { text: 'Decisão Freemium R$ 29,90 homologada em Tríade.fit.', recordId: 'kn-02', type: 'knowledge' },
    { text: 'Seguro de saúde Unimed Flex contratado para Casa.', recordId: 'ev-10', type: 'event' }
  ]
};

/* ─── Core Mutators / Helpers ─── */
function getInbox() {
  return inbox;
}

function addToInbox(descriptionText) {
  const newId = `ib-${Date.now()}`;
  const newItem = {
    id: newId,
    description: descriptionText,
    suggestedWorkspaceId: 'triade', // default suggestion simulation
    suggestedThreadId: 'th-triade-1',
    createdAt: new Date().toISOString()
  };
  inbox.unshift(newItem);
  return newItem;
}

function deleteInboxItem(id) {
  inbox = inbox.filter(item => item.id !== id);
}

function classifyInboxItem(inboxItemId, workspaceId, threadId) {
  const item = inbox.find(i => i.id === inboxItemId);
  if (!item) return null;

  /* Cópia em formato de Evento */
  const newEventId = `ev-${Date.now()}`;
  const newEv = {
    id: newEventId,
    threadId: threadId,
    timestamp: new Date().toISOString(),
    type: 'note', // default type on classification
    description: item.description,
    impact: 'Medium',
    consequences: [],
    metadata: {}
  };
  
  events.unshift(newEv);
  deleteInboxItem(inboxItemId);
  
  /* Update workspace context timestamp */
  const ws = getWorkspace(workspaceId);
  if (ws) {
    ws.context.updatedAt = new Date().toISOString();
  }
  
  return newEv;
}

function getWorkspace(id) {
  return workspaces.find(w => w.id === id);
}

function getThread(id) {
  return threads.find(t => t.id === id);
}

function getThreadsByWorkspace(workspaceId) {
  return threads.filter(t => t.workspaceId === workspaceId);
}

function getEvent(id) {
  return events.find(e => e.id === id);
}

function getEventsByThread(threadId) {
  return events.filter(e => e.threadId === threadId).sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function getKnowledge(id) {
  return knowledges.find(k => k.id === id);
}

function getKnowledgeByThread(threadId) {
  return knowledges.filter(k => k.threadId === threadId);
}

function getWorkspaceByThread(threadId) {
  const t = getThread(threadId);
  return t ? getWorkspace(t.workspaceId) : null;
}

/* Polimorfismo temporário para manter retrocompatibilidade com a busca antiga */
function getRecord(id) {
  if (id.startsWith('ev-')) return getEvent(id);
  if (id.startsWith('kn-')) return getKnowledge(id);
  if (id.startsWith('rec-')) {
    const legacyMap = {
      'rec-01': 'kn-01',
      'rec-02': 'ev-02',
      'rec-03': 'ev-06',
      'rec-04': 'ev-05',
      'rec-05': 'ev-10',
      'rec-08': 'ev-03',
      'rec-13': 'kn-02',
      'rec-14': 'ev-15',
      'rec-15': 'ev-11',
      'rec-17': 'ev-18',
      'rec-19': 'ev-14',
      'rec-21': 'kn-05',
      'rec-22': 'ev-22',
      'rec-23': 'ev-23'
    };
    const newId = legacyMap[id];
    return newId ? getRecord(newId) : null;
  }
  return null;
}

function getRelatedRecords(id) {
  const item = getRecord(id);
  if (!item) return [];
  
  if (id.startsWith('kn-')) {
    return item.sourceEvents.map(evId => getEvent(evId)).filter(Boolean);
  }
  
  if (id.startsWith('ev-')) {
    return item.consequences.map(evId => getEvent(evId)).filter(Boolean);
  }
  
  return [];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return 'Boa madrugada';
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}
