import { ChevronRight, Home } from "lucide-react";
import { AppLink } from "./Link.jsx";

const labels = {
  explore: "Explore",
  "zoo-farm": "Zoo Farm",
  visiting: "Visiting",
  groups: "Groups",
  blog: "News",
  events: "Events",
};

export function Breadcrumbs({ path, title, onNavigate }) {
  const parts = path.split("/").filter(Boolean);
  const parent = parts[0];

  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-white/80" aria-label="Breadcrumb">
      <AppLink href="/" onNavigate={onNavigate} className="focus-ring inline-flex items-center gap-1 rounded-lg hover:text-white">
        <Home aria-hidden="true" size={16} />
        Home
      </AppLink>
      {parent && (
        <>
          <ChevronRight aria-hidden="true" size={16} />
          <AppLink href={`/${parent}`} onNavigate={onNavigate} className="focus-ring rounded-lg hover:text-white">
            {labels[parent] || parent}
          </AppLink>
        </>
      )}
      <ChevronRight aria-hidden="true" size={16} />
      <span className="text-white">{title}</span>
    </nav>
  );
}
