import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Your Role: {user.role}</p>

      {/* Admin Dashboard Actions */}
      <button onClick={() => navigate("/approve-logins")}>Approve/Reject Login Requests</button>
      <button onClick={() => navigate("/approve-nominations")}>Approve/Reject Nominations</button>
      <button onClick={() => navigate("/declare-election")}>Declare Elections</button>
      <button onClick={() => navigate("/declare-results")}>Declare Results</button>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
