import { mkdir, writeFile } from "node:fs/promises";

const BASE = "https://www.woodlandspark.com";
const OUT = "content_inventory.md";
const JSON_OUT = "woodlands-extracted-content.json";

const wantedUrls = new Set([
  `${BASE}/`,
  `${BASE}/rides-attractions/`,
  `${BASE}/rides-attractions/action-zone/`,
  `${BASE}/rides-attractions/arctic-zone/`,
  `${BASE}/rides-attractions/circus-drome-zone/`,
  `${BASE}/rides-attractions/cyclone-zone/`,
  `${BASE}/rides-attractions/falconry-centre/`,
  `${BASE}/devon-zoo/rides/`,
  `${BASE}/rides-attractions/ninja-zone/`,
  `${BASE}/rides-attractions/sea-monster-zone/`,
  `${BASE}/rides-attractions/toddlers-zone/`,
  `${BASE}/events/`,
  `${BASE}/devon-zoo/`,
  `${BASE}/devon-zoo/animal-activities/`,
  `${BASE}/devon-zoo/big-animal-barn/`,
  `${BASE}/devon-zoo/furry-friends/`,
  `${BASE}/devon-zoo/falconry-centre/`,
  `${BASE}/devon-zoo/bugs-insects/`,
  `${BASE}/devon-zoo/new-babies/`,
  `${BASE}/devon-zoo/nocturnal-house/`,
  `${BASE}/devon-zoo/reptile-house/`,
  `${BASE}/devon-zoo/rabbit-guinea-pig-city/`,
  `${BASE}/your-visit/accessibility/`,
  `${BASE}/your-visit/information/annual-pass/`,
  `${BASE}/woodlands-birthday-parties/`,
  `${BASE}/your-visit/information/supporting-the-community/`,
  `${BASE}/your-visit/information/childminders-annual-pass/`,
  `${BASE}/dog-kennels/`,
  `${BASE}/camping-in-devon/`,
  `${BASE}/family-days-out/`,
  `${BASE}/your-visit/food-drink/`,
  `${BASE}/your-visit/gift-vouchers/`,
  `${BASE}/rides-attractions/height-restrictions/`,
  `${BASE}/your-visit/information/`,
  `${BASE}/your-visit/information/opening-times/`,
  `${BASE}/your-visit/information/park-map/`,
  `${BASE}/your-visit/visitor-facilities/`,
  `${BASE}/your-visit/information/tickets/`,
  `${BASE}/recruitment/`,
  `${BASE}/your-visit/information/how-to-get-here/`,
  `${BASE}/your-visit/faqs/`,
  `${BASE}/corporate-days-out/`,
  `${BASE}/general-groups/`,
  `${BASE}/groups/risk-assessments/`,
  `${BASE}/blog/`,
  `${BASE}/terms-conditions/`,
  `${BASE}/privacy/`,
  `${BASE}/links/`,
]);

const sitemapUrls = [
  `${BASE}/page-sitemap.xml`,
  `${BASE}/post-sitemap.xml`,
  `${BASE}/tribe_events-sitemap.xml`,
  `${BASE}/testimonial-sitemap.xml`,
];

const navOrder = [
  "Explore",
  "Events",
  "Zoo Farm",
  "Visiting",
  "Groups",
  "Camping",
  "News",
];

const repairMojibake = (value = "") =>
  value
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€³/g, '"')
    .replace(/â€“/g, "-")
    .replace(/â€”/g, "-")
    .replace(/â€¦/g, "...")
    .replace(/Â£/g, "\u00a3")
    .replace(/Â/g, "")
    .replace(/Ã©/g, "\u00e9");

const decodeEntities = (value = "") =>
  repairMojibake(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "...")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"');

const stripTags = (html = "") =>
  decodeEntities(
    html
      .replace(/\[\/?vc_[^\]]*]/gi, " ")
      .replace(/\[\/?contact-form-7[^\]]*]/gi, " ")
      .replace(/\[\/?table[^\]]*]/gi, " ")
      .replace(/\[[a-z0-9_-]+[^\]]*]/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|li|h[1-6]|tr|div|section|article)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );

const clean = (value = "") => decodeEntities(value.replace(/\s+/g, " ").trim());

