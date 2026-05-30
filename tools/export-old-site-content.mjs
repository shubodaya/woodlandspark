import { readFile } from "node:fs/promises";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = "https://www.woodlandspark.com";
const OUT = "src/data";

const headers = {
  "user-agent": "Mozilla/5.0 Woodlands authorised redesign content export",
};

function decodeEntities(value = "") {
  return String(value)
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8216;|&lsquo;/g, "'")
    .replace(/&#8220;|&ldquo;/g, '"')
    .replace(/&#8221;|&rdquo;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&pound;/g, "£")
    .replace(/&hellip;/g, "...")
    .replace(/&ndash;|&#8211;/g, "–")
    .replace(/&mdash;|&#8212;/g, "—")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/<br\s*\/?>/gi, "\n");
}

function stripHtml(html = "") {
  return decodeEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|section|article|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function headingsFromHtml(html = "") {
  return [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => stripHtml(match[2]))
    .filter(Boolean);
}

function imagesFromHtml(html = "") {
  const images = [];
  for (const match of html.matchAll(/<img[^>]+>/gi)) {
    const tag = match[0];
    const url = tag.match(/\s(?:src|data-src)=["']([^"']+)["']/i)?.[1];
    if (!url) continue;
    images.push({
      url: url.startsWith("//") ? `https:${url}` : url,
      alt: decodeEntities(tag.match(/\salt=["']([^"']*)["']/i)?.[1] || ""),
    });
  }
  return images;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function fetchWpCollection(type) {
  const rows = [];
  for (let page = 1; page <= 20; page += 1) {
    const url = `${BASE}/wp-json/wp/v2/${type}?per_page=100&page=${page}&_fields=id,slug,link,title,content,excerpt,modified,parent,menu_order,type`;
    const response = await fetch(url, { headers });
    if (response.status === 400) break;
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
    const data = await response.json();
    rows.push(...data);
    const totalPages = Number(response.headers.get("x-wp-totalpages") || "1");
    if (page >= totalPages) break;
  }
  return rows;
}

function normalizeWpItem(item) {
  const contentHtml = item.content?.rendered || "";
  const excerptHtml = item.excerpt?.rendered || "";
  return {
    id: item.id,
    type: item.type,
    slug: item.slug,
    title: decodeEntities(item.title?.rendered || ""),
    url: item.link,
    modified: item.modified,
    parent: item.parent,
    menuOrder: item.menu_order,
    headings: headingsFromHtml(contentHtml),
    excerptHtml,
    excerptText: stripHtml(excerptHtml),
    contentHtml,
    textContent: stripHtml(contentHtml),
    images: imagesFromHtml(contentHtml),
  };
}

async function fetchTribeEvents() {
  const rows = [];
  for (let page = 1; page <= 10; page += 1) {
    const data = await fetchJson(`${BASE}/wp-json/tribe/events/v1/events?per_page=50&page=${page}`);
    rows.push(...(data.events || []));
    if (!data.next_rest_url) break;
  }
  return rows.map((event) => {
    const contentHtml = event.description || "";
    return {
      id: event.id,
      title: decodeEntities(event.title || ""),
      url: event.url,
      startDate: event.start_date,
      endDate: event.end_date,
      allDay: event.all_day,
      cost: event.cost || "",
      headings: headingsFromHtml(contentHtml),
      contentHtml,
      textContent: stripHtml(contentHtml),
      images: event.image?.url ? [{ url: event.image.url, alt: event.image.alt || event.title || "" }] : [],
    };
  });
}

function byUrlIncludes(items, fragments) {
  return items.filter((item) => fragments.some((fragment) => item.url?.includes(fragment)));
}

async function writeJson(path, data) {
  await mkdir(path.slice(0, path.lastIndexOf("/")), { recursive: true });
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function main() {
  const pages = (await fetchWpCollection("pages")).map(normalizeWpItem);
  const posts = (await fetchWpCollection("posts")).map(normalizeWpItem);
  const events = await fetchTribeEvents();
  const crawl = JSON.parse(await readFile("woodlands-extracted-content.json", "utf8"));
  const eventArchive = crawl.events || [];

  await writeJson(`${OUT}/pages/pages.json`, pages);
  await writeJson(`${OUT}/news/news.json`, posts);
  await writeJson(`${OUT}/events/events.json`, events);
  await writeJson(`${OUT}/events/event-archive.json`, eventArchive);
  await writeJson(`${OUT}/attractions/attractions.json`, byUrlIncludes(pages, ["/rides-attractions/", "/devon-zoo/"]));
  await writeJson(`${OUT}/food/food-drink-pages.json`, byUrlIncludes(pages, ["/food-drink/", "/courtyard-cafe/"]));
  await writeJson(`${OUT}/footer/footer-pages.json`, byUrlIncludes(pages, ["/terms-conditions/", "/privacy/", "/links/", "/2545-2/"]));

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: BASE,
    files: [
      "src/data/pages/pages.json",
      "src/data/events/events.json",
      "src/data/events/event-archive.json",
      "src/data/news/news.json",
      "src/data/attractions/attractions.json",
      "src/data/food/food-drink-pages.json",
      "src/data/footer/footer-pages.json",
    ],
    counts: {
      pages: pages.length,
      posts: posts.length,
      events: events.length,
      eventArchive: eventArchive.length,
      attractions: byUrlIncludes(pages, ["/rides-attractions/", "/devon-zoo/"]).length,
      food: byUrlIncludes(pages, ["/food-drink/", "/courtyard-cafe/"]).length,
      footer: byUrlIncludes(pages, ["/terms-conditions/", "/privacy/", "/links/", "/2545-2/"]).length,
    },
    note: "contentHtml preserves the WordPress rendered HTML for authorised migration review; textContent is a cleaned plain-text extraction.",
  };
  await writeJson(`${OUT}/content-manifest.json`, manifest);
  console.log(JSON.stringify(manifest.counts, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
