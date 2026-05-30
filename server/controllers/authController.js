import { db, now } from "../db/connection.js";
import { config } from "../config.js";
import { auditLog } from "../utils/audit.js";
import { createToken, hashPassword, hashToken, publicUser, verifyPassword } from "../utils/security.js";
import { fail, ok } from "../utils/responses.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  path: "/",
};

function createSession(res, req, user) {
  const token = createToken();
  const expiresAt = new Date(Date.now() + config.sessionDays * 24 * 60 * 60 * 1000);
  db.prepare(`
    INSERT INTO sessions (user_id, token_hash, user_agent, ip_address, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(user.id, hashToken(token), req.get("user-agent") || "", req.ip, expiresAt.toISOString());
  res.cookie(config.sessionCookie, token, { ...cookieOptions, expires: expiresAt });
}

export function register(req, res) {
  const { name, email, password } = req.body;
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanName) return fail(res, 400, "Name is required.");
  if (String(password || "").length < 10) return fail(res, 400, "Password must be at least 10 characters.");
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(cleanEmail);
  if (existing) return fail(res, 409, "An account already exists for this email address.");

  const result = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, 'customer', ?, ?)
  `).run(cleanName, cleanEmail, hashPassword(password), now(), now());

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
  db.prepare(`
    INSERT INTO ticket_customers (user_id, name, email)
    VALUES (?, ?, ?)
  `).run(user.id, user.name, user.email);
  createSession(res, req, user);
  auditLog(user.id, "auth.register", "users", user.id);
  return ok(res, { user: publicUser(user) });
}

export function login(req, res) {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(String(email || "").trim().toLowerCase());
  if (!user || !verifyPassword(password, user.password_hash)) return fail(res, 401, "Invalid email or password.");
  if (user.disabled_at) return fail(res, 403, "This account has been disabled. Please contact Woodlands.");
  createSession(res, req, user);
  auditLog(user.id, "auth.login", "users", user.id);
  return ok(res, { user: publicUser(user) });
}

export function logout(req, res) {
  if (req.user?.sessionId) db.prepare("DELETE FROM sessions WHERE id = ?").run(req.user.sessionId);
  res.clearCookie(config.sessionCookie, cookieOptions);
  return ok(res);
}

export function me(req, res) {
  return ok(res, { user: req.user ? publicUser(req.user) : null });
}

export function firstAdmin(req, res) {
  const expectedToken = process.env.ADMIN_BOOTSTRAP_TOKEN || process.env.WOODLANDS_ADMIN_BOOTSTRAP_TOKEN;
  if (!expectedToken) return fail(res, 404, "First-admin setup is not enabled.");
  if (req.get("x-bootstrap-token") !== expectedToken) return fail(res, 403, "Invalid bootstrap token.");
  const existing = db.prepare("SELECT id FROM users WHERE role IN ('admin', 'super_admin') LIMIT 1").get();
  if (existing) return fail(res, 409, "An admin account already exists.");

  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!name || !email || password.length < 14) return fail(res, 400, "Name, email and a 14+ character password are required.");

  const result = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, 'super_admin', ?, ?)
  `).run(name, email, hashPassword(password), now(), now());
  auditLog(result.lastInsertRowid, "setup.first_admin", "users", result.lastInsertRowid);
  return ok(res, { created: true });
}
