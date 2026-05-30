import { db } from "../db/connection.js";
import { fail, ok } from "../utils/responses.js";

export function subscribeNewsletter(req, res) {
  const { email, firstName, lastName } = req.body;
  try {
    db.prepare(`
      INSERT INTO newsletter_subscribers (email, first_name, last_name, status)
      VALUES (?, ?, ?, 'subscribed')
      ON CONFLICT(email) DO UPDATE SET
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        status = 'subscribed'
    `).run(email, String(firstName).trim(), String(lastName).trim());
    return ok(res, { message: "Thank you for signing up." });
  } catch {
    return fail(res, 500, "Newsletter signup could not be saved.");
  }
}

export function listFaqs(_req, res) {
  const rows = db.prepare("SELECT group_title, question, answer FROM faqs WHERE active = 1 ORDER BY sort_order, id").all();
  const groups = [];
  for (const row of rows) {
    let group = groups.find((item) => item.title === row.group_title);
    if (!group) {
      group = { title: row.group_title, items: [] };
      groups.push(group);
    }
    group.items.push({ question: row.question, answer: row.answer });
  }
  return ok(res, { groups });
}

export function listOpeningTimes(_req, res) {
  return ok(res, {
    openingTimes: db.prepare("SELECT date, status, season_label AS seasonLabel, open_time AS openTime, close_time AS closeTime, notes FROM opening_times ORDER BY date").all(),
  });
}

export function listDocuments(_req, res) {
  return ok(res, {
    documents: db.prepare("SELECT title, description, local_path AS localPath, page_paths AS pagePaths FROM documents ORDER BY title").all(),
  });
}
