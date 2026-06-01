import { writeFileSync } from "node:fs";
import {
  allPages,
  eventCards,
  explorePages,
  footerLinks,
  newsPosts,
  zooPages,
} from "../src/data/siteData.js";
import { ticketTypeSeedData } from "../src/data/tickets/ticketing.js";
import { faqGroups } from "../src/data/faqs/faqs.js";
import { openingMonths, buildMonthDays, openingTimesSource } from "../src/data/openingTimes.js";
import { documentDownloads } from "../src/data/documents.js";
import { foodMenuData } from "../src/data/food/menuData.js";

const roles = [
  ["customer", "Customer"],
  ["admin", "Admin"],
  ["editor", "Editor"],
  ["staff", "Staff"],
  ["supervisor", "Supervisor"],
  ["manager", "Manager"],
  ["payroll_admin", "Payroll Admin"],
  ["super_admin", "Super Admin"],
];

const departments = [
  ["Rangers", "Rides, attractions and guest safety"],
  ["Zoo Farm", "Animal care and visitor talks"],
  ["Catering", "Cafes, diners and food service"],
  ["Admissions", "Entrance kiosks and guest welcome"],
];

const openingLabels = {
  main: ["Main Season", "09:30", "17:00"],
  "off-peak": ["Off Peak Weekdays", "09:30", "17:00"],
  winter: ["Winter Fun", "10:30", "16:30"],
  closed: ["Park Closed", null, null],
};

