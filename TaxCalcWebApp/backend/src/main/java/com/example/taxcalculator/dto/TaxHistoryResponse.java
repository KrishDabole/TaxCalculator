package com.example.taxcalculator.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TaxHistoryResponse {
    private Long id;
    private BigDecimal totalPackage;
    private BigDecimal variablePay;
    private BigDecimal npsContribution;
    private String regime;
    private String financialYear;
    private BigDecimal taxableIncome;
    private BigDecimal taxBeforeCess;
    private BigDecimal rebate;
    private BigDecimal cess;
    private BigDecimal totalTax;
    private BigDecimal monthlyTax;
    private BigDecimal takeHomeSalary;
    private BigDecimal monthlyTakeHome;
    private LocalDateTime calculatedAt;
    
    // Constructors
    public TaxHistoryResponse() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public BigDecimal getTotalPackage() { return totalPackage; }
    public void setTotalPackage(BigDecimal totalPackage) { this.totalPackage = totalPackage; }
    
    public BigDecimal getVariablePay() { return variablePay; }
    public void setVariablePay(BigDecimal variablePay) { this.variablePay = variablePay; }
    
    public BigDecimal getNpsContribution() { return npsContribution; }
    public void setNpsContribution(BigDecimal npsContribution) { this.npsContribution = npsContribution; }
    
    public String getRegime() { return regime; }
    public void setRegime(String regime) { this.regime = regime; }
    
    public String getFinancialYear() { return financialYear; }
    public void setFinancialYear(String financialYear) { this.financialYear = financialYear; }
    
    public BigDecimal getTaxableIncome() { return taxableIncome; }
    public void setTaxableIncome(BigDecimal taxableIncome) { this.taxableIncome = taxableIncome; }
    
    public BigDecimal getTaxBeforeCess() { return taxBeforeCess; }
    public void setTaxBeforeCess(BigDecimal taxBeforeCess) { this.taxBeforeCess = taxBeforeCess; }
    
    public BigDecimal getRebate() { return rebate; }
    public void setRebate(BigDecimal rebate) { this.rebate = rebate; }
    
    public BigDecimal getCess() { return cess; }
    public void setCess(BigDecimal cess) { this.cess = cess; }
    
    public BigDecimal getTotalTax() { return totalTax; }
    public void setTotalTax(BigDecimal totalTax) { this.totalTax = totalTax; }
    
    public BigDecimal getMonthlyTax() { return monthlyTax; }
    public void setMonthlyTax(BigDecimal monthlyTax) { this.monthlyTax = monthlyTax; }
    
    public BigDecimal getTakeHomeSalary() { return takeHomeSalary; }
    public void setTakeHomeSalary(BigDecimal takeHomeSalary) { this.takeHomeSalary = takeHomeSalary; }
    
    public BigDecimal getMonthlyTakeHome() { return monthlyTakeHome; }
    public void setMonthlyTakeHome(BigDecimal monthlyTakeHome) { this.monthlyTakeHome = monthlyTakeHome; }
    
    public LocalDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; }
}
