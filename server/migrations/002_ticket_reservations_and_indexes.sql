UPDATE ticket_bookings
SET status = 'reservation_requested'
WHERE status = 'confirmed';

UPDATE ticket_bookings
SET payment_status = 'awaiting_payment'
WHERE payment_status = 'pending_local';

CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_ticket_bookings_user_id ON ticket_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_ticket_bookings_reference ON ticket_bookings(reference);
CREATE INDEX IF NOT EXISTS idx_ticket_booking_items_booking_id ON ticket_booking_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_pages_path ON pages(path);
CREATE INDEX IF NOT EXISTS idx_events_path ON events(path);
CREATE INDEX IF NOT EXISTS idx_attractions_path ON attractions(path);
CREATE INDEX IF NOT EXISTS idx_faqs_active_sort ON faqs(active, sort_order);
CREATE INDEX IF NOT EXISTS idx_opening_times_date ON opening_times(date);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_menu_items_cafe_category ON menu_items(cafe_id, category_id);
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(date);
CREATE INDEX IF NOT EXISTS idx_rota_assignments_shift ON rota_assignments(shift_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
