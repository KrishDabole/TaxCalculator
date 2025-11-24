package com.example.taxcalculator.service;

import org.springframework.stereotype.Service;
import com.example.taxcalculator.dto.TaxRequest;
import com.example.taxcalculator.dto.TaxResponse;

@Service
public class TaxService {
    public TaxResponse calculateTax(TaxRequest request) {
        double totalPackage = request.getTotalPackage();
        double variablePay = request.getVariablePay();
        double nps = request.getNpsContribution();
        String regime = request.getRegime() == null ? "NEW" : request.getRegime().toUpperCase();
        String financialYear = request.getFinancialYear() == null ? "2025-2026" : request.getFinancialYear();

        // Calculate total CTC (Total Package - Variable Pay)
        double totalCTC = totalPackage - variablePay;

        // Salary breakdown (matching Excel formulas exactly)
        double basicSalary = totalCTC * 0.4;
        double hra = totalCTC * 0.2;
        double pf = basicSalary * 0.12;
        double splAllowance = totalCTC - basicSalary - hra - nps - pf;

        // Gross Salary includes nps but NOT variablePay
        double grossSalary = basicSalary + hra + splAllowance + nps;

        // Standard deduction based on regime
        double standardDeduction = regime.equals("NEW") ? 75000 : 50000;
        double professionalTax = 2400;

        // Net taxable income calculation - Professional tax only deducted in Old Regime
        double taxableIncome = grossSalary - standardDeduction - nps;
        if (regime.equals("OLD")) {
            taxableIncome -= professionalTax; // Only deduct professional tax in Old Regime
        }
        if (taxableIncome < 0) taxableIncome = 0;

        // Round up to nearest 10 (matching Excel CEILING function)
        taxableIncome = Math.ceil(taxableIncome / 10) * 10;

        double tax;
        double rebate = 0;

        if (regime.equals("NEW")) {
            tax = calculateNewRegimeTax(taxableIncome, financialYear);
            // Rebate calculation for new regime
            if (financialYear.equals("2025-2026")) {
                rebate = taxableIncome <= 1200000 ? Math.min(60000, tax) : 0;
            } else {
                rebate = taxableIncome <= 700000 ? Math.min(25000, tax) : 0;
            }
        } else {
            tax = calculateOldRegimeTax(taxableIncome);
            rebate = taxableIncome <= 500000 ? Math.min(12500, tax) : 0;
        }

        tax = Math.max(0, tax - rebate);
        double cess = Math.round(tax * 0.04);
        double totalTax = tax + cess;

        // CHANGED: Calculate take home salary (deduct NPS and professional tax)
        double takeHomeSalary = grossSalary - totalTax - nps - pf - professionalTax;
        double monthlyTakeHome = takeHomeSalary / 12;

        TaxResponse response = new TaxResponse();
        response.setTaxableIncome(taxableIncome);
        response.setTaxBeforeCess(tax);
        response.setRebate(rebate);
        response.setCess(cess);
        response.setTotalTax(totalTax);
        response.setMonthlyTax(totalTax / 12);
        response.setTakeHomeSalary(takeHomeSalary);
        response.setMonthlyTakeHome(monthlyTakeHome);
        return response;
    }

    private double calculateNewRegimeTax(double income, String financialYear) {
        if (financialYear.equals("2025-2026")) {
            // New slabs for 2025-2026
            if (income <= 400000) return 0;
            else if (income <= 800000) return (income - 400000) * 0.05;
            else if (income <= 1200000) return 20000 + (income - 800000) * 0.10;
            else if (income <= 1600000) return 60000 + (income - 1200000) * 0.15;
            else if (income <= 2000000) return 120000 + (income - 1600000) * 0.20;
            else if (income <= 2400000) return 200000 + (income - 2000000) * 0.25;
            else return 300000 + (income - 2400000) * 0.30;
        } else {
            // Current new regime slabs
            if (income <= 300000) return 0;
            else if (income <= 700000) return (income - 300000) * 0.05;
            else if (income <= 1000000) return 20000 + (income - 700000) * 0.10;
            else if (income <= 1200000) return 50000 + (income - 1000000) * 0.15;
            else if (income <= 1500000) return 80000 + (income - 1200000) * 0.20;
            else return 140000 + (income - 1500000) * 0.30;
        }
    }

    private double calculateOldRegimeTax(double income) {
        if (income <= 250000) return 0;
        else if (income <= 500000) return (income - 250000) * 0.05;
        else if (income <= 1000000) return 12500 + (income - 500000) * 0.20;
        else return 112500 + (income - 1000000) * 0.30;
    }
}
