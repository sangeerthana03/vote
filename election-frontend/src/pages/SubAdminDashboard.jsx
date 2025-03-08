import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SubAdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Your Role: {user.role}</p>

      {/* Sub-Admin Dashboard Actions */}
      <button onClick={() => navigate("/approve-students")}>Approve/Reject Students</button>
      <button onClick={() => navigate("/approve-nominations")}>Approve/Reject Nominations</button>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default SubAdminDashboard;
