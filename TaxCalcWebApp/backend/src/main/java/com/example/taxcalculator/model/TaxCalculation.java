package com.example.taxcalculator.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "tax_calculations")
public class TaxCalculation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "total_package", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalPackage;
    
    @Column(name = "variable_pay", precision = 12, scale = 2)
    private BigDecimal variablePay = BigDecimal.ZERO;
    
    @Column(name = "nps_contribution", precision = 12, scale = 2)
    private BigDecimal npsContribution = BigDecimal.ZERO;
    
    @Column(nullable = false, length = 10)
    private String regime;
    
    @Column(name = "financial_year", nullable = false, length = 10)
    private String financialYear;
    
    @Column(name = "taxable_income", precision = 12, scale = 2)
    private BigDecimal taxableIncome;
    
    @Column(name = "tax_before_cess", precision = 12, scale = 2)
    private BigDecimal taxBeforeCess;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal rebate = BigDecimal.ZERO;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal cess;
    
    @Column(name = "total_tax", precision = 12, scale = 2)
    private BigDecimal totalTax;
    
    @Column(name = "monthly_tax", precision = 12, scale = 2)
    private BigDecimal monthlyTax;
    
    @Column(name = "take_home_salary", precision = 12, scale = 2)
    private BigDecimal takeHomeSalary;
    
    @Column(name = "monthly_take_home", precision = 12, scale = 2)
    private BigDecimal monthlyTakeHome;
    
    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt;
    
    // Constructors
    public TaxCalculation() {
        this.calculatedAt = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
    }
    
    public TaxCalculation(User user, BigDecimal totalPackage, String regime, String financialYear) {
        this.user = user;
        this.totalPackage = totalPackage;
        this.regime = regime;
        this.financialYear = financialYear;
        this.calculatedAt = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
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
