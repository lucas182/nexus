# NEXUS — MVP Blueprint

> Documento interno de referência oficial para desenvolvimento.
> Congela o escopo do MVP a partir da filosofia e do domínio definidos em [`DOMAIN.md`](./DOMAIN.md).
> A partir deste ponto, qualquer decisão de produto deve ser validada contra este documento antes de ser implementada.

---

## 1. Visão do Produto

O Nexus é um **Sistema Operacional de Contexto**. Ele não organiza documentos — organiza acontecimentos.

O produto existe para resolver um único problema: a carga mental de ter que lembrar onde uma informação foi guardada, o que estava decidido e o que falta fazer, espalhada entre a cabeça do usuário, notas soltas, chats e aplicativos diferentes.

O MVP não tenta provar que o Nexus é inteligente. Ele tenta provar uma coisa mais simples e mais fundamental:

> **Se o usuário só precisar capturar, o sistema consegue transformar isso em contexto útil sem atrito.**

Tudo o que não serve diretamente a essa prova é fora de escopo — por mais "interessante" que pareça.

---

## 2. Filosofia

Princípios inegociáveis, válidos para toda decisão de produto, UX ou engenharia deste ponto em diante:

- **Capturar primeiro. Organizar depois.** Nunca inverter essa ordem.
- **Contexto acima de informação.** O valor não é o dado armazenado, é o que ele revela quando conectado a outros.
- **Pouca fricção.** Toda tela nova, todo campo obrigatório, é uma dívida de atenção.
- **Interface silenciosa.** O sistema não grita. Ele sussurra sugestões e se cala quando não tem nada relevante a dizer.
- **O sistema pensa junto com o usuário**, nunca no lugar dele — e nunca antes dele.
- **O usuário nunca começa escolhendo um Workspace.** O ponto de entrada é sempre o Inbox.

---

## 3. Modelo Mental

O domínio oficial do produto é a cadeia:

```
Inbox → Workspace → Thread → Event → Knowledge → Insight
```

| Elemento | Responsabilidade |
|---|---|
| **Inbox** | Captura rápida, não classificada. Estado temporário. |
| **Workspace** | Representa uma área da vida ou projeto (ex: Casa, Escola, um produto). |
| **Thread** | Representa um assunto vivo, em evolução — nunca uma página estática. |
| **Event** | Representa um acontecimento imutável, registrado na timeline de uma Thread. |
| **Knowledge** | Representa conhecimento consolidado a partir de um ou mais Events. |
| **Insight** | Representa inteligência produzida pelo sistema a partir de padrões nos dados. |

O usuário nunca interage diretamente com "o banco de dados". Ele interage com esses seis conceitos, e só com eles.

---

## 4. Fluxo Principal

```
1. O usuário registra qualquer coisa
        ↓
2. Entra automaticamente no Inbox
        ↓
3. O usuário organiza quando quiser (nunca é forçado)
        ↓
4. O item é associado a um Workspace
        ↓
5. É associado a uma Thread
        ↓
6. Vira um Event (fato imutável)
        ↓
7. A Thread atualiza seu Contexto (Resumo Vivo)
        ↓
8. O Workspace atualiza seu Contexto
        ↓
9. O sistema passa a conseguir gerar Insights
```

Nenhuma etapa pode ser pulada por trás das costas do usuário — mas nenhuma etapa além da 1 e 2 pode ser **obrigatória** no momento da captura.

---

## 5. Entidades do MVP

Modelo de dados relacional (Postgres/Supabase), já mapeado a partir do domínio validado no protótipo (`js/data.js`).

### `inbox_items`
| campo | tipo | nota |
|---|---|---|
| id | uuid | pk |
| user_id | uuid | fk auth.users |
| raw_text | text | conteúdo bruto capturado |
| suggested_workspace_id | uuid | nullable, heurística simples |
| suggested_thread_id | uuid | nullable, heurística simples |
| status | enum | `pending`, `classified`, `discarded` |
| created_at | timestamptz | |

### `workspaces`
| campo | tipo | nota |
|---|---|---|
| id | uuid | pk |
| user_id | uuid | fk |
| name | text | |
| icon | text | slug do ícone |
| description | text | |
| context_status | text | curto, editável |
| context_maior_risco | text | editável |
| context_decisao_recente | text | editável |
| context_proximo_passo | text | editável |
| context_updated_at | timestamptz | atualizado automaticamente na criação de Event `impact=High` |
| created_at | timestamptz | |

