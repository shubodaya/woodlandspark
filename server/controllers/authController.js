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

function passwordStrengthError(password, minLength = 10) {
  if (String(password || "").length < minLength) return `Password must be at least ${minLength} characters.`;
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must include a symbol.";
  return "";
}

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
  const passwordError = passwordStrengthError(password, 10);
  if (passwordError) return fail(res, 400, passwordError);
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

export function changePassword(req, res) {
  if (!req.user) return fail(res, 401, "Authentication required.");
  const currentPassword = String(req.body.currentPassword || "");
  const nextPassword = String(req.body.newPassword || "");
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  if (!user || !verifyPassword(currentPassword, user.password_hash)) return fail(res, 401, "Current password is incorrect.");
  const passwordError = passwordStrengthError(nextPassword, 14);
  if (passwordError) return fail(res, 400, passwordError);
  db.prepare("UPDATE users SET password_hash = ?, must_reset_password = 0, invite_accepted_at = COALESCE(invite_accepted_at, ?), updated_at = ? WHERE id = ?")
    .run(hashPassword(nextPassword), now(), now(), user.id);
  db.prepare("DELETE FROM sessions WHERE user_id = ? AND id != ?").run(user.id, req.user.sessionId || 0);
  auditLog(user.id, "auth.password.change", "users", user.id);
  const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(user.id);
  return ok(res, { user: publicUser(updated) });
}

export function inviteDetails(req, res) {
  const tokenHash = hashToken(String(req.params.token || ""));
  const user = db.prepare("SELECT id, name, email, role, invite_accepted_at FROM users WHERE invite_token_hash = ? AND disabled_at IS NULL").get(tokenHash);
  if (!user || user.invite_accepted_at) return fail(res, 404, "Invite is no longer available.");
  return ok(res, { invite: { name: user.name, email: user.email, role: user.role } });
}

export function acceptInvite(req, res) {
  const tokenHash = hashToken(String(req.params.token || ""));
  const user = db.prepare("SELECT * FROM users WHERE invite_token_hash = ? AND disabled_at IS NULL").get(tokenHash);
  if (!user || user.invite_accepted_at) return fail(res, 404, "Invite is no longer available.");
  const password = String(req.body.password || "");
  const passwordError = passwordStrengthError(password, 14);
  if (passwordError) return fail(res, 400, passwordError);
  db.prepare(`
    UPDATE users
    SET password_hash = ?, must_reset_password = 0, invite_accepted_at = ?, invite_token_hash = NULL, updated_at = ?
    WHERE id = ?
  `).run(hashPassword(password), now(), now(), user.id);
  const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(user.id);
  createSession(res, req, updated);
  auditLog(updated.id, "auth.invite.accept", "users", updated.id);
  return ok(res, { user: publicUser(updated) });
}

export function logout(req, res) {
  if (req.user?.sessionId) db.prepare("DELETE FROM sessions WHERE id = ?").run(req.user.sessionId);
  res.clearCookie(config.sessionCookie, cookieOptions);
  return ok(res);
}

export function me(req, res) {
  return ok(res, { user: req.user ? publicUser(req.user) : null });
}

export function setupStatus(_req, res) {
  const existing = db.prepare("SELECT id FROM users WHERE role IN ('admin', 'super_admin') LIMIT 1").get();
  return ok(res, { complete: Boolean(existing) });
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
  if (!name || !email) return fail(res, 400, "Name and email are required.");
  const passwordError = passwordStrengthError(password, 14);
  if (passwordError) return fail(res, 400, passwordError);
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return fail(res, 409, "A user already exists for this email address.");

  const result = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, 'super_admin', ?, ?)
  `).run(name, email, hashPassword(password), now(), now());
  auditLog(result.lastInsertRowid, "setup.first_admin", "users", result.lastInsertRowid);
  return ok(res, { created: true });
}
