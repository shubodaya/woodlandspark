import { db, now } from "../db/connection.js";
import { auditLog } from "../utils/audit.js";
import { createToken, hashPassword, hashToken } from "../utils/security.js";
import { fail, ok } from "../utils/responses.js";

const userAdminRoles = new Set(["admin", "super_admin"]);
const manageableRoles = new Set(["editor", "staff", "supervisor", "manager", "payroll_admin", "admin"]);
const employeeRoles = new Set(["staff", "supervisor", "manager", "payroll_admin"]);

function passwordStrengthError(password, minLength = 14) {
  if (String(password || "").length < minLength) return `Password must be at least ${minLength} characters.`;
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must include a symbol.";
  return "";
}

function assertCanManageUsers(req, res) {
  if (!userAdminRoles.has(req.user.role)) {
    fail(res, 403, "Only admins can manage users.");
    return false;
  }
  return true;
}

function canManageRole(actorRole, role) {
  if (!manageableRoles.has(role)) return false;
  if (role === "admin" && actorRole !== "super_admin") return false;
  return true;
}

function activeAdminCount() {
  return db.prepare("SELECT COUNT(*) AS count FROM users WHERE role IN ('admin', 'super_admin') AND disabled_at IS NULL").get().count;
}

function publicBaseUrl(req) {
  return process.env.PUBLIC_SITE_URL || `${req.protocol}://${req.get("host")}`;
}

