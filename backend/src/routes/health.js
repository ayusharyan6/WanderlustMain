import express from "express";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Wanderlust backend is healthy",
  });
});

// protected route (JWT test)
router.get("/health/protected", protect, (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "JWT is VALID",
    user: req.user,
  });
});

export default router;
