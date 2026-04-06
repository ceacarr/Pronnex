import express from "express";
import { validateRequest }  from "zod-express-middleware";
import { protect } from "../middleware/authMiddleware.js";
import { registerSchema, loginSchema } from "../libs/validate-schema.js";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register
router.post(
  "/register",
  validateRequest({
    body: registerSchema,
  }),
  registerUser
);
router.post(
  "/login",
  validateRequest({
    body: loginSchema,
  }),
  loginUser
);
router.get("/me", protect, getMe);

export default router;
