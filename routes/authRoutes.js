import express from "express";
import { loginAgent, registerAgent, forgotPassword, resetPassword } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json(req.agent); // This returns the logged-in agent's info (without password)
});
router.post("/login", loginAgent);
router.post("/register", registerAgent); // optional
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
