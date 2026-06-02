import { db, now } from "../db/connection.js";
import { auditLog } from "../utils/audit.js";
import { fail, ok } from "../utils/responses.js";

const managerRoles = ["manager", "supervisor", "admin", "super_admin"];

function employeeForUser(userId) {
  return db.prepare(`
    SELECT employees.*, departments.name AS department_name
    FROM employees
    LEFT JOIN departments ON departments.id = employees.department_id
    WHERE employees.user_id = ?
  `).get(userId);
}

function assignedShifts(employeeId) {
  if (!employeeId) return [];
  return db.prepare(`
    SELECT shifts.*, departments.name AS department_name
    FROM rota_assignments
    JOIN shifts ON shifts.id = rota_assignments.shift_id
    LEFT JOIN departments ON departments.id = shifts.department_id
    WHERE rota_assignments.employee_id = ?
    ORDER BY shifts.date, shifts.start_time
  `).all(employeeId);
}

function activeSession(employeeId) {
  if (!employeeId) return null;
  return db.prepare(`
    SELECT time_clock_sessions.*, shifts.title AS shift_title, shifts.date AS shift_date,
      shifts.start_time AS shift_start_time, shifts.end_time AS shift_end_time,
      work_locations.name AS work_location_name, work_locations.radius_meters AS work_location_radius
    FROM time_clock_sessions
    LEFT JOIN shifts ON shifts.id = time_clock_sessions.shift_id
    LEFT JOIN work_locations ON work_locations.id = time_clock_sessions.work_location_id
    WHERE time_clock_sessions.employee_id = ? AND time_clock_sessions.status = 'in_progress'
    ORDER BY time_clock_sessions.clock_in_at DESC
    LIMIT 1
  `).get(employeeId);
}

function lastSession(employeeId) {
  if (!employeeId) return null;
  return db.prepare(`
    SELECT time_clock_sessions.*, shifts.title AS shift_title, work_locations.name AS work_location_name
    FROM time_clock_sessions
    LEFT JOIN shifts ON shifts.id = time_clock_sessions.shift_id
    LEFT JOIN work_locations ON work_locations.id = time_clock_sessions.work_location_id
    WHERE time_clock_sessions.employee_id = ? AND time_clock_sessions.status = 'finished'
    ORDER BY time_clock_sessions.clock_out_at DESC
    LIMIT 1
  `).get(employeeId);
}

function weekRange(base = new Date()) {
  const start = new Date(base);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  start.setDate(start.getDate() + (day === 0 ? -6 : 1 - day));
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start, end, startDate: isoDate(start), endDate: isoDate(addDays(end, -1)) };
}

function buildDashboardData(user) {
  const employee = employeeForUser(user.id);
  const shifts = assignedShifts(employee?.id);
  const range = weekRange();
  const today = isoDate(new Date());
  const weekShifts = shifts.filter((shift) => shift.date >= range.startDate && shift.date <= range.endDate);
  const upcomingShifts = shifts.filter((shift) => shift.date >= today);
  const currentShift = findCurrentShift(shifts);
  const currentSession = activeSession(employee?.id);
  const previousSession = lastSession(employee?.id);
  const workedHours = employee?.id ? workedHoursForRange(employee.id, range.start.toISOString(), range.end.toISOString()) : 0;
  const openShifts = employee?.department_id ? openDepartmentShifts(employee.department_id, today) : [];
  const leaveItems = employee?.id ? leaveForEmployee(employee.id, today) : [];
  const timeOffSummary = employee?.id ? timeOffCounts(employee.id, range.startDate, range.endDate) : { unavailability: 0, leave: 0, absences: 0 };

  return {
    employee,
    shifts,
    activeSession: currentSession,
    lastSession: previousSession,
    currentShift,
    workLocation: currentSession ? null : defaultWorkLocation(),
    weekSummary: {
      dateRange: `${formatShortDate(range.start)} - ${formatShortDate(addDays(range.end, -1))}`,
      scheduledHours: roundHours(weekShifts.reduce((total, shift) => total + shiftHours(shift), 0)),
      workedHours: roundHours(workedHours),
      shiftCount: weekShifts.length,
    },
    scheduleOverview: {
      dateRange: `${formatShortDate(range.start)} - ${formatShortDate(addDays(range.end, -1))}`,
      upcomingShiftsCount: upcomingShifts.length,
      unconfirmedShiftsCount: 0,
      shiftConflictsCount: countConflicts(weekShifts),
    },
    availableShifts: {
      shiftOffersCount: openShifts.length,
      openShiftsCount: openShifts.length,
    },
    upcomingLeave: leaveItems,
    timeOffSummary,
  };
}

