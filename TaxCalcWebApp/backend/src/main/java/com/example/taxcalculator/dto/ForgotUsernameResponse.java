package com.example.taxcalculator.dto;

public class ForgotUsernameResponse {
    private String username;
    private String temporaryPassword;
    
    public ForgotUsernameResponse() {}
    
    public ForgotUsernameResponse(String username, String temporaryPassword) {
        this.username = username;
        this.temporaryPassword = temporaryPassword;
    }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getTemporaryPassword() { return temporaryPassword; }
    public void setTemporaryPassword(String temporaryPassword) { this.temporaryPassword = temporaryPassword; }
}
