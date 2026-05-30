import { CalendarDays, MapPin } from "lucide-react";
import { image } from "../data/assets.js";
import { AppLink } from "./Link.jsx";

export function AttractionCard({ item, onNavigate }) {
  return (
    <article className="card-hover overflow-hidden rounded-lg border border-slate-200 bg-white">
      <AppLink href={item.path} onNavigate={onNavigate} className="focus-ring block">
        <img className="image-tile" src={image(item.image)} alt={item.alt || item.title} loading="lazy" />
        <div className="p-4">
          <h3 className="font-display text-xl font-black text-ink">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{item.summary}</p>
        </div>
      </AppLink>
    </article>
  );
}

export function EventCard({ item, onNavigate }) {
  return (
    <article className="card-hover overflow-hidden rounded-lg border border-slate-200 bg-white">
      <AppLink href={item.path} onNavigate={onNavigate} className="focus-ring block">
        <img className="image-tile" src={image(item.image)} alt={item.alt || item.title} loading="lazy" />
        <div className="p-4">
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-sunshine px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-ink">
            <CalendarDays aria-hidden="true" size={15} />
            {item.date}
          </div>
          <h3 className="font-display text-xl font-black text-ink">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{item.summary}</p>
        </div>
      </AppLink>
    </article>
  );
}

export function NewsCard({ item, onNavigate }) {
  return (
    <article className="card-hover overflow-hidden rounded-lg border border-slate-200 bg-white">
      <AppLink href={item.path} onNavigate={onNavigate} className="focus-ring block">
        <img className="image-tile" src={image(item.image)} alt={item.alt || item.title} loading="lazy" />
        <div className="p-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-berry">{item.date}</p>
          <h3 className="mt-2 font-display text-xl font-black text-ink">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{item.summary}</p>
        </div>
      </AppLink>
    </article>
  );
}

export function TestimonialCard({ item }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm leading-6 text-slate-700">"{item.text}"</p>
      <p className="mt-4 font-extrabold text-ink">{item.title}</p>
    </article>
  );
}

export function ContactStrip() {
  return (
    <div className="rounded-lg border border-sky/30 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-ink">
        <span className="inline-flex items-center gap-2">
          <MapPin aria-hidden="true" size={18} />
          Woodlands Leisure Park, Blackawton, Totnes, South Devon, TQ9 7DQ
        </span>
        <a className="focus-ring rounded-lg underline decoration-sunshine decoration-4 underline-offset-4" href="tel:+441803712598">
          01803 712598
        </a>
        <a className="focus-ring rounded-lg underline decoration-sunshine decoration-4 underline-offset-4" href="mailto:fun@woodlandspark.com">
          fun@woodlandspark.com
        </a>
      </div>
    </div>
  );
}
