import { Home, Zap, BookOpen, type LucideProps } from "lucide-react";

/** Maps a Workspace.icon slug to a lucide-react icon. Extend as new slugs are used. */
const WORKSPACE_ICON_MAP = {
  home: Home,
  zap: Zap,
  book: BookOpen,
};

/** Renders a Workspace's icon from its `icon` slug (avoids returning a component reference from a function, which React/ESLint flags as "created during render"). */
export function WorkspaceIcon({
  slug,
  ...props
}: { slug: string } & LucideProps) {
  const Icon = WORKSPACE_ICON_MAP[slug as keyof typeof WORKSPACE_ICON_MAP] ?? Home;
  return <Icon {...props} />;
}
