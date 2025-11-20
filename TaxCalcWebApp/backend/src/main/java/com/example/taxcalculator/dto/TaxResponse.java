package com.example.taxcalculator.dto;

public class TaxResponse {
    private double taxableIncome;
    private double taxBeforeCess;
    private double rebate;
    private double cess;
    private double totalTax;
    private double monthlyTax;
    private double takeHomeSalary;
    private double monthlyTakeHome;
    
    public double getTaxableIncome() { return taxableIncome; }
    public void setTaxableIncome(double taxableIncome) { this.taxableIncome = taxableIncome; }
    
    public double getTaxBeforeCess() { return taxBeforeCess; }
    public void setTaxBeforeCess(double taxBeforeCess) { this.taxBeforeCess = taxBeforeCess; }
    
    public double getRebate() { return rebate; }
    public void setRebate(double rebate) { this.rebate = rebate; }
    
    public double getCess() { return cess; }
    public void setCess(double cess) { this.cess = cess; }
    
    public double getTotalTax() { return totalTax; }
    public void setTotalTax(double totalTax) { this.totalTax = totalTax; }
    
    public double getMonthlyTax() { return monthlyTax; }
    public void setMonthlyTax(double monthlyTax) { this.monthlyTax = monthlyTax; }
    
    public double getTakeHomeSalary() { return takeHomeSalary; }
    public void setTakeHomeSalary(double takeHomeSalary) { this.takeHomeSalary = takeHomeSalary; }
    
    public double getMonthlyTakeHome() { return monthlyTakeHome; }
    public void setMonthlyTakeHome(double monthlyTakeHome) { this.monthlyTakeHome = monthlyTakeHome; }
}
