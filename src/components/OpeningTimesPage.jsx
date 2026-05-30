import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Clock } from "lucide-react";
import {
  buildMonthDays,
  openingLegend,
  openingMonths,
  openingTimesSource,
} from "../data/openingTimes.js";
import { image } from "../data/assets.js";
import { apiRequest } from "../lib/api.js";
import { CtaButton } from "./Button.jsx";
import { DocumentLinks } from "./DocumentLinks.jsx";
import { SectionHeading } from "./Sections.jsx";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const statusLabel = {
  main: "Main Season",
  "off-peak": "Off Peak Weekdays",
  winter: "Winter Fun",
  closed: "Park Closed",
};

export function OpeningTimesPage({ onNavigate }) {
  const [activeMonth, setActiveMonth] = useState(0);
  const [statusMap, setStatusMap] = useState({});
  const month = openingMonths[activeMonth];
  const days = useMemo(
    () =>
      buildMonthDays(month).map((day) =>
        day.blank ? day : { ...day, status: statusMap[day.id] || day.status },
      ),
    [month, statusMap],
  );

  useEffect(() => {
    let isMounted = true;
    apiRequest("/opening-times")
      .then((data) => {
        if (!isMounted) return;
        setStatusMap(Object.fromEntries((data.openingTimes || []).map((row) => [row.date, row.status])));
      })
      .catch(() => undefined);
    return () => {
      isMounted = false;
    };
  }, []);

  const moveMonth = (direction) => {
    setActiveMonth((current) => {
      const next = current + direction;
      if (next < 0) return openingMonths.length - 1;
      if (next >= openingMonths.length) return 0;
      return next;
    });
  };

  return (
    <>
      <section className="opening-hero section-band bg-woodpink py-14 text-white">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <p className="inline-flex items-center gap-2 rounded-lg bg-sunshine px-3 py-2 text-sm font-black uppercase tracking-wide text-ink">
            <CalendarDays aria-hidden="true" size={18} />
            Opening Times
          </p>
          <h1 className="mt-5 font-display text-5xl font-black leading-tight sm:text-6xl">
            Plan Your Woodlands Day
          </h1>
          <div className="mt-5 grid max-w-4xl gap-3">
            {openingTimesSource.openingText.map((line) => (
              <p key={line} className="flex gap-3 rounded-lg border border-white/20 bg-white/12 p-4 text-base font-bold leading-7 text-white">
                <Clock aria-hidden="true" className="mt-1 shrink-0 text-sunshine" size={18} />
                {line}
              </p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <CtaButton href="/tickets" onNavigate={onNavigate} icon="ticket">
              Book Tickets
            </CtaButton>
            <CtaButton href="/visiting/park-map" onNavigate={onNavigate} variant="secondary" icon="map">
              Park Map
            </CtaButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="opening-calendar-shell">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <button
              className="carousel-control"
              type="button"
              aria-label="Previous month"
              onClick={() => moveMonth(-1)}
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-berry">2026 Calendar</p>
              <h2 className="font-display text-5xl font-black text-ink">{month.label}</h2>
            </div>
            <button
              className="carousel-control"
              type="button"
              aria-label="Next month"
              onClick={() => moveMonth(1)}
            >
              <ArrowRight aria-hidden="true" />
            </button>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.42fr]">
            <div>
              <div className="opening-weekdays" aria-hidden="true">
                {weekdays.map((weekday) => (
                  <span key={weekday}>{weekday}</span>
                ))}
              </div>
              <div className="opening-days" aria-label={`${month.label} opening calendar`}>
                {days.map((day) =>
                  day.blank ? (
                    <span key={day.id} className="opening-day-blank" aria-hidden="true" />
                  ) : (
                    <div key={day.id} className={`opening-day opening-day-${day.status}`}>
                      <span className="opening-day-number">{day.day}</span>
                      <span className="sr-only">
                        {day.day} {month.label}: {statusLabel[day.status]}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <aside className="rounded-lg border-2 border-sunshine bg-white p-4 text-ink shadow-lift">
              <h3 className="font-display text-2xl font-black">Colour Key</h3>
              <div className="mt-4 grid gap-3">
                {openingLegend.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm font-black">
                    <span className={`opening-legend-dot ${item.className}`} aria-hidden="true" />
                    {item.label}
                  </div>
                ))}
              </div>
              <img
                className="mt-5 w-full rounded-lg border border-slate-200 object-cover"
                src={image(openingTimesSource.calendarImages[activeMonth])}
                alt={`${month.label} Woodlands opening calendar`}
                loading="lazy"
              />
            </aside>
          </div>
        </div>
      </section>

      <section className="section-band bg-plum py-12 text-white">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <div className="[&_.text-berry]:text-sunshine [&_.text-ink]:text-white [&_.text-slate-700]:text-white/85">
            <SectionHeading eyebrow="Important Notes" title="Opening Times Information" />
          </div>
          <div className="mt-6 grid gap-3">
            {openingTimesSource.oldPageText.map((line) => (
              <p key={line} className="rounded-lg border border-white/15 bg-white p-4 text-sm font-bold leading-7 text-ink shadow-sm">
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      <DocumentLinks path="/visiting/opening-times" title="Opening Calendar Download" />
    </>
  );
}
