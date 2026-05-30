import { db, now } from "../db/connection.js";
import { auditLog } from "../utils/audit.js";
import { ok } from "../utils/responses.js";

export function dashboard(_req, res) {
  const counts = {
    pages: db.prepare("SELECT COUNT(*) AS count FROM pages").get().count,
    events: db.prepare("SELECT COUNT(*) AS count FROM events").get().count,
    faqs: db.prepare("SELECT COUNT(*) AS count FROM faqs").get().count,
    bookings: db.prepare("SELECT COUNT(*) AS count FROM ticket_bookings").get().count,
    subscribers: db.prepare("SELECT COUNT(*) AS count FROM newsletter_subscribers").get().count,
    menuItems: db.prepare("SELECT COUNT(*) AS count FROM menu_items").get().count,
  };
  return ok(res, { counts });
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
