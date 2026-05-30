import { db, now } from "../db/connection.js";
import { auditLog } from "../utils/audit.js";
import { fail, ok } from "../utils/responses.js";

export function listShifts(req, res) {
  const canManage = ["manager", "supervisor", "admin", "super_admin"].includes(req.user.role);
  const employee = db.prepare("SELECT id FROM employees WHERE user_id = ?").get(req.user.id);
  const shifts = canManage
    ? db.prepare(`
        SELECT shifts.*, departments.name AS department_name
        FROM shifts
        LEFT JOIN departments ON departments.id = shifts.department_id
        ORDER BY shifts.date, shifts.start_time
      `).all()
    : db.prepare(`
        SELECT shifts.*, departments.name AS department_name
        FROM rota_assignments
        JOIN shifts ON shifts.id = rota_assignments.shift_id
        LEFT JOIN departments ON departments.id = shifts.department_id
        WHERE rota_assignments.employee_id = ?
        ORDER BY shifts.date, shifts.start_time
      `).all(employee?.id || 0);

  const assignments = db.prepare(`
    SELECT rota_assignments.shift_id AS shiftId, users.name, users.role, employees.job_title AS jobTitle
    FROM rota_assignments
    JOIN employees ON employees.id = rota_assignments.employee_id
    JOIN users ON users.id = employees.user_id
    ORDER BY users.name
  `).all();
  const employees = canManage
    ? db.prepare(`
        SELECT employees.id, users.name, users.role, departments.name AS department
        FROM employees
        JOIN users ON users.id = employees.user_id
        LEFT JOIN departments ON departments.id = employees.department_id
        ORDER BY users.name
      `).all()
    : [];

  return ok(res, { shifts, assignments, employees, canManage });
}

export function createShift(req, res) {
  const { title, date, startTime, endTime, location, departmentId, employeeId } = req.body;
  if (!title || !date || !startTime || !endTime) return fail(res, 400, "Title, date, start and end time are required.");
  const insert = db.transaction(() => {
    const shiftId = db.prepare(`
      INSERT INTO shifts (department_id, title, date, start_time, end_time, location, status, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'scheduled', ?)
    `).run(departmentId || null, title, date, startTime, endTime, location || null, now()).lastInsertRowid;
    if (employeeId) {
      db.prepare("INSERT OR IGNORE INTO rota_assignments (shift_id, employee_id, role) VALUES (?, ?, ?)").run(shiftId, Number(employeeId), title);
    }
    return shiftId;
  });
  const shiftId = insert();
  auditLog(req.user.id, "shifts.create", "shifts", shiftId);
  return ok(res, { shiftId });
}
