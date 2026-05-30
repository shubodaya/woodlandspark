import { useEffect, useMemo, useState } from "react";
import { HelpCircle, Search } from "lucide-react";
import { faqGroups as fallbackFaqGroups, faqSource } from "../data/faqs/faqs.js";
import { apiRequest } from "../lib/api.js";
import { CtaButton } from "./Button.jsx";
import { DocumentLinks } from "./DocumentLinks.jsx";
import { SectionHeading } from "./Sections.jsx";

export function FaqPage({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [faqGroups, setFaqGroups] = useState(fallbackFaqGroups);
  const search = query.trim().toLowerCase();

  useEffect(() => {
    let isMounted = true;
    apiRequest("/faqs")
      .then((data) => {
        const groups = data.faqGroups || data.groups;
        if (isMounted && groups?.length) setFaqGroups(groups);
      })
      .catch(() => {
        if (isMounted) setFaqGroups(fallbackFaqGroups);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredGroups = useMemo(() => {
    if (!search) return faqGroups;
    return faqGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          `${group.title} ${item.question} ${item.answer}`.toLowerCase().includes(search),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [faqGroups, search]);

  const total = filteredGroups.reduce((count, group) => count + group.items.length, 0);

  return (
    <>
      <section className="section-band bg-woodpink py-14 text-white">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <p className="inline-flex items-center gap-2 rounded-lg bg-sunshine px-3 py-2 text-sm font-black uppercase tracking-wide text-ink">
            <HelpCircle aria-hidden="true" size={18} />
            FAQs
          </p>
          <h1 className="mt-5 font-display text-5xl font-black leading-tight sm:text-6xl">{faqSource.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/90">
            Frequently Asked Questions
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <CtaButton href="/tickets" onNavigate={onNavigate} icon="ticket">
              Tickets
            </CtaButton>
            <CtaButton href="/visiting/contact-find-us" onNavigate={onNavigate} variant="secondary">
              Contact Us
            </CtaButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <SectionHeading
          eyebrow="Help"
          title="Search The FAQs"
          text={`${faqSource.totalQuestions} questions and answers in a searchable accordion.`}
        />
        <label className="mt-6 flex max-w-2xl items-center gap-3 rounded-lg border-2 border-sunshine bg-white px-4 py-3 shadow-sm">
          <Search aria-hidden="true" className="shrink-0 text-berry" />
          <span className="sr-only">Search FAQs</span>
          <input
            className="min-h-10 flex-1 border-0 bg-transparent text-base outline-none"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tickets, food, rides, groups..."
          />
        </label>

        <p className="mt-4 text-sm font-bold text-slate-700">{total} matching questions</p>

        <div className="mt-8 grid gap-8">
          {filteredGroups.map((group) => (
            <section key={group.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-display text-3xl font-black text-ink">{group.title}</h2>
              <div className="mt-5 grid gap-3">
                {group.items.map((item, index) => (
                  <details key={item.question} className="rounded-lg border border-slate-200 bg-mist p-4" open={!search && index === 0}>
                    <summary className="cursor-pointer font-display text-xl font-black text-ink">{item.question}</summary>
                    <div className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{item.answer}</div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
      <DocumentLinks path="/visiting/faqs" title="Helpful Downloads" />
    </>
  );
}