const normalizeUrl = (url = "") => {
  if (!url) return "";
  let normalized = decodeEntities(url).trim();
  if (normalized.startsWith("//")) normalized = `https:${normalized}`;
  if (normalized.startsWith("/")) normalized = `${BASE}${normalized}`;
  if (normalized.startsWith("http://woodlandspark.com")) {
    normalized = normalized.replace("http://woodlandspark.com", BASE);
  }
  if (normalized.startsWith("https://woodlandspark.com")) {
    normalized = normalized.replace("https://woodlandspark.com", BASE);
  }
  return normalized;
};

const md = (value = "") =>
  clean(value)
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ");

const truncate = (value = "", max = 650) => {
  const text = clean(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}...`;
};

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 content inventory crawler for local redesign prototype",
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  return response.text();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 content inventory crawler for local redesign prototype",
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  return response.json();
}

async function fetchPaged(endpoint, params = "") {
  const results = [];
  for (let page = 1; page < 20; page += 1) {
    const join = endpoint.includes("?") ? "&" : "?";
    const url = `${endpoint}${join}per_page=100&page=${page}${params}`;
    const response = await fetch(url);
    if (response.status === 400 || response.status === 404) break;
    if (!response.ok) throw new Error(`${response.status} for ${url}`);
    const body = await response.json();
    if (!Array.isArray(body) || body.length === 0) break;
    results.push(...body);
    const pages = Number(response.headers.get("x-wp-totalpages") || "1");
    if (page >= pages) break;
  }
  return results;
}

function parseAnchors(html = "") {
  const anchors = [];
  const pattern = /<a\b([^>]*?)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const attrs = match[1];
    const href = attrs.match(/\bhref=(["'])(.*?)\1/i)?.[2] || "";
    const titleText =
      match[2].match(/<span[^>]*class=(["'])[^"']*target-text[^"']*\1[^>]*>([\s\S]*?)<\/span>/i)?.[2] ||
      stripTags(match[2]);
    const imageMatch = match[2].match(/<img\b([^>]*?)>/i);
    let image = "";
    let alt = "";
    if (imageMatch) {
      image =
        imageMatch[1].match(/\bdata-src=(["'])(.*?)\1/i)?.[2] ||
        imageMatch[1].match(/\bsrc=(["'])(.*?)\1/i)?.[2] ||
        "";
      alt = imageMatch[1].match(/\balt=(["'])(.*?)\1/i)?.[2] || "";
    }
    if (href || titleText) {
      anchors.push({
        title: clean(stripTags(titleText)),
        url: normalizeUrl(href),
        image: normalizeUrl(image),
        alt: clean(alt),
      });
    }
  }
  return anchors.filter((item) => item.title || item.url);
}

function parseMenu(homeHtml) {
  const menuStart = homeHtml.indexOf('id="ubermenu-main-4-primary"');
  const menuEnd = homeHtml.indexOf("</nav>", menuStart);
  const menuHtml =
    menuStart >= 0 && menuEnd >= 0
      ? homeHtml.slice(menuStart, menuEnd + "</nav>".length)
      : "";
  const topMatches = [];
  const topPattern =
    /<li\b(?=[^>]*ubermenu-item-level-0)(?=[^>]*id="menu-item-\d+")[^>]*>/gi;
  let match;
  while ((match = topPattern.exec(menuHtml))) {
    topMatches.push({ index: match.index, tag: match[0] });
  }
  const menu = [];
  topMatches.forEach((item, index) => {
    const next = topMatches[index + 1]?.index ?? menuHtml.length;
    const segment = menuHtml.slice(item.index, next);
    const topAnchor = parseAnchors(segment)[0];
    if (!topAnchor) return;
    const children = [];
    const childPattern =
      /<li\b(?=[^>]*ubermenu-item-level-1)(?=[^>]*id="menu-item-\d+")[\s\S]*?(?=<li\b(?=[^>]*(?:ubermenu-item-level-1|ubermenu-retractor))|<\/ul>)/gi;
    let childMatch;
    while ((childMatch = childPattern.exec(segment))) {
      const anchor = parseAnchors(childMatch[0])[0];
      if (anchor) children.push(anchor);
    }
    menu.push({ ...topAnchor, children });
  });
  return navOrder
    .map((label) => menu.find((item) => item.title === label))
    .filter(Boolean);
}

function parseFooter(homeHtml) {
  const start = homeHtml.indexOf('<div class="footerwrapper">');
  const footerHtml = start >= 0 ? homeHtml.slice(start, homeHtml.indexOf("</footer>", start) + 9) : "";
  const links = parseAnchors(footerHtml).filter(
    (link, index, arr) =>
      link.url &&
      arr.findIndex((candidate) => candidate.url === link.url && candidate.title === link.title) === index,
  );
  return links;
}

function parseNewsletter(homeHtml) {
  const formStart = homeHtml.indexOf('id="test-form"');
  const formHtml =
    formStart >= 0
      ? homeHtml.slice(homeHtml.lastIndexOf("<form", formStart), homeHtml.indexOf("</form>", formStart) + 7)
      : "";
  const fields = [];
  const fieldPattern = /<label\b[^>]*for=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/label>[\s\S]*?<input\b([^>]*?)>/gi;
  let match;
  while ((match = fieldPattern.exec(formHtml))) {
    fields.push({
      id: match[2],
      label: clean(stripTags(match[3])),
      name: match[4].match(/\bname=(["'])(.*?)\1/i)?.[2] || "",
      type: match[4].match(/\btype=(["'])(.*?)\1/i)?.[2] || "text",
      required: /required/.test(match[4]) || /\*/.test(stripTags(match[3])),
    });
  }
  const action = formHtml.match(/\baction=(["'])(.*?)\1/i)?.[2] || "";
  return { action: normalizeUrl(action), fields };
}

function parseSitemap(xml, source) {
  const entries = [];
  const urlPattern = /<url>([\s\S]*?)<\/url>/gi;
  let urlMatch;
  while ((urlMatch = urlPattern.exec(xml))) {
    const block = urlMatch[1];
    const loc = clean(block.match(/<loc>([\s\S]*?)<\/loc>/i)?.[1] || "");
    const lastmod = clean(block.match(/<lastmod>([\s\S]*?)<\/lastmod>/i)?.[1] || "");
    const images = [];
    const imagePattern = /<image:loc>([\s\S]*?)<\/image:loc>/gi;
    let imageMatch;
    while ((imageMatch = imagePattern.exec(block))) {
      images.push(normalizeUrl(clean(imageMatch[1])));
    }
    entries.push({ url: normalizeUrl(loc), lastmod, images, source });
  }
  return entries;
}

function extractImages(html = "", yoast = {}) {
  const images = new Map();
  const imgPattern = /<img\b([^>]*?)>/gi;
  let match;
  while ((match = imgPattern.exec(html))) {
    const attrs = match[1];
    const src =
      attrs.match(/\bdata-src=(["'])(.*?)\1/i)?.[2] ||
      attrs.match(/\bsrc=(["'])(.*?)\1/i)?.[2] ||
      "";
    const alt = attrs.match(/\balt=(["'])(.*?)\1/i)?.[2] || "";
    const url = normalizeUrl(src);
    if (url && !url.startsWith("data:")) images.set(url, clean(alt));
  }
  for (const image of yoast?.og_image || []) {
    const url = normalizeUrl(image.url);
    if (url) images.set(url, clean(image.alt || image.caption || ""));
  }
  const schema = yoast?.schema?.["@graph"] || [];
  for (const graphItem of schema) {
    const url = normalizeUrl(graphItem.thumbnailUrl || graphItem.contentUrl || graphItem.url);
    if (url && /\.(jpe?g|png|webp|gif|bmp)$/i.test(url)) {
      images.set(url, clean(graphItem.caption || ""));
    }
  }
  return [...images.entries()].map(([url, alt]) => ({ url, alt }));
}

function extractHeadings(html = "", fallback = "") {
  const headings = [];
  const pattern = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const text = clean(stripTags(match[2]));
    if (text && !headings.includes(text)) headings.push(text);
  }
  const fallbackClean = clean(stripTags(fallback));
  if (fallbackClean && !headings.includes(fallbackClean)) headings.unshift(fallbackClean);
  return headings.slice(0, 12);
}

function extractFacts(html = "", plainText = "") {
  const facts = [];
  const rowBlocks = [];
  for (const pattern of [
    /<tr[\s\S]*?<\/tr>/gi,
    /<li[\s\S]*?<\/li>/gi,
    /<p[\s\S]*?<\/p>/gi,
    /<h[1-6][\s\S]*?<\/h[1-6]>/gi,
  ]) {
    let match;
    while ((match = pattern.exec(html))) rowBlocks.push(stripTags(match[0]));
  }
  const fallbackSentences = plainText
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 8);
  const candidates = [...rowBlocks, ...fallbackSentences].map(clean).filter(Boolean);
  const factual = /(£|\b\d{1,2}[:.]\d{2}\b|\b\d{1,2}\s?(am|pm)\b|\b\d{1,2}(st|nd|rd|th)\b|202\d|\bA38\b|\bTQ9\b|@|phone|email|call|open|closed|ticket|pass|price|height|restriction|access|wheelchair|disabled|carer|dog|kennel|camp|pitch|group|birthday|booking|risk|safety|terms|privacy|address|Dartmouth|Totnes|family theme park|included|admission|free)/i;
  for (const candidate of candidates) {
    const text = candidate.replace(/\s+/g, " ").trim();
    if (text.length < 18) continue;
    if (factual.test(text) || facts.length < 3) {
      if (!facts.some((existing) => existing === text || existing.includes(text))) {
        facts.push(truncate(text, 280));
      }
    }
    if (facts.length >= 10) break;
  }
  return facts;
}

function pageRecord(page, sitemapImages = []) {
  const content = page.content?.rendered || page.description || "";
  const text = stripTags(content);
  const title = clean(stripTags(page.title?.rendered || page.title || ""));
  const images = extractImages(content, page.yoast_head_json);
  for (const url of sitemapImages) {
    if (!images.some((image) => image.url === url)) images.push({ url, alt: "" });
  }
  return {
    id: page.id,
    type: page.type || "page",
    title,
    url: normalizeUrl(page.link || page.url),
    modified: page.modified || "",
    headings: extractHeadings(content, title),
    description: page.yoast_head_json?.description || page.excerpt?.rendered ? stripTags(page.excerpt?.rendered || "") : "",
    importantText: extractFacts(content, text),
    textPreview: truncate(text, 550),
    images: images.slice(0, 20),
  };
}

async function main() {
  const homeHtml = await fetchText(BASE);
  const [pages, posts] = await Promise.all([
    fetchPaged(`${BASE}/wp-json/wp/v2/pages`, "&_fields=id,slug,link,title,content,excerpt,modified,parent,menu_order,yoast_head_json,featured_media"),
    fetchPaged(`${BASE}/wp-json/wp/v2/posts`, "&_fields=id,slug,link,title,content,excerpt,date,modified,yoast_head_json,featured_media"),
  ]);

  const sitemapEntries = [];
  for (const url of sitemapUrls) {
    try {
      sitemapEntries.push(...parseSitemap(await fetchText(url), url));
    } catch (error) {
      sitemapEntries.push({ source: url, error: error.message, url });
    }
  }

  const sitemapImageMap = new Map();
  for (const entry of sitemapEntries) {
    if (!entry.url) continue;
    sitemapImageMap.set(entry.url, entry.images || []);
    if (entry.url.includes("/events/") && entry.url !== `${BASE}/events/`) {
      wantedUrls.add(entry.url);
    }
  }

  let all2026Events = [];
  let upcomingEvents = [];
  try {
    const eventUrl = `${BASE}/wp-json/tribe/events/v1/events?per_page=100&start_date=2026-01-01%2000:00:00&end_date=2026-12-31%2023:59:59`;
    all2026Events = (await fetchJson(eventUrl)).events || [];
  } catch (error) {
    all2026Events = [{ error: error.message }];
  }
  try {
    upcomingEvents =
      (await fetchJson(`${BASE}/wp-json/tribe/events/v1/events?per_page=100`)).events || [];
  } catch (error) {
    upcomingEvents = [{ error: error.message }];
  }

  const menu = parseMenu(homeHtml);
  for (const group of menu) {
    wantedUrls.add(group.url);
    for (const child of group.children || []) wantedUrls.add(child.url);
  }

  const footerLinks = parseFooter(homeHtml);
  for (const link of footerLinks) wantedUrls.add(link.url);

  const newsletter = parseNewsletter(homeHtml);
  const sitemapPages = sitemapEntries.filter((entry) => entry.url);
  const pageRecords = pages.map((page) => pageRecord(page, sitemapImageMap.get(normalizeUrl(page.link)) || []));
  const postRecords = posts.map((post) =>
    pageRecord(
      { ...post, type: "post" },
      sitemapImageMap.get(normalizeUrl(post.link)) || [],
    ),
  );

  const pageByUrl = new Map([...pageRecords, ...postRecords].map((page) => [page.url, page]));
  const importantPages = [...wantedUrls]
    .filter((url) => url.startsWith(BASE))
    .sort()
    .map((url) => pageByUrl.get(url) || {
      title:
        sitemapPages.find((entry) => entry.url === url)?.url
          ?.replace(BASE, "")
          .split("/")
          .filter(Boolean)
          .pop()
          ?.replace(/-/g, " ") || url,
      url,
      headings: [],
      importantText: [],
      textPreview: "TODO: Content was listed in navigation/sitemap but not available through the public WP page/post API.",
      images: (sitemapImageMap.get(url) || []).map((imageUrl) => ({ url: imageUrl, alt: "" })),
    });

  const events = all2026Events
    .filter((event) => event.url)
    .map((event) => ({
      title: clean(event.title),
      url: normalizeUrl(event.url),
      start: event.start_date,
      end: event.end_date,
      allDay: Boolean(event.all_day),
      cost: event.cost || "",
      text: extractFacts(event.description || "", stripTags(event.description || "")),
      image: normalizeUrl(event.image?.url || ""),
    }));

  const eventSitemap = sitemapPages
    .filter((entry) => entry.url.includes("/events/"))
    .map((entry) => ({
      url: entry.url,
      lastmod: entry.lastmod,
      images: entry.images,
    }));

  const inventory = {
    generatedAt: new Date().toISOString(),
    source: BASE,
    menu,
    footerLinks,
    newsletter,
    pagesFound: sitemapPages,
    importantPages,
    posts: postRecords,
    events,
    upcomingEvents,
    eventSitemap,
    extractionNotes: [
      "Menu was parsed from homepage UberMenu HTML because the WordPress menu REST endpoint returned 401 Unauthorized.",
      "Content is summarized to avoid copying full page text into the prototype inventory.",
      "Images are public WordPress uploads. No explicit reuse licence was found; treat downloaded local assets as redesign-prototype assets and verify rights before production.",
      "Live ticket booking is handled by an external Digitickets URL. The local prototype uses CTA links only.",
      "Camping top-nav links to the separate woodlandsgrove.co.uk site; this prototype includes the Woodlands camping page found in the sitemap.",
      "Testimonial sitemap URLs and images were found, but public testimonial body text was not exposed through the available WordPress REST endpoints.",
    ],
  };

  const lines = [];
  lines.push("# Woodlands Content Inventory");
  lines.push("");
  lines.push(`Generated: ${inventory.generatedAt}`);
  lines.push(`Source: ${BASE}`);
  lines.push("");
  lines.push("## Extraction Notes");
  for (const note of inventory.extractionNotes) lines.push(`- ${note}`);
  lines.push("");
  lines.push("## Navbar Structure");
  for (const group of menu) {
    lines.push(`### ${md(group.title)}`);
    lines.push(`- URL: ${group.url}`);
    if (group.image) lines.push(`- Nav image: ${group.image}${group.alt ? ` (${md(group.alt)})` : ""}`);
    if (group.children?.length) {
      lines.push("- Dropdown pages:");
      for (const child of group.children) {
        lines.push(
          `  - ${md(child.title)} - ${child.url}${child.image ? ` - image: ${child.image}` : ""}${child.alt ? ` - alt: ${md(child.alt)}` : ""}`,
        );
      }
    } else {
      lines.push("- Dropdown pages: none found");
    }
    lines.push("");
  }

  lines.push("## Footer Links");
  for (const link of footerLinks) {
    lines.push(`- ${md(link.title || "(image link)")} - ${link.url}${link.image ? ` - image: ${link.image}` : ""}`);
  }
  lines.push("");

  lines.push("## Newsletter Form");
  lines.push(`- Action: ${newsletter.action || "TODO: not extracted"}`);
  for (const field of newsletter.fields) {
    lines.push(
      `- ${md(field.label)} | name=${field.name} | type=${field.type} | required=${field.required ? "yes" : "no"}`,
    );
  }
  lines.push("");

  lines.push("## Pages Found In Sitemaps");
  for (const entry of sitemapPages) {
    lines.push(`- ${entry.url}${entry.lastmod ? ` | lastmod ${entry.lastmod}` : ""}${entry.images?.length ? ` | images ${entry.images.length}` : ""}`);
  }
  lines.push("");

  lines.push("## Important Page Content");
  for (const page of importantPages) {
    lines.push(`### ${md(page.title)}`);
    lines.push(`- URL: ${page.url}`);
    if (page.modified) lines.push(`- Modified: ${page.modified}`);
    if (page.headings?.length) lines.push(`- Main headings: ${page.headings.map(md).join("; ")}`);
    if (page.description) lines.push(`- SEO/excerpt: ${md(page.description)}`);
    if (page.importantText?.length) {
      lines.push("- Important text/content:");
      for (const fact of page.importantText) lines.push(`  - ${md(fact)}`);
    } else if (page.textPreview) {
      lines.push(`- Text preview: ${md(page.textPreview)}`);
    } else {
      lines.push("- Important text/content: TODO: could not extract meaningful content from public API.");
    }
    if (page.images?.length) {
      lines.push("- Images/assets found:");
      for (const image of page.images.slice(0, 12)) {
        lines.push(`  - ${image.url}${image.alt ? ` | alt: ${md(image.alt)}` : ""}`);
      }
      if (page.images.length > 12) lines.push(`  - ...and ${page.images.length - 12} more`);
    } else {
      lines.push("- Images/assets found: none in API/sitemap");
    }
    lines.push("");
  }

  lines.push("## Events And Offers Found");
  if (events.length) {
    lines.push("### 2026 Events From Events API");
    for (const event of events) {
      lines.push(`- ${md(event.title)} - ${event.url}`);
      lines.push(`  - Start: ${event.start}; End: ${event.end}; All day: ${event.allDay ? "yes" : "no"}; Cost field: ${event.cost || "(blank)"}`);
      if (event.image) lines.push(`  - Image: ${event.image}`);
      for (const fact of event.text.slice(0, 5)) lines.push(`  - ${md(fact)}`);
    }
  } else {
    lines.push("- TODO: No events extracted from API.");
  }
  lines.push("");
  lines.push("### Event Sitemap URLs");
  for (const entry of eventSitemap) {
    lines.push(`- ${entry.url}${entry.lastmod ? ` | lastmod ${entry.lastmod}` : ""}${entry.images?.length ? ` | images ${entry.images.length}` : ""}`);
  }
  lines.push("");

  lines.push("## News/Blog Found");
  for (const post of postRecords) {
    lines.push(`- ${md(post.title)} - ${post.url}${post.modified ? ` | modified ${post.modified}` : ""}`);
    if (post.textPreview) lines.push(`  - ${md(post.textPreview)}`);
    if (post.images?.[0]) lines.push(`  - Image: ${post.images[0].url}`);
  }
  lines.push("");

  lines.push("## Content That Could Not Be Extracted");
  lines.push("- WordPress menu endpoint returned 401, so hierarchy was parsed from public homepage HTML.");
  lines.push("- Exact image reuse licence/permission was not present in extracted pages. TODO: verify production permission with Woodlands before launch.");
  lines.push("- External booking engine pricing/ticket checkout details were not crawled beyond public Woodlands pages and CTAs. TODO: verify live prices in Digitickets before production.");
  lines.push("- Some legacy sitemap pages exist but are not part of the requested redesigned navigation; they are listed above but may need stakeholder review before inclusion.");
  lines.push("- Camping top-level nav points to woodlandsgrove.co.uk; only Woodlands-owned camping-in-devon content was extracted for this prototype.");
  lines.push("- Testimonial page URLs/images were found, but the full review body text was not extractable from public API/HTML. TODO: request approved testimonial copy from Woodlands before production.");
  lines.push("");

  await writeFile(OUT, `${lines.join("\n")}\n`, "utf8");
  await writeFile(JSON_OUT, `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
  await mkdir("src/assets/images", { recursive: true });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
