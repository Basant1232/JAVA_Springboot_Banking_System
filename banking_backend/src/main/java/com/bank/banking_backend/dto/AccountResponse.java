package com.bank.banking_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountResponse {

    private Long accountId;

    private String accountNumber;

    private String accountType;

    private BigDecimal balance;

    private Long customerId;

    private String customerName;
}
