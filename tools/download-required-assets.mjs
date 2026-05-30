import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const downloads = [
  {
    type: "document",
    file: "src/assets/documents/accessibility/woodlands-family-theme-park-access-statement-2024.pdf",
    url: "https://www.woodlandspark.com/wp-content/uploads/2024/12/Woodlands-Family-Theme-Park-Access-Statement-2024.pdf",
  },
  {
    type: "document",
    file: "src/assets/documents/forms/childminder-annual-membership-form-2026.pdf",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/01/Childminder-Annual-Membership-Form-2026.pdf",
  },
  {
    type: "document",
    file: "src/assets/documents/forms/annual-membership-form-2026.pdf",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/01/Annual-Membership-Form-2026.pdf",
  },
  {
    type: "document",
    file: "src/assets/documents/recruitment/animal-keeper-job-description.docx",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/02/Animal-Keeper-Job-Description.docx",
  },
  {
    type: "document",
    file: "src/assets/documents/birthday/invite-2015-pdf.pdf",
    url: "https://woodlandspark.com/wp-content/uploads/2015/02/Invite-2015-pdf.pdf",
  },
  {
    type: "document",
    file: "src/assets/documents/safety/woodlands-safety-code-2016-updated-june-2016-1.pdf",
    url: "http://woodlandspark.com/wp-content/uploads/2015/02/Woodlands-Safety-Code-2016-updated-June-2016-1.pdf",
  },
  {
    type: "document",
    file: "src/assets/documents/opening-times/2026-calendar.jpg",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/03/2026-Calendar-3.jpg",
  },
  {
    type: "document",
    file: "src/assets/documents/park-map/2025-woodlands-park-map-v2-1.jpg",
    url: "https://www.woodlandspark.com/wp-content/uploads/2025/02/2025-Woodlands-Park-Map-V2-1.jpg",
  },
  {
    type: "image",
    file: "src/assets/images/opening-times/april-2026.jpg",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/01/Calendar-individuals-4.jpg",
  },
  {
    type: "image",
    file: "src/assets/images/opening-times/may-2026.jpg",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/01/Calendar-individuals-5.jpg",
  },
  {
    type: "image",
    file: "src/assets/images/opening-times/june-2026.jpg",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/01/Calendar-individuals-6.jpg",
  },
  {
    type: "image",
    file: "src/assets/images/opening-times/july-2026.jpg",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/03/8.jpg",
  },
  {
    type: "image",
    file: "src/assets/images/opening-times/august-2026.jpg",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/03/9.jpg",
  },
  {
    type: "image",
    file: "src/assets/images/opening-times/september-2026.jpg",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/01/Calendar-individuals-9.jpg",
  },
  {
    type: "image",
    file: "src/assets/images/opening-times/october-2026.jpg",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/01/Calendar-individuals-10.jpg",
  },
  {
    type: "image",
    file: "src/assets/images/opening-times/november-2026.jpg",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/01/Calendar-individuals-11.jpg",
  },
  {
    type: "image",
    file: "src/assets/images/old-site/supergirl-mainpage.png",
    url: "https://www.woodlandspark.com/wp-content/uploads/2016/04/Supergirl_mainpage.png.pagespeed.ce.MrL0oRrE62.png",
  },
  {
    type: "image",
    file: "src/assets/images/old-site/superboy-mainpage.png",
    url: "https://www.woodlandspark.com/wp-content/uploads/2016/04/Superboy_mainpage.png.pagespeed.ce.wkyKJXw0bN.png",
  },
  {
    type: "image",
    file: "src/assets/images/old-site/woodlands-birthdays.png",
    url: "https://www.woodlandspark.com/wp-content/uploads/2016/04/Woodlands_birthdays.png.pagespeed.ce.v-CDhRnP7o.png",
  },
  {
    type: "image",
    file: "src/assets/images/old-site/newsletter.png",
    url: "https://www.woodlandspark.com/wp-content/uploads/2016/04/newsletter.png.pagespeed.ce.2SnW5suotO.png",
  },
  {
    type: "image",
    file: "src/assets/images/old-site/book-entry-tickets-small-link.png",
    url: "https://www.woodlandspark.com/wp-content/uploads/2018/05/book-entry-tickets_small_link.png.pagespeed.ce.XO9FOQcEMf.png",
  },
  {
    type: "image",
    file: "src/assets/images/old-site/nutty-footer.png",
    url: "https://www.woodlandspark.com/wp-content/uploads/2016/04/Nutty_right_ftr.png.pagespeed.ce.-AXrTmdh7V.png",
  },
  {
    type: "image",
    file: "src/assets/images/old-site/hero-boy.png",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/01/boy-hero-1.png",
  },
  {
    type: "image",
    file: "src/assets/images/old-site/hero-girl.png",
    url: "https://www.woodlandspark.com/wp-content/uploads/2026/01/Girl-Hero-1.png",
  },
];

async function download(item) {
  const response = await fetch(item.url, {
    headers: {
      "user-agent": "Mozilla/5.0 Woodlands local prototype asset downloader",
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${item.url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(dirname(item.file), { recursive: true });
  await writeFile(item.file, buffer);
  return { ...item, bytes: buffer.length };
}

const manifest = [];
for (const item of downloads) {
  try {
    manifest.push(await download(item));
  } catch (error) {
    manifest.push({ ...item, error: error.message });
  }
}

await writeFile("tools/required-asset-sources.json", `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Downloaded ${manifest.filter((item) => !item.error).length} of ${downloads.length} requested files.`);
for (const item of manifest.filter((entry) => entry.error)) {
  console.error(`Failed: ${item.file} - ${item.error}`);
}
