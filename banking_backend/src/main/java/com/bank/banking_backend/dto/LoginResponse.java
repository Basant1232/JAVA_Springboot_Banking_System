package com.bank.banking_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private Long userId;
    private String userName;
    private String role;
    private boolean enabled;
    private Long customerId;
    private String token;
}
