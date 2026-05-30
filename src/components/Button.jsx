import { ArrowRight, CalendarDays, Map, Ticket } from "lucide-react";
import { AppLink } from "./Link.jsx";

const icons = {
  arrow: ArrowRight,
  calendar: CalendarDays,
  map: Map,
  ticket: Ticket,
};

export function CtaButton({
  href,
  children,
  onNavigate,
  variant = "primary",
  icon = "arrow",
  className = "",
}) {
  const Icon = icons[icon] || ArrowRight;
  const base =
    "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-extrabold uppercase tracking-[0.04em] shadow-button transition hover:-translate-y-0.5 active:translate-y-0";
  const styles =
    variant === "secondary"
      ? "border-2 border-ink bg-white text-ink hover:bg-sunshine"
      : variant === "dark"
        ? "bg-ink text-white hover:bg-canopy"
        : "bg-sunshine text-ink hover:bg-ember hover:text-white";

  if (href?.startsWith("http")) {
    return (
      <a className={`${base} ${styles} ${className}`} href={href} target="_blank" rel="noreferrer">
        <Icon aria-hidden="true" size={18} />
        {children}
      </a>
    );
  }

  return (
    <AppLink href={href} onNavigate={onNavigate} className={`${base} ${styles} ${className}`}>
      <Icon aria-hidden="true" size={18} />
      {children}
    </AppLink>
  );
}
