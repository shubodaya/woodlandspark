import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Sparkles, Ticket, X } from "lucide-react";
import { bookingUrl, eventCards, gallerySlides } from "../data/siteData.js";
import { image } from "../data/assets.js";
import { CtaButton } from "./Button.jsx";
import { EventCard } from "./Cards.jsx";
import { SectionHeading } from "./Sections.jsx";

export function PromoBanner({ onNavigate }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <aside className="promo-pop mx-4 mt-4 rounded-lg border-2 border-sunshine bg-white p-4 shadow-lift md:fixed md:bottom-6 md:right-6 md:z-40 md:mx-0 md:mt-0 md:max-w-sm">
      <button
        className="focus-ring absolute right-3 top-3 inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg bg-mist text-ink"
        type="button"
        aria-label="Close offer banner"
        onClick={() => setOpen(false)}
      >
        <X aria-hidden="true" size={18} />
      </button>
      <div className="pr-10">
        <p className="inline-flex items-center gap-2 rounded-lg bg-sunshine px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink">
          <Sparkles aria-hidden="true" size={15} />
          Event Highlight
        </p>
        <h2 className="mt-3 font-display text-2xl font-black leading-tight text-ink">
          Titan The Robot arrives in August 2026
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Listed event dates include 4th, 11th, 18th and 25th August 2026. Book online before the day for the best ticket saving.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <CtaButton href="/events" onNavigate={onNavigate} variant="secondary" icon="calendar">
          Events
        </CtaButton>
        <CtaButton href={bookingUrl} onNavigate={onNavigate} icon="ticket">
          Tickets
        </CtaButton>
      </div>
    </aside>
  );
}

export function EventHighlightCarousel({ onNavigate }) {
  const [active, setActive] = useState(0);
  const next = () => setActive((current) => (current + 1) % eventCards.length);
  const previous = () => setActive((current) => (current - 1 + eventCards.length) % eventCards.length);
  const visible = [0, 1, 2].map((offset) => eventCards[(active + offset) % eventCards.length]);

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 rounded-lg bg-berry px-3 py-2 text-sm font-extrabold uppercase tracking-wide text-white">
          <CalendarDays aria-hidden="true" size={16} />
          Highlights
        </p>
        <div className="flex gap-2">
          <button className="focus-ring carousel-control" type="button" aria-label="Previous event" onClick={previous}>
            <ArrowLeft aria-hidden="true" size={18} />
          </button>
          <button className="focus-ring carousel-control" type="button" aria-label="Next event" onClick={next}>
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3" aria-live="polite">
        {visible.map((event) => (
          <EventCard key={`${active}-${event.path}`} item={event} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

export function GallerySlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % gallerySlides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  const slide = gallerySlides[active];
  const next = () => setActive((current) => (current + 1) % gallerySlides.length);
  const previous = () => setActive((current) => (current - 1 + gallerySlides.length) % gallerySlides.length);

  return (
    <section className="reveal-on-scroll mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Gallery"
            title="Colourful Moments Around The Park"
            text="A rotating set of Woodlands images showing rides, animals, events and family spaces around the park."
          />
          <div className="mt-6 flex gap-2">
            <button className="focus-ring carousel-control" type="button" aria-label="Previous gallery image" onClick={previous}>
              <ArrowLeft aria-hidden="true" size={18} />
            </button>
            <button className="focus-ring carousel-control" type="button" aria-label="Next gallery image" onClick={next}>
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border-4 border-white bg-white shadow-lift">
          <img className="aspect-[16/10] w-full object-cover" src={image(slide.image)} alt={slide.alt} />
          <div className="grid grid-cols-6 gap-1 bg-white p-2">
            {gallerySlides.map((item, index) => (
              <button
                key={item.image}
                className={`focus-ring overflow-hidden rounded-md border-2 ${
                  index === active ? "border-ember" : "border-transparent"
                }`}
                type="button"
                aria-label={`Show gallery image ${index + 1}`}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
              >
                <img className="aspect-square w-full object-cover" src={image(item.image)} alt={item.alt} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
