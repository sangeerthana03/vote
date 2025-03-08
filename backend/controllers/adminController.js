import User from "../models/User.js";

// Get Pending Users (Sub-Admins & Students who need approval)
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false }); // Users awaiting approval
    res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending users", error });
  }
};

// Approve User (Admin Approves Sub-Admins & Students)
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isApproved = true;
    user.rejectionReason = null; // Clear rejection reason if previously rejected
    await user.save();

    res.json({ message: "User approved successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Reject User with Reason
export const rejectUser = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (!rejectionReason) {
      return res.status(400).json({ error: "Rejection reason is required" });
    }

    user.isApproved = false;
    user.rejectionReason = rejectionReason;
    await user.save();

    res.json({ message: "User rejected", rejectionReason });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
