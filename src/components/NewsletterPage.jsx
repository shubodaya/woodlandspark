import { Mail, Sparkles } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm.jsx";

export function NewsletterPage() {
  return (
    <>
      <section className="section-band bg-woodpink py-14 text-white">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <p className="inline-flex items-center gap-2 rounded-lg bg-sunshine px-3 py-2 text-sm font-black uppercase tracking-wide text-ink">
            <Mail aria-hidden="true" size={18} />
            Newsletter
          </p>
          <h1 className="mt-5 font-display text-5xl font-black leading-tight sm:text-6xl">
            Never Miss an Offer
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/90">
            Sign up to our newsletter here for all the latest events and offers throughout the year.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/12 px-4 py-3 text-sm font-bold">
            <Sparkles aria-hidden="true" className="text-sunshine" size={18} />
            Sign up to our newsletter to hear all the latest news and more information on our birthday celebrations.
          </p>
        </div>
      </section>
      <NewsletterForm />
    </>
  );
}