### `threads`
| campo | tipo | nota |
|---|---|---|
| id | uuid | pk |
| workspace_id | uuid | fk |
| title | text | |
| objetivo | text | |
| resumo_vivo | text | editável pelo usuário no MVP |
| status | enum | `created`, `in_progress`, `paused`, `resolved`, `archived` |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `events`
| campo | tipo | nota |
|---|---|---|
| id | uuid | pk |
| thread_id | uuid | fk |
| type | enum | `decision`, `idea`, `problem`, `note`, `learning`, `meeting`, `activity` |
| description | text | **imutável após criação** |
| impact | enum | `low`, `medium`, `high` |
| metadata | jsonb | livre |
| timestamp | timestamptz | |

### `knowledge`
| campo | tipo | nota |
|---|---|---|
| id | uuid | pk |
| thread_id | uuid | fk |
| type | enum | `consolidatedDecision`, `architectureDefinition`, `process`, `pattern`, `validatedHypothesis` |
| title | text | |
| content | text | |
| source_event_ids | uuid[] | |
| version | int | |
| updated_at | timestamptz | |

### `insights`
| campo | tipo | nota |
|---|---|---|
| id | uuid | pk |
| workspace_id | uuid | fk |
| type | enum | `stalledThread`, `inboxOverload`, `contradiction` (Sprint 3), `regression` (Sprint 3) |
| message | text | |
| related_entity_ids | uuid[] | |
| status | enum | `active`, `dismissed` |
| created_at | timestamptz | |

Sem tabelas de junção adicionais no MVP. `consequences` (encadeamento causal entre Events) fica em `metadata` ou é adiado — **não é indispensável para validar o conceito**.

---

## 6. Jornada do Usuário

**Cenário de ponta a ponta — o único fluxo que o MVP precisa provar:**

1. Lucas abre o Nexus (ou aperta o atalho global) e digita: *"Síndico confirmou vistoria da construtora dia 22 de julho."* Aperta Enter. Modal fecha. Zero perguntas.
2. Mais tarde, ele abre o **Inbox** e vê o item com uma sugestão: *"Parece pertencer a Casa → Reforma da Sacada."* Clica em confirmar.
3. O item vira um **Event** na Thread. A Thread atualiza seu resumo. O Workspace **Casa** atualiza seu contexto (`context_updated_at`, e se o evento for `impact=High`, o campo de próximo passo é sinalizado para revisão).
4. No **Radar**, o alerta de "vistoria pendente" desaparece e um novo item de atenção aparece se necessário.
5. Dias depois, a Thread fica 7 dias sem novo Event. O Radar mostra: *"O que está parado?" → Reforma da Sacada.*

Se este fluxo funciona sem fricção perceptível, o MVP validou a tese do produto.

---

## 7. Arquitetura Simplificada

```
┌─────────────────────────────────────────┐
│              Next.js (App Router)         │
│  Server Components + Server Actions       │
│  TailwindCSS + shadcn/ui                  │
└───────────────────┬───────────────────────┘
                     │
                     │ Supabase JS client (RLS-protected)
                     ▼
┌─────────────────────────────────────────┐
│                 Supabase                  │
│  Auth (email/password ou magic link)      │
│  Postgres (schema da seção 5)             │
│  Storage (anexos — Sprint 2)              │
└─────────────────────────────────────────┘
                     │
                     ▼
                  Vercel (deploy)
```

**Princípios de arquitetura:**
- Sem backend próprio. Server Actions do Next.js falam direto com Supabase via client autenticado + RLS.
- Sem microsserviços, sem filas, sem Event Sourcing completo — apenas tabelas relacionais simples com timestamps.
- Estado do cliente é mínimo: modais (Captura Rápida, Busca Global) usam estado local de React. Dados vêm de Server Components / `fetch` revalidado, sem gerenciador de estado global.
- RLS por `user_id` em todas as tabelas — cada usuário só enxerga seus próprios dados. Sem colaboração/times no MVP.
- IA (classificação, resumo automático, insights semânticos) é isolada em uma camada própria (Sprint 3) para não acoplar o core do produto a um provedor de LLM.

---

## 8. Telas

Exatamente cinco telas. Nenhuma outra.

1. **Radar** — tela inicial. Responde as 4 perguntas (seção "Radar" abaixo).
2. **Inbox** — lista de itens não classificados + ação de classificação.
3. **Workspace** — contexto do workspace + lista de Threads.
4. **Thread** — objetivo, resumo vivo, status, timeline de Events, Knowledge gerado, próximos passos.
5. **Busca Global** — overlay (Ctrl+K), não precisa de rota própria.

A **Captura Rápida** é um modal global acessível de qualquer tela — não conta como tela, é um componente transversal.

### Radar — as 4 perguntas
1. Onde devo prestar atenção? (Inbox acumulado, decisões pendentes)
2. O que mudou? (Events recentes de alto impacto, cross-workspace)
3. O que está parado? (Threads sem Event há N dias)
4. Qual deveria ser meu próximo passo? (agregado dos `context_proximo_passo` dos Workspaces ativos)

