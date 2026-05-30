import { fail } from "../utils/responses.js";

export function errorHandler(error, _req, res, _next) {
  console.error(error);
  return fail(res, error.status || 500, error.publicMessage || "Server error.");
}
