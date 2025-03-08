import User from "../models/User.js";

/**
 * GET all students under the sub-admin (class tutor).
 */
export const getStudentsByClass = async (req, res) => {
    try {
        const subAdminId = req.user.id; // Extract sub-admin ID from the logged-in user
        const subAdmin = await User.findById(subAdminId);

        if (!subAdmin || subAdmin.role !== "Sub-Admin") { // Fix: Case-sensitive role check
            return res.status(403).json({ message: "Unauthorized access" });
        }

        // Fetch students belonging to the same class and department as the sub-admin
        const students = await User.find({ 
            department: subAdmin.department, 
            classYear: subAdmin.classYear, 
            role: "Student" // Fix: Capitalized role name
        });

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error });
    }
};

/**
 * APPROVE student registration by sub-admin.
 */
export const approveStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const subAdminId = req.user.id;

        const subAdmin = await User.findById(subAdminId);
        if (!subAdmin || subAdmin.role !== "Sub-Admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const student = await User.findById(studentId);
        if (!student || student.role !== "Student") {
            return res.status(404).json({ message: "Student not found" });
        }

        // Ensure sub-admin is approving only students from their class
        if (student.department !== subAdmin.department || student.classYear !== subAdmin.classYear) {
            return res.status(403).json({ message: "Cannot approve students from another class" });
        }

        student.isApproved = true;
        student.rejectionReason = null; // Fix: Remove previous rejection reason if any
        await student.save();

        res.status(200).json({ message: "Student approved successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Error approving student", error });
    }
};

/**
 * REJECT student registration by sub-admin (without deleting).
 */
export const rejectStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { reason } = req.body; // Fix: Ensure we get a rejection reason
        const subAdminId = req.user.id;

        const subAdmin = await User.findById(subAdminId);
        if (!subAdmin || subAdmin.role !== "Sub-Admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const student = await User.findById(studentId);
        if (!student || student.role !== "Student") {
            return res.status(404).json({ message: "Student not found" });
        }

        // Ensure sub-admin is rejecting only students from their class
        if (student.department !== subAdmin.department || student.classYear !== subAdmin.classYear) {
            return res.status(403).json({ message: "Cannot reject students from another class" });
        }

        if (!reason) {
            return res.status(400).json({ message: "Rejection reason is required" });
        }

        student.isApproved = false;
        student.rejectionReason = reason; // Fix: Store rejection reason instead of deleting
        await student.save();

        res.status(200).json({ message: "Student rejected successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Error rejecting student", error });
    }
};
