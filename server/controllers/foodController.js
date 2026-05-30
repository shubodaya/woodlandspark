import { db } from "../db/connection.js";
import { ok } from "../utils/responses.js";

export function menuData(_req, res) {
  const cafes = db.prepare("SELECT slug, label, description FROM cafes WHERE active = 1 ORDER BY id").all();
  const categories = db.prepare(`
    SELECT name, group_name AS groupName, theme, display_order AS displayOrder
    FROM menu_categories
    ORDER BY display_order, name
  `).all();
  const rows = db.prepare(`
    SELECT
      menu_items.name,
      menu_items.description,
      menu_items.price_pence AS pricePence,
      menu_items.image,
      menu_categories.name AS category,
      cafes.slug AS cafeSlug
    FROM menu_items
    JOIN menu_categories ON menu_categories.id = menu_items.category_id
    JOIN cafes ON cafes.id = menu_items.cafe_id
    WHERE menu_items.active = 1 AND cafes.active = 1
    ORDER BY menu_categories.display_order, menu_items.name
  `).all();

  const itemMap = new Map();
  for (const row of rows) {
    const key = `${row.category}|${row.name}|${row.description}|${row.pricePence}|${row.image}`;
    if (!itemMap.has(key)) {
      itemMap.set(key, {
        category: row.category,
        name: row.name,
        description: row.description,
        price: Number(row.pricePence || 0) / 100,
        image: row.image,
        extras: [],
        cafeSlugs: [],
      });
    }
    itemMap.get(key).cafeSlugs.push(row.cafeSlug);
  }

  return ok(res, {
    foodMenuData: {
      generatedAt: new Date().toISOString(),
      source: "Woodlands menu database",
      cafes,
      categories,
      menuItems: [...itemMap.values()],
    },
  });
}
