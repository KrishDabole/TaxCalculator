package com.example.taxcalculator.dto;

public class TaxRequest {
    private double totalPackage;
    private double variablePay;
    private double npsContribution;
    private String regime;
    private String financialYear;
    
    public double getTotalPackage() { return totalPackage; }
    public void setTotalPackage(double totalPackage) { this.totalPackage = totalPackage; }
    public double getVariablePay() { return variablePay; }
    public void setVariablePay(double variablePay) { this.variablePay = variablePay; }
    public double getNpsContribution() { return npsContribution; }
    public void setNpsContribution(double npsContribution) { this.npsContribution = npsContribution; }
    public String getRegime() { return regime; }
    public void setRegime(String regime) { this.regime = regime; }
    public String getFinancialYear() { return financialYear; }
    public void setFinancialYear(String financialYear) { this.financialYear = financialYear; }
}