function q(value) {
  if (value === null || value === undefined || value === "") return "NULL";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function n(value) {
  return Number.isFinite(Number(value)) ? String(Number(value)) : "NULL";
}

function insert(table, columns, rows) {
  if (!rows.length) return "";
  return rows
    .map((row) => {
      const values = columns.map((column) => {
        const value = row[column];
        return typeof value === "number" ? n(value) : q(value);
      });
      return `INSERT OR IGNORE INTO ${table} (${columns.join(", ")}) VALUES (${values.join(", ")});`;
    })
    .join("\n");
}

function makeSeed({ includeLocalExamples = false } = {}) {
  const sql = [
    "-- Woodlands Cloudflare D1 seed data.",
    "-- Production-safe seed contains public content only and no default passwords.",
    "PRAGMA foreign_keys = ON;",
    "",
    insert("roles", ["id", "label"], roles.map(([id, label]) => ({ id, label }))),
    insert("departments", ["name", "description"], departments.map(([name, description]) => ({ name, description }))),
    insert(
      "ticket_types",
      ["slug", "name", "description", "price_label", "active", "sort_order"],
      ticketTypeSeedData.map((ticket, index) => ({
        slug: ticket.id,
        name: ticket.name,
        description: ticket.description,
        price_label: ticket.priceLabel,
        active: 1,
        sort_order: index + 1,
      })),
    ),
    insert(
      "pages",
      ["path", "title", "summary", "image", "source_url", "status"],
      allPages.map((page) => ({
        path: page.path,
        title: page.title,
        summary: page.summary || "",
        image: page.image || "",
        source_url: page.sourceUrl || "",
        status: "published",
      })),
    ),
  ];

  const pageSections = [];
  for (const page of allPages) {
    (page.sections || []).forEach((section, index) => {
      pageSections.push({
        page_path: page.path,
        title: section.title,
        body: section.body || (section.items || []).join("\n"),
        sort_order: index + 1,
      });
    });
  }
  sql.push(
    pageSections
      .map(
        (section) => `INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, ${q(section.title)}, ${q(section.body)}, ${n(section.sort_order)} FROM pages WHERE path = ${q(section.page_path)};`,
      )
      .join("\n"),
  );

  sql.push(
    insert(
      "events",
      ["path", "title", "event_date", "summary", "image", "source_url", "status"],
      [...eventCards, ...newsPosts].map((item) => ({
        path: item.path,
        title: item.title,
        event_date: item.date || "",
        summary: item.summary || "",
        image: item.image || "",
        source_url: item.sourceUrl || "",
        status: "published",
      })),
    ),
    insert(
      "attractions",
      ["path", "title", "zone_type", "summary", "image", "source_url", "status"],
      [
        ...explorePages.map((item) => ({ ...item, zone_type: "explore" })),
        ...zooPages.map((item) => ({ ...item, zone_type: "zoo-farm" })),
      ].map((item) => ({
        path: item.path,
        title: item.title,
        zone_type: item.zone_type,
        summary: item.summary,
        image: item.image,
        source_url: item.sourceUrl,
        status: "published",
      })),
    ),
  );

  const faqRows = [];
  let sort = 1;
  for (const group of faqGroups) {
    for (const item of group.items) {
      faqRows.push({
        group_title: group.title,
        question: item.question,
        answer: item.answer,
        sort_order: sort,
        active: 1,
      });
      sort += 1;
    }
  }
  sql.push(insert("faqs", ["group_title", "question", "answer", "sort_order", "active"], faqRows));

  const openingRows = [];
  for (const month of openingMonths) {
    for (const day of buildMonthDays(month).filter((cell) => !cell.blank)) {
      const [season_label, open_time, close_time] = openingLabels[day.status];
      openingRows.push({
        date: day.id,
        status: day.status,
        season_label,
        open_time,
        close_time,
        notes: "",
      });
    }
  }
  sql.push(insert("opening_times", ["date", "status", "season_label", "open_time", "close_time", "notes"], openingRows));

  sql.push(
    insert(
      "documents",
      ["title", "description", "local_path", "source_url", "page_paths"],
      documentDownloads.map((document) => ({
        title: document.title,
        description: document.description,
        local_path: document.localFile,
        source_url: document.sourceUrl,
        page_paths: JSON.stringify(document.pagePaths),
      })),
    ),
    insert(
      "footer_links",
      ["label", "path", "sort_order", "external"],
      footerLinks.map((link, index) => ({
        label: link.label,
        path: link.path,
        sort_order: index + 1,
        external: link.path.startsWith("http") ? 1 : 0,
      })),
    ),
    insert(
      "cafes",
      ["slug", "label", "description", "active"],
      foodMenuData.cafes.map((cafe) => ({
        slug: cafe.slug,
        label: cafe.label,
        description: "Woodlands cafe menu browsing",
        active: 1,
      })),
    ),
    insert(
      "menu_categories",
      ["name", "group_name", "theme", "display_order"],
      foodMenuData.categories.map((category) => ({
        name: category.name,
        group_name: category.groupName,
        theme: category.theme,
        display_order: category.displayOrder,
      })),
    ),
  );

  for (const item of foodMenuData.menuItems) {
    for (const cafeSlug of item.cafeSlugs) {
      sql.push(`INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, ${q(item.name)}, ${q(item.description)}, ${n(Math.round(Number(item.price || 0) * 100))}, ${q(item.image || "")}, 1
FROM cafes, menu_categories
WHERE cafes.slug = ${q(cafeSlug)} AND menu_categories.name = ${q(item.category)};`);
    }
  }

  sql.push(insert("allergens", ["name"], ["Milk", "Egg", "Gluten", "Soya", "Nuts", "Sulphites"].map((name) => ({ name }))));

  if (includeLocalExamples) {
    sql.push(
      "",
      "-- Local example rows. Passwords are intentionally omitted; create users with the bootstrap script/API.",
      insert("announcements", ["title", "body", "audience"], [
        {
          title: "Welcome to the Woodlands staff portal",
          body: "Staff announcements appear here after authorised publishing.",
          audience: "all",
        },
      ]),
      insert("staff_documents", ["title", "description", "document_type", "role_visibility", "is_sensitive"], [
        {
          title: "Staff Handbook",
          description: "Secure staff document access area.",
          document_type: "document",
          role_visibility: "staff",
          is_sensitive: 0,
        },
        {
          title: "Payslip Access",
          description: "Payslip records require secure payroll integration before use.",
          document_type: "payslip",
          role_visibility: "payroll_admin",
          is_sensitive: 1,
        },
      ]),
    );
  }

  return `${sql.filter(Boolean).join("\n\n")}\n`;
}

writeFileSync("seed-production-safe.sql", makeSeed());
writeFileSync("seed-local.sql", makeSeed({ includeLocalExamples: true }));
console.log("Generated seed-production-safe.sql and seed-local.sql");
