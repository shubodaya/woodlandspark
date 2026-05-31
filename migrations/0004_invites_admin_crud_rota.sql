ALTER TABLE users ADD COLUMN must_reset_password INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN invite_token_hash TEXT;
ALTER TABLE users ADD COLUMN invite_sent_at TEXT;
ALTER TABLE users ADD COLUMN invite_accepted_at TEXT;

ALTER TABLE shifts ADD COLUMN paid_break INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS email_outbox (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  provider_response TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_invite_token_hash ON users(invite_token_hash);
CREATE INDEX IF NOT EXISTS idx_email_outbox_status ON email_outbox(status);
