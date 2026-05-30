ALTER TABLE users ADD COLUMN disabled_at TEXT;

CREATE INDEX IF NOT EXISTS idx_users_disabled_at ON users(disabled_at);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_rota_assignments_employee ON rota_assignments(employee_id);
