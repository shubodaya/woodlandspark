import { Router } from "express";
import { assignShift, createShift, deleteShift, listShifts, removeAssignment, updateShift } from "../controllers/shiftController.js";
import { attachUser, requireRoles, staffRoles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/responses.js";

export const shiftRoutes = Router();
const createRoles = ["manager", "admin", "super_admin"];
const assignRoles = ["manager", "admin", "super_admin"];

shiftRoutes.use(attachUser);
shiftRoutes.get("/", requireRoles(staffRoles), asyncHandler(listShifts));
shiftRoutes.post("/", requireRoles(createRoles), asyncHandler(createShift));
shiftRoutes.put("/:id", requireRoles(createRoles), asyncHandler(updateShift));
shiftRoutes.delete("/:id", requireRoles(createRoles), asyncHandler(deleteShift));
shiftRoutes.post("/:id/assignments", requireRoles(assignRoles), asyncHandler(assignShift));
shiftRoutes.delete("/:id/assignments/:employeeId", requireRoles(assignRoles), asyncHandler(removeAssignment));
