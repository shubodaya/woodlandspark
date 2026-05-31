const adminRoles = ["admin", "editor", "super_admin"];
const staffRoles = ["staff", "supervisor", "manager", "payroll_admin", "super_admin", "admin"];
const managerRoles = ["manager", "supervisor", "admin", "super_admin"];
const shiftCreateRoles = ["manager", "admin", "super_admin"];
const shiftAssignRoles = ["manager", "admin", "super_admin"];
const userAdminRoles = ["admin", "super_admin"];
const manageableUserRoles = ["editor", "staff", "supervisor", "manager", "payroll_admin", "admin"];
const employeeRoles = ["staff", "supervisor", "manager", "payroll_admin"];

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
    if (route === "auth/change-password" && request.method === "POST") return withUser(request, env, (user) => changePassword(request, env, user));
    if (route.startsWith("auth/invites/") && route.endsWith("/accept") && request.method === "POST") return acceptInvite(request, env, route.split("/").filter(Boolean).slice(-2)[0]);
    if (route.startsWith("auth/invites/") && request.method === "GET") return inviteDetails(env, route.split("/").pop());
    if (route === "setup/status" && request.method === "GET") return setupStatus(env);
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
    if (route === "pages" && request.method === "GET") return listPublicPages(env);
    if (route === "food/menu" && request.method === "GET") return foodMenu(env);

    if (route.startsWith("admin/")) return withRole(request, env, adminRoles, (user) => adminRoute(route, request, env, user));
    if (route === "staff/dashboard" && request.method === "GET") return withRole(request, env, staffRoles, (user) => staffDashboard(env, user));
    if ((route === "staff/rota" || route === "staff/rota/shifts" || route === "shifts") && request.method === "GET") return withRole(request, env, staffRoles, (user) => listShifts(request, env, user));
    if ((route === "staff/rota/shifts" || route === "shifts") && request.method === "POST") return withRole(request, env, shiftCreateRoles, (user) => createShift(request, env, user));
    if ((route.startsWith("staff/rota/shifts/") || route.startsWith("shifts/")) && request.method === "PUT" && !route.includes("/assignments")) return withRole(request, env, shiftCreateRoles, (user) => updateShift(request, env, user, Number(route.split("/").filter(Boolean).pop())));
    if ((route.startsWith("staff/rota/shifts/") || route.startsWith("shifts/")) && request.method === "DELETE" && !route.includes("/assignments")) return withRole(request, env, shiftCreateRoles, (user) => deleteShift(env, user, Number(route.split("/").filter(Boolean).pop())));
    if ((route.startsWith("staff/rota/shifts/") || route.startsWith("shifts/")) && request.method === "POST" && route.endsWith("/assignments")) return withRole(request, env, shiftAssignRoles, (user) => assignShift(request, env, user, Number(route.split("/").filter(Boolean).slice(-2)[0])));
    if ((route.startsWith("staff/rota/shifts/") || route.startsWith("shifts/")) && request.method === "DELETE" && route.includes("/assignments/")) {
      const parts = route.split("/").filter(Boolean);
      return withRole(request, env, shiftAssignRoles, (user) => removeAssignment(env, user, Number(parts[parts.indexOf("shifts") + 1]), Number(parts.at(-1))));
    }

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
  return { id: user.id, name: user.name, email: user.email, role: user.role, mustResetPassword: Boolean(user.must_reset_password) };
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

function publicBaseUrl(request, env) {
  return env.PUBLIC_SITE_URL || new URL(request.url).origin;
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
  const iterations = 100000;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return `pbkdf2_sha256$${iterations}$${toBase64(salt)}$${toBase64(bits)}`;
}

function passwordStrengthError(password, minLength = 10) {
  if (String(password || "").length < minLength) return `Password must be at least ${minLength} characters.`;
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must include a symbol.";
  return "";
}

function canManageRole(actorRole, role) {
  if (!manageableUserRoles.includes(role)) return false;
  if (role === "admin" && actorRole !== "super_admin") return false;
  return true;
}

async function activeAdminCount(env) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM users WHERE role IN ('admin', 'super_admin') AND disabled_at IS NULL").first();
  return row?.count || 0;
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
  if (row.disabled_at || new Date(row.expires_at).getTime() <= Date.now()) {
    await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(row.session_id).run();
    return null;
  }
  return { id: row.id, name: row.name, email: row.email, role: row.role, must_reset_password: row.must_reset_password, sessionId: row.session_id };
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

async function queueInviteEmail(request, env, actor, userId, email, name, role, token) {
  const inviteUrl = `${publicBaseUrl(request, env)}/staff/invite/${token}`;
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
  const result = await env.DB.prepare(`
    INSERT INTO email_outbox (to_email, subject, body, status)
    VALUES (?, ?, ?, 'queued')
  `).bind(email, subject, body).run();
  if (env.EMAIL_WEBHOOK_URL) {
    try {
      const response = await fetch(env.EMAIL_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(env.EMAIL_WEBHOOK_TOKEN ? { Authorization: `Bearer ${env.EMAIL_WEBHOOK_TOKEN}` } : {}),
        },
        body: JSON.stringify({ to: email, subject, text: body, inviteUrl, name, role }),
      });
      await env.DB.prepare("UPDATE email_outbox SET status = ?, provider_response = ?, sent_at = ? WHERE id = ?")
        .bind(response.ok ? "sent" : "failed", await response.text(), response.ok ? new Date().toISOString() : null, result.meta.last_row_id)
        .run();
    } catch (error) {
      await env.DB.prepare("UPDATE email_outbox SET status = 'failed', provider_response = ? WHERE id = ?").bind(error.message, result.meta.last_row_id).run();
    }
  }
  await audit(env, actor.id, "admin.users.invite_email.queued", "users", userId, { outboxId: result.meta.last_row_id });
  return inviteUrl;
}

