package com.example.taxcalculator.repository;

import com.example.taxcalculator.model.TaxCalculation;
import com.example.taxcalculator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaxCalculationRepository extends JpaRepository<TaxCalculation, Long> {
    List<TaxCalculation> findByUserOrderByCalculatedAtDesc(User user);
    List<TaxCalculation> findTop5ByUserOrderByCalculatedAtDesc(User user);
}
