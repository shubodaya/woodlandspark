const adminRoles = ["admin", "editor", "super_admin"];
const staffRoles = ["staff", "supervisor", "manager", "payroll_admin", "super_admin", "admin"];
const managerRoles = ["manager", "supervisor", "admin", "super_admin"];

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const route = url.pathname.replace(/^\/api\/?/, "").replace(/\/$/, "");

  try {
    if (!env.DB) return json({ ok: false, error: "Database binding is not configured." }, 503);
    if (request.method !== "GET" && request.method !== "HEAD") {
      const csrf = validateOrigin(request, env);
      if (csrf) return csrf;
    }

    if (route === "health" && request.method === "GET") return json({ ok: true, data: { service: "woodlands-api", runtime: "cloudflare-pages-functions" } });

    if (route === "auth/register" && request.method === "POST") return register(request, env);
    if (route === "auth/login" && request.method === "POST") return login(request, env);
    if (route === "auth/logout" && request.method === "POST") return logout(request, env);
    if (route === "auth/me" && request.method === "GET") return me(request, env);
    if (route === "setup/first-admin" && request.method === "POST") return firstAdmin(request, env);

    if (route === "tickets/types" && request.method === "GET") return ticketTypes(env);
    if (route === "tickets/bookings" && request.method === "POST") return withUser(request, env, (user) => createBooking(request, env, user));
    if (route.startsWith("tickets/bookings/") && request.method === "GET") {
      return withUser(request, env, (user) => getBooking(env, user, Number(route.split("/").pop())));
    }

    if (route === "newsletter/subscribe" && request.method === "POST") return subscribeNewsletter(request, env);
    if (route === "faqs" && request.method === "GET") return listFaqs(env);
    if (route === "opening-times" && request.method === "GET") return listOpeningTimes(env);
    if (route === "documents" && request.method === "GET") return listDocuments(env);
    if (route === "food/menu" && request.method === "GET") return foodMenu(env);

    if (route.startsWith("admin/")) return withRole(request, env, adminRoles, (user) => adminRoute(route, request, env, user));
    if (route === "staff/dashboard" && request.method === "GET") return withRole(request, env, staffRoles, (user) => staffDashboard(env, user));
    if (route === "shifts" && request.method === "GET") return withRole(request, env, staffRoles, (user) => listShifts(env, user));
    if (route === "shifts" && request.method === "POST") return withRole(request, env, managerRoles, (user) => createShift(request, env, user));

    return json({ ok: false, error: "API route not found." }, 404);
  } catch (error) {
    return json({ ok: false, error: error.message || "Unexpected API error." }, 500);
  }
}

