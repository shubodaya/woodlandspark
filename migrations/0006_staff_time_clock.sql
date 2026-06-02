CREATE TABLE IF NOT EXISTS work_locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  latitude REAL,
  longitude REAL,
  radius_meters INTEGER NOT NULL DEFAULT 100,
  active INTEGER NOT NULL DEFAULT 1,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS time_clock_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shift_id INTEGER REFERENCES shifts(id) ON DELETE SET NULL,
  work_location_id INTEGER REFERENCES work_locations(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  clock_in_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  clock_out_at TEXT,
  clock_in_latitude REAL,
  clock_in_longitude REAL,
  clock_in_accuracy_meters REAL,
  clock_in_distance_meters REAL,
  clock_out_latitude REAL,
  clock_out_longitude REAL,
  clock_out_accuracy_meters REAL,
  clock_out_distance_meters REAL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS time_clock_breaks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL REFERENCES time_clock_sessions(id) ON DELETE CASCADE,
  break_start_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  break_end_at TEXT,
  paid_break INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  leave_type TEXT NOT NULL DEFAULT 'leave',
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS time_off_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO work_locations (id, name, description, latitude, longitude, radius_meters, active)
VALUES (1, 'Woodlands Family Theme Park', 'Default staff clock-in geofence for the Woodlands site. Admins or managers can replace this with more precise operational locations.', 50.3563, -3.6716, 100, 1);

CREATE INDEX IF NOT EXISTS idx_work_locations_active ON work_locations(active);
CREATE INDEX IF NOT EXISTS idx_time_clock_sessions_employee_status ON time_clock_sessions(employee_id, status);
CREATE INDEX IF NOT EXISTS idx_time_clock_sessions_shift ON time_clock_sessions(shift_id);
CREATE INDEX IF NOT EXISTS idx_time_clock_sessions_clock_in ON time_clock_sessions(clock_in_at);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_dates ON leave_requests(employee_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_time_off_entries_employee_dates ON time_off_entries(employee_id, start_date, end_date);