export function dashboard(req, res) {
  const base = buildDashboardData(req.user);
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
  const managerView = managerRoles.includes(req.user.role)
    ? db.prepare(`
        SELECT employees.id, users.name, users.email, users.role, departments.name AS department
        FROM employees
        JOIN users ON users.id = employees.user_id
        LEFT JOIN departments ON departments.id = employees.department_id
        ORDER BY users.name
      `).all()
    : [];

  return ok(res, { ...base, announcements, documents, managerView });
}

export function timeClock(req, res) {
  return ok(res, buildDashboardData(req.user));
}

export function startShift(req, res) {
  const employee = employeeForUser(req.user.id);
  if (!employee) return fail(res, 403, "This account is not linked to a staff employee record.");
  if (activeSession(employee.id)) return fail(res, 409, "A shift is already in progress.");

  const shifts = assignedShifts(employee.id);
  const shift = req.body.shiftId
    ? shifts.find((item) => String(item.id) === String(req.body.shiftId))
    : findCurrentShift(shifts) || shifts.find((item) => item.date >= isoDate(new Date()));
  const workLocation = resolveWorkLocation(req.body.workLocationId, shift);
  const locationCheck = validateClockLocation(req.body, workLocation);
  if (locationCheck.error) return fail(res, 400, locationCheck.error);

  const result = db.prepare(`
    INSERT INTO time_clock_sessions (
      employee_id, user_id, shift_id, work_location_id, status, clock_in_at,
      clock_in_latitude, clock_in_longitude, clock_in_accuracy_meters, clock_in_distance_meters,
      notes, updated_at
    )
    VALUES (?, ?, ?, ?, 'in_progress', ?, ?, ?, ?, ?, ?, ?)
  `).run(
    employee.id,
    req.user.id,
    shift?.id || null,
    workLocation?.id || null,
    now(),
    locationCheck.latitude,
    locationCheck.longitude,
    locationCheck.accuracy,
    locationCheck.distance,
    req.body.notes || null,
    now(),
  );
  auditLog(req.user.id, "staff.time_clock.start", "time_clock_sessions", result.lastInsertRowid, { shiftId: shift?.id || null, workLocationId: workLocation?.id || null });
  return ok(res, buildDashboardData(req.user));
}

export function endShift(req, res) {
  const employee = employeeForUser(req.user.id);
  if (!employee) return fail(res, 403, "This account is not linked to a staff employee record.");
  const session = activeSession(employee.id);
  if (!session) return fail(res, 404, "No active shift is in progress.");
  const workLocation = session.work_location_id ? db.prepare("SELECT * FROM work_locations WHERE id = ?").get(session.work_location_id) : defaultWorkLocation();
  const locationCheck = validateClockLocation(req.body, workLocation);
  if (locationCheck.error) return fail(res, 400, locationCheck.error);

  db.prepare(`
    UPDATE time_clock_sessions
    SET status = 'finished',
      clock_out_at = ?,
      clock_out_latitude = ?,
      clock_out_longitude = ?,
      clock_out_accuracy_meters = ?,
      clock_out_distance_meters = ?,
      updated_at = ?
    WHERE id = ?
  `).run(now(), locationCheck.latitude, locationCheck.longitude, locationCheck.accuracy, locationCheck.distance, now(), session.id);
  auditLog(req.user.id, "staff.time_clock.end", "time_clock_sessions", session.id, { workLocationId: workLocation?.id || null });
  return ok(res, buildDashboardData(req.user));
}

function defaultWorkLocation() {
  return db.prepare("SELECT * FROM work_locations WHERE active = 1 ORDER BY id LIMIT 1").get();
}

function resolveWorkLocation(workLocationId, shift) {
  if (workLocationId) {
    const selected = db.prepare("SELECT * FROM work_locations WHERE id = ? AND active = 1").get(Number(workLocationId));
    if (selected) return selected;
  }
  if (shift?.location) {
    const byName = db.prepare("SELECT * FROM work_locations WHERE lower(name) = lower(?) AND active = 1").get(shift.location);
    if (byName) return byName;
  }
  return defaultWorkLocation();
}

