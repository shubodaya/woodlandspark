import { fail } from "../utils/responses.js";

export function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter((field) => {
      const value = req.body?.[field];
      return value === undefined || value === null || String(value).trim() === "";
    });
    if (missing.length) return fail(res, 400, "Missing required fields.", missing);
    return next();
  };
}

export function validateEmailField(field = "email") {
  return (req, res, next) => {
    const value = String(req.body?.[field] || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return fail(res, 400, "Enter a valid email address.");
    req.body[field] = value.toLowerCase();
    return next();
  };
}
