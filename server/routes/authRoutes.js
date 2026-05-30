import { Router } from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { attachUser } from "../middleware/auth.js";
import { requireFields, validateEmailField } from "../middleware/validate.js";
import { asyncHandler } from "../utils/responses.js";

export const authRoutes = Router();

authRoutes.post("/register", requireFields(["name", "email", "password"]), validateEmailField("email"), asyncHandler(register));
authRoutes.post("/login", requireFields(["email", "password"]), validateEmailField("email"), asyncHandler(login));
authRoutes.post("/logout", attachUser, asyncHandler(logout));
authRoutes.get("/me", attachUser, asyncHandler(me));
