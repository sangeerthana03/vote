import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  voter: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true }, // Only one vote per student
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Nomination", required: true }, // Candidate receiving vote
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Vote", VoteSchema);
