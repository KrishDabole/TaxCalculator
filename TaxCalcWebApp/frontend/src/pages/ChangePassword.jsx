import { useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Helper function for conditional classes
  const themeClass = (lightClass, darkClass) => 
    isDarkMode ? darkClass : lightClass;

  const textPrimary = themeClass("text-text-dark", "text-white");
  const textSecondary = themeClass("text-text-light", "text-gray-300");
  const borderColor = themeClass("border-border-color", "border-gray-600");
  const inputBg = themeClass("bg-white", "bg-gray-700");
  const cardBg = themeClass("glass", "bg-gray-800/80");
  const placeholderColor = themeClass("placeholder-text-light", "placeholder-gray-400");

  const handleSubmit = async () => {
    // If user requires password change, only new password and confirm password are required
    if (user?.requiresPasswordChange) {
      if (!form.newPassword || !form.confirmPassword) {
        setMessage({ text: "Please fill in all fields", type: "error" });
        return;
      }
    } else {
      // Regular password change requires all fields
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        setMessage({ text: "Please fill in all fields", type: "error" });
        return;
      }
    }

    if (form.newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters", type: "error" });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      return;
    }

    if (!user?.requiresPasswordChange && form.currentPassword === form.newPassword) {
      setMessage({ text: "New password must be different from current password", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const requestData = user?.requiresPasswordChange 
        ? {
            newPassword: form.newPassword,
            username: user.username
          }
        : {
            currentPassword: form.currentPassword,
            newPassword: form.newPassword
          };

      await API.post("/api/auth/change-password", requestData);

      setMessage({
        text: user?.requiresPasswordChange 
          ? "Password changed successfully! Redirecting to dashboard..." 
          : "Password changed successfully!",
        type: "success"
      });

      if (user?.requiresPasswordChange) {
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setTimeout(() => {
          setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        }, 2000);
      }

    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      
      if (errorMessage.includes("Current password is incorrect")) {
        setMessage({
          text: "Current password is incorrect. Please try again.",
          type: "error"
        });
      } else {
        setMessage({
          text: `Password change failed: ${errorMessage}`,
          type: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  const clearMessage = () => {
    setMessage({ text: "", type: "" });
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'current') setShowCurrentPassword(!showCurrentPassword);
    if (field === 'new') setShowNewPassword(!showNewPassword);
    if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  const passwordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" };
    if (password.length < 6) return { strength: 1, text: "Weak", color: "text-red-500" };
    if (password.length < 8) return { strength: 2, text: "Fair", color: "text-yellow-500" };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 3, text: "Good", color: "text-blue-500" };
    return { strength: 4, text: "Strong", color: "text-green-500" };
  };

  const strength = passwordStrength(form.newPassword);

  return (
    <div className={`min-h-screen app-background flex items-center justify-center p-4 ${themeClass("", "bg-gray-900")}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${themeClass("bg-purple-200/20", "bg-purple-500/10")} blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full ${themeClass("bg-pink-200/20", "bg-pink-500/10")} blur-3xl animate-pulse delay-1000`}></div>
      </div>

      <div className={`relative ${cardBg} rounded-3xl p-8 w-full max-w-md border ${borderColor} shadow-2xl backdrop-blur-sm z-10`}>
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>

        <div className="text-center mb-8">
          <div className={`w-24 h-24 ${themeClass("bg-purple-100", "bg-purple-900/50")} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-sm`}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className={`text-4xl font-bold ${textPrimary} mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}>
            {user?.requiresPasswordChange ? "Set New Password" : "Change Password"}
          </h2>
          <p className={`${textSecondary} text-lg`}>
            {user?.requiresPasswordChange 
              ? "Please set a new password to continue" 
              : "Update your account password"
            }
          </p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            className={`p-4 mb-6 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
              message.type === 'success'
                ? `${themeClass("bg-green-100/80 border-green-200 text-green-800", "bg-green-900/50 border-green-700 text-green-300")}`
                : `${themeClass("bg-red-100/80 border-red-200 text-red-800", "bg-red-900/50 border-red-700 text-red-300")}`
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-3 text-sm font-medium">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'success' 
                    ? `${themeClass("bg-green-200 text-green-600", "bg-green-800 text-green-300")}`
                    : `${themeClass("bg-red-200 text-red-600", "bg-red-800 text-red-300")}`
                }`}>
                  {message.type === 'success' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {message.text}
              </span>
              <button
                onClick={clearMessage}
                className={`${themeClass("text-gray-500 hover:text-gray-700", "text-gray-400 hover:text-gray-200")} transition-colors duration-200 p-1 rounded-full hover:bg-black/5`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6" onKeyPress={handleKeyPress}>
          {/* Current Password - Only show for regular password changes */}
          {!user?.requiresPasswordChange && (
            <div className="space-y-3">
              <label className={`block ${textPrimary} text-sm font-semibold`}>Current Password</label>
              <div className="relative group">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(e) => {
                    setForm({ ...form, currentPassword: e.target.value });
                    clearMessage();
                  }}
                  className={`w-full px-4 py-4 pr-12 border ${borderColor} rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${inputBg} ${textPrimary} ${placeholderColor} transition-all duration-300 group-hover:shadow-lg outline-none`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg ${themeClass("text-gray-500 hover:bg-gray-100", "text-gray-400 hover:bg-gray-600")} transition-colors duration-200 outline-none`}
                  tabIndex={-1}
                >
                  {showCurrentPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          )}

          {/* New Password */}
          <div className="space-y-3">
            <label className={`block ${textPrimary} text-sm font-semibold`}>
              {user?.requiresPasswordChange ? "New Password" : "New Password"}
            </label>
            <div className="relative group">
              <input
                type={showNewPassword ? "text" : "password"}
                value={form.newPassword}
                onChange={(e) => {
                  setForm({ ...form, newPassword: e.target.value });
                  clearMessage();
                }}
                className={`w-full px-4 py-4 pr-12 border ${borderColor} rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${inputBg} ${textPrimary} ${placeholderColor} transition-all duration-300 group-hover:shadow-lg outline-none`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg ${themeClass("text-gray-500 hover:bg-gray-100", "text-gray-400 hover:bg-gray-600")} transition-colors duration-200 outline-none`}
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            
            {/* Password Strength Indicator */}
            {form.newPassword && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className={textSecondary}>Password strength:</span>
                  <span className={`font-semibold ${strength.color}`}>{strength.text}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      strength.strength === 1 ? 'bg-red-500 w-1/4' :
                      strength.strength === 2 ? 'bg-yellow-500 w-1/2' :
                      strength.strength === 3 ? 'bg-blue-500 w-3/4' :
                      strength.strength === 4 ? 'bg-green-500 w-full' :
                      'bg-gray-300 w-0'
                    }`}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-3">
            <label className={`block ${textPrimary} text-sm font-semibold`}>Confirm New Password</label>
            <div className="relative group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => {
                  setForm({ ...form, confirmPassword: e.target.value });
                  clearMessage();
                }}
                className={`w-full px-4 py-4 pr-12 border ${borderColor} rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${inputBg} ${textPrimary} ${placeholderColor} transition-all duration-300 group-hover:shadow-lg outline-none`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg ${themeClass("text-gray-500 hover:bg-gray-100", "text-gray-400 hover:bg-gray-600")} transition-colors duration-200 outline-none`}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            
            {/* Password Match Indicator */}
            {form.confirmPassword && (
              <div className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                form.newPassword === form.confirmPassword 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  form.newPassword === form.confirmPassword 
                    ? "bg-green-100 text-green-600" 
                    : "bg-red-100 text-red-600"
                }`}>
                  {form.newPassword === form.confirmPassword ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="font-medium">
                  {form.newPassword === form.confirmPassword ? "Passwords match" : "Passwords do not match"}
                </span>
              </div>
            )}
          </div>

          {/* Change Password Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:transform hover:scale-[1.02] disabled:transform-none shadow-lg disabled:shadow-none group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {user?.requiresPasswordChange ? "Setting Password..." : "Changing Password..."}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {user?.requiresPasswordChange ? "Set Password" : "Change Password"}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>

          {/* Back to Dashboard */}
          {!user?.requiresPasswordChange && (
            <p className={`text-center ${textSecondary} text-sm`}>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-purple-600 hover:text-purple-700 font-semibold transition-all duration-200 hover:transform hover:scale-105 inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
