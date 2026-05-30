import { Router } from "express";
import multer from "multer";
import { config } from "../config.js";
import {
  dashboard,
  createUser,
  listAuditLogs,
  listDocuments,
  listEvents,
  listFaqs,
  listMedia,
  listNewsletterSubscribers,
  listOpeningTimes,
  listPages,
  listTicketBookings,
  listTicketTypes,
  listUsers,
  updateEvent,
  updateFaq,
  updateOpeningTime,
  updatePage,
  updateTicketType,
  updateUser,
  uploadMedia,
} from "../controllers/adminController.js";
import { adminRoles, attachUser, requireRoles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/responses.js";

const upload = multer({ dest: config.uploadDir });

export const adminRoutes = Router();

adminRoutes.use(attachUser, requireRoles(adminRoles));
adminRoutes.get("/dashboard", asyncHandler(dashboard));
adminRoutes.get("/users", asyncHandler(listUsers));
adminRoutes.post("/users", asyncHandler(createUser));
adminRoutes.put("/users/:id", asyncHandler(updateUser));
adminRoutes.get("/audit-logs", asyncHandler(listAuditLogs));
adminRoutes.get("/pages", asyncHandler(listPages));
adminRoutes.put("/pages/:id", asyncHandler(updatePage));
adminRoutes.get("/events", asyncHandler(listEvents));
adminRoutes.put("/events/:id", asyncHandler(updateEvent));
adminRoutes.get("/faqs", asyncHandler(listFaqs));
adminRoutes.put("/faqs/:id", asyncHandler(updateFaq));
adminRoutes.get("/opening-times", asyncHandler(listOpeningTimes));
adminRoutes.put("/opening-times/:id", asyncHandler(updateOpeningTime));
adminRoutes.get("/media", asyncHandler(listMedia));
adminRoutes.post("/media", upload.single("file"), asyncHandler(uploadMedia));
adminRoutes.get("/documents", asyncHandler(listDocuments));
adminRoutes.get("/newsletter-subscribers", asyncHandler(listNewsletterSubscribers));
adminRoutes.get("/ticket-types", asyncHandler(listTicketTypes));
adminRoutes.put("/ticket-types/:id", asyncHandler(updateTicketType));
adminRoutes.get("/ticket-bookings", asyncHandler(listTicketBookings));
