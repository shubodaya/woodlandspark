import { Router } from "express";
import { createShift, listShifts } from "../controllers/shiftController.js";
import { attachUser, managerRoles, requireRoles, staffRoles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/responses.js";

export const shiftRoutes = Router();

shiftRoutes.use(attachUser);
shiftRoutes.get("/", requireRoles(staffRoles), asyncHandler(listShifts));
shiftRoutes.post("/", requireRoles(managerRoles), asyncHandler(createShift));
