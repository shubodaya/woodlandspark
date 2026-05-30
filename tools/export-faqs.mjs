import { mkdir, readFile, writeFile } from "node:fs/promises";

const inputFile = "src/data/pages/pages.json";
const outputFile = "src/data/faqs/faqs.js";

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
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8216;|&lsquo;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…");
}

function cleanText(value = "") {
  return decodeEntities(value)
    .replace(/\[\/?vc_[^\]]*]/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|h[1-6]|div)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function parseFaqPage(contentHtml = "") {
  const html = decodeEntities(contentHtml);
  const tokenPattern =
    /\[vc_custom_heading\s+text="([^"]+)"[^\]]*]|\[vc_tta_section\s+title="([^"]+)"[\s\S]*?]\[vc_column_text[^\]]*]([\s\S]*?)\[\/vc_column_text]\[\/vc_tta_section]/g;
  const groups = [];
  let currentGroup = "General";
  let match;

  while ((match = tokenPattern.exec(html))) {
    if (match[1]) {
      const heading = cleanText(match[1]);
      if (heading && !/^Frequently Asked Questions/i.test(heading)) {
        currentGroup = heading;
      }
      continue;
    }

    const question = cleanText(match[2]);
    const answer = cleanText(match[3]);
    if (!question || !answer) continue;

    let group = groups.find((item) => item.title === currentGroup);
    if (!group) {
      group = { title: currentGroup, items: [] };
      groups.push(group);
    }
    group.items.push({ question, answer });
  }

  return groups;
}

const pages = JSON.parse(await readFile(inputFile, "utf8"));
const faqPage = pages.find((page) => page.url === "https://www.woodlandspark.com/your-visit/faqs/");

if (!faqPage) {
  throw new Error("FAQ page was not found in src/data/pages/pages.json");
}

const faqGroups = parseFaqPage(faqPage.contentHtml);
await mkdir("src/data/faqs", { recursive: true });
await writeFile(
  outputFile,
  `export const faqSource = ${JSON.stringify(
    {
      title: faqPage.title,
      url: faqPage.url,
      modified: faqPage.modified,
      totalQuestions: faqGroups.reduce((total, group) => total + group.items.length, 0),
      extractionStatus: "Parsed from old Woodlands FAQ WordPress contentHtml.",
    },
    null,
    2,
  )};\n\nexport const faqGroups = ${JSON.stringify(faqGroups, null, 2)};\n`,
  "utf8",
);

console.log(`Exported ${faqGroups.reduce((total, group) => total + group.items.length, 0)} FAQ items.`);
