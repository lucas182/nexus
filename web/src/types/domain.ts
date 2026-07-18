// Domain types mirroring the 6-table schema in MVP_BLUEPRINT.md section 5.

export type InboxStatus = "pending" | "classified" | "discarded";

export interface InboxItem {
  id: string;
  user_id: string;
  raw_text: string;
  suggested_workspace_id: string | null;
  suggested_thread_id: string | null;
  status: InboxStatus;
  created_at: string;
}

export interface Workspace {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  description: string | null;
  context_status: string | null;
  context_maior_risco: string | null;
  context_decisao_recente: string | null;
  context_proximo_passo: string | null;
  context_updated_at: string | null;
  created_at: string;
}

export type ThreadStatus =
  | "created"
  | "in_progress"
  | "paused"
  | "resolved"
  | "archived";

export interface Thread {
  id: string;
  workspace_id: string;
  title: string;
  objetivo: string | null;
  resumo_vivo: string | null;
  status: ThreadStatus;
  created_at: string;
  updated_at: string;
}

export type EventType =
  | "decision"
  | "idea"
  | "problem"
  | "note"
  | "learning"
  | "meeting"
  | "activity";

export type ImpactLevel = "low" | "medium" | "high";

export interface Event {
  id: string;
  thread_id: string;
  type: EventType;
  description: string;
  impact: ImpactLevel;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export type KnowledgeType =
  | "consolidatedDecision"
  | "architectureDefinition"
  | "process"
  | "pattern"
  | "validatedHypothesis";

export interface Knowledge {
  id: string;
  thread_id: string;
  type: KnowledgeType;
  title: string;
  content: string;
  source_event_ids: string[];
  version: number;
  updated_at: string;
}

export type InsightType =
  | "stalledThread"
  | "inboxOverload"
  | "contradiction"
  | "regression";

export type InsightStatus = "active" | "dismissed";

export interface Insight {
  id: string;
  workspace_id: string;
  type: InsightType;
  message: string;
  related_entity_ids: string[];
  status: InsightStatus;
  created_at: string;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  decision: "Decisão",
  idea: "Ideia",
  problem: "Problema",
  note: "Nota",
  learning: "Aprendizado",
  meeting: "Reunião",
  activity: "Atividade",
};

export const THREAD_STATUS_LABELS: Record<ThreadStatus, string> = {
  created: "Criada",
  in_progress: "Em Andamento",
  paused: "Pausada",
  resolved: "Resolvida",
  archived: "Arquivada",
};

export const KNOWLEDGE_TYPE_LABELS: Record<KnowledgeType, string> = {
  consolidatedDecision: "Decisão Consolidada",
  architectureDefinition: "Arquitetura Definida",
  process: "Processo",
  pattern: "Padrão Identificado",
  validatedHypothesis: "Hipótese Validada",
};
