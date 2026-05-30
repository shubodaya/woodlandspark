import { resolve } from "node:path";

export const config = {
  port: Number(process.env.WOODLANDS_SERVER_PORT || 5180),
  dbPath: resolve(process.env.WOODLANDS_DB_PATH || "server/db/woodlands.sqlite"),
  uploadDir: resolve(process.env.WOODLANDS_UPLOAD_DIR || "server/uploads"),
  sessionCookie: process.env.WOODLANDS_SESSION_COOKIE || "woodlands_session",
  sessionDays: Number(process.env.WOODLANDS_SESSION_DAYS || 7),
};
