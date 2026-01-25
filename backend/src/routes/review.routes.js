import express from "express";
import {
  addReview,
  getReviewsForListing,
  deleteReview,
} from "../controllers/review.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:listingId", protect, addReview);
router.get("/:listingId", getReviewsForListing);
router.delete("/:reviewId", protect, deleteReview);

export default router;