async function queueInviteEmail(req, userId, email, name, role, token) {
  const inviteUrl = `${publicBaseUrl(req)}/staff/invite/${token}`;
  const subject = "Your Woodlands staff portal invite";
  const body = [
    `Hello ${name},`,
    "",
    "Your Woodlands staff portal account has been created.",
    `Role: ${role}`,
    "",
    "Open this secure invite link to set your password and sign in:",
    inviteUrl,
    "",
    "This link is for the invited email address only.",
  ].join("\n");
  const result = db.prepare(`
    INSERT INTO email_outbox (to_email, subject, body, status)
    VALUES (?, ?, ?, 'queued')
  `).run(email, subject, body);

  if (process.env.EMAIL_WEBHOOK_URL) {
    try {
      const response = await fetch(process.env.EMAIL_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.EMAIL_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.EMAIL_WEBHOOK_TOKEN}` } : {}),
        },
        body: JSON.stringify({ to: email, subject, text: body, inviteUrl, name, role }),
      });
      db.prepare("UPDATE email_outbox SET status = ?, provider_response = ?, sent_at = ? WHERE id = ?")
        .run(response.ok ? "sent" : "failed", await response.text(), response.ok ? now() : null, result.lastInsertRowid);
    } catch (error) {
      db.prepare("UPDATE email_outbox SET status = 'failed', provider_response = ? WHERE id = ?").run(error.message, result.lastInsertRowid);
    }
  }

  auditLog(req.user.id, "admin.users.invite_email.queued", "users", userId, { outboxId: result.lastInsertRowid });
  return inviteUrl;
}

export function dashboard(_req, res) {
  const counts = {
    pages: db.prepare("SELECT COUNT(*) AS count FROM pages").get().count,
    sections: db.prepare("SELECT COUNT(*) AS count FROM page_sections").get().count,
    events: db.prepare("SELECT COUNT(*) AS count FROM events").get().count,
    faqs: db.prepare("SELECT COUNT(*) AS count FROM faqs").get().count,
    users: db.prepare("SELECT COUNT(*) AS count FROM users").get().count,
    shifts: db.prepare("SELECT COUNT(*) AS count FROM shifts").get().count,
    bookings: db.prepare("SELECT COUNT(*) AS count FROM ticket_bookings").get().count,
    subscribers: db.prepare("SELECT COUNT(*) AS count FROM newsletter_subscribers").get().count,
    menuItems: db.prepare("SELECT COUNT(*) AS count FROM menu_items").get().count,
  };
  return ok(res, { counts });
}

export function listUsers(_req, res) {
  const users = db.prepare(`
    SELECT users.id, users.name, users.email, users.role, users.disabled_at, users.must_reset_password, users.invite_sent_at, users.invite_accepted_at, users.created_at, users.updated_at,
      employees.id AS employee_id, employees.department_id, employees.job_title, employees.employee_code, departments.name AS department_name
    FROM users
    LEFT JOIN employees ON employees.user_id = users.id
    LEFT JOIN departments ON departments.id = employees.department_id
    ORDER BY users.role, users.name
  `).all();
  const departments = db.prepare("SELECT id, name FROM departments ORDER BY name").all();
  return ok(res, { users, departments });
}

export async function createUser(req, res) {
  if (!assertCanManageUsers(req, res)) return;
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const providedPassword = String(req.body.password || "");
  const role = String(req.body.role || "").trim();
  const departmentId = req.body.departmentId ? Number(req.body.departmentId) : null;
  const jobTitle = String(req.body.jobTitle || role.replace("_", " ")).trim();

  if (!name || !email || !canManageRole(req.user.role, role)) return fail(res, 400, "Name, email and a valid role are required.");
  if (providedPassword) {
    const passwordError = passwordStrengthError(providedPassword, 14);
    if (passwordError) return fail(res, 400, passwordError);
  }
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return fail(res, 409, "A user already exists for this email address.");

  const inviteToken = createToken();
  const inviteTokenHash = hashToken(inviteToken);
  const password = providedPassword || createToken();
  const userId = db.transaction(() => {
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, must_reset_password, invite_token_hash, invite_sent_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, hashPassword(password), role, providedPassword ? 1 : 0, inviteTokenHash, now(), now(), now());

    if (employeeRoles.has(role)) {
      const code = `${role.slice(0, 3).toUpperCase()}${String(result.lastInsertRowid).padStart(4, "0")}`;
      db.prepare(`
        INSERT INTO employees (user_id, department_id, job_title, employee_code)
        VALUES (?, ?, ?, ?)
      `).run(result.lastInsertRowid, departmentId, jobTitle, code);
    }
    return result.lastInsertRowid;
  })();

  const inviteUrl = await queueInviteEmail(req, userId, email, name, role, inviteToken);
  auditLog(req.user.id, "admin.users.create", "users", userId, { role });
  return ok(res, {
    user: db.prepare("SELECT id, name, email, role, disabled_at, must_reset_password, invite_sent_at, created_at, updated_at FROM users WHERE id = ?").get(userId),
    inviteUrl,
    emailStatus: process.env.EMAIL_WEBHOOK_URL ? "sent-or-queued" : "queued",
  });
}

export function updateUser(req, res) {
  if (!assertCanManageUsers(req, res)) return;
  const userId = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!existing) return fail(res, 404, "User not found.");
  const role = String(req.body.role || existing.role).trim();
  const roleChanged = role !== existing.role;
  if (roleChanged) {
    if (existing.role === "super_admin" || role === "super_admin") return fail(res, 403, "Super-admin accounts are managed through the first-admin setup process.");
    if (!canManageRole(req.user.role, role)) return fail(res, 403, "You do not have permission to assign that role.");
    if (existing.role === "admin" && req.user.role !== "super_admin") return fail(res, 403, "Only a super-admin can manage admin accounts.");
  }
  const disabled = Boolean(req.body.disabled);
  if (userId === req.user.id && disabled) return fail(res, 400, "You cannot disable your own account.");
  if (disabled && ["admin", "super_admin"].includes(existing.role)) {
    if (req.user.role !== "super_admin") return fail(res, 403, "Only a super-admin can disable admin accounts.");
    if (activeAdminCount() <= 1 && !existing.disabled_at) return fail(res, 400, "At least one active admin account is required.");
  }

  const name = String(req.body.name || existing.name).trim();
  const departmentId = req.body.departmentId ? Number(req.body.departmentId) : null;
  const jobTitle = String(req.body.jobTitle || role.replace("_", " ")).trim();

  db.transaction(() => {
    db.prepare("UPDATE users SET name = ?, role = ?, disabled_at = ?, updated_at = ? WHERE id = ?")
      .run(name, role, disabled ? (existing.disabled_at || now()) : null, now(), userId);

    const employee = db.prepare("SELECT id FROM employees WHERE user_id = ?").get(userId);
    if (employeeRoles.has(role)) {
      if (employee) {
        db.prepare("UPDATE employees SET department_id = ?, job_title = ? WHERE user_id = ?").run(departmentId, jobTitle, userId);
      } else {
        const code = `${role.slice(0, 3).toUpperCase()}${String(userId).padStart(4, "0")}`;
        db.prepare("INSERT INTO employees (user_id, department_id, job_title, employee_code) VALUES (?, ?, ?, ?)")
          .run(userId, departmentId, jobTitle, code);
      }
    }
  })();

  auditLog(req.user.id, "admin.users.update", "users", userId, { role, disabled });
  return ok(res, { user: db.prepare("SELECT id, name, email, role, disabled_at, must_reset_password, invite_sent_at, invite_accepted_at, created_at, updated_at FROM users WHERE id = ?").get(userId) });
}

export function resetUserPassword(req, res) {
  if (!assertCanManageUsers(req, res)) return;
  const userId = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!existing) return fail(res, 404, "User not found.");
  if (existing.role === "super_admin") return fail(res, 403, "Super-admin passwords must be reset through a secure recovery process.");
  if (existing.role === "admin" && req.user.role !== "super_admin") return fail(res, 403, "Only a super-admin can reset admin passwords.");
  const password = String(req.body.password || "");
  const passwordError = passwordStrengthError(password, 14);
  if (passwordError) return fail(res, 400, passwordError);
  db.prepare("UPDATE users SET password_hash = ?, must_reset_password = 1, updated_at = ? WHERE id = ?").run(hashPassword(password), now(), userId);
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
  auditLog(req.user.id, "admin.users.reset_password", "users", userId);
  return ok(res, { reset: true });
}

export async function resendUserInvite(req, res) {
  if (!assertCanManageUsers(req, res)) return;
  const userId = Number(req.params.id);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user) return fail(res, 404, "User not found.");
  if (user.role === "super_admin") return fail(res, 403, "Super-admin accounts cannot be invited from user management.");
  if (user.role === "admin" && req.user.role !== "super_admin") return fail(res, 403, "Only a super-admin can invite admin accounts.");
  const inviteToken = createToken();
  db.prepare("UPDATE users SET invite_token_hash = ?, invite_sent_at = ?, invite_accepted_at = NULL, updated_at = ? WHERE id = ?")
    .run(hashToken(inviteToken), now(), now(), userId);
  const inviteUrl = await queueInviteEmail(req, userId, user.email, user.name, user.role, inviteToken);
  auditLog(req.user.id, "admin.users.invite.resend", "users", userId);
  return ok(res, { inviteUrl, emailStatus: process.env.EMAIL_WEBHOOK_URL ? "sent-or-queued" : "queued" });
}

export function listAuditLogs(_req, res) {
  const logs = db.prepare(`
    SELECT audit_logs.*, users.name AS user_name, users.email AS user_email
    FROM audit_logs
    LEFT JOIN users ON users.id = audit_logs.user_id
    ORDER BY audit_logs.created_at DESC, audit_logs.id DESC
    LIMIT 200
  `).all();
  return ok(res, { auditLogs: logs });
}

export function listPages(_req, res) {
  const pages = db.prepare("SELECT * FROM pages ORDER BY path LIMIT 500").all();
  const sections = db.prepare("SELECT * FROM page_sections ORDER BY sort_order, id").all();
  const sectionsByPage = new Map();
  for (const section of sections) {
    const list = sectionsByPage.get(section.page_id) || [];
    list.push(section);
    sectionsByPage.set(section.page_id, list);
  }
  return ok(res, {
    pages: pages.map((page) => ({ ...page, sections: sectionsByPage.get(page.id) || [] })),
  });
}

export function createPage(req, res) {
  const path = String(req.body.path || "").trim();
  const title = String(req.body.title || "").trim();
  if (!path || !title) return fail(res, 400, "Path and title are required.");
  const result = db.prepare(`
    INSERT INTO pages (path, title, summary, image, source_url, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(path.startsWith("/") ? path : `/${path}`, title, req.body.summary || "", req.body.image || "", req.body.source_url || "", req.body.status || "draft", now(), now());
  auditLog(req.user.id, "admin.pages.create", "pages", result.lastInsertRowid);
  return ok(res, { page: { ...db.prepare("SELECT * FROM pages WHERE id = ?").get(result.lastInsertRowid), sections: [] } });
}

export function updatePage(req, res) {
  const { title, summary, status, image, source_url: sourceUrl } = req.body;
  db.prepare("UPDATE pages SET title = ?, summary = ?, image = ?, source_url = ?, status = ?, updated_at = ? WHERE id = ?")
    .run(title, summary || "", image || "", sourceUrl || "", status || "published", now(), req.params.id);
  auditLog(req.user.id, "admin.pages.update", "pages", req.params.id);
  return ok(res, { page: db.prepare("SELECT * FROM pages WHERE id = ?").get(req.params.id) });
}

export function deletePage(req, res) {
  db.prepare("DELETE FROM pages WHERE id = ?").run(req.params.id);
  auditLog(req.user.id, "admin.pages.delete", "pages", req.params.id);
  return ok(res, { deleted: true });
}

export function createPageSection(req, res) {
  const pageId = Number(req.params.id);
  const title = String(req.body.title || "").trim();
  if (!title) return fail(res, 400, "Section title is required.");
  const result = db.prepare("INSERT INTO page_sections (page_id, title, body, sort_order) VALUES (?, ?, ?, ?)")
    .run(pageId, title, req.body.body || "", Number(req.body.sort_order || req.body.sortOrder || 0));
  auditLog(req.user.id, "admin.page_sections.create", "page_sections", result.lastInsertRowid);
  return ok(res, { section: db.prepare("SELECT * FROM page_sections WHERE id = ?").get(result.lastInsertRowid) });
}

export function updatePageSection(req, res) {
  const sectionId = Number(req.params.sectionId);
  db.prepare("UPDATE page_sections SET title = ?, body = ?, sort_order = ? WHERE id = ?")
    .run(req.body.title, req.body.body || "", Number(req.body.sort_order || req.body.sortOrder || 0), sectionId);
  auditLog(req.user.id, "admin.page_sections.update", "page_sections", sectionId);
  return ok(res, { section: db.prepare("SELECT * FROM page_sections WHERE id = ?").get(sectionId) });
}

export function deletePageSection(req, res) {
  db.prepare("DELETE FROM page_sections WHERE id = ?").run(req.params.sectionId);
  auditLog(req.user.id, "admin.page_sections.delete", "page_sections", req.params.sectionId);
  return ok(res, { deleted: true });
}

export function listEvents(_req, res) {
  return ok(res, { events: db.prepare("SELECT * FROM events ORDER BY event_date, title").all() });
}

export function createEvent(req, res) {
  const title = String(req.body.title || "").trim();
  const path = String(req.body.path || `/events/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`).trim();
  if (!title) return fail(res, 400, "Event title is required.");
  const result = db.prepare(`
    INSERT INTO events (path, title, event_date, summary, image, source_url, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(path.startsWith("/") ? path : `/${path}`, title, req.body.event_date || null, req.body.summary || "", req.body.image || "", req.body.source_url || "", req.body.status || "draft", now(), now());
  auditLog(req.user.id, "admin.events.create", "events", result.lastInsertRowid);
  return ok(res, { event: db.prepare("SELECT * FROM events WHERE id = ?").get(result.lastInsertRowid) });
}

export function updateEvent(req, res) {
  const { title, event_date: eventDate, summary, status, image, source_url: sourceUrl, path } = req.body;
  db.prepare("UPDATE events SET path = ?, title = ?, event_date = ?, summary = ?, image = ?, source_url = ?, status = ?, updated_at = ? WHERE id = ?")
    .run(path, title, eventDate || null, summary || "", image || "", sourceUrl || "", status || "published", now(), req.params.id);
  auditLog(req.user.id, "admin.events.update", "events", req.params.id);
  return ok(res);
}

export function deleteEvent(req, res) {
  db.prepare("DELETE FROM events WHERE id = ?").run(req.params.id);
  auditLog(req.user.id, "admin.events.delete", "events", req.params.id);
  return ok(res, { deleted: true });
}

export function listFaqs(_req, res) {
  return ok(res, { faqs: db.prepare("SELECT * FROM faqs ORDER BY group_title, sort_order, id").all() });
}

export function createFaq(req, res) {
  const groupTitle = String(req.body.group_title || req.body.groupTitle || "General").trim();
  const question = String(req.body.question || "").trim();
  const answer = String(req.body.answer || "").trim();
  if (!question || !answer) return fail(res, 400, "Question and answer are required.");
  const result = db.prepare("INSERT INTO faqs (group_title, question, answer, sort_order, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(groupTitle, question, answer, Number(req.body.sort_order || req.body.sortOrder || 0), req.body.active === false ? 0 : 1, now(), now());
  auditLog(req.user.id, "admin.faqs.create", "faqs", result.lastInsertRowid);
  return ok(res, { faq: db.prepare("SELECT * FROM faqs WHERE id = ?").get(result.lastInsertRowid) });
}

export function updateFaq(req, res) {
  const { group_title: groupTitle, question, answer, active } = req.body;
  db.prepare("UPDATE faqs SET group_title = ?, question = ?, answer = ?, active = ?, updated_at = ? WHERE id = ?").run(groupTitle, question, answer, active ? 1 : 0, now(), req.params.id);
  auditLog(req.user.id, "admin.faqs.update", "faqs", req.params.id);
  return ok(res);
}

export function deleteFaq(req, res) {
  db.prepare("DELETE FROM faqs WHERE id = ?").run(req.params.id);
  auditLog(req.user.id, "admin.faqs.delete", "faqs", req.params.id);
  return ok(res, { deleted: true });
}

export function listOpeningTimes(_req, res) {
  return ok(res, { openingTimes: db.prepare("SELECT * FROM opening_times ORDER BY date").all() });
}

export function createOpeningTime(req, res) {
  const date = String(req.body.date || "").trim();
  if (!date) return fail(res, 400, "Date is required.");
  const result = db.prepare("INSERT INTO opening_times (date, status, season_label, open_time, close_time, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(date, req.body.status || "closed", req.body.season_label || req.body.seasonLabel || "Park Closed", req.body.open_time || null, req.body.close_time || null, req.body.notes || null, now());
  auditLog(req.user.id, "admin.opening_times.create", "opening_times", result.lastInsertRowid);
  return ok(res, { openingTime: db.prepare("SELECT * FROM opening_times WHERE id = ?").get(result.lastInsertRowid) });
}

export function updateOpeningTime(req, res) {
  const { status, season_label: seasonLabel, open_time: openTime, close_time: closeTime, notes } = req.body;
  db.prepare("UPDATE opening_times SET status = ?, season_label = ?, open_time = ?, close_time = ?, notes = ?, updated_at = ? WHERE id = ?").run(status, seasonLabel, openTime || null, closeTime || null, notes || null, now(), req.params.id);
  auditLog(req.user.id, "admin.opening_times.update", "opening_times", req.params.id);
  return ok(res);
}

export function deleteOpeningTime(req, res) {
  db.prepare("DELETE FROM opening_times WHERE id = ?").run(req.params.id);
  auditLog(req.user.id, "admin.opening_times.delete", "opening_times", req.params.id);
  return ok(res, { deleted: true });
}

export function listMedia(_req, res) {
  return ok(res, { media: db.prepare("SELECT * FROM media_assets ORDER BY created_at DESC LIMIT 200").all() });
}

export function uploadMedia(req, res) {
  const title = req.body.title || req.file.originalname;
  const result = db.prepare(`
    INSERT INTO media_assets (title, filename, path, mime_type, type, alt_text, usage)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, req.file.filename, `/uploads/${req.file.filename}`, req.file.mimetype, req.file.mimetype.startsWith("image/") ? "image" : "file", req.body.altText || "", req.body.usage || "admin upload");
  auditLog(req.user.id, "admin.media.upload", "media_assets", result.lastInsertRowid);
  return ok(res, { media: db.prepare("SELECT * FROM media_assets WHERE id = ?").get(result.lastInsertRowid) });
}

export function updateMedia(req, res) {
  db.prepare("UPDATE media_assets SET title = ?, alt_text = ?, usage = ? WHERE id = ?")
    .run(req.body.title, req.body.alt_text || req.body.altText || "", req.body.usage || "", req.params.id);
  auditLog(req.user.id, "admin.media.update", "media_assets", req.params.id);
  return ok(res, { media: db.prepare("SELECT * FROM media_assets WHERE id = ?").get(req.params.id) });
}

export function deleteMedia(req, res) {
  db.prepare("DELETE FROM media_assets WHERE id = ?").run(req.params.id);
  auditLog(req.user.id, "admin.media.delete", "media_assets", req.params.id);
  return ok(res, { deleted: true });
}

export function listDocuments(_req, res) {
  return ok(res, { documents: db.prepare("SELECT * FROM documents ORDER BY title").all() });
}

export function createDocument(req, res) {
  const title = String(req.body.title || "").trim();
  const localPath = String(req.body.local_path || req.body.localPath || "").trim();
  if (!title || !localPath) return fail(res, 400, "Title and local path are required.");
  const result = db.prepare("INSERT INTO documents (title, description, local_path, source_url, page_paths, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(title, req.body.description || "", localPath, req.body.source_url || req.body.sourceUrl || "", req.body.page_paths || req.body.pagePaths || "", now());
  auditLog(req.user.id, "admin.documents.create", "documents", result.lastInsertRowid);
  return ok(res, { document: db.prepare("SELECT * FROM documents WHERE id = ?").get(result.lastInsertRowid) });
}

export function updateDocument(req, res) {
  db.prepare("UPDATE documents SET title = ?, description = ?, local_path = ?, source_url = ?, page_paths = ? WHERE id = ?")
    .run(req.body.title, req.body.description || "", req.body.local_path || req.body.localPath || "", req.body.source_url || req.body.sourceUrl || "", req.body.page_paths || req.body.pagePaths || "", req.params.id);
  auditLog(req.user.id, "admin.documents.update", "documents", req.params.id);
  return ok(res, { document: db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id) });
}

export function deleteDocument(req, res) {
  db.prepare("DELETE FROM documents WHERE id = ?").run(req.params.id);
  auditLog(req.user.id, "admin.documents.delete", "documents", req.params.id);
  return ok(res, { deleted: true });
}

export function listNewsletterSubscribers(_req, res) {
  return ok(res, { subscribers: db.prepare("SELECT * FROM newsletter_subscribers ORDER BY created_at DESC").all() });
}

export function createNewsletterSubscriber(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!email) return fail(res, 400, "Email is required.");
  const result = db.prepare("INSERT INTO newsletter_subscribers (email, first_name, last_name, status, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(email, req.body.first_name || req.body.firstName || "", req.body.last_name || req.body.lastName || "", req.body.status || "subscribed", now());
  auditLog(req.user.id, "admin.newsletter.create", "newsletter_subscribers", result.lastInsertRowid);
  return ok(res, { subscriber: db.prepare("SELECT * FROM newsletter_subscribers WHERE id = ?").get(result.lastInsertRowid) });
}

export function updateNewsletterSubscriber(req, res) {
  db.prepare("UPDATE newsletter_subscribers SET email = ?, first_name = ?, last_name = ?, status = ? WHERE id = ?")
    .run(req.body.email, req.body.first_name || req.body.firstName || "", req.body.last_name || req.body.lastName || "", req.body.status || "subscribed", req.params.id);
  auditLog(req.user.id, "admin.newsletter.update", "newsletter_subscribers", req.params.id);
  return ok(res, { subscriber: db.prepare("SELECT * FROM newsletter_subscribers WHERE id = ?").get(req.params.id) });
}

export function deleteNewsletterSubscriber(req, res) {
  db.prepare("DELETE FROM newsletter_subscribers WHERE id = ?").run(req.params.id);
  auditLog(req.user.id, "admin.newsletter.delete", "newsletter_subscribers", req.params.id);
  return ok(res, { deleted: true });
}

export function listTicketTypes(_req, res) {
  return ok(res, { ticketTypes: db.prepare("SELECT * FROM ticket_types ORDER BY sort_order, id").all() });
}

export function createTicketType(req, res) {
  const slug = String(req.body.slug || req.body.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const name = String(req.body.name || "").trim();
  if (!slug || !name) return fail(res, 400, "Slug and name are required.");
  const result = db.prepare("INSERT INTO ticket_types (slug, name, description, price_label, price_pence, active, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .run(slug, name, req.body.description || "", req.body.price_label || req.body.priceLabel || "", req.body.price_pence || req.body.pricePence || null, req.body.active === false ? 0 : 1, Number(req.body.sort_order || req.body.sortOrder || 0), now(), now());
  auditLog(req.user.id, "admin.ticket_types.create", "ticket_types", result.lastInsertRowid);
  return ok(res, { ticketType: db.prepare("SELECT * FROM ticket_types WHERE id = ?").get(result.lastInsertRowid) });
}

export function updateTicketType(req, res) {
  const { slug, name, description, price_label: priceLabel, active, sort_order: sortOrder } = req.body;
  db.prepare("UPDATE ticket_types SET slug = ?, name = ?, description = ?, price_label = ?, active = ?, sort_order = ?, updated_at = ? WHERE id = ?")
    .run(slug, name, description || "", priceLabel || req.body.priceLabel || "", active ? 1 : 0, Number(sortOrder || req.body.sortOrder || 0), now(), req.params.id);
  auditLog(req.user.id, "admin.ticket_types.update", "ticket_types", req.params.id);
  return ok(res);
}

export function deleteTicketType(req, res) {
  db.prepare("DELETE FROM ticket_types WHERE id = ?").run(req.params.id);
  auditLog(req.user.id, "admin.ticket_types.delete", "ticket_types", req.params.id);
  return ok(res, { deleted: true });
}

export function listTicketBookings(_req, res) {
  const bookings = db.prepare(`
    SELECT ticket_bookings.*, users.name AS user_name, users.email AS user_email
    FROM ticket_bookings
    LEFT JOIN users ON users.id = ticket_bookings.user_id
    ORDER BY ticket_bookings.created_at DESC
  `).all();
  return ok(res, { bookings });
}
