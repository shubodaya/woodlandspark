import { db, now } from "../db/connection.js";
import { auditLog } from "../utils/audit.js";
import { fail, ok } from "../utils/responses.js";

const createRoles = ["manager", "admin", "super_admin"];
const assignRoles = ["supervisor", "manager", "admin", "super_admin"];

export function listShifts(req, res) {
  const canCreate = createRoles.includes(req.user.role);
  const canAssign = assignRoles.includes(req.user.role);
  const employee = db.prepare("SELECT id, department_id FROM employees WHERE user_id = ?").get(req.user.id);
  const departmentFilter = req.query.departmentId ? Number(req.query.departmentId) : null;
  let shifts;

  if (req.user.role === "supervisor") {
    shifts = db.prepare(`
        SELECT shifts.*, departments.name AS department_name
        FROM shifts
        LEFT JOIN departments ON departments.id = shifts.department_id
        WHERE (? IS NULL OR shifts.department_id = ?)
          AND (? IS NULL OR shifts.department_id = ?)
        ORDER BY shifts.date, shifts.start_time
      `).all(departmentFilter, departmentFilter, employee?.department_id || null, employee?.department_id || null);
  } else if (canCreate) {
    shifts = db.prepare(`
        SELECT shifts.*, departments.name AS department_name
        FROM shifts
        LEFT JOIN departments ON departments.id = shifts.department_id
        WHERE (? IS NULL OR shifts.department_id = ?)
        ORDER BY shifts.date, shifts.start_time
      `).all(departmentFilter, departmentFilter);
  } else {
    shifts = db.prepare(`
        SELECT shifts.*, departments.name AS department_name
        FROM rota_assignments
        JOIN shifts ON shifts.id = rota_assignments.shift_id
        LEFT JOIN departments ON departments.id = shifts.department_id
        WHERE rota_assignments.employee_id = ?
        ORDER BY shifts.date, shifts.start_time
      `).all(employee?.id || 0);
  }

  const shiftIds = shifts.map((shift) => shift.id);
  const assignments = shiftIds.length
    ? db.prepare(`
        SELECT rota_assignments.shift_id AS shiftId, rota_assignments.employee_id AS employeeId,
          users.name, users.role, employees.job_title AS jobTitle, departments.name AS department
        FROM rota_assignments
        JOIN employees ON employees.id = rota_assignments.employee_id
        JOIN users ON users.id = employees.user_id
        LEFT JOIN departments ON departments.id = employees.department_id
        WHERE rota_assignments.shift_id IN (${shiftIds.map(() => "?").join(",")})
        ORDER BY users.name
      `).all(...shiftIds)
    : [];

  const employees = canAssign
    ? db.prepare(`
        SELECT employees.id, users.name, users.role, departments.name AS department, employees.department_id AS departmentId
        FROM employees
        JOIN users ON users.id = employees.user_id
        LEFT JOIN departments ON departments.id = employees.department_id
        WHERE (? != 'supervisor' OR employees.department_id = ?)
        ORDER BY users.name
      `).all(req.user.role, employee?.department_id || null)
    : [];
  const departments = db.prepare("SELECT id, name FROM departments ORDER BY name").all();

  return ok(res, { shifts, assignments, employees, departments, canManage: canAssign, canCreate, canAssign, canEdit: canCreate });
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

export function updateShift(req, res) {
  const shiftId = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM shifts WHERE id = ?").get(shiftId);
  if (!existing) return fail(res, 404, "Shift not found.");
  const title = String(req.body.title || existing.title).trim();
  const date = String(req.body.date || existing.date).trim();
  const startTime = String(req.body.startTime || req.body.start_time || existing.start_time).trim();
  const endTime = String(req.body.endTime || req.body.end_time || existing.end_time).trim();
  if (!title || !date || !startTime || !endTime) return fail(res, 400, "Title, date, start and end time are required.");

  db.prepare(`
    UPDATE shifts
    SET department_id = ?, title = ?, date = ?, start_time = ?, end_time = ?, location = ?, status = ?, break_minutes = ?, updated_at = ?
    WHERE id = ?
  `).run(
    req.body.departmentId || req.body.department_id || existing.department_id || null,
    title,
    date,
    startTime,
    endTime,
    req.body.location ?? existing.location,
    req.body.status || existing.status,
    Number(req.body.breakMinutes ?? req.body.break_minutes ?? existing.break_minutes ?? 0),
    now(),
    shiftId,
  );
  auditLog(req.user.id, "shifts.update", "shifts", shiftId);
  return ok(res, { shift: db.prepare("SELECT * FROM shifts WHERE id = ?").get(shiftId) });
}

export function assignShift(req, res) {
  const shiftId = Number(req.params.id);
  const employeeId = Number(req.body.employeeId);
  if (!employeeId) return fail(res, 400, "Employee is required.");
  const shift = db.prepare("SELECT * FROM shifts WHERE id = ?").get(shiftId);
  const employee = db.prepare("SELECT employees.*, users.role FROM employees JOIN users ON users.id = employees.user_id WHERE employees.id = ?").get(employeeId);
  if (!shift || !employee) return fail(res, 404, "Shift or employee not found.");
  const supervisor = db.prepare("SELECT department_id FROM employees WHERE user_id = ?").get(req.user.id);
  if (req.user.role === "supervisor" && (shift.department_id !== supervisor?.department_id || employee.department_id !== supervisor?.department_id)) {
    return fail(res, 403, "Supervisors can only assign shifts in their own department.");
  }

  db.prepare("INSERT OR IGNORE INTO rota_assignments (shift_id, employee_id, role) VALUES (?, ?, ?)").run(shiftId, employeeId, req.body.role || shift.title);
  auditLog(req.user.id, "shifts.assign", "rota_assignments", shiftId, { employeeId });
  return ok(res, { assigned: true });
}

export function removeAssignment(req, res) {
  const shiftId = Number(req.params.id);
  const employeeId = Number(req.params.employeeId);
  const shift = db.prepare("SELECT * FROM shifts WHERE id = ?").get(shiftId);
  const employee = db.prepare("SELECT * FROM employees WHERE id = ?").get(employeeId);
  if (!shift || !employee) return fail(res, 404, "Assignment not found.");
  const supervisor = db.prepare("SELECT department_id FROM employees WHERE user_id = ?").get(req.user.id);
  if (req.user.role === "supervisor" && (shift.department_id !== supervisor?.department_id || employee.department_id !== supervisor?.department_id)) {
    return fail(res, 403, "Supervisors can only update shifts in their own department.");
  }
  db.prepare("DELETE FROM rota_assignments WHERE shift_id = ? AND employee_id = ?").run(shiftId, employeeId);
  auditLog(req.user.id, "shifts.unassign", "rota_assignments", shiftId, { employeeId });
  return ok(res, { removed: true });
}
