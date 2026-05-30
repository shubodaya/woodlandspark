import { useEffect, useMemo, useState } from "react";
import { Cake, CalendarDays, Map, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import {
  allPages,
  bookingUrl,
  explorePages,
  footerPages,
  newsPosts,
  overviewPages,
  pageMap,
  seoDefaults,
  testimonials,
  visitingPages,
  zooPages,
} from "./data/siteData.js";
import { image } from "./data/assets.js";
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { Hero } from "./components/Hero.jsx";
import { CtaButton } from "./components/Button.jsx";
import { AttractionCard, ContactStrip, EventCard, NewsCard, TestimonialCard } from "./components/Cards.jsx";
import { GallerySection, HighlightList, ContentSection, SectionHeading } from "./components/Sections.jsx";
import { NewsletterForm } from "./components/NewsletterForm.jsx";
import { PageHeader } from "./components/PageHeader.jsx";
import { EventHighlightCarousel, GallerySlider, PromoBanner } from "./components/HomeEnhancements.jsx";
import { FoodMenuBrowser } from "./components/FoodMenuBrowser.jsx";
import { PortalRoute } from "./components/PortalRoutes.jsx";
import { BirthdayPartiesPage } from "./components/BirthdayPartiesPage.jsx";
import { FaqPage } from "./components/FaqPage.jsx";
import { TicketingFlow } from "./components/TicketingFlow.jsx";
import { FooterCtaBanners } from "./components/FooterCtaBanners.jsx";
import { OpeningTimesPage } from "./components/OpeningTimesPage.jsx";
import { NewsletterPage } from "./components/NewsletterPage.jsx";
import { DocumentLinks } from "./components/DocumentLinks.jsx";

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function useRoute() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to) => {
    const next = normalizePath(to);
    if (next !== path) {
      window.history.pushState({}, "", next);
      setPath(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return [path, navigate];
}

function useSeo(page, noIndex = false) {
  useEffect(() => {
    const title = page?.title ? `${page.title} | Woodlands Family Theme Park` : seoDefaults.title;
    const description = page?.summary || seoDefaults.description;
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", noIndex ? "noindex, nofollow" : "index, follow");
  }, [page, noIndex]);
}

function useScrollReveal(path) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal-on-scroll"));
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [path]);
}

