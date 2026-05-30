import { Router } from "express";
import { createBooking, getBooking, listTicketTypes } from "../controllers/ticketController.js";
import { attachUser, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/responses.js";

export const ticketRoutes = Router();

ticketRoutes.get("/types", asyncHandler(listTicketTypes));
ticketRoutes.post("/bookings", attachUser, requireAuth, asyncHandler(createBooking));
ticketRoutes.get("/bookings/:id", attachUser, requireAuth, asyncHandler(getBooking));
