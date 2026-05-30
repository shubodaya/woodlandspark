import { useState } from "react";
import { ChevronDown, Menu, Ticket, X } from "lucide-react";
import { bookingUrl, navItems } from "../data/siteData.js";
import { image } from "../data/assets.js";
import { AppLink } from "./Link.jsx";

export function Navbar({ onNavigate, currentPath }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState("");

  const navigate = (path) => {
    setMobileOpen(false);
    setOpenGroup("");
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b-4 border-sunshine bg-white/95 shadow-sm backdrop-blur">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <AppLink
          href="/"
          onNavigate={navigate}
          className="focus-ring flex items-center gap-3 rounded-lg"
          aria-label="Woodlands home"
        >
          <img className="h-14 w-14 rounded-lg object-cover" src={image("logo/woodlands-logo-circle.jpg")} alt="Woodlands logo" />
          <span className="hidden font-display text-xl font-black text-ink sm:block">
            Woodlands
          </span>
        </AppLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <div className="nav-group relative" key={item.label}>
              <AppLink
                href={item.path}
                onNavigate={navigate}
                className={`focus-ring flex items-center gap-1 rounded-lg px-3 py-3 text-sm font-extrabold uppercase tracking-wide transition hover:bg-mist ${
                  currentPath === item.path ? "text-berry" : "text-ink"
                }`}
              >
                {item.label}
                {item.children.length > 0 && <ChevronDown aria-hidden="true" size={16} />}
              </AppLink>
              {item.children.length > 0 && (
                <div className="mega invisible absolute left-1/2 top-full w-[min(900px,calc(100vw-48px))] -translate-x-1/2 translate-y-2 rounded-lg border border-sky/30 bg-white p-4 opacity-0 shadow-lift transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 nav-group-hover:visible">
                  <div className="grid grid-cols-3 gap-3">
                    {item.children.map((child) => (
                      <AppLink
                        key={child.path}
                        href={child.path}
                        onNavigate={navigate}
                        className="focus-ring rounded-lg border border-slate-100 bg-mist px-3 py-3 text-sm font-bold text-ink transition hover:border-sky hover:bg-white hover:text-berry"
                      >
                        {child.title}
                      </AppLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <AppLink
            className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-lg bg-ember px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button transition hover:-translate-y-0.5 hover:bg-berry"
            href={bookingUrl}
            onNavigate={navigate}
          >
            <Ticket aria-hidden="true" size={18} />
            Tickets
          </AppLink>
        </div>

        <button
          className="focus-ring inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg border-2 border-ink bg-white text-ink lg:hidden"
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <AppLink
                    href={item.path}
                    onNavigate={navigate}
                    className="focus-ring flex-1 rounded-lg px-4 py-3 font-extrabold text-ink"
                  >
                    {item.label}
                  </AppLink>
                  {item.children.length > 0 && (
                    <button
                      className="focus-ring mr-1 min-h-11 min-w-11 rounded-lg text-ink"
                      type="button"
                      aria-label={`Toggle ${item.label} menu`}
                      aria-expanded={openGroup === item.label}
                      onClick={() => setOpenGroup(openGroup === item.label ? "" : item.label)}
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className={`mx-auto transition ${openGroup === item.label ? "rotate-180" : ""}`}
                        size={18}
                      />
                    </button>
                  )}
                </div>
                {openGroup === item.label && (
                  <div className="grid gap-1 border-t border-slate-100 p-2">
                    {item.children.map((child) => (
                      <AppLink
                        key={child.path}
                        href={child.path}
                        onNavigate={navigate}
                        className="focus-ring rounded-lg bg-mist px-4 py-3 text-sm font-bold"
                      >
                        {child.title}
                      </AppLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <AppLink
              className="focus-ring mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-ember px-4 py-3 font-extrabold uppercase tracking-wide text-white shadow-button"
              href={bookingUrl}
              onNavigate={navigate}
            >
              <Ticket aria-hidden="true" size={18} />
              Book Tickets
            </AppLink>
          </div>
        </nav>
      )}
    </header>
  );
}
