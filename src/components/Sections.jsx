import { CheckCircle2 } from "lucide-react";
import { image } from "../data/assets.js";

export function SectionHeading({ eyebrow, title, text, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <p className="section-eyebrow text-sm font-extrabold uppercase tracking-[0.18em] text-berry">{eyebrow}</p>
      )}
      <h2 className="section-title mt-2 font-display text-3xl font-black leading-tight text-ink sm:text-4xl">{title}</h2>
      {text && <p className="section-text mt-3 text-base leading-7 text-slate-700">{text}</p>}
    </div>
  );
}

export function ContentSection({ section }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-display text-2xl font-black text-ink">{section.title}</h2>
      {section.body && <p className="mt-3 leading-7 text-slate-700">{section.body}</p>}
      {section.items && (
        <ul className="mt-4 grid gap-3">
          {section.items.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-leaf" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function GallerySection({ images = [], alt = "Woodlands gallery image" }) {
  if (!images.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <SectionHeading eyebrow="Gallery" title="See The Details" text="A closer look at park spaces, attractions and visitor resources." />
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((name) => (
          <img
            key={name}
            className="aspect-[4/3] w-full rounded-lg border border-slate-200 object-cover shadow-sm"
            src={image(name)}
            alt={alt}
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}

export function HighlightList({ items = [] }) {
  if (!items.length) return null;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 shadow-sm">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-leaf" size={18} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
