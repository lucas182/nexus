# Nexus — Constituição de Experiência (UX) e Domínio (DOMAIN.md)

Este documento define as diretrizes de experiência de uso (UX), o fluxo de informações e a arquitetura conceitual do **Nexus**. Ele funciona como a especificação oficial de comportamento e DNA do produto.

---

## 1. Filosofia Revisada: OS de Atenção e Contexto

O Nexus não é um local para armazenar e formatar arquivos. É um **Sistema Operacional de Contexto (Life OS)** cujo objetivo principal é eliminar a carga mental de gerenciamento.

A maior causa de abandono de ferramentas de produtividade é a **fadiga de organização**: a obrigação de escolher uma pasta, colocar tags, formatar o título e definir datas no exato momento em que se tem uma ideia ou se descobre um problema. 

O Nexus elimina essa barreira aplicando o princípio fundamental:
> **Capturar primeiro. Organizar depois.**

O usuário registra pensamentos brutos sem pensar em estrutura. O sistema recebe, armazena temporariamente e ajuda a processar de forma inteligente. O Nexus não gerencia informações; ele gerencia a **atenção** do usuário.

---

## 2. O Papel do Inbox (Triagem Obrigatória)

O **Inbox** é a porta de entrada única para qualquer informação que entra no Nexus. 

**Regra Absoluta:**
> Nada nasce diretamente dentro de um Workspace. Tudo nasce no Inbox.

O Inbox funciona como uma caixa de entrada física temporária. Ele representa o estado de "não processado". Sua existência garante que o usuário consiga esvaziar a mente instantaneamente, sabendo que a informação está segura e será classificada no momento oportuno.

O Inbox deve ser limpo regularmente. O acúmulo de itens no Inbox por mais de 48 horas é considerado um sinal de sobrecarga de atenção, gerando alertas no Radar.

---

## 3. A Experiência de Captura Rápida (< 5 segundos)

A captura no Nexus deve ser tão rápida quanto enviar uma mensagem de chat para si mesmo.
- **Fricção Zero**: Um único botão de captura global (`+`) ou atalho de teclado abre uma caixa de texto simples.
- **Sem Metadados Obrigatórios**: O formulário possui apenas um campo de entrada de texto e suporte para arrastar um arquivo ou colar um link.
- **Processamento Assíncrono**: O usuário digita a ideia, aperta `Enter` e a janela fecha imediatamente. Ele não precisa selecionar Workspace, Thread, Categoria ou prioridade. O item é enviado ao Inbox em background.

---

## 4. O Fluxo de Transformação e Classificação

Toda informação capturada percorre a esteira oficial do Nexus:

```
  [ Entrada Bruta ]
         │
         ▼
 1. CAPTURE (< 5s, caixa única)
         │
         ▼
 2. INBOX (Item não classificado)
         │
         ▼
 3. CLASSIFICAÇÃO (Ação manual do usuário ou sugestão assistida)
         │
         ▼
 4. WORKSPACE (Associação ao contexto macro de vida/trabalho)
         │
         ▼
 5. THREAD (Associação a uma linha de assunto ativa)
         │
         ▼
 6. EVENTO (Fato imutável gravado na timeline)
         │
         ▼
 7. KNOWLEDGE (Consolidação do log de acontecimentos)
         │
         ▼
 8. INSIGHT (Análise de correlações e dependências)
```

### O Processo de Classificação Assistida
Ao abrir o Inbox para organizar, o usuário recebe sugestões inteligentes (heurísticas ou analíticas) de classificação:
- *"Isso parece pertencer ao Workspace Tríade.fit."*
- *"Esta informação parece complementar a decisão da Thread: Precificação do App."*
- O usuário pode aceitar a sugestão com um clique ou arrastar manualmente para o Workspace/Thread correto.

---

## 5. Ciclo de Vida de uma Thread

Uma **Thread** representa um assunto vivo de foco. Ela possui um ciclo de vida linear e estruturado:

```
Criada ──► Em Andamento ──► Pausada ──► Resolvida ──► Arquivada
```

- **Criada**: A thread foi proposta, mas ainda não recebeu eventos de execução.
- **Em Andamento**: O assunto está evoluindo ativamente e acumulando eventos na timeline.
- **Pausada**: O assunto está sob espera (ex: aguardando resposta de terceiros ou bloqueado por riscos).
- **Resolvida**: O objetivo da thread foi alcançado. O conhecimento gerado é consolidado em um item de `Knowledge`.
- **Arquivada**: O assunto perdeu relevância ou foi descontinuado. Os eventos continuam imutáveis, mas a thread não consome espaço no radar do usuário.

### Resumo Automático de Contexto da Thread
Toda Thread possui uma seção dinâmica de **Contexto da Thread**, gerada pela leitura dos eventos de impacto alto. Ela resume em tempo real:
- Status atual do assunto.
- Último progresso crítico.
- Próximo passo imediato para avançar.

---

## 6. Como o Contexto de Workspace é Atualizado

O Workspace não armazena pastas estáticas. Ele consolida o contexto das Threads ativas associadas a ele. O Contexto é reativo e atualiza-se automaticamente sempre que um **Evento de alto impacto (`impact = High`)** é registrado em qualquer uma de suas Threads.

**Exemplo de fluxo de atualização de Contexto:**
1. O usuário registra o evento: *"Vistoria da infiltração detectou vazamento estrutural da coluna principal."* na Thread *Reforma da Sacada* do Workspace *Casa*.
2. O Nexus recalcula o Contexto do Workspace *Casa*:
   - O campo **Maior Risco** é atualizado para *"Vazamento estrutural na sacada"*.
   - O campo **Próximo Passo Sugerido** é atualizado para *"Cobrar cronograma de reparo da construtora"*.

