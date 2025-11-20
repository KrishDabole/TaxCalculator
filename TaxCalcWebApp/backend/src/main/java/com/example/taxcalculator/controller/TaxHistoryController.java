package com.example.taxcalculator.controller;

import com.example.taxcalculator.dto.TaxHistoryResponse;
import com.example.taxcalculator.model.TaxCalculation;
import com.example.taxcalculator.model.User;
import com.example.taxcalculator.repository.TaxCalculationRepository;
import com.example.taxcalculator.repository.UserRepository;
import com.example.taxcalculator.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tax")
@CrossOrigin(origins = "*")
public class TaxHistoryController {
    
    @Autowired
    private TaxCalculationRepository taxCalculationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    // Save tax calculation history
    @PostMapping("/history")
    public ResponseEntity<?> saveTaxHistory(@RequestBody TaxCalculation taxCalculation,
                                          @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }
            
            taxCalculation.setUser(userOpt.get());
            TaxCalculation savedCalculation = taxCalculationRepository.save(taxCalculation);
            
            return ResponseEntity.ok(savedCalculation);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to save calculation history: " + e.getMessage());
        }
    }
    
    // Get user's tax calculation history
    @GetMapping("/history")
    public ResponseEntity<?> getTaxHistory(@RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }
            
            List<TaxCalculation> calculations = taxCalculationRepository.findTop5ByUserOrderByCalculatedAtDesc(userOpt.get());
            
            // Convert to response DTO
            List<TaxHistoryResponse> response = calculations.stream().map(this::convertToResponse).collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch calculation history: " + e.getMessage());
        }
    }
    
    private TaxHistoryResponse convertToResponse(TaxCalculation calculation) {
        TaxHistoryResponse response = new TaxHistoryResponse();
        response.setId(calculation.getId());
        response.setTotalPackage(calculation.getTotalPackage());
        response.setVariablePay(calculation.getVariablePay());
        response.setNpsContribution(calculation.getNpsContribution());
        response.setRegime(calculation.getRegime());
        response.setFinancialYear(calculation.getFinancialYear());
        response.setTaxableIncome(calculation.getTaxableIncome());
        response.setTaxBeforeCess(calculation.getTaxBeforeCess());
        response.setRebate(calculation.getRebate());
        response.setCess(calculation.getCess());
        response.setTotalTax(calculation.getTotalTax());
        response.setMonthlyTax(calculation.getMonthlyTax());
        response.setTakeHomeSalary(calculation.getTakeHomeSalary());
        response.setMonthlyTakeHome(calculation.getMonthlyTakeHome());
        response.setCalculatedAt(calculation.getCalculatedAt());
        return response;
    }
}