function HomePage({ onNavigate }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <PromoBanner onNavigate={onNavigate} />
      <section className="rainbow-ribbon reveal-on-scroll bg-woodpink py-7 text-white">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:grid-cols-2 lg:grid-cols-5 lg:px-6">
          {[
            { icon: Ticket, title: "Tickets", text: "Book online before the day for 30% off.", href: "/tickets" },
            { icon: CalendarDays, title: "Opening Times", text: "Check the 2026 calendar and off-peak ride closures.", href: "/visiting/opening-times" },
            { icon: Map, title: "Park Map", text: "Use the printable map to plan the day.", href: "/visiting/park-map" },
            { icon: Cake, title: "Birthday Parties", text: "Party rooms, hot meals and a full day of park fun.", href: "/visiting/birthday-parties" },
            { icon: ShieldCheck, title: "Accessibility", text: "Plan parking, paths, toilets and assistance dog access.", href: "/visiting/accessibility" },
          ].map((item) => (
            <button
              key={item.title}
              type="button"
              className="focus-ring card-hover rounded-lg border-2 border-white/40 bg-white p-4 text-left text-ink"
              onClick={() => onNavigate(item.href)}
            >
              <item.icon aria-hidden="true" className="text-berry" />
              <h2 className="mt-3 font-display text-xl font-black text-ink">{item.title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-700">{item.text}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="reveal-on-scroll mx-auto max-w-7xl rounded-lg bg-white/95 px-4 py-14 shadow-lift lg:px-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Events & Offers" title="Plan Around The Big Days" text="Special guest events, seasonal offers and character days for family visits." />
          <CtaButton href="/events" onNavigate={onNavigate} variant="secondary" icon="calendar">
            All Events
          </CtaButton>
        </div>
        <EventHighlightCarousel onNavigate={onNavigate} />
      </section>

      <section className="section-band rainbow-ribbon reveal-on-scroll bg-plum py-14 text-white">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <div className="[&_.text-berry]:text-sunshine [&_.text-ink]:text-white [&_.text-slate-700]:text-white/85">
            <SectionHeading eyebrow="Explore" title="Rides, Zones And Indoor Play" text="A full set of attraction zones for adventurous Woodlands days." align="center" />
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {explorePages.slice(0, 6).map((item) => (
              <AttractionCard key={item.path} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      <GallerySlider />

      <section className="reveal-on-scroll mx-auto grid max-w-7xl gap-6 px-4 py-14 lg:grid-cols-2 lg:px-6">
        <FeaturePanel
          eyebrow="Zoo Farm"
          title="Meet Animals Across The 8-Acre Zoo Farm"
          text="Animal activities, big farm animals, furry friends, the Reptile House, Nocturnal House and Zoo Farm rides are all part of the Woodlands Zoo Farm."
          imageName="zoo-farm.jpg"
          alt="Meerkat at Woodlands Zoo Farm"
          href="/zoo-farm"
          onNavigate={onNavigate}
        />
        <FeaturePanel
          eyebrow="Camping"
          title="Stay Close To The Adventure"
          text="Woodlands camping in Devon is promoted from only £38.50 per night, with theme park entry included for campers."
          imageName="camping.jpg"
          alt="Woodlands camping pitch"
          href="/visiting/family-camping"
          onNavigate={onNavigate}
        />
      </section>

      <section className="reveal-on-scroll bg-ink py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 lg:grid-cols-[1fr_1fr_1fr] lg:px-6">
          <CtaPanel icon={Ticket} title="Book Tickets" text="Online tickets are already discounted by 10% to 30%." href={bookingUrl} />
          <CtaPanel icon={CalendarDays} title="Opening Times" text="Check fully open, off-peak and closed dates before travelling." href="/visiting/opening-times" onNavigate={onNavigate} />
          <CtaPanel icon={Map} title="Park Map" text="Preview the park layout, rides, Zoo Farm, food stops and facilities." href="/visiting/park-map" onNavigate={onNavigate} />
        </div>
      </section>

      <section className="reveal-on-scroll mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <SectionHeading eyebrow="Guest Voices" title="Testimonials" text="Guest comments from families who have visited Woodlands." />
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <TestimonialCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="section-band reveal-on-scroll bg-leaf/10 py-14">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="Latest News" title="From The Woodlands Blog" text="Recent blog posts and park updates for families planning a visit." />
            <CtaButton href="/blog" onNavigate={onNavigate} variant="secondary">
              Read News
            </CtaButton>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {newsPosts.map((post) => (
              <NewsCard key={post.path} item={post} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      <NewsletterForm />
    </>
  );
}

function FeaturePanel({ eyebrow, title, text, imageName, alt, href, onNavigate }) {
  return (
    <article className="card-hover overflow-hidden rounded-lg border border-slate-200 bg-white">
      <img className="aspect-[16/10] w-full object-cover" src={image(imageName)} alt={alt} loading="lazy" />
      <div className="p-5">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-berry">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-black text-ink">{title}</h2>
        <p className="mt-3 leading-7 text-slate-700">{text}</p>
        <CtaButton href={href} onNavigate={onNavigate} className="mt-5" variant="secondary">
          Explore
        </CtaButton>
      </div>
    </article>
  );
}

function CtaPanel({ icon: Icon, title, text, href, onNavigate }) {
  const inner = (
    <>
      <Icon aria-hidden="true" className="text-sunshine" />
      <h2 className="mt-3 font-display text-2xl font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-white/80">{text}</p>
    </>
  );

  if (href.startsWith("http")) {
    return (
      <a className="focus-ring rounded-lg border border-white/15 bg-white/10 p-5 transition hover:bg-white/15" href={href} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <button className="focus-ring rounded-lg border border-white/15 bg-white/10 p-5 text-left transition hover:bg-white/15" type="button" onClick={() => onNavigate(href)}>
      {inner}
    </button>
  );
}

function GenericPage({ page, onNavigate }) {
  const isEvents = page.path === "/events";
  const isBlog = page.path === "/blog";
  const isFoodDrink = page.path === "/visiting/food-drink";

  return (
    <>
      <PageHeader page={page} onNavigate={onNavigate} />
      <div>
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <img className="aspect-[4/3] w-full rounded-lg border border-slate-200 object-cover shadow-sm" src={image(page.image)} alt={page.alt || page.title} />
              {page.externalCta && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    className="focus-ring inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-ink hover:border-sky hover:text-berry"
                    href={page.externalCta.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {page.externalCta.label}
                  </a>
                </div>
              )}
            </div>
            <div>
              <SectionHeading eyebrow="Key Information" title={page.title} text={page.summary} />
              <div className="mt-6">
                <HighlightList items={page.highlights} />
              </div>
            </div>
          </div>
        </section>

        {page.sections?.length > 0 && (
          <section className="section-band bg-sky/10 py-12">
            <div className="relative mx-auto grid max-w-7xl gap-5 px-4 md:grid-cols-2 lg:px-6">
              {page.sections.map((section) => (
                <ContentSection key={section.title} section={section} />
              ))}
            </div>
          </section>
        )}

        {isFoodDrink && <FoodMenuBrowser />}

        <DocumentLinks path={page.path} sourceUrl={page.sourceUrl} />

        {page.cards?.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
            <SectionHeading eyebrow={isEvents ? "Calendar" : isBlog ? "News" : "Explore More"} title={isEvents ? "Events And Offers" : isBlog ? "Latest Stories" : "Related Pages"} />
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {page.cards.map((item) =>
                isEvents ? (
                  <EventCard key={item.path} item={item} onNavigate={onNavigate} />
                ) : isBlog ? (
                  <NewsCard key={item.path} item={item} onNavigate={onNavigate} />
                ) : (
                  <AttractionCard key={item.path} item={item} onNavigate={onNavigate} />
                ),
              )}
            </div>
          </section>
        )}

        <GallerySection images={page.gallery || []} alt={page.alt || page.title} />

        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <ContactStrip />
        </section>
      </div>
    </>
  );
}

function NotFound({ onNavigate }) {
  const suggestions = useMemo(() => overviewPages.slice(0, 4), []);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <Sparkles aria-hidden="true" className="text-berry" />
        <h1 className="mt-4 font-display text-4xl font-black text-ink">Page Not Found</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-700">
          The page could not be found.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {suggestions.map((page) => (
            <CtaButton key={page.path} href={page.path} onNavigate={onNavigate} variant="secondary">
              {page.title}
            </CtaButton>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [path, navigate] = useRoute();
  const [ticketSession, setTicketSession] = useState({ user: null, selection: null, booking: null, confirmationRef: "" });
  const ticketModes = {
    "/tickets": "overview",
    "/visiting/tickets": "overview",
    "/tickets/login": "login",
    "/tickets/register": "register",
    "/tickets/select": "select",
    "/tickets/checkout": "checkout",
    "/tickets/confirmation": "confirmation",
    "/tickets/account": "account",
  };
  const portalRoutes = {
    "/admin": "admin",
    "/admin/setup": "adminSetup",
    "/shifts": "shiftRedirect",
    "/foodorder": "foodorder",
    "/staff": "staff",
    "/staff/rota": "staff",
    "/staff/rota/calendar": "staff",
    "/staff/rota/shifts": "staff",
    "/staff/rota/assignments": "staff",
  };
  const page = path === "/" || ticketModes[path] || portalRoutes[path] || path === "/newsletter" ? null : pageMap[path];
  const specialSeo =
    ticketModes[path]
      ? { title: "Tickets", summary: "Choose Woodlands tickets, review your reservation request and manage your ticket account." }
      : portalRoutes[path]
        ? {
            title: portalRoutes[path] === "shiftRedirect" ? "Staff Rota" : portalRoutes[path] === "adminSetup" ? "Admin Setup" : `${portalRoutes[path][0].toUpperCase()}${portalRoutes[path].slice(1)} Portal`,
            summary: "Secure Woodlands staff and operations area.",
          }
        : path === "/newsletter"
          ? { title: "Newsletter", summary: "Sign up for Woodlands news, offers and events." }
          : path === "/visiting/opening-times"
            ? pageMap["/visiting/opening-times"]
            : path === "/visiting/birthday-parties"
          ? pageMap["/visiting/birthday-parties"]
          : path === "/visiting/faqs"
            ? pageMap["/visiting/faqs"]
            : null;
  const protectedRoute = Boolean(portalRoutes[path]) || path.startsWith("/tickets/login") || path.startsWith("/tickets/register") || path.startsWith("/tickets/account") || path.startsWith("/tickets/checkout");
  useSeo(page || specialSeo, protectedRoute);
  useScrollReveal(path);

  const ticketMode = ticketModes[path];
  const portalType = portalRoutes[path];
  const hideMarketingBanners = Boolean(portalType) || ["/tickets/login", "/tickets/register", "/tickets/checkout"].includes(path);

  return (
    <div className="min-h-screen">
      <Navbar onNavigate={navigate} currentPath={path} />
      <main id="main-content">
        {path === "/" ? (
          <HomePage onNavigate={navigate} />
        ) : portalType ? (
          <PortalRoute type={portalType} path={path} onNavigate={navigate} />
        ) : ticketMode ? (
          <TicketingFlow mode={ticketMode} onNavigate={navigate} session={ticketSession} setSession={setTicketSession} />
        ) : path === "/newsletter" ? (
          <NewsletterPage />
        ) : path === "/visiting/opening-times" ? (
          <OpeningTimesPage onNavigate={navigate} />
        ) : path === "/visiting/birthday-parties" ? (
          <BirthdayPartiesPage onNavigate={navigate} />
        ) : path === "/visiting/faqs" ? (
          <FaqPage onNavigate={navigate} />
        ) : page ? (
          <GenericPage page={page} onNavigate={navigate} />
        ) : (
          <NotFound onNavigate={navigate} />
        )}
      </main>
      {!hideMarketingBanners && <FooterCtaBanners onNavigate={navigate} />}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export { allPages, footerPages, visitingPages, zooPages };
