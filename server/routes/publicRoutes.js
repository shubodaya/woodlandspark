import { Router } from "express";
import { listDocuments, listFaqs, listOpeningTimes, subscribeNewsletter } from "../controllers/publicController.js";
import { menuData } from "../controllers/foodController.js";
import { requireFields, validateEmailField } from "../middleware/validate.js";
import { asyncHandler } from "../utils/responses.js";

export const publicRoutes = Router();

publicRoutes.post("/newsletter/subscribe", requireFields(["email", "firstName", "lastName"]), validateEmailField("email"), asyncHandler(subscribeNewsletter));
publicRoutes.get("/faqs", asyncHandler(listFaqs));
publicRoutes.get("/opening-times", asyncHandler(listOpeningTimes));
publicRoutes.get("/documents", asyncHandler(listDocuments));
publicRoutes.get("/food/menu", asyncHandler(menuData));