---

## 7. O Radar (Antigo Dashboard)

O painel de controle principal do usuário foi renomeado de *Dashboard* para **Radar**. O Radar foca estritamente na **atenção do usuário**. 

Ele responde a três perguntas fundamentais de forma imediata:
1. **Onde preciso agir hoje?** (Decisões pendentes e itens não processados no Inbox).
2. **O que mudou recentemente?** (Timeline global de eventos recentes nos workspaces).
3. **Quais riscos requerem minha atenção?** (Alertas de Threads sem movimentação, contradições lógicas detectadas e bloqueios de dependências).

---

## 8. Tipos de Insights: Passive vs. Requested

Para evitar spam visual, a inteligência do sistema é dividida em dois comportamentos distintos:

### A. Passive Insights (Reativos e Silenciosos)
O Nexus analisa o grafo de dados em segundo plano e exibe avisos sutis nas telas de Workspace ou Knowledge:
- **Contradição**: *"Esta decisão contradiz uma decisão anterior tomada na Thread X há 20 dias."*
- **Bloqueio/Dependência**: *"Este projeto está associado a uma Thread que depende de uma entrega pendente no Workspace Y."*
- **Inércia**: *"Esta Thread está inativa há 30 dias."*

### B. Requested Insights (Ativos sob Demanda)
Ativados explicitamente pelo usuário na tela de Radar ou por meio de atalhos. São perguntas estruturadas de triagem mental:
- *"O que estou esquecendo?"* -> Retorna tarefas ou ideias do Inbox capturadas e ainda não priorizadas.
- *"O que ficou parado?"* -> Retorna Threads em andamento sem novos eventos cadastrados nos últimos 7 dias.
- *"Quais decisões recentes impactam meu Workspace X?"* -> Consolida as decisões de outros Workspaces que possuem conexões de tags ou dependências explícitas.

---

## 9. Exemplos de Fluxo Completo de Experiência

### Cenário A: Casa
1. **Captura**: O usuário digita no atalho rápido: *"Síndico confirmou que a construtora vai fazer a vistoria técnica dia 22 de julho."* (Tempo: 3s).
2. **Inbox**: O item cai no Inbox como texto bruto.
3. **Classificação**: O sistema sugere associar ao Workspace **Casa** e à Thread **Reforma da Sacada**. O usuário clica em "Confirmar".
4. **Evento**: Um evento do tipo `activity` de alto impacto é registrado na timeline da Thread.
5. **Contexto**: O Contexto do Workspace **Casa** atualiza automaticamente a data de vistoria e remove o status de "pendência de contato".
6. **Insight**: O sistema remove o alerta de "vistoria não agendada" do Radar.

### Cenário B: Escola
1. **Captura**: O usuário tira uma foto da ementa de disciplinas no celular e envia para o Nexus com a nota: *"BD2 e Compiladores batem horário na terça às 19h."*
2. **Inbox**: A foto e o texto brutos aguardam na caixa de entrada.
3. **Classificação**: O usuário arrasta o item para o Workspace **Escola**, criando uma nova Thread chamada **Grade Horária e Matrículas**.
4. **Evento**: O problema é registrado como um evento do tipo `problem`.
5. **Contexto & Radar**: O Radar exibe o alerta: *"Disciplina com conflito de horário ativa"*. O próximo passo sugerido no contexto acadêmico passa a ser *"Entrar em contato com o coordenador"*.

### Cenário C: Tríade.fit
1. **Captura**: O usuário digita rápido: *"Decidimos cobrar R$ 29,90/mês no plano Pro."*
2. **Inbox**: Salvo no Inbox.
3. **Classificação**: Classificado como Workspace **Tríade.fit** na Thread **Onboarding e Funil**.
4. **Evento**: Registrado como um evento do tipo `decision`.
5. **Knowledge**: Vários eventos de precificação são compilados pelo usuário em um Knowledge de nome *"Manual de Pricing do MVP"*.
6. **Insight**: O Nexus detecta que a decisão foi tomada, mas exibe um *Passive Insight*: *"A precificação Pro foi definida antes da validação do fluxo encurtado de onboarding de 4 telas (Thread: Onboarding)"*.

---

## 10. Quais Telas Precisam Mudar

Para refletir a nova experiência de uso de Contexto, as seguintes interfaces do MVP serão reestruturadas:

1. **A Nova Tela de Inbox**:
   - Um painel limpo exibindo os itens brutos capturados.
   - Cards com sugestões rápidas de classificação (Workspace e Thread correspondente) com botões de confirmação direta.
2. **A Tela de Radar (Antigo Dashboard)**:
   - Exibição de um resumo visual do Inbox no topo ("Você tem X itens para classificar").
   - Substituição do termo "Dashboard" para "Radar".
   - Inclusão dos gatilhos de **Requested Insights** ("O que estou esquecendo?", "O que ficou parado?").
3. **A Tela de Workspace**:
   - Lista organizada por **Threads** exibindo o ciclo de vida (ex: *Em andamento*, *Pausada*) e o resumo do contexto de cada assunto.
   - Sumarização dinâmica do contexto do Workspace no topo.
4. **O Modal de Captura Rápida (`+`)**:
   - Overlay compacto, focado em escrita rápida, que pode ser ativado de qualquer tela sem perder o progresso atual.
