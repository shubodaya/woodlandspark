import { Router } from "express";
import multer from "multer";
import { config } from "../config.js";
import {
  dashboard,
  createDocument,
  createEvent,
  createFaq,
  createNewsletterSubscriber,
  createOpeningTime,
  createPage,
  createPageSection,
  createTicketType,
  createUser,
  deleteDocument,
  deleteEvent,
  deleteFaq,
  deleteMedia,
  deleteNewsletterSubscriber,
  deleteOpeningTime,
  deletePage,
  deletePageSection,
  deleteTicketType,
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
  resendUserInvite,
  resetUserPassword,
  updateEvent,
  updateFaq,
  updateDocument,
  updateMedia,
  updateNewsletterSubscriber,
  updateOpeningTime,
  updatePage,
  updatePageSection,
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
adminRoutes.post("/users/:id/invite", asyncHandler(resendUserInvite));
adminRoutes.post("/users/:id/reset-password", asyncHandler(resetUserPassword));
adminRoutes.put("/users/:id", asyncHandler(updateUser));
adminRoutes.get("/audit-logs", asyncHandler(listAuditLogs));
adminRoutes.get("/pages", asyncHandler(listPages));
adminRoutes.post("/pages", asyncHandler(createPage));
adminRoutes.post("/pages/:id/sections", asyncHandler(createPageSection));
adminRoutes.put("/page-sections/:sectionId", asyncHandler(updatePageSection));
adminRoutes.delete("/page-sections/:sectionId", asyncHandler(deletePageSection));
adminRoutes.put("/pages/:id", asyncHandler(updatePage));
adminRoutes.delete("/pages/:id", asyncHandler(deletePage));
adminRoutes.get("/events", asyncHandler(listEvents));
adminRoutes.post("/events", asyncHandler(createEvent));
adminRoutes.put("/events/:id", asyncHandler(updateEvent));
adminRoutes.delete("/events/:id", asyncHandler(deleteEvent));
adminRoutes.get("/faqs", asyncHandler(listFaqs));
adminRoutes.post("/faqs", asyncHandler(createFaq));
adminRoutes.put("/faqs/:id", asyncHandler(updateFaq));
adminRoutes.delete("/faqs/:id", asyncHandler(deleteFaq));
adminRoutes.get("/opening-times", asyncHandler(listOpeningTimes));
adminRoutes.post("/opening-times", asyncHandler(createOpeningTime));
adminRoutes.put("/opening-times/:id", asyncHandler(updateOpeningTime));
adminRoutes.delete("/opening-times/:id", asyncHandler(deleteOpeningTime));
adminRoutes.get("/media", asyncHandler(listMedia));
adminRoutes.post("/media", upload.single("file"), asyncHandler(uploadMedia));
adminRoutes.put("/media/:id", asyncHandler(updateMedia));
adminRoutes.delete("/media/:id", asyncHandler(deleteMedia));
adminRoutes.get("/documents", asyncHandler(listDocuments));
adminRoutes.post("/documents", asyncHandler(createDocument));
adminRoutes.put("/documents/:id", asyncHandler(updateDocument));
adminRoutes.delete("/documents/:id", asyncHandler(deleteDocument));
adminRoutes.get("/newsletter-subscribers", asyncHandler(listNewsletterSubscribers));
adminRoutes.post("/newsletter-subscribers", asyncHandler(createNewsletterSubscriber));
adminRoutes.put("/newsletter-subscribers/:id", asyncHandler(updateNewsletterSubscriber));
adminRoutes.delete("/newsletter-subscribers/:id", asyncHandler(deleteNewsletterSubscriber));
adminRoutes.get("/ticket-types", asyncHandler(listTicketTypes));
adminRoutes.post("/ticket-types", asyncHandler(createTicketType));
adminRoutes.put("/ticket-types/:id", asyncHandler(updateTicketType));
adminRoutes.delete("/ticket-types/:id", asyncHandler(deleteTicketType));
adminRoutes.get("/ticket-bookings", asyncHandler(listTicketBookings));
