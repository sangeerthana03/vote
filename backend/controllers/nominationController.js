import Nomination from "../models/Nomination.js";

// ✅ Submit Nomination with File Uploads
export const submitNomination = async (req, res) => {
  try {
    const {
      position,
      department,
      classYear,
      attendancePercentage,
      cgpa,
      disciplinaryClearance,
    } = req.body;

    // Validate required fields
    if (!req.files || !req.files.manifesto || !req.files.profilePicture) {
      return res.status(400).json({ message: "Both manifesto and profile picture are required." });
    }

    // Store file paths
    const manifestoPath = req.files.manifesto[0].path;
    const profilePicturePath = req.files.profilePicture[0].path;

    const nomination = new Nomination({
      candidate: req.user._id, // 👤 The logged-in student submitting the nomination
      position,
      department,
      classYear,
      attendancePercentage,
      cgpa,
      disciplinaryClearance,
      manifesto: manifestoPath,
      profilePicture: profilePicturePath,
      nominationStatus: "Pending",
    });

    await nomination.save();
    res.status(201).json({ message: "Nomination submitted successfully", nomination });
  } catch (error) {
    console.error("Error submitting nomination:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ✅ Approve Nomination (Admin Only)
export const approveNomination = async (req, res) => {
  try {
    const { id } = req.params;

    const nomination = await Nomination.findById(id);
    if (!nomination) {
      return res.status(404).json({ message: "Nomination not found." });
    }

    nomination.nominationStatus = "Approved";
    nomination.rejectionReason = null; // Clear rejection reason

    await nomination.save();
    res.json({ message: "Nomination approved successfully!", nomination });
  } catch (error) {
    console.error("Error approving nomination:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ❌ Reject Nomination (Admin Only)
export const rejectNomination = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({ message: "Rejection reason is required." });
    }

    const nomination = await Nomination.findById(id);
    if (!nomination) {
      return res.status(404).json({ message: "Nomination not found." });
    }

    nomination.nominationStatus = "Rejected";
    nomination.rejectionReason = rejectionReason;

    await nomination.save();
    res.json({ message: "Nomination rejected successfully!", nomination });
  } catch (error) {
    console.error("Error rejecting nomination:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ✅ Get All Nominations (Admin Only)
export const getAllNominations = async (req, res) => {
  try {
    const nominations = await Nomination.find().populate("candidate", "fullName email");
    res.json(nominations);
  } catch (error) {
    console.error("Error fetching nominations:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ✅ Get Logged-in Student's Nominations
export const getStudentNominations = async (req, res) => {
  try {
    const studentId = req.user._id;
    const nominations = await Nomination.find({ candidate: studentId });
    res.json(nominations);
  } catch (error) {
    console.error("Error fetching student nominations:", error);
    res.status(500).json({ message: "Server error." });
  }
};


