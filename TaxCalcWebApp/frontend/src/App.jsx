import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TaxCalculator from "./pages/TaxCalculator";
import ChangePassword from "./pages/ChangePassword"; // Add this import
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tax" element={<TaxCalculator />} />
        <Route path="/change-password" element={<ChangePassword />} /> {/* Add this route */}
      </Routes>
    </div>
  );
}
