import { db, now } from "../db/connection.js";
import { hashPassword } from "../utils/security.js";
import {
  allPages,
  eventCards,
  explorePages,
  footerLinks,
  newsPosts,
  zooPages,
} from "../../src/data/siteData.js";
import { ticketTypeSeedData } from "../../src/data/tickets/ticketing.js";
import { faqGroups } from "../../src/data/faqs/faqs.js";
import { openingMonths, buildMonthDays, openingTimesSource } from "../../src/data/openingTimes.js";
import { documentDownloads } from "../../src/data/documents.js";
import { foodMenuData } from "../../src/data/food/menuData.js";

function clearTables() {
  db.exec(`
    DELETE FROM audit_logs;
    DELETE FROM payslip_placeholders;
    DELETE FROM staff_documents;
    DELETE FROM announcements;
    DELETE FROM rota_assignments;
    DELETE FROM shifts;
    DELETE FROM employees;
    DELETE FROM departments;
    DELETE FROM availability;
    DELETE FROM menu_item_allergens;
    DELETE FROM allergens;
    DELETE FROM menu_items;
    DELETE FROM menu_categories;
    DELETE FROM cafes;
    DELETE FROM newsletter_subscribers;
    DELETE FROM footer_links;
    DELETE FROM documents;
    DELETE FROM media_assets;
    DELETE FROM opening_times;
    DELETE FROM faqs;
    DELETE FROM attractions;
    DELETE FROM events;
    DELETE FROM page_sections;
    DELETE FROM pages;
    DELETE FROM ticket_booking_items;
    DELETE FROM ticket_bookings;
    DELETE FROM ticket_customers;
    DELETE FROM ticket_types;
    DELETE FROM sessions;
    DELETE FROM users;
    DELETE FROM roles;
  `);
}

function insertRoles() {
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
  const stmt = db.prepare("INSERT INTO roles (id, label) VALUES (?, ?)");
  roles.forEach((role) => stmt.run(...role));
}

