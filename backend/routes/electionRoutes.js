import express from "express";
import { createElection, approveNomination } from "../controllers/electionController.js";
import { protect,isAdmin } from "../middleware/authMiddleware.js";
import { declareResults, getElectionResults } from "../controllers/electionController.js";

const router = express.Router();

router.post("/create", protect, createElection);
router.put("/approve/:id", protect, approveNomination);
router.post("/declare/:electionId", protect, isAdmin, declareResults); 
router.get("/results", protect, getElectionResults);

export default router;
