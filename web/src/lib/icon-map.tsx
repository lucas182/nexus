import {
  Home,
  Zap,
  BookOpen,
  Briefcase,
  Heart,
  DollarSign,
  Dumbbell,
  Users,
  Plane,
  Palette,
  Code2,
  Target,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/** Selectable Workspace icons, in the order offered to the user. Extend as new slugs are used. */
export const WORKSPACE_ICONS: { slug: string; label: string; Icon: LucideIcon }[] = [
  { slug: "home", label: "Casa", Icon: Home },
  { slug: "work", label: "Trabalho", Icon: Briefcase },
  { slug: "book", label: "Estudo", Icon: BookOpen },
  { slug: "health", label: "Saúde", Icon: Heart },
  { slug: "zap", label: "Energia", Icon: Zap },
  { slug: "fitness", label: "Fitness", Icon: Dumbbell },
  { slug: "money", label: "Finanças", Icon: DollarSign },
  { slug: "family", label: "Família", Icon: Users },
  { slug: "travel", label: "Viagem", Icon: Plane },
  { slug: "creative", label: "Criativo", Icon: Palette },
  { slug: "code", label: "Projeto", Icon: Code2 },
  { slug: "goal", label: "Meta", Icon: Target },
];

const WORKSPACE_ICON_MAP = Object.fromEntries(
  WORKSPACE_ICONS.map(({ slug, Icon }) => [slug, Icon]),
) as Record<string, LucideIcon>;

/** Renders a Workspace's icon from its `icon` slug (avoids returning a component reference from a function, which React/ESLint flags as "created during render"). */
export function WorkspaceIcon({
  slug,
  ...props
}: { slug: string } & LucideProps) {
  const Icon = WORKSPACE_ICON_MAP[slug] ?? Home;
  return <Icon {...props} />;
}
