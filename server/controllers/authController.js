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
  if (String(password || "").length < 6) return fail(res, 400, "Password must be at least 6 characters.");
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return fail(res, 409, "An account already exists for this email address.");

  const result = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, 'customer', ?, ?)
  `).run(String(name).trim(), email, hashPassword(password), now(), now());

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
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !verifyPassword(password, user.password_hash)) return fail(res, 401, "Invalid email or password.");
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
