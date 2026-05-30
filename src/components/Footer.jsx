import { Mail, MapPin, Phone } from "lucide-react";
import { footerLinks, footerParkLogos, socialLinks } from "../data/siteData.js";
import { image } from "../data/assets.js";
import { AppLink } from "./Link.jsx";

export function Footer({ onNavigate }) {
  return (
    <footer className="bg-ink text-white">
      <div className="h-2 bg-gradient-to-r from-sunshine via-ember to-sky" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-6">
        <div>
          <img className="h-20 w-20 rounded-lg object-cover" src={image("logo/woodlands-logo-circle.jpg")} alt="Woodlands logo" />
          <h2 className="mt-4 font-display text-3xl font-black">Woodlands Family Theme Park</h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-white/85">
            <p className="flex gap-2">
              <MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-sunshine" size={18} />
              Woodlands Leisure Park, Blackawton, Totnes, South Devon, TQ9 7DQ
            </p>
            <a className="focus-ring flex gap-2 rounded-lg hover:text-sunshine" href="tel:+441803712598">
              <Phone aria-hidden="true" className="mt-0.5 shrink-0 text-sunshine" size={18} />
              01803 712598
            </a>
            <a className="focus-ring flex gap-2 rounded-lg hover:text-sunshine" href="mailto:fun@woodlandspark.com">
              <Mail aria-hidden="true" className="mt-0.5 shrink-0 text-sunshine" size={18} />
              fun@woodlandspark.com
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-display text-xl font-black">Useful Links</h3>
          <ul className="mt-4 grid gap-2">
            {footerLinks.map((link) => (
              <li key={link.path}>
                <AppLink
                  href={link.path}
                  onNavigate={onNavigate}
                  className="focus-ring inline-flex rounded-lg py-1 text-sm font-bold text-white/85 hover:text-sunshine"
                >
                  {link.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-xl font-black">Follow</h3>
          <div className="mt-4 flex gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                className="focus-ring inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg bg-white p-2 text-ink transition hover:-translate-y-0.5 hover:bg-sunshine"
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Woodlands on ${link.label}`}
              >
                <img className="h-8 w-8" src={image(link.icon)} alt="" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-y border-white/10 bg-white px-4 py-6 text-ink">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-5">
          {footerParkLogos.map((park) =>
            park.href.startsWith("http") ? (
              <a
                key={park.label}
                className="focus-ring rounded-lg bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lift"
                href={park.href}
                target="_blank"
                rel="noreferrer"
                aria-label={park.label}
              >
                <img className="max-h-16 w-auto" src={image(park.image)} alt={park.alt} loading="lazy" />
              </a>
            ) : (
              <AppLink
                key={park.label}
                href={park.href}
                onNavigate={onNavigate}
                className="focus-ring rounded-lg bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lift"
                aria-label={park.label}
              >
                <img className="max-h-20 w-auto" src={image(park.image)} alt={park.alt} loading="lazy" />
              </AppLink>
            ),
          )}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs font-bold text-white/65">
        Website Content {"\u00a9"} Twinlakes Park 2026
      </div>
    </footer>
  );
}
