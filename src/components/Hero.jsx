import { useEffect, useState } from "react";
import { Gift, Sparkles, Ticket } from "lucide-react";
import { heroSlides } from "../data/siteData.js";
import { image } from "../data/assets.js";
import { CtaButton } from "./Button.jsx";

export function Hero({ onNavigate }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = heroSlides[activeSlide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="hero-play hero-frame relative isolate overflow-hidden bg-ink text-white">
      {heroSlides.map((slide, index) => (
        <img
          key={slide.image}
          className={`hero-bg-slide absolute inset-0 -z-10 transition-opacity duration-1000 ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
          src={image(slide.image)}
          alt={slide.alt}
          aria-hidden={index !== activeSlide}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={index === 0 ? "high" : "auto"}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/70 to-ink/10" />
      <div className="hero-shape hero-shape-a" aria-hidden="true" />
      <div className="hero-shape hero-shape-b" aria-hidden="true" />
      <div className="hero-shape hero-shape-c" aria-hidden="true" />
      <img
        className="hero-mascot hero-mascot-left"
        src={image("old-site/hero-girl.png")}
        alt=""
        aria-hidden="true"
      />
      <img
        className="hero-mascot hero-mascot-right"
        src={image("old-site/hero-boy.png")}
        alt=""
        aria-hidden="true"
      />
      <div className="hero-content-frame mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-6">
        <div className="max-w-3xl reveal">
          <p className="hero-kicker-lock inline-flex rounded-lg bg-sunshine px-3 py-2 text-sm font-extrabold uppercase tracking-[0.16em] text-ink">
            {slide.kicker}
          </p>
          <h1 className="hero-title-lock mt-5 font-display text-5xl font-black leading-none sm:text-6xl lg:text-7xl">
            {slide.title}
          </h1>
          <p className="hero-text-lock mt-5 max-w-2xl text-lg leading-8 text-white/92">
            {slide.text}
          </p>
          <div className="hero-actions-lock mt-8 flex flex-wrap gap-3">
            <CtaButton href={slide.ctaHref} onNavigate={onNavigate} icon="ticket">
              {slide.ctaLabel}
            </CtaButton>
            <CtaButton href="/visiting/park-map" onNavigate={onNavigate} variant="secondary" icon="map">
              Park Map
            </CtaButton>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["8-acre", "Zoo Farm"],
              ["30%", "Advance online ticket saving"],
              ["01803 712598", "Reception team"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/25 bg-white/12 p-4 backdrop-blur">
                <p className="font-display text-2xl font-black text-sunshine">{value}</p>
                <p className="mt-1 text-sm font-bold text-white/90">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-promo-card reveal hidden overflow-hidden rounded-lg border-4 border-white bg-white text-ink shadow-lift lg:grid">
          <div className="hero-promo-media relative">
            <img
              src={image(slide.image)}
              alt={slide.alt}
              loading="eager"
              decoding="async"
            />
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg bg-sunshine px-3 py-2 text-sm font-black uppercase tracking-wide">
              <Sparkles aria-hidden="true" size={16} />
              Featured
            </div>
          </div>
          <div className="hero-promo-copy bg-gradient-to-r from-woodpink to-berry p-5 text-white">
            <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.16em] text-sunshine">
              <Gift aria-hidden="true" size={16} />
              Woodlands Highlight
            </p>
            <h2 className="hero-promo-title mt-2 font-display text-3xl font-black leading-tight">{slide.title}</h2>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="mt-7 flex gap-2" aria-label="Homepage slideshow">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.image}
                className={`focus-ring h-3 rounded-full transition ${
                  index === activeSlide ? "w-9 bg-sunshine" : "w-3 bg-white/60 hover:bg-white"
                }`}
                type="button"
                aria-label={`Show slide ${index + 1}: ${slide.kicker}`}
                aria-pressed={index === activeSlide}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 hidden rounded-lg bg-white/90 p-3 text-ink shadow-lift md:flex md:items-center md:gap-2">
        <Ticket aria-hidden="true" size={18} />
        <span className="text-sm font-extrabold">Book online before the day for 30% off</span>
      </div>
      <div className="absolute bottom-0 left-0 h-2 w-full bg-gradient-to-r from-sunshine via-ember to-leaf" />
    </section>
  );
}
