import { Router } from "express";
import { dashboard } from "../controllers/staffController.js";
import { attachUser, requireRoles, staffRoles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/responses.js";

export const staffRoutes = Router();

staffRoutes.use(attachUser, requireRoles(staffRoles));
staffRoutes.get("/dashboard", asyncHandler(dashboard));