function json(payload, status = 200, headers = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function ok(data = {}, headers = {}) {
  return json({ ok: true, data }, 200, headers);
}

function fail(status, error) {
  return json({ ok: false, error }, status);
}

function publicUser(user) {
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function parseCookies(request) {
  const header = request.headers.get("Cookie") || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [decodeURIComponent(part.slice(0, index)), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

function sessionCookieName(env) {
  return env.SESSION_COOKIE || "woodlands_session";
}

function cookieHeader(name, value, env, maxAgeSeconds) {
  const secure = env.APP_ENV === "development" ? "" : "; Secure";
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=${maxAgeSeconds}`;
}

function validateOrigin(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  const requestOrigin = new URL(request.url).origin;
  const allowed = new Set([requestOrigin, env.PRODUCTION_URL].filter(Boolean));
  if (env.APP_ENV === "development") {
    allowed.add("http://127.0.0.1:5173");
    allowed.add("http://localhost:5173");
  }
  return allowed.has(origin) ? null : fail(403, "Invalid request origin.");
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function toBase64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

async function hashPassword(password) {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const iterations = 210000;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return `pbkdf2_sha256$${iterations}$${toBase64(salt)}$${toBase64(bits)}`;
}

async function verifyPassword(password, passwordHash) {
  const [scheme, iterationText, saltText, hashText] = String(passwordHash || "").split("$");
  if (scheme !== "pbkdf2_sha256") return false;
  const iterations = Number(iterationText);
  const salt = fromBase64(saltText);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return toBase64(bits) === hashText;
}

async function getUserFromRequest(request, env) {
  const token = parseCookies(request)[sessionCookieName(env)];
  if (!token) return null;
  const tokenHash = await sha256Hex(token);
  const row = await env.DB.prepare(`
    SELECT sessions.id AS session_id, sessions.expires_at, users.*
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ?
  `).bind(tokenHash).first();
  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(row.session_id).run();
    return null;
  }
  return { id: row.id, name: row.name, email: row.email, role: row.role, sessionId: row.session_id };
}

async function withUser(request, env, handler) {
  const user = await getUserFromRequest(request, env);
  if (!user) return fail(401, "Authentication required.");
  return handler(user);
}

async function withRole(request, env, roles, handler) {
  const user = await getUserFromRequest(request, env);
  if (!user) return fail(401, "Authentication required.");
  if (!roles.includes(user.role)) return fail(403, "You do not have access to this resource.");
  return handler(user);
}

async function createSession(request, env, user) {
  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const days = Number(env.SESSION_DAYS || 7);
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare(`
    INSERT INTO sessions (user_id, token_hash, user_agent, ip_address, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(user.id, tokenHash, request.headers.get("User-Agent") || "", request.headers.get("CF-Connecting-IP") || "", expiresAt).run();
  return cookieHeader(sessionCookieName(env), token, env, days * 24 * 60 * 60);
}

async function audit(env, userId, action, entityType = null, entityId = null, metadata = null) {
  await env.DB.prepare(`
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (?, ?, ?, ?, ?)
  `).bind(userId || null, action, entityType, entityId ? String(entityId) : null, metadata ? JSON.stringify(metadata) : null).run();
}

async function register(request, env) {
  const body = await readJson(request);
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!name || !email || !password) return fail(400, "Name, email and password are required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(400, "Enter a valid email address.");
  if (password.length < 10) return fail(400, "Password must be at least 10 characters.");
  const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existing) return fail(409, "An account already exists for this email address.");
  const passwordHash = await hashPassword(password);
  const result = await env.DB.prepare(`
    INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, 'customer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(name, email, passwordHash).run();
  const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(result.meta.last_row_id).first();
  await env.DB.prepare("INSERT INTO ticket_customers (user_id, name, email) VALUES (?, ?, ?)").bind(user.id, user.name, user.email).run();
  await audit(env, user.id, "auth.register", "users", user.id);
  const cookie = await createSession(request, env, user);
  return ok({ user: publicUser(user) }, { "Set-Cookie": cookie });
}

async function login(request, env) {
  const body = await readJson(request);
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  if (!user || !(await verifyPassword(password, user.password_hash))) return fail(401, "Invalid email or password.");
  await audit(env, user.id, "auth.login", "users", user.id);
  const cookie = await createSession(request, env, user);
  return ok({ user: publicUser(user) }, { "Set-Cookie": cookie });
}

async function logout(request, env) {
  const user = await getUserFromRequest(request, env);
  if (user?.sessionId) await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(user.sessionId).run();
  return ok({}, { "Set-Cookie": cookieHeader(sessionCookieName(env), "", env, 0) });
}

async function me(request, env) {
  const user = await getUserFromRequest(request, env);
  return ok({ user: publicUser(user) });
}

async function firstAdmin(request, env) {
  if (!env.ADMIN_BOOTSTRAP_TOKEN) return fail(404, "First-admin setup is not enabled.");
  if (request.headers.get("X-Bootstrap-Token") !== env.ADMIN_BOOTSTRAP_TOKEN) return fail(403, "Invalid bootstrap token.");
  const existing = await env.DB.prepare("SELECT id FROM users WHERE role IN ('admin', 'super_admin') LIMIT 1").first();
  if (existing) return fail(409, "An admin account already exists.");
  const body = await readJson(request);
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!name || !email || password.length < 14) return fail(400, "Name, email and a 14+ character password are required.");
  const passwordHash = await hashPassword(password);
  const result = await env.DB.prepare(`
    INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, 'super_admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(name, email, passwordHash).run();
  await audit(env, result.meta.last_row_id, "setup.first_admin", "users", result.meta.last_row_id);
  return ok({ created: true });
}

async function ticketTypes(env) {
  const { results } = await env.DB.prepare(`
    SELECT id, slug, name, description, price_label AS priceLabel, price_pence AS pricePence, active
    FROM ticket_types
    WHERE active = 1
    ORDER BY sort_order, id
  `).all();
  return ok({ ticketTypes: results });
}

function makeReference() {
  return `WOOD-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

async function createBooking(request, env, user) {
  const body = await readJson(request);
  const visitDate = String(body.visitDate || "");
  const items = Array.isArray(body.items) ? body.items : [];
  if (!visitDate || !items.length) return fail(400, "Select a visit date and at least one ticket.");

  const selected = [];
  for (const item of items) {
    const ticketType = await env.DB.prepare("SELECT * FROM ticket_types WHERE id = ? AND active = 1").bind(Number(item.ticketTypeId)).first();
    const quantity = Number(item.quantity || 0);
    if (ticketType && quantity > 0) selected.push({ ticketType, quantity });
  }
  if (!selected.length) return fail(400, "Select at least one valid ticket quantity.");

  let customer = await env.DB.prepare("SELECT * FROM ticket_customers WHERE user_id = ?").bind(user.id).first();
  if (!customer) {
    const result = await env.DB.prepare("INSERT INTO ticket_customers (user_id, name, email) VALUES (?, ?, ?)").bind(user.id, user.name, user.email).run();
    customer = { id: result.meta.last_row_id };
  }
  const reference = makeReference();
  const totalPence = selected.reduce((total, item) => total + (item.ticketType.price_pence || 0) * item.quantity, 0) || null;
  const result = await env.DB.prepare(`
    INSERT INTO ticket_bookings (reference, user_id, customer_id, visit_date, status, payment_status, total_pence, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'reservation_requested', 'awaiting_payment', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(reference, user.id, customer.id, visitDate, totalPence, "Reservation request created. Payment gateway integration pending approval.").run();

  for (const item of selected) {
    await env.DB.prepare(`
      INSERT INTO ticket_booking_items (booking_id, ticket_type_id, ticket_name, quantity, price_label, price_pence)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(result.meta.last_row_id, item.ticketType.id, item.ticketType.name, item.quantity, item.ticketType.price_label, item.ticketType.price_pence).run();
  }
  await audit(env, user.id, "tickets.booking.create", "ticket_bookings", result.meta.last_row_id, { reference });
  return getBooking(env, user, result.meta.last_row_id);
}

async function getBooking(env, user, id) {
  const booking = await env.DB.prepare(`
    SELECT ticket_bookings.*, ticket_customers.name AS customer_name, ticket_customers.email AS customer_email
    FROM ticket_bookings
    LEFT JOIN ticket_customers ON ticket_customers.id = ticket_bookings.customer_id
    WHERE ticket_bookings.id = ?
  `).bind(id).first();
  if (!booking) return fail(404, "Booking not found.");
  if (booking.user_id !== user.id && !adminRoles.includes(user.role)) return fail(404, "Booking not found.");
  const { results: items } = await env.DB.prepare(`
    SELECT ticket_booking_items.*, ticket_types.slug
    FROM ticket_booking_items
    LEFT JOIN ticket_types ON ticket_types.id = ticket_booking_items.ticket_type_id
    WHERE booking_id = ?
    ORDER BY id
  `).bind(id).all();
  return ok({ booking: { ...booking, items } });
}

async function subscribeNewsletter(request, env) {
  const body = await readJson(request);
  const email = String(body.email || "").trim().toLowerCase();
  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !firstName || !lastName) return fail(400, "Email address, first name and last name are required.");
  await env.DB.prepare(`
    INSERT INTO newsletter_subscribers (email, first_name, last_name, status)
    VALUES (?, ?, ?, 'subscribed')
    ON CONFLICT(email) DO UPDATE SET first_name = excluded.first_name, last_name = excluded.last_name, status = 'subscribed'
  `).bind(email, firstName, lastName).run();
  return ok({ message: "Thank you for signing up." });
}

async function listFaqs(env) {
  const { results } = await env.DB.prepare("SELECT group_title, question, answer FROM faqs WHERE active = 1 ORDER BY sort_order, id").all();
  const groups = [];
  for (const row of results) {
    let group = groups.find((item) => item.title === row.group_title);
    if (!group) {
      group = { title: row.group_title, items: [] };
      groups.push(group);
    }
    group.items.push({ question: row.question, answer: row.answer });
  }
  return ok({ groups });
}

async function listOpeningTimes(env) {
  const { results } = await env.DB.prepare(`
    SELECT date, status, season_label AS seasonLabel, open_time AS openTime, close_time AS closeTime, notes
    FROM opening_times
    ORDER BY date
  `).all();
  return ok({ openingTimes: results });
}

async function listDocuments(env) {
  const { results } = await env.DB.prepare("SELECT title, description, local_path AS localPath, page_paths AS pagePaths FROM documents ORDER BY title").all();
  return ok({ documents: results });
}

async function foodMenu(env) {
  const { results: cafes } = await env.DB.prepare("SELECT slug, label, description FROM cafes WHERE active = 1 ORDER BY id").all();
  const { results: categories } = await env.DB.prepare(`
    SELECT name, group_name AS groupName, theme, display_order AS displayOrder
    FROM menu_categories
    ORDER BY display_order, name
  `).all();
  const { results: rows } = await env.DB.prepare(`
    SELECT menu_items.name, menu_items.description, menu_items.price_pence AS pricePence, menu_items.image,
      menu_categories.name AS category, cafes.slug AS cafeSlug
    FROM menu_items
    JOIN menu_categories ON menu_categories.id = menu_items.category_id
    JOIN cafes ON cafes.id = menu_items.cafe_id
    WHERE menu_items.active = 1 AND cafes.active = 1
    ORDER BY menu_categories.display_order, menu_items.name
  `).all();
  const itemMap = new Map();
  for (const row of rows) {
    const key = `${row.category}|${row.name}|${row.description}|${row.pricePence}|${row.image}`;
    if (!itemMap.has(key)) {
      itemMap.set(key, {
        category: row.category,
        name: row.name,
        description: row.description,
        price: Number(row.pricePence || 0) / 100,
        image: row.image,
        extras: [],
        cafeSlugs: [],
      });
    }
    itemMap.get(key).cafeSlugs.push(row.cafeSlug);
  }
  return ok({ foodMenuData: { generatedAt: new Date().toISOString(), cafes, categories, menuItems: [...itemMap.values()] } });
}

async function adminRoute(route, request, env, user) {
  const id = Number(route.split("/").pop());
  if (route === "admin/dashboard" && request.method === "GET") {
    const tables = {
      pages: "pages",
      events: "events",
      faqs: "faqs",
      bookings: "ticket_bookings",
      subscribers: "newsletter_subscribers",
      menuItems: "menu_items",
    };
    const counts = {};
    for (const [key, table] of Object.entries(tables)) {
      counts[key] = (await env.DB.prepare(`SELECT COUNT(*) AS count FROM ${table}`).first()).count;
    }
    return ok({ counts });
  }
  if (route === "admin/pages" && request.method === "GET") return listRows(env, "pages", "path", "pages");
  if (route.startsWith("admin/pages/") && request.method === "PUT") return updatePage(request, env, user, id);
  if (route === "admin/events" && request.method === "GET") return listRows(env, "events", "event_date, title", "events");
  if (route.startsWith("admin/events/") && request.method === "PUT") return updateEvent(request, env, user, id);
  if (route === "admin/faqs" && request.method === "GET") return listRows(env, "faqs", "group_title, sort_order, id", "faqs");
  if (route.startsWith("admin/faqs/") && request.method === "PUT") return updateFaq(request, env, user, id);
  if (route === "admin/opening-times" && request.method === "GET") return listRows(env, "opening_times", "date", "openingTimes");
  if (route.startsWith("admin/opening-times/") && request.method === "PUT") return updateOpening(request, env, user, id);
  if (route === "admin/media" && request.method === "GET") return listRows(env, "media_assets", "created_at DESC", "media");
  if (route === "admin/media" && request.method === "POST") return uploadMedia(request, env, user);
  if (route === "admin/documents" && request.method === "GET") return listRows(env, "documents", "title", "documents");
  if (route === "admin/newsletter-subscribers" && request.method === "GET") return listRows(env, "newsletter_subscribers", "created_at DESC", "subscribers");
  if (route === "admin/ticket-types" && request.method === "GET") return listRows(env, "ticket_types", "sort_order, id", "ticketTypes");
  if (route.startsWith("admin/ticket-types/") && request.method === "PUT") return updateTicketType(request, env, user, id);
  if (route === "admin/ticket-bookings" && request.method === "GET") {
    const { results } = await env.DB.prepare(`
      SELECT ticket_bookings.*, users.name AS user_name, users.email AS user_email
      FROM ticket_bookings
      LEFT JOIN users ON users.id = ticket_bookings.user_id
      ORDER BY ticket_bookings.created_at DESC
    `).all();
    return ok({ bookings: results });
  }
  return fail(404, "Admin route not found.");
}

async function listRows(env, table, orderBy, key) {
  const { results } = await env.DB.prepare(`SELECT * FROM ${table} ORDER BY ${orderBy} LIMIT 500`).all();
  return ok({ [key]: results });
}

async function updatePage(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE pages SET title = ?, summary = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(body.title, body.summary || "", body.status || "published", id)
    .run();
  await audit(env, user.id, "admin.pages.update", "pages", id);
  return ok({ page: await env.DB.prepare("SELECT * FROM pages WHERE id = ?").bind(id).first() });
}

async function updateEvent(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE events SET title = ?, event_date = ?, summary = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(body.title, body.event_date || null, body.summary || "", body.status || "published", id)
    .run();
  await audit(env, user.id, "admin.events.update", "events", id);
  return ok();
}

async function updateFaq(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE faqs SET group_title = ?, question = ?, answer = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(body.group_title, body.question, body.answer, body.active ? 1 : 0, id)
    .run();
  await audit(env, user.id, "admin.faqs.update", "faqs", id);
  return ok();
}

async function updateOpening(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE opening_times SET status = ?, season_label = ?, open_time = ?, close_time = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(body.status, body.season_label, body.open_time || null, body.close_time || null, body.notes || null, id)
    .run();
  await audit(env, user.id, "admin.opening_times.update", "opening_times", id);
  return ok();
}

async function updateTicketType(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE ticket_types SET name = ?, description = ?, price_label = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(body.name, body.description || "", body.price_label || body.priceLabel || "", body.active ? 1 : 0, id)
    .run();
  await audit(env, user.id, "admin.ticket_types.update", "ticket_types", id);
  return ok();
}

async function uploadMedia(request, env, user) {
  if (!env.MEDIA_BUCKET) return fail(503, "Media bucket binding is not configured.");
  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return fail(400, "A file is required.");
  if (file.size > 10 * 1024 * 1024) return fail(400, "File size must be 10MB or less.");
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
  if (!allowed.includes(file.type)) return fail(400, "Unsupported file type.");
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  const key = `uploads/${Date.now()}-${safeName}`;
  await env.MEDIA_BUCKET.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
  const path = `${env.MEDIA_PUBLIC_BASE || "/media"}/${key}`;
  const title = String(form.get("title") || file.name);
  const result = await env.DB.prepare(`
    INSERT INTO media_assets (title, filename, path, mime_type, type, alt_text, usage)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(title, safeName, path, file.type, file.type.startsWith("image/") ? "image" : "file", String(form.get("altText") || ""), String(form.get("usage") || "website")).run();
  await audit(env, user.id, "admin.media.upload", "media_assets", result.meta.last_row_id);
  return ok({ media: await env.DB.prepare("SELECT * FROM media_assets WHERE id = ?").bind(result.meta.last_row_id).first() });
}

async function staffDashboard(env, user) {
  const employee = await env.DB.prepare(`
    SELECT employees.*, departments.name AS department_name
    FROM employees
    LEFT JOIN departments ON departments.id = employees.department_id
    WHERE employees.user_id = ?
  `).bind(user.id).first();
  const { results: announcements } = await env.DB.prepare(`
    SELECT title, body, audience, published_at AS publishedAt
    FROM announcements
    WHERE audience IN ('all', ?)
    ORDER BY published_at DESC
  `).bind(user.role).all();
  const { results: documents } = await env.DB.prepare(`
    SELECT title, description, document_type AS documentType, role_visibility AS roleVisibility, is_sensitive AS isSensitive
    FROM staff_documents
    WHERE role_visibility IN ('staff', ?)
    ORDER BY created_at DESC
  `).bind(user.role).all();
  const { results: managerView } = managerRoles.includes(user.role)
    ? await env.DB.prepare(`
        SELECT employees.id, users.name, users.email, users.role, departments.name AS department
        FROM employees
        JOIN users ON users.id = employees.user_id
        LEFT JOIN departments ON departments.id = employees.department_id
        ORDER BY users.name
      `).all()
    : { results: [] };
  return ok({ employee, announcements, documents, shifts: [], managerView });
}

async function listShifts(env, user) {
  const canManage = managerRoles.includes(user.role);
  const employee = await env.DB.prepare("SELECT id FROM employees WHERE user_id = ?").bind(user.id).first();
  const { results: shifts } = canManage
    ? await env.DB.prepare(`
        SELECT shifts.*, departments.name AS department_name
        FROM shifts
        LEFT JOIN departments ON departments.id = shifts.department_id
        ORDER BY shifts.date, shifts.start_time
      `).all()
    : await env.DB.prepare(`
        SELECT shifts.*, departments.name AS department_name
        FROM rota_assignments
        JOIN shifts ON shifts.id = rota_assignments.shift_id
        LEFT JOIN departments ON departments.id = shifts.department_id
        WHERE rota_assignments.employee_id = ?
        ORDER BY shifts.date, shifts.start_time
      `).bind(employee?.id || 0).all();
  const { results: assignments } = await env.DB.prepare(`
    SELECT rota_assignments.shift_id AS shiftId, users.name, users.role, employees.job_title AS jobTitle
    FROM rota_assignments
    JOIN employees ON employees.id = rota_assignments.employee_id
    JOIN users ON users.id = employees.user_id
    ORDER BY users.name
  `).all();
  const { results: employees } = canManage
    ? await env.DB.prepare(`
        SELECT employees.id, users.name, users.role, departments.name AS department
        FROM employees
        JOIN users ON users.id = employees.user_id
        LEFT JOIN departments ON departments.id = employees.department_id
        ORDER BY users.name
      `).all()
    : { results: [] };
  return ok({ shifts, assignments, employees, canManage });
}

async function createShift(request, env, user) {
  const body = await readJson(request);
  const title = String(body.title || "").trim();
  const date = String(body.date || "").trim();
  const startTime = String(body.startTime || "").trim();
  const endTime = String(body.endTime || "").trim();
  if (!title || !date || !startTime || !endTime) return fail(400, "Title, date, start and end time are required.");
  const result = await env.DB.prepare(`
    INSERT INTO shifts (department_id, title, date, start_time, end_time, location, status, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'scheduled', CURRENT_TIMESTAMP)
  `).bind(body.departmentId || null, title, date, startTime, endTime, body.location || null).run();
  if (body.employeeId) {
    await env.DB.prepare("INSERT OR IGNORE INTO rota_assignments (shift_id, employee_id, role) VALUES (?, ?, ?)")
      .bind(result.meta.last_row_id, Number(body.employeeId), title)
      .run();
  }
  await audit(env, user.id, "shifts.create", "shifts", result.meta.last_row_id);
  return ok({ shiftId: result.meta.last_row_id });
}
