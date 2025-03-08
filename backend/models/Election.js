import mongoose from "mongoose";

const ElectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Election name (e.g., "College Union Election 2025")
  status: { type: String, enum: ["Ongoing", "Completed"], default: "Ongoing" }, // Status tracking
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  resultsDeclared: { type: Boolean, default: false }, // Track result declaration
});

export default mongoose.model("Election", ElectionSchema);
