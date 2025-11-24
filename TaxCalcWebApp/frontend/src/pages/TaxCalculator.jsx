import { useState, useContext } from "react";
import API from "../api";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

export default function TaxCalculator() {
  const [form, setForm] = useState({
    totalPackage: "1339280",
    variablePay: "0",
    npsContribution: "0",
    regime: "OLD",
    financialYear: "2025-2026"
  });
  
  const [taxResult, setTaxResult] = useState(null);
  const [salaryBreakdown, setSalaryBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const { isDarkMode } = useTheme();
  const { user } = useContext(AuthContext);

  // Helper function for conditional classes
  const themeClass = (lightClass, darkClass) => 
    isDarkMode ? darkClass : lightClass;

  const textPrimary = themeClass("text-text-dark", "text-white");
  const textSecondary = themeClass("text-text-light", "text-gray-300");
  const borderColor = themeClass("border-border-color", "border-gray-600");
  const inputBg = themeClass("bg-white", "bg-gray-700");
  const cardBg = themeClass("glass", "bg-gray-800/80");
  const placeholderColor = themeClass("placeholder-text-light", "placeholder-gray-400");

  const calculateTax = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      const requestData = {
        totalPackage: parseFloat(form.totalPackage) || 0,
        variablePay: parseFloat(form.variablePay) || 0,
        npsContribution: parseFloat(form.npsContribution) || 0,
        regime: form.regime,
        financialYear: form.financialYear
      };
      
      const res = await API.post("/api/tax/calculate", requestData);
      setTaxResult(res.data);
      calculateSalaryBreakdown(requestData, res.data);
      
    } catch (error) {
      setMessage({
        text: "Calculation failed: " + (error.response?.data || error.message),
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSalaryBreakdown = (requestData, taxData) => {
    // CORRECTED: Calculate total CTC (Total Package - Variable Pay) - matches backend
    const totalCTC = requestData.totalPackage - requestData.variablePay;
    
    // CORRECTED: Use totalCTC for calculations - matches backend
    const basicSalary = totalCTC * 0.4;
    const hra = totalCTC * 0.2;
    const pf = basicSalary * 0.12;
    
    // CORRECTED: SPL Allowance calculation - matches backend
    const splAllowance = totalCTC - basicSalary - hra - requestData.npsContribution - pf;
    
    // CORRECTED: Gross Salary includes nps but NOT variablePay - matches backend
    const grossSalary = basicSalary + hra + splAllowance + requestData.npsContribution;
    
    const professionalTax = 2400;
    
    setSalaryBreakdown({
      basicSalary,
      hra,
      splAllowance,
      pf,
      grossSalary,
      professionalTax,
      netTaxableIncome: taxData.taxableIncome,
      standardDeduction: requestData.regime === "NEW" ? 75000 : 50000, // CORRECTED: Simplified
      variablePay: requestData.variablePay,
      npsContribution: requestData.npsContribution,
      totalCTC // ADDED: For display purposes
    });
  };

  const downloadCSV = () => {
    if (!taxResult || !salaryBreakdown) return;
    
    const csv = `Parameter,Yearly,Monthly
Total Package,${form.totalPackage},${(form.totalPackage/12).toFixed(2)}
Basic Salary,${salaryBreakdown.basicSalary.toFixed(2)},${(salaryBreakdown.basicSalary/12).toFixed(2)}
HRA,${salaryBreakdown.hra.toFixed(2)},${(salaryBreakdown.hra/12).toFixed(2)}
SPL Allowance,${salaryBreakdown.splAllowance.toFixed(2)},${(salaryBreakdown.splAllowance/12).toFixed(2)}
Variable Pay,${salaryBreakdown.variablePay},${(salaryBreakdown.variablePay/12).toFixed(2)}
Provident Fund,${salaryBreakdown.pf.toFixed(2)},${(salaryBreakdown.pf/12).toFixed(2)}
Gross Salary,${salaryBreakdown.grossSalary.toFixed(2)},${(salaryBreakdown.grossSalary/12).toFixed(2)}
Standard Deduction,${salaryBreakdown.standardDeduction},N/A
Professional Tax,${salaryBreakdown.professionalTax},N/A
NPS Contribution,${salaryBreakdown.npsContribution},N/A
Net Taxable Income,${salaryBreakdown.netTaxableIncome.toFixed(2)},N/A
Tax Before Cess,${taxResult.taxBeforeCess.toFixed(2)},N/A
Rebate (U/s 87A),${taxResult.rebate || 0},N/A
Cess @4%,${taxResult.cess.toFixed(2)},N/A
Total Tax,${taxResult.totalTax.toFixed(2)},${taxResult.monthlyTax.toFixed(2)}
Monthly Take Home,${taxResult.monthlyTakeHome.toFixed(2)},N/A
Yearly Take Home,${taxResult.takeHomeSalary.toFixed(2)},N/A`;
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tax_calculation_report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setForm({
      totalPackage: "1339280",
      variablePay: "0",
      npsContribution: "0",
      regime: "OLD",
      financialYear: "2025-2026"
    });
    setTaxResult(null);
    setSalaryBreakdown(null);
    setMessage({ text: "", type: "" });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const clearMessage = () => {
    setMessage({ text: "", type: "" });
  };

  return (
    <div className={`min-h-screen app-background p-6 ${themeClass("", "bg-gray-900")}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${themeClass("bg-blue-200/20", "bg-blue-500/10")} blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full ${themeClass("bg-green-200/20", "bg-green-500/10")} blur-3xl animate-pulse delay-1000`}></div>
      </div>

      <div className={`max-w-7xl mx-auto mt-6 ${cardBg} rounded-3xl p-8 border ${borderColor} shadow-2xl backdrop-blur-sm relative z-10`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-4xl font-bold ${textPrimary} mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent`}>
            Tax Calculator
          </h2>
          <p className={`text-xl ${textSecondary}`}>
            Calculate your income tax under both old and new regimes
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className={`lg:col-span-1 ${cardBg} p-6 rounded-3xl border ${borderColor} backdrop-blur-sm`}>
            <h3 className={`text-2xl font-semibold mb-6 ${textPrimary} border-b ${borderColor} pb-4`}>Input Details</h3>
            
            <div className="space-y-6">
              {/* Financial Year */}
              <div className="space-y-3">
                <label className={`block font-semibold ${textPrimary}`}>Financial Year</label>
                <select
                  value={form.financialYear}
                  onChange={(e) => setForm({ ...form, financialYear: e.target.value })}
                  className={`w-full px-4 py-4 border ${borderColor} rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} ${textPrimary} transition-all duration-300 outline-none`}
                >
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                </select>
              </div>

              {/* Total Package */}
              <div className="space-y-3">
                <label className={`block font-semibold ${textPrimary}`}>Total Package (Yearly ₹)</label>
                <input
                  type="number"
                  value={form.totalPackage}
                  onChange={(e) => setForm({ ...form, totalPackage: e.target.value })}
                  className={`w-full px-4 py-4 border ${borderColor} rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} ${textPrimary} ${placeholderColor} transition-all duration-300 outline-none`}
                  placeholder="Enter total package"
                />
              </div>

              {/* Variable Pay */}
              <div className="space-y-3">
                <label className={`block font-semibold ${textPrimary}`}>Variable Pay (Yearly ₹)</label>
                <input
                  type="number"
                  value={form.variablePay}
                  onChange={(e) => setForm({ ...form, variablePay: e.target.value })}
                  className={`w-full px-4 py-4 border ${borderColor} rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} ${textPrimary} ${placeholderColor} transition-all duration-300 outline-none`}
                  placeholder="Enter variable pay"
                />
              </div>

              {/* NPS Contribution */}
              <div className="space-y-3">
                <label className={`block font-semibold ${textPrimary}`}>NPS Contribution (Yearly ₹)</label>
                <input
                  type="number"
                  value={form.npsContribution}
                  onChange={(e) => setForm({ ...form, npsContribution: e.target.value })}
                  className={`w-full px-4 py-4 border ${borderColor} rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} ${textPrimary} ${placeholderColor} transition-all duration-300 outline-none`}
                  placeholder="Enter NPS contribution"
                />
              </div>

              {/* Tax Regime */}
              <div className="space-y-3">
                <label className={`block font-semibold ${textPrimary}`}>Tax Regime</label>
                <select
                  value={form.regime}
                  onChange={(e) => setForm({ ...form, regime: e.target.value })}
                  className={`w-full px-4 py-4 border ${borderColor} rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} ${textPrimary} transition-all duration-300 outline-none`}
                >
                  <option value="NEW">New Regime</option>
                  <option value="OLD">Old Regime</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={calculateTax}
                  disabled={loading}
                  className="flex-1 py-4 px-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:transform hover:scale-[1.02] disabled:transform-none shadow-lg disabled:shadow-none group"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Calculating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Calculate Tax
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  )}
                </button>
                
                <button
                  onClick={resetForm}
                  className="px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:transform hover:scale-[1.02] shadow-lg"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {taxResult && salaryBreakdown ? (
              <div className="space-y-6">
                {/* Regime Header */}
                <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-3xl shadow-2xl">
                  <h3 className="text-3xl font-bold text-center mb-2">
                    {form.regime === "NEW" ? "New Regime" : "Old Regime"} - Tax Calculation
                  </h3>
                  <p className="text-center text-blue-100 text-lg">Financial Year: {form.financialYear}</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`${cardBg} rounded-3xl p-6 border ${borderColor} backdrop-blur-sm`}>
                    <h4 className={`font-semibold text-xl mb-4 ${textPrimary} border-b ${borderColor} pb-3`}>TDS Summary</h4>
                    <div className={`space-y-3 text-lg ${textSecondary}`}>
                      <div className="flex justify-between items-center">
                        <span>CTC (Yearly):</span>
                        <span className="font-semibold text-xl">{formatCurrency(salaryBreakdown.totalCTC)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>CTC (Monthly):</span>
                        <span className="font-semibold text-xl">{formatCurrency(salaryBreakdown.totalCTC/12)}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`${cardBg} rounded-3xl p-6 border ${borderColor} backdrop-blur-sm`}>
                    <h4 className={`font-semibold text-xl mb-4 ${textPrimary} border-b ${borderColor} pb-3`}>Take Home Summary</h4>
                    <div className={`space-y-3 text-lg ${textSecondary}`}>
                      <div className="flex justify-between items-center">
                        <span>Monthly Take Home:</span>
                        <span className="font-semibold text-xl text-green-600">{formatCurrency(taxResult.monthlyTakeHome)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Yearly Take Home:</span>
                        <span className="font-semibold text-xl text-green-600">{formatCurrency(taxResult.takeHomeSalary)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Earnings & Deductions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Earnings */}
                  <div className={`${themeClass("bg-green-50", "bg-green-900/20")} ${themeClass("border-green-200", "border-green-800")} p-6 rounded-3xl backdrop-blur-sm`}>
                    <h4 className={`font-semibold text-xl mb-4 ${themeClass("text-green-800", "text-green-300")} border-b ${themeClass("border-green-200", "border-green-700")} pb-3`}>Earnings (Yearly)</h4>
                    <div className={`space-y-4 text-lg ${themeClass("text-green-800", "text-green-300")}`}>
                      {[
                        { label: "Basic Salary", value: salaryBreakdown.basicSalary },
                        { label: "HRA", value: salaryBreakdown.hra },
                        { label: "SPL Allowance", value: salaryBreakdown.splAllowance },
                        { label: "NPS Contribution", value: salaryBreakdown.npsContribution }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{item.label}:</span>
                          <span className="font-semibold">{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center border-t pt-3 mt-2">
                        <span className="font-semibold text-xl">Gross Salary:</span>
                        <span className={`font-semibold text-xl ${themeClass("text-green-700", "text-green-400")}`}>{formatCurrency(salaryBreakdown.grossSalary)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className={`${themeClass("bg-red-50", "bg-red-900/20")} ${themeClass("border-red-200", "border-red-800")} p-6 rounded-3xl backdrop-blur-sm`}>
                    <h4 className={`font-semibold text-xl mb-4 ${themeClass("text-red-800", "text-red-300")} border-b ${themeClass("border-red-200", "border-red-700")} pb-3`}>Deductions (Yearly)</h4>
                    <div className={`space-y-4 text-lg ${themeClass("text-red-800", "text-red-300")}`}>
                      {[
                        { label: "Provident Fund", value: salaryBreakdown.pf },
                        { label: "Professional Tax", value: salaryBreakdown.professionalTax },
                        { label: "NPS Contribution", value: salaryBreakdown.npsContribution },
                        { label: "Standard Deduction", value: salaryBreakdown.standardDeduction }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{item.label}:</span>
                          <span className="font-semibold">{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center border-t pt-3 mt-2">
                        <span className="font-semibold text-xl">Total Deductions:</span>
                        <span className={`font-semibold text-xl ${themeClass("text-red-700", "text-red-400")}`}>
                          {formatCurrency(salaryBreakdown.pf + salaryBreakdown.professionalTax + salaryBreakdown.npsContribution + salaryBreakdown.standardDeduction)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tax Calculation */}
                <div className={`${themeClass("bg-blue-50", "bg-blue-900/20")} ${themeClass("border-blue-200", "border-blue-800")} p-6 rounded-3xl backdrop-blur-sm`}>
                  <h4 className={`font-semibold text-2xl mb-6 ${themeClass("text-blue-800", "text-blue-300")} border-b ${themeClass("border-blue-200", "border-blue-700")} pb-4`}>Tax Calculation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={`space-y-4 text-lg ${textSecondary}`}>
                      {[
                        { label: "Net Taxable Income", value: salaryBreakdown.netTaxableIncome },
                        { label: "Tax Before Cess", value: taxResult.taxBeforeCess },
                        { label: "Rebate (U/s 87A)", value: -(taxResult.rebate || 0), isDiscount: true }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{item.label}:</span>
                          <span className={`font-semibold ${item.isDiscount ? 'text-green-600' : ''}`}>
                            {item.isDiscount && '-'}{formatCurrency(Math.abs(item.value))}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className={`space-y-4 text-lg ${textSecondary}`}>
                      {[
                        { label: "Cess @4%", value: taxResult.cess },
                        { label: "Total Tax", value: taxResult.totalTax, isTotal: true },
                        { label: "Monthly Tax", value: taxResult.monthlyTax, isMonthly: true }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{item.label}:</span>
                          <span className={`font-semibold text-xl ${item.isTotal ? 'text-red-600' : item.isMonthly ? 'text-red-500' : ''}`}>
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Take Home Salary - FINAL CORRECTED SECTION */}
                <div className={`${themeClass("bg-green-50", "bg-green-900/20")} ${themeClass("border-green-200", "border-green-800")} p-6 rounded-3xl backdrop-blur-sm`}>
                  <h4 className={`font-semibold text-2xl mb-6 ${themeClass("text-green-800", "text-green-300")} border-b ${themeClass("border-green-200", "border-green-700")} pb-4`}>Take Home Salary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h5 className={`font-semibold text-xl mb-4 ${themeClass("text-green-700", "text-green-400")}`}>Yearly Breakdown</h5>
                      <div className={`space-y-3 text-lg ${textSecondary}`}>
                        <div className="flex justify-between">
                          <span>Gross Salary:</span>
                          <span>{formatCurrency(salaryBreakdown.grossSalary)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Tax:</span>
                          <span>- {formatCurrency(taxResult.totalTax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Provident Fund:</span>
                          <span>- {formatCurrency(salaryBreakdown.pf)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Professional Tax:</span>
                          <span>- {formatCurrency(salaryBreakdown.professionalTax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>NPS Contribution:</span>
                          <span>- {formatCurrency(salaryBreakdown.npsContribution)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3 font-bold text-xl">
                          <span>Net Take Home:</span>
                          <span className={themeClass("text-green-700", "text-green-400")}>
                            {formatCurrency(taxResult.takeHomeSalary)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className={`font-semibold text-xl mb-4 ${themeClass("text-green-700", "text-green-400")}`}>Monthly Breakdown</h5>
                      <div className={`space-y-3 text-lg ${textSecondary}`}>
                        <div className="flex justify-between">
                          <span>Gross Salary:</span>
                          <span>{formatCurrency(salaryBreakdown.grossSalary/12)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Tax:</span>
                          <span>- {formatCurrency(taxResult.monthlyTax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Provident Fund:</span>
                          <span>- {formatCurrency(salaryBreakdown.pf/12)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Professional Tax:</span>
                          <span>- {formatCurrency(salaryBreakdown.professionalTax/12)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>NPS Contribution:</span>
                          <span>- {formatCurrency(salaryBreakdown.npsContribution/12)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3 font-bold text-xl">
                          <span>Net Take Home:</span>
                          <span className={themeClass("text-green-700", "text-green-400")}>
                            {formatCurrency(taxResult.monthlyTakeHome)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="text-center">
                  <button
                    onClick={downloadCSV}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:transform hover:scale-105 shadow-lg inline-flex items-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Detailed CSV Report
                  </button>
                </div>
              </div>
            ) : (
              <div className={`${cardBg} rounded-3xl p-12 text-center border ${borderColor} backdrop-blur-sm`}>
                <div className={`${textSecondary} mb-6`}>
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-semibold ${textPrimary} mb-4`}>Tax Calculator Ready</h3>
                <p className={`${textSecondary} text-lg`}>Enter your salary details and click "Calculate Tax" to see your detailed breakdown</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