Nada além disso entra no Radar. Se uma ideia não responde a uma dessas 4 perguntas, ela não pertence ao Radar.

### Thread — campos obrigatórios da tela
Título · Objetivo · Resumo Vivo · Status · Timeline de Events · Knowledge gerado · Próximos Passos.

### Workspace — contexto em <20s
Objetivo · O que mudou · Threads abertas · Decisões tomadas · Riscos existentes · Próximo passo.

---

## 9. Componentes

Inventário mínimo de componentes reutilizáveis (mapeados sobre primitivas shadcn/ui), reaproveitando os design tokens já validados no protótipo (`css/tokens.css`):

- `QuickCaptureModal` — textarea único, sem campos extras, `Enter` para salvar.
- `InboxCard` — texto bruto + chip de sugestão (workspace/thread) + confirmar/redirecionar/descartar.
- `RadarSection` — 4 blocos fixos (Atenção, Mudanças, Parado, Próximo passo).
- `WorkspaceContextPanel` — os 6 campos de contexto, edição inline.
- `ThreadCard` — título, `StatusBadge`, data do último Event.
- `ThreadTimeline` — lista cronológica de `EventItem`.
- `EventItem` — ícone por `type`, `ImpactBadge`, texto, timestamp.
- `KnowledgeCard` — título, tipo, conteúdo, Events-fonte.
- `InsightChip` — mensagem curta e discreta, nunca modal, nunca bloqueia.
- `StatusBadge` / `TypeBadge` — badges compartilhados (Thread status, Event/Knowledge type).
- `GlobalSearchModal` — input único, resultados agrupados por tipo de entidade.
- `Sidebar` — nav fixo: Radar, Inbox, lista de Workspaces, atalho de busca.

Nenhum componente de dashboard genérico, gráfico, ou "widget configurável". Se não está na lista acima, não é MVP.

---

## 10. O que entra no MVP

- Autenticação simples (Supabase Auth, single-tenant, sem times)
- Captura rápida de texto (Inbox), com atalho global e modal
- Inbox: listar, classificar (Workspace + Thread), descartar
- Sugestão de classificação por **heurística simples** (último workspace/thread usado, correspondência de palavras-chave) — **não é IA**
- CRUD de Workspace (nome, ícone, descrição, contexto editável manualmente)
- CRUD de Thread (título, objetivo, status, resumo editável)
- Criação de Event a partir da classificação de um item do Inbox (tipo e impacto definidos pelo usuário)
- Timeline de Events por Thread (Events são imutáveis após criados)
- Criação manual de Knowledge a partir de um ou mais Events selecionados
- Insights baseados em regra determinística (sem IA): Thread parada há N dias, Inbox acumulado há 48h+
- Radar respondendo as 4 perguntas com dados reais
- Busca Global full-text (Postgres, `tsvector`/`ILIKE`) sobre Events, Knowledge, Threads, Workspaces
- Atualização automática de `context_updated_at` do Workspace quando um Event `impact=High` é criado em uma de suas Threads

---

## 11. O que fica fora do MVP

- Qualquer chamada a LLM/IA (classificação inteligente, resumo automático, detecção de contradição, sugestão de próximo passo gerada por IA) → **Sprint 3**
- Anexos de arquivo, imagem, foto na captura → Sprint 2 (protótipo já cita suporte a arrastar arquivo — adiado)
- Colaboração, times, múltiplos usuários por Workspace, permissões
- Notificações push/email
- Mobile app nativo (React Native) — MVP é web responsivo apenas
- Integrações externas (Google Calendar, WhatsApp, etc.)
- Event Sourcing completo / grafo de causalidade (`consequences` entre Events)
- Versionamento avançado de Knowledge além de um contador simples
- Qualquer tela além das 5 definidas
- Dashboard configurável, relatórios, exportação de dados
- Temas customizáveis, múltiplos idiomas

Se algo não está na lista da seção 10, está aqui — por omissão.

---

## 12. Roadmap

| Sprint | Foco | Resultado |
|---|---|---|
| **Sprint 1** | Esqueleto funcional completo | Fluxo ponta a ponta (Captura → Inbox → Event → Radar) funcionando com dados reais no Supabase |
| **Sprint 2** | Refinamento e regras | Insights determinísticos, anexos, atalhos, estados vazios, polish de UX |
| **Sprint 3** | Inteligência | Classificação assistida por IA, resumo automático, insights semânticos (contradição, dependência) |

---

## 13. Sprint 1 — Fundação

**Objetivo: o fluxo principal completo, sem IA, rodando em produção.**

