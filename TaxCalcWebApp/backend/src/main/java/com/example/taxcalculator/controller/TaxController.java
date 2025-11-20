package com.example.taxcalculator.controller;

import org.springframework.web.bind.annotation.*;
import com.example.taxcalculator.dto.TaxRequest;
import com.example.taxcalculator.dto.TaxResponse;
import com.example.taxcalculator.service.TaxService;
import com.example.taxcalculator.model.TaxCalculation;
import com.example.taxcalculator.repository.TaxCalculationRepository;
import com.example.taxcalculator.repository.UserRepository;
import com.example.taxcalculator.security.JwtUtil;
import com.example.taxcalculator.model.User;

import java.util.Optional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;

@RestController
@RequestMapping("/api/tax")
public class TaxController {
    private final TaxService taxService;
    private final TaxCalculationRepository taxCalculationRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public TaxController(TaxService taxService, 
                        TaxCalculationRepository taxCalculationRepository,
                        UserRepository userRepository,
                        JwtUtil jwtUtil) {
        this.taxService = taxService;
        this.taxCalculationRepository = taxCalculationRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/calculate")
    public TaxResponse calculate(@RequestBody TaxRequest request,
                                @RequestHeader(value = "Authorization", required = false) String authHeader) {
        // Calculate tax first
        TaxResponse response = taxService.calculateTax(request);
        
        // Save to history if user is authenticated
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            saveTaxCalculationHistory(request, response, authHeader);
        }
        
        return response;
    }

    private void saveTaxCalculationHistory(TaxRequest request, TaxResponse response, String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isPresent()) {
                TaxCalculation history = new TaxCalculation();
                history.setUser(userOpt.get());
                
                // Convert double to BigDecimal for entity fields
                history.setTotalPackage(BigDecimal.valueOf(request.getTotalPackage()));
                
                // Handle null values with proper conversion
                history.setVariablePay(request.getVariablePay() != 0.0 
                    ? BigDecimal.valueOf(request.getVariablePay()) 
                    : BigDecimal.ZERO);
                
                history.setNpsContribution(request.getNpsContribution() != 0.0 
                    ? BigDecimal.valueOf(request.getNpsContribution()) 
                    : BigDecimal.ZERO);
                
                history.setRegime(request.getRegime());
                history.setFinancialYear(request.getFinancialYear());
                
                // Convert response doubles to BigDecimal
                history.setTaxableIncome(BigDecimal.valueOf(response.getTaxableIncome()));
                history.setTaxBeforeCess(BigDecimal.valueOf(response.getTaxBeforeCess()));
                history.setRebate(BigDecimal.valueOf(response.getRebate()));
                history.setCess(BigDecimal.valueOf(response.getCess()));
                history.setTotalTax(BigDecimal.valueOf(response.getTotalTax()));
                history.setMonthlyTax(BigDecimal.valueOf(response.getMonthlyTax()));
                history.setTakeHomeSalary(BigDecimal.valueOf(response.getTakeHomeSalary()));
                history.setMonthlyTakeHome(BigDecimal.valueOf(response.getMonthlyTakeHome()));
                
                // Ensure IST timestamp
                history.setCalculatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
                
                taxCalculationRepository.save(history);
            }
        } catch (Exception e) {
            // Log error but don't break the tax calculation
            System.err.println("Failed to save tax history: " + e.getMessage());
        }
    }
}
