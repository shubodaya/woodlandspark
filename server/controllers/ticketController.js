import { db, now } from "../db/connection.js";
import { auditLog } from "../utils/audit.js";
import { fail, ok } from "../utils/responses.js";

function makeReference() {
  return `WOOD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function listTicketTypes(_req, res) {
  const ticketTypes = db.prepare(`
    SELECT id, slug, name, description, price_label AS priceLabel, price_pence AS pricePence, active
    FROM ticket_types
    WHERE active = 1
    ORDER BY sort_order, id
  `).all();
  return ok(res, { ticketTypes });
}

export function createBooking(req, res) {
  const { visitDate, items = [] } = req.body;
  if (!visitDate || !Array.isArray(items) || !items.length) return fail(res, 400, "Select a visit date and at least one ticket.");

  const selected = items
    .map((item) => ({
      ticketType: db.prepare("SELECT * FROM ticket_types WHERE id = ? AND active = 1").get(Number(item.ticketTypeId)),
      quantity: Number(item.quantity || 0),
    }))
    .filter((item) => item.ticketType && item.quantity > 0);

  if (!selected.length) return fail(res, 400, "Select at least one valid ticket quantity.");

  const reference = makeReference();
  const created = now();
  const totalPence = selected.reduce((total, item) => total + (item.ticketType.price_pence || 0) * item.quantity, 0);
  const customer = db.prepare("SELECT * FROM ticket_customers WHERE user_id = ?").get(req.user.id);

  const insert = db.transaction(() => {
    const customerId = customer?.id || db.prepare(`
      INSERT INTO ticket_customers (user_id, name, email)
      VALUES (?, ?, ?)
    `).run(req.user.id, req.user.name, req.user.email).lastInsertRowid;

    const bookingId = db.prepare(`
      INSERT INTO ticket_bookings (reference, user_id, customer_id, visit_date, status, payment_status, total_pence, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'reservation_requested', 'awaiting_payment', ?, ?, ?, ?)
    `).run(
      reference,
      req.user.id,
      customerId,
      visitDate,
      totalPence || null,
      "Reservation request created. Payment gateway integration pending approval.",
      created,
      created,
    ).lastInsertRowid;

    for (const item of selected) {
      db.prepare(`
        INSERT INTO ticket_booking_items (booking_id, ticket_type_id, ticket_name, quantity, price_label, price_pence)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(bookingId, item.ticketType.id, item.ticketType.name, item.quantity, item.ticketType.price_label, item.ticketType.price_pence);
    }

    return bookingId;
  });

  const bookingId = insert();
  auditLog(req.user.id, "tickets.booking.create", "ticket_bookings", bookingId, { reference });
  return ok(res, { booking: getBookingByIdForUser(bookingId, req.user) });
}

export function getBooking(req, res) {
  const booking = getBookingByIdForUser(Number(req.params.id), req.user);
  if (!booking) return fail(res, 404, "Booking not found.");
  return ok(res, { booking });
}

export function getBookingByIdForUser(id, user) {
  const booking = db.prepare(`
    SELECT ticket_bookings.*, ticket_customers.name AS customer_name, ticket_customers.email AS customer_email
    FROM ticket_bookings
    LEFT JOIN ticket_customers ON ticket_customers.id = ticket_bookings.customer_id
    WHERE ticket_bookings.id = ?
  `).get(id);
  if (!booking) return null;
  const adminRoles = ["admin", "editor", "super_admin"];
  if (booking.user_id !== user.id && !adminRoles.includes(user.role)) return null;
  const items = db.prepare(`
    SELECT ticket_booking_items.*, ticket_types.slug
    FROM ticket_booking_items
    LEFT JOIN ticket_types ON ticket_types.id = ticket_booking_items.ticket_type_id
    WHERE booking_id = ?
    ORDER BY id
  `).all(id);
  return { ...booking, items };
}
