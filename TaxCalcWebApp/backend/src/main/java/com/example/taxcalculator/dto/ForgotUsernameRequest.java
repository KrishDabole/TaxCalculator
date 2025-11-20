package com.example.taxcalculator.dto;

public class ForgotUsernameRequest {
    private String fullName;
    
    public ForgotUsernameRequest() {}
    
    public ForgotUsernameRequest(String fullName) {
        this.fullName = fullName;
    }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}
