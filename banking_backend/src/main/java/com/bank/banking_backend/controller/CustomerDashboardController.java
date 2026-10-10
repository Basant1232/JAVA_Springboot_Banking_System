package com.bank.banking_backend.controller;

import com.bank.banking_backend.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
public class CustomerDashboardController {

    private final JwtService jwtService;

    public CustomerDashboardController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {

        return ResponseEntity.ok(
                "Customer logged in as: "
                        + authentication.getName()
        );
    }
}
