export function ok(res, data = {}) {
  return res.json({ ok: true, ...data });
}

export function fail(res, status, message, details = null) {
  return res.status(status).json({ ok: false, error: message, details });
}

export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
