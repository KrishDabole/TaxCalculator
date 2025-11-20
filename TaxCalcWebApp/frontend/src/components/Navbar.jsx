import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  // Determine current page for smart link visibility
  const isDashboard = location.pathname === "/dashboard";
  const isTaxCalculator = location.pathname === "/tax";
  const isChangePassword = location.pathname === "/change-password";

  // Show navigation links only when not on the respective page
  const showDashboardLink = !isDashboard;
  const showTaxCalculatorLink = !isTaxCalculator;
  const showChangePasswordLink = !isChangePassword;

  return (
    <nav className="navbar p-4 flex justify-between items-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl border-b border-white/10">
      {/* Logo Section */}
      <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/dashboard")}>
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 group-hover:scale-105 transition-all duration-300 shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">TaxCalculator</h1>
          <p className="text-white/70 text-xs font-medium">Smart Tax Solutions</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Enhanced Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`relative w-14 h-7 rounded-full p-1 flex items-center transition-all duration-500 shadow-lg ${
            isDarkMode 
              ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600" 
              : "bg-gradient-to-r from-yellow-300 to-orange-400 border border-yellow-200"
          }`}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <div
            className={`absolute w-6 h-6 rounded-full bg-white shadow-lg transform transition-all duration-500 flex items-center justify-center ${
              isDarkMode ? "translate-x-7" : "translate-x-0"
            }`}
          >
            {isDarkMode ? (
              <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
              </svg>
            ) : (
              <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
              </svg>
            )}
          </div>
        </button>

        {user ? (
          <div className="flex gap-3 items-center">
            {/* Smart Navigation Links */}
            {showDashboardLink && (
              <Link 
                to="/dashboard" 
                className="relative px-5 py-2.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}

            {showTaxCalculatorLink && (
              <Link 
                to="/tax" 
                className="relative px-5 py-2.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tax Calculator
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}

            {showChangePasswordLink && (
              <Link 
                to="/change-password" 
                className="relative px-5 py-2.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Security
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}

            {/* Enhanced Logout Button */}
            <button
              onClick={handleLogout}
              className="relative px-5 py-2.5 rounded-xl font-semibold text-white bg-red-500/90 hover:bg-red-600 backdrop-blur-sm transition-all duration-300 group overflow-hidden shadow-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        ) : (
          <div className="flex gap-3 items-center">
            <Link 
              to="/" 
              className="relative px-6 py-2.5 rounded-xl font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              to="/register" 
              className="relative px-6 py-2.5 rounded-xl font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Sign Up</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
