import { db } from "../db/connection.js";

export function auditLog(userId, action, entityType = null, entityId = null, metadata = null) {
  db.prepare(`
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId || null, action, entityType, entityId ? String(entityId) : null, metadata ? JSON.stringify(metadata) : null);
}
