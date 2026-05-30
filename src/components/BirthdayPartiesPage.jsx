import { Cake, CheckCircle2, Phone, Sparkles } from "lucide-react";
import {
  birthdayDaySteps,
  birthdayFaqs,
  birthdayFoodMenu,
  birthdayIncluded,
  birthdayInformation,
  birthdayPackages,
  birthdaySource,
} from "../data/birthday/birthdayParties.js";
import { image } from "../data/assets.js";
import { CtaButton } from "./Button.jsx";
import { DocumentLinks } from "./DocumentLinks.jsx";
import { SectionHeading } from "./Sections.jsx";

const page = {
  path: "/visiting/birthday-parties",
  title: birthdaySource.title,
  summary:
    "All parties include a full day of rides and attractions in the park, a themed party room, hot meal options and a free return ticket for the birthday child.",
};

export function BirthdayPartiesPage({ onNavigate }) {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-woodpink text-white">
        <img className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" src={image(birthdaySource.image)} alt={birthdaySource.alt} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-plum via-woodpink/88 to-woodpink/55" />
        <div className="hero-shape hero-shape-a" aria-hidden="true" />
        <div className="hero-shape hero-shape-b" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-6 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-lg bg-sunshine px-3 py-2 text-sm font-black uppercase tracking-wide text-ink">
              <Cake aria-hidden="true" size={18} />
              Birthday Parties
            </p>
            <h1 className="mt-5 font-display text-5xl font-black leading-tight sm:text-6xl">{page.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/92">{page.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-lg bg-sunshine px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-ink shadow-button transition hover:-translate-y-0.5 hover:bg-ember hover:text-white" href="tel:+441803712598">
                <Phone aria-hidden="true" size={18} />
                Call 01803 712598
              </a>
              <CtaButton href="/visiting/opening-times" onNavigate={onNavigate} variant="secondary" icon="calendar">
                Opening Schedule
              </CtaButton>
            </div>
          </div>
          <div className="rounded-lg border-4 border-white bg-white p-5 text-ink shadow-lift">
            <p className="inline-flex items-center gap-2 rounded-lg bg-woodpink px-3 py-2 text-sm font-black uppercase tracking-wide text-white">
              <Sparkles aria-hidden="true" size={16} />
              What’s included?
            </p>
            <ul className="mt-5 grid gap-3">
              {birthdayIncluded.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-leaf" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-sunshine via-ember to-sky" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <SectionHeading
          eyebrow="Prices"
          title="Birthday Party Packages"
          text="Birthday Parties can be booked during the Main Season, Summer Holidays, Off-Peak Days and Winter. On Off-Peak and Winter days the following rides will be closed: Watercoasters, Toboggan Run, Pedal Boats, Bumper Boats, Trolls Maze, Arctic Gliders, Dune Buggies, Avalanche, Jumping Pillow and Safari Adventure Golf."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {birthdayPackages.map((pack) => (
            <article key={pack.title} className="card-hover rounded-lg border-2 border-sunshine bg-white p-5 shadow-sm">
              <h2 className="font-display text-2xl font-black text-ink">{pack.title}</h2>
              <ul className="mt-4 grid gap-3">
                {pack.prices.map((price) => (
                  <li key={price} className="rounded-lg bg-woodpink px-4 py-3 font-display text-xl font-black text-white">
                    {price}
                  </li>
                ))}
              </ul>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
                {pack.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
                <p className="rounded-lg bg-sunshine/35 p-3 font-bold text-ink">{pack.dates}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band bg-plum py-12 text-white">
        <div className="relative mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-3 lg:px-6">
          <InfoList title="Birthday Party Information" items={birthdayInformation} />
          <InfoList
            title="Food Menu"
            items={[
              ...birthdayFoodMenu,
              "All meals are served with a selection of Peas or Baked Beans, Ice Lolly & Soft Drink.",
              "Bringing a birthday cake? Give it to us at the start of the day and we can serve it in the birthday room after your meal.",
            ]}
          />
          <InfoList title="How to book & what to do on the day" items={birthdayDaySteps} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <SectionHeading eyebrow="Birthday Party FAQs" title="Important Notes" />
        <div className="mt-6 grid gap-3">
          {birthdayFaqs.map((item) => (
            <details key={item.question} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-display text-xl font-black text-ink">{item.question}</summary>
              <p className="mt-3 text-sm leading-6 text-slate-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 lg:px-6">
        <div className="rounded-lg border-2 border-sunshine bg-woodpink p-6 text-white shadow-lift">
          <h2 className="font-display text-3xl font-black">Ready to book a birthday party?</h2>
          <p className="mt-2 max-w-3xl leading-7 text-white/90">
            Please call our friendly Reception Team on 01803 712598 to book.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-lg bg-sunshine px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-ink shadow-button transition hover:-translate-y-0.5" href="tel:+441803712598">
              <Phone aria-hidden="true" size={18} />
              01803 712598
            </a>
            <CtaButton href="/visiting/faqs" onNavigate={onNavigate} variant="secondary">
              Read FAQs
            </CtaButton>
          </div>
        </div>
      </section>

      <DocumentLinks path="/visiting/birthday-parties" title="Birthday Party Downloads" />
    </>
  );
}

function InfoList({ title, items }) {
  return (
    <article className="rounded-lg border border-white/20 bg-white p-5 text-ink shadow-lift">
      <h2 className="font-display text-2xl font-black">{title}</h2>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-leaf" size={18} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
