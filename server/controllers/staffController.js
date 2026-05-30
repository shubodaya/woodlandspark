import { db } from "../db/connection.js";
import { ok } from "../utils/responses.js";

function employeeForUser(userId) {
  return db.prepare(`
    SELECT employees.*, departments.name AS department_name
    FROM employees
    LEFT JOIN departments ON departments.id = employees.department_id
    WHERE employees.user_id = ?
  `).get(userId);
}

export function dashboard(req, res) {
  const employee = employeeForUser(req.user.id);
  const announcements = db.prepare(`
    SELECT title, body, audience, published_at AS publishedAt
    FROM announcements
    WHERE audience IN ('all', ?)
    ORDER BY published_at DESC
  `).all(req.user.role);
  const documents = db.prepare(`
    SELECT title, description, document_type AS documentType, role_visibility AS roleVisibility, is_sensitive AS isSensitive
    FROM staff_documents
    WHERE role_visibility IN ('staff', ?)
    ORDER BY created_at DESC
  `).all(req.user.role);
  const shifts = employee
    ? db.prepare(`
        SELECT shifts.*, departments.name AS department_name
        FROM rota_assignments
        JOIN shifts ON shifts.id = rota_assignments.shift_id
        LEFT JOIN departments ON departments.id = shifts.department_id
        WHERE rota_assignments.employee_id = ?
        ORDER BY shifts.date, shifts.start_time
      `).all(employee.id)
    : [];
  const managerView = ["manager", "supervisor", "admin", "super_admin"].includes(req.user.role)
    ? db.prepare(`
        SELECT employees.id, users.name, users.email, users.role, departments.name AS department
        FROM employees
        JOIN users ON users.id = employees.user_id
        LEFT JOIN departments ON departments.id = employees.department_id
        ORDER BY users.name
      `).all()
    : [];

  return ok(res, { employee, announcements, documents, shifts, managerView });
}
