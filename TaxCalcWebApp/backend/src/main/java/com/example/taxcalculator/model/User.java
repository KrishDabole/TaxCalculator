package com.example.taxcalculator.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String fullName;
    
    private String username;
    
    private String password;
    
    @Column(name = "requires_password_change")
    private Boolean requiresPasswordChange = false;
    
    // Add relationship with TaxCalculation
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaxCalculation> taxCalculations = new ArrayList<>();
    
    // Constructors
    public User() {}
    
    public User(String username, String password, String fullName) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public Boolean getRequiresPasswordChange() { return requiresPasswordChange; }
    public void setRequiresPasswordChange(Boolean requiresPasswordChange) { 
        this.requiresPasswordChange = requiresPasswordChange; 
    }
    
    public List<TaxCalculation> getTaxCalculations() { return taxCalculations; }
    public void setTaxCalculations(List<TaxCalculation> taxCalculations) { 
        this.taxCalculations = taxCalculations; 
    }
}
