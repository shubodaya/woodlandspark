import oldPages from "./pages/pages.json";
import oldEvents from "./events/events.json";
import oldNews from "./news/news.json";

function repairMojibake(value = "") {
  return String(value)
    .replace(/Â£/g, "£")
    .replace(/Â /g, " ")
    .replace(/â€™/g, "’")
    .replace(/â€˜/g, "‘")
    .replace(/â€œ/g, "“")
    .replace(/â€/g, "”")
    .replace(/â€“/g, "–")
    .replace(/â€”/g, "—")
    .replace(/â€¦/g, "…");
}

function decodeEntities(value = "") {
  return repairMojibake(String(value))
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\u201c|\u201d|\u2033/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&pound;/g, "£");
}

function normalizeUrl(url = "") {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`.replace(/\/$/, "");
  } catch {
    return url.replace(/\/$/, "");
  }
}

function textFromWordPress(contentHtml = "") {
  const html = decodeEntities(contentHtml)
    .replace(/\[vc_custom_heading\s+text="([^"]+)"[^\]]*]/gi, "\n\n$1\n\n")
    .replace(/\[vc_tta_section\s+title="([^"]+)"[^\]]*]/gi, "\n\n$1\n\n")
    .replace(/\[vc_btn\s+title="([^"]+)"[^\]]*]/gi, "\n\n$1\n\n")
    .replace(/\[\/?vc_[^\]]*]/gi, " ")
    .replace(/\[\/?contact-form-7[^\]]*]/gi, " ")
    .replace(/\[[a-z0-9_-]+[^\]]*]/gi, " ");

  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|h[1-6]|div|section|article|tr)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .split(/\n+/)
    .map((line) => line.replace(/[ \t]{2,}/g, " ").trim())
    .filter(Boolean);
}

const records = [...oldPages, ...oldEvents, ...oldNews];
const contentByUrl = new Map(records.map((record) => [normalizeUrl(record.url), record]));

export function getOldPageContent(sourceUrl) {
  const record = contentByUrl.get(normalizeUrl(sourceUrl));
  if (!record?.contentHtml) return null;
  const lines = textFromWordPress(record.contentHtml);
  if (!lines.length) return null;
  return {
    title: record.title,
    url: record.url,
    modified: record.modified || record.date || "",
    lines,
  };
}