function validateClockLocation(body, workLocation) {
  if (!workLocation || workLocation.latitude == null || workLocation.longitude == null) {
    return { latitude: null, longitude: null, accuracy: null, distance: null };
  }
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);
  const accuracy = body.accuracy == null ? null : Number(body.accuracy);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { error: "Location is required before clocking in or out." };
  }
  const distance = distanceMeters(latitude, longitude, Number(workLocation.latitude), Number(workLocation.longitude));
  const radius = Number(workLocation.radius_meters || 100);
  if (distance > radius) {
    return { error: `You must be within ${radius}m of ${workLocation.name} to clock in or out.` };
  }
  return { latitude, longitude, accuracy: Number.isFinite(accuracy) ? accuracy : null, distance: Math.round(distance) };
}

function workedHoursForRange(employeeId, startIso, endIso) {
  const sessions = db.prepare(`
    SELECT clock_in_at, clock_out_at, status
    FROM time_clock_sessions
    WHERE employee_id = ? AND clock_in_at >= ? AND clock_in_at < ?
  `).all(employeeId, startIso, endIso);
  return sessions.reduce((total, session) => total + sessionHours(session), 0);
}

function leaveForEmployee(employeeId, today) {
  return db.prepare(`
    SELECT start_date AS startDate, end_date AS endDate, leave_type AS leaveType, status, notes
    FROM leave_requests
    WHERE employee_id = ? AND end_date >= ? AND status = 'approved'
    ORDER BY start_date
    LIMIT 5
  `).all(employeeId, today);
}

function timeOffCounts(employeeId, startDate, endDate) {
  const rows = db.prepare(`
    SELECT entry_type AS entryType, COUNT(*) AS count
    FROM time_off_entries
    WHERE employee_id = ? AND end_date >= ? AND start_date <= ?
    GROUP BY entry_type
  `).all(employeeId, startDate, endDate);
  const counts = { unavailability: 0, leave: 0, absences: 0 };
  for (const row of rows) {
    if (row.entryType === "unavailability") counts.unavailability = row.count;
    if (row.entryType === "leave") counts.leave = row.count;
    if (row.entryType === "absence") counts.absences = row.count;
  }
  return counts;
}

function openDepartmentShifts(departmentId, today) {
  return db.prepare(`
    SELECT shifts.*
    FROM shifts
    LEFT JOIN rota_assignments ON rota_assignments.shift_id = shifts.id
    WHERE shifts.department_id = ? AND shifts.date >= ? AND rota_assignments.id IS NULL
    ORDER BY shifts.date, shifts.start_time
    LIMIT 50
  `).all(departmentId, today);
}

function findCurrentShift(shifts) {
  const nowDate = new Date();
  const today = isoDate(nowDate);
  const nowMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();
  return shifts.find((shift) => {
    if (shift.date !== today) return false;
    const start = minutesFromTime(shift.start_time);
    const end = minutesFromTime(shift.end_time);
    return start != null && end != null && nowMinutes >= start - 60 && nowMinutes <= end + 60;
  }) || shifts.find((shift) => shift.date >= today) || null;
}

function countConflicts(shifts) {
  let count = 0;
  const byDate = new Map();
  for (const shift of shifts) {
    const list = byDate.get(shift.date) || [];
    byDate.set(shift.date, list);
    list.push(shift);
  }
  for (const list of byDate.values()) {
    const sorted = list.slice().sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)));
    for (let index = 1; index < sorted.length; index += 1) {
      if (minutesFromTime(sorted[index].start_time) < minutesFromTime(sorted[index - 1].end_time)) count += 1;
    }
  }
  return count;
}

function shiftHours(shift) {
  const start = minutesFromTime(shift.start_time);
  const end = minutesFromTime(shift.end_time);
  if (start == null || end == null) return 0;
  let total = end - start;
  if (total < 0) total += 24 * 60;
  if (!shift.paid_break) total -= Number(shift.break_minutes || 0);
  return Math.max(0, total / 60);
}

function sessionHours(session) {
  const start = new Date(session.clock_in_at).getTime();
  const end = session.clock_out_at ? new Date(session.clock_out_at).getTime() : Date.now();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.max(0, (end - start) / 3600000);
}

function minutesFromTime(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, count) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(date);
}

function roundHours(value) {
  return Math.round(Number(value || 0) * 10) / 10;
}

function distanceMeters(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
