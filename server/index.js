import express from "express";
import cookieParser from "cookie-parser";
import { mkdirSync } from "node:fs";
import { config } from "./config.js";
import { db } from "./db/connection.js";
import { firstAdmin } from "./controllers/authController.js";
import { authRoutes } from "./routes/authRoutes.js";
import { ticketRoutes } from "./routes/ticketRoutes.js";
import { publicRoutes } from "./routes/publicRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { staffRoutes } from "./routes/staffRoutes.js";
import { shiftRoutes } from "./routes/shiftRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

mkdirSync(config.uploadDir, { recursive: true });

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(config.uploadDir));

app.get("/api/health", (_req, res) => {
  const migrations = db.prepare("SELECT COUNT(*) AS count FROM migrations").get().count;
  res.json({ ok: true, status: "ready", database: "sqlite", migrations });
});

app.post("/api/setup/first-admin", firstAdmin);
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api", publicRoutes);

app.use(errorHandler);

app.listen(config.port, "127.0.0.1", () => {
  console.log(`Woodlands API listening on http://127.0.0.1:${config.port}`);
});
