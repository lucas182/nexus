import {
  EVENT_TYPE_LABELS,
  KNOWLEDGE_TYPE_LABELS,
  THREAD_STATUS_LABELS,
  type EventType,
  type KnowledgeType,
  type ThreadStatus,
} from "@/types/domain";

const EVENT_TYPE_COLOR_VAR: Record<EventType, string> = {
  decision: "var(--type-decision)",
  idea: "var(--type-idea)",
  problem: "var(--type-problem)",
  note: "var(--type-note)",
  learning: "var(--type-learning)",
  meeting: "var(--type-meeting)",
  activity: "var(--type-activity)",
};

const KNOWLEDGE_TYPE_COLOR_VAR: Record<KnowledgeType, string> = {
  consolidatedDecision: "var(--type-decision)",
  architectureDefinition: "var(--type-meeting)",
  process: "var(--type-activity)",
  pattern: "var(--type-pattern)",
  validatedHypothesis: "var(--type-learning)",
};

function Dot({ color }: { color: string }) {
  return (
    <span
      className="h-1.5 w-1.5 rounded-full"
      style={{ background: color }}
    />
  );
}

export function EventTypeBadge({ type }: { type: EventType }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-hover px-1.5 py-0.5 text-[10px] font-medium text-text-secondary">
      <Dot color={EVENT_TYPE_COLOR_VAR[type]} />
      {EVENT_TYPE_LABELS[type]}
    </span>
  );
}

export function KnowledgeTypeBadge({ type }: { type: KnowledgeType }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium text-accent">
      <Dot color={KNOWLEDGE_TYPE_COLOR_VAR[type]} />
      {KNOWLEDGE_TYPE_LABELS[type]}
    </span>
  );
}

const STATUS_STYLE: Record<ThreadStatus, string> = {
  created: "bg-hover text-text-tertiary",
  in_progress: "bg-accent-soft text-accent",
  paused: "bg-amber-soft text-amber",
  resolved: "bg-green-soft text-green",
  archived: "bg-hover text-text-tertiary/60",
};

export function ThreadStatusBadge({ status }: { status: ThreadStatus }) {
  return (
    <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-medium ${STATUS_STYLE[status]}`}>
      {THREAD_STATUS_LABELS[status]}
    </span>
  );
}

const IMPACT_STYLE: Record<string, string> = {
  high: "text-red",
  medium: "text-text-secondary",
  low: "text-text-tertiary",
};

export function ImpactLabel({ impact }: { impact: string }) {
  return <span className={`font-medium ${IMPACT_STYLE[impact]}`}>{impact}</span>;
}
