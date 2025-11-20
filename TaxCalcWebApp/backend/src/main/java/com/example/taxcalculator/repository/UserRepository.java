package com.example.taxcalculator.repository;

import com.example.taxcalculator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    
    // Add this method for forgot username feature
    @Query("SELECT u FROM User u WHERE LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))")
    Optional<User> findByFullNameContainingIgnoreCase(@Param("fullName") String fullName);
}
