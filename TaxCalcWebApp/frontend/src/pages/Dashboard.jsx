import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import API from "../api";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  // Helper function to conditionally apply classes
  const themeClass = (lightClass, darkClass) => 
    isDarkMode ? darkClass : lightClass;

  const textPrimary = themeClass("text-text-dark", "text-white");
  const textSecondary = themeClass("text-text-light", "text-gray-300");
  const borderColor = themeClass("border-border-color", "border-gray-700");
  const cardBg = themeClass("glass", "bg-gray-800/80");
  const historyCardBg = themeClass("bg-white", "bg-gray-700");

  // Fetch calculation history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await API.get("/api/tax/history");
        setCalculationHistory(response.data.slice(0, 5)); // Last 5 calculations
        setHistoryError("");
      } catch (error) {
        console.error("Failed to fetch history:", error);
        setHistoryError("Unable to load calculation history");
        // Set mock data for demonstration if API fails
        setCalculationHistory([
          {
            id: 1,
            regime: "OLD",
            financialYear: "2025-2026",
            totalPackage: 1500000,
            taxableIncome: 1200000,
            totalTax: 150000,
            takeHomeSalary: 1350000,
            monthlyTakeHome: 112500,
            calculatedAt: new Date().toISOString()
          },
          {
            id: 2,
            regime: "NEW",
            financialYear: "2024-2025",
            totalPackage: 1200000,
            taxableIncome: 950000,
            totalTax: 80000,
            takeHomeSalary: 1120000,
            monthlyTakeHome: 93333,
            calculatedAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      
      // Convert to IST (UTC+5:30)
      const options = {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      
      return date.toLocaleString('en-IN', options);
    } catch (error) {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  return (
    <div className={`min-h-screen app-background p-4 md:p-8 lg:p-10 max-w-10xl mx-auto ${themeClass("", "bg-gray-900")}`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${themeClass("bg-blue-200/20", "bg-blue-500/10")} blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full ${themeClass("bg-purple-200/20", "bg-purple-500/10")} blur-3xl animate-pulse delay-1000`}></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${textPrimary} bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            Welcome, {user?.fullName || user?.username}! 👋
          </h1>
          <p className={`text-xl ${textSecondary}`}>
            Manage your taxes, security, and account settings all in one place.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tax Calculator Card */}
          <div className={`${cardBg} rounded-3xl p-6 border ${borderColor} hover:shadow-2xl transition-all duration-300 group backdrop-blur-sm`}>
            <div className="flex items-start justify-between mb-4">
              <h3 className={`text-2xl font-semibold ${textPrimary} transition-colors duration-300`}>
                Tax Calculator
              </h3>
              <div className={`w-12 h-12 ${themeClass("bg-blue-100", "bg-blue-900/50")} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <p className={`${textSecondary} mb-6 text-lg leading-relaxed transition-colors duration-300`}>
              Estimate your income tax liability under both old and new tax regimes for FY 2024-2025 and 2025-2026.
            </p>
            <Link
              to="/tax"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-2xl text-center transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
            >
              Calculate Tax
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Security Card */}
          <div className={`${cardBg} rounded-3xl p-6 border ${borderColor} hover:shadow-2xl transition-all duration-300 group backdrop-blur-sm`}>
            <div className="flex items-start justify-between mb-4">
              <h3 className={`text-2xl font-semibold ${textPrimary} transition-colors duration-300`}>
                Account Security
              </h3>
              <div className={`w-12 h-12 ${themeClass("bg-green-100", "bg-green-900/50")} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <span className="text-2xl">🔒</span>
              </div>
            </div>
            <p className={`${textSecondary} mb-6 text-lg leading-relaxed transition-colors duration-300`}>
              Keep your account secure by regularly updating your password and checking your account activity.
            </p>
            <Link
              to="/change-password"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-2xl text-center transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
            >
              Change Password
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* User Info Card */}
        <div className={`${cardBg} rounded-3xl p-6 border ${borderColor} hover:shadow-2xl transition-all duration-300 mb-8 backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-semibold ${textPrimary} transition-colors duration-300`}>
              Account Overview
            </h3>
            <div className={`w-14 h-14 ${themeClass("bg-purple-100", "bg-purple-900/50")} rounded-2xl flex items-center justify-center shadow-lg`}>
              <span className="text-2xl">👔</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${themeClass("bg-gray-100", "bg-gray-700")} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className={`text-lg ${themeClass("text-gray-600", "text-gray-300")}`}>👤</span>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} transition-colors duration-300`}>Username</p>
                  <p className={`font-semibold text-lg ${textPrimary} transition-colors duration-300`}>
                    {user?.username}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${themeClass("bg-gray-100", "bg-gray-700")} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className={`text-lg ${themeClass("text-gray-600", "text-gray-300")}`}>📝</span>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} transition-colors duration-300`}>Full Name</p>
                  <p className={`font-semibold text-lg ${textPrimary} transition-colors duration-300`}>
                    {user?.fullName || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${themeClass("bg-gray-100", "bg-gray-700")} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className={`text-lg ${themeClass("text-gray-600", "text-gray-300")}`}>🟢</span>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} transition-colors duration-300`}>Status</p>
                  <p className={`font-semibold text-lg ${themeClass("text-green-600", "text-green-400")} transition-colors duration-300`}>
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation History Section */}
        <div className={`${cardBg} rounded-3xl p-6 border ${borderColor} hover:shadow-2xl transition-all duration-300 backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-semibold ${textPrimary} transition-colors duration-300`}>
              Recent Calculations
            </h3>
            <div className={`w-14 h-14 ${themeClass("bg-orange-100", "bg-orange-900/50")} rounded-2xl flex items-center justify-center shadow-lg`}>
              <span className="text-2xl">📊</span>
            </div>
          </div>

          {historyError && (
            <div className={`p-4 mb-4 rounded-xl ${themeClass("bg-yellow-100 border-yellow-200 text-yellow-800", "bg-yellow-900/50 border-yellow-700 text-yellow-300")} border`}>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{historyError}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : calculationHistory.length > 0 ? (
            <div className="space-y-4">
              {calculationHistory.map((calculation, index) => (
                <div
                  key={calculation.id || index}
                  className={`${historyCardBg} rounded-2xl p-4 border ${borderColor} hover:shadow-lg transition-all duration-300 group`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className={`font-semibold text-lg ${textPrimary} mb-1`}>
                        {calculation.regime} Regime - {calculation.financialYear}
                      </h4>
                      <p className={`text-sm ${textSecondary}`}>
                        {formatDate(calculation.calculatedAt)}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${themeClass("bg-blue-100 text-blue-800", "bg-blue-900/50 text-blue-300")} text-sm font-medium`}>
                      {formatCurrency(calculation.totalPackage)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className={textSecondary}>Taxable Income</p>
                      <p className={`font-semibold ${textPrimary}`}>
                        {formatCurrency(calculation.taxableIncome)}
                      </p>
                    </div>
                    <div>
                      <p className={textSecondary}>Total Tax</p>
                      <p className={`font-semibold ${themeClass("text-red-600", "text-red-400")}`}>
                        {formatCurrency(calculation.totalTax)}
                      </p>
                    </div>
                    <div>
                      <p className={textSecondary}>Take Home</p>
                      <p className={`font-semibold ${themeClass("text-green-600", "text-green-400")}`}>
                        {formatCurrency(calculation.takeHomeSalary)}
                      </p>
                    </div>
                    <div>
                      <p className={textSecondary}>Monthly</p>
                      <p className={`font-semibold ${textPrimary}`}>
                        {formatCurrency(calculation.monthlyTakeHome)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className={`w-20 h-20 ${themeClass("bg-gray-100", "bg-gray-700")} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <span className="text-3xl">📝</span>
              </div>
              <h4 className={`text-xl font-semibold ${textPrimary} mb-2`}>No calculations yet</h4>
              <p className={textSecondary}>
                Start by using our tax calculator to see your history here.
              </p>
              <Link
                to="/tax"
                className="inline-flex items-center mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:transform hover:scale-105 shadow-lg"
              >
                Calculate Your First Tax
              </Link>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className={`${cardBg} rounded-2xl p-6 border ${borderColor} text-center hover:shadow-lg transition-all duration-300 backdrop-blur-sm`}>
            <div className={`text-3xl font-bold ${themeClass("text-blue-600", "text-blue-400")} mb-2`}>
              {calculationHistory.length}
            </div>
            <div className={`text-sm ${textSecondary} font-medium`}>Total Calculations</div>
          </div>
          <div className={`${cardBg} rounded-2xl p-6 border ${borderColor} text-center hover:shadow-lg transition-all duration-300 backdrop-blur-sm`}>
            <div className={`text-3xl font-bold ${themeClass("text-green-600", "text-green-400")} mb-2`}>1</div>
            <div className={`text-sm ${textSecondary} font-medium`}>Active Session</div>
          </div>
          <div className={`${cardBg} rounded-2xl p-6 border ${borderColor} text-center hover:shadow-lg transition-all duration-300 backdrop-blur-sm`}>
            <div className={`text-3xl font-bold ${themeClass("text-purple-600", "text-purple-400")} mb-2`}>
              {user?.fullName ? "100%" : "75%"}
            </div>
            <div className={`text-sm ${textSecondary} font-medium`}>Profile Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
}
