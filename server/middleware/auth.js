import { db } from "../db/connection.js";
import { config } from "../config.js";
import { fail } from "../utils/responses.js";
import { hashToken } from "../utils/security.js";

export function attachUser(req, _res, next) {
  const token = req.cookies?.[config.sessionCookie];
  if (!token) return next();

  const tokenHash = hashToken(token);
  const row = db.prepare(`
    SELECT sessions.id AS session_id, sessions.expires_at, users.*
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ?
  `).get(tokenHash);

  if (!row || new Date(row.expires_at).getTime() <= Date.now()) {
    if (row) db.prepare("DELETE FROM sessions WHERE id = ?").run(row.session_id);
    return next();
  }

  req.user = {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    sessionId: row.session_id,
  };
  return next();
}

export function requireAuth(req, res, next) {
  if (!req.user) return fail(res, 401, "Authentication required.");
  return next();
}

export function requireRoles(roles) {
  return (req, res, next) => {
    if (!req.user) return fail(res, 401, "Authentication required.");
    if (!roles.includes(req.user.role)) return fail(res, 403, "You do not have access to this resource.");
    return next();
  };
}

export const adminRoles = ["admin", "editor", "super_admin"];
export const staffRoles = ["staff", "supervisor", "manager", "payroll_admin", "super_admin", "admin"];
export const managerRoles = ["manager", "supervisor", "admin", "super_admin"];
