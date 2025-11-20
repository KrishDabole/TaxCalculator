package com.example.taxcalculator.controller;

import com.example.taxcalculator.model.User;
import com.example.taxcalculator.repository.UserRepository;
import com.example.taxcalculator.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            // Check if username already exists
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists");
            }

            // Validate input
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Username is required");
            }

            if (user.getPassword() == null || user.getPassword().length() < 6) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Password must be at least 6 characters");
            }

            user.setPassword(encoder.encode(user.getPassword()));
            user.setRequiresPasswordChange(false); // Default to false for new signups
            User savedUser = userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("user", Map.of(
                "username", savedUser.getUsername(),
                "fullName", savedUser.getFullName()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        try {
            String username = creds.get("username");
            String password = creds.get("password");

            // Validate input
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Username is required");
            }

            if (password == null || password.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Password is required");
            }

            Optional<User> userOptional = userRepository.findByUsername(username);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
            }

            User user = userOptional.get();

            if (encoder.matches(password, user.getPassword())) {
                String token = jwtUtil.generateToken(user.getUsername());
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("username", user.getUsername());
                response.put("fullName", user.getFullName());
                response.put("requiresPasswordChange", user.getRequiresPasswordChange());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");

            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Username is required");
            }

            Optional<User> userOptional = userRepository.findByUsername(username);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found. Please check your username or use 'Forgot Username'.");
            }

            User user = userOptional.get();

            // Generate a temporary password (first 8 characters of UUID)
            String temporaryPassword = UUID.randomUUID().toString().substring(0, 8);
            user.setPassword(encoder.encode(temporaryPassword));
            user.setRequiresPasswordChange(true); // Set flag for password change
            userRepository.save(user);

            // In a real application, you would send an email here
            // For now, we'll return the temporary password (this is for demo only)
            return ResponseEntity.ok("Password reset successful! Your temporary password is: " + temporaryPassword + " - Please change it after login.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Password reset failed: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, 
                                          @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            String username;
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            // Get username from JWT token if available, otherwise from request
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                username = jwtUtil.extractUsername(token);
            } else {
                username = request.get("username");
            }

            // Validate input
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Username is required");
            }

            if (newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("New password must be at least 6 characters");
            }

            Optional<User> userOptional = userRepository.findByUsername(username);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
            }

            User user = userOptional.get();

            // If user has requiresPasswordChange true, skip current password check
            if (!user.getRequiresPasswordChange()) {
                if (currentPassword == null || currentPassword.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Current password is required");
                }
                
                // Verify current password
                if (!encoder.matches(currentPassword, user.getPassword())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Current password is incorrect");
                }
            }

            // Check if new password is same as current/temporary password
            if (encoder.matches(newPassword, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("New password must be different from current password");
            }

            // Update to new password
            user.setPassword(encoder.encode(newPassword));
            user.setRequiresPasswordChange(false); // Reset the flag
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password changed successfully!");
            response.put("requiresPasswordChange", false);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Password change failed: " + e.getMessage());
        }
    }

    // NEW: Forgot username endpoint
    @PostMapping("/forgot-username")
    public ResponseEntity<?> forgotUsername(@RequestBody Map<String, String> request) {
        try {
            String fullName = request.get("fullName");

            if (fullName == null || fullName.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Full name is required");
            }

            Optional<User> userOptional = userRepository.findByFullNameContainingIgnoreCase(fullName.trim());

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No user found with this full name");
            }

            User user = userOptional.get();

            // Generate temporary password
            String temporaryPassword = UUID.randomUUID().toString().substring(0, 8);
            
            // Update user with temporary password and flag for password change
            user.setPassword(encoder.encode(temporaryPassword));
            user.setRequiresPasswordChange(true);
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("temporaryPassword", temporaryPassword);
            response.put("message", "Username retrieved successfully. Please use the temporary password to login and change your password.");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to retrieve username: " + e.getMessage());
        }
    }
}
