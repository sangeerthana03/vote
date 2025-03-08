import { Routes, Route } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister";//not needed
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register"; // Import Register component
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";

function App() {
  console.log("✅ App is rendering..."); // Debugging Log

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* ✅ Added Register Route */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
