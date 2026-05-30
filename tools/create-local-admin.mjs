import { db, now } from "../server/db/connection.js";
import { hashPassword } from "../server/utils/security.js";

const allowedRoles = new Set(["admin", "editor", "staff", "supervisor", "manager", "payroll_admin", "super_admin"]);
const staffRoles = new Set(["staff", "supervisor", "manager", "payroll_admin"]);
const [, , name, email, password, requestedRole = "super_admin"] = process.argv;
const role = requestedRole.trim();

if (!name || !email || !password || password.length < 14 || !allowedRoles.has(role)) {
  console.error("Usage: node tools/create-local-admin.mjs \"Full Name\" email@example.com \"long-password-14-chars\" [role]");
  console.error(`Allowed roles: ${Array.from(allowedRoles).join(", ")}`);
  process.exit(1);
}

if (role === "admin" || role === "super_admin") {
  const existingAdmin = db.prepare("SELECT id FROM users WHERE role IN ('admin', 'super_admin') LIMIT 1").get();
  if (existingAdmin) {
    console.error("An admin account already exists. Use the database/admin tools to manage accounts.");
    process.exit(1);
  }
}

const existingEmail = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
if (existingEmail) {
  console.error("A user already exists for this email address.");
  process.exit(1);
}

const result = db.prepare(`
  INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(name.trim(), email.trim().toLowerCase(), hashPassword(password), role, now(), now());

if (staffRoles.has(role)) {
  const department = db.prepare("SELECT id FROM departments ORDER BY id LIMIT 1").get();
  if (department) {
    const code = `${role.slice(0, 3).toUpperCase()}${String(result.lastInsertRowid).padStart(3, "0")}`;
    db.prepare(`
      INSERT OR IGNORE INTO employees (user_id, department_id, job_title, employee_code)
      VALUES (?, ?, ?, ?)
    `).run(result.lastInsertRowid, department.id, role.replace("_", " "), code);
  }
}

db.prepare("INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata) VALUES (?, 'setup.local_admin', 'users', ?, ?)")
  .run(result.lastInsertRowid, String(result.lastInsertRowid), JSON.stringify({ createdAt: now(), role }));

console.log(`Created local ${role} user: ${email.trim().toLowerCase()}`);
