import { Router } from "express";
import { dashboard } from "../controllers/staffController.js";
import { assignShift, createShift, deleteShift, listShifts, removeAssignment, updateShift } from "../controllers/shiftController.js";
import { attachUser, requireRoles, staffRoles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/responses.js";

export const staffRoutes = Router();
const createRoles = ["manager", "admin", "super_admin"];
const assignRoles = ["manager", "admin", "super_admin"];

staffRoutes.use(attachUser, requireRoles(staffRoles));
staffRoutes.get("/dashboard", asyncHandler(dashboard));
staffRoutes.get("/rota", asyncHandler(listShifts));
staffRoutes.get("/rota/shifts", asyncHandler(listShifts));
staffRoutes.post("/rota/shifts", requireRoles(createRoles), asyncHandler(createShift));
staffRoutes.put("/rota/shifts/:id", requireRoles(createRoles), asyncHandler(updateShift));
staffRoutes.delete("/rota/shifts/:id", requireRoles(createRoles), asyncHandler(deleteShift));
staffRoutes.post("/rota/shifts/:id/assignments", requireRoles(assignRoles), asyncHandler(assignShift));
staffRoutes.delete("/rota/shifts/:id/assignments/:employeeId", requireRoles(assignRoles), asyncHandler(removeAssignment));
