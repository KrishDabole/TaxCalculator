import { useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showResetModal, setShowResetModal] = useState(false);
  const [showForgotUsernameModal, setShowForgotUsernameModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [forgotUsernameData, setForgotUsernameData] = useState({ fullName: "" });
  const [resetLoading, setResetLoading] = useState(false);
  const [forgotUsernameLoading, setForgotUsernameLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [retrievedCredentials, setRetrievedCredentials] = useState(null);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Helper function for conditional classes
  const themeClass = (lightClass, darkClass) => 
    isDarkMode ? darkClass : lightClass;

  // Theme variables
  const textPrimary = themeClass("text-text-dark", "text-white");
  const textSecondary = themeClass("text-text-light", "text-gray-300");
  const borderColor = themeClass("border-border-color", "border-gray-600");
  const inputBg = themeClass("bg-white", "bg-gray-700");
  const cardBg = themeClass("glass", "bg-gray-800");
  const placeholderColor = themeClass("placeholder-text-light", "placeholder-gray-400");

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setMessage({ text: "Please enter username and password", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await API.post("/api/auth/login", form);
      
      // Check if password needs to be changed (temporary password)
      if (response.data.requiresPasswordChange) {
        loginUser({
          username: form.username,
          fullName: response.data.fullName,
          requiresPasswordChange: true
        }, response.data.token);
        
        setMessage({
          text: "Logged in !,Please set a new password",
          type: "warning"
        });

        setTimeout(() => {
          navigate("/change-password");
        }, 2000);
      } else {
        loginUser({
          username: form.username,
          fullName: response.data.fullName,
          requiresPasswordChange: false
        }, response.data.token);

        setMessage({
          text: "Login successful! Redirecting...",
          type: "success"
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }

    } catch (error) {
      const errorMessage = error.response?.data || error.message;

      if (errorMessage.includes("Invalid credentials") || error.response?.status === 401) {
        setMessage({
          text: "Invalid username or password.",
          type: "error"
        });
      } else if (errorMessage.includes("User not found")) {
        setMessage({
          text: "User not found. Please check your username or register.",
          type: "error"
        });
      } else {
        setMessage({
          text: `Login failed: ${errorMessage}`,
          type: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin();
    }
  };

  const handleResetKeyPress = (e) => {
    if (e.key === 'Enter' && !resetLoading) {
      handlePasswordReset();
    }
  };

  const handleForgotUsernameKeyPress = (e) => {
    if (e.key === 'Enter' && !forgotUsernameLoading) {
      handleForgotUsername();
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      setMessage({ text: "Please enter your username", type: "error" });
      return;
    }

    setResetLoading(true);
    try {
      const response = await API.post("/api/auth/reset-password", {
        username: resetEmail
      });

      // Extract the temporary password from the response
      const responseText = response.data;
      const tempPasswordMatch = responseText.match(/temporary password is: (\w+)/);
      const temporaryPassword = tempPasswordMatch ? tempPasswordMatch[1] : "Unable to retrieve";

      setRetrievedCredentials({
        username: resetEmail,
        temporaryPassword: temporaryPassword
      });

      setMessage({
        text: "Password reset successful! Please use the temporary password below to login.",
        type: "success"
      });

    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      if (errorMessage.includes("User not found")) {
        setMessage({
          text: "Username not found. Please check your username or use 'Forgot Username'.",
          type: "error"
        });
        setShowResetModal(false);
      } else {
        setMessage({
          text: `Reset failed: ${errorMessage}`,
          type: "error"
        });
      }
    } finally {
      setResetLoading(false);
    }
  };

  const handleForgotUsername = async () => {
    if (!forgotUsernameData.fullName.trim()) {
      setMessage({ text: "Please enter your full name", type: "error" });
      return;
    }

    setForgotUsernameLoading(true);
    try {
      const response = await API.post("/api/auth/forgot-username", {
        fullName: forgotUsernameData.fullName
      });

      setRetrievedCredentials({
        username: response.data.username,
        temporaryPassword: response.data.temporaryPassword
      });
      
      setMessage({
        text: "Username retrieved successfully!",
        type: "success"
      });

    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      setMessage({
        text: `Failed to retrieve username: ${errorMessage}`,
        type: "error"
      });
      setShowForgotUsernameModal(false);
    } finally {
      setForgotUsernameLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage({ text: "", type: "" });
  };

  const openResetModal = () => {
    setShowResetModal(true);
    setResetEmail(form.username);
    setRetrievedCredentials(null);
    setMessage({ text: "", type: "" });
  };

  const openForgotUsernameModal = () => {
    setShowForgotUsernameModal(true);
    setForgotUsernameData({ fullName: "" });
    setRetrievedCredentials(null);
    setMessage({ text: "", type: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const closeModals = () => {
    setShowResetModal(false);
    setShowForgotUsernameModal(false);
    setRetrievedCredentials(null);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage({ text: "Copied to clipboard!", type: "success" });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setMessage({ text: "Copied to clipboard!", type: "success" });
    }
  };

  return (
    <div className={`min-h-screen app-background flex items-center justify-center p-4 ${themeClass("", "bg-gray-900")}`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${themeClass("bg-blue-200/30", "bg-blue-500/10")} blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full ${themeClass("bg-purple-200/30", "bg-purple-500/10")} blur-3xl animate-pulse delay-1000`}></div>
      </div>

      <div className={`relative ${cardBg} rounded-3xl p-8 w-full max-w-md border ${borderColor} shadow-2xl backdrop-blur-sm z-10`}>
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        <div className="text-center mb-8">
          <div className={`w-24 h-24 ${themeClass("bg-blue-100", "bg-blue-900/50")} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-sm`}>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className={`text-4xl font-bold ${textPrimary} mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            Hi there!
          </h2>
          <p className={`${textSecondary} text-lg`}>Let's calculate your taxes efficiently</p>
        </div>

        {/* Enhanced Message Display */}
        {message.text && (
          <div
            className={`p-4 mb-6 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
              message.type === 'success'
                ? `${themeClass("bg-green-100/80 border-green-200 text-green-800", "bg-green-900/50 border-green-700 text-green-300")}`
                : message.type === 'error'
                ? `${themeClass("bg-red-100/80 border-red-200 text-red-800", "bg-red-900/50 border-red-700 text-red-300")}`
                : `${themeClass("bg-yellow-100/80 border-yellow-200 text-yellow-800", "bg-yellow-900/50 border-yellow-700 text-yellow-300")}`
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-3 text-sm font-medium">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'success' 
                    ? `${themeClass("bg-green-200 text-green-600", "bg-green-800 text-green-300")}`
                    : message.type === 'error'
                    ? `${themeClass("bg-red-200 text-red-600", "bg-red-800 text-red-300")}`
                    : `${themeClass("bg-yellow-200 text-yellow-600", "bg-yellow-800 text-yellow-300")}`
                }`}>
                  {message.type === 'success' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : message.type === 'error' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
          {/* Username Field */}
          <div className="space-y-3">
            <label className={`block ${textPrimary} text-sm font-semibold`}>Username</label>
            <div className="relative group">
              <input
                type="text"
                value={form.username}
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                  clearMessage();
                }}
                className={`w-full px-4 py-4 border ${borderColor} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} ${textPrimary} ${placeholderColor} transition-all duration-300 group-hover:shadow-lg outline-none`}
                placeholder="Enter your username"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-3">
            <label className={`block ${textPrimary} text-sm font-semibold`}>Password</label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  clearMessage();
                }}
                className={`w-full px-4 py-4 pr-12 border ${borderColor} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} ${textPrimary} ${placeholderColor} transition-all duration-300 group-hover:shadow-lg outline-none`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg ${themeClass("text-gray-500 hover:bg-gray-100", "text-gray-400 hover:bg-gray-600")} transition-colors duration-200 outline-none`}
                tabIndex={-1}
              >
                {showPassword ? (
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
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Forgot Links */}
          <div className="flex justify-between text-sm">
            <button
              onClick={openResetModal}
              className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:transform hover:scale-105"
            >
              Forgot Password?
            </button>
            <button
              onClick={openForgotUsernameModal}
              className="text-purple-600 hover:text-purple-700 font-medium transition-all duration-200 hover:transform hover:scale-105"
            >
              Forgot Username?
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-[1.02] disabled:transform-none shadow-lg disabled:shadow-none group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Signing In...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Login
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>

          {/* Register Link */}
          <p className={`text-center ${textSecondary} text-sm`}>
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-700 font-semibold transition-all duration-200 hover:transform hover:scale-105 inline-flex items-center gap-1"
            >
              Create Account
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </p>
        </div>

        {/* Password Reset Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className={`relative ${cardBg} rounded-3xl p-6 w-full max-w-md border ${borderColor} shadow-2xl backdrop-blur-sm`} onKeyPress={handleResetKeyPress}>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>

              <div className="text-center mb-4">
                <div className={`w-16 h-16 ${themeClass("bg-blue-100", "bg-blue-900/50")} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <h3 className={`text-2xl font-bold ${textPrimary} mb-2`}>Reset Password</h3>
                <p className={`${textSecondary} text-sm`}>
                  Enter your username to reset your password.
                </p>
              </div>

              {!retrievedCredentials ? (
                <>
                  <div className="space-y-3">
                    <label className={`block ${textPrimary} text-sm font-semibold`}>Username</label>
                    <input
                      type="text"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className={`w-full px-4 py-3 border ${borderColor} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} ${textPrimary} ${placeholderColor} transition-all duration-200`}
                      placeholder="Enter your username"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={closeModals}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-200 hover:transform hover:scale-[1.02] shadow-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordReset}
                      disabled={resetLoading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-200 hover:transform hover:scale-[1.02] disabled:transform-none shadow-lg disabled:shadow-none"
                    >
                      {resetLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Resetting...
                        </span>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${themeClass("bg-green-100 border-green-200", "bg-green-900/50 border-green-700")} border`}>
                    <h4 className={`font-semibold ${themeClass("text-green-800", "text-green-300")} mb-2`}>Password Reset Successful</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`${themeClass("text-green-700", "text-green-400")} font-medium`}>Username:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{retrievedCredentials.username}</span>
                          <button
                            onClick={() => copyToClipboard(retrievedCredentials.username)}
                            className={`p-1 rounded ${themeClass("text-green-600 hover:bg-green-200", "text-green-400 hover:bg-green-800")} transition-colors duration-200`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${themeClass("text-green-700", "text-green-400")} font-medium`}>Temporary Password:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{retrievedCredentials.temporaryPassword}</span>
                          <button
                            onClick={() => copyToClipboard(retrievedCredentials.temporaryPassword)}
                            className={`p-1 rounded ${themeClass("text-green-600 hover:bg-green-200", "text-green-400 hover:bg-green-800")} transition-colors duration-200`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModals}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:transform hover:scale-[1.02] shadow-lg"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Forgot Username Modal */}
        {showForgotUsernameModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className={`relative ${cardBg} rounded-3xl p-6 w-full max-w-md border ${borderColor} shadow-2xl backdrop-blur-sm`} onKeyPress={handleForgotUsernameKeyPress}>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>

              <div className="text-center mb-4">
                <div className={`w-16 h-16 ${themeClass("bg-purple-100", "bg-purple-900/50")} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className={`text-2xl font-bold ${textPrimary} mb-2`}>Forgot Username</h3>
                <p className={`${textSecondary} text-sm`}>
                  Enter your full name to retrieve your username.
                </p>
              </div>

              {!retrievedCredentials ? (
                <>
                  <div className="space-y-3">
                    <label className={`block ${textPrimary} text-sm font-semibold`}>Full Name</label>
                    <input
                      type="text"
                      value={forgotUsernameData.fullName}
                      onChange={(e) => setForgotUsernameData({ fullName: e.target.value })}
                      className={`w-full px-4 py-3 border ${borderColor} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${inputBg} ${textPrimary} ${placeholderColor} transition-all duration-200`}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={closeModals}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-200 hover:transform hover:scale-[1.02] shadow-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleForgotUsername}
                      disabled={forgotUsernameLoading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-200 hover:transform hover:scale-[1.02] disabled:transform-none shadow-lg disabled:shadow-none"
                    >
                      {forgotUsernameLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Searching...
                        </span>
                      ) : (
                        "Retrieve Username"
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${themeClass("bg-green-100 border-green-200", "bg-green-900/50 border-green-700")} border`}>
                    <h4 className={`font-semibold ${themeClass("text-green-800", "text-green-300")} mb-2`}>Credentials Retrieved</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`${themeClass("text-green-700", "text-green-400")} font-medium`}>Username:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{retrievedCredentials.username}</span>
                          <button
                            onClick={() => copyToClipboard(retrievedCredentials.username)}
                            className={`p-1 rounded ${themeClass("text-green-600 hover:bg-green-200", "text-green-400 hover:bg-green-800")} transition-colors duration-200`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${themeClass("text-green-700", "text-green-400")} font-medium`}>Temporary Password:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{retrievedCredentials.temporaryPassword}</span>
                          <button
                            onClick={() => copyToClipboard(retrievedCredentials.temporaryPassword)}
                            className={`p-1 rounded ${themeClass("text-green-600 hover:bg-green-200", "text-green-400 hover:bg-green-800")} transition-colors duration-200`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModals}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-200 hover:transform hover:scale-[1.02] shadow-lg"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
