import { Cake, Mail, Map, Phone, Ticket, Timer } from "lucide-react";
import { AppLink } from "./Link.jsx";

const actions = [
  { label: "Book Tickets", href: "/tickets", icon: Ticket },
  { label: "Opening Times", href: "/visiting/opening-times", icon: Timer },
  { label: "Park Map", href: "/visiting/park-map", icon: Map },
  { label: "Birthday Parties", href: "/visiting/birthday-parties", icon: Cake },
  { label: "Newsletter", href: "#newsletter", icon: Mail },
  { label: "Contact Us", href: "/visiting/contact-find-us", icon: Phone },
];

export function BottomCtaBar({ onNavigate }) {
  return (
    <section className="rainbow-ribbon bg-woodpink px-4 py-6 text-white" aria-label="Quick actions">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {actions.map((action) => {
          const Icon = action.icon;
          const className =
            "focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-lg border-2 border-white/40 bg-white px-3 py-3 text-center text-sm font-extrabold uppercase tracking-wide text-ink shadow-button transition hover:-translate-y-0.5 hover:bg-sunshine";
          if (action.href.startsWith("#")) {
            return (
              <a key={action.label} className={className} href={action.href}>
                <Icon aria-hidden="true" size={18} />
                {action.label}
              </a>
            );
          }
          return (
            <AppLink key={action.label} className={className} href={action.href} onNavigate={onNavigate}>
              <Icon aria-hidden="true" size={18} />
              {action.label}
            </AppLink>
          );
        })}
      </div>
    </section>
  );
}