- [ ] Setup do projeto Next.js + Tailwind + shadcn/ui
- [ ] Setup do projeto Supabase (Auth + Postgres) e deploy inicial na Vercel
- [ ] Migrations das 6 tabelas (seção 5) com RLS por `user_id`
- [ ] Tela de login/cadastro (Supabase Auth)
- [ ] Modal de Captura Rápida (atalho global + botão) → grava em `inbox_items`
- [ ] Tela Inbox: listagem, classificação manual (seleção de Workspace + Thread), criação de Event a partir da classificação
- [ ] Heurística simples de sugestão (último usado / keyword match)
- [ ] CRUD de Workspace (criação, listagem, contexto editável)
- [ ] CRUD de Thread (criação, listagem por Workspace, status)
- [ ] Tela Thread: timeline de Events, criação manual de Event direto na Thread
- [ ] Tela Radar com as 4 perguntas usando dados reais (sem regra de "parado" ainda)
- [ ] Sidebar de navegação com lista de Workspaces

---

## 14. Sprint 2 — Melhorias Imediatas

**Objetivo: o produto passa a "parecer vivo" e usável no dia a dia.**

- [ ] Insight determinístico: Thread parada há N dias
- [ ] Insight determinístico: Inbox acumulado há 48h+
- [ ] Atualização automática de contexto do Workspace em Event `impact=High`
- [ ] Criação manual de Knowledge a partir de Events selecionados na Thread
- [ ] Busca Global (Ctrl+K) com full-text search
- [ ] Suporte a anexar link/arquivo na Captura Rápida
- [ ] Estados vazios (Inbox vazio, Workspace sem Threads, etc.)
- [ ] Atalhos de teclado (captura, busca, navegação)
- [ ] Responsividade mobile-web

---

## 15. Sprint 3 — IA, Insights e Automações

**Objetivo: o sistema começa a pensar junto com o usuário.**

- [ ] Classificação de Inbox assistida por LLM (sugestão de Workspace/Thread por similaridade semântica)
- [ ] Resumo automático (Resumo Vivo da Thread, gerado a partir dos Events)
- [ ] Contexto de Workspace gerado automaticamente (Maior Risco, Próximo Passo) via LLM
- [ ] Insight de contradição (decisões conflitantes entre Threads)
- [ ] Insight de dependência/bloqueio entre Threads
- [ ] Requested Insights sob demanda ("O que estou esquecendo?", "O que ficou parado?")
- [ ] Consolidação assistida de Knowledge (sugestão automática de quando consolidar)

---

## 16. Decisões Arquiteturais Imutáveis

Regras que **não podem ser quebradas** por nenhuma feature futura, por mais útil que pareça:

1. **Tudo nasce no Inbox.** Nenhuma entidade pode ser criada diretamente dentro de um Workspace ou Thread, pulando a captura.
2. **Events são imutáveis.** Uma vez criado, um Event nunca é editado ou apagado — apenas superado por novos Events. Correções entram como novo Event.
3. **A captura nunca exige metadado obrigatório.** Um campo de texto. Nada mais. Qualquer segunda decisão obrigatória no momento da captura é uma regressão de produto.
4. **O Radar responde só 4 perguntas.** Nunca vira um dashboard genérico com widgets configuráveis.
5. **Máximo de 5 telas.** Toda nova funcionalidade deve caber dentro das telas existentes — não gera novo item de navegação de topo.
6. **Insights nunca bloqueiam.** São sempre informativos, nunca modais obrigatórios ou fluxos que travam o usuário.
7. **Single-tenant por conta.** Sem times, sem compartilhamento, sem permissões cruzadas no escopo deste blueprint — RLS estritamente por `user_id`.

---

## 17. Checklist para Iniciar o Desenvolvimento

- [ ] Criar projeto no Supabase e anotar `SUPABASE_URL` / `SUPABASE_ANON_KEY`
- [ ] Escrever migrations SQL para as 6 tabelas da seção 5 + políticas RLS
- [ ] Criar projeto Next.js (App Router, TypeScript) com Tailwind e shadcn/ui
- [ ] Portar os design tokens já validados (`css/tokens.css` do protótipo) para `tailwind.config`
- [ ] Configurar Supabase Auth (email/password) no Next.js
- [ ] Criar projeto na Vercel, conectar repositório, configurar env vars
- [ ] Confirmar com o time (Lucas) que a lista da seção 10 está congelada antes de começar a codar
- [ ] Abrir board de tarefas (Sprint 1) e começar pelo fluxo Captura → Inbox → Event, que é o coração do produto

---

*Este documento é a referência oficial. Qualquer divergência entre código e este blueprint deve ser resolvida atualizando o blueprint — não silenciosamente no código.*
