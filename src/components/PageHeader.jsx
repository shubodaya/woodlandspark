import { mediaSource } from "../data/assets.js";
import { Breadcrumbs } from "./Breadcrumbs.jsx";
import { CtaButton } from "./Button.jsx";

export function PageHeader({ page, onNavigate }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <img
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
        src={mediaSource(page.image)}
        alt={page.alt || page.title}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/78 to-ink/20" />
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6 lg:py-20">
        <Breadcrumbs path={page.path} title={page.title} onNavigate={onNavigate} />
        <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.18em] text-sunshine">
          Woodlands Family Theme Park
        </p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-black leading-tight text-shadow-pop sm:text-5xl">
          {page.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/90">{page.summary}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <CtaButton href="/tickets" onNavigate={onNavigate} icon="ticket">
            Book Tickets
          </CtaButton>
          <CtaButton href="/visiting/opening-times" onNavigate={onNavigate} variant="secondary" icon="calendar">
            Opening Times
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
