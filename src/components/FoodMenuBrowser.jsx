import { useEffect, useMemo, useState } from "react";
import { Clock, Utensils } from "lucide-react";
import { foodMenuData as fallbackMenuData } from "../data/food/menuData.js";
import { image } from "../data/assets.js";
import { apiRequest } from "../lib/api.js";
import { SectionHeading } from "./Sections.jsx";

const formatPrice = (value) => `\u00a3${Number(value || 0).toFixed(2)}`;

export function FoodMenuBrowser() {
  const [menuData, setMenuData] = useState(fallbackMenuData);
  const [activeCafe, setActiveCafe] = useState(fallbackMenuData.cafes[0]?.slug || "raysdiner");

  useEffect(() => {
    let isMounted = true;
    apiRequest("/food/menu")
      .then((data) => {
        if (!isMounted || !data.foodMenuData) return;
        setMenuData(data.foodMenuData);
        setActiveCafe((current) =>
          data.foodMenuData.cafes.some((cafe) => cafe.slug === current)
            ? current
            : data.foodMenuData.cafes[0]?.slug || "",
        );
      })
      .catch(() => {
        if (isMounted) setMenuData(fallbackMenuData);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const cafeItems = useMemo(
    () => menuData.menuItems.filter((item) => item.cafeSlugs.includes(activeCafe)),
    [activeCafe, menuData.menuItems],
  );

  const grouped = useMemo(() => {
    const map = new Map();
    for (const category of menuData.categories) {
      const items = cafeItems.filter((item) => item.category === category.name);
      if (items.length) map.set(category.name, { category, items });
    }
    return [...map.values()];
  }, [cafeItems, menuData.categories]);

  return (
    <section className="section-band rainbow-ribbon bg-woodpink py-14 text-white">
      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <div className="[&_.text-berry]:text-sunshine [&_.text-ink]:text-white [&_.text-slate-700]:text-white/85">
          <SectionHeading
            eyebrow="Cafe Menus"
            title="Browse Food And Drink"
            text="Browse Woodlands cafe menus before your visit."
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {menuData.cafes.map((cafe) => (
            <button
              key={cafe.slug}
              className={`focus-ring rounded-lg px-4 py-3 text-sm font-extrabold uppercase tracking-wide transition ${
                activeCafe === cafe.slug
                  ? "bg-sunshine text-ink shadow-button"
                  : "bg-white/14 text-white hover:bg-white/24"
              }`}
              type="button"
              aria-pressed={activeCafe === cafe.slug}
              onClick={() => setActiveCafe(cafe.slug)}
            >
              {cafe.label}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-lg border-2 border-sunshine bg-white p-4 text-ink shadow-lift">
          <p className="inline-flex items-center gap-2 rounded-lg bg-plum px-3 py-2 text-sm font-black uppercase tracking-wide text-white">
            <Clock aria-hidden="true" size={16} />
            Menu browsing
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
            Ordering and payments are not available from this website.
          </p>
        </div>

        <div className="mt-8 grid gap-8">
          {grouped.map(({ category, items }) => (
            <section key={category.name} className="rounded-lg border border-white/25 bg-white/12 p-4 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-black text-white">{category.name}</h3>
                <span className="rounded-lg bg-sunshine px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink">
                  {category.groupName}
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <article key={`${activeCafe}-${item.name}`} className="card-hover overflow-hidden rounded-lg bg-white text-ink">
                    {item.image && (
                      <img className="aspect-[4/3] w-full object-cover" src={image(item.image)} alt={item.name} loading="lazy" />
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-display text-xl font-black">{item.name}</h4>
                        <span className="rounded-lg bg-sunshine px-2 py-1 text-sm font-black">{formatPrice(item.price)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
                      {item.extras?.length > 0 && (
                        <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-berry">
                          <Utensils aria-hidden="true" size={14} />
                          Extras available
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
