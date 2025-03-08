import express from "express";
import { castVote, getResults } from "../controllers/voteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/cast", protect, castVote);
router.get("/results/:id", protect, getResults);

export default router;
