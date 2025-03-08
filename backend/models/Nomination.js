import mongoose from "mongoose";

const nominationSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  position: {
    type: String,
    required: true,
    enum: ["President", "Vice President", "Secretary", "Treasurer"], // Add positions as needed
  },
  department: {
    type: String,
    required: true,
  },
  classYear: {
    type: String,
    required: true,
  },
  attendancePercentage: {
    type: Number,
    required: true,
  },
  cgpa: {
    type: Number,
    required: true,
  },
  disciplinaryClearance: {
    type: Boolean,
    required: true,
  },
  manifesto: {
    type: String, // Store URL of uploaded file
    required: true,
  },
  profilePicture: {
    type: String, // Store URL of uploaded image
    required: true,
  },
  nominationStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  rejectionReason: {
    type: String,
    default: null,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
});

const Nomination = mongoose.model("Nomination", nominationSchema);
export default Nomination;