function insertUser(name, email, password, role) {
  return db.prepare(`
    INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, email, hashPassword(password), role, now(), now()).lastInsertRowid;
}

function seedUsersAndStaff() {
  const departments = [
    ["Rangers", "Rides, attractions and guest safety"],
    ["Zoo Farm", "Animal care and visitor talks"],
    ["Catering", "Cafes, diners and food service"],
    ["Admissions", "Entrance kiosks and guest welcome"],
  ];
  const departmentStmt = db.prepare("INSERT INTO departments (name, description) VALUES (?, ?)");
  departments.forEach((department) => departmentStmt.run(...department));
  const departmentMap = Object.fromEntries(db.prepare("SELECT id, name FROM departments").all().map((row) => [row.name, row.id]));

  if (process.env.WOODLANDS_SEED_EXAMPLE_USERS !== "true") {
    return {
      adminId: null,
      editorId: null,
      customerId: null,
      staffId: null,
      supervisorId: null,
      managerId: null,
      departmentMap,
      hasSeedUsers: false,
    };
  }

  const requiredPasswords = {
    admin: process.env.WOODLANDS_SEED_ADMIN_PASSWORD,
    editor: process.env.WOODLANDS_SEED_EDITOR_PASSWORD,
    customer: process.env.WOODLANDS_SEED_CUSTOMER_PASSWORD,
    staff: process.env.WOODLANDS_SEED_STAFF_PASSWORD,
    supervisor: process.env.WOODLANDS_SEED_SUPERVISOR_PASSWORD,
    manager: process.env.WOODLANDS_SEED_MANAGER_PASSWORD,
  };

  for (const [key, value] of Object.entries(requiredPasswords)) {
    if (!value || value.length < 14) {
      throw new Error(`WOODLANDS_SEED_${key.toUpperCase()}_PASSWORD must be set to at least 14 characters when WOODLANDS_SEED_EXAMPLE_USERS=true.`);
    }
  }

  const adminId = insertUser("Woodlands Admin", "admin@woodlands.local", requiredPasswords.admin, "admin");
  const editorId = insertUser("Woodlands Editor", "editor@woodlands.local", requiredPasswords.editor, "editor");
  const customerId = insertUser("Woodlands Customer", "customer@woodlands.local", requiredPasswords.customer, "customer");
  const staffId = insertUser("Woodlands Ranger", "staff@woodlands.local", requiredPasswords.staff, "staff");
  const supervisorId = insertUser("Woodlands Supervisor", "supervisor@woodlands.local", requiredPasswords.supervisor, "supervisor");
  const managerId = insertUser("Woodlands Manager", "manager@woodlands.local", requiredPasswords.manager, "manager");

  db.prepare("INSERT INTO ticket_customers (user_id, name, email) VALUES (?, ?, ?)").run(customerId, "Woodlands Customer", "customer@woodlands.local");

  const employeeStmt = db.prepare(`
    INSERT INTO employees (user_id, department_id, job_title, employee_code)
    VALUES (?, ?, ?, ?)
  `);
  employeeStmt.run(staffId, departmentMap.Rangers, "Ranger", "RNG001");
  employeeStmt.run(supervisorId, departmentMap.Rangers, "Ranger Supervisor", "SUP001");
  employeeStmt.run(managerId, departmentMap.Admissions, "Park Manager", "MGR001");

  return { adminId, editorId, customerId, staffId, supervisorId, managerId, departmentMap, hasSeedUsers: true };
}

function seedTickets() {
  const stmt = db.prepare(`
    INSERT INTO ticket_types (slug, name, description, price_label, price_pence, active, sort_order)
    VALUES (?, ?, ?, ?, ?, 1, ?)
  `);
  ticketTypeSeedData.forEach((ticket, index) => {
    stmt.run(ticket.id, ticket.name, ticket.description, ticket.priceLabel, null, index + 1);
  });
}

function seedCms() {
  const pageStmt = db.prepare(`
    INSERT INTO pages (path, title, summary, image, source_url, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'published', ?, ?)
  `);
  const sectionStmt = db.prepare("INSERT INTO page_sections (page_id, title, body, sort_order) VALUES (?, ?, ?, ?)");
  for (const page of allPages) {
    const pageId = pageStmt.run(page.path, page.title, page.summary || "", page.image || "", page.sourceUrl || "", now(), now()).lastInsertRowid;
    (page.sections || []).forEach((section, index) => {
      sectionStmt.run(pageId, section.title, section.body || (section.items || []).join("\n"), index + 1);
    });
  }

  const eventStmt = db.prepare(`
    INSERT INTO events (path, title, event_date, summary, image, source_url, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?)
  `);
  eventCards.forEach((event) => eventStmt.run(event.path, event.title, event.date, event.summary, event.image, event.sourceUrl, now(), now()));
  newsPosts.forEach((post) => eventStmt.run(post.path, post.title, post.date, post.summary, post.image, post.sourceUrl, now(), now()));

  const attractionStmt = db.prepare(`
    INSERT INTO attractions (path, title, zone_type, summary, image, source_url, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?)
  `);
  explorePages.forEach((item) => attractionStmt.run(item.path, item.title, "explore", item.summary, item.image, item.sourceUrl, now(), now()));
  zooPages.forEach((item) => attractionStmt.run(item.path, item.title, "zoo-farm", item.summary, item.image, item.sourceUrl, now(), now()));

  const faqStmt = db.prepare("INSERT INTO faqs (group_title, question, answer, sort_order, active) VALUES (?, ?, ?, ?, 1)");
  let sort = 1;
  for (const group of faqGroups) {
    for (const item of group.items) {
      faqStmt.run(group.title, item.question, item.answer, sort);
      sort += 1;
    }
  }

  const openingStmt = db.prepare(`
    INSERT INTO opening_times (date, status, season_label, open_time, close_time, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const labels = {
    main: ["Main Season", "09:30", "17:00"],
    "off-peak": ["Off Peak Weekdays", "09:30", "17:00"],
    winter: ["Winter Fun", "10:30", "16:30"],
    closed: ["Park Closed", null, null],
  };
  for (const month of openingMonths) {
    for (const day of buildMonthDays(month).filter((cell) => !cell.blank)) {
      const [label, openTime, closeTime] = labels[day.status];
      openingStmt.run(day.id, day.status, label, openTime, closeTime, openingTimesSource.oldPageText.join("\n\n"));
    }
  }

  const documentStmt = db.prepare(`
    INSERT INTO documents (title, description, local_path, source_url, page_paths)
    VALUES (?, ?, ?, ?, ?)
  `);
  documentDownloads.forEach((document) => documentStmt.run(document.title, document.description, document.localFile, document.sourceUrl, JSON.stringify(document.pagePaths)));

  const footerStmt = db.prepare("INSERT INTO footer_links (label, path, sort_order, external) VALUES (?, ?, ?, ?)");
  footerLinks.forEach((link, index) => footerStmt.run(link.label, link.path, index + 1, link.path.startsWith("http") ? 1 : 0));

  const mediaStmt = db.prepare(`
    INSERT INTO media_assets (title, filename, path, mime_type, type, alt_text, source_url, usage)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  [
    ["Hero Girl Mascot", "hero-girl.png", "src/assets/images/old-site/hero-girl.png", "image/png", "image", "Woodlands superhero girl mascot", "Landing page hero"],
    ["Hero Boy Mascot", "hero-boy.png", "src/assets/images/old-site/hero-boy.png", "image/png", "image", "Woodlands superhero boy mascot", "Landing page hero"],
    ["Birthday CTA Banner", "woodlands-birthdays.png", "src/assets/images/old-site/woodlands-birthdays.png", "image/png", "image", "Bring your birthday to Woodlands banner", "Footer CTA"],
  ].forEach((media) => mediaStmt.run(media[0], media[1], media[2], media[3], media[4], media[5], "", media[6]));
}

function seedFood() {
  const cafeStmt = db.prepare("INSERT INTO cafes (slug, label, description, active) VALUES (?, ?, ?, 1)");
  foodMenuData.cafes.forEach((cafe) => cafeStmt.run(cafe.slug, cafe.label, "Woodlands cafe menu browsing"));
  const cafeMap = Object.fromEntries(db.prepare("SELECT id, slug FROM cafes").all().map((row) => [row.slug, row.id]));

  const categoryStmt = db.prepare("INSERT INTO menu_categories (name, group_name, theme, display_order) VALUES (?, ?, ?, ?)");
  foodMenuData.categories.forEach((category) => categoryStmt.run(category.name, category.groupName, category.theme, category.displayOrder));
  const categoryMap = Object.fromEntries(db.prepare("SELECT id, name FROM menu_categories").all().map((row) => [row.name, row.id]));

  const itemStmt = db.prepare(`
    INSERT INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `);
  for (const item of foodMenuData.menuItems) {
    for (const cafeSlug of item.cafeSlugs) {
      itemStmt.run(cafeMap[cafeSlug], categoryMap[item.category], item.name, item.description, Math.round(Number(item.price || 0) * 100), item.image);
    }
  }

  ["Milk", "Egg", "Gluten", "Soya", "Nuts", "Sulphites"].forEach((name) => {
    db.prepare("INSERT INTO allergens (name) VALUES (?)").run(name);
  });

  db.prepare("INSERT INTO newsletter_subscribers (email, first_name, last_name) VALUES (?, ?, ?)").run("subscriber@woodlands.local", "Woodlands", "Subscriber");
}

function seedStaffData(ids) {
  const rangerEmployee = db.prepare("SELECT id FROM employees WHERE employee_code = 'RNG001'").get();
  const supervisorEmployee = db.prepare("SELECT id FROM employees WHERE employee_code = 'SUP001'").get();
  const managerEmployee = db.prepare("SELECT id FROM employees WHERE employee_code = 'MGR001'").get();

  const shiftStmt = db.prepare(`
    INSERT INTO shifts (department_id, title, date, start_time, end_time, location, status, break_minutes, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'scheduled', ?, ?)
  `);
  const shifts = [
    [ids.departmentMap.Rangers, "Rides & Attractions Cover", "2026-06-01", "09:00", "17:30", "Main park", 30, rangerEmployee?.id],
    [ids.departmentMap["Zoo Farm"], "Animal Activities", "2026-06-02", "08:30", "16:30", "Zoo Farm", 30, supervisorEmployee?.id],
    [ids.departmentMap.Catering, "Ray's Diner Service", "2026-06-03", "10:00", "18:00", "Empire of the Sea Dragon", 30, managerEmployee?.id],
  ];
  for (const shift of shifts) {
    const shiftId = shiftStmt.run(...shift.slice(0, 7), now()).lastInsertRowid;
    if (shift[7]) {
      db.prepare("INSERT INTO rota_assignments (shift_id, employee_id, role) VALUES (?, ?, ?)").run(shiftId, shift[7], shift[1]);
    }
  }

  db.prepare("INSERT INTO announcements (title, body, audience, created_by) VALUES (?, ?, 'all', ?)").run(
    "Welcome to the Woodlands staff portal",
    "Staff announcements and operational updates appear here after authorised publishing.",
    ids.adminId || null,
  );
  db.prepare("INSERT INTO announcements (title, body, audience, created_by) VALUES (?, ?, 'manager', ?)").run(
    "Manager rota review",
    "Review staffing levels before publishing peak-season shifts.",
    ids.adminId || null,
  );

  db.prepare(`
    INSERT INTO staff_documents (title, description, document_type, role_visibility, is_sensitive)
    VALUES (?, ?, ?, ?, ?)
  `).run("Staff Handbook", "Secure staff document access area.", "document", "staff", 0);
  db.prepare(`
    INSERT INTO staff_documents (title, description, document_type, role_visibility, is_sensitive)
    VALUES (?, ?, ?, ?, ?)
  `).run("Payslip Access", "Payslip records require secure payroll integration before use.", "payslip", "payroll_admin", 1);

  db.prepare(`
    INSERT INTO payslip_placeholders (employee_id, period_label, status, notes)
    VALUES (?, ?, 'placeholder', ?)
  `).run(rangerEmployee?.id || null, "May 2026", "No payslip file is stored until secure payroll integration is approved.");
}

const run = db.transaction(() => {
  clearTables();
  insertRoles();
  const ids = seedUsersAndStaff();
  seedTickets();
  seedCms();
  seedFood();
  seedStaffData(ids);
  db.prepare("INSERT INTO audit_logs (user_id, action, entity_type, metadata) VALUES (?, 'db.seed', 'system', ?)").run(ids.adminId || null, JSON.stringify({ seededAt: now(), usersSeeded: ids.hasSeedUsers }));
});

run();
console.log("Database seed complete.");
