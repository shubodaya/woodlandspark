import { AppLink } from "./Link.jsx";
import { image } from "../data/assets.js";

const banners = [
  {
    label: "Bring your Birthday to Woodlands",
    href: "/visiting/birthday-parties",
    image: "old-site/woodlands-birthdays.png",
    alt: "Bring your birthday to Woodlands",
    className: "footer-cta-birthday",
  },
  {
    label: "Subscribe to our Newsletter",
    href: "/newsletter",
    image: "old-site/newsletter.png",
    alt: "Subscribe to the Woodlands newsletter",
    className: "footer-cta-newsletter",
  },
  {
    label: "Book Entry Tickets Now",
    href: "/tickets",
    image: "old-site/book-entry-tickets-small-link.png",
    alt: "Book entry tickets now",
    className: "footer-cta-tickets",
  },
];

export function FooterCtaBanners({ onNavigate }) {
  return (
    <section className="footer-cta-stage" aria-label="Woodlands offers and quick links">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="relative">
          <img className="footer-cta-character footer-cta-character-left" src={image("old-site/supergirl-mainpage.png")} alt="" aria-hidden="true" />
          <img className="footer-cta-character footer-cta-character-right" src={image("old-site/superboy-mainpage.png")} alt="" aria-hidden="true" />
          <div className="footer-cta-grid">
            {banners.map((banner) => (
              <AppLink
                key={banner.href}
                href={banner.href}
                onNavigate={onNavigate}
                className={`footer-cta-tile ${banner.className}`}
              >
                <img src={image(banner.image)} alt={banner.alt} loading="lazy" />
                <span>{banner.label}</span>
              </AppLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