async function register(request, env) {
  const body = await readJson(request);
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!name || !email || !password) return fail(400, "Name, email and password are required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(400, "Enter a valid email address.");
  const passwordError = passwordStrengthError(password, 10);
  if (passwordError) return fail(400, passwordError);
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
  if (user.disabled_at) return fail(403, "This account has been disabled. Please contact Woodlands.");
  await audit(env, user.id, "auth.login", "users", user.id);
  const cookie = await createSession(request, env, user);
  return ok({ user: publicUser(user) }, { "Set-Cookie": cookie });
}

async function changePassword(request, env, user) {
  const body = await readJson(request);
  const currentPassword = String(body.currentPassword || "");
  const nextPassword = String(body.newPassword || "");
  const existing = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(user.id).first();
  if (!existing || !(await verifyPassword(currentPassword, existing.password_hash))) return fail(401, "Current password is incorrect.");
  const passwordError = passwordStrengthError(nextPassword, 14);
  if (passwordError) return fail(400, passwordError);
  await env.DB.prepare("UPDATE users SET password_hash = ?, must_reset_password = 0, invite_accepted_at = COALESCE(invite_accepted_at, CURRENT_TIMESTAMP), updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(await hashPassword(nextPassword), user.id)
    .run();
  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ? AND id != ?").bind(user.id, user.sessionId || 0).run();
  await audit(env, user.id, "auth.password.change", "users", user.id);
  const updated = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(user.id).first();
  return ok({ user: publicUser(updated) });
}

async function inviteDetails(env, token) {
  const tokenHash = await sha256Hex(String(token || ""));
  const user = await env.DB.prepare("SELECT id, name, email, role, invite_accepted_at FROM users WHERE invite_token_hash = ? AND disabled_at IS NULL").bind(tokenHash).first();
  if (!user || user.invite_accepted_at) return fail(404, "Invite is no longer available.");
  return ok({ invite: { name: user.name, email: user.email, role: user.role } });
}

async function acceptInvite(request, env, token) {
  const tokenHash = await sha256Hex(String(token || ""));
  const user = await env.DB.prepare("SELECT * FROM users WHERE invite_token_hash = ? AND disabled_at IS NULL").bind(tokenHash).first();
  if (!user || user.invite_accepted_at) return fail(404, "Invite is no longer available.");
  const body = await readJson(request);
  const password = String(body.password || "");
  const passwordError = passwordStrengthError(password, 14);
  if (passwordError) return fail(400, passwordError);
  await env.DB.prepare(`
    UPDATE users
    SET password_hash = ?, must_reset_password = 0, invite_accepted_at = CURRENT_TIMESTAMP, invite_token_hash = NULL, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(await hashPassword(password), user.id).run();
  const updated = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(user.id).first();
  await audit(env, updated.id, "auth.invite.accept", "users", updated.id);
  const cookie = await createSession(request, env, updated);
  return ok({ user: publicUser(updated) }, { "Set-Cookie": cookie });
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

async function setupStatus(env) {
  const existing = await env.DB.prepare("SELECT id FROM users WHERE role IN ('admin', 'super_admin') LIMIT 1").first();
  return ok({ complete: Boolean(existing) });
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
  if (!name || !email) return fail(400, "Name and email are required.");
  const passwordError = passwordStrengthError(password, 14);
  if (passwordError) return fail(400, passwordError);
  const existingEmail = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existingEmail) return fail(409, "A user already exists for this email address.");
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

async function listPublicPages(env) {
  const { results: pages } = await env.DB.prepare("SELECT * FROM pages WHERE status = 'published' ORDER BY path").all();
  const { results: sections } = await env.DB.prepare("SELECT * FROM page_sections ORDER BY sort_order, id").all();
  const sectionsByPage = new Map();
  for (const section of sections) {
    const list = sectionsByPage.get(section.page_id) || [];
    list.push({ title: section.title, body: section.body, sort_order: section.sort_order });
    sectionsByPage.set(section.page_id, list);
  }
  return ok({
    pages: pages.map((page) => ({
      path: page.path,
      title: page.title,
      summary: page.summary,
      image: page.image,
      sourceUrl: page.source_url,
      sections: sectionsByPage.get(page.id) || [],
    })),
  });
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
      sections: "page_sections",
      events: "events",
      faqs: "faqs",
      bookings: "ticket_bookings",
      subscribers: "newsletter_subscribers",
      menuItems: "menu_items",
      users: "users",
      shifts: "shifts",
    };
    const counts = {};
    for (const [key, table] of Object.entries(tables)) {
      counts[key] = (await env.DB.prepare(`SELECT COUNT(*) AS count FROM ${table}`).first()).count;
    }
    return ok({ counts });
  }
  if (route === "admin/pages" && request.method === "GET") return listPagesForAdmin(env);
  if (route === "admin/pages" && request.method === "POST") return createPage(request, env, user);
  if (route.startsWith("admin/pages/") && route.endsWith("/sections") && request.method === "POST") return createPageSection(request, env, user, Number(route.split("/").filter(Boolean).slice(-2)[0]));
  if (route.startsWith("admin/page-sections/") && request.method === "PUT") return updatePageSection(request, env, user, id);
  if (route.startsWith("admin/page-sections/") && request.method === "DELETE") return deleteRow(env, user, "page_sections", id, "admin.page_sections.delete");
  if (route === "admin/users" && request.method === "GET") return listUsers(env);
  if (route === "admin/users" && request.method === "POST") return createUser(request, env, user);
  if (route.startsWith("admin/users/") && route.endsWith("/invite") && request.method === "POST") return resendUserInvite(request, env, user, Number(route.split("/").filter(Boolean).slice(-2)[0]));
  if (route.startsWith("admin/users/") && route.endsWith("/reset-password") && request.method === "POST") return resetUserPassword(request, env, user, Number(route.split("/").filter(Boolean).slice(-2)[0]));
  if (route.startsWith("admin/users/") && request.method === "PUT") return updateUser(request, env, user, id);
  if (route === "admin/audit-logs" && request.method === "GET") return listAuditLogs(env);
  if (route.startsWith("admin/pages/") && request.method === "PUT") return updatePage(request, env, user, id);
  if (route.startsWith("admin/pages/") && request.method === "DELETE") return deleteRow(env, user, "pages", id, "admin.pages.delete");
  if (route === "admin/events" && request.method === "GET") return listRows(env, "events", "event_date, title", "events");
  if (route === "admin/events" && request.method === "POST") return createEvent(request, env, user);
  if (route.startsWith("admin/events/") && request.method === "PUT") return updateEvent(request, env, user, id);
  if (route.startsWith("admin/events/") && request.method === "DELETE") return deleteRow(env, user, "events", id, "admin.events.delete");
  if (route === "admin/faqs" && request.method === "GET") return listRows(env, "faqs", "group_title, sort_order, id", "faqs");
  if (route === "admin/faqs" && request.method === "POST") return createFaq(request, env, user);
  if (route.startsWith("admin/faqs/") && request.method === "PUT") return updateFaq(request, env, user, id);
  if (route.startsWith("admin/faqs/") && request.method === "DELETE") return deleteRow(env, user, "faqs", id, "admin.faqs.delete");
  if (route === "admin/opening-times" && request.method === "GET") return listRows(env, "opening_times", "date", "openingTimes");
  if (route === "admin/opening-times" && request.method === "POST") return createOpening(request, env, user);
  if (route.startsWith("admin/opening-times/") && request.method === "PUT") return updateOpening(request, env, user, id);
  if (route.startsWith("admin/opening-times/") && request.method === "DELETE") return deleteRow(env, user, "opening_times", id, "admin.opening_times.delete");
  if (route === "admin/media" && request.method === "GET") return listRows(env, "media_assets", "created_at DESC", "media");
  if (route === "admin/media" && request.method === "POST") return uploadMedia(request, env, user);
  if (route.startsWith("admin/media/") && request.method === "PUT") return updateMedia(request, env, user, id);
  if (route.startsWith("admin/media/") && request.method === "DELETE") return deleteRow(env, user, "media_assets", id, "admin.media.delete");
  if (route === "admin/documents" && request.method === "GET") return listRows(env, "documents", "title", "documents");
  if (route === "admin/documents" && request.method === "POST") return createDocument(request, env, user);
  if (route.startsWith("admin/documents/") && request.method === "PUT") return updateDocument(request, env, user, id);
  if (route.startsWith("admin/documents/") && request.method === "DELETE") return deleteRow(env, user, "documents", id, "admin.documents.delete");
  if (route === "admin/newsletter-subscribers" && request.method === "GET") return listRows(env, "newsletter_subscribers", "created_at DESC", "subscribers");
  if (route === "admin/newsletter-subscribers" && request.method === "POST") return createSubscriber(request, env, user);
  if (route.startsWith("admin/newsletter-subscribers/") && request.method === "PUT") return updateSubscriber(request, env, user, id);
  if (route.startsWith("admin/newsletter-subscribers/") && request.method === "DELETE") return deleteRow(env, user, "newsletter_subscribers", id, "admin.newsletter.delete");
  if (route === "admin/ticket-types" && request.method === "GET") return listRows(env, "ticket_types", "sort_order, id", "ticketTypes");
  if (route === "admin/ticket-types" && request.method === "POST") return createTicketType(request, env, user);
  if (route.startsWith("admin/ticket-types/") && request.method === "PUT") return updateTicketType(request, env, user, id);
  if (route.startsWith("admin/ticket-types/") && request.method === "DELETE") return deleteRow(env, user, "ticket_types", id, "admin.ticket_types.delete");
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

async function deleteRow(env, user, table, id, action) {
  const existing = await env.DB.prepare(`SELECT id FROM ${table} WHERE id = ?`).bind(id).first();
  if (!existing) return fail(404, "Record not found.");
  await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
  await audit(env, user.id, action, table, id);
  return ok({ deleted: true });
}

async function listPagesForAdmin(env) {
  const { results: pages } = await env.DB.prepare("SELECT * FROM pages ORDER BY path LIMIT 500").all();
  const { results: sections } = await env.DB.prepare("SELECT * FROM page_sections ORDER BY sort_order, id").all();
  const sectionsByPage = new Map();
  for (const section of sections) {
    const list = sectionsByPage.get(section.page_id) || [];
    list.push(section);
    sectionsByPage.set(section.page_id, list);
  }
  return ok({ pages: pages.map((page) => ({ ...page, sections: sectionsByPage.get(page.id) || [] })) });
}

async function createPage(request, env, user) {
  const body = await readJson(request);
  const path = String(body.path || "").trim();
  const title = String(body.title || "").trim();
  if (!path || !title) return fail(400, "Path and title are required.");
  const result = await env.DB.prepare(`
    INSERT INTO pages (path, title, summary, image, source_url, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(path.startsWith("/") ? path : `/${path}`, title, body.summary || "", body.image || "", body.source_url || body.sourceUrl || "", body.status || "draft").run();
  await audit(env, user.id, "admin.pages.create", "pages", result.meta.last_row_id);
  const page = await env.DB.prepare("SELECT * FROM pages WHERE id = ?").bind(result.meta.last_row_id).first();
  return ok({ page: { ...page, sections: [] } });
}

async function updatePage(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE pages SET title = ?, summary = ?, image = ?, source_url = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(body.title, body.summary || "", body.image || "", body.source_url || body.sourceUrl || "", body.status || "published", id)
    .run();
  await audit(env, user.id, "admin.pages.update", "pages", id);
  return ok({ page: await env.DB.prepare("SELECT * FROM pages WHERE id = ?").bind(id).first() });
}

async function createPageSection(request, env, user, pageId) {
  const body = await readJson(request);
  const title = String(body.title || "").trim();
  if (!title) return fail(400, "Section title is required.");
  const result = await env.DB.prepare("INSERT INTO page_sections (page_id, title, body, sort_order) VALUES (?, ?, ?, ?)")
    .bind(pageId, title, body.body || "", Number(body.sort_order || body.sortOrder || 0))
    .run();
  await audit(env, user.id, "admin.page_sections.create", "page_sections", result.meta.last_row_id);
  return ok({ section: await env.DB.prepare("SELECT * FROM page_sections WHERE id = ?").bind(result.meta.last_row_id).first() });
}

async function updatePageSection(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE page_sections SET title = ?, body = ?, sort_order = ? WHERE id = ?")
    .bind(body.title, body.body || "", Number(body.sort_order || body.sortOrder || 0), id)
    .run();
  await audit(env, user.id, "admin.page_sections.update", "page_sections", id);
  return ok({ section: await env.DB.prepare("SELECT * FROM page_sections WHERE id = ?").bind(id).first() });
}

async function createEvent(request, env, user) {
  const body = await readJson(request);
  const title = String(body.title || "").trim();
  if (!title) return fail(400, "Event title is required.");
  const defaultPath = `/events/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
  const path = String(body.path || defaultPath).trim();
  const result = await env.DB.prepare(`
    INSERT INTO events (path, title, event_date, summary, image, source_url, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(path.startsWith("/") ? path : `/${path}`, title, body.event_date || body.eventDate || null, body.summary || "", body.image || "", body.source_url || body.sourceUrl || "", body.status || "draft").run();
  await audit(env, user.id, "admin.events.create", "events", result.meta.last_row_id);
  return ok({ event: await env.DB.prepare("SELECT * FROM events WHERE id = ?").bind(result.meta.last_row_id).first() });
}

async function updateEvent(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE events SET path = ?, title = ?, event_date = ?, summary = ?, image = ?, source_url = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(body.path, body.title, body.event_date || body.eventDate || null, body.summary || "", body.image || "", body.source_url || body.sourceUrl || "", body.status || "published", id)
    .run();
  await audit(env, user.id, "admin.events.update", "events", id);
  return ok({ event: await env.DB.prepare("SELECT * FROM events WHERE id = ?").bind(id).first() });
}

async function createFaq(request, env, user) {
  const body = await readJson(request);
  const groupTitle = String(body.group_title || body.groupTitle || "General").trim();
  const question = String(body.question || "").trim();
  const answer = String(body.answer || "").trim();
  if (!question || !answer) return fail(400, "Question and answer are required.");
  const result = await env.DB.prepare("INSERT INTO faqs (group_title, question, answer, sort_order, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)")
    .bind(groupTitle, question, answer, Number(body.sort_order || body.sortOrder || 0), body.active === false ? 0 : 1)
    .run();
  await audit(env, user.id, "admin.faqs.create", "faqs", result.meta.last_row_id);
  return ok({ faq: await env.DB.prepare("SELECT * FROM faqs WHERE id = ?").bind(result.meta.last_row_id).first() });
}

async function updateFaq(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE faqs SET group_title = ?, question = ?, answer = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(body.group_title, body.question, body.answer, body.active ? 1 : 0, id)
    .run();
  await audit(env, user.id, "admin.faqs.update", "faqs", id);
  return ok({ faq: await env.DB.prepare("SELECT * FROM faqs WHERE id = ?").bind(id).first() });
}

async function createOpening(request, env, user) {
  const body = await readJson(request);
  const date = String(body.date || "").trim();
  if (!date) return fail(400, "Date is required.");
  const result = await env.DB.prepare("INSERT INTO opening_times (date, status, season_label, open_time, close_time, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)")
    .bind(date, body.status || "closed", body.season_label || body.seasonLabel || "Park Closed", body.open_time || body.openTime || null, body.close_time || body.closeTime || null, body.notes || null)
    .run();
  await audit(env, user.id, "admin.opening_times.create", "opening_times", result.meta.last_row_id);
  return ok({ openingTime: await env.DB.prepare("SELECT * FROM opening_times WHERE id = ?").bind(result.meta.last_row_id).first() });
}

async function updateOpening(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE opening_times SET status = ?, season_label = ?, open_time = ?, close_time = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(body.status, body.season_label || body.seasonLabel, body.open_time || body.openTime || null, body.close_time || body.closeTime || null, body.notes || null, id)
    .run();
  await audit(env, user.id, "admin.opening_times.update", "opening_times", id);
  return ok({ openingTime: await env.DB.prepare("SELECT * FROM opening_times WHERE id = ?").bind(id).first() });
}

async function updateTicketType(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE ticket_types SET slug = ?, name = ?, description = ?, price_label = ?, active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(body.slug, body.name, body.description || "", body.price_label || body.priceLabel || "", body.active ? 1 : 0, Number(body.sort_order || body.sortOrder || 0), id)
    .run();
  await audit(env, user.id, "admin.ticket_types.update", "ticket_types", id);
  return ok({ ticketType: await env.DB.prepare("SELECT * FROM ticket_types WHERE id = ?").bind(id).first() });
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

async function updateMedia(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE media_assets SET title = ?, alt_text = ?, usage = ? WHERE id = ?")
    .bind(body.title, body.alt_text || body.altText || "", body.usage || "", id)
    .run();
  await audit(env, user.id, "admin.media.update", "media_assets", id);
  return ok({ media: await env.DB.prepare("SELECT * FROM media_assets WHERE id = ?").bind(id).first() });
}

async function createDocument(request, env, user) {
  const body = await readJson(request);
  const title = String(body.title || "").trim();
  const localPath = String(body.local_path || body.localPath || "").trim();
  if (!title || !localPath) return fail(400, "Title and local path are required.");
  const result = await env.DB.prepare("INSERT INTO documents (title, description, local_path, source_url, page_paths, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)")
    .bind(title, body.description || "", localPath, body.source_url || body.sourceUrl || "", body.page_paths || body.pagePaths || "")
    .run();
  await audit(env, user.id, "admin.documents.create", "documents", result.meta.last_row_id);
  return ok({ document: await env.DB.prepare("SELECT * FROM documents WHERE id = ?").bind(result.meta.last_row_id).first() });
}

async function updateDocument(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE documents SET title = ?, description = ?, local_path = ?, source_url = ?, page_paths = ? WHERE id = ?")
    .bind(body.title, body.description || "", body.local_path || body.localPath || "", body.source_url || body.sourceUrl || "", body.page_paths || body.pagePaths || "", id)
    .run();
  await audit(env, user.id, "admin.documents.update", "documents", id);
  return ok({ document: await env.DB.prepare("SELECT * FROM documents WHERE id = ?").bind(id).first() });
}

async function createSubscriber(request, env, user) {
  const body = await readJson(request);
  const email = String(body.email || "").trim().toLowerCase();
  if (!email) return fail(400, "Email is required.");
  const result = await env.DB.prepare("INSERT INTO newsletter_subscribers (email, first_name, last_name, status, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)")
    .bind(email, body.first_name || body.firstName || "", body.last_name || body.lastName || "", body.status || "subscribed")
    .run();
  await audit(env, user.id, "admin.newsletter.create", "newsletter_subscribers", result.meta.last_row_id);
  return ok({ subscriber: await env.DB.prepare("SELECT * FROM newsletter_subscribers WHERE id = ?").bind(result.meta.last_row_id).first() });
}

async function updateSubscriber(request, env, user, id) {
  const body = await readJson(request);
  await env.DB.prepare("UPDATE newsletter_subscribers SET email = ?, first_name = ?, last_name = ?, status = ? WHERE id = ?")
    .bind(body.email, body.first_name || body.firstName || "", body.last_name || body.lastName || "", body.status || "subscribed", id)
    .run();
  await audit(env, user.id, "admin.newsletter.update", "newsletter_subscribers", id);
  return ok({ subscriber: await env.DB.prepare("SELECT * FROM newsletter_subscribers WHERE id = ?").bind(id).first() });
}

async function createTicketType(request, env, user) {
  const body = await readJson(request);
  const slug = String(body.slug || body.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const name = String(body.name || "").trim();
  if (!slug || !name) return fail(400, "Slug and name are required.");
  const result = await env.DB.prepare(`
    INSERT INTO ticket_types (slug, name, description, price_label, price_pence, active, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(slug, name, body.description || "", body.price_label || body.priceLabel || "", body.price_pence || body.pricePence || null, body.active === false ? 0 : 1, Number(body.sort_order || body.sortOrder || 0)).run();
  await audit(env, user.id, "admin.ticket_types.create", "ticket_types", result.meta.last_row_id);
  return ok({ ticketType: await env.DB.prepare("SELECT * FROM ticket_types WHERE id = ?").bind(result.meta.last_row_id).first() });
}

async function listUsers(env) {
  const { results: users } = await env.DB.prepare(`
    SELECT users.id, users.name, users.email, users.role, users.disabled_at, users.must_reset_password, users.invite_sent_at, users.invite_accepted_at, users.created_at, users.updated_at,
      employees.id AS employee_id, employees.department_id, employees.job_title, employees.employee_code, departments.name AS department_name
    FROM users
    LEFT JOIN employees ON employees.user_id = users.id
    LEFT JOIN departments ON departments.id = employees.department_id
    ORDER BY users.role, users.name
  `).all();
  const { results: departments } = await env.DB.prepare("SELECT id, name FROM departments ORDER BY name").all();
  return ok({ users, departments });
}

async function createUser(request, env, user) {
  if (!userAdminRoles.includes(user.role)) return fail(403, "Only admins can manage users.");
  const body = await readJson(request);
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const providedPassword = String(body.password || "");
  const role = String(body.role || "").trim();
  if (!name || !email || !canManageRole(user.role, role)) return fail(400, "Name, email and a valid role are required.");
  if (providedPassword) {
    const passwordError = passwordStrengthError(providedPassword, 14);
    if (passwordError) return fail(400, passwordError);
  }
  const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existing) return fail(409, "A user already exists for this email address.");

  const inviteToken = randomToken();
  const inviteTokenHash = await sha256Hex(inviteToken);
  const passwordHash = await hashPassword(providedPassword || randomToken());
  const result = await env.DB.prepare(`
    INSERT INTO users (name, email, password_hash, role, must_reset_password, invite_token_hash, invite_sent_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(name, email, passwordHash, role, providedPassword ? 1 : 0, inviteTokenHash).run();

  if (employeeRoles.includes(role)) {
    const code = `${role.slice(0, 3).toUpperCase()}${String(result.meta.last_row_id).padStart(4, "0")}`;
    await env.DB.prepare(`
      INSERT INTO employees (user_id, department_id, job_title, employee_code)
      VALUES (?, ?, ?, ?)
    `).bind(result.meta.last_row_id, body.departmentId || null, String(body.jobTitle || role.replace("_", " ")), code).run();
  }

  await audit(env, user.id, "admin.users.create", "users", result.meta.last_row_id, { role });
  const inviteUrl = await queueInviteEmail(request, env, user, result.meta.last_row_id, email, name, role, inviteToken);
  return ok({
    user: await env.DB.prepare("SELECT id, name, email, role, disabled_at, must_reset_password, invite_sent_at, invite_accepted_at, created_at, updated_at FROM users WHERE id = ?").bind(result.meta.last_row_id).first(),
    inviteUrl,
    emailStatus: env.EMAIL_WEBHOOK_URL ? "sent-or-queued" : "queued",
  });
}

async function updateUser(request, env, user, id) {
  if (!userAdminRoles.includes(user.role)) return fail(403, "Only admins can manage users.");
  const existing = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  if (!existing) return fail(404, "User not found.");
  const body = await readJson(request);
  const role = String(body.role || existing.role).trim();
  const roleChanged = role !== existing.role;
  if (roleChanged) {
    if (existing.role === "super_admin" || role === "super_admin") return fail(403, "Super-admin accounts are managed through the first-admin setup process.");
    if (!canManageRole(user.role, role)) return fail(403, "You do not have permission to assign that role.");
    if (existing.role === "admin" && user.role !== "super_admin") return fail(403, "Only a super-admin can manage admin accounts.");
  }
  const disabled = Boolean(body.disabled);
  if (id === user.id && disabled) return fail(400, "You cannot disable your own account.");
  if (disabled && ["admin", "super_admin"].includes(existing.role)) {
    if (user.role !== "super_admin") return fail(403, "Only a super-admin can disable admin accounts.");
    if ((await activeAdminCount(env)) <= 1 && !existing.disabled_at) return fail(400, "At least one active admin account is required.");
  }
  const name = String(body.name || existing.name).trim();

  await env.DB.prepare("UPDATE users SET name = ?, role = ?, disabled_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(name, role, disabled ? (existing.disabled_at || new Date().toISOString()) : null, id)
    .run();

  const employee = await env.DB.prepare("SELECT id FROM employees WHERE user_id = ?").bind(id).first();
  if (employeeRoles.includes(role)) {
    if (employee) {
      await env.DB.prepare("UPDATE employees SET department_id = ?, job_title = ? WHERE user_id = ?")
        .bind(body.departmentId || null, String(body.jobTitle || role.replace("_", " ")), id)
        .run();
    } else {
      const code = `${role.slice(0, 3).toUpperCase()}${String(id).padStart(4, "0")}`;
      await env.DB.prepare("INSERT INTO employees (user_id, department_id, job_title, employee_code) VALUES (?, ?, ?, ?)")
        .bind(id, body.departmentId || null, String(body.jobTitle || role.replace("_", " ")), code)
        .run();
    }
  }

  await audit(env, user.id, "admin.users.update", "users", id, { role, disabled });
  return ok({ user: await env.DB.prepare("SELECT id, name, email, role, disabled_at, must_reset_password, invite_sent_at, invite_accepted_at, created_at, updated_at FROM users WHERE id = ?").bind(id).first() });
}

async function resetUserPassword(request, env, user, id) {
  if (!userAdminRoles.includes(user.role)) return fail(403, "Only admins can manage users.");
  const existing = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  if (!existing) return fail(404, "User not found.");
  if (existing.role === "super_admin") return fail(403, "Super-admin passwords must be reset through a secure recovery process.");
  if (existing.role === "admin" && user.role !== "super_admin") return fail(403, "Only a super-admin can reset admin passwords.");
  const body = await readJson(request);
  const password = String(body.password || "");
  const passwordError = passwordStrengthError(password, 14);
  if (passwordError) return fail(400, passwordError);
  await env.DB.prepare("UPDATE users SET password_hash = ?, must_reset_password = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(await hashPassword(password), id).run();
  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id).run();
  await audit(env, user.id, "admin.users.reset_password", "users", id);
  return ok({ reset: true });
}

async function resendUserInvite(request, env, user, id) {
  if (!userAdminRoles.includes(user.role)) return fail(403, "Only admins can manage users.");
  const existing = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  if (!existing) return fail(404, "User not found.");
  if (existing.role === "super_admin") return fail(403, "Super-admin accounts cannot be invited from user management.");
  if (existing.role === "admin" && user.role !== "super_admin") return fail(403, "Only a super-admin can invite admin accounts.");
  const inviteToken = randomToken();
  await env.DB.prepare("UPDATE users SET invite_token_hash = ?, invite_sent_at = CURRENT_TIMESTAMP, invite_accepted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(await sha256Hex(inviteToken), id)
    .run();
  const inviteUrl = await queueInviteEmail(request, env, user, id, existing.email, existing.name, existing.role, inviteToken);
  await audit(env, user.id, "admin.users.invite.resend", "users", id);
  return ok({ inviteUrl, emailStatus: env.EMAIL_WEBHOOK_URL ? "sent-or-queued" : "queued" });
}

async function listAuditLogs(env) {
  const { results: auditLogs } = await env.DB.prepare(`
    SELECT audit_logs.*, users.name AS user_name, users.email AS user_email
    FROM audit_logs
    LEFT JOIN users ON users.id = audit_logs.user_id
    ORDER BY audit_logs.created_at DESC, audit_logs.id DESC
    LIMIT 200
  `).all();
  return ok({ auditLogs });
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

async function listShifts(request, env, user) {
  const url = new URL(request.url);
  const departmentFilter = url.searchParams.get("departmentId") ? Number(url.searchParams.get("departmentId")) : null;
  const canCreate = shiftCreateRoles.includes(user.role);
  const canAssign = shiftAssignRoles.includes(user.role);
  const employee = await env.DB.prepare("SELECT id, department_id FROM employees WHERE user_id = ?").bind(user.id).first();
  let shifts = [];

  if (user.role === "supervisor") {
    const response = await env.DB.prepare(`
        SELECT shifts.*, departments.name AS department_name
        FROM shifts
        LEFT JOIN departments ON departments.id = shifts.department_id
        WHERE (? IS NULL OR shifts.department_id = ?)
          AND (? IS NULL OR shifts.department_id = ?)
        ORDER BY shifts.date, shifts.start_time
      `).bind(departmentFilter, departmentFilter, employee?.department_id || null, employee?.department_id || null).all();
    shifts = response.results;
  } else if (canCreate) {
    const response = await env.DB.prepare(`
        SELECT shifts.*, departments.name AS department_name
        FROM shifts
        LEFT JOIN departments ON departments.id = shifts.department_id
        WHERE (? IS NULL OR shifts.department_id = ?)
        ORDER BY shifts.date, shifts.start_time
      `).bind(departmentFilter, departmentFilter).all();
    shifts = response.results;
  } else {
    const response = await env.DB.prepare(`
        SELECT shifts.*, departments.name AS department_name
        FROM rota_assignments
        JOIN shifts ON shifts.id = rota_assignments.shift_id
        LEFT JOIN departments ON departments.id = shifts.department_id
        WHERE rota_assignments.employee_id = ?
        ORDER BY shifts.date, shifts.start_time
      `).bind(employee?.id || 0).all();
    shifts = response.results;
  }

  let assignments = [];
  const shiftIds = shifts.map((shift) => shift.id);
  if (shiftIds.length) {
    const response = await env.DB.prepare(`
      SELECT rota_assignments.shift_id AS shiftId, rota_assignments.employee_id AS employeeId,
        users.name, users.role, employees.job_title AS jobTitle, departments.name AS department
      FROM rota_assignments
      JOIN employees ON employees.id = rota_assignments.employee_id
      JOIN users ON users.id = employees.user_id
      LEFT JOIN departments ON departments.id = employees.department_id
      WHERE rota_assignments.shift_id IN (${shiftIds.map(() => "?").join(",")})
      ORDER BY users.name
    `).bind(...shiftIds).all();
    assignments = response.results;
  }

  const { results: employees } = canAssign
    ? await env.DB.prepare(`
        SELECT employees.id, users.name, users.role, departments.name AS department, employees.department_id AS departmentId
        FROM employees
        JOIN users ON users.id = employees.user_id
        LEFT JOIN departments ON departments.id = employees.department_id
        WHERE (? != 'supervisor' OR employees.department_id = ?)
        ORDER BY users.name
      `).bind(user.role, employee?.department_id || null).all()
    : { results: [] };
  const { results: departments } = await env.DB.prepare("SELECT id, name FROM departments ORDER BY name").all();
  return ok({ shifts, assignments, employees, departments, canManage: canAssign, canCreate, canAssign, canEdit: canCreate });
}

async function createShift(request, env, user) {
  const body = await readJson(request);
  const title = String(body.title || "").trim();
  const date = String(body.date || "").trim();
  const startTime = String(body.startTime || "").trim();
  const endTime = String(body.endTime || "").trim();
  if (!title || !date || !startTime || !endTime) return fail(400, "Title, date, start and end time are required.");
  const result = await env.DB.prepare(`
    INSERT INTO shifts (department_id, title, date, start_time, end_time, location, status, break_minutes, paid_break, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(
    body.departmentId || null,
    title,
    date,
    startTime,
    endTime,
    body.location || null,
    body.status || "scheduled",
    Number(body.breakMinutes ?? body.break_minutes ?? 0),
    (body.paidBreak || body.paid_break) ? 1 : 0,
  ).run();
  if (body.employeeId) {
    await env.DB.prepare("INSERT OR IGNORE INTO rota_assignments (shift_id, employee_id, role) VALUES (?, ?, ?)")
      .bind(result.meta.last_row_id, Number(body.employeeId), title)
      .run();
  }
  await audit(env, user.id, "shifts.create", "shifts", result.meta.last_row_id);
  return ok({ shiftId: result.meta.last_row_id });
}

async function updateShift(request, env, user, shiftId) {
  const existing = await env.DB.prepare("SELECT * FROM shifts WHERE id = ?").bind(shiftId).first();
  if (!existing) return fail(404, "Shift not found.");
  const body = await readJson(request);
  const title = String(body.title || existing.title).trim();
  const date = String(body.date || existing.date).trim();
  const startTime = String(body.startTime || body.start_time || existing.start_time).trim();
  const endTime = String(body.endTime || body.end_time || existing.end_time).trim();
  if (!title || !date || !startTime || !endTime) return fail(400, "Title, date, start and end time are required.");
  await env.DB.prepare(`
    UPDATE shifts
    SET department_id = ?, title = ?, date = ?, start_time = ?, end_time = ?, location = ?, status = ?, break_minutes = ?, paid_break = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    body.departmentId || body.department_id || existing.department_id || null,
    title,
    date,
    startTime,
    endTime,
    body.location ?? existing.location,
    body.status || existing.status,
    Number(body.breakMinutes ?? body.break_minutes ?? existing.break_minutes ?? 0),
    (body.paidBreak ?? body.paid_break ?? existing.paid_break) ? 1 : 0,
    shiftId,
  ).run();
  await audit(env, user.id, "shifts.update", "shifts", shiftId);
  return ok({ shift: await env.DB.prepare("SELECT * FROM shifts WHERE id = ?").bind(shiftId).first() });
}

async function assignShift(request, env, user, shiftId) {
  const body = await readJson(request);
  const employeeId = Number(body.employeeId);
  if (!employeeId) return fail(400, "Employee is required.");
  const shift = await env.DB.prepare("SELECT * FROM shifts WHERE id = ?").bind(shiftId).first();
  const employee = await env.DB.prepare("SELECT employees.*, users.role FROM employees JOIN users ON users.id = employees.user_id WHERE employees.id = ?").bind(employeeId).first();
  if (!shift || !employee) return fail(404, "Shift or employee not found.");
  await env.DB.prepare("INSERT OR IGNORE INTO rota_assignments (shift_id, employee_id, role) VALUES (?, ?, ?)")
    .bind(shiftId, employeeId, body.role || shift.title)
    .run();
  await audit(env, user.id, "shifts.assign", "rota_assignments", shiftId, { employeeId });
  return ok({ assigned: true });
}

async function removeAssignment(env, user, shiftId, employeeId) {
  const shift = await env.DB.prepare("SELECT * FROM shifts WHERE id = ?").bind(shiftId).first();
  const employee = await env.DB.prepare("SELECT * FROM employees WHERE id = ?").bind(employeeId).first();
  if (!shift || !employee) return fail(404, "Assignment not found.");
  await env.DB.prepare("DELETE FROM rota_assignments WHERE shift_id = ? AND employee_id = ?").bind(shiftId, employeeId).run();
  await audit(env, user.id, "shifts.unassign", "rota_assignments", shiftId, { employeeId });
  return ok({ removed: true });
}

async function deleteShift(env, user, shiftId) {
  const existing = await env.DB.prepare("SELECT * FROM shifts WHERE id = ?").bind(shiftId).first();
  if (!existing) return fail(404, "Shift not found.");
  await env.DB.prepare("DELETE FROM rota_assignments WHERE shift_id = ?").bind(shiftId).run();
  await env.DB.prepare("DELETE FROM shifts WHERE id = ?").bind(shiftId).run();
  await audit(env, user.id, "shifts.delete", "shifts", shiftId);
  return ok({ deleted: true });
}
