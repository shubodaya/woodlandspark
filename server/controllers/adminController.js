import { db, now } from "../db/connection.js";
import { auditLog } from "../utils/audit.js";
import { hashPassword } from "../utils/security.js";
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

export function dashboard(_req, res) {
  const counts = {
    pages: db.prepare("SELECT COUNT(*) AS count FROM pages").get().count,
    events: db.prepare("SELECT COUNT(*) AS count FROM events").get().count,
    faqs: db.prepare("SELECT COUNT(*) AS count FROM faqs").get().count,
    users: db.prepare("SELECT COUNT(*) AS count FROM users").get().count,
    bookings: db.prepare("SELECT COUNT(*) AS count FROM ticket_bookings").get().count,
    subscribers: db.prepare("SELECT COUNT(*) AS count FROM newsletter_subscribers").get().count,
    menuItems: db.prepare("SELECT COUNT(*) AS count FROM menu_items").get().count,
  };
  return ok(res, { counts });
}

export function listUsers(_req, res) {
  const users = db.prepare(`
    SELECT users.id, users.name, users.email, users.role, users.disabled_at, users.created_at, users.updated_at,
      employees.id AS employee_id, employees.department_id, employees.job_title, employees.employee_code, departments.name AS department_name
    FROM users
    LEFT JOIN employees ON employees.user_id = users.id
    LEFT JOIN departments ON departments.id = employees.department_id
    ORDER BY users.role, users.name
  `).all();
  const departments = db.prepare("SELECT id, name FROM departments ORDER BY name").all();
  return ok(res, { users, departments });
}

export function createUser(req, res) {
  if (!assertCanManageUsers(req, res)) return;
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const role = String(req.body.role || "").trim();
  const departmentId = req.body.departmentId ? Number(req.body.departmentId) : null;
  const jobTitle = String(req.body.jobTitle || role.replace("_", " ")).trim();

  if (!name || !email || !password || !canManageRole(req.user.role, role)) return fail(res, 400, "Name, email, password and a valid role are required.");
  const passwordError = passwordStrengthError(password, 14);
  if (passwordError) return fail(res, 400, passwordError);
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return fail(res, 409, "A user already exists for this email address.");

  const userId = db.transaction(() => {
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, email, hashPassword(password), role, now(), now());

    if (employeeRoles.has(role)) {
      const code = `${role.slice(0, 3).toUpperCase()}${String(result.lastInsertRowid).padStart(4, "0")}`;
      db.prepare(`
        INSERT INTO employees (user_id, department_id, job_title, employee_code)
        VALUES (?, ?, ?, ?)
      `).run(result.lastInsertRowid, departmentId, jobTitle, code);
    }
    return result.lastInsertRowid;
  })();

  auditLog(req.user.id, "admin.users.create", "users", userId, { role });
  return ok(res, { user: db.prepare("SELECT id, name, email, role, disabled_at, created_at, updated_at FROM users WHERE id = ?").get(userId) });
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
  return ok(res, { user: db.prepare("SELECT id, name, email, role, disabled_at, created_at, updated_at FROM users WHERE id = ?").get(userId) });
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
  db.prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?").run(hashPassword(password), now(), userId);
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
  auditLog(req.user.id, "admin.users.reset_password", "users", userId);
  return ok(res, { reset: true });
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
  return ok(res, {
    pages: db.prepare("SELECT * FROM pages ORDER BY path LIMIT 200").all(),
  });
}

export function updatePage(req, res) {
  const { title, summary, status } = req.body;
  db.prepare("UPDATE pages SET title = ?, summary = ?, status = ?, updated_at = ? WHERE id = ?").run(title, summary, status || "published", now(), req.params.id);
  auditLog(req.user.id, "admin.pages.update", "pages", req.params.id);
  return ok(res, { page: db.prepare("SELECT * FROM pages WHERE id = ?").get(req.params.id) });
}

export function listEvents(_req, res) {
  return ok(res, { events: db.prepare("SELECT * FROM events ORDER BY event_date, title").all() });
}

export function updateEvent(req, res) {
  const { title, event_date: eventDate, summary, status } = req.body;
  db.prepare("UPDATE events SET title = ?, event_date = ?, summary = ?, status = ?, updated_at = ? WHERE id = ?").run(title, eventDate || null, summary, status || "published", now(), req.params.id);
  auditLog(req.user.id, "admin.events.update", "events", req.params.id);
  return ok(res);
}

export function listFaqs(_req, res) {
  return ok(res, { faqs: db.prepare("SELECT * FROM faqs ORDER BY group_title, sort_order, id").all() });
}

export function updateFaq(req, res) {
  const { group_title: groupTitle, question, answer, active } = req.body;
  db.prepare("UPDATE faqs SET group_title = ?, question = ?, answer = ?, active = ?, updated_at = ? WHERE id = ?").run(groupTitle, question, answer, active ? 1 : 0, now(), req.params.id);
  auditLog(req.user.id, "admin.faqs.update", "faqs", req.params.id);
  return ok(res);
}

export function listOpeningTimes(_req, res) {
  return ok(res, { openingTimes: db.prepare("SELECT * FROM opening_times ORDER BY date").all() });
}

export function updateOpeningTime(req, res) {
  const { status, season_label: seasonLabel, open_time: openTime, close_time: closeTime, notes } = req.body;
  db.prepare("UPDATE opening_times SET status = ?, season_label = ?, open_time = ?, close_time = ?, notes = ?, updated_at = ? WHERE id = ?").run(status, seasonLabel, openTime || null, closeTime || null, notes || null, now(), req.params.id);
  auditLog(req.user.id, "admin.opening_times.update", "opening_times", req.params.id);
  return ok(res);
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

export function listDocuments(_req, res) {
  return ok(res, { documents: db.prepare("SELECT * FROM documents ORDER BY title").all() });
}

export function listNewsletterSubscribers(_req, res) {
  return ok(res, { subscribers: db.prepare("SELECT * FROM newsletter_subscribers ORDER BY created_at DESC").all() });
}

export function listTicketTypes(_req, res) {
  return ok(res, { ticketTypes: db.prepare("SELECT * FROM ticket_types ORDER BY sort_order, id").all() });
}

export function updateTicketType(req, res) {
  const { name, description, price_label: priceLabel, active } = req.body;
  db.prepare("UPDATE ticket_types SET name = ?, description = ?, price_label = ?, active = ?, updated_at = ? WHERE id = ?").run(name, description, priceLabel, active ? 1 : 0, now(), req.params.id);
  auditLog(req.user.id, "admin.ticket_types.update", "ticket_types", req.params.id);
  return ok(res);
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
