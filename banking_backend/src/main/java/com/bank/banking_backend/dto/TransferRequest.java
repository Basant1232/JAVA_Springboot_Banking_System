package com.bank.banking_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferRequest {

    @NotNull(message = "Sender account ID is required")
    private Long fromAccountId;

    @NotNull(message = "Receiver account ID is required")
    private Long toAccountId;

    @NotNull(message = "Transfer Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private String remarks;
}
