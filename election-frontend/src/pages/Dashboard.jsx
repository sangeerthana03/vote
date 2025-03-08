import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";
import SubAdminDashboard from "./SubAdminDashboard";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Redirect to login if no user
  useEffect(() => {
    if (!user) {
      console.log("🔴 No user found, redirecting to login...");
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null; // Prevent rendering if user is null

  return (
    <>
      {user.role === "Student" && <StudentDashboard />}
      {user.role === "Admin" && <AdminDashboard />}
      {user.role === "Sub-Admin" && <SubAdminDashboard />}
    </>
  );
};

export default Dashboard;
