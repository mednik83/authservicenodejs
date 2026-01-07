import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import * as authController from "../contollers/authController";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.post("/refresh", authController.refresh);
router.get("/verify", authMiddleware, authController.verify);

export default router;
